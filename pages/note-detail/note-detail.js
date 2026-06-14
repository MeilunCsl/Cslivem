Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    note: null,
    isEditing: false,
    editContent: '',
    showTagInput: false,
    backlinks: [],
    parsedContent: '',
    newTag: '',
    aiLoading: false,
    aiSummary: '',
    aiTags: [],
    showAiPanel: false,
    aiRelated: []
  },

  onLoad(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

}); } catch(e) {}
    const noteId = options.id || '';
    this.setData({ noteId 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
    this.loadNote(noteId);
    this.loadBacklinks(noteId);
    setTimeout(() => { this.setData({ ready: true 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

}); }, 100);
  },

  loadNote(id) {
    const noteModule = require('../../modules/note/public');
    const note = noteModule.getRecentNotes(100).find(n => n.id === id);
    if (note) {
      this.setData({ note, editContent: note.content 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
      this.parseWikiLinks(note.content || '');
    } else {
      wx.showToast({ title: '笔记不存在', icon: 'none' 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  toggleEdit() {
    this.setData({ isEditing: !this.data.isEditing 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  onContentInput(e) {
    this.setData({ editContent: e.detail.value 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  saveNote() {
    const noteModule = require('../../modules/note/public');
    const { noteId, editContent, note } = this.data;
    if (!note) return;
    const updated = noteModule.updateNote(noteId, {
      content: editContent,
      summary: noteModule.generateSummary(editContent)
    

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
    this.setData({ note: updated, isEditing: false 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
    wx.showToast({ title: '已保存', icon: 'success' 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  toggleFavorite() {
    const noteModule = require('../../modules/note/public');
    const { noteId } = this.data;
    const updated = noteModule.toggleFavorite(noteId);
    this.setData({ note: updated 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  showAddTag() {
    this.setData({ showTagInput: true 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  onTagInput(e) {
    this.setData({ newTag: e.detail.value 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  confirmAddTag() {
    const noteModule = require('../../modules/note/public');
    const { noteId, newTag } = this.data;
    if (!newTag.trim()) return;
    const updated = noteModule.addTag(noteId, newTag.trim());
    this.setData({ note: updated, newTag: '', showTagInput: false 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  removeTag(e) {
    const noteModule = require('../../modules/note/public');
    const { noteId } = this.data;
    const tag = e.currentTarget.dataset.tag;
    const updated = noteModule.removeTag(noteId, tag);
    this.setData({ note: updated 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  loadBacklinks(id) {
    try {
      const knowledgeModule = require('../../modules/knowledge/public');
      const node = knowledgeModule.findNodeByRef(id);
      if (node) {
        const backlinkNodes = knowledgeModule.getBacklinks(node.id);
        this.setData({ backlinks: backlinkNodes.map(n => ({
          id: n.refId || n.id,
          title: n.label,
          summary: n.metadata && n.metadata.description || ''
        }))

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
      }
    } catch(e) {
      console.warn('[NoteDetail] loadBacklinks error:', e);
    }
  },

  onTapBacklink(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: '/pages/note-detail/note-detail?id=' + id 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  goBack() { wx.navigateBack(); },

  openGraph() {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  },

  deleteNote() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这条笔记吗？',
      success: (res) => {
        if (res.confirm) {
          const noteModule = require('../../modules/note/public');
          noteModule.deleteNote(this.data.noteId);
          wx.showToast({ title: '已删除', icon: 'success' 

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
          setTimeout(() => wx.navigateBack(), 1000);
        }
      }
    

  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});
  }


  toggleAiPanel: function() {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.summarizeNote(content).then(function(res) {
      self.setData({ aiSummary: res.summary, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u6458\u8981\u5b8c\u6210' : '\u672c\u5730\u6458\u8981', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u6458\u8981\u5931\u8d25', icon: 'none' });
    });
  },

  onAiSuggestTags: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '\u7b14\u8bb0\u65e0\u5185\u5bb9', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.suggestTagsForNote(content).then(function(res) {
      var existingTags = (self.data.note && self.data.note.tags) || [];
      var newTags = res.tags.filter(function(t) { return existingTags.indexOf(t) < 0; });
      self.setData({ aiTags: newTags, aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI \u63a8\u8350\u5b8c\u6210' : '\u672c\u5730\u63a8\u8350', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '\u63a8\u8350\u5931\u8d25', icon: 'none' });
    });
  },

  onApplyAiSummary: function() {
    var self = this;
    if (!self.data.aiSummary) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '\u5df2\u5e94\u7528', icon: 'success' });
    }
  },

  onApplyAiTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var noteModule = require('../../modules/note/public');
    var updated = noteModule.addTag(self.data.noteId, tag);
    if (updated) {
      var remaining = this.data.aiTags.filter(function(t) { return t !== tag; });
      this.setData({ note: updated, aiTags: remaining });
    }
  },



  onAiSuggestRelated: function() {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }
    self.setData({ aiLoading: true });
    var gateway = require('../../miniprogram/ai-gateway');
    var graphEngine = require('../../core/graph/graph-engine');
    var graphQuery = require('../../core/graph/graph-query');

    gateway.suggestRelated(content).then(function(res) {
      var keywords = res.keywords || [];
      var related = [];
      keywords.forEach(function(kw) {
        var nodes = graphQuery.searchNodes(kw);
        nodes.forEach(function(node) {
          if (node.refId !== self.data.noteId && related.findIndex(function(r) { return r.id === node.id; }) < 0) {
            related.push({ id: node.id, label: node.label, type: node.type, keyword: kw });
          }
        });
      });
      self.setData({ aiRelated: related.slice(0, 8), aiLoading: false });
      wx.showToast({ title: res.source === 'ai' ? 'AI 关联完成' : '本地关联', icon: 'success' });
    }).catch(function() {
      self.setData({ aiLoading: false });
      wx.showToast({ title: '关联失败', icon: 'none' });
    });
  },

  onGoRelatedNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var nodeType = e.currentTarget.dataset.type;
    if (nodeType === 'note') {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + nodeId });
    } else {
      wx.navigateTo({ url: '/pages/graph-view/graph-view?highlight=' + nodeId });
    }
  },



  onShareAppMessage: function() {
    var note = this.data.note;
    var title = (note ? note.title : '') || '来自 Cslivem 的笔记';
    var content = note ? (note.content || '').substring(0, 100) : '';
    return {
      title: title,
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    var note = this.data.note;
    return {
      title: (note ? note.title : '') || 'Cslivem 笔记',
      query: 'id=' + this.data.noteId,
      imageUrl: ''
    };
  },

  onShareNote: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['发送给朋友', '复制链接', '复制内容'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '来看我在 Cslivem 写的笔记：' + (self.data.note ? self.data.note.title : ''),
            success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
          });
        } else if (res.tapIndex === 2) {
          var content = self.data.note ? self.data.note.content : '';
          wx.setClipboardData({
            data: content,
            success: function() { wx.showToast({ title: '已复制内容', icon: 'success' }); }
          });
        }
      }
    });
  }


  onApplyAllAiTags: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    self.data.aiTags.forEach(function(tag) {
      noteModule.addTag(self.data.noteId, tag);
    });
    var note = noteModule.getRecentNotes(100).find(function(n) { return n.id === self.data.noteId; });
    self.setData({ note: note, aiTags: [] });
    wx.showToast({ title: '\u5df2\u5e94\u7528\u5168\u90e8', icon: 'success' });
  }

});