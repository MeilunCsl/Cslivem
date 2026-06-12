// modules/note/public.js - 笔记模块唯一对外出口
// 其他模块只能通过此文件访问笔记功能
const manifest = require('./manifest');
const model = require('./model');
const repository = require('./repository');

module.exports = {
  manifest,

  // ==================== 查询接口 ====================

  /** 获取最近笔记 */
  getRecentNotes(limit = 10) {
    return repository.getRecent(limit);
  },

  /** 搜索笔记 */
  searchNotes(query) {
    return repository.search(query);
  },

  /** 获取收件箱笔记 */
  getInbox(limit = 5) {
    return repository.getInbox().slice(0, limit);
  },

  /** 获取收藏笔记 */
  getFavorites() {
    return repository.getFavorites();
  },

  /** 按标签获取笔记 */
  getByTag(tag) {
    return repository.getByTag(tag);
  },

  /** 获取所有标签 */
  getAllTags() {
    return repository.getAllTags();
  },

  /** 获取统计信息 */
  getStats() {
    return repository.getStats();
  },

  // ==================== 写入接口 ====================

  /** 创建笔记 */
  createNote(data) {
    const note = model.create(data);
    const validation = model.validate(note);
    if (!validation.valid) {
      throw new Error('笔记验证失败: ' + validation.errors.join(', '));
    }
    return repository.save(note);
  },

  /** 更新笔记 */
  updateNote(id, updates) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    const updated = { ...note, ...updates };
    return repository.save(updated);
  },

  /** 删除笔记 */
  deleteNote(id) {
    return repository.delete(id);
  },

  /** 切换收藏状态 */
  toggleFavorite(id) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    return repository.save({ ...note, isFavorite: !note.isFavorite });
  },

  /** 添加标签 */
  addTag(id, tag) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    if (note.tags.includes(tag)) return note;
    return repository.save({ ...note, tags: [...note.tags, tag] });
  },

  /** 移除标签 */
  removeTag(id, tag) {
    const note = repository.getById(id);
    if (!note) throw new Error('笔记不存在: ' + id);
    return repository.save({ ...note, tags: note.tags.filter(t => t !== tag) });
  },

  // ==================== 快速记录 ====================

  /** 添加到收件箱 */
  addQuickNote(content) {
    const title = content.substring(0, 50).split('\n')[0];
    return repository.addToInbox({ title, content });
  },

  /** 归档收件箱笔记 */
  archiveNote(id) {
    return repository.archiveFromInbox(id);
  },

  // ==================== 工具方法 ====================

  /** 创建笔记对象（不保存） */
  createDraft(data) {
    return model.create(data);
  },

  /** 生成摘要 */
  generateSummary(content) {
    return model.generateSummary(content);
  }
};