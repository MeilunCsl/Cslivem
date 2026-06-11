// utils/constants.js - 全局常量

module.exports = {
  APP_NAME: 'AI Knowledge Hub',
  APP_VERSION: '0.1.0',

  // 存储键前缀
  STORAGE_PREFIX: 'akh_',

  // 模块生命周期
  LIFECYCLE: {
    DRAFT: 'draft',
    BETA: 'beta',
    STABLE: 'stable',
    FROZEN: 'frozen'
  },

  // 事件名
  EVENTS: {
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    NOTE_CREATED: 'note.created',
    NOTE_UPDATED: 'note.updated',
    CALENDAR_EVENT_CREATED: 'calendar.event.created',
    TOOL_REGISTERED: 'tool.registered'
  },

  // 底部 Tab 页面路径
  TAB_PAGES: [
    'pages/home/home',
    'pages/notes/notes',
    'pages/calendar/calendar',
    'pages/tools/tools'
  ]
};
