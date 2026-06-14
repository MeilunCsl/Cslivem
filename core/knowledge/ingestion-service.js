// core/knowledge/ingestion-service.js
// 对话转知识图谱服务
var graphEngine = require('../graph/graph-engine');
var types = require('../graph/types');
var conversationStore = require('../conversation/store');
var format = require('../../utils/format');

function generateId() {
  return format.generateId ? format.generateId() : Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 从对话内容提取关键词/实体
function extractKeywords(text) {
  if (!text) return [];
  var keywords = [];
  // 匹配引号内容
  var quoted = text.match(/[\u201c\u300c""]([^\u201d\u300d""]{2,30})[\u201d\u300d""]/g);
  if (quoted) {
    quoted.forEach(function (m) {
      var label = m.replace(/[\u201c\u300c\u201d\u300d""]/g, '').trim();
      if (label.length >= 2) keywords.push(label);
    });
  }
  // 匹配 #标签
  var tags = text.match(/#[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}/g);
  if (tags) {
    tags.forEach(function (t) { keywords.push(t.replace('#', '')); });
  }
  // 匹配 [[WikiLink]]
  var links = text.match(/\[\[([^\]|]{2,30})(?:\|[^\]]+)?\]\]/g);
  if (links) {
    links.forEach(function (l) {
      var m = l.match(/\[\[([^\]|]+)/);
      if (m) keywords.push(m[1]);
    });
  }
  // 匹配英文技术词（大写开头或全大写）
  var techWords = text.match(/\b[A-Z][A-Za-z0-9]{2,15}\b/g);
  if (techWords) {
    var stopWords = { 'The': 1, 'This': 1, 'That': 1, 'What': 1, 'When': 1, 'Where': 1, 'How': 1, 'Why': 1, 'You': 1, 'Can': 1, 'Could': 1, 'Would': 1, 'Should': 1, 'For': 1, 'And': 1, 'But': 1, 'Not': 1 };
    techWords.forEach(function (w) {
      if (!stopWords[w] && w.length >= 3) keywords.push(w);
    });
  }
  // 去重
  var seen = {};
  return keywords.filter(function (k) {
    if (seen[k]) return false;
    seen[k] = true;
    return true;
  });
}

// 获取入库预览（不实际写入）
function getIngestPreview(conversationId) {
  var conv = conversationStore.getConversation(conversationId);
  if (!conv) return { nodes: [], edges: [], ingested: false, error: 'Conversation not found' };

  var msgs = conversationStore.getMessages(conversationId);
  var allText = msgs.map(function (m) { return m.content || ''; }).join('\n');
  var keywords = extractKeywords(allText);

  var nodes = [];
  var edges = [];

  // 会话作为 note 节点
  nodes.push({
    type: 'note',
    label: conv.title || '对话记录',
    isConversation: true,
    conversationId: conversationId
  });

  // 关键词作为 concept/entity 节点
  keywords.forEach(function (kw) {
    var isTag = kw.charAt(0) === '#';
    var label = isTag ? kw.replace('#', '') : kw;
    var type = isTag ? 'tag' : 'concept';
    nodes.push({ type: type, label: label });
    edges.push({
      source: conv.title || '对话记录',
      target: label,
      type: 'mention'
    });
  });

  return {
    nodes: nodes,
    edges: edges,
    ingested: !!conv.ingested,
    messageCount: msgs.length,
    keywordCount: keywords.length
  };
}

// 执行入库
function ingestConversation(conversationId) {
  var conv = conversationStore.getConversation(conversationId);
  if (!conv) return { success: false, error: 'Conversation not found' };

  var msgs = conversationStore.getMessages(conversationId);
  if (msgs.length === 0) return { success: false, error: 'No messages' };

  var allText = msgs.map(function (m) { return m.content || ''; }).join('\n');
  var keywords = extractKeywords(allText);

  // 创建会话节点
  var convNodeId = 'conv_' + conversationId;
  var convNode = graphEngine.upsertNode({
    id: convNodeId,
    type: 'note',
    label: conv.title || '对话记录',
    refId: conversationId,
    metadata: {
      messageCount: msgs.length,
      model: conv.model,
      isConversation: true,
      createdAt: conv.createdAt
    }
  });

  var createdNodes = [];
  var createdEdges = [];

  // 为每个关键词创建节点和边
  keywords.forEach(function (kw) {
    var isTag = kw.charAt(0) === '#';
    var label = isTag ? kw.replace('#', '') : kw;
    var type = isTag ? 'tag' : 'concept';
    var nodeId = generateId();

    try {
      var node = graphEngine.upsertNode({
        id: nodeId,
        type: type,
        label: label,
        metadata: { source: 'conversation', conversationId: conversationId }
      });
      createdNodes.push(node);

      var edge = graphEngine.upsertEdge({
        id: generateId(),
        source: convNodeId,
        target: node.id,
        type: 'mention',
        weight: 1
      });
      createdEdges.push(edge);
    } catch (err) {
      console.warn('[Ingestion] skip keyword:', kw, err.message);
    }
  });

  // 标记对话已入库
  conversationStore.updateConversation(conversationId, { ingested: true });

  return {
    success: true,
    nodeCount: createdNodes.length,
    edgeCount: createdEdges.length,
    nodes: createdNodes,
    edges: createdEdges
  };
}

// 入库单条消息
function ingestMessage(messageId, conversationId) {
  var msgs = conversationStore.getMessages(conversationId);
  var msg = null;
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].id === messageId) { msg = msgs[i]; break; }
  }
  if (!msg) return { success: false, error: 'Message not found' };

  var node = graphEngine.upsertNode({
    id: 'msg_' + messageId,
    type: 'note',
    label: (msg.content || '').substring(0, 50),
    refId: messageId,
    metadata: {
      role: msg.role,
      conversationId: conversationId,
      model: msg.model
    }
  });

  return { success: true, node: node };
}

module.exports = {
  ingestConversation: ingestConversation,
  ingestMessage: ingestMessage,
  getIngestPreview: getIngestPreview,
  extractKeywords: extractKeywords
};
