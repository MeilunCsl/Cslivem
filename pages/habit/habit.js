// pages/habit/habit.js
var habitModule = require('../../modules/habit/public');

Page({
  data: {
    habits: [],
    today: '',
    stats: {},
    showCreate: false,
    newName: '',
    newIcon: '\u2713',
    icons: ['\u2713', '\u2764', '\ud83d\udcaa', '\ud83c\udfc3', '\ud83d\udcd6', '\ud83c\udfcb', '\ud83c\udf89', '\u2b50', '\ud83d\udca1', '\ud83c\udf0d'],
    colors: ['#6C5CE7', '#FF6B6B', '#00D4D9', '#F59E0B', '#24A148', '#3A7BFF', '#FF85A2', '#96CEB4'],
    selectedColor: '#6C5CE7',
    selectedIcon: '\u2713',
    ready: false
  },

  onLoad: function() {
    var today = new Date().toISOString().substring(0, 10);
    this.setData({ today: today });
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    this.loadHabits();
  },

  loadHabits: function() {
    var habits = habitModule.getHabits();
    var today = this.data.today;
    var self = this;
    habits = habits.map(function(h) {
      return Object.assign({}, h, {
        checkedToday: habitModule.isCheckedin(h.id, today),
        streak: habitModule.getStreak(h.id)
      });
    });
    var stats = habitModule.getStats();
    this.setData({ habits: habits, stats: stats });
  },

  onCheckin: function(e) {
    var id = e.currentTarget.dataset.id;
    var habit = null;
    for (var i = 0; i < this.data.habits.length; i++) {
      if (this.data.habits[i].id === id) { habit = this.data.habits[i]; break; }
    }
    if (!habit) return;

    if (habit.checkedToday) {
      habitModule.undoCheckin(id, this.data.today);
      wx.showToast({ title: '\u5df2\u53d6\u6d88', icon: 'none' });
    } else {
      habitModule.checkin(id, this.data.today);
      wx.vibrateShort({ type: 'light' }).catch(function() {});
      wx.showToast({ title: '\u6253\u5361\u6210\u529f \u2713', icon: 'success' });
    }
    this.loadHabits();
  },

  toggleCreate: function() {
    this.setData({ showCreate: !this.data.showCreate, newName: '' });
  },

  onNameInput: function(e) {
    this.setData({ newName: e.detail.value });
  },

  onSelectIcon: function(e) {
    this.setData({ selectedIcon: e.currentTarget.dataset.icon });
  },

  onSelectColor: function(e) {
    this.setData({ selectedColor: e.currentTarget.dataset.color });
  },

  onCreate: function() {
    var name = this.data.newName.trim();
    if (!name) {
      wx.showToast({ title: '\u8bf7\u8f93\u5165\u4e60\u60ef\u540d\u79f0', icon: 'none' });
      return;
    }
    try {
      habitModule.createHabit({
        name: name,
        icon: this.data.selectedIcon,
        color: this.data.selectedColor
      });
      this.setData({ showCreate: false, newName: '' });
      this.loadHabits();
      wx.showToast({ title: '\u521b\u5efa\u6210\u529f', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  onDelete: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '\u5220\u9664\u4e60\u60ef',
      content: '\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u4e2a\u4e60\u60ef\u5417\uff1f\u6253\u5361\u8bb0\u5f55\u4e5f\u4f1a\u88ab\u5220\u9664\u3002',
      success: function(res) {
        if (res.confirm) {
          habitModule.deleteHabit(id);
          self.loadHabits();
          wx.showToast({ title: '\u5df2\u5220\u9664', icon: 'success' });
        }
      }
    });
  },

  onBack: function() { wx.navigateBack(); }
});
