const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

// GET /api/meetings
// Query params: filter (all|standup|1on1|allhands|townhall), dept (all|engineering|product|sales|operations|support)
router.get('/', (req, res) => {
  try {
    const { filter = 'all', dept = 'all' } = req.query;
    const data = mockData.getAllData(filter, dept);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/meetings/summary
router.get('/summary', (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    res.json({ success: true, data: mockData.getSummary(filter) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/meetings/trend
router.get('/trend', (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    res.json({ success: true, data: mockData.getTrend(filter) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/meetings/participants
router.get('/participants', (req, res) => {
  try {
    res.json({ success: true, data: mockData.getParticipants() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/meetings/departments
router.get('/departments', (req, res) => {
  try {
    res.json({ success: true, data: mockData.getDepartments() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
