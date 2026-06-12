const manifest = require('./manifest');

module.exports = {
  manifest,

  getTodayEvents() {
    return [
      { id: 'evt-1', title: '团队周会', time: '10:00-11:00', type: 'meeting' },
      { id: 'evt-2', title: '午饭和小李', time: '12:30', type: 'social' }
    ];
  },

  getMonthEvents(year, month) {
    return [];
  },

  createEvent(data) {
    return { id: 'evt-' + Date.now(), ...data };
  }
};