var moodModule = require('../../modules/mood/public');

Page({
  data: {
    moods: [],
    selectedMood: 0,
    note: '',
    todayRecord: null,
    recentRecords: [],
    stats: {},
    ready: false
  },

  onLoad: function() {
    this.setData({ moods: moodModule.getMoods() });
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    var today = moodModule.getToday();
    var recent = moodModule.getRecent(7);
    var stats = moodModule.getStats();
    this.setData({
      todayRecord: today,
      selectedMood: today ? today.mood : 0,
      note: today ? today.note : '',
      recentRecords: recent,
      stats: stats
    });
  },

  onSelectMood: function(e) {
    this.setData({ selectedMood: parseInt(e.currentTarget.dataset.value) });
  },

  onNoteInput: function(e) {
    this.setData({ note: e.detail.value });
  },

  onSave: function() {
    if (!this.data.selectedMood) {
      wx.showToast({ title: '请选择心情', icon: 'none' });
      return;
    }
    moodModule.record({ mood: this.data.selectedMood, note: this.data.note });
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    wx.showToast({ title: '已记录', icon: 'success' });
    this.onShow();
  },

  onBack: function() { wx.navigateBack(); }
});
