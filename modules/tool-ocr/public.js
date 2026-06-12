var manifest = require('./manifest');
module.exports = {
  manifest: manifest,
  recognizeText: function(imagePath) {
    console.log('[ToolOCR] recognize:', imagePath);
    return Promise.resolve({ success: false, message: '功能开发中' });
  }
};
