// modules/note/repository.js - 笔记数据仓储

const storage = require('../../miniprogram/storage');
const model = require('./model');

const STORAGE_KEY = 'notes';
const INBOX_KEY = 'inbox_notes';

module.exports = {
  getAll() {
    return storage.get(STORAGE_KEY, []);
  },

  getById(id) {
    const notes = this.getAll();
    return notes.find(n => n.id === id) || null;
  },

  save(note) {
    const notes = this.getAll();
    const index = notes.findIndex(n => n.id === note.id);
    const updated = model.touch(note);
    if (index >= 0) {
      notes[index] = updated;
    } else {
      notes.unshift(updated);
    }
    storage.set(STORAGE_KEY, notes);
    return updated;
  },

  delete(id) {
    const notes = this.getAll();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },

  search(query) {
    if (!query) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  getByTag(tag) {
    return this.getAll().filter(n => n.tags.includes(tag));
  },

  getFavorites() {
    return this.getAll().filter(n => n.isFavorite);
  },

  getRecent(limit = 10) {
    return this.getAll()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  },

  getInbox() {
    return storage.get(INBOX_KEY, []);
  },

  addToInbox(data) {
    const note = model.create({ ...data, source: 'quick' });
    const inbox = this.getInbox();
    inbox.unshift(note);
    storage.set(INBOX_KEY, inbox);
    return note;
  },

  archiveFromInbox(id) {
    const inbox = this.getInbox();
    const note = inbox.find(n => n.id === id);
    if (!note) return null;
    storage.set(INBOX_KEY, inbox.filter(n => n.id !== id));
    return this.save(note);
  },

  getAllTags() {
    const notes = this.getAll();
    const tagSet = new Set();
    notes.forEach(n => n.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },

  getStats() {
    const notes = this.getAll();
    const inbox = this.getInbox();
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return {
      total: notes.length,
      thisWeek: notes.filter(n => new Date(n.updatedAt) > weekAgo).length,
      inbox: inbox.length,
      favorites: notes.filter(n => n.isFavorite).length,
      tags: this.getAllTags().length
    };
  }
};