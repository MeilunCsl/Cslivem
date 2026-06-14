var manifest = require('./manifest');
var localStorage = require('../../core/storage/local-storage');

var KEY = 'csl_food_records';

function loadRecords() { return localStorage.getJSON(KEY, []); }
function saveRecords(r) { localStorage.setJSON(KEY, r); }

function addRecord(data) {
  var records = loadRecords();
  var now = new Date();
  var record = {
    id: 'fr_' + Date.now(),
    name: data.name || '',
    calories: data.calories || 0,
    meal: data.meal || 'lunch',
    note: data.note || '',
    date: data.date || now.toISOString().substring(0, 10),
    time: data.time || (String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'))
  };
  records.push(record);
  saveRecords(records);
  return record;
}

function deleteRecord(id) {
  saveRecords(loadRecords().filter(function(r) { return r.id !== id; }));
}

function getByDate(date) {
  return loadRecords().filter(function(r) { return r.date === date; });
}

function getTodaySummary() {
  var today = new Date().toISOString().substring(0, 10);
  var records = getByDate(today);
  var total = records.reduce(function(s, r) { return s + (r.calories || 0); }, 0);
  var byMeal = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
  records.forEach(function(r) { if (byMeal.hasOwnProperty(r.meal)) byMeal[r.meal] += (r.calories || 0); });
  return { records: records, totalCalories: total, byMeal: byMeal, count: records.length };
}

function getWeekSummary() {
  var records = loadRecords();
  var today = new Date();
  var weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  var wRecords = records.filter(function(r) { return r.date >= weekAgo.toISOString().substring(0, 10); });
  var total = wRecords.reduce(function(s, r) { return s + (r.calories || 0); }, 0);
  return { count: wRecords.length, totalCalories: total, avgCalories: Math.round(total / 7) };
}

function getPresets() {
  return [
    { name: '白米饭', calories: 200 },
    { name: '鸡胸肉', calories: 165 },
    { name: '西蓝花', calories: 55 },
    { name: '苹果', calories: 95 },
    { name: '牛奶', calories: 150 },
    { name: '鸡蛋', calories: 78 },
    { name: '面包', calories: 260 },
    { name: '拉面', calories: 450 },
    { name: '酸奶', calories: 120 },
    { name: '水果沙拉', calories: 180 }
  ];
}

module.exports = {
  manifest: manifest,
  addRecord: addRecord,
  deleteRecord: deleteRecord,
  getByDate: getByDate,
  getTodaySummary: getTodaySummary,
  getWeekSummary: getWeekSummary,
  getPresets: getPresets
};
