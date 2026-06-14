var convModule = require('../../modules/tool-convert/public');

Page({
  data: {
    categories: [],
    units: [],
    selectedCategory: 'length',
    fromUnit: '',
    toUnit: '',
    inputValue: '',
    result: '',
    ready: false
  },

  onLoad: function() {
    var cats = convModule.getCategories();
    var units = convModule.getUnits('length');
    this.setData({
      categories: cats,
      units: units,
      fromUnit: units[0] ? units[0].id : '',
      toUnit: units[1] ? units[1].id : ''
    });
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onCategoryChange: function(e) {
    var catId = this.data.categories[e.detail.value].id;
    var units = convModule.getUnits(catId);
    this.setData({
      selectedCategory: catId,
      units: units,
      fromUnit: units[0] ? units[0].id : '',
      toUnit: units[1] ? units[1].id : '',
      result: ''
    });
    this.doConvert();
  },

  onFromChange: function(e) {
    this.setData({ fromUnit: this.data.units[e.detail.value].id });
    this.doConvert();
  },

  onToChange: function(e) {
    this.setData({ toUnit: this.data.units[e.detail.value].id });
    this.doConvert();
  },

  onValueInput: function(e) {
    this.setData({ inputValue: e.detail.value });
    this.doConvert();
  },

  onSwap: function() {
    var temp = this.data.fromUnit;
    this.setData({ fromUnit: this.data.toUnit, toUnit: temp });
    this.doConvert();
  },

  doConvert: function() {
    var val = this.data.inputValue;
    if (!val) { this.setData({ result: '' }); return; }
    var r = convModule.convert(val, this.data.fromUnit, this.data.toUnit, this.data.selectedCategory);
    this.setData({ result: String(r) });
  },

  onBack: function() { wx.navigateBack(); }
});
