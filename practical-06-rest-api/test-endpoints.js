/**
 * Automated Verification Script for Practical 06 RESTful API
 * Tests all CRUD endpoints and prints a test matrix
 * Run via: npm run test:endpoints
 */

const http = require('http');

const PORT = 5098; // Dedicated test port
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
                resolve({ status: res.statusCode, data: parsed });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
};

const runVerification = async () => {
    console.log(`\n===============================================================`);
    console.log(`FixIt Practical 06: Running Automated CRUD Endpoint Verification`);
    console.log(`===============================================================\n`);

    server = app.listen(PORT);
    // Allow brief time for server boot
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
        // 1. Health Check
        const health = await request('GET', '/');
        assert("GET / (Server Health & API Metadata)", health.status === 200 && health.data.project);

        // 2. Read All Records
        const readAll = await request('GET', '/api/records');
        assert("GET /api/records (Read All Records)", readAll.status === 200 && Array.isArray(readAll.data.data));

        // 3. Filter Records
        const filter = await request('GET', '/api/records?category=Electrical&status=Pending');
        assert("GET /api/records?category=Electrical (Filtered Query)", filter.status === 200 && filter.data.data.every(r => r.category === 'Electrical'));

        // 4. Create New Record (POST)
        const newRecordPayload = {
            title: "Smart Projector HDMI Cable Short Circuit",
            category: "Electrical",
            location: "Seminar Hall B - Podium",
            priority: "High",
            status: "Pending",
            description: "HDMI cable has physical tear and sparks occasionally when connected.",
            reporterName: "Dr. Ananya Roy",
            reporterEmail: "ananya.roy@campus.edu",
            reporterPhone: "9876543210",
            estimatedCost: 950
        };
        const createRes = await request('POST', '/api/records', newRecordPayload);
        assert("POST /api/records (Create New Record)", createRes.status === 201 && createRes.data.data._id);
        if (createRes.data.data) {
            createdId = createRes.data.data._id;
        }

        // 5. Create Validation Failure (400 Bad Request)
        const invalidPayload = { title: "X", category: "BadCategory" };
        const failRes = await request('POST', '/api/records', invalidPayload);
        assert("POST /api/records [Validation Failure -> 400 Bad Request]", failRes.status === 400 && Array.isArray(failRes.data.errors));

        // 6. Read Single Record by ID
        const getOne = await request('GET', `/api/records/${createdId}`);
        assert("GET /api/records/:id (Read Single Record by ID)", getOne.status === 200 && getOne.data.data.title === newRecordPayload.title);

        // 7. Full Update of Record (PUT)
        const putPayload = {
            title: "Smart Projector HDMI Cable Short Circuit - Replaced",
            category: "Electrical",
            location: "Seminar Hall B - Podium",
            priority: "Medium",
            status: "In Progress",
            description: "Technician replaced cable; testing signal integrity with podium PC.",
            reporterName: "Dr. Ananya Roy",
            reporterEmail: "ananya.roy@campus.edu",
            reporterPhone: "9876543210",
            estimatedCost: 1100
        };
        const putRes = await request('PUT', `/api/records/${createdId}`, putPayload);
        assert("PUT /api/records/:id (Full Record Update)", putRes.status === 200 && putRes.data.data.status === "In Progress");

        // 8. Partial Update of Record Status (PATCH)
        const patchRes = await request('PATCH', `/api/records/${createdId}`, { status: "Resolved" });
        assert("PATCH /api/records/:id (Partial Status Transition)", patchRes.status === 200 && patchRes.data.data.status === "Resolved");

        // 9. Statistics Summary
        const stats = await request('GET', '/api/records/stats/summary');
        assert("GET /api/records/stats/summary (Aggregate Metrics)", stats.status === 200 && stats.data.data.total > 0 && stats.data.data.resolved >= 1);

        // 10. Delete Record
        const delRes = await request('DELETE', `/api/records/${createdId}`);
        assert("DELETE /api/records/:id (Delete Record from Database)", delRes.status === 200 && delRes.data.success === true);

        // 11. Verify Deletion (404 Not Found)
        const verify404 = await request('GET', `/api/records/${createdId}`);
        assert("GET /api/records/:id [Post-Delete Check -> 404 Not Found]", verify404.status === 404);

    } catch (e) {
        console.error("Test execution encountered an error:", e);
        failed++;
    } finally {
        server.close();
        console.log(`\n---------------------------------------------------------------`);
        console.log(`Verification Summary: Passed: ${passed} | Failed: ${failed}`);
        console.log(`Status: ${failed === 0 ? "🎉 ALL PRACTICAL 06 ENDPOINTS VERIFIED!" : "⚠️ SOME TESTS FAILED"}`);
        console.log(`---------------------------------------------------------------\n`);
        process.exit(failed === 0 ? 0 : 1);
    }
};

runVerification();
