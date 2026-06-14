Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    activeFilter: 'recent',
    inboxCount: 0,
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
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.loadNotes();
  },

  loadNotes() {
    const noteModule = require('../../modules/note/public');
    const format = require('../../utils/format');
    const stats = noteModule.getStats();
    let notes = [];
    const { activeFilter } = this.data;
    switch (activeFilter) {
      case 'inbox':
        notes = noteModule.getInbox(20);
        break;
      case 'recent':
        notes = noteModule.getRecentNotes(20);
        break;
      case 'all':
        notes = noteModule.getRecentNotes(100);
        break;
      case 'fav':
        notes = noteModule.getFavorites();
        break;
      case 'tags':
        notes = noteModule.getRecentNotes(100);
        break;
      default:
        notes = noteModule.getRecentNotes(20);
    }
    this.setData({
      notes: notes.map(n => ({
        ...n,
        timeAgo: format.getRelativeTime(n.updatedAt || n.createdAt)
      })),
      inboxCount: stats.inbox
    });
  },

  setFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter });
    this.loadNotes();
  },

  onTapNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + id });
  },

  openGraph: function() {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' });
  },

  createNote: function() {
    wx.navigateTo({ url: '/pages/note-editor/note-editor' });
  }
});