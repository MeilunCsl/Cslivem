// pages/ai-chat/ai-chat.js
var aiGateway = require('../../miniprogram/ai-gateway');
var graphQuery = require('../../core/graph/graph-query');
var graphEngine = require('../../core/graph/graph-engine');
var notePublic = require('../../modules/note/public');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    messages: [],
    inputValue: '',
    isTyping: false,
    scrollIntoView: '',
    suggestions: [
      { text: '总结最近的笔记' },
      { text: '我的知识图谱有哪些节点？' },
      { text: '帮我整理一下待办事项' }
    ]
  },

  onLoad: function(options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
    if (options && options.query) {
      var query = decodeURIComponent(options.query);
      self.setData({ inputValue: query });
      setTimeout(function() { self.onSend(); }, 300);
    }
  },

  onInput: function(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSend: function() {
    var text = this.data.inputValue.trim();
    if (!text || this.data.isTyping) return;
    var messages = this.data.messages.concat([{
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString()
    }]);
    this.setData({ messages: messages, inputValue: '', isTyping: true });
    this.scrollToBottom();
    var self = this;
    var context = self.buildContext(text);
    aiGateway.ask(text, context).then(function(result) {
      var msgs = self.data.messages.concat([{
        role: 'assistant',
        content: result.content,
        mode: result.mode || 'api',
        time: new Date().toLocaleTimeString(),
        canSave: true
      }]);
      self.setData({ messages: msgs, isTyping: false });
      self.scrollToBottom();
    }).catch(function(err) {
      var msgs = self.data.messages.concat([{
        role: 'assistant',
        content: '❌ 发送失败: ' + err.message,
        mode: 'error',
        time: new Date().toLocaleTimeString()
      }]);
      self.setData({ messages: msgs, isTyping: false });
    });
  },

  buildContext: function(query) {
    var ctx = '你是 Cslivem 智能助手，帮助用户管理知识、笔记和任务。简洁明了地回答。\n\n';
    var related = graphQuery.searchNodes(query);
    if (related.length > 0) {
      ctx += '用户知识库中的相关内容：\n';
      related.slice(0, 8).forEach(function(n) {
        ctx += '- ' + n.label + ' (' + n.type + ')';
        if (n.metadata && n.metadata.description) {
          ctx += ': ' + n.metadata.description.substring(0, 60);
        }
        ctx += '\n';
      });
      ctx += '\n';
      var topNode = related[0];
      var neighbors = graphQuery.traverse(topNode.id, 1);
      if (neighbors.length > 0) {
        ctx += '关联节点：';
        neighbors.slice(0, 5).forEach(function(n) {
          ctx += n.node.label + ', ';
        });
        ctx += '\n';
      }
    }
    var stats = graphEngine.getStats();
    ctx += '知识库概览：' + stats.nodeCount + ' 个节点，' + stats.edgeCount + ' 条关联。\n';
    try {
      var notes = notePublic.getAll ? notePublic.getAll() : [];
      if (notes.length > 0) {
        ctx += '最近笔记：';
        notes.slice(0, 3).forEach(function(n) {
          ctx += '"' + n.title + '", ';
        });
        ctx += '\n';
      }
    } catch (e) {}
    return ctx;
  },

  onSuggestionTap: function(e) {
    var text = e.currentTarget.dataset.text;
    this.setData({ inputValue: text });
    this.onSend();
  },

  onClear: function() {
    var self = this;
    wx.showModal({
      title: '清空对话',
      content: '确定要清空所有对话记录吗？',
      success: function(res) {
        if (res.confirm) {
          self.setData({ messages: [] });
          aiGateway.clearHistory();
        }
      }
    });
  },

  onSaveAsNote: function(e) {
    var content = e.currentTarget.dataset.content;
    var self = this;
    wx.showModal({
      title: '保存为笔记',
      content: '将这条 AI 回答保存为笔记？',
      success: function(res) {
        if (res.confirm) {
          try {
            var title = content.substring(0, 30).replace(/[\n\r]/g, ' ') + '...';
            notePublic.createNote({
              title: title,
              content: content,
              tags: ['AI回答', '收件箱'],
              source: 'ai-chat'
            });
            wx.showToast({ title: '已保存', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      }
    });
  },

  onBack: function() {
    wx.navigateBack();
  },

  scrollToBottom: function() {
    var self = this;
    setTimeout(function() {
      var lastIdx = self.data.messages.length - 1;
      if (lastIdx >= 0) {
        self.setData({ scrollIntoView: 'msg-' + lastIdx });
      }
    }, 100);
  }
});
