// modules/note/model.js

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