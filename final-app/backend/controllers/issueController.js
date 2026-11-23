const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'issues.json');

function readIssues() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('[Final Backend Controller] Error reading JSON database:', err);
        return [];
    }
}

function writeIssues(issues) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(issues, null, 2), 'utf8');
}

function getAllIssues(req, res) {
    try {
        const issues = readIssues();
        const { search, category, status, priority } = req.query;

        let filtered = issues;

        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(i =>
                i.id.toLowerCase().includes(s) ||
                i.location.toLowerCase().includes(s) ||
                i.description.toLowerCase().includes(s) ||
                i.name.toLowerCase().includes(s)
            );
        }

        if (category && category !== 'All') {
            filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
        }

        if (status && status !== 'All') {
            filtered = filtered.filter(i => i.status.toLowerCase() === status.toLowerCase());
        }

        if (priority && priority !== 'All') {
            filtered = filtered.filter(i => i.priority.toLowerCase() === priority.toLowerCase());
        }

        return res.status(200).json({
            success: true,
            total: issues.length,
            count: filtered.length,
            data: filtered
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch issues.",
            error: error.message
        });
    }
}

function getIssueById(req, res) {
    try {
        const { id } = req.params;
        const issues = readIssues();
        const found = issues.find(i => i.id.toUpperCase() === id.toUpperCase());

        if (!found) {
            return res.status(404).json({
                success: false,
                message: `Ticket with ID '${id}' not found.`
            });
        }

        return res.status(200).json({
            success: true,
            data: found
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching ticket.",
            error: error.message
        });
    }
}

function createIssue(req, res) {
    try {
        const { name, email, category, priority, location, description, contact } = req.body;
        const issues = readIssues();

        let maxId = 1000;
        issues.forEach(i => {
            const match = i.id && i.id.match(/^FIX-(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxId) maxId = num;
            }
        });
        const generatedId = `FIX-${maxId + 1}`;
        const todayDate = new Date().toISOString().split('T')[0];

        const newIssue = {
            id: generatedId,
            name,
            email,
            category,
            priority,
            location,
            description,
            contact: contact || "",
            status: "Pending",
            date: todayDate
        };

        issues.unshift(newIssue);
        writeIssues(issues);

        return res.status(201).json({
            success: true,
            message: "Issue reported successfully.",
            referenceId: generatedId,
            data: newIssue
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating issue.",
            error: error.message
        });
    }
}

function updateIssueStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const issues = readIssues();
        const targetIndex = issues.findIndex(i => i.id.toUpperCase() === id.toUpperCase());

        if (targetIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Ticket with ID '${id}' not found.`
            });
        }

        issues[targetIndex].status = status;
        writeIssues(issues);

        return res.status(200).json({
            success: true,
            message: `Ticket '${id}' status updated to '${status}'.`,
            data: issues[targetIndex]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating status.",
            error: error.message
        });
    }
}

function deleteIssue(req, res) {
    try {
        const { id } = req.params;
        const issues = readIssues();
        const targetIndex = issues.findIndex(i => i.id.toUpperCase() === id.toUpperCase());

        if (targetIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Ticket with ID '${id}' not found.`
            });
        }

        const deleted = issues.splice(targetIndex, 1)[0];
        writeIssues(issues);

        return res.status(200).json({
            success: true,
            message: `Ticket '${id}' deleted successfully.`,
            deletedIssue: deleted
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting ticket.",
            error: error.message
        });
    }
}

function getStatistics(req, res) {
    try {
        const issues = readIssues();
        const stats = {
            total: issues.length,
            pending: issues.filter(i => i.status === 'Pending').length,
            inProgress: issues.filter(i => i.status === 'In Progress').length,
            resolved: issues.filter(i => i.status === 'Resolved').length
        };

        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error computing statistics.",
            error: error.message
        });
    }
}

module.exports = {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssueStatus,
    deleteIssue,
    getStatistics
};
