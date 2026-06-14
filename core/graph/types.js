// core/graph/types.js
// 知识图谱类型定义

// 节点类型枚举
var NodeType = {
  NOTE: 'note',
  TAG: 'tag',
  CONCEPT: 'concept',
  ENTITY: 'entity',
  QUESTION: 'question',
  SOURCE: 'source'
};

// 边类型枚举
var EdgeType = {
  LINK: 'link',           // wiki-link 关系
  TAG: 'tag',             // 标签关系
  REFERENCE: 'reference', // 引用关系
  RELATED: 'related',     // 相关关系
  MENTION: 'mention',     // 提及关系
  PARENT: 'parent'        // 层级关系
};

// 当前图谱版本
var GRAPH_VERSION = 1;

// 创建节点工厂函数
function createNode(data) {
  data = data || {};
  var now = new Date().toISOString();
  return {
    id: data.id || '',
    type: data.type || NodeType.NOTE,
    refId: data.refId || '',
    label: data.label || '',
    metadata: data.metadata || {},
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

// 创建边工厂函数
function createEdge(data) {
  data = data || {};
  return {
    id: data.id || '',
    source: data.source || '',
    target: data.target || '',
    type: data.type || EdgeType.LINK,
    weight: data.weight || 1.0,
    createdAt: data.createdAt || new Date().toISOString()
  };
}

// 创建持久化图谱结构
function createPersistedGraph() {
  return {
    version: GRAPH_VERSION,
    nodes: {},
    edges: {},
    outEdges: {},
    inEdges: {},
    nodeToEdges: {},
    updatedAt: new Date().toISOString()
  };
}

// 节点验证
function validateNode(node) {
  var errors = [];
  if (!node.id) errors.push('id required');
  if (!node.type) errors.push('type required');
  if (!Object.values(NodeType).includes(node.type)) errors.push('invalid type: ' + node.type);
  if (!node.label) errors.push('label required');
  return { valid: errors.length === 0, errors: errors };
}

// 边验证
function validateEdge(edge) {
  var errors = [];
  if (!edge.id) errors.push('id required');
  if (!edge.source) errors.push('source required');
  if (!edge.target) errors.push('target required');
  if (edge.source === edge.target) errors.push('self-loop not allowed');
  if (!Object.values(EdgeType).includes(edge.type)) errors.push('invalid type: ' + edge.type);
  return { valid: errors.length === 0, errors: errors };
}

module.exports = {
  NodeType: NodeType,
  EdgeType: EdgeType,
  GRAPH_VERSION: GRAPH_VERSION,
  createNode: createNode,
  createEdge: createEdge,
  createPersistedGraph: createPersistedGraph,
  validateNode: validateNode,
  validateEdge: validateEdge
};
