const axios = require('axios');
const config = require('./config');

// Service to fetch numbers from external APIs
class NumbersService {
  constructor() {
    // Initialize storage for numbers
    this.numberStore = {
      windowPrevState: [],
      windowCurrState: [],
      responseTime: {}
    };
    
    // Initialize axios instance with base URL
    this.apiClient = axios.create({
      baseURL: config.apiEndpoints.baseUrl,
      timeout: 500 // Set timeout to 500ms as per requirements
    });
  }

  /**
   * Fetches numbers based on the specified type (prime, fibonacci, even, random)
   * @param {string} type - The type of numbers to fetch
   * @returns {Promise<Array>} - Array of fetched numbers
   */
  async fetchNumbers(type) {
    try {
      let endpoint;
      
      // Determine endpoint based on number type
      switch (type) {
        case 'p':
          endpoint = config.apiEndpoints.primes;
          break;
        case 'f':
          endpoint = config.apiEndpoints.fibonacci;
          break;
        case 'e':
          endpoint = config.apiEndpoints.even;
          break;
        case 'r':
          endpoint = config.apiEndpoints.random;
          break;
        default:
          throw new Error(`Invalid number type: ${type}`);
      }
      
      const startTime = Date.now();
      const response = await this.apiClient.get(endpoint);
      const endTime = Date.now();
      
      // Check if response took too long or had errors
      if (endTime - startTime > 500) {
        console.warn(`Response took longer than 500ms: ${endTime - startTime}ms`);
        return null;
      }
      
      // Store response time for logging
      this.responseTime[type] = endTime - startTime;
      
      return response.data.numbers;
    } catch (error) {
      console.error(`Error fetching ${type} numbers:`, error.message);
      return null;
    }
  }

  /**
   * Updates the window state with new unique numbers
   * @param {Array} newNumbers - New numbers to add to the window
   */
  updateWindowState(newNumbers) {
    if (!newNumbers || newNumbers.length === 0) {
      return;
    }
    
    // Store previous state before updating
    this.numberStore.windowPrevState = [...this.numberStore.windowCurrState];
    
    // Filter out duplicates and add new unique numbers
    const uniqueNewNumbers = newNumbers.filter(
      num => !this.numberStore.windowCurrState.includes(num)
    );
    
    // Update current window state
    this.numberStore.windowCurrState = [
      ...this.numberStore.windowCurrState, 
      ...uniqueNewNumbers
    ];
    
    // Limit to window size by removing oldest elements
    if (this.numberStore.windowCurrState.length > config.windowSize) {
      this.numberStore.windowCurrState = this.numberStore.windowCurrState.slice(
        this.numberStore.windowCurrState.length - config.windowSize
      );
    }
  }

  /**
   * Calculates average of numbers in the current window
   * @returns {number} - The calculated average
   */
  calculateAverage() {
    if (this.numberStore.windowCurrState.length === 0) {
      return 0;
    }
    
    const sum = this.numberStore.windowCurrState.reduce((acc, num) => acc + num, 0);
    return parseFloat((sum / this.numberStore.windowCurrState.length).toFixed(2));
  }

  /**
   * Gets the current state of the number store
   * @returns {Object} - The current number store state
   */
  getState() {
    return {
      windowPrevState: this.numberStore.windowPrevState,
      windowCurrState: this.numberStore.windowCurrState,
      avg: this.calculateAverage()
    };
  }
}

module.exports = new NumbersService();