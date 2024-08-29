const fs = require('fs');
const csv = require('csv-parser');

// Function to validate CSV data
function validateCSV(data) {
    const requiredColumns = ['Serial Number', 'Product Name', 'Input Image Urls'];
    const errors = [];

    data.forEach((row, index) => {
        requiredColumns.forEach((column) => {
            if (!row[column]) {
                errors.push(`Row ${index + 1} is missing required column: ${column}`);
            }
        });

        if (row['Input Image Urls']) {
            const urls = row['Input Image Urls'].split(',');
            urls.forEach((url) => {
                try {
                    new URL(url.trim());
                } catch (e) {
                    errors.push(`Invalid URL format in row ${index + 1}: ${url.trim()}`);
                }
            });
        }
    });

    return errors.length > 0 ? errors : null;
}

// Function to parse and validate CSV file
function parseCSV(filePath, callback) {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const validationErrors = validateCSV(results);
            if (validationErrors) {
                callback({ error: 'Validation failed', details: validationErrors }, null);
            } else {
                callback(null, results);
            }
        })
        .on('error', (err) => {
            callback(err, null);
        });
}

module.exports = { parseCSV };
