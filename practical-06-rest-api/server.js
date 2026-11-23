/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 06: Database RESTful API Server & Cloud Deployment
 * ==============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDbStatus } = require('./config/db');
const recordRoutes = require('./routes/recordRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. HTTP Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[Practical 06 API] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
});

// 3. API Routes Mount
app.use('/api/records', recordRoutes);

// 4. Welcome & Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        project: "FixIt — Smart Campus Maintenance Management System",
        practical: "Practical 06 — RESTful API for Managing Records in a Database",
        objective: "CRUD operations, database persistence, cloud hosting deployment, and Postman verification",
        database: getDbStatus(),
        endpoints: {
            getAllRecords: "GET /api/records",
            filterRecords: "GET /api/records?category=Electrical&status=Pending&priority=High",
            searchRecords: "GET /api/records?search=corridor",
            getRecordById: "GET /api/records/:id",
            createRecord: "POST /api/records",
            updateRecord: "PUT /api/records/:id or PATCH /api/records/:id",
            deleteRecord: "DELETE /api/records/:id",
            statistics: "GET /api/records/stats/summary",
            seedDatabase: "POST /api/records/seed"
        },
        testing: {
            postmanCollection: "/FixIt-Practical-06.postman_collection.json",
            automatedScript: "npm run test:endpoints"
        },
        status: "Online & accepting requests"
    });
});

// 5. 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint '${req.method} ${req.originalUrl}' does not exist on this RESTful API server.`,
        hint: "Visit GET / for a comprehensive list of all supported endpoints."
    });
});

// 6. Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('[Practical 06 Global Error]:', err);

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Resource not found with invalid identifier format: '${err.value}'`
        });
    }

    // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: "Mongoose database validation failure.",
            errors: messages
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error in database operation."
    });
});

// 7. Initialize Database & Start Server
const startServer = async () => {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`FixIt Practical 06 RESTful API Server Running!`);
        console.log(`Local Access:   http://localhost:${PORT}`);
        console.log(`API Base:       http://localhost:${PORT}/api/records`);
        console.log(`Health Check:   http://localhost:${PORT}/`);
        console.log(`=======================================================`);
    });
    return server;
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = app;
