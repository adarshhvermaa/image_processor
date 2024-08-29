
const express = require('express');
const Request = require('../models/Request');

const router = express.Router();

// Status API to check the processing status using the request ID
router.get('/status/:requestId', async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await Request.findOne({ requestId });

        if (!request) {
            return res.status(404).json({ error: 'Request ID not found.' });
        }
        res.status(200).json({
            requestId: request.requestId,
            status: request.status,
            productData: request.productData,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve processing status.' });
    }
});

module.exports = router;