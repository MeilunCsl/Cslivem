var ocrTool = require('../../modules/tool-ocr/public');

Page({
  data: {
    imagePath: '',
    result: null,
    loading: false
  },

  onLoad: function() {},

  onChooseAlbum: function() {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        self.setData({ imagePath: res.tempFilePaths[0], result: null });
      }
    });
  },

  onTakePhoto: function() {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        self.setData({ imagePath: res.tempFilePaths[0], result: null });
      }
    });
  },

  onRecognize: function() {
    var self = this;
    if (!self.data.imagePath) return;
    self.setData({ loading: true, result: null });
    ocrTool.recognizeText(self.data.imagePath).then(function(result) {
      self.setData({ result: result, loading: false });
    });
  },

  onReselect: function() {
    this.setData({ imagePath: '', result: null });
  },

  onPreviewImage: function() {
    if (this.data.imagePath) {
      wx.previewImage({ urls: [this.data.imagePath] });
    }
  },

  onCopyResult: function() {
    if (this.data.result && this.data.result.text) {
      wx.setClipboardData({ data: this.data.result.text });
      wx.showToast({ title: '已复制', icon: 'success' });
    }
  },

  onSaveAsNote: function() {
    if (this.data.result && this.data.result.text) {
      var noteModule = require('../../modules/note/public');
      noteModule.createNote({
        title: 'OCR 识别 - ' + new Date().toLocaleDateString(),
        content: this.data.result.text,
        tags: ['OCR', '图片识别']
      });
      wx.showToast({ title: '已保存为笔记', icon: 'success' });
    }
  },

  onNewOcr: function() {
    this.setData({ imagePath: '', result: null, loading: false });
  },

  onBack: function() { wx.navigateBack(); }
});
