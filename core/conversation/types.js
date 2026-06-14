// core/conversation/types.js
// Conversation and Message data types v1.3.6

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function createConversation(opts) {
  opts = opts || {};
  return {
    id: opts.id || generateId(),
    title: opts.title || '',
    summary: opts.summary || '',
    type: opts.type || 'text',
    messageCount: 0,
    hasImages: false,
    hasVoice: false,
    ingested: false,
    pinned: false,
    model: opts.model || '',
    createdAt: opts.createdAt || Date.now(),
    updatedAt: opts.updatedAt || Date.now()
  };
}

function createMessage(opts) {
  opts = opts || {};
  return {
    id: opts.id || generateId(),
    conversationId: opts.conversationId || '',
    role: opts.role || 'user',
    content: opts.content || '',
    type: opts.type || 'text',
    attachments: opts.attachments || [],
    model: opts.model || '',
    tokenUsage: opts.tokenUsage || 0,
    createdAt: opts.createdAt || Date.now()
  };
}

module.exports = {
  generateId: generateId,
  createConversation: createConversation,
  createMessage: createMessage
};
