// components/custom-tabbar/custom-tabbar.js
Component({
  data: {
    selected: 0,
    showPanel: false
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset;
      this.setData({ selected: index, showPanel: false });
      wx.switchTab({ url });
    },

    togglePanel() {
      this.setData({ showPanel: !this.data.showPanel });
    },

    hidePanel() {
      this.setData({ showPanel: false });
    },

    onAction(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({ showPanel: false });
      console.log('[TabBar] 快速记录:', type);
      wx.showToast({ title: type === 'text' ? '文字记录' : type === 'photo' ? '拍照' : type === 'voice' ? '语音' : '扫描', icon: 'none' });
      // 后续路由到对应功能页
    },

    noop() {}
  }
});
