# Number Classification API

An API that analyzes numbers and returns their mathematical properties along with interesting facts.

## Features

- Determines if a number is prime
- Determines if a number is perfect
- Identifies Armstrong numbers
- Calculates digit sum
- Provides number properties (odd/even, Armstrong)
- Fetches fun mathematical facts from Numbers API

## Technologies Used

- Node.js
- Express.js
- Axios for HTTP requests
- CORS middleware

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/joeyzazalin/hng12-stage1_backend.git
cd your-repo
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
- Development: `npm run dev`
- Production: `npm start`

## API Documentation

### Endpoint

`GET /api/classify-number`

### Query Parameters

- `number` (required): Integer to analyze

### Response Format

#### Success (200 OK)
```json
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number..."
}
```

#### Error (400 Bad Request)
```json
{
    "number": "invalid_input",
    "error": true
}
```

### Example Usage

```bash
curl "https://https://hng12-stage1-backend.onrender.com/api/classify-number?number=371"
```

## Testing

You can test the API using tools like:
- cURL
- Postman
- Web browser

## Deployment

This API is deployed at: [https://hng12-stage1-backend.onrender.com]

## Performance

- Response time: < 500ms
- Handles CORS for cross-origin requests
- Input validation and error handling included

## Error Handling

The API includes handling for:
- Invalid inputs
- Non-numeric values
- Missing parameters
- Network errors with Numbers API

## Contributing

Feel free to submit issues and enhancement requests.