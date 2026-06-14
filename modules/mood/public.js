var manifest = require('./manifest');
var localStorage = require('../../core/storage/local-storage');

var KEY = 'csl_mood_records';

function load() { return localStorage.getJSON(KEY, []); }
function save(r) { localStorage.setJSON(KEY, r); }

var MOODS = [
  { value: 5, label: '很好', icon: '☺' },
  { value: 4, label: '还好', icon: '□' },
  { value: 3, label: '一般', icon: '○' },
  { value: 2, label: '不好', icon: '▽' },
  { value: 1, label: '很糟', icon: '☹' }
];

function getMoods() { return MOODS; }

function record(data) {
  var records = load();
  var today = data.date || new Date().toISOString().substring(0, 10);
  var existing = -1;
  for (var i = 0; i < records.length; i++) {
    if (records[i].date === today) { existing = i; break; }
  }
  var entry = {
    date: today,
    mood: data.mood || 3,
    note: data.note || '',
    tags: data.tags || [],
    timestamp: Date.now()
  };
  if (existing >= 0) records[existing] = entry;
  else records.push(entry);
  save(records);
  return entry;
}

function getToday() {
  var today = new Date().toISOString().substring(0, 10);
  var records = load();
  for (var i = 0; i < records.length; i++) {
    if (records[i].date === today) return records[i];
  }
  return null;
}

function getRecent(days) {
  days = days || 7;
  var records = load();
  var today = new Date();
  var cutoff = new Date(today);
  cutoff.setDate(today.getDate() - days);
  var cutoffStr = cutoff.toISOString().substring(0, 10);
  return records.filter(function(r) { return r.date >= cutoffStr; }).sort(function(a, b) { return a.date > b.date ? 1 : -1; });
}

function getStats() {
  var records = load();
  if (records.length === 0) return { avg: 0, count: 0, streak: 0 };
  var total = records.reduce(function(s, r) { return s + r.mood; }, 0);
  var streak = 0;
  var today = new Date();
  for (var d = 0; d < 365; d++) {
    var check = new Date(today);
    check.setDate(today.getDate() - d);
    var dateStr = check.toISOString().substring(0, 10);
    var found = false;
    for (var i = 0; i < records.length; i++) {
      if (records[i].date === dateStr) { found = true; break; }
    }
    if (found) streak++;
    else if (d > 0) break;
  }
  return { avg: (total / records.length).toFixed(1), count: records.length, streak: streak };
}

module.exports = {
  manifest: manifest,
  getMoods: getMoods,
  record: record,
  getToday: getToday,
  getRecent: getRecent,
  getStats: getStats
};
