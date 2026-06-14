Component({
  properties: {
    selected: { type: Number, value: 0 }
  },

  data: {
    showPanel: false,
    tabReady: false,
    badgeCount: 0
  },

  lifetimes: {
    attached() {
      var self = this;
      setTimeout(function() { self.setData({ tabReady: true }); }, 200);
      this.loadBadges();
    }
  },

  methods: {
    switchTab(e) {
      var index = parseInt(e.currentTarget.dataset.index);
      var url = e.currentTarget.dataset.url;
      if (index === this.data.selected) return;
      wx.vibrateShort({ type: 'light' }).catch(function() {});
      this.setData({ showPanel: false });
      wx.switchTab({ url: url });
    },

    loadBadges() {
      try {
        var fcModule = require('../../modules/flashcard/public');
        var habitModule = require('../../modules/habit/public');
        var fcStats = fcModule.getStats();
        var habitStats = habitModule.getStats();
        var total = (fcStats.dueNow || 0) + Math.max(0, (habitStats.totalHabits || 0) - (habitStats.todayDone || 0));
        this.setData({ badgeCount: total });
      } catch(e) {}
    },

    togglePanel() {
      wx.vibrateShort({ type: 'light' }).catch(function() {});
      this.setData({ showPanel: !this.data.showPanel });
    },

    hidePanel() {
      this.setData({ showPanel: false });
    },

    onAction(e) {
      var type = e.currentTarget.dataset.type;
      this.setData({ showPanel: false });
      var labels = { text: '文字记录', photo: '拍照', voice: '语音', scan: '扫描' };
      wx.showToast({ title: labels[type] || type, icon: 'none' });
    },

    noop() {}
  }
});