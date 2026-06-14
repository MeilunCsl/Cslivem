// pages/note-detail/note-detail.js
var noteService = require('../../core/notes/note-service');
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var gateway = require('../../miniprogram/ai-gateway');
var markdown = require('../../utils/markdown');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    note: null,
    isEditing: false,
    editContent: '',
    showTagInput: false,
    newTag: '',
    showAiPanel: false,
    aiLoading: false,
    aiSummary: '',
    aiTags: [],
    relatedNodes: [],
    htmlContent: ''
  },

  onLoad: function (options) {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}

    if (options && options.id) {
      self.setData({ noteId: options.id });
      self._loadNote(options.id);
    }

    setTimeout(function () {
      self.setData({ ready: true });
    }, 100);
  },

  _loadNote: function (id) {
    var self = this;
    var note = noteService.getNote(id);
    if (!note) {
      wx.showToast({ title: '笔记不存在', icon: 'none' });
      return;
    }

    var htmlContent = markdown.parseMarkdown(note.content || '');
    self.setData({
      note: note,
      htmlContent: htmlContent,
      editContent: note.content || ''
    });

    // Load related nodes from graph
    self._loadRelatedNodes(note);
  },

  _loadRelatedNodes: function (note) {
    var self = this;
    try {
      var nodeId = note.nodeId || note.id;
      var neighbors = graphEngine.getNeighbors(nodeId);
      var nodes = [];
      for (var i = 0; i < neighbors.length; i++) {
        var n = neighbors[i];
        if (n.node) {
          nodes.push({
            id: n.node.id,
            title: n.node.title || n.node.label || '',
            type: n.node.type || '',
            edgeCount: n.edges ? n.edges.length : 0
          });
        }
      }
      self.setData({ relatedNodes: nodes.slice(0, 20) });
    } catch (e) {
      console.warn('[note-detail] load related nodes error:', e);
    }
  },

  // ===== Navigation =====

  goBack: function () {
    wx.navigateBack();
  },

  openGraph: function () {
    wx.navigateTo({ url: '/pages/graph/graph' });
  },

  // ===== Note CRUD =====

  toggleFavorite: function () {
    var self = this;
    var note = self.data.note;
    if (!note) return;

    var updated = noteService.updateNote(note.id, {
      isFavorite: !note.isFavorite
    });
    if (updated) {
      self.setData({ note: updated });
      wx.showToast({ title: updated.isFavorite ? '已收藏' : '已取消收藏', icon: 'success' });
    }
  },

  toggleEdit: function () {
    var self = this;
    if (self.data.isEditing) {
      // Save on exit edit mode
      var content = self.data.editContent;
      var updated = noteService.updateNote(self.data.noteId, { content: content });
      if (updated) {
        self.setData({
          note: updated,
          htmlContent: markdown.parseMarkdown(content),
          isEditing: false
        });
        wx.showToast({ title: '已保存', icon: 'success' });
      }
    } else {
      self.setData({ isEditing: true });
    }
  },

  onShareNote: function () {
    // Triggered by button; actual share via onShareAppMessage
  },

  deleteNote: function () {
    var self = this;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: function (res) {
        if (res.confirm) {
          noteService.deleteNote(self.data.noteId);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(function () {
            wx.navigateBack();
          }, 800);
        }
      }
    });
  },

  // ===== Tags =====

  removeTag: function (e) {
    var self = this;
    var tag = e.currentTarget.dataset.tag;
    var note = self.data.note;
    if (!note || !tag) return;

    var tags = (note.tags || []).filter(function (t) { return t !== tag; });
    var updated = noteService.updateNote(note.id, { tags: tags });
    if (updated) {
      self.setData({ note: updated });
    }
  },

  showAddTag: function () {
    this.setData({ showTagInput: true, newTag: '' });
  },

  onTagInput: function (e) {
    this.setData({ newTag: e.detail.value });
  },

  confirmAddTag: function () {
    var self = this;
    var tag = self.data.newTag;
    if (!tag || !tag.trim()) {
      self.setData({ showTagInput: false });
      return;
    }

    var note = self.data.note;
    var existing = note.tags || [];
    if (existing.indexOf(tag.trim()) >= 0) {
      wx.showToast({ title: '标签已存在', icon: 'none' });
      return;
    }

    var tags = existing.concat([tag.trim()]);
    var updated = noteService.updateNote(note.id, { tags: tags });
    if (updated) {
      self.setData({ note: updated, showTagInput: false, newTag: '' });
    }
  },

  // ===== AI Panel =====

  toggleAiPanel: function () {
    this.setData({ showAiPanel: !this.data.showAiPanel });
  },

  onAiSummarize: function () {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }

    self.setData({ aiLoading: true });
    gateway.ask('请用一句话（不超过50字）概括以下内容的核心要点：\n\n' + content.substring(0, 2000), '你是一个笔记摘要助手。')
      .then(function (res) {
        self.setData({ aiSummary: res.content || '', aiLoading: false });
        wx.showToast({ title: 'AI 摘要完成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiLoading: false });
        wx.showToast({ title: 'AI 暂不可用', icon: 'none' });
      });
  },

  onAiSuggestTags: function () {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }

    self.setData({ aiLoading: true });
    gateway.ask('根据以下内容，推荐3-5个简短中文标签，用逗号分隔，只输出标签列表：\n\n' + content.substring(0, 1500), '你是一个标签推荐助手。')
      .then(function (res) {
        var raw = res.content || '';
        var tags = raw.split(/[,，、\s]+/).map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 0 && t.length < 20; });
        self.setData({ aiTags: tags.slice(0, 5), aiLoading: false });
        wx.showToast({ title: '标签推荐完成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiLoading: false });
        wx.showToast({ title: 'AI 暂不可用', icon: 'none' });
      });
  },

  onAiSuggestRelated: function () {
    var self = this;
    var content = self.data.note ? self.data.note.content : '';
    if (!content) {
      wx.showToast({ title: '笔记无内容', icon: 'none' });
      return;
    }

    self.setData({ aiLoading: true });
    gateway.ask('根据以下内容，提取3-5个关键词或概念，用逗号分隔，只输出关键词：\n\n' + content.substring(0, 1500), '你是一个知识关联助手。')
      .then(function (res) {
        var raw = res.content || '';
        var keywords = raw.split(/[,，、\s]+/).map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 1; });
        // Search graph for matching nodes
        var related = [];
        for (var i = 0; i < keywords.length; i++) {
          var found = graphQuery.searchNodes(keywords[i]);
          for (var j = 0; j < found.length && related.length < 10; j++) {
            related.push({
              id: found[j].id,
              title: found[j].title || found[j].label || '',
              type: found[j].type || ''
            });
          }
        }
        self.setData({ relatedNodes: related, aiLoading: false });
        wx.showToast({ title: '关联推荐完成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiLoading: false });
        wx.showToast({ title: 'AI 暂不可用', icon: 'none' });
      });
  },

  onApplyAiSummary: function () {
    var self = this;
    if (!self.data.aiSummary) return;
    var updated = noteService.updateNote(self.data.noteId, { summary: self.data.aiSummary });
    if (updated) {
      self.setData({ note: updated, aiSummary: '' });
      wx.showToast({ title: '摘要已应用', icon: 'success' });
    }
  },

  onApplyAiTag: function (e) {
    var self = this;
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;
    var note = self.data.note;
    var existing = note.tags || [];
    if (existing.indexOf(tag) >= 0) return;

    var tags = existing.concat([tag]);
    var updated = noteService.updateNote(note.id, { tags: tags });
    if (updated) {
      self.setData({ note: updated });
    }
  },

  onApplyAllAiTags: function () {
    var self = this;
    var note = self.data.note;
    if (!note || self.data.aiTags.length === 0) return;

    var existing = note.tags || [];
    var merged = existing.slice();
    for (var i = 0; i < self.data.aiTags.length; i++) {
      if (merged.indexOf(self.data.aiTags[i]) < 0) {
        merged.push(self.data.aiTags[i]);
      }
    }
    var updated = noteService.updateNote(note.id, { tags: merged });
    if (updated) {
      self.setData({ note: updated, aiTags: [] });
      wx.showToast({ title: '全部标签已应用', icon: 'success' });
    }
  },

  onGoRelatedNode: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    // Check if it is a note node
    var node = graphEngine.getNode(id);
    if (node && node.type === 'note' && node.data && node.data.noteId) {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + node.data.noteId });
    } else {
      wx.navigateTo({ url: '/pages/graph-node-detail/graph-node-detail?id=' + id });
    }
  },

  // ===== Share =====

  onShareAppMessage: function () {
    var note = this.data.note;
    return {
      title: note ? note.title : '笔记',
      path: '/pages/note-detail/note-detail?id=' + this.data.noteId
    };
  },

  onShareTimeline: function () {
    var note = this.data.note;
    return {
      title: note ? note.title : '笔记',
      query: 'id=' + this.data.noteId
    };
  }
});
