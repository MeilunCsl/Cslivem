// pages/ai-chat/ai-chat.js
var aiGateway = require('../../miniprogram/ai-gateway');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    messages: [],
    inputValue: '',
    isTyping: false
  },

  onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
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
    aiGateway.ask(text).then(function(result) {
      var msgs = self.data.messages.concat([{
        role: 'assistant',
        content: result.content,
        mode: result.mode || 'api',
        time: new Date().toLocaleTimeString()
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

  onBack: function() {
    wx.navigateBack();
  },

  scrollToBottom: function() {
    var self = this;
    setTimeout(function() {
      self.setData({ scrollIntoView: 'msg-' + (self.data.messages.length - 1) });
    }, 100);
  }
});
