const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/uploadRoutes');
const checkStatus = require('./routes/checkStatus');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', checkStatus);

app.get('/', (req, res) => {
    res.send('Image Processing System');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
