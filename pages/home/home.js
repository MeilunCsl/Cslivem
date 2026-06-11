// pages/home/home.js - Cslivem 极简 AI 对话首页
Page({
  data: {
    statusBarHeight: 20,
    inputValue: '',
    suggestions: [
      { icon: '💡', text: '记一下灵感' },
      { icon: '📋', text: '整理本周笔记' },
      { icon: '🔍', text: '搜索知识库' }
    ]
  },

  onLoad() {
    try {
      const sys = wx.getSystemInfoSync();
      this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    } catch (e) {}
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSend() {
    const text = this.data.inputValue.trim();
    if (!text) return;
    wx.showToast({ title: 'AI 功能开发中', icon: 'none' });
    this.setData({ inputValue: '' });
  },

  onSuggestionTap(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({ inputValue: text });
  }
});