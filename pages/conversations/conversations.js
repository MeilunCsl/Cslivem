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
    pageSize: 20,
    currentPage: 1,
    hasMore: true,
    loadingMore: false,
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

  onLoad: function () {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    setTimeout(function () {
      self.setData({ ready: true });
    }, 100);
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    if (this.data.ready) {
      this.loadConversations();
    }
  },

  loadConversations: function () {
    var self = this;
    var filter = self.data.activeFilter;
    var pageSize = self.data.pageSize;
    var all = conversationStore.getRecentConversations(pageSize * 5);

    // Apply filter
    var filtered;
    if (filter === 'all') {
      filtered = all;
    } else if (filter === 'ingested') {
      filtered = all.filter(function (c) { return c.ingested; });
    } else if (filter === 'pending') {
      filtered = all.filter(function (c) { return !c.ingested; });
    } else {
      filtered = all.filter(function (c) { return c.type === filter; });
    }

    var page = filtered.slice(0, pageSize);
    var formatted = page.map(function (c) { return self.formatConversation(c); });

    var stats = conversationStore.getStats ? conversationStore.getStats() : { conversations: all.length, messages: 0 };

    self.setData({
      conversations: formatted,
      currentPage: 1,
      hasMore: filtered.length > pageSize,
      stats: stats
    });
  },

  setFilter: function (e) {
    var key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeFilter) return;
    this.setData({ activeFilter: key, searchQuery: '' });
    this.loadConversations();
  },

  onTapConversation: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({ url: '/pages/chat/chat?id=' + id });
    }
  },

  onCreateNew: function () {
    var conv = conversationStore.createConversation({ title: '' });
    wx.navigateTo({ url: '/pages/chat/chat?id=' + conv.id });
  },

  onDelete: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    if (!id) return;

    wx.showModal({
      title: '确认删除',
      content: '删除对话后不可恢复',
      success: function (res) {
        if (res.confirm) {
          conversationStore.deleteConversation(id);
          self.loadConversations();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onTogglePin: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    if (!id) return;

    conversationStore.togglePin(id);
    self.loadConversations();
  },

  // ===== Search =====

  _searchTimer: null,

  onSearchInput: function (e) {
    var self = this;
    if (self._searchTimer) clearTimeout(self._searchTimer);

    self._searchTimer = setTimeout(function () {
      var query = e.detail.value;
      self.setData({ searchQuery: query });

      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }

      var all = conversationStore.getRecentConversations(100);
      var q = query.toLowerCase();
      var results = all.filter(function (c) {
        return (c.title || '').toLowerCase().indexOf(q) >= 0;
      });
      self.setData({
        conversations: results.map(function (c) { return self.formatConversation(c); }),
        hasMore: false
      });
    }, 300);
  },

  onClearSearch: function () {
    this.setData({ searchQuery: '' });
    this.loadConversations();
  },

  // ===== Pagination =====

  loadMore: function () {
    if (!this.data.hasMore || this.data.loadingMore) return;
    var self = this;
    self.setData({ loadingMore: true });

    var page = self.data.currentPage + 1;
    var pageSize = self.data.pageSize;
    var all = conversationStore.getRecentConversations(page * pageSize);
    var newItems = all.slice((page - 1) * pageSize, page * pageSize);

    if (newItems.length < pageSize) {
      self.setData({ hasMore: false });
    }

    var formatted = newItems.map(function (c) { return self.formatConversation(c); });

    setTimeout(function () {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function () {
    this.loadMore();
  },

  // ===== Ingest =====

  onIngestTap: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({
      url: '/pages/graph-ingest/graph-ingest?conversationId=' + id
    });
  },

  // ===== Format =====

  formatConversation: function (conv) {
    if (!conv) return {};
    var typeIcons = { text: '💬', image: '🖼️', voice: '🎙️' };
    return {
      id: conv.id,
      title: conv.title || '新对话',
      summary: conv.summary || '',
      type: conv.type || 'text',
      typeIcon: typeIcons[conv.type] || '💬',
      messageCount: conv.messageCount || 0,
      ingested: !!conv.ingested,
      pinned: !!conv.pinned,
      timeAgo: format.getRelativeTime(conv.updatedAt || conv.createdAt),
      updatedAt: conv.updatedAt || conv.createdAt
    };
  }
});
