# EngageIQ — Teams Camera Intelligence

A Microsoft Teams camera engagement analytics dashboard powered by Claude AI.

## Quick Start (run locally)

1. Install Node.js from nodejs.org if not already installed
2. Open a terminal / command prompt in this folder
3. Run these commands:

```
npm install
node server.js
```

4. Open your browser and go to: http://localhost:3000

That's it! The app runs with mock data by default.

## Project Structure

```
engageiq/
├── server.js              ← Main backend server
├── package.json           ← Dependencies
├── .env.example           ← Environment variables template
├── .gitignore
├── data/
│   └── mockData.js        ← Mock data (mirrors Graph API structure)
├── routes/
│   ├── meetings.js        ← Meetings API endpoints
│   └── insights.js        ← Claude AI insights endpoint
└── frontend/
    └── index.html         ← Full dashboard UI
```

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/meetings?filter=all&dept=all` — Get meeting data
- `GET /api/meetings/participants` — Get participant list
- `GET /api/meetings/departments` — Get department breakdown
- `GET /api/insights?filter=all` — Get AI insight

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
PORT=3000
USE_REAL_DATA=false
CLAUDE_API_KEY=your_key_here        # Optional: enables live AI insights
AZURE_TENANT_ID=your_tenant_id      # Only needed for real Teams data
AZURE_CLIENT_ID=your_client_id      # Only needed for real Teams data
AZURE_CLIENT_SECRET=your_secret     # Only needed for real Teams data
```

## Deploy to Render.com (free hosting)

1. Push this folder to a GitHub repo
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add environment variables in Render dashboard
7. Deploy — you get a live URL!

## Connect Real Teams Data

When ready to use real Microsoft Teams data:

1. Register an Azure AD app with these permissions:
   - CallRecords.Read.All
   - OnlineMeetings.Read.All
   - User.Read.All

2. Set in your .env:
   ```
   USE_REAL_DATA=true
   AZURE_TENANT_ID=your_tenant_id
   AZURE_CLIENT_ID=your_client_id
   AZURE_CLIENT_SECRET=your_secret
   ```

3. In `data/mockData.js`, the comment at the top shows exactly
   which Graph API call to replace the mock data with.

## Built with
- Node.js + Express
- Chart.js
- Claude AI (Anthropic)
- Microsoft Graph API (optional)
