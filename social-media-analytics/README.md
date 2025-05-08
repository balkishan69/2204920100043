# Social Media Analytics HTTP Microservice

This microservice provides APIs to analyze social media data, including finding top users and top/latest posts.

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Postman (for testing)
- VSCode (recommended IDE)

### Installation

1. Clone the repository or copy the files to a new directory
   ```
   git clone <repo-url> social-media-analytics
   # or
   mkdir social-media-analytics
   # copy files...
   ```

2. Navigate to the project directory
   ```
   cd social-media-analytics
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Create a `.env` file in the root directory with the following contents:
   ```
   # Auth credentials
   EMAIL=11balkishan11@gmail.com
   NAME=balkishan mandal
   ROLL_NO=2204920100043
   ACCESS_CODE=baqhWc
   CLIENT_ID=19b40dac-f375-4179-908f-99594b500d3b
   CLIENT_SECRET=ZarerWZtUzFrwZdd

   # API base URL
   API_BASE_URL=http://20.244.56.144/evaluation-service

   # Server configuration
   PORT=3000
   ```

5. Start the server
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### 1. Get Top Users
Returns the top 5 users with the most commented posts.

- **URL**: `/api/users/top`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "topUsers": [
      {
        "userId": "1",
        "name": "John Doe",
        "commentCount": 10,
        "postCount": 5
      },
      // ... more users
    ]
  }
  ```

### 2. Get Posts
Returns posts based on the specified type.

- **URL**: `/api/posts`
- **Method**: `GET`
- **Query Parameters**:
  - `type`: `popular` (default) or `latest`
- **Response for popular**:
  ```json
  {
    "popularPosts": [
      {
        "id": 246,
        "userid": "1",
        "content": "Post about ant",
        "userName": "John Doe",
        "commentCount": 5
      },
      // ... more posts
    ]
  }
  ```
- **Response for latest**:
  ```json
  {
    "latestPosts": [
      {
        "id": 952,
        "userid": "1",
        "content": "Post about zebra",
        "userName": "John Doe",
        "commentCount": 2
      },
      // ... more posts
    ]
  }
  ```

### 3. Health Check
Simple health check endpoint.

- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "UP",
    "message": "Service is running"
  }
  ```

## Testing with Postman

1. Open Postman
2. Create a new request collection called "Social Media Analytics"
3. Add the following requests:
   - GET http://localhost:3000/api/users/top
   - GET http://localhost:3000/api/posts?type=popular
   - GET http://localhost:3000/api/posts?type=latest
   - GET http://localhost:3000/api/health

4. Run the requests and verify the responses