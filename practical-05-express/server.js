/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 05: Express.js REST API Server
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const issueRoutes = require('./routes/issueRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[Express API] ${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// 3. API Routes Mount
app.use('/api', issueRoutes);

// 4. Root Welcome Route
app.get('/', (req, res) => {
    res.status(200).json({
        project: "FixIt — Smart Campus Maintenance Management System",
        practical: "Practical 05 — ExpressJS REST API",
        architecture: "Express App -> Validation Middleware -> Controller -> JSON Storage",
        endpoints: {
            getAllIssues: "GET /api/issues",
            getIssueById: "GET /api/issues/:id",
            createIssue: "POST /api/issues",
            updateStatus: "PATCH /api/issues/:id/status",
            deleteIssue: "DELETE /api/issues/:id",
            getStatistics: "GET /api/statistics"
        },
        status: "Express server running smoothly"
    });
});

// 5. 404 Not Found Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.method} ${req.originalUrl}' not found on Express API server.`
    });
});

// 6. Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('[Express Global Error]:', err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error occurred.",
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// 7. Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`FixIt — Practical 05: Express.js REST API Active`);
    console.log(`Server URL: http://localhost:${PORT}`);
    console.log(`REST Endpoints:`);
    console.log(`  - GET    http://localhost:${PORT}/api/issues`);
    console.log(`  - GET    http://localhost:${PORT}/api/statistics`);
    console.log(`  - POST   http://localhost:${PORT}/api/issues`);
    console.log(`  - PATCH  http://localhost:${PORT}/api/issues/:id/status`);
    console.log(`  - DELETE http://localhost:${PORT}/api/issues/:id`);
    console.log(`=======================================================`);
});
