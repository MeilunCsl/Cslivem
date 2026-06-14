// core/conversation/store.js
// Conversation local persistence store v1.3.6

var localStorage = require('../storage/local-storage');
var types = require('./types');

var CONVERSATIONS_KEY = 'core_conversations';
var MESSAGES_KEY = 'core_messages';

function getAllConversations() {
  return localStorage.getJSON(CONVERSATIONS_KEY, []);
}

function saveAllConversations(list) {
  localStorage.setJSON(CONVERSATIONS_KEY, list);
}

function getConversation(id) {
  var list = getAllConversations();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

function createConversation(opts) {
  var conv = types.createConversation(opts);
  var list = getAllConversations();
  list.unshift(conv);
  saveAllConversations(list);
  return conv;
}

function updateConversation(id, updates) {
  var list = getAllConversations();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      Object.assign(list[i], updates, { updatedAt: Date.now() });
      saveAllConversations(list);
      return list[i];
    }
  }
  return null;
}

function deleteConversation(id) {
  var list = getAllConversations();
  list = list.filter(function(c) { return c.id !== id; });
  saveAllConversations(list);
  // Also delete messages
  var msgs = getAllMessages();
  msgs = msgs.filter(function(m) { return m.conversationId !== id; });
  localStorage.setJSON(MESSAGES_KEY, msgs);
}

function togglePin(id) {
  var conv = getConversation(id);
  if (conv) {
    return updateConversation(id, { pinned: !conv.pinned });
  }
  return null;
}

function searchConversations(query) {
  var list = getAllConversations();
  if (!query) return list;
  var q = query.toLowerCase();
  return list.filter(function(c) {
    return (c.title && c.title.toLowerCase().indexOf(q) >= 0) ||
           (c.summary && c.summary.toLowerCase().indexOf(q) >= 0);
  });
}

function getRecentConversations(limit) {
  var list = getAllConversations();
  return list.slice(0, limit || 10);
}

// ===== Messages =====
function getAllMessages() {
  return localStorage.getJSON(MESSAGES_KEY, []);
}

function saveAllMessages(list) {
  localStorage.setJSON(MESSAGES_KEY, list);
}

function getMessages(conversationId) {
  var msgs = getAllMessages();
  return msgs.filter(function(m) { return m.conversationId === conversationId; })
    .sort(function(a, b) { return a.createdAt - b.createdAt; });
}

function addMessage(opts) {
  var msg = types.createMessage(opts);
  var msgs = getAllMessages();
  msgs.push(msg);
  saveAllMessages(msgs);
  // Update conversation message count
  var conv = getConversation(msg.conversationId);
  if (conv) {
    updateConversation(msg.conversationId, {
      messageCount: (conv.messageCount || 0) + 1,
      summary: msg.content.substring(0, 100)
    });
  }
  return msg;
}

function getMessageCount(conversationId) {
  var msgs = getAllMessages();
  var count = 0;
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].conversationId === conversationId) count++;
  }
  return count;
}

function getStats() {
  var convs = getAllConversations();
  var msgs = getAllMessages();
  return {
    conversations: convs.length,
    messages: msgs.length
  };
}

function clearAll() {
  localStorage.setJSON(CONVERSATIONS_KEY, []);
  localStorage.setJSON(MESSAGES_KEY, []);
}

module.exports = {
  getAllConversations: getAllConversations,
  getConversation: getConversation,
  createConversation: createConversation,
  updateConversation: updateConversation,
  deleteConversation: deleteConversation,
  togglePin: togglePin,
  searchConversations: searchConversations,
  getRecentConversations: getRecentConversations,
  getMessages: getMessages,
  addMessage: addMessage,
  getMessageCount: getMessageCount,
  getStats: getStats,
  clearAll: clearAll
};
