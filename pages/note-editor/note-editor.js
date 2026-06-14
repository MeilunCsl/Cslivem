// pages/note-editor/note-editor.js
var noteService = require('../../core/notes/note-service');
var wikiLinkParser = require('../../core/notes/wiki-link-parser');
var markdown = require('../../utils/markdown');
var graphQuery = require('../../core/graph/graph-query');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    title: '',
    content: '',
    tags: '',
    isNew: false,
    showToolbar: true,
    previewMode: false,
    htmlContent: '',
    showSuggestions: false,
    linkQuery: '',
    suggestions: [],
    showAiMenu: false,
    aiProcessing: false
  },

  onLoad: function (options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) { /* ignore */ }
    var self = this;
    if (options.id) {
      var note = noteService.getNote(options.id);
      if (note) {
        self.setData({
          noteId: note.id,
          title: note.title || '',
          content: note.content || '',
          tags: (note.tags || []).join(', '),
          isNew: false
        });
      }
    } else {
      self.setData({ isNew: true });
    }
    setTimeout(function () { self.setData({ ready: true }); }, 100);
  },

  goBack: function () {
    wx.navigateBack({ fail: function () { wx.switchTab({ url: '/pages/notes/notes' }); } });
  },

  // ===== Input Handlers =====
  onTitleInput: function (e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput: function (e) {
    var val = e.detail.value || '';
    this.setData({ content: val });
    // Trigger wiki-link suggestions when [[ is typed
    var lastOpen = val.lastIndexOf('[[');
    var lastClose = val.lastIndexOf(']]');
    if (lastOpen > lastClose && lastOpen >= 0) {
      var query = val.substring(lastOpen + 2);
      this.triggerLinkSuggestions(query);
    } else {
      this.setData({ showSuggestions: false });
    }
  },

  triggerLinkSuggestions: function (query) {
    if (!query) {
      this.setData({ showSuggestions: true, linkQuery: '', suggestions: [] });
      return;
    }
    var results = graphQuery.searchNodes(query);
    this.setData({
      showSuggestions: true,
      linkQuery: query,
      suggestions: results.slice(0, 8).map(function (n) {
        return { id: n.id, label: n.label, type: n.type };
      })
    });
  },

  onSuggestionTap: function (e) {
    var label = e.currentTarget.dataset.label;
    var content = this.data.content;
    var lastOpen = content.lastIndexOf('[[');
    if (lastOpen >= 0) {
      var newContent = content.substring(0, lastOpen + 2) + label + ']]';
      this.setData({ content: newContent, showSuggestions: false });
    }
  },

  // ===== Markdown =====
  insertMarkdown: function (e) {
    var type = e.currentTarget.dataset.type;
    var content = this.data.content;
    var insertions = {
      bold: '**粗体**',
      italic: '*斜体*',
      heading: '\n## 标题\n',
      list: '\n- 列表项\n',
      code: '\n```\n代码\n```\n',
      link: '[[链接]]',
      divider: '\n---\n'
    };
    var text = insertions[type] || '';
    this.setData({ content: content + text });
  },

  togglePreview: function () {
    var self = this;
    if (!self.data.previewMode) {
      var html = markdown.parseMarkdown(self.data.content || '');
      self.setData({ previewMode: true, htmlContent: html });
    } else {
      self.setData({ previewMode: false });
    }
  },

  // ===== Save =====
  save: function () {
    var self = this;
    var title = self.data.title.trim();
    var content = self.data.content.trim();
    if (!title && !content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    // Auto-title from first line
    if (!title) {
      var firstLine = content.split('\n')[0].replace(/^[#\s*>-]+/, '').trim();
      title = firstLine.substring(0, 30) || '无标题笔记';
    }
    var tags = self.data.tags
      ? self.data.tags.split(/[,，\s]+/).filter(function (t) { return !!t.trim(); })
      : [];

    try {
      if (self.data.isNew || !self.data.noteId) {
        var note = noteService.createNote({ title: title, content: content, tags: tags });
        self.setData({ noteId: note.id, isNew: false });
        wx.showToast({ title: '已保存', icon: 'success' });
      } else {
        noteService.updateNote(self.data.noteId, { title: title, content: content, tags: tags });
        wx.showToast({ title: '已更新', icon: 'success' });
      }
    } catch (err) {
      console.error('[NoteEditor] save error:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  // ===== AI Features =====
  toggleAiMenu: function () {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  aiSuggestTitle: function () {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    var gateway = require('../../miniprogram/ai-gateway');
    self.setData({ aiProcessing: true });
    gateway.ask(content.substring(0, 500), '请为以下内容生成一个简短的标题，只输出标题文本：')
      .then(function (res) {
        var result = (res.content || '').replace(/^[#\s"']*/, '').replace(/["'\s]*$/, '');
        self.setData({ title: result, aiProcessing: false });
        wx.showToast({ title: '标题已生成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiProcessing: false });
        wx.showToast({ title: 'AI 失败', icon: 'none' });
      });
  },

  aiSuggestTags: function () {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    var gateway = require('../../miniprogram/ai-gateway');
    self.setData({ aiProcessing: true });
    gateway.ask(content.substring(0, 1000), '请为以下内容提取 3-5 个标签，用逗号分隔，只输出标签：')
      .then(function (res) {
        var tags = (res.content || '').replace(/[#\s"'\[\]]/g, '').trim();
        self.setData({ tags: tags, aiProcessing: false });
        wx.showToast({ title: '标签已生成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiProcessing: false });
        wx.showToast({ title: 'AI 失败', icon: 'none' });
      });
  },

  aiSummarize: function () {
    this.runAiTask('summarize');
  },

  onAiContinue: function () { this.runAiTask('continue'); },
  onAiRewrite: function () { this.runAiTask('rewrite'); },
  onAiExtractTasks: function () { this.runAiTask('extract'); },
  onAiExpand: function () { this.runAiTask('expand'); },
  onAiShorten: function () { this.runAiTask('shorten'); },

  runAiTask: function (task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });
    var gateway = require('../../miniprogram/ai-gateway');
    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };
    var systemPrompt = prompts[task] || prompts.summarize;
    gateway.ask(content.substring(0, 2000), systemPrompt)
      .then(function (res) {
        var result = res.content || '';
        if (task === 'continue') {
          self.setData({ content: content + '\n\n' + result, aiProcessing: false });
        } else if (task === 'extract') {
          self.setData({ content: content + '\n\n## 提取的任务\n' + result, aiProcessing: false });
        } else {
          wx.showModal({
            title: 'AI 结果',
            content: result.substring(0, 500),
            confirmText: '应用',
            cancelText: '取消',
            success: function (modalRes) {
              if (modalRes.confirm) {
                self.setData({ content: result, aiProcessing: false });
              } else {
                self.setData({ aiProcessing: false });
              }
            }
          });
        }
        wx.showToast({ title: 'AI 完成', icon: 'success' });
      })
      .catch(function () {
        self.setData({ aiProcessing: false });
        wx.showToast({ title: 'AI 失败', icon: 'none' });
      });
  }
});
