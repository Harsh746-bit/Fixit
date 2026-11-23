/**
 * Automated RBAC Verification Test Suite
 * Tests role permissions across Student, Staff, and Administrator
 * Run via: node test-rbac.js
 */

const http = require('http');

const PORT = 5000;

function sendRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: reqHeaders
    };

    const req = http.request(options, res => {
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
}

async function runRbacTests() {
  console.log('===============================================================');
  console.log('FixIt RBAC (Role-Based Access Control) Automated Test Suite');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (title, condition, details = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} -> ${details}`);
      failed++;
    }
  };

  try {
    // 1. Student Permissions
    console.log('--- 1. Testing Student Role Permissions ---');
    const studentHeaders = { 'x-user-role': 'student' };

    const getRes = await sendRequest('GET', '/api/issues', null, studentHeaders);
    assert('Student CAN view campus tickets (GET /api/issues)', getRes.status === 200);

    const targetIssueId = getRes.data.data[0].id;

    // Student attempting status change -> MUST be 403 Forbidden
    const studentPatchRes = await sendRequest('PATCH', `/api/issues/${targetIssueId}/status`, { status: 'Resolved' }, studentHeaders);
    assert('Student CANNOT change status (PATCH /api/issues/:id/status -> 403 Forbidden)', studentPatchRes.status === 403 && studentPatchRes.data.error === 'Forbidden');

    // Student attempting delete -> MUST be 403 Forbidden
    const studentDelRes = await sendRequest('DELETE', `/api/issues/${targetIssueId}`, null, studentHeaders);
    assert('Student CANNOT delete tickets (DELETE /api/issues/:id -> 403 Forbidden)', studentDelRes.status === 403 && studentDelRes.data.error === 'Forbidden');

    // 2. Staff / Technician Permissions
    console.log('\n--- 2. Testing Staff / Technician Role Permissions ---');
    const staffHeaders = { 'x-user-role': 'staff' };

    // Staff attempting status change -> MUST be 200 OK
    const staffPatchRes = await sendRequest('PATCH', `/api/issues/${targetIssueId}/status`, { status: 'In Progress' }, staffHeaders);
    assert('Staff CAN change ticket status (PATCH /api/issues/:id/status -> 200 OK)', staffPatchRes.status === 200 && staffPatchRes.data.success);

    // Staff attempting delete -> MUST be 403 Forbidden
    const staffDelRes = await sendRequest('DELETE', `/api/issues/${targetIssueId}`, null, staffHeaders);
    assert('Staff CANNOT delete tickets (DELETE /api/issues/:id -> 403 Forbidden)', staffDelRes.status === 403 && staffDelRes.data.error === 'Forbidden');

    // 3. Administrator Permissions
    console.log('\n--- 3. Testing Administrator Role Permissions ---');
    const adminHeaders = { 'x-user-role': 'admin' };

    // Admin creating ticket
    const newTicketPayload = {
      name: 'Admin Test User',
      email: 'admin.test@campus.edu',
      category: 'Electrical',
      priority: 'High',
      location: 'Administrative Block - Office 101',
      description: 'Temporary surge protector testing ticket for RBAC verification.'
    };
    const adminCreateRes = await sendRequest('POST', '/api/issues', newTicketPayload, adminHeaders);
    assert('Admin CAN create tickets (POST /api/issues -> 201 Created)', adminCreateRes.status === 201);
    const createdId = adminCreateRes.data.data.id;

    // Admin updating status
    const adminPatchRes = await sendRequest('PATCH', `/api/issues/${createdId}/status`, { status: 'Resolved' }, adminHeaders);
    assert('Admin CAN update ticket status (PATCH /api/issues/:id/status -> 200 OK)', adminPatchRes.status === 200);

    // Admin deleting ticket -> MUST be 200 OK
    const adminDelRes = await sendRequest('DELETE', `/api/issues/${createdId}`, null, adminHeaders);
    assert('Admin CAN delete tickets (DELETE /api/issues/:id -> 200 OK)', adminDelRes.status === 200 && adminDelRes.data.success);

    // 4. Role Matrix & Auth Endpoints
    console.log('\n--- 4. Testing Auth & Role Endpoints ---');
    const authRolesRes = await sendRequest('GET', '/api/auth/roles');
    assert('Auth Role Matrix endpoint active (GET /api/auth/roles -> 200 OK)', authRolesRes.status === 200 && authRolesRes.data.permissionsMatrix);

    const switchRoleRes = await sendRequest('POST', '/api/auth/switch-role', { role: 'admin' });
    assert('Role Switch endpoint active (POST /api/auth/switch-role -> 200 OK)', switchRoleRes.status === 200 && switchRoleRes.data.token);

  } catch (err) {
    console.error('RBAC test encountered error:', err);
    failed++;
  } finally {
    console.log('\n===============================================================');
    console.log(`RBAC Test Results: Passed: ${passed} | Failed: ${failed}`);
    console.log(`Status: ${failed === 0 ? '🎉 ALL RBAC ACCESS CONTROLS VERIFIED!' : '⚠️ SOME RBAC TESTS FAILED'}`);
    console.log('===============================================================\n');
    process.exit(failed === 0 ? 0 : 1);
  }
}

runRbacTests();
