const express = require('express');
const router = express.Router();
const socialMediaService = require('../services/socialMediaService');
const { authMiddleware } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/users/top
 * @desc Get top 5 users with the most commented posts
 * @access Private
 */
router.get('/users/top', async (req, res) => {
  try {
    const topUsers = await socialMediaService.getTopUsers();
    res.json({ topUsers });
  } catch (error) {
    console.error('Error in /users/top:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route GET /api/posts
 * @desc Get posts based on type (popular or latest)
 * @param {string} type - 'popular' or 'latest'
 * @access Private
 */
router.get('/posts', async (req, res) => {
  try {
    const { type = 'popular' } = req.query;
    
    if (type.toLowerCase() === 'popular') {
      const popularPosts = await socialMediaService.getPopularPosts();
      res.json({ popularPosts });
    } else if (type.toLowerCase() === 'latest') {
      const latestPosts = await socialMediaService.getLatestPosts();
      res.json({ latestPosts });
    } else {
      res.status(400).json({ error: 'Invalid type parameter. Use "popular" or "latest".' });
    }
  } catch (error) {
    console.error('Error in /posts:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Private
 */
router.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Service is running' });
});

module.exports = router;