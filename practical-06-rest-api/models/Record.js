/**
 * Record Model
 * Defines the Mongoose Schema & Resilient Storage Adapter
 */

const mongoose = require('mongoose');
const { getDbStatus } = require('../config/db');

const RecordSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Internet', 'Civil', 'General'],
                message: '{VALUE} is not a valid category'
            }
        },
        location: {
            type: String,
            required: [true, 'Campus location is required'],
            trim: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending'
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },
        reporterName: {
            type: String,
            required: [true, 'Reporter name is required'],
            trim: true
        },
        reporterEmail: {
            type: String,
            required: [true, 'Reporter email is required'],
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
        },
        reporterPhone: {
            type: String,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number starting with 6-9']
        },
        estimatedCost: {
            type: Number,
            default: 0,
            min: [0, 'Cost cannot be negative']
        }
    },
    {
        timestamps: true
    }
);

const MongooseRecord = mongoose.model('Record', RecordSchema);

// Initial Seed Dataset for Fallback In-Memory Engine
const initialRecords = [
    {
        _id: '66f501010101010101010001',
        ticketId: 'REC-1001',
        title: 'Ceiling Fan Grinding Noise',
        category: 'Electrical',
        location: 'Block A - Room 204',
        priority: 'High',
        status: 'Pending',
        description: 'Ceiling fan is making loud grinding noise and wobbling at high speed.',
        reporterName: 'Rahul Sharma',
        reporterEmail: 'rahul.sharma@campus.edu',
        reporterPhone: '9876543210',
        estimatedCost: 850,
        createdAt: new Date('2026-09-28T09:00:00Z'),
        updatedAt: new Date('2026-09-28T09:00:00Z')
    },
    {
        _id: '66f501010101010101010002',
        ticketId: 'REC-1002',
        title: 'Corridor Water Pipe Leakage',
        category: 'Plumbing',
        location: 'Hostel Block B - Ground Floor',
        priority: 'Critical',
        status: 'In Progress',
        description: 'Continuous water leakage from pipe joint causing slippery corridor floor.',
        reporterName: 'Vikram Mehta',
        reporterEmail: 'vikram.m@campus.edu',
        reporterPhone: '9711223344',
        estimatedCost: 1500,
        createdAt: new Date('2026-09-27T11:30:00Z'),
        updatedAt: new Date('2026-09-28T08:15:00Z')
    },
    {
        _id: '66f501010101010101010003',
        ticketId: 'REC-1003',
        title: 'Lab Wi-Fi Access Point Frequent Disconnects',
        category: 'Internet',
        location: 'Computer Lab 3 - 2nd Floor',
        priority: 'High',
        status: 'In Progress',
        description: 'Students experiencing 5-minute disconnect loops on Campus-Secure.',
        reporterName: 'Ananya Patel',
        reporterEmail: 'ananya.p@campus.edu',
        reporterPhone: '9812345678',
        estimatedCost: 0,
        createdAt: new Date('2026-09-27T14:00:00Z'),
        updatedAt: new Date('2026-09-28T10:00:00Z')
    },
    {
        _id: '66f501010101010101010004',
        ticketId: 'REC-1004',
        title: 'Fractured Classroom Desk Armrest',
        category: 'Furniture',
        location: 'Block C - Room 102',
        priority: 'Medium',
        status: 'Resolved',
        description: 'Wooden armrest cracked with exposed sharp screw edge. Repaired by carpentering unit.',
        reporterName: 'Sneha Reddy',
        reporterEmail: 'sneha.r@campus.edu',
        reporterPhone: '9845612345',
        estimatedCost: 400,
        createdAt: new Date('2026-09-25T16:00:00Z'),
        updatedAt: new Date('2026-09-26T12:00:00Z')
    }
];

let inMemoryStore = JSON.parse(JSON.stringify(initialRecords));

/**
 * Unified Record Repository
 * Seamlessly routes to Mongoose when connected to real MongoDB,
 * or operates in-memory when offline/evaluating without a database.
 */
class RecordRepository {
    static isLiveDb() {
        return mongoose.connection.readyState === 1;
    }

    static async find(filter = {}) {
        if (this.isLiveDb()) {
            return await MongooseRecord.find(filter).sort({ createdAt: -1 });
        }
        return inMemoryStore.filter(item => {
            for (const key of Object.keys(filter)) {
                if (filter[key] && item[key] !== filter[key]) return false;
            }
            return true;
        });
    }

    static async findById(id) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseRecord.findById(id);
            }
            return await MongooseRecord.findOne({ ticketId: id });
        }
        return inMemoryStore.find(item => item._id === id || item.ticketId === id) || null;
    }

    static async create(data) {
        if (!data.ticketId) {
            const count = this.isLiveDb() 
                ? (await MongooseRecord.countDocuments()) + 1001 
                : inMemoryStore.length + 1001;
            data.ticketId = `REC-${count}`;
        }

        if (this.isLiveDb()) {
            return await MongooseRecord.create(data);
        }

        const newDoc = {
            _id: new mongoose.Types.ObjectId().toString(),
            ...data,
            priority: data.priority || 'Medium',
            status: data.status || 'Pending',
            estimatedCost: Number(data.estimatedCost) || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        inMemoryStore.unshift(newDoc);
        return newDoc;
    }

    static async findByIdAndUpdate(id, updateData, options = { new: true }) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseRecord.findByIdAndUpdate(id, updateData, options);
            }
            return await MongooseRecord.findOneAndUpdate({ ticketId: id }, updateData, options);
        }

        const index = inMemoryStore.findIndex(item => item._id === id || item.ticketId === id);
        if (index === -1) return null;

        inMemoryStore[index] = {
            ...inMemoryStore[index],
            ...updateData,
            updatedAt: new Date()
        };
        return inMemoryStore[index];
    }

    static async findByIdAndDelete(id) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseRecord.findByIdAndDelete(id);
            }
            return await MongooseRecord.findOneAndDelete({ ticketId: id });
        }

        const index = inMemoryStore.findIndex(item => item._id === id || item.ticketId === id);
        if (index === -1) return null;
        const deleted = inMemoryStore.splice(index, 1)[0];
        return deleted;
    }

    static async countDocuments(filter = {}) {
        if (this.isLiveDb()) {
            return await MongooseRecord.countDocuments(filter);
        }
        return (await this.find(filter)).length;
    }

    static async seedDefaults() {
        if (this.isLiveDb()) {
            await MongooseRecord.deleteMany({});
            return await MongooseRecord.insertMany(initialRecords);
        }
        inMemoryStore = JSON.parse(JSON.stringify(initialRecords));
        return inMemoryStore;
    }
}

module.exports = { Record: RecordRepository, MongooseRecord, RecordSchema };
