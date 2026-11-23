const express = require('express');
const cors = require('cors');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[Final App Backend] ${new Date().toISOString()} | ${req.method} ${req.url} | Role: ${req.headers['x-user-role'] || 'token/default'}`);
    next();
});

// Authentication & Role Routes
app.use('/api/auth', authRoutes);

// Issue Management API Routes (Protected by RBAC)
app.use('/api', issueRoutes);

const path = require('path');
const fs = require('fs');

// Path to compiled React frontend
const frontendDistPath = path.join(__dirname, '../frontend/dist');

// Serve React SPA in Production if built
if (fs.existsSync(frontendDistPath)) {
    console.log(`[Production Ready] Serving React UI from ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    app.get('/api-info', (req, res) => {
        res.status(200).json({
            project: "FixIt — Smart Campus Maintenance Management System (Final Full-Stack)",
            stack: "ReactJS + Bootstrap 5 + ExpressJS + Node.js",
            rbac: {
                enabled: true,
                roles: ["student", "staff", "admin"],
                authEndpoints: {
                    login: "POST /api/auth/login",
                    switchRole: "POST /api/auth/switch-role",
                    profile: "GET /api/auth/me",
                    roleMatrix: "GET /api/auth/roles"
                }
            },
            status: "Online and RBAC protected"
        });
    });

    // Client-side SPA routing fallback
    app.get('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
} else {
    // Root Status & RBAC Directory when running in dev without dist
    app.get('/', (req, res) => {
        res.status(200).json({
            project: "FixIt — Smart Campus Maintenance Management System (Final Full-Stack)",
            stack: "ReactJS + Bootstrap 5 + ExpressJS + Node.js",
            rbac: {
                enabled: true,
                roles: ["student", "staff", "admin"],
                authEndpoints: {
                    login: "POST /api/auth/login",
                    switchRole: "POST /api/auth/switch-role",
                    profile: "GET /api/auth/me",
                    roleMatrix: "GET /api/auth/roles"
                },
                permissions: {
                    student: ["view_issues", "create_issue"],
                    staff: ["view_issues", "create_issue", "update_status"],
                    admin: ["view_issues", "create_issue", "update_status", "delete_issue", "system_admin"]
                }
            },
            status: "Backend API is online and RBAC protected",
            endpoints: {
                issues: "/api/issues",
                statistics: "/api/statistics"
            }
        });
    });
}

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint '${req.method} ${req.originalUrl}' not found.`
    });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('[Final Backend Error]:', err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`FixIt Final Full-Stack Backend running at http://localhost:${PORT}`);
    console.log(`REST Endpoints: http://localhost:${PORT}/api/issues`);
    console.log(`RBAC Active:    http://localhost:${PORT}/api/auth/roles`);
    console.log(`=======================================================`);
});

module.exports = app;
