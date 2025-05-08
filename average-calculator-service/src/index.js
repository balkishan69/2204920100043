const express = require('express');
const config = require('./config');
const numbersService = require('./services');

// Initialize Express app
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Average Calculator Microservice is running',
    credentials: {
      name: config.credentials.name,
      email: config.credentials.email,
      rollNo: config.credentials.rollNo
    }
  });
});

// Main endpoint for fetching numbers by type
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  
  // Validate number ID
  const validIds = ['p', 'f', 'e', 'r'];
  if (!validIds.includes(numberid)) {
    return res.status(400).json({
      error: 'Invalid number ID. Valid IDs are: p (prime), f (fibonacci), e (even), r (random)'
    });
  }
  
  try {
    // Fetch numbers from external API
    const fetchedNumbers = await numbersService.fetchNumbers(numberid);
    
    // If fetching failed or took too long, return current state without updating
    if (!fetchedNumbers) {
      return res.json({
        ...numbersService.getState(),
        numbers: [],
        error: 'Failed to fetch numbers or response took too long'
      });
    }
    
    // Update window state with new numbers
    numbersService.updateWindowState(fetchedNumbers);
    
    // Prepare response
    const response = {
      ...numbersService.getState(),
      numbers: fetchedNumbers // Include the numbers received from 3rd party server
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
  console.log(`Window size configured to: ${config.windowSize}`);
});