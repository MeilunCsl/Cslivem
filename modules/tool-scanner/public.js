// modules/tool-scanner/public.js
// Real scanner tool with canvas-based image enhancement
// v1.7.0

var manifest = require('./manifest');

function enhanceImage(filePath, opts) {
  opts = opts || {};
  var brightness = opts.brightness || 10;
  var contrast = opts.contrast || 15;
  var grayscale = opts.grayscale || false;

  return new Promise(function(resolve, reject) {
    wx.getImageInfo({
      src: filePath,
      success: function(imgInfo) {
        var w = imgInfo.width;
        var h = imgInfo.height;
        var ctx = wx.createCanvasContext('scanner-canvas');
        ctx.drawImage(filePath, 0, 0, w, h);
        ctx.draw(false, function() {
          setTimeout(function() {
            wx.canvasGetImageData({
              canvasId: 'scanner-canvas',
              x: 0, y: 0, width: w, height: h,
              success: function(res) {
                var data = res.data;
                var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                for (var i = 0; i < data.length; i += 4) {
                  var r = data[i], g = data[i+1], b = data[i+2];
                  r = factor * (r - 128 + brightness) + 128;
                  g = factor * (g - 128 + brightness) + 128;
                  b = factor * (b - 128 + brightness) + 128;
                  if (grayscale) {
                    var gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    r = g = b = gray;
                  }
                  data[i]   = Math.max(0, Math.min(255, r));
                  data[i+1] = Math.max(0, Math.min(255, g));
                  data[i+2] = Math.max(0, Math.min(255, b));
                }
                wx.canvasPutImageData({
                  canvasId: 'scanner-canvas',
                  x: 0, y: 0, width: w, height: h,
                  data: data,
                  success: function() {
                    wx.canvasToTempFilePath({
                      canvasId: 'scanner-canvas',
                      success: function(result) {
                        resolve({ success: true, filePath: result.tempFilePath, width: w, height: h });
                      },
                      fail: reject
                    });
                  },
                  fail: reject
                });
              },
              fail: reject
            });
          }, 200);
        });
      },
      fail: reject
    });
  });
}

function scanFromAlbum() {
  return new Promise(function(resolve, reject) {
    wx.chooseImage({
      count: 1, sizeType: ['compressed'], sourceType: ['album'],
      success: function(res) { resolve(res.tempFilePaths[0]); },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) resolve(null);
        else reject(err);
      }
    });
  });
}

function scanFromCamera() {
  return new Promise(function(resolve, reject) {
    wx.chooseImage({
      count: 1, sizeType: ['compressed'], sourceType: ['camera'],
      success: function(res) { resolve(res.tempFilePaths[0]); },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) resolve(null);
        else reject(err);
      }
    });
  });
}

function saveToAlbum(filePath) {
  return new Promise(function(resolve, reject) {
    wx.saveImageToPhotosAlbum({ filePath: filePath, success: resolve, fail: reject });
  });
}

function saveAsNote(filePath, text) {
  var noteModule = require('../note/public');
  return noteModule.createNote({
    title: '\u626b\u63cf\u6587\u6863 - ' + new Date().toLocaleDateString(),
    content: text || '(\u626b\u63cf\u56fe\u7247\u5df2\u4fdd\u5b58)',
    tags: ['\u626b\u63cf', '\u6587\u6863'],
    source: 'scanner'
  });
}

module.exports = {
  manifest: manifest,
  enhanceImage: enhanceImage,
  scanFromAlbum: scanFromAlbum,
  scanFromCamera: scanFromCamera,
  saveToAlbum: saveToAlbum,
  saveAsNote: saveAsNote,
  scanDocument: function(imagePath) { return enhanceImage(imagePath); }
};
