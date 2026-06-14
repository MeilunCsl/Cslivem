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

  onLoad: function() {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    } catch (e) {}
    setTimeout(function() { self.setData({ ready: true 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }, 100);
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }
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
      convs = convs.filter(function(c) { return c.ingested; 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    } else if (filter === 'pending') {
      convs = convs.filter(function(c) { return !c.ingested; 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    } else if (filter === 'image') {
      convs = convs.filter(function(c) { return c.hasImages; 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    } else if (filter === 'voice') {
      convs = convs.filter(function(c) { return c.hasVoice; 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    }

    // Add display data
    convs = convs.map(function(c) {
      return Object.assign({}, c, {
        timeAgo: format.getRelativeTime ? format.getRelativeTime(c.updatedAt) : '',
        typeIcon: c.hasImages ? '📷' : (c.hasVoice ? '🎤' : '💬')
      

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});

    // Sort: pinned first, then by updatedAt
    convs.sort(function(a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});

    var stats = conversationStore.getStats();
    this.setData({ conversations: convs, stats: stats 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
  },

  onSearch: function(e) {
    this.setData({ searchQuery: e.detail.value 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }
    this.loadData();
  },

  onClearSearch: function() {
    this.setData({ searchQuery: '' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }
    this.loadData();
  },

  setFilter: function(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }
    this.loadData();
  },

  onTapConversation: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/chat/chat?id=' + id 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
  },

  onTogglePin: function(e) {
    var id = e.currentTarget.dataset.id;
    conversationStore.togglePin(id);
    if (typeof this.getTabBar === 'function' && this.getTabBar()) { this.getTabBar().setData({ selected: 1 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

}); }
    this.loadData();
    wx.vibrateShort({ type: 'light' }).catch(function() {

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
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
          wx.showToast({ title: '已删除', icon: 'success' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
        }
      }
    

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
  },

  onCreateNew: function() {
    wx.navigateTo({ url: '/pages/chat/chat' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },

});
  }


  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    var self = this;
    var page = self.data.currentPage + 1;
    var store = require('../../core/conversation/store');
    var all = store.getRecentConversations(page * self.data.pageSize);
    var newItems = all.slice((page - 1) * self.data.pageSize, page * self.data.pageSize);
    if (newItems.length < self.data.pageSize) {
      self.setData({ hasMore: false });
    }
    var formatted = newItems.map(function(c) {
      return self.formatConversation(c);
    });
    setTimeout(function() {
      self.setData({
        conversations: self.data.conversations.concat(formatted),
        currentPage: page,
        loadingMore: false
      });
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadConversations();
        return;
      }
      var store = require('../../core/conversation/store');
      var all = store.getRecentConversations(100);
      var results = all.filter(function(c) {
        return (c.title || '').toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      self.setData({ conversations: results.map(function(c) { return self.formatConversation(c); }), hasMore: false });
    }, 300);
  },


  onIngestTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var ingested = e.currentTarget.dataset.ingested;
    if (ingested === 'true' || ingested === true) {
      wx.showToast({ title: '已入库', icon: 'success' });
      return;
    }
    wx.navigateTo({ url: '/pages/graph-ingest/graph-ingest?id=' + id });
  },

});

