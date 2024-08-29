const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseCSV } = require('../utils/csvUtils');
const { processAndCompressImage } = require('../services/imageProcessor');
const Request = require('../models/Request');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a CSV file.' });
    }

    const { webhookUrl } = req.body;
    const requestId = uuidv4();

    const request = new Request({
        requestId,
        status: 'pending',
        webhookUrl,
        productData: []
    });

    try {
        await request.save();

        const handleResponse = (status, message) => {
            if (!res.headersSent) {
                res.status(status).json(message);
            }
        };

        parseCSV(req.file.path, async (err, data) => {
            if (err) {
                request.status = 'failed';
                request.updatedAt = Date.now();
                await request.save();
                return handleResponse(400, { error: err.error, details: err.details });
            }

            request.status = 'processing';
            await request.save();

            for (const row of data) {
                const inputImageUrls = row['Input Image Urls'].split(',');
                const outputImageUrls = [];

                for (const imageUrl of inputImageUrls) {
                    const outputImageUrl = await processAndCompressImage(imageUrl.trim());
                    if (outputImageUrl) {
                        outputImageUrls.push(outputImageUrl);
                    }
                }

                request.productData.push({
                    serialNumber: row['Serial Number'],
                    productName: row['Product Name'],
                    inputImageUrls,
                    outputImageUrls
                });
            }

            request.status = 'completed';
            request.updatedAt = Date.now();
            await request.save();

            if (request.webhookUrl) {
                try {
                    await axios.post(request.webhookUrl, {
                        requestId: request.requestId,
                        status: request.status,
                        productData: request.productData,
                        updatedAt: request.updatedAt
                    });
                } catch (err) {
                    console.error('Failed to trigger webhook:', err);
                }
            }

            handleResponse(200, { message: 'File processed successfully!', requestId });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create processing request.' });
    }
});


module.exports = router;
