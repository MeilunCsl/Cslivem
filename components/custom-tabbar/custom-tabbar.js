Component({
  data: {
    selected: 0,
    showPanel: false,
    tabReady: false,
    indicatorX: -200
  },

  lifetimes: {
    attached() {
      setTimeout(() => { this.setData({ tabReady: true }); }, 200);
      this.updateIndicator(this.data.selected);
    }
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
      // 5 列等分，每列宽度 = (屏幕宽 - 96rpx) / 5
      // 屏幕宽 750rpx → 每列 130.8rpx
      // 第 index 列的中心 = 48rpx + 130.8rpx * index + 65.4rpx
      // 指示线宽 44rpx，偏移 = 中心 - 22rpx
      const colW = (750 - 96) / 5;
      const centerX = 48 + colW * index + colW / 2;
      const x = Math.round(centerX - 22);
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
      wx.showToast({ title: type === 'text' ? '文字记录' : type === 'photo' ? '拍照' : type === 'voice' ? '语音' : '扫描', icon: 'none' });
    },

    noop() {}
  }
});