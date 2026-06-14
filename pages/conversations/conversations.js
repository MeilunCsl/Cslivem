// pages/conversations/conversations.js
var conversationStore = require('../../core/conversation/store');
var format = require('../../utils/format');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    conversations: [],
    searchQuery: '',
    activeFilter: 'all',
    filters: [
      { key: 'all', label: '全部' },
      { key: 'text', label: '文本' },
      { key: 'image', label: '图片' },
      { key: 'voice', label: '语音' },
      { key: 'ingested', label: '已入库' },
      { key: 'pending', label: '未入库' }
    ],
    stats: { conversations: 0, messages: 0 }
  },

  onLoad: function() {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 }); }
    this.loadData();
  },

  loadData: function() {
    var query = this.data.searchQuery;
    var filter = this.data.activeFilter;
    var convs;
    
    if (query) {
      convs = conversationStore.searchConversations(query);
    } else {
      convs = conversationStore.getAllConversations();
    }

    // Apply filter
    if (filter === 'ingested') {
      convs = convs.filter(function(c) { return c.ingested; });
    } else if (filter === 'pending') {
      convs = convs.filter(function(c) { return !c.ingested; });
    } else if (filter === 'image') {
      convs = convs.filter(function(c) { return c.hasImages; });
    } else if (filter === 'voice') {
      convs = convs.filter(function(c) { return c.hasVoice; });
    }

    // Add display data
    convs = convs.map(function(c) {
      return Object.assign({}, c, {
        timeAgo: format.getRelativeTime ? format.getRelativeTime(c.updatedAt) : '',
        typeIcon: c.hasImages ? '📷' : (c.hasVoice ? '🎤' : '💬')
      });
    });

    // Sort: pinned first, then by updatedAt
    convs.sort(function(a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

    var stats = conversationStore.getStats();
    this.setData({ conversations: convs, stats: stats });
  },

  onSearch: function(e) {
    this.setData({ searchQuery: e.detail.value });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 }); }
    this.loadData();
  },

  onClearSearch: function() {
    this.setData({ searchQuery: '' });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 }); }
    this.loadData();
  },

  setFilter: function(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 }); }
    this.loadData();
  },

  onTapConversation: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/chat/chat?id=' + id });
  },

  onTogglePin: function(e) {
    var id = e.currentTarget.dataset.id;
    conversationStore.togglePin(id);
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 }); }
    this.loadData();
    wx.vibrateShort({ type: 'light' }).catch(function() {});
  },

  onDelete: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除对话',
      content: '确定删除该对话？删除后无法恢复。',
      success: function(res) {
        if (res.confirm) {
          conversationStore.deleteConversation(id);
          self.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onCreateNew: function() {
    wx.navigateTo({ url: '/pages/chat/chat' });
  }
});
