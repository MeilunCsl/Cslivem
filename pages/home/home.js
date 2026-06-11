// pages/home/home.js - 极简首页
Page({
  data: {
    statusBarHeight: 20
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

  onInputTap() {
    wx.showToast({ title: '输入功能开发中', icon: 'none' });
  },

  onSuggestion(e) {
    const text = e.currentTarget.dataset.text;
    wx.showToast({ title: text, icon: 'none' });
  }
});