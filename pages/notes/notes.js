Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    activeFilter: 'recent',
    inboxCount: 0,
    notes: [],
    pageSize: 20,
    currentPage: 1,
    hasMore: true,
    loadingMore: false,
    filters: [
      { key: 'inbox', label: '收件箱' },
      { key: 'recent', label: '最近' },
      { key: 'all', label: '全部' },
      { key: 'fav', label: '收藏' },
      { key: 'tags', label: '标签' }
    ]
  },

  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

}); } catch(e) {}
    setTimeout(() => { this.setData({ ready: true 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

}); }, 100);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
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
        notes = noteModule.getRecentNotes(this.data.pageSize);
        break;
      case 'all':
        notes = noteModule.getRecentNotes(this.data.pageSize);
        break;
      case 'fav':
        notes = noteModule.getFavorites();
        break;
      case 'tags':
        try {
          const knowledgeModule = require('../../modules/knowledge/public');
          const tagNodes = knowledgeModule.getNodesByType('tag');
          notes = tagNodes.map(n => ({
            id: n.refId || n.id,
            title: n.label,
            summary: (n.metadata && n.metadata.description) || '',
            tags: [],
            updatedAt: n.updatedAt,
            createdAt: n.createdAt,
            isTagNode: true
          }));
        } catch(e) {
          notes = noteModule.getRecentNotes(this.data.pageSize);
        }
        break;
      default:
        notes = noteModule.getRecentNotes(this.data.pageSize);
    }
    this.setData({
      notes: notes.map(n => ({
        ...n,
        timeAgo: format.getRelativeTime(n.updatedAt || n.createdAt)
      })),
      inboxCount: stats.inbox
    

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
  },

  setFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    this.loadNotes();
  },

  onTapNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + id 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
  },

  openGraph: function() {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
  },

  createNote: function() {
    wx.navigateTo({ url: '/pages/note-editor/note-editor' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
  }


  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

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
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; });
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  },

});