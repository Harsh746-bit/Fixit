/**
 * MongoDB Seeder Script
 * Practical 07: Populate MongoDB Collection
 * Run via: npm run seed
 */

require('dotenv').config();
const { connectDB } = require('./config/db');
const { Issue } = require('./models/Issue');

const seedData = async () => {
    try {
        await connectDB();
        console.log('[Seeder] Populating MongoDB collection with campus issues...');
        const seeded = await Issue.seedDefaults();
        console.log(`[Seeder] Successfully seeded ${seeded.length} documents into 'maintenance_issues' collection!`);
        process.exit(0);
    } catch (err) {
        console.error('[Seeder Error]:', err);
        process.exit(1);
    }
};

seedData();
