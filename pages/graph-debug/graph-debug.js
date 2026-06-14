// pages/graph-debug/graph-debug.js
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var types = require('../../core/graph/types');

Page({
  data: {
    statusBarHeight: 20,
    stats: {},
    log: []
  },

  onLoad: function() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    this.refreshStats();
  },

  refreshStats: function() {
    this.setData({ stats: graphEngine.getStats() });
  },

  addTestNode: function() {
    var node = graphEngine.upsertNode({
      type: types.NodeType.NOTE,
      label: 'Test Note ' + Date.now(),
      metadata: { test: true }
    });
    this.log('Created node: ' + node.id.substring(0, 8));
    this.refreshStats();
  },

  addTestEdge: function() {
    var stats = graphEngine.getStats();
    if (stats.nodeCount < 2) {
      this.log('Need at least 2 nodes');
      return;
    }
    var graph = require('../../core/graph/graph-store').loadGraph();
    var nodeIds = Object.keys(graph.nodes);
    var src = nodeIds[nodeIds.length - 2];
    var tgt = nodeIds[nodeIds.length - 1];
    var edge = graphEngine.upsertEdge({
      source: src,
      target: tgt,
      type: types.EdgeType.LINK
    });
    this.log('Created edge: ' + edge.id.substring(0, 8));
    this.refreshStats();
  },

  testNeighbors: function() {
    var graph = require('../../core/graph/graph-store').loadGraph();
    var nodeIds = Object.keys(graph.nodes);
    if (nodeIds.length === 0) { this.log('No nodes'); return; }
    var neighbors = graphEngine.getNeighbors(nodeIds[0]);
    this.log('Node ' + nodeIds[0].substring(0, 8) + ' has ' + neighbors.length + ' neighbors');
  },

  testSearch: function() {
    var results = graphQuery.searchNodes('Test');
    this.log('Search "Test": ' + results.length + ' results');
  },

  testTraverse: function() {
    var graph = require('../../core/graph/graph-store').loadGraph();
    var nodeIds = Object.keys(graph.nodes);
    if (nodeIds.length === 0) { this.log('No nodes'); return; }
    var result = graphQuery.traverse(nodeIds[0], 2);
    this.log('Traverse from ' + nodeIds[0].substring(0, 8) + ': ' + result.length + ' nodes (2-hop)');
  },

  exportGraph: function() {
    var json = graphEngine.exportGraph();
    this.log('Exported: ' + json.length + ' chars');
    wx.setClipboardData({ data: json });
  },

  clearGraph: function() {
    var self = this;
    wx.showModal({
      title: 'Clear Graph',
      content: 'This will delete ALL nodes and edges.',
      success: function(res) {
        if (res.confirm) {
          graphEngine.resetGraph();
          self.log('Graph cleared');
          self.refreshStats();
        }
      }
    });
  },

  log: function(msg) {
    var logs = this.data.log.concat(['[' + new Date().toLocaleTimeString() + '] ' + msg]);
    if (logs.length > 20) logs = logs.slice(-20);
    this.setData({ log: logs });
  },

  onBack: function() { wx.navigateBack(); }
});
