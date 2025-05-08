const express = require('express');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

// Initialize app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Analytics Microservice',
    endpoints: {
      topUsers: '/api/users/top',
      posts: '/api/posts?type=popular|latest',
      health: '/api/health'
    }
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/users/top');
  console.log('- GET /api/posts?type=popular|latest');
  console.log('- GET /api/health');
});