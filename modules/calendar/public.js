// modules/calendar/public.js

const manifest = require('./manifest');
const model = require('./model');
const repository = require('./repository');

module.exports = {
  manifest,

  getTodayEvents() {
    const today = new Date().toISOString().split('T')[0];
    return repository.getEventsByDate(today);
  },

  getMonthEvents(year, month) {
    return repository.getEventsByMonth(year, month);
  },

  getEventsByDate(date) {
    return repository.getEventsByDate(date);
  },

  createEvent(data) {
    const event = model.createEvent(data);
    const validation = model.validateEvent(event);
    if (!validation.valid) {
      throw new Error('Event validation failed: ' + validation.errors.join(', '));
    }
    return repository.saveEvent(event);
  },

  updateEvent(id, updates) {
    const event = repository.getEventById(id);
    if (!event) throw new Error('Event not found: ' + id);
    return repository.saveEvent({ ...event, ...updates });
  },

  deleteEvent(id) {
    repository.deleteEvent(id);
  },

  getDiary(date) {
    return repository.getDiaryByDate(date);
  },

  saveDiary(data) {
    const diary = model.createDiary(data);
    return repository.saveDiary(diary);
  },

  getStats() {
    return repository.getStats();
  }
};
