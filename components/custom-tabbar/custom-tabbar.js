Component({
  properties: {
    selected: { type: Number, value: 0 }
  },

  data: {
    showPanel: false,
    tabReady: false,
    indicatorLeft: '10%',
    badgeCount: 0
  },

  lifetimes: {
    attached() {
      setTimeout(() => { this.setData({ tabReady: true }); }, 200);
      this.updateIndicator(this.data.selected);
      this.loadBadges();
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

    updateIndicator(selectedIndex) {
      var positions = { 0: '10%', 1: '30%', 3: '70%', 4: '90%' };
      var left = positions[selectedIndex] || '10%';
      this.setData({ indicatorLeft: left });
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
