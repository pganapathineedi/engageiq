const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Get Microsoft access token using client credentials
async function getAccessToken() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default'
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description);
  return data.access_token;
}

// GET /api/auth/status — check if credentials work
router.get('/status', async (req, res) => {
  try {
    const token = await getAccessToken();
    if (token) {
      res.json({ success: true, status: 'connected', message: 'Microsoft Graph API connected successfully' });
    }
  } catch (err) {
    res.json({ success: false, status: 'error', message: err.message });
  }
});

// GET /api/auth/profile — get org info
router.get('/profile', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await fetch('https://graph.microsoft.com/v1.0/organization', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    res.json({ success: true, data: data.value ? data.value[0] : data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = { router, getAccessToken };
