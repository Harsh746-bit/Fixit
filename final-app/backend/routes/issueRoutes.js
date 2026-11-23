const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { validateIssueCreation, validateStatusUpdate } = require('../middleware/validation');
const { authenticateUser, requireRole } = require('../middleware/auth');

// Apply authentication to all /issues routes
router.use(authenticateUser);

// Public / Read-only for all roles
router.get('/issues', issueController.getAllIssues);
router.get('/statistics', issueController.getStatistics);
router.get('/issues/:id', issueController.getIssueById);

// Creation: Accessible by students, staff, and admin
router.post(
  '/issues',
  requireRole('student', 'staff', 'admin'),
  validateIssueCreation,
  issueController.createIssue
);

// Status Transition: ONLY accessible by staff (technicians) and admin
router.patch(
  '/issues/:id/status',
  requireRole('staff', 'admin'),
  validateStatusUpdate,
  issueController.updateIssueStatus
);

// Deletion: STRICTLY restricted to administrator only
router.delete(
  '/issues/:id',
  requireRole('admin'),
  issueController.deleteIssue
);

module.exports = router;
