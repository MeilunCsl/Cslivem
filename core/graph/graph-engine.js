// core/graph/graph-engine.js
// 知识图谱核心引擎
// 职责：维护 nodes/edges 映射 + adjacency index + CRUD

var graphStore = require('./graph-store');
var types = require('./types');

var format = require('../../utils/format');

// ===== Node CRUD =====
function upsertNode(data) {
  var graph = graphStore.loadGraph();
  var node = types.createNode(data);
  if (!node.id) { node.id = format.generateId(); }
  var validation = types.validateNode(node);
  if (!validation.valid) {
    throw new Error('Node validation: ' + validation.errors.join(', '));
  }
  var existing = graph.nodes[node.id];
  if (existing) {
    // Update
    node.createdAt = existing.createdAt;
    node.updatedAt = new Date().toISOString();
  }
  graph.nodes[node.id] = node;
  // Ensure index maps exist
  if (!graph.nodeToEdges[node.id]) graph.nodeToEdges[node.id] = [];
  if (!graph.outEdges[node.id]) graph.outEdges[node.id] = [];
  if (!graph.inEdges[node.id]) graph.inEdges[node.id] = [];
  graphStore.saveGraph(graph);
  return node;
}

function deleteNode(nodeId) {
  var graph = graphStore.loadGraph();
  if (!graph.nodes[nodeId]) return false;
  // Delete all connected edges
  var edgeIds = (graph.nodeToEdges[nodeId] || []).slice();
  edgeIds.forEach(function(eid) {
    delete graph.edges[eid];
  });
  // Clean index maps
  delete graph.nodes[nodeId];
  delete graph.outEdges[nodeId];
  delete graph.inEdges[nodeId];
  delete graph.nodeToEdges[nodeId];
  // Remove edge references from other nodes
  Object.keys(graph.nodeToEdges).forEach(function(nid) {
    graph.nodeToEdges[nid] = graph.nodeToEdges[nid].filter(function(eid) {
      return !!graph.edges[eid];
    });
  });
  Object.keys(graph.outEdges).forEach(function(nid) {
    graph.outEdges[nid] = graph.outEdges[nid].filter(function(eid) {
      return !!graph.edges[eid];
    });
  });
  Object.keys(graph.inEdges).forEach(function(nid) {
    graph.inEdges[nid] = graph.inEdges[nid].filter(function(eid) {
      return !!graph.edges[eid];
    });
  });
  graphStore.saveGraph(graph);
  return true;
}

function getNode(nodeId) {
  var graph = graphStore.loadGraph();
  return graph.nodes[nodeId] || null;
}

// ===== Edge CRUD =====
function upsertEdge(data) {
  var graph = graphStore.loadGraph();
  var edge = types.createEdge(data);
  if (!edge.id) { edge.id = format.generateId(); }
  var validation = types.validateEdge(edge);
  if (!validation.valid) {
    throw new Error('Edge validation: ' + validation.errors.join(', '));
  }
  // 重复边去重
  var existingEdges = graph.nodeToEdges[edge.source] || [];
  for (var i = 0; i < existingEdges.length; i++) {
    var e = graph.edges[existingEdges[i]];
    if (e && e.source === edge.source && e.target === edge.target && e.type === edge.type) {
      return e; // Already exists
    }
  }
  // Create
  graph.edges[edge.id] = edge;
  // Update indexes
  if (!graph.outEdges[edge.source]) graph.outEdges[edge.source] = [];
  if (!graph.inEdges[edge.target]) graph.inEdges[edge.target] = [];
  if (!graph.nodeToEdges[edge.source]) graph.nodeToEdges[edge.source] = [];
  if (!graph.nodeToEdges[edge.target]) graph.nodeToEdges[edge.target] = [];
  graph.outEdges[edge.source].push(edge.id);
  graph.inEdges[edge.target].push(edge.id);
  if (graph.nodeToEdges[edge.source].indexOf(edge.id) < 0) graph.nodeToEdges[edge.source].push(edge.id);
  if (graph.nodeToEdges[edge.target].indexOf(edge.id) < 0) graph.nodeToEdges[edge.target].push(edge.id);
  graphStore.saveGraph(graph);
  return edge;
}

function deleteEdge(edgeId) {
  var graph = graphStore.loadGraph();
  var edge = graph.edges[edgeId];
  if (!edge) return false;
  delete graph.edges[edgeId];
  // Clean indexes
  if (graph.outEdges[edge.source]) {
    graph.outEdges[edge.source] = graph.outEdges[edge.source].filter(function(id) { return id !== edgeId; });
  }
  if (graph.inEdges[edge.target]) {
    graph.inEdges[edge.target] = graph.inEdges[edge.target].filter(function(id) { return id !== edgeId; });
  }
  if (graph.nodeToEdges[edge.source]) {
    graph.nodeToEdges[edge.source] = graph.nodeToEdges[edge.source].filter(function(id) { return id !== edgeId; });
  }
  if (graph.nodeToEdges[edge.target]) {
    graph.nodeToEdges[edge.target] = graph.nodeToEdges[edge.target].filter(function(id) { return id !== edgeId; });
  }
  graphStore.saveGraph(graph);
  return true;
}

function getEdge(edgeId) {
  var graph = graphStore.loadGraph();
  return graph.edges[edgeId] || null;
}

// ===== Query =====
function getNeighbors(nodeId, options) {
  options = options || {};
  var graph = graphStore.loadGraph();
  var edgeIds = graph.nodeToEdges[nodeId] || [];
  var neighborMap = {};
  edgeIds.forEach(function(eid) {
    var edge = graph.edges[eid];
    if (!edge) return;
    if (options.edgeType && edge.type !== options.edgeType) return;
    var neighborId = edge.source === nodeId ? edge.target : edge.source;
    if (!neighborMap[neighborId]) {
      neighborMap[neighborId] = { node: graph.nodes[neighborId], edges: [] };
    }
    if (neighborMap[neighborId].node) {
      neighborMap[neighborId].edges.push(edge);
    }
  });
  return Object.values(neighborMap).filter(function(item) { return !!item.node; });
}

function getOutEdges(nodeId) {
  var graph = graphStore.loadGraph();
  return (graph.outEdges[nodeId] || []).map(function(eid) { return graph.edges[eid]; }).filter(function(e) { return !!e; });
}

function getInEdges(nodeId) {
  var graph = graphStore.loadGraph();
  return (graph.inEdges[nodeId] || []).map(function(eid) { return graph.edges[eid]; }).filter(function(e) { return !!e; });
}

function getNodeEdges(nodeId) {
  var graph = graphStore.loadGraph();
  return (graph.nodeToEdges[nodeId] || []).map(function(eid) { return graph.edges[eid]; }).filter(function(e) { return !!e; });
}

// ===== Stats =====
function getStats() {
  var graph = graphStore.loadGraph();
  var nodeTypes = {};
  Object.values(graph.nodes).forEach(function(n) {
    nodeTypes[n.type] = (nodeTypes[n.type] || 0) + 1;
  });
  return {
    version: graph.version,
    nodeCount: Object.keys(graph.nodes).length,
    edgeCount: Object.keys(graph.edges).length,
    nodeTypes: nodeTypes,
    updatedAt: graph.updatedAt
  };
}

// ===== Import/Export =====
function exportGraph() {
  return graphStore.exportGraph();
}

function importGraph(jsonString) {
  return graphStore.importGraph(jsonString);
}

function resetGraph() {
  return graphStore.resetGraph();
}

module.exports = {
  upsertNode: upsertNode,
  deleteNode: deleteNode,
  getNode: getNode,
  upsertEdge: upsertEdge,
  deleteEdge: deleteEdge,
  getEdge: getEdge,
  getNeighbors: getNeighbors,
  getOutEdges: getOutEdges,
  getInEdges: getInEdges,
  getNodeEdges: getNodeEdges,
  getStats: getStats,
  exportGraph: exportGraph,
  importGraph: importGraph,
  resetGraph: resetGraph
};
