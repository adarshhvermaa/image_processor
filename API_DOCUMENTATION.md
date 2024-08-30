# Image Processing System API Documentation

## 1. Upload CSV File

**Endpoint**: `POST /api/upload`

**Description**: Uploads a CSV file containing image URLs for processing.

**Request Body**:
- `file`: The CSV file to be uploaded.
- `webhookUrl` (optional): The URL to be notified when processing is complete.

**Response**:
- `200 OK`:
  - `message`: Confirmation message.
  - `requestId`: Unique ID for tracking the request.
- `400 Bad Request`: Error message if validation fails.
- `500 Internal Server Error`: Error message if the request creation fails.


## 2. Check Status of file

**Endpoint**: `GET /api/status/:requestId`

**Description**: Checks the processing status of the request using the unique request ID.

**Response**:
- `200 OK`:
  -`requestId`: The unique ID of the request.
  -`status`: The current status (pending, processing, completed, failed).
  -`productData`: An array of processed product data, including input and output image URLs.
  -`createdAt`: Timestamp when the request was created.
  -`updatedAt`: Timestamp when the request was last updated.
- `404 Not Found`: Error message if the request ID is not found in the database.
- `500 Internal Server Error`: Error message if there is an issue retrieving the status.


