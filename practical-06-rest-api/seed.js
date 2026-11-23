/**
 * Database Seeder Script
 * Practical 06: FixIt RESTful API
 * Run via: npm run seed
 */

require('dotenv').config();
const { connectDB } = require('./config/db');
const { Record } = require('./models/Record');

const seedData = async () => {
    try {
        await connectDB();
        console.log('[Seeder] Populating database with default campus records...');
        const seeded = await Record.seedDefaults();
        console.log(`[Seeder] Successfully populated ${seeded.length} records!`);
        process.exit(0);
    } catch (err) {
        console.error('[Seeder Error]:', err);
        process.exit(1);
    }
};

seedData();
