// components/nav-bar/nav-bar.js
Component({
  options: { multipleSlots: true },
  properties: {
    title: { type: String, value: '' },
    showBack: { type: Boolean, value: false },
    fixed: { type: Boolean, value: true }
  },
  data: {
    statusBarHeight: 20
  },
  lifetimes: {
    attached() {
      try {
        const sys = wx.getSystemInfoSync();
        this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
      } catch (e) {}
    }
  },
  methods: {
    onBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        wx.switchTab({ url: '/pages/home/home' });
      }
    }
  }
});
