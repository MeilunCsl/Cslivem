// modules/note/repository.js - 笔记数据仓储
// 负责笔记的 CRUD 操作和本地存储

const storage = require('../../miniprogram/storage');
const model = require('./model');

const STORAGE_KEY = 'notes';
const INBOX_KEY = 'inbox_notes';

module.exports = {
  /**
   * 获取所有笔记
   * @returns {Note[]}
   */
  getAll() {
    return storage.get(STORAGE_KEY, []);
  },

  /**
   * 根据 ID 获取笔记
   * @param {string} id
   * @returns {Note|null}
   */
  getById(id) {
    const notes = this.getAll();
    return notes.find(n => n.id === id) || null;
  },

  /**
   * 保存笔记（新增或更新）
   * @param {Note} note
   * @returns {Note}
   */
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

  /**
   * 删除笔记
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const notes = this.getAll();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },

  /**
   * 搜索笔记
   * @param {string} query
   * @returns {Note[]}
   */
  search(query) {
    if (!query) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  /**
   * 按标签筛选
   * @param {string} tag
   * @returns {Note[]}
   */
  getByTag(tag) {
    return this.getAll().filter(n => n.tags.includes(tag));
  },

  /**
   * 获取收藏笔记
   * @returns {Note[]}
   */
  getFavorites() {
    return this.getAll().filter(n => n.isFavorite);
  },

  /**
   * 获取最近笔记
   * @param {number} limit
   * @returns {Note[]}
   */
  getRecent(limit = 10) {
    return this.getAll()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  },

  /**
   * 获取收件箱笔记（快速记录）
   * @returns {Note[]}
   */
  getInbox() {
    return storage.get(INBOX_KEY, []);
  },

  /**
   * 添加到收件箱
   * @param {Object} data
   * @returns {Note}
   */
  addToInbox(data) {
    const note = model.create({ ...data, source: 'quick' });
    const inbox = this.getInbox();
    inbox.unshift(note);
    storage.set(INBOX_KEY, inbox);
    return note;
  },

  /**
   * 从收件箱移除并保存到笔记
   * @param {string} id
   * @returns {Note|null}
   */
  archiveFromInbox(id) {
    const inbox = this.getInbox();
    const note = inbox.find(n => n.id === id);
    if (!note) return null;
    
    storage.set(INBOX_KEY, inbox.filter(n => n.id !== id));
    return this.save(note);
  },

  /**
   * 获取所有标签
   * @returns {string[]}
   */
  getAllTags() {
    const notes = this.getAll();
    const tagSet = new Set();
    notes.forEach(n => n.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },

  /**
   * 获取统计信息
   * @returns {Object}
   */
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