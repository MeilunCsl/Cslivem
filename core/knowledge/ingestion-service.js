// core/knowledge/ingestion-service.js v1.4.0
var graphEngine = require('../graph/graph-engine');
var types = require('../graph/types');
var conversationStore = require('../conversation/store');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function ingestConversation(conversationId) {
  var conv = conversationStore.getConversation(conversationId);
  if (!conv) return { success: false, error: 'Conversation not found' };

  var msgs = conversationStore.getMessages(conversationId);
  if (msgs.length === 0) return { success: false, error: 'No messages' };

  // Create conversation node
  var convNode = types.createNode({
    id: 'conv_' + conversationId,
    type: 'conversation',
    label: conv.title || 'Conversation',
    refId: conversationId,
    metadata: {
      messageCount: msgs.length,
      model: conv.model,
      createdAt: conv.createdAt
    }
  });
  graphEngine.addNode(convNode);

  // Extract entities from messages
  var entities = [];
  msgs.forEach(function(msg) {
    if (msg.role === 'assistant') {
      // Simple entity extraction: look for key terms
      var content = msg.content;
      var entityMatches = content.match(/\u201c([^\u201d]+)\u201d/g);
      if (entityMatches) {
        entityMatches.forEach(function(match) {
          var label = match.replace(/\u201c|\u201d/g, '').trim();
          if (label.length > 1 && label.length < 50) {
            var entityNode = types.createNode({
              id: 'entity_' + generateId(),
              type: 'entity',
              label: label,
              metadata: { source: 'conversation', conversationId: conversationId }
            });
            graphEngine.addNode(entityNode);
            entities.push(entityNode);

            // Create edge from conversation to entity
            var edge = types.createEdge({
              id: 'edge_' + generateId(),
              sourceId: convNode.id,
              targetId: entityNode.id,
              type: 'contains',
              weight: 1
            });
            graphEngine.addEdge(edge);
          }
        });
      }
    }
  });

  // Mark conversation as ingested
  conversationStore.updateConversation(conversationId, { ingested: true });

  return {
    success: true,
    conversationNode: convNode,
    entityCount: entities.length,
    entities: entities
  };
}

function ingestMessage(messageId, conversationId) {
  var msgs = conversationStore.getMessages(conversationId);
  var msg = null;
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].id === messageId) { msg = msgs[i]; break; }
  }
  if (!msg) return { success: false, error: 'Message not found' };

  var node = types.createNode({
    id: 'msg_' + messageId,
    type: 'note',
    label: msg.content.substring(0, 50),
    refId: messageId,
    metadata: {
      role: msg.role,
      conversationId: conversationId,
      model: msg.model
    }
  });
  graphEngine.addNode(node);

  return { success: true, node: node };
}

function getIngestPreview(conversationId) {
  var conv = conversationStore.getConversation(conversationId);
  var msgs = conversationStore.getMessages(conversationId);

  // Simulate what would be extracted
  var nodes = [];
  var edges = [];

  if (conv) {
    nodes.push({ type: 'conversation', label: conv.title || 'Conversation' });
  }

  msgs.forEach(function(msg) {
    if (msg.role === 'assistant') {
      var entityMatches = msg.content.match(/\u201c([^\u201d]+)\u201d/g);
      if (entityMatches) {
        entityMatches.forEach(function(m) {
          var label = m.replace(/\u201c|\u201d/g, '').trim();
          if (label.length > 1 && label.length < 50) {
            nodes.push({ type: 'entity', label: label });
            edges.push({ source: conv ? conv.title : 'Conversation', target: label, type: 'contains' });
          }
        });
      }
    }
  });

  return { nodes: nodes, edges: edges, ingested: conv ? conv.ingested : false };
}

module.exports = {
  ingestConversation: ingestConversation,
  ingestMessage: ingestMessage,
  getIngestPreview: getIngestPreview
};
