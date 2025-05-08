require('dotenv').config();

module.exports = {
  auth: {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  },
  api: {
    baseUrl: process.env.API_BASE_URL
  },
  server: {
    port: process.env.PORT || 3000
  }
};