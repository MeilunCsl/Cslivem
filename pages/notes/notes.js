// pages/notes/notes.js
const noteModule = require('../../modules/note/public');
const format = require('../../utils/format');

Page({
  data: {
    statusBarHeight: 20,
    activeFilter: 'recent',
    inboxCount: 3,
    notes: []
  },
  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    this.loadNotes();
  },
  onShow() {},
  loadNotes() {
    const notes = noteModule.getRecentNotes(20);
    this.setData({ notes: notes.map(n => ({ ...n, timeAgo: format.getRelativeTime(n.updatedAt) })) });
  },
  setFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter });
  }
});
