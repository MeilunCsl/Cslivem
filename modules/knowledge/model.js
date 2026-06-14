// modules/knowledge/model.js
// 知识图谱领域模型: Node + Edge

var format = require('../../utils/format');

function createNode(data) {
  data = data || {};
  var now = new Date().toISOString();
  return {
    id: data.id || format.generateId(),
    type: data.type || 'note',
    refId: data.refId || '',
    label: data.label || '',
    metadata: data.metadata || {},
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

function createEdge(data) {
  data = data || {};
  var now = new Date().toISOString();
  return {
    id: data.id || format.generateId(),
    source: data.source || '',
    target: data.target || '',
    type: data.type || 'link',
    weight: data.weight || 1.0,
    createdAt: data.createdAt || now
  };
}

function validateNode(node) {
  var errors = [];
  if (!node.id) errors.push('Node id required');
  if (!node.type) errors.push('Node type required');
  if (!node.label) errors.push('Node label required');
  return { valid: errors.length === 0, errors: errors };
}

function validateEdge(edge) {
  var errors = [];
  if (!edge.id) errors.push('Edge id required');
  if (!edge.source) errors.push('Edge source required');
  if (!edge.target) errors.push('Edge target required');
  if (edge.source === edge.target) errors.push('Self-loop not allowed');
  return { valid: errors.length === 0, errors: errors };
}

module.exports = {
  createNode: createNode,
  createEdge: createEdge,
  validateNode: validateNode,
  validateEdge: validateEdge
};
