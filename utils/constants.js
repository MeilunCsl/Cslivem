// utils/constants.js

module.exports = {
  APP_NAME: 'AI Knowledge Hub',
  APP_VERSION: '0.2.0',

  STORAGE_PREFIX: 'akh_',

  LIFECYCLE: {
    DRAFT: 'draft',
    BETA: 'beta',
    STABLE: 'stable',
    FROZEN: 'frozen'
  },

  EVENTS: {
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',
    NOTE_CREATED: 'note.created',
    NOTE_UPDATED: 'note.updated',
    CALENDAR_EVENT_CREATED: 'calendar.event.created',
    TOOL_REGISTERED: 'tool.registered'
  },

  TAB_PAGES: [
    'pages/home/home',
    'pages/notes/notes',
    'pages/calendar/calendar',
    'pages/tools/tools'
  ]
};
