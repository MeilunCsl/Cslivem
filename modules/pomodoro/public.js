// modules/pomodoro/public.js
// Pomodoro timer module v1.8.0

var manifest = require('./manifest');
var localStorage = require('../../core/storage/local-storage');

var SESSIONS_KEY = 'csl_pomodoro_sessions';
var SETTINGS_KEY = 'csl_pomodoro_settings';

function loadSettings() {
  return localStorage.getJSON(SETTINGS_KEY, {
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLong: 4
  });
}

function saveSettings(settings) {
  localStorage.setJSON(SETTINGS_KEY, settings);
}

function loadSessions() { return localStorage.getJSON(SESSIONS_KEY, []); }
function saveSessions(sessions) { localStorage.setJSON(SESSIONS_KEY, sessions); }

function recordSession(data) {
  var sessions = loadSessions();
  sessions.push({
    id: 'p_' + Date.now(),
    type: data.type || 'focus',
    duration: data.duration || 0,
    completedAt: new Date().toISOString(),
    date: new Date().toISOString().substring(0, 10)
  });
  saveSessions(sessions);
}

function getStats() {
  var sessions = loadSessions();
  var today = new Date().toISOString().substring(0, 10);
  var todaySessions = sessions.filter(function(s) { return s.date === today && s.type === 'focus'; });
  var totalFocus = todaySessions.reduce(function(sum, s) { return sum + s.duration; }, 0);
  var weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  var weekSessions = sessions.filter(function(s) {
    return s.completedAt >= weekAgo.toISOString() && s.type === 'focus';
  });
  return {
    todayCount: todaySessions.length,
    todayMinutes: Math.round(totalFocus / 60),
    weekCount: weekSessions.length,
    totalCount: sessions.filter(function(s) { return s.type === 'focus'; }).length
  };
}

function getSettings() { return loadSettings(); }
function updateSettings(s) { saveSettings(s); }

module.exports = {
  manifest: manifest,
  recordSession: recordSession,
  getStats: getStats,
  getSettings: getSettings,
  updateSettings: updateSettings
};
