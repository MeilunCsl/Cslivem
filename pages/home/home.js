// pages/home/home.js
var conversationStore = require('../../core/conversation/store');

Page({
  data: {
    statusBarHeight: 20,
    inputValue: '',
    inputFocused: false,
    ready: false,
    isSending: false,
    recentConversations: [],
    dashboard: {},
    suggestions: [
      { icon: '✨', text: '记一下灵感' },
      { icon: '📚', text: '整理本周笔记' },
      { icon: '🔍', text: '搜索知识库' },
      { icon: '🧠', text: 'AI 总结最近内容' }
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
    this.loadRecentConversations();
    this.loadDashboard();
  },


  loadDashboard: function() {
    try {
      var habitModule = require('../../modules/habit/public');
      var fcModule = require('../../modules/flashcard/public');
      var moodModule = require('../../modules/mood/public');
      var foodModule = require('../../modules/food/public');

      var habitStats = habitModule.getStats();
      var fcStats = fcModule.getStats();
      var moodToday = moodModule.getToday();
      var foodSummary = foodModule.getTodaySummary();

      this.setData({
        dashboard: {
          habits: { done: habitStats.todayDone || 0, total: habitStats.totalHabits || 0 },
          flashcards: { due: fcStats.dueNow || 0, reviewed: fcStats.todayReviews || 0 },
          mood: moodToday ? moodToday.mood : 0,
          calories: foodSummary.totalCalories || 0
        }
      });
    } catch(e) {}
  },

  loadRecentConversations: function() {
    try {
      var recent = conversationStore.getRecentConversations(3);
      var formatted = recent.map(function(c) {
        var now = Date.now();
        var diff = now - c.updatedAt;
        var timeAgo = '';
        if (diff < 60000) timeAgo = '刚刚';
        else if (diff < 3600000) timeAgo = Math.floor(diff / 60000) + '分钟前';
        else if (diff < 86400000) timeAgo = Math.floor(diff / 3600000) + '小时前';
        else timeAgo = Math.floor(diff / 86400000) + '天前';
        return {
          id: c.id,
          title: c.title || '新对话',
          summary: c.summary || '',
          messageCount: c.messageCount || 0,
          model: c.model || '',
          timeAgo: timeAgo
        };
      });
      this.setData({ recentConversations: formatted });
    } catch (e) {
      this.setData({ recentConversations: [] });
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
    wx.navigateTo({
      url: '/pages/chat/chat?send=' + encodeURIComponent(text),
      complete: function() {}
    });
    var self = this;
    setTimeout(function() { self.setData({ isSending: false }); }, 500);
  },

  onDashTap: function(e) {
    var url = e.currentTarget.dataset.url;
    if (url) wx.navigateTo({ url: url });
  },

  onSuggestionTap: function(e) {
    var text = e.currentTarget.dataset.text;
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    wx.navigateTo({ url: '/pages/chat/chat?send=' + encodeURIComponent(text) });
  },

  onConversationTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/chat/chat?id=' + id });
  },

  onInputTap: function() {}
});
