require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 9876,
  windowSize: parseInt(process.env.WINDOW_SIZE) || 10,
  
  // Credentials
  credentials: {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  },
  
  // External API endpoints
  apiEndpoints: {
    baseUrl: process.env.TEST_SERVER_URL,
    primes: '/primes',
    fibonacci: '/fibo',
    even: '/even',
    random: '/rand'
  }
};