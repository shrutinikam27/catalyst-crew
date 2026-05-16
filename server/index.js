const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Catalyst Crew API is running',
        version: '1.0.0'
    });
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgCyan.white);
});
