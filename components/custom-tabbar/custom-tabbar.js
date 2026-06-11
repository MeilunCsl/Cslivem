Component({
  properties: {
    selected: { type: Number, value: 0 }
  },

  data: {
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
      this.updateIndicator(index);
      wx.switchTab({ url });
    },

    // selected 0=首页 1=知识 2=日历 3=工具
    // grid 列 0=首页 1=知识 2=FAB 3=日历 4=工具
    // 需要跳过第 2 列(FAB)
    updateIndicator(selectedIndex) {
      const tabW = 654;
      const colW = tabW / 5;
      // 映射: selected → grid列
      const gridColMap = [0, 1, 3, 4];
      const gridCol = gridColMap[selectedIndex] !== undefined ? gridColMap[selectedIndex] : 0;
      const center = colW * gridCol + colW / 2;
      const x = Math.round(center - 22);
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