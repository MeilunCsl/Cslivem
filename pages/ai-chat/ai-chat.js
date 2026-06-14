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
      { text: '???????' },
      { text: '????????????' },
      { text: '??????????' }
    ]
  },

  onLoad: function(options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);

    // Auto-send if query param exists
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
    this.setData({
      messages: messages,
      inputValue: '',
      isTyping: true
    });
    this.scrollToBottom();

    var self = this;
    // Build rich context from knowledge graph
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
        content: '\u274c \u53d1\u9001\u5931\u8d25: ' + err.message,
        mode: 'error',
        time: new Date().toLocaleTimeString()
      }]);
      self.setData({ messages: msgs, isTyping: false });
    });
  },

  buildContext: function(query) {
    var context = '?? Cslivem ????????????????????????????\n\n';

    // Search related nodes in knowledge graph
    var related = graphQuery.searchNodes(query);
    if (related.length > 0) {
      context += '????????????\n';
      related.slice(0, 8).forEach(function(n) {
        context += '- ' + n.label + ' (' + n.type + ')';
        if (n.metadata && n.metadata.description) {
          context += ': ' + n.metadata.description.substring(0, 60);
        }
        context += '\n';
      });
      context += '\n';

      // Get neighbors of top results for deeper context
      var topNode = related[0];
      var neighbors = graphQuery.traverse(topNode.id, 1);
      if (neighbors.length > 0) {
        context += '?????';
        neighbors.slice(0, 5).forEach(function(n) {
          context += n.node.label + ', ';
        });
        context += '\n';
      }
    }

    // Graph stats
    var stats = graphEngine.getStats();
    context += '??????' + stats.nodeCount + ' ????' + stats.edgeCount + ' ????\n';

    // Recent notes
    try {
      var notes = notePublic.getAll ? notePublic.getAll() : [];
      if (notes.length > 0) {
        context += '?????';
        notes.slice(0, 3).forEach(function(n) {
          context += '"' + n.title + '", ';
        });
        context += '\n';
      }
    } catch (e) {}

    return context;
  },

  onSuggestionTap: function(e) {
    var text = e.currentTarget.dataset.text;
    this.setData({ inputValue: text });
    this.onSend();
  },

  onClear: function() {
    var self = this;
    wx.showModal({
      title: '\u6e05\u7a7a\u5bf9\u8bdd',
      content: '\u786e\u5b9a\u8981\u6e05\u7a7a\u6240\u6709\u5bf9\u8bdd\u8bb0\u5f55\u5417\uff1f',
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
      title: '\u4fdd\u5b58\u4e3a\u7b14\u8bb0',
      content: '\u5c06\u8fd9\u6761 AI \u56de\u7b54\u4fdd\u5b58\u4e3a\u7b14\u8bb0\uff1f',
      success: function(res) {
        if (res.confirm) {
          try {
            var title = content.substring(0, 30).replace(/[\n\r]/g, ' ') + '...';
            notePublic.createNote({
              title: title,
              content: content,
              tags: ['AI\u56de\u7b54', '\u6536\u4ef6\u7bb1'],
              source: 'ai-chat'
            });
            wx.showToast({ title: '\u5df2\u4fdd\u5b58', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '\u4fdd\u5b58\u5931\u8d25', icon: 'none' });
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
