const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { getAccessToken } = require('./auth');
const mockData = require('../data/mockData');

// GET /api/graph/users — get real users from tenant
router.get('/users', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/users?$select=id,displayName,mail,jobTitle,department&$top=20',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ success: true, data: data.value, source: 'live' });
  } catch (err) {
    // Fallback to mock
    res.json({ success: true, data: mockData.getParticipants(), source: 'mock', error: err.message });
  }
});

// GET /api/graph/meetings — get real call records
router.get('/meetings', async (req, res) => {
  try {
    const token = await getAccessToken();
    // Get call records from last 30 days
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/communications/callRecords?$filter=startDateTime ge ${since}&$top=20`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // Transform to EngageIQ format
    const meetings = (data.value || []).map(record => ({
      id: record.id,
      type: record.type,
      startTime: record.startDateTime,
      endTime: record.endDateTime,
      duration: Math.round((new Date(record.endDateTime) - new Date(record.startDateTime)) / 60000),
      participants: record.participants ? record.participants.length : 0,
      modalities: record.modalities || []
    }));

    res.json({
      success: true,
      data: meetings,
      count: meetings.length,
      source: 'live',
      message: meetings.length === 0
        ? 'No meetings found in last 30 days. Create a test meeting in Teams first.'
        : `Found ${meetings.length} real meetings`
    });
  } catch (err) {
    res.json({
      success: true,
      data: mockData.getAllData('all').meetingTypes,
      source: 'mock',
      error: err.message,
      message: 'Using mock data — ' + err.message
    });
  }
});

// GET /api/graph/test — simple connection test
router.get('/test', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await fetch('https://graph.microsoft.com/v1.0/organization', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const org = data.value ? data.value[0] : {};
    res.json({
      success: true,
      connected: true,
      organisation: org.displayName || 'Unknown',
      tenantId: org.id,
      message: '✅ Microsoft Graph API connected successfully!'
    });
  } catch (err) {
    res.json({
      success: false,
      connected: false,
      message: '❌ Connection failed: ' + err.message
    });
  }
});

module.exports = router;
