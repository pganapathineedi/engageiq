const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');
const fetch = require('node-fetch');

// GET /api/insights?filter=all
// Returns pre-written insight for mock data, or calls Claude API if key is set
router.get('/', async (req, res) => {
  try {
    const { filter = 'all' } = req.query;

    // If Claude API key is configured, generate a live insight
    if (process.env.CLAUDE_API_KEY) {
      const summary = mockData.getSummary(filter);
      const departments = mockData.getDepartments();
      const deptSummary = departments.map(d => `${d.name}: ${Math.round(d.cameraRate * 100)}%`).join(', ');

      const prompt = `You are an AI analyst for EngageIQ, a Microsoft Teams camera engagement tool.

Meeting filter: ${filter === 'all' ? 'All meetings' : filter}
Average camera on rate: ${summary.avgCamera}%
Total meetings: ${summary.meetings}
Participants: ${summary.participants}
Average duration: ${summary.avgDuration} minutes
Trend: ${summary.trend} vs last month
Department breakdown: ${deptSummary}

Write a concise 2-3 sentence insight for a manager. Highlight what's positive, what needs attention, and one specific recommendation. Be direct and actionable. No bullet points, just plain text.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const aiData = await response.json();

      if (aiData.content && aiData.content[0]) {
        return res.json({
          success: true,
          insight: aiData.content[0].text,
          source: 'claude-live'
        });
      }
    }

    // Fallback to mock insight
    res.json({
      success: true,
      insight: mockData.getInsight(filter),
      source: 'mock'
    });

  } catch (err) {
    // Always return something even if Claude API fails
    const { filter = 'all' } = req.query;
    res.json({
      success: true,
      insight: mockData.getInsight(filter),
      source: 'mock-fallback'
    });
  }
});

module.exports = router;
