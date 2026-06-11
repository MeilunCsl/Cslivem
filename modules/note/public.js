// modules/note/public.js - 笔记模块唯一对外出口
// 其他模块只能通过此文件访问笔记功能
const manifest = require('./manifest');

module.exports = {
  manifest,

  /** 获取最近笔记 */
  getRecentNotes(limit = 10) {
    console.log('[Note] getRecentNotes, limit:', limit);
    // 桩数据
    return [
      { id: '1', title: '向量数据库选型记录', summary: 'MVP 阶段使用 PostgreSQL + pgvector...', updatedAt: '2026-06-11T10:30:00', tags: ['技术', '架构'] },
      { id: '2', title: '产品 MVP 架构', summary: 'Taro + React + TypeScript 跨端方案...', updatedAt: '2026-06-10T14:20:00', tags: ['产品', '架构'] },
      { id: '3', title: '会议纪要：产品评审', summary: '讨论了首页设计方案和 AI 功能优先级...', updatedAt: '2026-06-09T09:00:00', tags: ['会议'] },
      { id: '4', title: '竞品分析：Notion', summary: 'Notion 的模块化编辑器和数据库功能...', updatedAt: '2026-06-08T16:45:00', tags: ['竞品', '分析'] },
      { id: '5', title: '读书笔记：设计心理学', summary: '诺曼的设计心理学核心概念整理...', updatedAt: '2026-06-07T20:00:00', tags: ['读书', '设计'] }
    ];
  },

  /** 搜索笔记 */
  searchNotes(query) {
    console.log('[Note] searchNotes:', query);
    return [];
  },

  /** 获取收件箱（待整理笔记） */
  getInbox(limit = 5) {
    return [
      { id: 'inbox-1', title: '今天午饭微信付了 36.5', type: 'quick-note', createdAt: '2026-06-11T12:30:00' },
      { id: 'inbox-2', title: '下周三和李明沟通方案', type: 'quick-note', createdAt: '2026-06-11T09:15:00' },
      { id: 'inbox-3', title: '关于 pgvector 索引优化的想法', type: 'quick-note', createdAt: '2026-06-10T23:40:00' }
    ];
  },

  /** 获取笔记总数 */
  getStats() {
    return { total: 128, thisWeek: 12, inbox: 3 };
  }
};
