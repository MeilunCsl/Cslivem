var manifest = require('./manifest');
module.exports = {
  manifest: manifest,
  scanDocument: function(imagePath) {
    console.log('[ToolScanner] scan:', imagePath);
    return Promise.resolve({ success: false, message: '功能开发中' });
  }
};
