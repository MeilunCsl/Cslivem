// pages/scanner/scanner.js
var scannerTool = require('../../modules/tool-scanner/public');

Page({
  data: {
    imagePath: '',
    enhancedPath: '',
    loading: false,
    showSettings: false,
    brightness: 10,
    contrast: 15,
    grayscale: false,
    ready: false
  },

  onLoad: function() {
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onChooseAlbum: function() {
    var self = this;
    scannerTool.scanFromAlbum().then(function(path) {
      if (path) self.setData({ imagePath: path, enhancedPath: '' });
    });
  },

  onTakePhoto: function() {
    var self = this;
    scannerTool.scanFromCamera().then(function(path) {
      if (path) self.setData({ imagePath: path, enhancedPath: '' });
    });
  },

  onEnhance: function() {
    var self = this;
    if (!self.data.imagePath) return;
    self.setData({ loading: true });
    scannerTool.enhanceImage(self.data.imagePath, {
      brightness: self.data.brightness,
      contrast: self.data.contrast,
      grayscale: self.data.grayscale
    }).then(function(result) {
      self.setData({ enhancedPath: result.filePath, loading: false });
      wx.showToast({ title: '\u589e\u5f3a\u5b8c\u6210', icon: 'success' });
    }).catch(function(err) {
      self.setData({ loading: false });
      wx.showToast({ title: err.message || '\u5904\u7406\u5931\u8d25', icon: 'none' });
    });
  },

  onToggleSettings: function() {
    this.setData({ showSettings: !this.data.showSettings });
  },

  onBrightnessChange: function(e) {
    this.setData({ brightness: e.detail.value });
  },

  onContrastChange: function(e) {
    this.setData({ contrast: e.detail.value });
  },

  onToggleGrayscale: function() {
    this.setData({ grayscale: !this.data.grayscale });
  },

  onSaveToAlbum: function() {
    var path = this.data.enhancedPath || this.data.imagePath;
    if (!path) return;
    scannerTool.saveToAlbum(path).then(function() {
      wx.showToast({ title: '\u5df2\u4fdd\u5b58\u5230\u76f8\u518c', icon: 'success' });
    }).catch(function() {
      wx.showToast({ title: '\u4fdd\u5b58\u5931\u8d25', icon: 'none' });
    });
  },

  onSaveAsNote: function() {
    var path = this.data.enhancedPath || this.data.imagePath;
    if (!path) return;
    scannerTool.saveAsNote(path).then(function() {
      wx.showToast({ title: '\u5df2\u4fdd\u5b58\u4e3a\u7b14\u8bb0', icon: 'success' });
    });
  },

  onPreview: function() {
    var path = this.data.enhancedPath || this.data.imagePath;
    if (path) wx.previewImage({ urls: [path] });
  },

  onReset: function() {
    this.setData({ imagePath: '', enhancedPath: '', loading: false });
  },

  onBack: function() { wx.navigateBack(); }
});
