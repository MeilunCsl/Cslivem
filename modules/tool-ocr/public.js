var manifest = require('./manifest');
var gateway = require('../../miniprogram/ai-gateway');

module.exports = {
  manifest: manifest,
  
  recognizeText: function(imagePath) {
    console.log('[ToolOCR] recognize:', imagePath);
    return gateway.analyzeImage(imagePath, 
      '请识别图片中的所有文字内容。保留原始格式和排版，只输出识别到的文字。'
    ).then(function(result) {
      return {
        success: true,
        text: result.content || '',
        confidence: 0.9,
        mode: result.mode || 'api'
      };
    }).catch(function(err) {
      return {
        success: false,
        message: err.message || 'OCR failed',
        text: ''
      };
    });
  },

  recognizeFromAlbum: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: function(res) {
          var filePath = res.tempFilePaths[0];
          self.recognizeText(filePath).then(resolve).catch(reject);
        },
        fail: reject
      });
    });
  },

  recognizeFromCamera: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: function(res) {
          var filePath = res.tempFilePaths[0];
          self.recognizeText(filePath).then(resolve).catch(reject);
        },
        fail: reject
      });
    });
  }
};
