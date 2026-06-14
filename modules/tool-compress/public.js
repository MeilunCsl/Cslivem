var manifest = require('./manifest');

function compressImage(filePath, quality) {
  quality = quality || 60;
  return new Promise(function(resolve, reject) {
    wx.compressImage({
      src: filePath,
      quality: quality,
      success: function(res) {
        resolve({ success: true, filePath: res.tempFilePath });
      },
      fail: function(err) {
        resolve({ success: false, filePath: filePath, error: err.errMsg });
      }
    });
  });
}

function getImageInfo(filePath) {
  return new Promise(function(resolve, reject) {
    wx.getImageInfo({
      src: filePath,
      success: function(res) {
        var fs = wx.getFileSystemManager();
        fs.getFileInfo({
          filePath: filePath,
          success: function(info) {
            resolve({
              width: res.width,
              height: res.height,
              sizeKB: Math.round(info.size / 1024),
              type: res.type || 'unknown',
              path: filePath
            });
          },
          fail: function() {
            resolve({ width: res.width, height: res.height, sizeKB: 0, type: res.type, path: filePath });
          }
        });
      },
      fail: reject
    });
  });
}

function selectImages(count) {
  count = count || 9;
  return new Promise(function(resolve, reject) {
    wx.chooseImage({
      count: count,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function(res) { resolve(res.tempFilePaths); },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) resolve([]);
        else reject(err);
      }
    });
  });
}

function batchCompress(filePaths, quality) {
  quality = quality || 60;
  var chain = Promise.resolve();
  var results = [];

  filePaths.forEach(function(path, i) {
    chain = chain.then(function() {
      return compressImage(path, quality).then(function(r) {
        return getImageInfo(r.filePath || path).then(function(info) {
          results.push(Object.assign({}, info, { compressed: r.success }));
        });
      });
    });
  });

  return chain.then(function() { return results; });
}

function saveToAlbum(filePath) {
  return new Promise(function(resolve, reject) {
    wx.saveImageToPhotosAlbum({ filePath: filePath, success: resolve, fail: reject });
  });
}

module.exports = {
  manifest: manifest,
  compressImage: compressImage,
  getImageInfo: getImageInfo,
  selectImages: selectImages,
  batchCompress: batchCompress,
  saveToAlbum: saveToAlbum
};
