// modules/tool-pdf/public.js
// Real PDF generation tool v1.7.0
// Select images -> Generate PDF -> Save/Share

var manifest = require('./manifest');
var PdfWriter = require('../../core/pdf/pdf-writer');

function getImageData(filePath) {
  return new Promise(function(resolve, reject) {
    var fs = wx.getFileSystemManager();
    fs.readFile({
      filePath: filePath,
      success: function(res) { resolve(res.data); },
      fail: function(err) { reject(err); }
    });
  });
}

function generatePdf(imagePaths, opts) {
  opts = opts || {};
  var writer = new PdfWriter({
    width: opts.width || 595,
    height: opts.height || 842,
    margin: opts.margin || 40
  });

  var chain = Promise.resolve();
  var buffers = [];

  imagePaths.forEach(function(path, i) {
    chain = chain.then(function() {
      return getImageData(path).then(function(buf) {
        buffers.push(buf);
      });
    });
  });

  return chain.then(function() {
    writer.renderImages(buffers);
    var arrayBuffer = writer.toArrayBuffer();
    var filePath = wx.env.USER_DATA_PATH + '/cslivem-pdf-' + Date.now() + '.pdf';
    var fs = wx.getFileSystemManager();
    return new Promise(function(resolve, reject) {
      fs.writeFile({
        filePath: filePath,
        data: arrayBuffer,
        encoding: 'binary',
        success: function() {
          resolve({ success: true, filePath: filePath, pageCount: buffers.length });
        },
        fail: function(err) {
          reject(new Error('Failed to write PDF: ' + (err.errMsg || err)));
        }
      });
    });
  });
}

function selectImages(count) {
  count = count || 9;
  return new Promise(function(resolve, reject) {
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) { resolve(res.tempFilePaths); },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) {
          resolve([]);
        } else {
          reject(err);
        }
      }
    });
  });
}

function sharePdf(filePath) {
  return new Promise(function(resolve, reject) {
    wx.shareFileMessage({
      filePath: filePath,
      success: resolve,
      fail: reject
    });
  });
}

function savePdf(filePath) {
  return new Promise(function(resolve, reject) {
    wx.saveFileToDisk({
      filePath: filePath,
      success: resolve,
      fail: reject
    });
  });
}

module.exports = {
  manifest: manifest,
  generatePdf: generatePdf,
  selectImages: selectImages,
  sharePdf: sharePdf,
  savePdf: savePdf,
  convertImagesToPdf: function(imagePaths) {
    console.log('[ToolPDF] convert:', imagePaths.length, 'images');
    return generatePdf(imagePaths);
  }
};
