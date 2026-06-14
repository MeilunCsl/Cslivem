// modules/habit/repository.js
// Habit data persistence

var localStorage = require('../../core/storage/local-storage');

var HABITS_KEY = 'csl_habits';
var CHECKINS_KEY = 'csl_habit_checkins';

function loadHabits() { return localStorage.getJSON(HABITS_KEY, []); }
function saveHabits(habits) { localStorage.setJSON(HABITS_KEY, habits); }
function loadCheckins() { return localStorage.getJSON(CHECKINS_KEY, []); }
function saveCheckins(checkins) { localStorage.setJSON(CHECKINS_KEY, checkins); }

function getAll() { return loadHabits().filter(function(h) { return !h.archived; }); }

function getById(id) {
  var habits = loadHabits();
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].id === id) return habits[i];
  }
  return null;
}

function save(habit) {
  var habits = loadHabits();
  var found = false;
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].id === habit.id) {
      habits[i] = habit;
      found = true;
      break;
    }
  }
  if (!found) habits.push(habit);
  saveHabits(habits);
  return habit;
}

function remove(id) {
  var habits = loadHabits();
  habits = habits.filter(function(h) { return h.id !== id; });
  saveHabits(habits);
  var checkins = loadCheckins();
  checkins = checkins.filter(function(c) { return c.habitId !== id; });
  saveCheckins(checkins);
}

function checkin(habitId, date) {
  var checkins = loadCheckins();
  var exists = false;
  for (var i = 0; i < checkins.length; i++) {
    if (checkins[i].habitId === habitId && checkins[i].date === date) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    checkins.push({ habitId: habitId, date: date, timestamp: Date.now() });
    saveCheckins(checkins);
  }
  return !exists;
}

function undoCheckin(habitId, date) {
  var checkins = loadCheckins();
  checkins = checkins.filter(function(c) {
    return !(c.habitId === habitId && c.date === date);
  });
  saveCheckins(checkins);
}

function isCheckedin(habitId, date) {
  var checkins = loadCheckins();
  for (var i = 0; i < checkins.length; i++) {
    if (checkins[i].habitId === habitId && checkins[i].date === date) return true;
  }
  return false;
}

function getCheckinsByDate(date) {
  var checkins = loadCheckins();
  return checkins.filter(function(c) { return c.date === date; });
}

function getCheckinsByHabit(habitId) {
  var checkins = loadCheckins();
  return checkins.filter(function(c) { return c.habitId === habitId; });
}

function getStreak(habitId) {
  var checkins = getCheckinsByHabit(habitId);
  if (checkins.length === 0) return 0;
  var dates = checkins.map(function(c) { return c.date; }).sort().reverse();
  var streak = 0;
  var today = new Date();
  for (var d = 0; d < 365; d++) {
    var check = new Date(today);
    check.setDate(today.getDate() - d);
    var dateStr = check.getFullYear() + '-' +
      String(check.getMonth() + 1).padStart(2, '0') + '-' +
      String(check.getDate()).padStart(2, '0');
    if (dates.indexOf(dateStr) >= 0) {
      streak++;
    } else if (d > 0) {
      break;
    }
  }
  return streak;
}

function getStats() {
  var habits = getAll();
  var checkins = loadCheckins();
  var today = new Date().toISOString().substring(0, 10);
  var todayDone = checkins.filter(function(c) { return c.date === today; }).length;
  return {
    totalHabits: habits.length,
    todayDone: todayDone,
    totalCheckins: checkins.length
  };
}

module.exports = {
  getAll: getAll,
  getById: getById,
  save: save,
  remove: remove,
  checkin: checkin,
  undoCheckin: undoCheckin,
  isCheckedin: isCheckedin,
  getCheckinsByDate: getCheckinsByDate,
  getCheckinsByHabit: getCheckinsByHabit,
  getStreak: getStreak,
  getStats: getStats
};
