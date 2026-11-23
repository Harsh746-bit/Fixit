/**
 * Validation & Error Handling Middleware
 * Practical 07: Node.js + Express + MongoDB NoSQL Application
 */

const VALID_CATEGORIES = ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Internet', 'Civil', 'General'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const validateIssueInput = (req, res, next) => {
    const isPost = req.method === 'POST';
    const { title, category, location, description, reporterName, reporterEmail, reporterPhone, priority, status } = req.body;
    const errors = [];

    // On POST, required fields must be present. On PUT/PATCH, only validate present fields.
    if (isPost || title !== undefined) {
        if (!title || typeof title !== 'string' || title.trim().length < 3) {
            errors.push("Title is required and must be at least 3 characters.");
        }
    }

    if (isPost || category !== undefined) {
        if (!category || !VALID_CATEGORIES.includes(category)) {
            errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
        }
    }

    if (isPost || location !== undefined) {
        if (!location || typeof location !== 'string' || location.trim().length === 0) {
            errors.push("Campus location is required.");
        }
    }

    if (isPost || description !== undefined) {
        if (!description || typeof description !== 'string' || description.trim().length < 10) {
            errors.push("Description is required and must be at least 10 characters long.");
        }
    }

    if (isPost || reporterName !== undefined) {
        if (!reporterName || typeof reporterName !== 'string' || reporterName.trim().length === 0) {
            errors.push("Reporter name is required.");
        }
    }

    if (isPost || reporterEmail !== undefined) {
        if (!reporterEmail || !EMAIL_REGEX.test(reporterEmail.trim())) {
            errors.push("Valid reporter email address is required.");
        }
    }

    if (reporterPhone) {
        if (!PHONE_REGEX.test(reporterPhone.toString().trim())) {
            errors.push("Reporter phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
        }
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed on user input.",
            errors: errors
        });
    }

    next();
};

const errorHandler = (err, req, res, next) => {
    console.error('[Practical 07 Error Handler]:', err.stack || err.message);

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid MongoDB ObjectId: '${err.value}' is not a valid 24-character hexadecimal string.`
        });
    }

    // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        const errorDetails = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: "Mongoose Schema Validation failed.",
            errors: errorDetails
        });
    }

    // MongoDB Duplicate Key Error (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `Duplicate key violation: Field '${field}' with value '${err.keyValue[field]}' already exists in database.`
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error occurred in database execution."
    });
};

module.exports = {
    validateIssueInput,
    errorHandler,
    VALID_CATEGORIES,
    VALID_PRIORITIES,
    VALID_STATUSES
};
