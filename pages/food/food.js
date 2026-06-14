var foodModule = require('../../modules/food/public');

Page({
  data: {
    summary: {},
    weekSummary: {},
    presets: [],
    meals: [
      { id: 'breakfast', name: '早餐' },
      { id: 'lunch', name: '午餐' },
      { id: 'dinner', name: '晚餐' },
      { id: 'snack', name: '加餐' }
    ],
    selectedMeal: 'lunch',
    showAdd: false,
    newName: '',
    newCalories: '',
    newNote: '',
    ready: false
  },

  onLoad: function() {
    this.setData({ presets: foodModule.getPresets() });
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() { this.loadData(); },

  loadData: function() {
    this.setData({
      summary: foodModule.getTodaySummary(),
      weekSummary: foodModule.getWeekSummary()
    });
  },

  onSelectMeal: function(e) {
    this.setData({ selectedMeal: e.currentTarget.dataset.meal });
  },

  toggleAdd: function() {
    this.setData({ showAdd: !this.data.showAdd, newName: '', newCalories: '', newNote: '' });
  },

  onNameInput: function(e) { this.setData({ newName: e.detail.value }); },
  onCaloriesInput: function(e) { this.setData({ newCalories: e.detail.value }); },
  onNoteInput: function(e) { this.setData({ newNote: e.detail.value }); },

  onPresetTap: function(e) {
    var idx = e.currentTarget.dataset.index;
    var preset = this.data.presets[idx];
    foodModule.addRecord({ name: preset.name, calories: preset.calories, meal: this.data.selectedMeal });
    this.loadData();
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    wx.showToast({ title: '已记录 ' + preset.name, icon: 'success' });
  },

  onAddRecord: function() {
    var name = this.data.newName.trim();
    if (!name) { wx.showToast({ title: '请输入食物名称', icon: 'none' }); return; }
    foodModule.addRecord({ name: name, calories: parseInt(this.data.newCalories) || 0, meal: this.data.selectedMeal, note: this.data.newNote });
    this.setData({ showAdd: false, newName: '', newCalories: '', newNote: '' });
    this.loadData();
    wx.showToast({ title: '已记录', icon: 'success' });
  },

  onDeleteRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({ title: '删除', content: '确定删除这条记录吗？',
      success: function(res) { if (res.confirm) { foodModule.deleteRecord(id); self.loadData(); } }
    });
  },

  onBack: function() { wx.navigateBack(); }
});
