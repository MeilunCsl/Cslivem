Component({
  data: {
    selected: 0,
    showPanel: false,
    tabReady: false,
    indicatorX: 0
  },

  lifetimes: {
    attached() {
      setTimeout(() => { this.setData({ tabReady: true }); }, 200);
      this.updateIndicator(this.data.selected);
    }
  },

  pageLifetimes: {
    show() {}
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset;
      if (index === this.data.selected) return;
      wx.vibrateShort({ type: 'light' }).catch(() => {});
      this.setData({ selected: index, showPanel: false });
      this.updateIndicator(index);
      wx.switchTab({ url });
    },

    updateIndicator(index) {
      // tabbar-inner 宽度 = 750 - 48*2 = 654rpx
      // 5 列等分，每列 130.8rpx
      // 指示线居中于第 index 列
      const tabW = 654;
      const cols = 5;
      const colW = tabW / cols;
      const center = colW * index + colW / 2;
      const indicatorW = 44;
      const x = Math.round(center - indicatorW / 2);
      this.setData({ indicatorX: x });
    },

    togglePanel() {
      wx.vibrateShort({ type: 'light' }).catch(() => {});
      this.setData({ showPanel: !this.data.showPanel });
    },

    hidePanel() {
      this.setData({ showPanel: false });
    },

    onAction(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({ showPanel: false });
      const labels = { text: '文字记录', photo: '拍照', voice: '语音', scan: '扫描' };
      wx.showToast({ title: labels[type] || type, icon: 'none' });
    },

    noop() {}
  }
});