// modules/habit/public.js
// Habit module public API v1.8.0

var manifest = require('./manifest');
var model = require('./model');
var repo = require('./repository');

module.exports = {
  manifest: manifest,

  getHabits: function() { return repo.getAll(); },

  createHabit: function(data) {
    var err = model.validateHabit(data);
    if (err) throw new Error(err);
    var habit = model.createHabit(data);
    return repo.save(habit);
  },

  updateHabit: function(id, updates) {
    var habit = repo.getById(id);
    if (!habit) throw new Error('Habit not found');
    Object.keys(updates).forEach(function(k) { habit[k] = updates[k]; });
    return repo.save(habit);
  },

  deleteHabit: function(id) { repo.remove(id); },

  checkin: function(habitId, date) { return repo.checkin(habitId, date); },

  undoCheckin: function(habitId, date) { repo.undoCheckin(habitId, date); },

  isCheckedin: function(habitId, date) { return repo.isCheckedin(habitId, date); },

  getStreak: function(habitId) { return repo.getStreak(habitId); },

  getStats: function() { return repo.getStats(); },

  getTodayCheckins: function() {
    var today = new Date().toISOString().substring(0, 10);
    return repo.getCheckinsByDate(today);
  }
};
