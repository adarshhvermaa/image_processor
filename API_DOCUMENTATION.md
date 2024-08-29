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
