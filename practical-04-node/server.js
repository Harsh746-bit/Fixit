/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 04: Native Node.js HTTP Server (Without Express)
 * ==============================================================================
 * 
 * Core Node.js Modules Demonstrated:
 * - 'http': Creating HTTP server, request streaming, and response header handling
 * - 'fs': Asynchronous file system reading and writing for data persistence
 * - 'path': Resolving cross-platform file paths
 * - 'url': Parsing request URLs, pathnames, and search parameters
 * 
 * HTTP Endpoints Implemented:
 * - GET  /                 -> API status & documentation HTML/JSON overview
 * - GET  /api/issues       -> Retrieve all issues (supports ?id=, ?category=, ?status=)
 * - POST /api/issues       -> Create a new issue with streaming body parsing & validation
 * - GET  /api/statistics   -> Dynamic counts (total, pending, inProgress, resolved)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data', 'issues.json');

/**
 * Helper function to send standard JSON responses with CORS headers
 */
function sendJsonResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data, null, 2));
}

/**
 * Helper function to safely read issues from JSON file
 */
function readIssuesFromFile(callback) {
    fs.readFile(DATA_FILE, 'utf8', (err, rawData) => {
        if (err) {
            console.error('[Practical 04 Server] Error reading data file:', err);
            return callback(err, null);
        }
        try {
            const issues = JSON.parse(rawData);
            callback(null, issues);
        } catch (parseErr) {
            console.error('[Practical 04 Server] Error parsing JSON:', parseErr);
            callback(parseErr, null);
        }
    });
}

/**
 * Helper function to persist issues array back to JSON file
 */
function writeIssuesToFile(issues, callback) {
    const serialized = JSON.stringify(issues, null, 2);
    fs.writeFile(DATA_FILE, serialized, 'utf8', (err) => {
        if (err) {
            console.error('[Practical 04 Server] Error writing to data file:', err);
            return callback(err);
        }
        callback(null);
    });
}

/**
 * Native Node.js HTTP Server Request Handler
 */
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    console.log(`[Practical 04 Server] ${new Date().toISOString()} | ${method} ${pathname}`);

    // Handle CORS Preflight Requests
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    // ==========================================
    // ROUTE 1: GET / (Root Welcome & Doc)
    // ==========================================
    if (pathname === '/' && method === 'GET') {
        return sendJsonResponse(res, 200, {
            project: "FixIt — Smart Campus Maintenance Management System",
            practical: "Practical 04 — Native Node.js HTTP Server",
            technologies: ["Node.js native http module", "fs (File System)", "url parser", "JSON persistence"],
            endpoints: [
                { method: "GET", path: "/api/issues", description: "Retrieve all maintenance tickets" },
                { method: "GET", path: "/api/issues?id=FIX-1001", description: "Retrieve single ticket by ID" },
                { method: "POST", path: "/api/issues", description: "Create a new maintenance ticket" },
                { method: "GET", path: "/api/statistics", description: "Retrieve issue counts by status" }
            ],
            status: "Server is online and healthy"
        });
    }

    // ==========================================
    // ROUTE 2: GET /api/issues
    // ==========================================
    if (pathname === '/api/issues' && method === 'GET') {
        readIssuesFromFile((err, issues) => {
            if (err) {
                return sendJsonResponse(res, 500, { success: false, message: "Internal server error reading issues data." });
            }

            const query = parsedUrl.query;

            // Optional filter by ID (?id=FIX-1001)
            if (query.id) {
                const target = issues.find(i => i.id.toUpperCase() === query.id.toUpperCase());
                if (!target) {
                    return sendJsonResponse(res, 404, { success: false, message: `Issue with ID '${query.id}' not found.` });
                }
                return sendJsonResponse(res, 200, { success: true, data: target });
            }

            // Optional filter by Category or Status
            let filtered = issues;
            if (query.category && query.category !== 'All') {
                filtered = filtered.filter(i => i.category.toLowerCase() === query.category.toLowerCase());
            }
            if (query.status && query.status !== 'All') {
                filtered = filtered.filter(i => i.status.toLowerCase() === query.status.toLowerCase());
            }

            return sendJsonResponse(res, 200, {
                success: true,
                count: filtered.length,
                totalInDatabase: issues.length,
                data: filtered
            });
        });
        return;
    }

    // ==========================================
    // ROUTE 3: GET /api/statistics
    // ==========================================
    if (pathname === '/api/statistics' && method === 'GET') {
        readIssuesFromFile((err, issues) => {
            if (err) {
                return sendJsonResponse(res, 500, { success: false, message: "Internal server error reading statistics." });
            }

            const stats = {
                total: issues.length,
                pending: issues.filter(i => i.status === "Pending").length,
                inProgress: issues.filter(i => i.status === "In Progress").length,
                resolved: issues.filter(i => i.status === "Resolved").length
            };

            return sendJsonResponse(res, 200, {
                success: true,
                data: stats
            });
        });
        return;
    }

    // ==========================================
    // ROUTE 4: POST /api/issues
    // ==========================================
    if (pathname === '/api/issues' && method === 'POST') {
        let bodyChunks = [];

        // Stream data chunks from incoming HTTP request
        req.on('data', chunk => {
            bodyChunks.push(chunk);
        });

        // When entire body stream has been received
        req.on('end', () => {
            const rawBody = Buffer.concat(bodyChunks).toString();

            let payload;
            try {
                payload = JSON.parse(rawBody);
            } catch (jsonErr) {
                return sendJsonResponse(res, 400, {
                    success: false,
                    message: "Invalid JSON format in request body."
                });
            }

            // Server-side validation
            const { name, email, category, priority, location, description, contact } = payload;
            const validationErrors = [];

            if (!name || !name.trim()) validationErrors.push("Student/Staff name is required.");
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validationErrors.push("A valid email address is required.");
            if (!category) validationErrors.push("Issue category is required.");
            if (!priority) validationErrors.push("Priority level is required.");
            if (!location || !location.trim()) validationErrors.push("Campus location is required.");
            if (!description || description.trim().length < 10) validationErrors.push("Description must contain at least 10 characters.");
            if (contact && !/^[6-9]\d{9}$/.test(contact.trim())) validationErrors.push("Contact number must be a valid 10-digit Indian mobile number.");

            if (validationErrors.length > 0) {
                return sendJsonResponse(res, 400, {
                    success: false,
                    message: "Validation failed.",
                    errors: validationErrors
                });
            }

            // Read existing issues, generate ID, and append
            readIssuesFromFile((err, issues) => {
                if (err) {
                    return sendJsonResponse(res, 500, { success: false, message: "Server error reading data file." });
                }

                // Generate ID from sequence
                let maxIdNum = 1000;
                issues.forEach(i => {
                    const match = i.id && i.id.match(/^FIX-(\d+)$/);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        if (num > maxIdNum) maxIdNum = num;
                    }
                });
                const newId = `FIX-${maxIdNum + 1}`;
                const todayDate = new Date().toISOString().split('T')[0];

                const newIssue = {
                    id: newId,
                    name: name.trim(),
                    email: email.trim(),
                    category: category,
                    priority: priority,
                    location: location.trim(),
                    description: description.trim(),
                    contact: contact ? contact.trim() : "",
                    status: "Pending",
                    date: todayDate
                };

                issues.unshift(newIssue);

                writeIssuesToFile(issues, (writeErr) => {
                    if (writeErr) {
                        return sendJsonResponse(res, 500, { success: false, message: "Error persisting new issue to disk." });
                    }

                    return sendJsonResponse(res, 201, {
                        success: true,
                        message: "Issue created successfully on native Node.js server.",
                        referenceId: newId,
                        data: newIssue
                    });
                });
            });
        });

        req.on('error', (reqErr) => {
            console.error('[Practical 04 Server] Request stream error:', reqErr);
            return sendJsonResponse(res, 500, { success: false, message: "Request error." });
        });

        return;
    }

    // ==========================================
    // 405 Method Not Allowed or 404 Route Not Found
    // ==========================================
    if (pathname.startsWith('/api/issues') || pathname.startsWith('/api/statistics')) {
        return sendJsonResponse(res, 405, {
            success: false,
            message: `HTTP Method '${method}' not supported on path '${pathname}'.`
        });
    }

    return sendJsonResponse(res, 404, {
        success: false,
        message: `Endpoint '${pathname}' was not found on this native Node.js server.`
    });
});

// Start listening
server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`FixIt — Practical 04: Native Node.js Server Active`);
    console.log(`Port: http://localhost:${PORT}`);
    console.log(`Test GET:  http://localhost:${PORT}/api/issues`);
    console.log(`Test Stats: http://localhost:${PORT}/api/statistics`);
    console.log(`=======================================================`);
});
