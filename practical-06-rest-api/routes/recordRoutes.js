/**
 * Record Routes
 * Practical 06: RESTful API Endpoint Definitions
 */

const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { validateRecordCreation, validateRecordUpdate } = require('../middleware/validateRecord');

// Static / aggregate routes first
router.get('/stats/summary', recordController.getStatistics);
router.post('/seed', recordController.seedRecords);

// Collection routes
router.route('/')
    .get(recordController.getAllRecords)
    .post(validateRecordCreation, recordController.createRecord);

// Individual record routes by ID
router.route('/:id')
    .get(recordController.getRecordById)
    .put(validateRecordUpdate, recordController.updateRecord)
    .patch(validateRecordUpdate, recordController.updateRecord)
    .delete(recordController.deleteRecord);

module.exports = router;
