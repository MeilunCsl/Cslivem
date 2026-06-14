// pages/note-editor/note-editor.js
var noteModule = require('../../modules/note/public');
var graphQuery = require('../../core/graph/graph-query');
var types = require('../../core/graph/types');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    title: '',
    content: '',
    isNew: false,
    showToolbar: true,
    // Wiki-link suggestions
    showSuggestions: false,
    linkQuery: '',
    suggestions: []
  },

  onLoad: function(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    var noteId = options.id || '';
    this.setData({ noteId: noteId, isNew: !noteId });
    if (noteId) { this.loadNote(noteId); }
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  loadNote: function(id) {
    var note = noteModule.getRecentNotes(100);
    for (var i = 0; i < note.length; i++) {
      if (note[i].id === id) {
        this.setData({ title: note[i].title, content: note[i].content });
        break;
      }
    }
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput: function(e) {
    var value = e.detail.value;
    this.setData({ content: value });
    // Detect [[ trigger for link suggestions
    this._checkLinkTrigger(value);
  },

  _checkLinkTrigger: function(text) {
    // Find the last [[ that hasn't been closed
    var lastOpen = text.lastIndexOf('[[');
    var lastClose = text.lastIndexOf(']]');
    if (lastOpen > lastClose && lastOpen >= 0) {
      var query = text.substring(lastOpen + 2);
      if (query.length <= 20) {
        this._searchSuggestions(query);
        return;
      }
    }
    this.setData({ showSuggestions: false, suggestions: [] });
  },

  _searchSuggestions: function(query) {
    var results = [];
    if (query.length === 0) {
      // Show recent notes
      results = noteModule.getRecentNotes(5).map(function(n) {
        return { id: n.id, label: n.title || 'Untitled', type: 'note' };
      });
    } else {
      // Search graph nodes
      var nodes = graphQuery.searchNodes(query);
      results = nodes.slice(0, 8).map(function(n) {
        return { id: n.id, label: n.label, type: n.type };
      });
      // Also search notes directly
      var notes = noteModule.searchNotes(query);
      notes.slice(0, 3).forEach(function(n) {
        var nodeId = 'node_note_' + n.id;
        var exists = results.some(function(r) { return r.id === nodeId; });
        if (!exists) {
          results.push({ id: nodeId, label: n.title || 'Untitled', type: 'note' });
        }
      });
    }
    this.setData({ showSuggestions: results.length > 0, suggestions: results, linkQuery: query });
  },

  onSuggestionTap: function(e) {
    var label = e.currentTarget.dataset.label;
    var content = this.data.content;
    var lastOpen = content.lastIndexOf('[[');
    if (lastOpen >= 0) {
      var newContent = content.substring(0, lastOpen + 2) + label + ']]';
      this.setData({ content: newContent, showSuggestions: false, suggestions: [] });
    }
  },

  insertMarkdown: function(e) {
    var type = e.currentTarget.dataset.type;
    var content = this.data.content;
    var insert = '';
    switch (type) {
      case 'bold': insert = '**粗体**'; break;
      case 'italic': insert = '*斜体*'; break;
      case 'heading': insert = '## '; break;
      case 'list': insert = '- '; break;
      case 'link': insert = '[[]]'; break;
      case 'code': insert = '`代码`'; break;
      case 'divider': insert = '\n---\n'; break;
    }
    this.setData({ content: content + insert });
    if (type === 'link') {
      this._checkLinkTrigger(content + insert);
    }
  },

  // AI Assistance
  aiSuggestTitle: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' });
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.ask('为以下内容生成一个简洁标题（不超过20字，只返回标题）：\n' + self.data.content.substring(0, 500))
      .then(function(r) {
        self.setData({ title: r.content.replace(/['"]/g, '').trim() });
        wx.showToast({ title: '标题已生成', icon: 'success' });
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' }); });
  },

  aiSuggestTags: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' });
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.suggestTags(self.data.content)
      .then(function(r) {
        var tags = r.tags || [];
        if (tags.length > 0) {
          wx.showModal({
            title: 'AI 建议标签',
            content: tags.join(', '),
            confirmText: '添加到笔记',
            success: function(res) {
              if (res.confirm) {
                var noteModule = require('../../modules/note/public');
                tags.forEach(function(tag) {
                  try { noteModule.addTag(self.data.noteId, tag); } catch(e) {}
                });
                wx.showToast({ title: '已添加 ' + tags.length + ' 个标签', icon: 'success' });
              }
            }
          });
        }
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' }); });
  },

  aiSummarize: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' });
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.summarize(self.data.content)
      .then(function(r) {
        wx.showModal({
          title: 'AI 摘要',
          content: r.summary || '(空)',
          showCancel: false
        });
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' }); });
  },

  goBack: function() { wx.navigateBack(); },

  save: function() {
    var noteId = this.data.noteId;
    var title = this.data.title;
    var content = this.data.content;
    var isNew = this.data.isNew;
    if (!title.trim() && !content.trim()) {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    if (isNew) {
      var note = noteModule.createNote({ title: title.trim(), content: content });
      this.setData({ noteId: note.id, isNew: false });
      wx.showToast({ title: '已创建', icon: 'success' });
      this.syncToGraph(note.id, title.trim(), content);
    } else {
      noteModule.updateNote(noteId, {
        title: title.trim(),
        content: content,
        summary: noteModule.generateSummary(content)
      });
      this.syncToGraph(noteId, title.trim(), content);
      wx.showToast({ title: '已保存', icon: 'success' });
    }
    var self = this;
    setTimeout(function() { wx.navigateBack(); }, 1000);
  }
});
