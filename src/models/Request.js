const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
    requestId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    productData: [
        {
            serialNumber: { type: String, required: true },
            productName: { type: String, required: true },
            inputImageUrls: [{ type: String, required: true }],
            outputImageUrls: [{ type: String, required: true }]
        }
    ],
    webhookUrl: { type: String },  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
