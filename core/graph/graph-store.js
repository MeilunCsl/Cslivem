// core/graph/graph-store.js
// 图谱持久化层
// 职责：读取/保存/导入/导出/版本迁移

var storage = require('../storage/local-storage');
var keys = require('../storage/storage-keys');
var types = require('./types');

function loadGraph() {
  var graph = storage.getJSON(keys.GRAPH);
  if (!graph) {
    graph = types.createPersistedGraph();
    saveGraph(graph);
  }
  // 版本迁移
  if (!graph.version || graph.version < types.GRAPH_VERSION) {
    graph = migrateGraph(graph);
  }
  return graph;
}

function saveGraph(graph) {
  graph.updatedAt = new Date().toISOString();
  storage.setJSON(keys.GRAPH, graph);
  storage.setJSON(keys.GRAPH_VERSION, graph.version || types.GRAPH_VERSION);
}

function migrateGraph(graph) {
  console.log('[GraphStore] migrating from v' + (graph.version || 0) + ' to v' + types.GRAPH_VERSION);
  // v0 -> v1: ensure all index maps exist
  if (!graph.outEdges) graph.outEdges = {};
  if (!graph.inEdges) graph.inEdges = {};
  if (!graph.nodeToEdges) graph.nodeToEdges = {};
  graph.version = types.GRAPH_VERSION;
  saveGraph(graph);
  return graph;
}

function resetGraph() {
  var graph = types.createPersistedGraph();
  saveGraph(graph);
  return graph;
}

function exportGraph() {
  var graph = loadGraph();
  return JSON.stringify(graph, null, 2);
}

function importGraph(jsonString) {
  try {
    var data = JSON.parse(jsonString);
    if (!data.nodes || !data.edges) {
      return { success: false, error: 'Invalid format: missing nodes or edges' };
    }
    var graph = types.createPersistedGraph();
    graph.nodes = data.nodes;
    graph.edges = data.edges;
    graph.version = types.GRAPH_VERSION;
    // Rebuild indexes
    rebuildIndexes(graph);
    saveGraph(graph);
    var nodeCount = Object.keys(graph.nodes).length;
    var edgeCount = Object.keys(graph.edges).length;
    return { success: true, nodeCount: nodeCount, edgeCount: edgeCount };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function rebuildIndexes(graph) {
  graph.outEdges = {};
  graph.inEdges = {};
  graph.nodeToEdges = {};
  Object.keys(graph.edges).forEach(function(eid) {
    var edge = graph.edges[eid];
    if (!graph.outEdges[edge.source]) graph.outEdges[edge.source] = [];
    if (!graph.inEdges[edge.target]) graph.inEdges[edge.target] = [];
    if (!graph.nodeToEdges[edge.source]) graph.nodeToEdges[edge.source] = [];
    if (!graph.nodeToEdges[edge.target]) graph.nodeToEdges[edge.target] = [];
    graph.outEdges[edge.source].push(eid);
    graph.inEdges[edge.target].push(eid);
    if (graph.nodeToEdges[edge.source].indexOf(eid) < 0) graph.nodeToEdges[edge.source].push(eid);
    if (graph.nodeToEdges[edge.target].indexOf(eid) < 0) graph.nodeToEdges[edge.target].push(eid);
  });
}

module.exports = {
  loadGraph: loadGraph,
  saveGraph: saveGraph,
  resetGraph: resetGraph,
  exportGraph: exportGraph,
  importGraph: importGraph,
  rebuildIndexes: rebuildIndexes
};
