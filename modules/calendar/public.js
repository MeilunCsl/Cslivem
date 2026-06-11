// modules/calendar/public.js - 日历模块唯一对外出口
const manifest = require('./manifest');

module.exports = {
  manifest,

  /** 获取指定月份的事件 */
  getMonthEvents(year, month) {
    console.log('[Calendar] getMonthEvents:', year, month);
    return [];
  },

  /** 获取今日事件 */
  getTodayEvents() {
    return [
      { id: 'evt-1', title: '产品评审会议', time: '14:00', type: 'event' },
      { id: 'evt-2', title: '提交架构文档', time: '17:00', type: 'task' }
    ];
  },

  /** 获取日记 */
  getDiary(date) {
    console.log('[Calendar] getDiary:', date);
    return null;
  },

  /** 创建事件 */
  createEvent(eventData) {
    console.log('[Calendar] createEvent:', eventData.title);
    return { id: 'evt-new', ...eventData };
  }
};
