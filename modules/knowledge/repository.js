// modules/knowledge/repository.js
// 知识图谱数据仓储
// 本地持久化 + 邻接表索引

var storage = require('../../miniprogram/storage');
var model = require('./model');

var NODES_KEY = 'kg_nodes';
var EDGES_KEY = 'kg_edges';
var ADJ_KEY = 'kg_adjacency';

// ===== Persistence =====
function loadNodes() { return storage.get(NODES_KEY) || []; }
function saveNodes(list) { storage.set(NODES_KEY, list); }
function loadEdges() { return storage.get(EDGES_KEY) || []; }
function saveEdges(list) { storage.set(EDGES_KEY, list); }
function loadAdj() { return storage.get(ADJ_KEY) || {}; }
function saveAdj(adj) { storage.set(ADJ_KEY, adj); }

// ===== Adjacency Index =====
function rebuildAdjacency() {
  var edges = loadEdges();
  var adj = {};
  edges.forEach(function(e) {
    if (!adj[e.source]) adj[e.source] = [];
    if (!adj[e.target]) adj[e.target] = [];
    adj[e.source].push(e.id);
    adj[e.target].push(e.id);
  });
  saveAdj(adj);
  return adj;
}

function addToAdj(edgeId, source, target) {
  var adj = loadAdj();
  if (!adj[source]) adj[source] = [];
  if (!adj[target]) adj[target] = [];
  if (adj[source].indexOf(edgeId) < 0) adj[source].push(edgeId);
  if (adj[target].indexOf(edgeId) < 0) adj[target].push(edgeId);
  saveAdj(adj);
}

function removeFromAdj(edgeId, source, target) {
  var adj = loadAdj();
  if (adj[source]) {
    adj[source] = adj[source].filter(function(id) { return id !== edgeId; });
    if (adj[source].length === 0) delete adj[source];
  }
  if (adj[target]) {
    adj[target] = adj[target].filter(function(id) { return id !== edgeId; });
    if (adj[target].length === 0) delete adj[target];
  }
  saveAdj(adj);
}

// ===== Node CRUD =====
function getAllNodes() { return loadNodes(); }

function getNodeById(id) {
  return loadNodes().find(function(n) { return n.id === id; }) || null;
}

function getNodeByRefId(refId) {
  return loadNodes().find(function(n) { return n.refId === refId; }) || null;
}

function saveNode(node) {
  var nodes = loadNodes();
  var idx = nodes.findIndex(function(n) { return n.id === node.id; });
  node.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    nodes[idx] = node;
  } else {
    nodes.push(node);
  }
  saveNodes(nodes);
  return node;
}

function deleteNode(id) {
  var nodes = loadNodes().filter(function(n) { return n.id !== id; });
  saveNodes(nodes);
  // Remove all edges connected to this node
  var edges = loadEdges();
  var toRemove = edges.filter(function(e) { return e.source === id || e.target === id; });
  var remaining = edges.filter(function(e) { return e.source !== id && e.target !== id; });
  saveEdges(remaining);
  toRemove.forEach(function(e) { removeFromAdj(e.id, e.source, e.target); });
  return toRemove.length;
}

function searchNodes(query) {
  if (!query) return loadNodes();
  var q = query.toLowerCase();
  return loadNodes().filter(function(n) {
    return n.label.toLowerCase().indexOf(q) >= 0 ||
           (n.refId && n.refId.toLowerCase().indexOf(q) >= 0);
  });
}

function getNodesByType(type) {
  return loadNodes().filter(function(n) { return n.type === type; });
}

// ===== Edge CRUD =====
function getAllEdges() { return loadEdges(); }

function getEdgeById(id) {
  return loadEdges().find(function(e) { return e.id === id; }) || null;
}

function saveEdge(edge) {
  var edges = loadEdges();
  var idx = edges.findIndex(function(e) { return e.id === edge.id; });
  if (idx >= 0) {
    edges[idx] = edge;
  } else {
    edges.push(edge);
    addToAdj(edge.id, edge.source, edge.target);
  }
  saveEdges(edges);
  return edge;
}

function deleteEdge(id) {
  var edge = getEdgeById(id);
  var edges = loadEdges().filter(function(e) { return e.id !== id; });
  saveEdges(edges);
  if (edge) { removeFromAdj(id, edge.source, edge.target); }
}

function getEdgesForNode(nodeId) {
  var adj = loadAdj();
  var edgeIds = adj[nodeId] || [];
  var edges = loadEdges();
  return edgeIds.map(function(eid) {
    return edges.find(function(e) { return e.id === eid; });
  }).filter(function(e) { return !!e; });
}

// ===== Graph Queries =====
function getNeighbors(nodeId) {
  var edges = getEdgesForNode(nodeId);
  var neighborIds = [];
  edges.forEach(function(e) {
    if (e.source === nodeId && neighborIds.indexOf(e.target) < 0) {
      neighborIds.push(e.target);
    }
    if (e.target === nodeId && neighborIds.indexOf(e.source) < 0) {
      neighborIds.push(e.source);
    }
  });
  return neighborIds.map(function(nid) { return getNodeById(nid); }).filter(function(n) { return !!n; });
}

function getBacklinks(targetId) {
  var edges = loadEdges().filter(function(e) { return e.target === targetId; });
  return edges.map(function(e) {
    var node = getNodeById(e.source);
    if (node) { node._edge = e; }
    return node;
  }).filter(function(n) { return !!n; });
}

function getForwardLinks(sourceId) {
  var edges = loadEdges().filter(function(e) { return e.source === sourceId; });
  return edges.map(function(e) {
    var node = getNodeById(e.target);
    if (node) { node._edge = e; }
    return node;
  }).filter(function(n) { return !!n; });
}

// Find shortest path between two nodes (BFS)
function findPath(startId, endId) {
  var adj = loadAdj();
  var visited = {};
  var queue = [[startId]];
  visited[startId] = true;
  while (queue.length > 0) {
    var path = queue.shift();
    var current = path[path.length - 1];
    if (current === endId) return path;
    var edgeIds = adj[current] || [];
    var edges = loadEdges();
    edgeIds.forEach(function(eid) {
      var edge = edges.find(function(e) { return e.id === eid; });
      if (!edge) return;
      var next = edge.source === current ? edge.target : edge.source;
      if (!visited[next]) {
        visited[next] = true;
        queue.push(path.concat([next]));
      }
    });
  }
  return null;
}

// Get graph stats
function getStats() {
  var nodes = loadNodes();
  var edges = loadEdges();
  var types = {};
  nodes.forEach(function(n) {
    types[n.type] = (types[n.type] || 0) + 1;
  });
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    types: types,
    avgDegree: nodes.length > 0 ? (edges.length * 2 / nodes.length).toFixed(1) : 0
  };
}

// Get full graph data (for visualization)
function getFullGraph() {
  return {
    nodes: loadNodes(),
    edges: loadEdges()
  };
}

module.exports = {
  // Node
  getAllNodes: getAllNodes,
  getNodeById: getNodeById,
  getNodeByRefId: getNodeByRefId,
  saveNode: saveNode,
  deleteNode: deleteNode,
  searchNodes: searchNodes,
  getNodesByType: getNodesByType,
  // Edge
  getAllEdges: getAllEdges,
  getEdgeById: getEdgeById,
  saveEdge: saveEdge,
  deleteEdge: deleteEdge,
  getEdgesForNode: getEdgesForNode,
  // Graph
  getNeighbors: getNeighbors,
  getBacklinks: getBacklinks,
  getForwardLinks: getForwardLinks,
  findPath: findPath,
  getStats: getStats,
  getFullGraph: getFullGraph,
  rebuildAdjacency: rebuildAdjacency
};
