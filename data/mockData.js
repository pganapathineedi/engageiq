// ============================================================
// MOCK DATA — mirrors Microsoft Graph API CallRecords exactly
// ============================================================
// To connect REAL Teams data later, replace this file's export
// with a call to: GET /communications/callRecords?$expand=sessions($expand=segments)
// That's the only change needed.
// ============================================================

const departments = ['Engineering', 'Product', 'Sales', 'Operations', 'Support'];

const participants = [
  { id: 'u001', name: 'Ananya Kumar',    initials: 'AK', role: 'Engineering Lead',    dept: 'Engineering', cameraRate: 0.94 },
  { id: 'u002', name: 'Marcus Silva',    initials: 'MS', role: 'Product Manager',      dept: 'Product',     cameraRate: 0.88 },
  { id: 'u003', name: 'Priya Laxman',   initials: 'PL', role: 'Scrum Master',          dept: 'Engineering', cameraRate: 0.81 },
  { id: 'u004', name: 'James Tran',     initials: 'JT', role: 'Solutions Architect',   dept: 'Sales',       cameraRate: 0.54 },
  { id: 'u005', name: 'Rita Nair',      initials: 'RN', role: 'Support Lead',          dept: 'Support',     cameraRate: 0.29 },
  { id: 'u006', name: 'David Chen',     initials: 'DC', role: 'DevOps Engineer',        dept: 'Engineering', cameraRate: 0.76 },
  { id: 'u007', name: 'Sarah Johnson',  initials: 'SJ', role: 'Sales Director',         dept: 'Sales',       cameraRate: 0.68 },
  { id: 'u008', name: 'Omar Hassan',    initials: 'OH', role: 'Operations Manager',     dept: 'Operations',  cameraRate: 0.44 },
  { id: 'u009', name: 'Lisa Park',      initials: 'LP', role: 'UX Designer',            dept: 'Product',     cameraRate: 0.82 },
  { id: 'u010', name: 'Tom Williams',   initials: 'TW', role: 'Support Analyst',        dept: 'Support',     cameraRate: 0.31 },
];

const meetingTypes = ['standup', '1on1', 'allhands', 'townhall'];

const meetingTypeConfig = {
  standup:  { label: 'Standup',   avgCamera: 0.78, avgDuration: 18, count: 112 },
  '1on1':   { label: '1-on-1',    avgCamera: 0.85, avgDuration: 28, count: 89  },
  allhands: { label: 'All-hands', avgCamera: 0.41, avgDuration: 45, count: 67  },
  townhall: { label: 'Town hall', avgCamera: 0.22, avgDuration: 55, count: 79  },
};

const deptConfig = {
  Engineering: { cameraRate: 0.72, color: '#1D9E75' },
  Product:     { cameraRate: 0.81, color: '#464EB8' },
  Sales:       { cameraRate: 0.68, color: '#EF9F27' },
  Operations:  { cameraRate: 0.44, color: '#EF9F27' },
  Support:     { cameraRate: 0.31, color: '#E24B4A' },
};

// Weekly trend data (4 weeks)
const weeklyTrend = {
  all:      { on: [54, 58, 61, 66], off: [46, 42, 39, 34] },
  standup:  { on: [68, 72, 74, 80], off: [32, 28, 26, 20] },
  '1on1':   { on: [78, 82, 84, 90], off: [22, 18, 16, 10] },
  allhands: { on: [32, 36, 39, 44], off: [68, 64, 61, 56] },
  townhall: { on: [15, 18, 21, 26], off: [85, 82, 79, 74] },
};

// Summary metrics per filter
const summaryMetrics = {
  all:      { avgCamera: 62, meetings: 347, participants: 1284, avgDuration: 34, trend: '+8%' },
  standup:  { avgCamera: 78, meetings: 112, participants: 448,  avgDuration: 18, trend: '+12%' },
  '1on1':   { avgCamera: 85, meetings: 89,  participants: 178,  avgDuration: 28, trend: '+5%' },
  allhands: { avgCamera: 41, meetings: 67,  participants: 536,  avgDuration: 45, trend: '-2%' },
  townhall: { avgCamera: 22, meetings: 79,  participants: 790,  avgDuration: 55, trend: '-5%' },
};

// AI insight text per filter
const aiInsights = {
  all:      `Camera engagement is up 8% month-on-month — a positive trend. However, Operations (44%) and Support (31%) are well below the company average of 62%. Large-format meetings like town halls show only 22% camera-on rates, suggesting participants feel less accountable in bigger groups. Consider splitting town halls into smaller team sessions of 15–20 people. 1-on-1s remain the strongest format at 85% — lean into this for coaching and performance conversations.`,
  standup:  `Standup camera engagement is strong at 78% and growing week-on-week. Engineering standups lead at 84% — consider sharing their format as a best practice template. Attendance is consistent. This is your healthiest meeting format.`,
  '1on1':   `1-on-1s are your top-performing format at 85%. This signals strong personal accountability between managers and their direct reports. Recommend increasing 1-on-1 frequency for teams like Support, where camera rates drop significantly in group settings.`,
  allhands: `All-hands meetings show 41% camera engagement. With 536 participants across 67 meetings, there is significant room for improvement. Try using breakout rooms, live polls, or direct call-outs to improve presence and accountability in these sessions.`,
  townhall: `Town halls have the lowest camera rate at 22%. With 790 participants across 79 meetings, this represents your biggest engagement gap. Restructure into smaller departmental sessions of 30–50 people for better connection and visibility.`,
};

module.exports = {
  getSummary: (filter = 'all') => summaryMetrics[filter] || summaryMetrics['all'],
  getTrend: (filter = 'all') => weeklyTrend[filter] || weeklyTrend['all'],
  getParticipants: () => participants,
  getDepartments: () => Object.entries(deptConfig).map(([name, d]) => ({ name, ...d })),
  getMeetingTypes: () => Object.entries(meetingTypeConfig).map(([key, d]) => ({ key, ...d })),
  getInsight: (filter = 'all') => aiInsights[filter] || aiInsights['all'],
  getAllData: (filter = 'all', dept = 'all') => ({
    summary: summaryMetrics[filter] || summaryMetrics['all'],
    trend: weeklyTrend[filter] || weeklyTrend['all'],
    participants,
    departments: Object.entries(deptConfig).map(([name, d]) => ({ name, ...d })),
    meetingTypes: Object.entries(meetingTypeConfig).map(([key, d]) => ({ key, ...d })),
    insight: aiInsights[filter] || aiInsights['all'],
    generatedAt: new Date().toISOString(),
    dataSource: 'mock', // Change to 'live' when connected to real Graph API
  }),
};
