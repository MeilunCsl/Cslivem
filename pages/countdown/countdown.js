// pages/countdown/countdown.js
var cdModule = require('../../modules/countdown/public');

Page({
  data: {
    items: [],
    showCreate: false,
    newTitle: '',
    newDate: '',
    icons: ['\u23f3', '\ud83c\udf89', '\ud83c\udf82', '\ud83c\udf93', '\u2764\ufe0f', '\ud83c\udfe0', '\u2708\ufe0f', '\ud83c\udfb5', '\ud83c\udfc6'],
    colors: ['#6C5CE7', '#FF6B6B', '#00D4D9', '#F59E0B', '#24A148', '#3A7BFF'],
    selectedIcon: '\u23f3',
    selectedColor: '#6C5CE7',
    ready: false
  },

  onLoad: function() {
    var self = this;
    var today = new Date().toISOString().substring(0, 10);
    self.setData({ newDate: today });
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    this.loadItems();
  },

  loadItems: function() {
    this.setData({ items: cdModule.getAll() });
  },

  toggleCreate: function() {
    this.setData({ showCreate: !this.data.showCreate, newTitle: '' });
  },

  onTitleInput: function(e) { this.setData({ newTitle: e.detail.value }); },
  onDateChange: function(e) { this.setData({ newDate: e.detail.value }); },
  onSelectIcon: function(e) { this.setData({ selectedIcon: e.currentTarget.dataset.icon }); },
  onSelectColor: function(e) { this.setData({ selectedColor: e.currentTarget.dataset.color }); },

  onCreate: function() {
    if (!this.data.newTitle.trim()) {
      wx.showToast({ title: '\u8bf7\u8f93\u5165\u540d\u79f0', icon: 'none' });
      return;
    }
    cdModule.add({
      title: this.data.newTitle.trim(),
      date: this.data.newDate,
      icon: this.data.selectedIcon,
      color: this.data.selectedColor
    });
    this.setData({ showCreate: false, newTitle: '' });
    this.loadItems();
    wx.showToast({ title: '\u5df2\u521b\u5efa', icon: 'success' });
  },

  onDelete: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '\u5220\u9664',
      content: '\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u5012\u6570\u65e5\u5417\uff1f',
      success: function(res) {
        if (res.confirm) {
          cdModule.remove(id);
          self.loadItems();
        }
      }
    });
  },

  onBack: function() { wx.navigateBack(); }
});
