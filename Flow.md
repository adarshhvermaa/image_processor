## Data Flow

1. **CSV Upload**:
   - The user uploads a CSV file containing product names and image URLs via the `POST /api/upload` endpoint.
   - The API validates the CSV and saves it with an initial status of "pending" in MongoDB.

2. **CSV Parsing**:
   - The CSV file is parsed to extract product information and image URLs.
   - The extracted data is passed to the image processing service.

3. **Image Processing**:
   - Images from the URLs are asynchronously processed (compressed).
   - The processed images are stored in the `public/` directory or a cloud storage solution.
   - The URLs of the processed images are saved back in MongoDB under the corresponding request.

4. **Webhook Notification**:
   - Once processing is complete, the webhook service checks for a `webhookUrl`.
   - If provided, it sends a POST request with the status and data to the specified URL.

5. **Status Checking**:
   - Users can check the processing status by sending a GET request to `/api/status/:requestId`.
   - The API retrieves the status and associated data from MongoDB and returns it to the user.
