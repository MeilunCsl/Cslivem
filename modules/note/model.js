// modules/note/model.js - 笔记领域模型

/**
 * 笔记实体
 * @typedef {Object} Note
 * @property {string} id - 唯一标识
 * @property {string} title - 标题
 * @property {string} content - 内容（Markdown）
 * @property {string} summary - 摘要（自动生成）
 * @property {string[]} tags - 标签列表
 * @property {boolean} isFavorite - 是否收藏
 * @property {string} category - 分类
 * @property {string} source - 来源（手动输入/AI识别/导入）
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

const { generateId } = require('../../utils/format');

module.exports = {
  create(data = {}) {
    const now = new Date().toISOString();
    return {
      id: data.id || generateId(),
      title: data.title || '',
      content: data.content || '',
      summary: data.summary || '',
      tags: data.tags || [],
      isFavorite: data.isFavorite || false,
      category: data.category || '未分类',
      source: data.source || 'manual',
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    };
  },

  validate(note) {
    const errors = [];
    if (!note.id) errors.push('缺少 id');
    if (!note.title && !note.content) errors.push('标题和内容不能都为空');
    if (note.title && note.title.length > 200) errors.push('标题过长（最多 200 字符）');
    return { valid: errors.length === 0, errors };
  },

  generateSummary(content) {
    if (!content) return '';
    const plain = content
      .replace(/#+\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\n/g, ' ')
      .trim();
    return plain.length > 100 ? plain.substring(0, 100) + '...' : plain;
  },

  touch(note) {
    return { ...note, updatedAt: new Date().toISOString() };
  }
};