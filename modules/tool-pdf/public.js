var manifest = require('./manifest');
module.exports = {
  manifest: manifest,
  convertImagesToPdf: function(imagePaths) {
    console.log('[ToolPDF] convert:', imagePaths.length, 'images');
    return Promise.resolve({ success: false, message: '功能开发中' });
  }
};
