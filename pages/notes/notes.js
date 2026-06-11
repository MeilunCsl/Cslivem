Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    activeFilter: 'recent',
    inboxCount: 3,
    notes: [],
    filters: [
      { key: 'inbox', label: '收件箱' },
      { key: 'recent', label: '最近' },
      { key: 'all', label: '全部' },
      { key: 'fav', label: '收藏' },
      { key: 'tags', label: '标签' }
    ]
  },
  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    setTimeout(() => { this.setData({ ready: true }); }, 100);
    this.loadNotes();
  },
  loadNotes() {
    const noteModule = require('../../modules/note/public');
    const format = require('../../utils/format');
    const notes = noteModule.getRecentNotes(20);
    this.setData({ notes: notes.map(n => ({ ...n, timeAgo: format.getRelativeTime(n.updatedAt) })) });
  },
  setFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter });
  }
});