/**
 * MongoDB Database Connection Manager
 * Practical 07: Node.js + Express + MongoDB NoSQL Application
 */

const mongoose = require('mongoose');

let isConnected = false;
let dbName = 'fixit_campus_db';
let collectionName = 'maintenance_issues';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`;

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000
        });

        isConnected = true;
        dbName = conn.connection.name;
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
        console.log(`[MongoDB] Database Name: "${conn.connection.name}"`);
        console.log(`[MongoDB] Active Collection: "${collectionName}"`);

        return conn;
    } catch (err) {
        console.warn(`[MongoDB Warning] Could not connect to MongoDB at "${mongoUri}": ${err.message}`);
        console.warn(`[MongoDB Tip] Set MONGODB_URI in your .env or Render environment for cloud MongoDB Atlas.`);
        console.log(`[MongoDB] Activating In-Memory NoSQL Adapter for seamless local evaluation.`);
        isConnected = false;
        return null;
    }
};

const getDbInfo = () => ({
    isConnected,
    database: dbName,
    collection: collectionName,
    provider: isConnected ? 'Live MongoDB Server' : 'In-Memory Fallback Adapter',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
});

module.exports = { connectDB, getDbInfo, mongoose, dbName, collectionName };
