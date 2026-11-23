/**
 * Record Controller
 * Practical 06: RESTful API CRUD Handlers
 */

const { Record } = require('../models/Record');
const { getDbStatus } = require('../config/db');

// @desc    Retrieve all records with optional filtering
// @route   GET /api/records
exports.getAllRecords = async (req, res, next) => {
    try {
        const { category, priority, status, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (status) filter.status = status;

        let records = await Record.find(filter);

        // Optional full-text search across title, location, description
        if (search && search.trim() !== '') {
            const query = search.trim().toLowerCase();
            records = records.filter(r => 
                (r.title && r.title.toLowerCase().includes(query)) ||
                (r.location && r.location.toLowerCase().includes(query)) ||
                (r.description && r.description.toLowerCase().includes(query)) ||
                (r.ticketId && r.ticketId.toLowerCase().includes(query))
            );
        }

        res.status(200).json({
            success: true,
            count: records.length,
            database: getDbStatus(),
            data: records
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Retrieve a single record by ID or ticketId
// @route   GET /api/records/:id
exports.getRecordById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await Record.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: `Record with ID/Ticket '${id}' not found in database.`
            });
        }

        res.status(200).json({
            success: true,
            data: record
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new record in database
// @route   POST /api/records
exports.createRecord = async (req, res, next) => {
    try {
        const newRecord = await Record.create(req.body);

        res.status(201).json({
            success: true,
            message: `Record '${newRecord.ticketId || newRecord._id}' successfully created in database.`,
            data: newRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an existing record (full or partial)
// @route   PUT /api/records/:id or PATCH /api/records/:id
exports.updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedRecord = await Record.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: `Record with ID '${id}' could not be found to update.`
            });
        }

        res.status(200).json({
            success: true,
            message: `Record '${updatedRecord.ticketId || id}' updated successfully.`,
            data: updatedRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a record from database
// @route   DELETE /api/records/:id
exports.deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRecord = await Record.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: `Record with ID '${id}' not found. No record was deleted.`
            });
        }

        res.status(200).json({
            success: true,
            message: `Record '${deletedRecord.ticketId || id}' successfully removed from database.`,
            deletedData: deletedRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Retrieve aggregated database statistics
// @route   GET /api/records/stats/summary
exports.getStatistics = async (req, res, next) => {
    try {
        const all = await Record.find({});
        const total = all.length;
        const pending = all.filter(r => r.status === 'Pending').length;
        const inProgress = all.filter(r => r.status === 'In Progress').length;
        const resolved = all.filter(r => r.status === 'Resolved').length;
        const totalEstimatedCost = all.reduce((sum, r) => sum + (Number(r.estimatedCost) || 0), 0);

        const categoryCounts = all.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                inProgress,
                resolved,
                totalEstimatedCost,
                categoryBreakdown: categoryCounts
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Seed or reset sample records in database
// @route   POST /api/records/seed
exports.seedRecords = async (req, res, next) => {
    try {
        const seeded = await Record.seedDefaults();
        res.status(200).json({
            success: true,
            message: "Database seeded successfully with default FixIt campus records.",
            count: seeded.length,
            data: seeded
        });
    } catch (err) {
        next(err);
    }
};
