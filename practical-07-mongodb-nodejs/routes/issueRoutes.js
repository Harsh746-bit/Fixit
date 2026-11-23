/**
 * Issue Routes
 * Practical 07: MongoDB NoSQL Application Routes with RBAC Protection
 */

const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { validateIssueInput } = require('../middleware/validation');
const { authenticateUser, requireRole, USERS, ROLE_PERMISSIONS } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateUser);

// Database status & statistics
router.get('/db-status', issueController.getDbHealth);
router.get('/stats/summary', issueController.getSummary);
router.post('/seed', issueController.seedIssues);

// Role info endpoint
router.get('/roles', (req, res) => {
  res.status(200).json({
    success: true,
    currentUser: req.user,
    roles: USERS,
    permissions: ROLE_PERMISSIONS
  });
});

// CRUD routes protected by RBAC
router.route('/')
    .get(issueController.getIssues)
    .post(requireRole('student', 'staff', 'admin'), validateIssueInput, issueController.createIssue);

router.patch('/:id/status', requireRole('staff', 'admin'), issueController.updateIssueStatus);

router.route('/:id')
    .get(issueController.getIssueById)
    .put(requireRole('staff', 'admin'), validateIssueInput, issueController.updateIssue)
    .delete(requireRole('admin'), issueController.deleteIssue);

module.exports = router;
