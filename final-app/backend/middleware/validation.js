const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const ALLOWED_CATEGORIES = ['Electrical', 'Plumbing', 'Internet', 'Furniture', 'Cleaning', 'Equipment'];
const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Resolved'];

function validateIssueCreation(req, res, next) {
    const { name, email, category, priority, location, description, contact } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push("Field 'name' is required.");
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.push("Field 'email' is required.");
    } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.push("Field 'email' must be a valid email address.");
    }
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
        errors.push(`Field 'category' is required. Allowed: ${ALLOWED_CATEGORIES.join(', ')}.`);
    }
    if (!priority || !ALLOWED_PRIORITIES.includes(priority)) {
        errors.push(`Field 'priority' is required. Allowed: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
        errors.push("Field 'location' is required.");
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
        errors.push("Field 'description' is required and must contain at least 10 characters.");
    }
    if (contact && typeof contact === 'string' && contact.trim()) {
        if (!INDIAN_MOBILE_REGEX.test(contact.trim())) {
            errors.push("Field 'contact' must be a valid 10-digit Indian mobile number.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors
        });
    }

    req.body.name = name.trim();
    req.body.email = email.trim();
    req.body.location = location.trim();
    req.body.description = description.trim();
    if (contact) req.body.contact = contact.trim();

    next();
}

function validateStatusUpdate(req, res, next) {
    const { status } = req.body;
    if (!status || !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status '${status}'. Allowed: ${ALLOWED_STATUSES.join(', ')}.`
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
