Component({
  properties: {
    selected: { type: Number, value: 0 }
  },

  data: {
    showPanel: false,
    tabReady: false,
    indicatorClass: 'pos-0'
  },

  lifetimes: {
    attached() {
      setTimeout(() => { this.setData({ tabReady: true }); }, 200);
      this.updateIndicator(this.data.selected);
    }
  },

  observers: {
    'selected': function(val) {
      this.updateIndicator(val);
    }
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset;
      if (index === this.data.selected) return;
      wx.vibrateShort({ type: 'light' }).catch(() => {});
      this.setData({ showPanel: false });
      wx.switchTab({ url });
    },

    updateIndicator(selectedIndex) {
      this.setData({ indicatorClass: 'pos-' + selectedIndex });
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
