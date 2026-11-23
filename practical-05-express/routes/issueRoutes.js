/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 05: Express REST Routes
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { validateIssueCreation, validateStatusUpdate } = require('../middleware/validation');

// 1. GET /api/issues - Return all issues (with optional filter query parameters)
router.get('/issues', issueController.getAllIssues);

// 2. GET /api/statistics - Return dynamically calculated summary metrics
router.get('/statistics', issueController.getStatistics);

// 3. GET /api/issues/:id - Return a specific issue by ID
router.get('/issues/:id', issueController.getIssueById);

// 4. POST /api/issues - Create a new issue (with validation middleware)
router.post('/issues', validateIssueCreation, issueController.createIssue);

// 5. PATCH /api/issues/:id/status - Update an issue's status
router.patch('/issues/:id/status', validateStatusUpdate, issueController.updateIssueStatus);

// 6. DELETE /api/issues/:id - Delete an issue by ID
router.delete('/issues/:id', issueController.deleteIssue);

module.exports = router;
