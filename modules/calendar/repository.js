// modules/calendar/repository.js

const storage = require('../../miniprogram/storage');
const model = require('./model');

const EVENTS_KEY = 'calendar_events';
const DIARY_KEY = 'calendar_diary';

module.exports = {
  // Events
  getAllEvents() {
    return storage.get(EVENTS_KEY, []);
  },

  getEventById(id) {
    return this.getAllEvents().find(e => e.id === id) || null;
  },

  getEventsByDate(date) {
    return this.getAllEvents().filter(e => e.date === date);
  },

  getEventsByMonth(year, month) {
    const prefix = year + '-' + String(month).padStart(2, '0');
    return this.getAllEvents().filter(e => e.date && e.date.startsWith(prefix));
  },

  saveEvent(event) {
    const events = this.getAllEvents();
    const index = events.findIndex(e => e.id === event.id);
    const updated = model.touch(event);
    if (index >= 0) {
      events[index] = updated;
    } else {
      events.push(updated);
    }
    storage.set(EVENTS_KEY, events);
    return updated;
  },

  deleteEvent(id) {
    const events = this.getAllEvents().filter(e => e.id !== id);
    storage.set(EVENTS_KEY, events);
  },

  // Diary
  getAllDiary() {
    return storage.get(DIARY_KEY, []);
  },

  getDiaryByDate(date) {
    return this.getAllDiary().find(d => d.date === date) || null;
  },

  saveDiary(diary) {
    const diaries = this.getAllDiary();
    const index = diaries.findIndex(d => d.date === diary.date);
    const updated = model.touch(diary);
    if (index >= 0) {
      diaries[index] = updated;
    } else {
      diaries.push(updated);
    }
    storage.set(DIARY_KEY, diaries);
    return updated;
  },

  // Stats
  getStats() {
    const events = this.getAllEvents();
    const diaries = this.getAllDiary();
    const today = new Date().toISOString().split('T')[0];
    return {
      totalEvents: events.length,
      todayEvents: events.filter(e => e.date === today).length,
      totalDiaries: diaries.length
    };
  }
};
