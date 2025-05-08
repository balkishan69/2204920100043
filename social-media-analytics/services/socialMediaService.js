const axios = require('axios');
const _ = require('lodash');
const config = require('../config/config');
const { getAuthToken } = require('../middleware/auth');

class SocialMediaService {
  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.cachedData = {
      users: null,
      posts: {},  // Will store posts by user
      comments: {}, // Will store comments by post
      lastFetch: 0
    };
    this.cacheLifetime = 60 * 1000; // 60 seconds cache
  }

  /**
   * Get API headers with authentication
   */
  async getHeaders() {
    const token = await getAuthToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  /**
   * Fetch all users from the API
   */
  async getUsers() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/users`, headers);
      return response.data.users || {};
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Fetch posts for a specific user
   */
  async getUserPosts(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/users/${userId}/posts`, headers);
      return response.data.posts || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch comments for a specific post
   */
  async getPostComments(postId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/posts/${postId}/comments`, headers);
      return response.data.comments || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error.message);
      return [];
    }
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    const now = Date.now();
    return this.cachedData.lastFetch > 0 && 
           (now - this.cachedData.lastFetch) < this.cacheLifetime;
  }

  /**
   * Fetch and cache all data (users, posts, comments)
   * This is an expensive operation but gives us all the data we need
   */
  async fetchAndCacheAllData() {
    if (this.isCacheValid()) {
      return this.cachedData;
    }

    try {
      // 1. Get all users
      const usersData = await this.getUsers();
      this.cachedData.users = usersData;
      
      // 2. Get posts for each user
      for (const userId in usersData) {
        const posts = await this.getUserPosts(userId);
        this.cachedData.posts[userId] = posts;
        
        // 3. Get comments for each post
        for (const post of posts) {
          const comments = await this.getPostComments(post.id);
          this.cachedData.comments[post.id] = comments;
        }
      }
      
      this.cachedData.lastFetch = Date.now();
      return this.cachedData;
    } catch (error) {
      console.error('Error caching data:', error);
      throw new Error('Failed to fetch data');
    }
  }

  /**
   * Get top 5 users with the most commented posts
   */
  async getTopUsers() {
    await this.fetchAndCacheAllData();
    
    // Calculate comment counts per user
    const userCommentCounts = {};
    
    // For each user
    for (const userId in this.cachedData.users) {
      let totalComments = 0;
      
      // Get all posts for this user
      const userPosts = this.cachedData.posts[userId] || [];
      
      // Count comments for each post
      for (const post of userPosts) {
        const postComments = this.cachedData.comments[post.id] || [];
        totalComments += postComments.length;
      }
      
      userCommentCounts[userId] = {
        userId,
        name: this.cachedData.users[userId],
        commentCount: totalComments,
        postCount: userPosts.length
      };
    }
    
    // Sort users by comment count (descending) and take top 5
    const topUsers = _.chain(userCommentCounts)
      .values()
      .orderBy(['commentCount'], ['desc'])
      .take(5)
      .value();
    
    return topUsers;
  }

  /**
   * Get top post(s) with the maximum number of comments
   */
  async getPopularPosts() {
    await this.fetchAndCacheAllData();
    
    // Gather all posts with their comment counts
    const allPosts = [];
    
    for (const userId in this.cachedData.posts) {
      const userPosts = this.cachedData.posts[userId] || [];
      
      for (const post of userPosts) {
        const comments = this.cachedData.comments[post.id] || [];
        allPosts.push({
          ...post,
          userName: this.cachedData.users[post.userid],
          commentCount: comments.length
        });
      }
    }
    
    // Find the maximum comment count
    const maxCommentCount = _.maxBy(allPosts, 'commentCount')?.commentCount || 0;
    
    // Return all posts that have this maximum comment count
    const mostCommentedPosts = allPosts.filter(post => post.commentCount === maxCommentCount);
    
    return mostCommentedPosts;
  }

  /**
   * Get latest 5 posts
   */
  async getLatestPosts() {
    await this.fetchAndCacheAllData();
    
    // Gather all posts
    const allPosts = [];
    
    for (const userId in this.cachedData.posts) {
      const userPosts = this.cachedData.posts[userId] || [];
      
      for (const post of userPosts) {
        allPosts.push({
          ...post,
          userName: this.cachedData.users[post.userid],
          commentCount: (this.cachedData.comments[post.id] || []).length
        });
      }
    }
    
    // For a real application, posts would have timestamps
    // Since our sample data doesn't have timestamps, we'll sort by ID (assuming higher ID = newer)
    const latestPosts = _.chain(allPosts)
      .orderBy(['id'], ['desc'])
      .take(5)
      .value();
    
    return latestPosts;
  }
}

module.exports = new SocialMediaService();