// pages/home/home.js
var aiGateway = require('../../miniprogram/ai-gateway');
var graphQuery = require('../../core/graph/graph-query');

Page({
  data: {
    statusBarHeight: 20,
    inputValue: '',
    inputFocused: false,
    ready: false,
    isSending: false,
    suggestions: [
      { icon: '\u2728', text: '?????' },
      { icon: '\ud83d\udcda', text: '??????' },
      { icon: '\ud83d\udd0d', text: '?????' },
      { icon: '\ud83e\udde0', text: 'AI ??????' }
    ]
  },

  onLoad: function() {
    try {
      var sys = wx.getSystemInfoSync();
      this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onInput: function(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onFocus: function() {
    this.setData({ inputFocused: true });
  },

  onBlur: function() {
    this.setData({ inputFocused: false });
  },

  onSend: function() {
    var text = this.data.inputValue.trim();
    if (!text || this.data.isSending) return;
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    this.setData({ isSending: true, inputValue: '' });
    // Navigate to AI chat with the question
    wx.navigateTo({
      url: '/pages/ai-chat/ai-chat?query=' + encodeURIComponent(text),
      complete: function() {
        // Reset sending state after navigation
      }
    });
    var self = this;
    setTimeout(function() { self.setData({ isSending: false }); }, 500);
  },

  onSuggestionTap: function(e) {
    var text = e.currentTarget.dataset.text;
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    // Check if it's a search-type suggestion
    if (text.indexOf('\u641c\u7d22') >= 0 || text.indexOf('\u6574\u7406') >= 0) {
      wx.navigateTo({ url: '/pages/search/search?query=' + encodeURIComponent(text) });
    } else {
      wx.navigateTo({ url: '/pages/ai-chat/ai-chat?query=' + encodeURIComponent(text) });
    }
  },

  onInputTap: function() {
    // Focus the input instead of navigating away
  }
});
