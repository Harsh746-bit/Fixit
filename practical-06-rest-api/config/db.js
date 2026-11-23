/**
 * Database Connection & Management
 * Practical 06: FixIt RESTful API
 * Supports MongoDB / MongoDB Atlas with resilient fallback
 */

const mongoose = require('mongoose');

let isConnected = false;
let dbProvider = 'Disconnected';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixit_records_db';
    
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000 // Fast failover if no local daemon
        });
        isConnected = true;
        dbProvider = `MongoDB (${conn.connection.host}/${conn.connection.name})`;
        console.log(`[Database] Connected successfully to ${dbProvider}`);
        return conn;
    } catch (err) {
        console.warn(`[Database Warning] Could not connect to MongoDB at "${mongoUri}": ${err.message}`);
        console.warn(`[Database Tip] To connect to cloud MongoDB, set MONGODB_URI=mongodb+srv://... in your .env file.`);
        console.log(`[Database] Activating Resilient In-Memory Fallback Adapter for seamless offline evaluation.`);
        isConnected = false;
        dbProvider = 'In-Memory Fallback (Active until MONGODB_URI is provided)';
        return null;
    }
};

const getDbStatus = () => ({
    isConnected,
    provider: dbProvider,
    timestamp: new Date().toISOString()
});

module.exports = { connectDB, getDbStatus, mongoose };
