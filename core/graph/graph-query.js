// core/graph/graph-query.js
// 图谱高级查询
// 职责：搜索节点、遍历、关联推荐

var graphStore = require('./graph-store');

// 搜索节点（标签模糊匹配）
function searchNodes(query) {
  if (!query) return [];
  var graph = graphStore.loadGraph();
  var q = query.toLowerCase();
  return Object.values(graph.nodes).filter(function(n) {
    return n.label.toLowerCase().indexOf(q) >= 0 ||
           (n.refId && n.refId.toLowerCase().indexOf(q) >= 0) ||
           (n.metadata && n.metadata.description && n.metadata.description.toLowerCase().indexOf(q) >= 0);
  });
}

// 按类型获取节点
function getNodesByType(type) {
  var graph = graphStore.loadGraph();
  return Object.values(graph.nodes).filter(function(n) { return n.type === type; });
}

// BFS 遍历（一跳或多跳邻居）
function traverse(startNodeId, maxDepth) {
  maxDepth = maxDepth || 1;
  var graph = graphStore.loadGraph();
  var visited = {};
  var result = [];
  var queue = [{ nodeId: startNodeId, depth: 0 }];
  visited[startNodeId] = true;

  while (queue.length > 0) {
    var item = queue.shift();
    if (item.depth > 0) {
      var node = graph.nodes[item.nodeId];
      if (node) {
        result.push({ node: node, depth: item.depth });
      }
    }
    if (item.depth >= maxDepth) continue;
    var edgeIds = graph.nodeToEdges[item.nodeId] || [];
    edgeIds.forEach(function(eid) {
      var edge = graph.edges[eid];
      if (!edge) return;
      var nextId = edge.source === item.nodeId ? edge.target : edge.source;
      if (!visited[nextId]) {
        visited[nextId] = true;
        queue.push({ nodeId: nextId, depth: item.depth + 1 });
      }
    });
  }
  return result;
}

// 获取二跳推荐（排除一跳邻居）
function getSecondDegreeNeighbors(nodeId) {
  var oneHop = traverse(nodeId, 1);
  var oneHopIds = {};
  oneHop.forEach(function(item) { oneHopIds[item.node.id] = true; });
  oneHopIds[nodeId] = true;

  var twoHop = {};
  oneHop.forEach(function(item) {
    var neighbors = traverse(item.node.id, 1);
    neighbors.forEach(function(n) {
      if (!oneHopIds[n.node.id] && !twoHop[n.node.id]) {
        twoHop[n.node.id] = n.node;
      }
    });
  });
  return Object.values(twoHop);
}

// 查找两个节点间的最短路径 (BFS)
function findPath(startId, endId) {
  var graph = graphStore.loadGraph();
  var visited = {};
  var queue = [[startId]];
  visited[startId] = true;

  while (queue.length > 0) {
    var path = queue.shift();
    var current = path[path.length - 1];
    if (current === endId) return path;
    var edgeIds = graph.nodeToEdges[current] || [];
    edgeIds.forEach(function(eid) {
      var edge = graph.edges[eid];
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

module.exports = {
  searchNodes: searchNodes,
  getNodesByType: getNodesByType,
  traverse: traverse,
  getSecondDegreeNeighbors: getSecondDegreeNeighbors,
  findPath: findPath
};
