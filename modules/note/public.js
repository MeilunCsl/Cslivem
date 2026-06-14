// modules/note/public.js

const manifest = require('./manifest');
const model = require('./model');
const repository = require('./repository');

var TEMPLATES = [
  { id: 'meeting', name: '会议纪要', icon: '▣', category: '工作', title: '会议纪要 - ', content: '# 会议纪要\n\n## 参会人\n\n## 议题\n1. \n\n## 决议\n- \n\n## 待办\n- [ ] ' },
  { id: 'daily', name: '每日日志', icon: '◆', category: '生活', title: '日志 - ', content: '# 每日日志\n\n## 今天做了什么\n\n## 学到了什么\n\n## 明天计划\n- [ ] ' },
  { id: 'reading', name: '读书笔记', icon: '◈', category: '学习', title: '读书笔记 - ', content: '# 读书笔记\n\n## 书名\n\n## 作者\n\n## 核心观点\n\n## 金句\n> \n\n## 我的思考\n' },
  { id: 'project', name: '项目规划', icon: '▢', category: '工作', title: '项目规划 - ', content: '# 项目规划\n\n## 目标\n\n## 背景\n\n## 时间线\n- [ ] 第一阶段\n- [ ] 第二阶段\n\n## 资源需求\n\n## 风险\n' },
  { id: 'review', name: '周复盘', icon: '△', category: '生活', title: '周复盘 - ', content: '# 周复盘\n\n## 本周成果\n\n## 本周不足\n\n## 关键活聜\n\n## 下周目标\n- [ ] ' }
];

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
  },


  getTemplates: function() {
    return TEMPLATES;
  },

  getTemplateById: function(id) {
    return TEMPLATES.find(function(t) { return t.id === id; }) || null;
  },

  createFromTemplate: function(templateId, customTitle) {
    var template = TEMPLATES.find(function(t) { return t.id === templateId; });
    if (!template) return null;
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    var title = customTitle || template.title + dateStr;
    return this.createNote({
      title: title,
      content: template.content,
      category: template.category,
      source: 'template:' + templateId,
      tags: [template.name]
    });
  }
};