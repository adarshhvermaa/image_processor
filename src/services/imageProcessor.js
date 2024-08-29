const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp'); 

// Function to download the image
async function downloadImage(url, tempPath) {
    const writer = fs.createWriteStream(tempPath);
    const response = await axios({
        url,
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Function to extract image name from URL
function extractImageName(url) {
    return path.basename(url, path.extname(url)) + '.jpg'; // Ensure it is saved as .jpg
}

// Function to process and compress the image
async function processAndCompressImage(imageUrl) {
    const tempImagePath = path.join('uploads', 'temp', extractImageName(imageUrl));
    const outputImagePath = path.join('uploads', 'processed', extractImageName(imageUrl));

    // Ensure directories exist
    fs.mkdirSync(path.dirname(tempImagePath), { recursive: true });
    fs.mkdirSync(path.dirname(outputImagePath), { recursive: true });

    try {
        // Download the image
        await downloadImage(imageUrl, tempImagePath);

        // Compress and save the image
        await sharp(tempImagePath)
            .resize({ width: 800 })
            .jpeg({ quality: 50 }) 
            .toFile(outputImagePath);

        // Clean up the temporary image
        fs.unlinkSync(tempImagePath);

        return outputImagePath;
    } catch (err) {
        console.error(`Error processing image ${imageUrl}:`, err);
        // Continue processing other images even if one fails
        return null;
    }
}

module.exports = { processAndCompressImage };