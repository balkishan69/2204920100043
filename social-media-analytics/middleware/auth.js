const axios = require('axios');
const config = require('../config/config');

// Cache for authentication token
let authToken = null;
let tokenExpiry = 0;

/**
 * Get authentication token from the API
 * @returns {Promise<string>} The authentication token
 */
const getAuthToken = async () => {
  // Check if we have a valid token already
  const currentTime = Math.floor(Date.now() / 1000);
  if (authToken && tokenExpiry > currentTime) {
    return authToken;
  }

  try {
    // Prepare auth data from config
    const authData = {
      email: config.auth.email,
      name: config.auth.name,
      rollNo: config.auth.rollNo,
      accessCode: config.auth.accessCode,
      clientID: config.auth.clientID,
      clientSecret: config.auth.clientSecret
    };

    // Request new token from the auth endpoint
    // Note: The actual auth endpoint URL would need to be confirmed
    const response = await axios.post(`${config.api.baseUrl}/auth`, authData);
    
    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      // If expires_in is in seconds from now
      tokenExpiry = response.data.expires_in;
      return authToken;
    }
    
    throw new Error('Failed to get auth token');
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error('Authentication failed');
  }
};

/**
 * Authentication middleware to attach token to requests
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = await getAuthToken();
    req.authToken = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  authMiddleware,
  getAuthToken
};