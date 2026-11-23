/**
 * Input Validation Middleware
 * Practical 06: RESTful API
 */

const VALID_CATEGORIES = ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Internet', 'Civil', 'General'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const validateRecordCreation = (req, res, next) => {
    const { title, category, location, description, reporterName, reporterEmail, reporterPhone, priority, status } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        errors.push("Field 'title' is required and must be at least 3 characters long.");
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
        errors.push(`Field 'category' must be one of: ${VALID_CATEGORIES.join(', ')}.`);
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
        errors.push("Field 'location' is required.");
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push("Field 'description' is required.");
    }

    if (!reporterName || typeof reporterName !== 'string' || reporterName.trim().length === 0) {
        errors.push("Field 'reporterName' is required.");
    }

    if (!reporterEmail || !EMAIL_REGEX.test(reporterEmail.trim())) {
        errors.push("Field 'reporterEmail' is required and must be a valid email format.");
    }

    if (reporterPhone && !PHONE_REGEX.test(reporterPhone.toString().trim())) {
        errors.push("Field 'reporterPhone' must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.");
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        errors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Field 'status' must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed for record creation.",
            errors: errors
        });
    }

    next();
};

const validateRecordUpdate = (req, res, next) => {
    const { category, priority, status, reporterEmail, reporterPhone } = req.body;
    const errors = [];

    if (category && !VALID_CATEGORIES.includes(category)) {
        errors.push(`Field 'category' must be one of: ${VALID_CATEGORIES.join(', ')}.`);
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        errors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Field 'status' must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    if (reporterEmail && !EMAIL_REGEX.test(reporterEmail.trim())) {
        errors.push("Field 'reporterEmail' must be a valid email address.");
    }

    if (reporterPhone && !PHONE_REGEX.test(reporterPhone.toString().trim())) {
        errors.push("Field 'reporterPhone' must be a valid 10-digit Indian mobile number.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed for record update.",
            errors: errors
        });
    }

    next();
};

module.exports = {
    validateRecordCreation,
    validateRecordUpdate,
    VALID_CATEGORIES,
    VALID_PRIORITIES,
    VALID_STATUSES
};
