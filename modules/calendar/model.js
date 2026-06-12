// modules/calendar/model.js

const { generateId } = require('../../utils/format');

module.exports = {
  createEvent(data = {}) {
    const now = new Date().toISOString();
    return {
      id: data.id || generateId(),
      title: data.title || '',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '',
      endTime: data.endTime || '',
      description: data.description || '',
      type: data.type || 'event',
      color: data.color || '#5B4CFF',
      isAllDay: data.isAllDay || false,
      reminder: data.reminder || null,
      relatedNoteId: data.relatedNoteId || null,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
  },

  createDiary(data = {}) {
    const now = new Date().toISOString();
    const date = data.date || new Date().toISOString().split('T')[0];
    return {
      id: data.id || generateId(),
      date: date,
      content: data.content || '',
      mood: data.mood || 'neutral',
      weather: data.weather || '',
      tags: data.tags || [],
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
  },

  validateEvent(event) {
    const errors = [];
    if (!event.title) errors.push('Title is required');
    if (!event.date) errors.push('Date is required');
    return { valid: errors.length === 0, errors };
  },

  touch(entity) {
    return { ...entity, updatedAt: new Date().toISOString() };
  }
};
