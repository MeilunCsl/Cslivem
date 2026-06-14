var textTool = require('../../modules/tool-text/public');

Page({
  data: {
    inputText: '',
    outputText: '',
    stats: null,
    ready: false
  },

  onLoad: function() {
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onInputChange: function(e) {
    var text = e.detail.value;
    this.setData({ inputText: text, stats: textTool.countChars(text) });
  },

  onOutputChange: function(e) {
    this.setData({ outputText: e.detail.value });
  },

  onAction: function(e) {
    var action = e.currentTarget.dataset.action;
    var text = this.data.inputText;
    var result = '';
    switch (action) {
      case 'upper': result = textTool.toUpperCase(text); break;
      case 'lower': result = textTool.toLowerCase(text); break;
      case 'title': result = textTool.toTitleCase(text); break;
      case 'rmEmpty': result = textTool.removeEmptyLines(text); break;
      case 'rmDup': result = textTool.removeDuplicateLines(text); break;
      case 'sort': result = textTool.sortLines(text); break;
      case 'reverse': result = textTool.reverseText(text); break;
      case 'count':
        this.setData({ stats: textTool.countChars(text) });
        wx.showToast({ title: '已统计', icon: 'success' });
        return;
      default: result = text;
    }
    this.setData({ outputText: result });
    wx.showToast({ title: '完成', icon: 'success' });
  },

  onCopyOutput: function() {
    if (!this.data.outputText) return;
    wx.setClipboardData({ data: this.data.outputText });
  },

  onClear: function() {
    this.setData({ inputText: '', outputText: '', stats: null });
  },

  onPaste: function() {
    var self = this;
    wx.getClipboardData({
      success: function(res) {
        if (res.data) {
          self.setData({ inputText: res.data, stats: textTool.countChars(res.data) });
        }
      }
    });
  },

  onBack: function() { wx.navigateBack(); }
});
