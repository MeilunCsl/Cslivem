// core/assets/asset-types.js v1.3.8
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function createAsset(opts) {
  opts = opts || {};
  return {
    id: opts.id || generateId(),
    type: opts.type || 'image',
    fileName: opts.fileName || '',
    filePath: opts.filePath || '',
    fileSize: opts.fileSize || 0,
    mimeType: opts.mimeType || '',
    messageId: opts.messageId || '',
    conversationId: opts.conversationId || '',
    thumbnailPath: opts.thumbnailPath || '',
    duration: opts.duration || 0,
    createdAt: opts.createdAt || Date.now()
  };
}

module.exports = { generateId: generateId, createAsset: createAsset };
