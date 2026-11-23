/**
 * Mongoose Issue Schema & Model
 * Practical 07: MongoDB NoSQL Collection: 'maintenance_issues'
 */

const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: [true, 'Issue title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Internet', 'Civil', 'General'],
                message: '{VALUE} is not a valid campus category'
            }
        },
        location: {
            type: String,
            required: [true, 'Location is required (e.g. Block A - Room 204)'],
            trim: true
        },
        priority: {
            type: String,
            enum: {
                values: ['Low', 'Medium', 'High', 'Critical'],
                message: '{VALUE} is not a valid priority level'
            },
            default: 'Medium'
        },
        status: {
            type: String,
            enum: {
                values: ['Pending', 'In Progress', 'Resolved'],
                message: '{VALUE} is not a valid status'
            },
            default: 'Pending'
        },
        description: {
            type: String,
            required: [true, 'Issue description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters long']
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
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format']
        },
        reporterPhone: {
            type: String,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9']
        }
    },
    {
        collection: 'maintenance_issues',
        timestamps: true
    }
);

const MongooseIssue = mongoose.model('Issue', IssueSchema);

// Initial Sample Data for MongoDB / Memory Fallback
const defaultSeedIssues = [
    {
        _id: '66f502010101010101010001',
        ticketId: 'FIX-2001',
        title: 'Overhead Projector Fan Malfunction',
        category: 'Electrical',
        location: 'Lecture Hall 101, Block B',
        priority: 'High',
        status: 'Pending',
        description: 'Projector shuts down automatically every 15 minutes due to thermal fan failure.',
        reporterName: 'Dr. Aris Thorne',
        reporterEmail: 'aris.thorne@campus.edu',
        reporterPhone: '9876543210',
        createdAt: new Date('2026-10-01T08:30:00Z'),
        updatedAt: new Date('2026-10-01T08:30:00Z')
    },
    {
        _id: '66f502010101010101010002',
        ticketId: 'FIX-2002',
        title: 'Restroom Flush Valve Leak',
        category: 'Plumbing',
        location: 'Mechanical Wing - 2nd Floor Washroom',
        priority: 'Critical',
        status: 'In Progress',
        description: 'Continuous heavy water loss from pressurized flush valve causing flooding in lobby.',
        reporterName: 'Sunil Rao',
        reporterEmail: 'sunil.rao@campus.edu',
        reporterPhone: '9811223344',
        createdAt: new Date('2026-10-02T10:15:00Z'),
        updatedAt: new Date('2026-10-02T11:45:00Z')
    },
    {
        _id: '66f502010101010101010003',
        ticketId: 'FIX-2003',
        title: 'Central Library Wi-Fi Gateway Unreachable',
        category: 'Internet',
        location: 'Library Reading Room - North Section',
        priority: 'Critical',
        status: 'In Progress',
        description: 'DHCP server not leasing IP addresses to student laptops on Campus-Secure SSID.',
        reporterName: 'Meera Nambiar',
        reporterEmail: 'meera.n@campus.edu',
        reporterPhone: '9744556677',
        createdAt: new Date('2026-10-03T12:00:00Z'),
        updatedAt: new Date('2026-10-03T13:30:00Z')
    },
    {
        _id: '66f502010101010101010004',
        ticketId: 'FIX-2004',
        title: 'Broken Drafting Table Bracket',
        category: 'Furniture',
        location: 'Architecture Studio 4',
        priority: 'Medium',
        status: 'Resolved',
        description: 'Tilt mechanism bracket replaced with heavy-duty steel latch.',
        reporterName: 'Karan Dave',
        reporterEmail: 'karan.d@campus.edu',
        reporterPhone: '9655443322',
        createdAt: new Date('2026-10-04T14:20:00Z'),
        updatedAt: new Date('2026-10-05T09:10:00Z')
    }
];

let inMemoryIssues = JSON.parse(JSON.stringify(defaultSeedIssues));

/**
 * Unified NoSQL Repository for Practical 07
 */
class IssueRepository {
    static isLiveDb() {
        return mongoose.connection.readyState === 1;
    }

    static async find(filter = {}) {
        if (this.isLiveDb()) {
            return await MongooseIssue.find(filter).sort({ createdAt: -1 });
        }
        return inMemoryIssues.filter(item => {
            for (const key of Object.keys(filter)) {
                if (filter[key] && item[key] !== filter[key]) return false;
            }
            return true;
        });
    }

    static async findById(id) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseIssue.findById(id);
            }
            return await MongooseIssue.findOne({ ticketId: id });
        }
        return inMemoryIssues.find(item => item._id === id || item.ticketId === id) || null;
    }

    static async create(data) {
        if (!data.ticketId) {
            const count = this.isLiveDb()
                ? (await MongooseIssue.countDocuments()) + 2001
                : inMemoryIssues.length + 2001;
            data.ticketId = `FIX-${count}`;
        }

        if (this.isLiveDb()) {
            return await MongooseIssue.create(data);
        }

        const newDoc = {
            _id: new mongoose.Types.ObjectId().toString(),
            ...data,
            priority: data.priority || 'Medium',
            status: data.status || 'Pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        inMemoryIssues.unshift(newDoc);
        return newDoc;
    }

    static async findByIdAndUpdate(id, updateData, options = { new: true }) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseIssue.findByIdAndUpdate(id, updateData, options);
            }
            return await MongooseIssue.findOneAndUpdate({ ticketId: id }, updateData, options);
        }

        const index = inMemoryIssues.findIndex(item => item._id === id || item.ticketId === id);
        if (index === -1) return null;

        inMemoryIssues[index] = {
            ...inMemoryIssues[index],
            ...updateData,
            updatedAt: new Date()
        };
        return inMemoryIssues[index];
    }

    static async findByIdAndDelete(id) {
        if (this.isLiveDb()) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return await MongooseIssue.findByIdAndDelete(id);
            }
            return await MongooseIssue.findOneAndDelete({ ticketId: id });
        }

        const index = inMemoryIssues.findIndex(item => item._id === id || item.ticketId === id);
        if (index === -1) return null;
        return inMemoryIssues.splice(index, 1)[0];
    }

    static async countDocuments(filter = {}) {
        if (this.isLiveDb()) {
            return await MongooseIssue.countDocuments(filter);
        }
        return (await this.find(filter)).length;
    }

    static async seedDefaults() {
        if (this.isLiveDb()) {
            await MongooseIssue.deleteMany({});
            return await MongooseIssue.insertMany(defaultSeedIssues);
        }
        inMemoryIssues = JSON.parse(JSON.stringify(defaultSeedIssues));
        return inMemoryIssues;
    }
}

module.exports = { Issue: IssueRepository, MongooseIssue, IssueSchema, defaultSeedIssues };
