// pages/home/home.js - Cslivem 极简 AI 对话首页
Page({
  data: {
    statusBarHeight: 20,
    inputValue: '',
    inputFocused: false,
    ready: false,
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

    // 入场动画延迟触发
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onFocus() {
    this.setData({ inputFocused: true });
  },

  onBlur() {
    this.setData({ inputFocused: false });
  },

  onSend() {
    const text = this.data.inputValue.trim();
    if (!text) return;
    // 按钮按压反馈
    wx.vibrateShort({ type: 'light' }).catch(() => {});
    wx.showToast({ title: 'AI 功能开发中', icon: 'none' });
    this.setData({ inputValue: '' });
  },

  onSuggestionTap(e) {
    const text = e.currentTarget.dataset.text;
    wx.vibrateShort({ type: 'light' }).catch(() => {});
    this.setData({ inputValue: text });
  }
});