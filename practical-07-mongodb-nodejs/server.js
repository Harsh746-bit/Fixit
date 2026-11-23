/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 07: Node.js + Express + MongoDB NoSQL Web Application
 * ==============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDbInfo } = require('./config/db');
const issueRoutes = require('./routes/issueRoutes');
const { errorHandler } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5002;

// 1. Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. HTTP Request Logger
app.use((req, res, next) => {
    console.log(`[Practical 07 App] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
});

// 3. Serve Frontend Web Application (Browser Interface)
app.use(express.static(path.join(__dirname, 'public')));

// 4. API Endpoints for AJAX & Postman
app.use('/api/issues', issueRoutes);

// Database Health Check Endpoint
app.get('/api/db-status', (req, res) => {
    res.status(200).json({
        success: true,
        dbInfo: getDbInfo()
    });
});

// Fallback to index.html for root if needed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. 404 Route Handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint '${req.method} ${req.originalUrl}' not found.`
    });
});

// 6. Centralized Error Handler
app.use(errorHandler);

// 7. Initialize Database & Start Server
const startServer = async () => {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`FixIt Practical 07: MongoDB NoSQL Web App Running!`);
        console.log(`Browser UI:     http://localhost:${PORT}`);
        console.log(`REST API:       http://localhost:${PORT}/api/issues`);
        console.log(`DB Status:      http://localhost:${PORT}/api/db-status`);
        console.log(`=======================================================`);
    });
    return server;
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = app;
