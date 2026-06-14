// pages/pdf/pdf.js
var pdfTool = require('../../modules/tool-pdf/public');

Page({
  data: {
    images: [],
    result: null,
    loading: false,
    progress: 0,
    ready: false
  },

  onLoad: function() {
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onSelectImages: function() {
    var self = this;
    pdfTool.selectImages(9).then(function(paths) {
      if (paths.length > 0) {
        self.setData({ images: paths, result: null });
      }
    });
  },

  onAddMore: function() {
    var self = this;
    var remain = 9 - self.data.images.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多 9 张', icon: 'none' });
      return;
    }
    pdfTool.selectImages(remain).then(function(paths) {
      if (paths.length > 0) {
        self.setData({ images: self.data.images.concat(paths), result: null });
      }
    });
  },

  onRemoveImage: function(e) {
    var idx = e.currentTarget.dataset.index;
    var imgs = this.data.images.slice();
    imgs.splice(idx, 1);
    this.setData({ images: imgs, result: null });
  },

  onPreviewImage: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: this.data.images, current: src });
  },

  onGenerate: function() {
    var self = this;
    if (self.data.images.length === 0) return;
    self.setData({ loading: true, progress: 0, result: null });

    var progressTimer = setInterval(function() {
      var p = self.data.progress;
      if (p < 90) self.setData({ progress: p + Math.random() * 15 });
    }, 300);

    pdfTool.generatePdf(self.data.images).then(function(result) {
      clearInterval(progressTimer);
      self.setData({ result: result, loading: false, progress: 100 });
      wx.showToast({ title: 'PDF 已生成', icon: 'success' });
    }).catch(function(err) {
      clearInterval(progressTimer);
      self.setData({ loading: false, progress: 0 });
      wx.showToast({ title: err.message || '生成失败', icon: 'none' });
    });
  },

  onShare: function() {
    if (!this.data.result || !this.data.result.filePath) return;
    pdfTool.sharePdf(this.data.result.filePath).catch(function(err) {
      wx.showToast({ title: '分享失败', icon: 'none' });
    });
  },

  onSave: function() {
    if (!this.data.result || !this.data.result.filePath) return;
    pdfTool.savePdf(this.data.result.filePath).then(function() {
      wx.showToast({ title: '已保存', icon: 'success' });
    }).catch(function() {
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },

  onRemoveResult: function() {
    this.setData({ result: null });
  },

  onReset: function() {
    this.setData({ images: [], result: null, loading: false, progress: 0 });
  },

  onBack: function() { wx.navigateBack(); }
});
