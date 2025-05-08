# Average Calculator HTTP Microservice

A REST API microservice that fetches different types of numbers from external APIs, maintains a window of unique numbers, and calculates their average.

## Features

- Exposes a REST API endpoint: `/numbers/{numberid}`
- Accepts qualified number IDs:
  - 'p': Prime numbers
  - 'f': Fibonacci numbers
  - 'e': Even numbers
  - 'r': Random numbers
- Fetches numbers from third-party server APIs
- Maintains a configurable window size of unique numbers
- Calculates the average of numbers in the current window
- Responds within 500ms
- Ignores duplicate numbers

## Requirements

- Node.js (v12 or higher)
- npm

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd average-calculator-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Set the following variables:
     ```
     PORT=9876
     WINDOW_SIZE=10
     EMAIL=your-email
     NAME=your-name
     ROLL_NO=your-roll-number
     ACCESS_CODE=your-access-code
     CLIENT_ID=your-client-id
     CLIENT_SECRET=your-client-secret
     TEST_SERVER_URL=http://20.244.56.144/evaluation-service
     ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Health Check
- **URL:** `/`
- **Method:** `GET`
- **Response:** Status and credentials information

### Fetch Numbers
- **URL:** `/numbers/{numberid}`
- **Method:** `GET`
- **URL Parameters:**
  - `numberid`: The type of numbers to fetch ('p', 'f', 'e', or 'r')
- **Response Format:**
  ```json
  {
    "windowPrevState": [],
    "windowCurrState": [1, 3, 5, 7],
    "avg": 4.00,
    "numbers": [1, 3, 5, 7]
  }
  ```

## Testing with Postman

1. Open Postman and create a new request
2. Set the request method to `GET`
3. Enter the URL: `http://localhost:9876/numbers/e` (for even numbers)
4. Send the request
5. Observe the response

## Examples

### Request 1: Fetch Even Numbers
```
GET http://localhost:9876/numbers/e
```

### Response 1:
```json
{
  "windowPrevState": [],
  "windowCurrState": [2, 4, 6, 8],
  "numbers": [2, 4, 6, 8],
  "avg": 5.00
}
```

### Request 2: Fetch More Even Numbers
```
GET http://localhost:9876/numbers/e
```

### Response 2:
```json
{
  "windowPrevState": [2, 4, 6, 8],
  "windowCurrState": [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  "numbers": [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  "avg": 23.40
}
```

## Error Handling

- If the request takes longer than 500ms, the current state is returned without updating.
- If an invalid number ID is provided, a 400 Bad Request error is returned.
- If the service encounters an error, a 500 Internal Server Error is returned.