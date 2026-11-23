/**
 * Automated Verification Script for Practical 07: MongoDB NoSQL Web App
 * Verifies both HTML Web App delivery and all REST API endpoints
 * Run via: npm run test:endpoints
 */

const http = require('http');

const PORT = 5099; // Dedicated test port
process.env.PORT = PORT;
process.env.NODE_ENV = 'test';

const app = require('./server');
let server;

const request = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ status: res.statusCode, headers: res.headers, data: parsed });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
};

const runVerification = async () => {
    console.log(`\n===============================================================`);
    console.log(`FixIt Practical 07: Running Automated MongoDB App Verification`);
    console.log(`===============================================================\n`);

    server = app.listen(PORT);
    await new Promise(r => setTimeout(r, 600));

    let createdId = null;
    let passed = 0;
    let failed = 0;

    const assert = (name, condition, details = "") => {
        if (condition) {
            console.log(`  ✅ [PASS] ${name}`);
            passed++;
        } else {
            console.error(`  ❌ [FAIL] ${name} -> ${details}`);
            failed++;
        }
    };

    try {
        // 1. Browser Web Application Serves HTML
        const webUI = await request('GET', '/');
        assert("GET / (Web Browser UI delivers HTML5 index)", webUI.status === 200 && typeof webUI.data === 'string' && webUI.data.includes('FixIt'));

        // 2. Database Status Check
        const dbStatus = await request('GET', '/api/db-status');
        assert("GET /api/db-status (MongoDB metadata check)", dbStatus.status === 200 && dbStatus.data.dbInfo && dbStatus.data.dbInfo.database);

        // 3. Read All Issues
        const issuesRes = await request('GET', '/api/issues');
        assert("GET /api/issues (Read All Issues from MongoDB)", issuesRes.status === 200 && Array.isArray(issuesRes.data.data));

        // 4. Create Issue Document (POST)
        const newIssuePayload = {
            title: "Chemistry Lab Fume Hood Blower Stalled",
            category: "HVAC",
            location: "Chemistry Department - Lab 4B",
            priority: "Critical",
            status: "Pending",
            description: "Exhaust blower belt has slipped, chemical vapors lingering inside organic chamber.",
            reporterName: "Dr. Kavita Verma",
            reporterEmail: "kavita.v@campus.edu",
            reporterPhone: "9834567890"
        };
        const createRes = await request('POST', '/api/issues', newIssuePayload);
        assert("POST /api/issues (Create Document with Mongoose Validation)", createRes.status === 201 && createRes.data.data._id);
        if (createRes.data.data) {
            createdId = createRes.data.data._id;
        }

        // 5. Validation Error Handling Test (400 Bad Request)
        const badPayload = { title: "X", category: "BadCat", description: "short" };
        const failRes = await request('POST', '/api/issues', badPayload);
        assert("POST /api/issues [Mongoose Validation Error -> 400 Bad Request]", failRes.status === 400 && Array.isArray(failRes.data.errors));

        // 6. Read Single Issue by ID
        const getOne = await request('GET', `/api/issues/${createdId}`);
        assert("GET /api/issues/:id (Read Single Document by ID)", getOne.status === 200 && getOne.data.data.title === newIssuePayload.title);

        // 7. Full Document Update (PUT)
        const updatePayload = {
            title: "Chemistry Lab Fume Hood Blower - Repaired",
            category: "HVAC",
            location: "Chemistry Department - Lab 4B",
            priority: "Critical",
            status: "In Progress",
            description: "Replacement drive belt fitted; checking airflow pressure meter.",
            reporterName: "Dr. Kavita Verma",
            reporterEmail: "kavita.v@campus.edu",
            reporterPhone: "9834567890"
        };
        const updateRes = await request('PUT', `/api/issues/${createdId}`, updatePayload);
        assert("PUT /api/issues/:id (Full Document Update)", updateRes.status === 200 && updateRes.data.data.status === "In Progress");

        // 8. Status Transition (PATCH)
        const patchRes = await request('PATCH', `/api/issues/${createdId}/status`, { status: "Resolved" });
        assert("PATCH /api/issues/:id/status (Partial Status Transition)", patchRes.status === 200 && patchRes.data.data.status === "Resolved");

        // 9. Statistics Summary
        const statsRes = await request('GET', '/api/issues/stats/summary');
        assert("GET /api/issues/stats/summary (Aggregate Summary Metrics)", statsRes.status === 200 && statsRes.data.data.total >= 1);

        // 10. Delete Document (DELETE)
        const delRes = await request('DELETE', `/api/issues/${createdId}`);
        assert("DELETE /api/issues/:id (Remove Document from MongoDB)", delRes.status === 200 && delRes.data.success === true);

        // 11. Verify Deletion (404 Not Found)
        const verify404 = await request('GET', `/api/issues/${createdId}`);
        assert("GET /api/issues/:id [Post-Delete Verification -> 404 Not Found]", verify404.status === 404);

    } catch (e) {
        console.error("Test execution error:", e);
        failed++;
    } finally {
        server.close();
        console.log(`\n---------------------------------------------------------------`);
        console.log(`Verification Summary: Passed: ${passed} | Failed: ${failed}`);
        console.log(`Status: ${failed === 0 ? "🎉 ALL PRACTICAL 07 ENDPOINTS & WEB UI VERIFIED!" : "⚠️ SOME TESTS FAILED"}`);
        console.log(`---------------------------------------------------------------\n`);
        process.exit(failed === 0 ? 0 : 1);
    }
};

runVerification();
