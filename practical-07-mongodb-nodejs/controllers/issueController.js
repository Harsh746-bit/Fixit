/**
 * Issue Controller
 * Practical 07: MongoDB NoSQL CRUD Operations
 */

const { Issue } = require('../models/Issue');
const { getDbInfo } = require('../config/db');

// @desc    Retrieve all issues from MongoDB collection
// @route   GET /api/issues
exports.getIssues = async (req, res, next) => {
    try {
        const { category, priority, status, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (status) filter.status = status;

        let issues = await Issue.find(filter);

        if (search && search.trim() !== '') {
            const query = search.trim().toLowerCase();
            issues = issues.filter(item => 
                (item.title && item.title.toLowerCase().includes(query)) ||
                (item.location && item.location.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.ticketId && item.ticketId.toLowerCase().includes(query))
            );
        }

        res.status(200).json({
            success: true,
            count: issues.length,
            dbInfo: getDbInfo(),
            data: issues
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Retrieve single issue by MongoDB _id or ticketId
// @route   GET /api/issues/:id
exports.getIssueById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: `No issue found in MongoDB collection with ID '${id}'.`
            });
        }

        res.status(200).json({
            success: true,
            data: issue
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Insert a new issue document into MongoDB
// @route   POST /api/issues
exports.createIssue = async (req, res, next) => {
    try {
        const newIssue = await Issue.create(req.body);

        res.status(201).json({
            success: true,
            message: `Document inserted into MongoDB collection successfully. Ticket ID: ${newIssue.ticketId}`,
            data: newIssue
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an issue document in MongoDB
// @route   PUT /api/issues/:id
exports.updateIssue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await Issue.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: `Document with ID '${id}' not found for update.`
            });
        }

        res.status(200).json({
            success: true,
            message: `Issue '${updated.ticketId || id}' updated in MongoDB collection.`,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update only the status of an issue (PATCH)
// @route   PATCH /api/issues/:id/status
exports.updateIssueStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status ('Pending', 'In Progress', 'Resolved') is required."
            });
        }

        const updated = await Issue.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: `Issue with ID '${id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: `Status updated to '${status}' in MongoDB.`,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove an issue document from MongoDB collection
// @route   DELETE /api/issues/:id
exports.deleteIssue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Issue.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: `Document with ID '${id}' does not exist in MongoDB.`
            });
        }

        res.status(200).json({
            success: true,
            message: `Document '${deleted.ticketId || id}' permanently removed from MongoDB collection.`,
            deletedData: deleted
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Aggregate statistical counts from MongoDB collection
// @route   GET /api/issues/stats/summary
exports.getSummary = async (req, res, next) => {
    try {
        const all = await Issue.find({});
        const total = all.length;
        const pending = all.filter(i => i.status === 'Pending').length;
        const inProgress = all.filter(i => i.status === 'In Progress').length;
        const resolved = all.filter(i => i.status === 'Resolved').length;

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
                categoryCounts
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Seed sample issues into MongoDB collection
// @route   POST /api/issues/seed
exports.seedIssues = async (req, res, next) => {
    try {
        const seeded = await Issue.seedDefaults();
        res.status(200).json({
            success: true,
            message: "MongoDB collection seeded with initial campus maintenance records.",
            count: seeded.length,
            data: seeded
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Database connection status check
// @route   GET /api/db-status
exports.getDbHealth = (req, res) => {
    res.status(200).json({
        success: true,
        dbInfo: getDbInfo()
    });
};
