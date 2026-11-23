/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 05: Express Validation Middleware
 * ==============================================================================
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const ALLOWED_CATEGORIES = ['Electrical', 'Plumbing', 'Internet', 'Furniture', 'Cleaning', 'Equipment'];
const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Resolved'];

/**
 * Middleware: Validates new issue creation body (POST /api/issues)
 */
function validateIssueCreation(req, res, next) {
    const { name, email, category, priority, location, description, contact } = req.body;
    const errors = [];

    // 1. Student / Staff Name
    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push("Field 'name' is required and cannot be empty.");
    }

    // 2. Email Address
    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.push("Field 'email' is required.");
    } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.push("Field 'email' must be a valid email format.");
    }

    // 3. Category
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
        errors.push(`Field 'category' is required. Allowed values: ${ALLOWED_CATEGORIES.join(', ')}.`);
    }

    // 4. Priority
    if (!priority || !ALLOWED_PRIORITIES.includes(priority)) {
        errors.push(`Field 'priority' is required. Allowed values: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }

    // 5. Location
    if (!location || typeof location !== 'string' || !location.trim()) {
        errors.push("Field 'location' is required.");
    }

    // 6. Description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
        errors.push("Field 'description' is required and must contain at least 10 characters.");
    }

    // 7. Optional Contact Number
    if (contact && typeof contact === 'string' && contact.trim()) {
        if (!INDIAN_MOBILE_REGEX.test(contact.trim())) {
            errors.push("Field 'contact' if provided must be a valid 10-digit Indian mobile number (e.g. 9876543210).");
        }
    }

    // If validation fails, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed for new issue creation.",
            errors: errors
        });
    }

    // Sanitize and forward
    req.body.name = name.trim();
    req.body.email = email.trim();
    req.body.location = location.trim();
    req.body.description = description.trim();
    if (contact) req.body.contact = contact.trim();

    next();
}

/**
 * Middleware: Validates status update body (PATCH /api/issues/:id/status)
 */
function validateStatusUpdate(req, res, next) {
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status '${status}'. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}.`
        });
    }

    next();
}

module.exports = {
    validateIssueCreation,
    validateStatusUpdate,
    ALLOWED_CATEGORIES,
    ALLOWED_PRIORITIES,
    ALLOWED_STATUSES
};
