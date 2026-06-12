// modules/note/public.js - 笔记模块唯一对外出口
const manifest = require('./manifest');
const model = require('./model');
const repository = require('./repository');

module.exports = {
  manifest,

  getRecentNotes(limit = 10) {
    return repository.getRecent(limit);
  },

  searchNotes(query) {
    return repository.search(query);
  },

  getInbox(limit = 5) {
    return repository.getInbox().slice(0, limit);
  },

  getFavorites() {
    return repository.getFavorites();
  },

  getByTag(tag) {
    return repository.getByTag(tag);
  },

  getAllTags() {
    return repository.getAllTags();
  },

  getStats() {
    return repository.getStats();
  },

  createNote(data) {
    const note = model.create(data);
    const validation = model.validate(note);
    if (!validation.valid) {
      throw new Error('笔记验证失败: ' + validation.errors.join(', '));
    }
    return repository.save(note);
  },

  updateNote(id, updates) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    const updated = { ...note, ...updates };
    return repository.save(updated);
  },

  deleteNote(id) {
    return repository.delete(id);
  },

  toggleFavorite(id) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    return repository.save({ ...note, isFavorite: !note.isFavorite });
  },

  addTag(id, tag) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    if (note.tags.includes(tag)) return note;
    return repository.save({ ...note, tags: [...note.tags, tag] });
  },

  removeTag(id, tag) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    return repository.save({ ...note, tags: note.tags.filter(t => t !== tag) });
  },

  addQuickNote(content) {
    const title = content.substring(0, 50).split('\n')[0];
    return repository.addToInbox({ title, content });
  },

  archiveNote(id) {
    return repository.archiveFromInbox(id);
  },

  createDraft(data) {
    return model.create(data);
  },

  generateSummary(content) {
    return model.generateSummary(content);
  }
};