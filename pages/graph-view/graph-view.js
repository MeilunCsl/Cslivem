// pages/graph-view/graph-view.js
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var graphStore = require('../../core/graph/graph-store');

var NODE_COLORS = {
  note: '#5B4CFF',
  tag: '#3A7BFF',
  concept: '#00D4D9',
  entity: '#F59E0B',
  question: '#FF6B6B',
  source: '#96CEB4'
};

var MAX_NODES = 80;
var MAX_EDGES = 160;

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    nodeCount: 0,
    edgeCount: 0,
    selectedNode: null,
    searchQuery: '',
    searchResults: [],
    showSearch: false,
    neighborNodes: [],
    focusId: ''
  },

  canvas: null,
  ctx: null,
  graphNodes: [],
  graphEdges: [],
  animFrame: null,
  // Interaction
  dragging: null,
  dragOffsetX: 0,
  dragOffsetY: 0,
  scale: 1,
  panX: 0,
  panY: 0,
  lastTapTime: 0,
  lastTapId: null,
  highlightedId: null,
  canvasW: 375,
  canvasH: 600,
  dpr: 2,
  // Touch tracking
  touchStartX: 0,
  touchStartY: 0,
  isDraggingCanvas: false,
  pinchStartDist: 0,
  pinchStartScale: 1,

  onLoad: function (options) {
    var self = this;
    try {
      var sys = wx.getSystemInfoSync();
      self.setData({ statusBarHeight: sys.statusBarHeight || 20 });
      self.dpr = sys.pixelRatio || 2;
    } catch (e) { /* ignore */ }
    if (options && options.focus) {
      self.setData({ focusId: options.focus });
    }
    self.loadGraphData();
    self.initCanvas();
  },

  onUnload: function () {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  },

  // ===== Graph Data =====
  loadGraphData: function () {
    var graph = graphStore.loadGraph();
    var allNodes = Object.values(graph.nodes || {});
    var allEdges = Object.values(graph.edges || {});
    // Limit for performance
    if (allNodes.length > MAX_NODES) {
      allNodes.sort(function (a, b) { return (b.weight || 0) - (a.weight || 0); });
      allNodes = allNodes.slice(0, MAX_NODES);
    }
    var nodeIds = {};
    allNodes.forEach(function (n) { nodeIds[n.id] = true; });
    allEdges = allEdges.filter(function (e) {
      return nodeIds[e.source] && nodeIds[e.target];
    });
    if (allEdges.length > MAX_EDGES) {
      allEdges = allEdges.slice(0, MAX_EDGES);
    }
    this.graphNodes = allNodes.map(function (n) {
      return {
        id: n.id,
        label: n.label || n.title || n.id,
        type: n.type || 'note',
        color: NODE_COLORS[n.type] || NODE_COLORS.note,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: Math.max(8, Math.min(20, 6 + (n.weight || 1) * 2)),
        weight: n.weight || 1
      };
    });
    this.graphEdges = allEdges.map(function (e) {
      return { id: e.id, source: e.source, target: e.target, type: e.type };
    });
    this.setData({
      nodeCount: this.graphNodes.length,
      edgeCount: this.graphEdges.length
    });
  },

  // ===== Canvas Init =====
  initCanvas: function () {
    var self = this;
    var query = wx.createSelectorQuery();
    query.select('#graphCanvas').fields({ node: true, size: true }).exec(function (res) {
      if (!res || !res[0] || !res[0].node) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      self.canvasW = res[0].width;
      self.canvasH = res[0].height;
      canvas.width = self.canvasW * self.dpr;
      canvas.height = self.canvasH * self.dpr;
      ctx.scale(self.dpr, self.dpr);
      self.canvas = canvas;
      self.ctx = ctx;
      self.initLayout();
      self.setData({ ready: true });
      self.startRender();
      // Focus on specific node if requested
      if (self.data.focusId) {
        var focusNode = self.graphNodes.filter(function(n) { return n.id === self.data.focusId; })[0];
        if (focusNode) {
          self.panX = self.canvasW / 2 - focusNode.x * self.scale;
          self.panY = self.canvasH / 2 - focusNode.y * self.scale;
          self.selectNode(focusNode);
        }
      }
    });
  },

  // ===== Force-Directed Layout =====
  initLayout: function () {
    var cx = this.canvasW / 2;
    var cy = this.canvasH / 2;
    var nodes = this.graphNodes;
    var angleStep = (2 * Math.PI) / Math.max(nodes.length, 1);
    var radius = Math.min(cx, cy) * 0.6;
    for (var i = 0; i < nodes.length; i++) {
      var angle = angleStep * i;
      nodes[i].x = cx + Math.cos(angle) * radius * (0.5 + Math.random() * 0.5);
      nodes[i].y = cy + Math.sin(angle) * radius * (0.5 + Math.random() * 0.5);
    }
    // Run a few simulation steps
    for (var s = 0; s < 60; s++) {
      this.simulateStep();
    }
  },

  simulateStep: function () {
    var nodes = this.graphNodes;
    var edges = this.graphEdges;
    var cx = this.canvasW / 2;
    var cy = this.canvasH / 2;
    var k = 0.01; // spring constant
    var repulse = 2000;
    var damping = 0.85;
    var centerPull = 0.005;

    // Repulsion between all nodes
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = repulse / (dist * dist);
        var fx = (dx / dist) * force;
        var fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Attraction along edges
    var nodeMap = {};
    nodes.forEach(function (n) { nodeMap[n.id] = n; });
    for (var e = 0; e < edges.length; e++) {
      var src = nodeMap[edges[e].source];
      var tgt = nodeMap[edges[e].target];
      if (!src || !tgt) continue;
      var dx2 = tgt.x - src.x;
      var dy2 = tgt.y - src.y;
      var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      var idealDist = 100;
      var force2 = k * (dist2 - idealDist);
      var fx2 = (dx2 / dist2) * force2;
      var fy2 = (dy2 / dist2) * force2;
      src.vx += fx2;
      src.vy += fy2;
      tgt.vx -= fx2;
      tgt.vy -= fy2;
    }

    // Center gravity + damping + position update
    for (var n = 0; n < nodes.length; n++) {
      nodes[n].vx += (cx - nodes[n].x) * centerPull;
      nodes[n].vy += (cy - nodes[n].y) * centerPull;
      nodes[n].vx *= damping;
      nodes[n].vy *= damping;
      nodes[n].x += nodes[n].vx;
      nodes[n].y += nodes[n].vy;
      // Bounds
      nodes[n].x = Math.max(30, Math.min(this.canvasW - 30, nodes[n].x));
      nodes[n].y = Math.max(30, Math.min(this.canvasH - 30, nodes[n].y));
    }
  },

  // ===== Rendering =====
  startRender: function () {
    var self = this;
    function frame() {
      self.render();
      self.animFrame = self.canvas.requestAnimationFrame(frame);
    }
    self.animFrame = self.canvas.requestAnimationFrame(frame);
  },

  render: function () {
    if (!this.ctx) return;
    var ctx = this.ctx;
    var w = this.canvasW;
    var h = this.canvasH;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    // Draw edges
    var nodeMap = {};
    this.graphNodes.forEach(function (n) { nodeMap[n.id] = n; });
    for (var i = 0; i < this.graphEdges.length; i++) {
      var edge = this.graphEdges[i];
      var src = nodeMap[edge.source];
      var tgt = nodeMap[edge.target];
      if (!src || !tgt) continue;
      var isHighlighted = this.highlightedId && (edge.source === this.highlightedId || edge.target === this.highlightedId);
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = isHighlighted ? 'rgba(91,76,255,0.5)' : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
    }

    // Draw nodes
    for (var j = 0; j < this.graphNodes.length; j++) {
      var node = this.graphNodes[j];
      var isSelected = node.id === this.highlightedId;
      // Glow for selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '33';
        ctx.fill();
      }
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Label
      ctx.fillStyle = '#333';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label.substring(0, 8), node.x, node.y + node.radius + 14);
    }

    ctx.restore();
  },

  // ===== Touch Interaction =====
  findNodeAt: function (x, y) {
    var adjX = (x - this.panX) / this.scale;
    var adjY = (y - this.panY) / this.scale;
    for (var i = this.graphNodes.length - 1; i >= 0; i--) {
      var n = this.graphNodes[i];
      var dx = adjX - n.x;
      var dy = adjY - n.y;
      if (dx * dx + dy * dy <= (n.radius + 8) * (n.radius + 8)) {
        return n;
      }
    }
    return null;
  },

  onCanvasTouchStart: function (e) {
    var touch = e.touches[0];
    this.touchStartX = touch.x;
    this.touchStartY = touch.y;
    this.isDraggingCanvas = false;
    if (e.touches.length === 2) {
      var dx = e.touches[1].x - e.touches[0].x;
      var dy = e.touches[1].y - e.touches[0].y;
      this.pinchStartDist = Math.sqrt(dx * dx + dy * dy);
      this.pinchStartScale = this.scale;
      return;
    }
    var node = this.findNodeAt(touch.x, touch.y);
    if (node) {
      this.dragging = node;
      this.dragOffsetX = (touch.x - this.panX) / this.scale - node.x;
      this.dragOffsetY = (touch.y - this.panY) / this.scale - node.y;
    }
  },

  onCanvasTouchMove: function (e) {
    if (e.touches.length === 2 && this.pinchStartDist > 0) {
      var dx = e.touches[1].x - e.touches[0].x;
      var dy = e.touches[1].y - e.touches[0].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this.scale = Math.max(0.3, Math.min(3, this.pinchStartScale * (dist / this.pinchStartDist)));
      return;
    }
    var touch = e.touches[0];
    if (this.dragging) {
      this.dragging.x = (touch.x - this.panX) / this.scale - this.dragOffsetX;
      this.dragging.y = (touch.y - this.panY) / this.scale - this.dragOffsetY;
    } else {
      var movedX = touch.x - this.touchStartX;
      var movedY = touch.y - this.touchStartY;
      if (Math.abs(movedX) > 5 || Math.abs(movedY) > 5) {
        this.isDraggingCanvas = true;
      }
      if (this.isDraggingCanvas) {
        this.panX += movedX;
        this.panY += movedY;
        this.touchStartX = touch.x;
        this.touchStartY = touch.y;
      }
    }
  },

  onCanvasTouchEnd: function (e) {
    if (this.dragging && !this.isDraggingCanvas) {
      // It was a tap on a node
      var now = Date.now();
      if (this.lastTapId === this.dragging.id && now - this.lastTapTime < 300) {
        // Double tap — navigate to detail
        this.lastTapTime = 0;
        this.onNodeDetail();
      } else {
        this.lastTapTime = now;
        this.lastTapId = this.dragging.id;
        this.selectNode(this.dragging);
      }
    } else if (!this.dragging && !this.isDraggingCanvas) {
      // Tap on empty — deselect
      this.deselectNode();
    }
    this.dragging = null;
    this.pinchStartDist = 0;
  },

  selectNode: function (node) {
    this.highlightedId = node.id;
    var neighbors = this.getNeighborNodes(node.id);
    this.setData({
      selectedNode: {
        id: node.id,
        label: node.label,
        type: node.type,
        color: node.color
      },
      neighborNodes: neighbors.map(function (n) {
        return { id: n.id, label: n.label, color: n.color };
      }).slice(0, 6)
    });
  },

  deselectNode: function () {
    this.highlightedId = null;
    this.setData({ selectedNode: null, neighborNodes: [] });
  },

  getNeighborNodes: function (nodeId) {
    var edgeSet = {};
    var self = this;
    this.graphEdges.forEach(function (e) {
      if (e.source === nodeId) edgeSet[e.target] = true;
      if (e.target === nodeId) edgeSet[e.source] = true;
    });
    return this.graphNodes.filter(function (n) { return edgeSet[n.id]; });
  },

  // ===== Zoom Controls =====
  onZoomIn: function () {
    this.scale = Math.min(3, this.scale * 1.2);
  },

  onZoomOut: function () {
    this.scale = Math.max(0.3, this.scale / 1.2);
  },

  onZoomReset: function () {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
  },

  // ===== Search =====
  onToggleSearch: function () {
    this.setData({ showSearch: !this.data.showSearch, searchResults: [], searchQuery: '' });
  },

  onSearchInput: function (e) {
    var q = (e.detail.value || '').toLowerCase();
    this.setData({ searchQuery: e.detail.value });
    if (!q) {
      this.setData({ searchResults: [] });
      return;
    }
    var results = this.graphNodes.filter(function (n) {
      return n.label.toLowerCase().indexOf(q) >= 0 || n.type.indexOf(q) >= 0;
    }).map(function (n) {
      return { id: n.id, label: n.label, type: n.type, color: n.color };
    });
    this.setData({ searchResults: results.slice(0, 10) });
  },

  onTapSearchResult: function (e) {
    var id = e.currentTarget.dataset.id;
    var node = this.graphNodes.filter(function (n) { return n.id === id; })[0];
    if (node) {
      this.panX = this.canvasW / 2 - node.x * this.scale;
      this.panY = this.canvasH / 2 - node.y * this.scale;
      this.selectNode(node);
      this.setData({ showSearch: false });
    }
  },

  onTapNeighbor: function (e) {
    var id = e.currentTarget.dataset.id;
    var node = this.graphNodes.filter(function (n) { return n.id === id; })[0];
    if (node) this.selectNode(node);
  },

  // ===== Actions =====
  onBack: function () {
    wx.navigateBack({ fail: function () { wx.switchTab({ url: '/pages/home/home' }); } });
  },

  onNodeDetail: function () {
    if (!this.data.selectedNode) return;
    wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + this.data.selectedNode.id });
  },

  onNodeNeighbors: function () {
    // Already showing neighbors in the card
    wx.showToast({ title: '关联节点已显示', icon: 'none' });
  },

  onExportGraph: function () {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function (res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function () {
    try {
      var json = graphStore.exportGraph();
      wx.setClipboardData({
        data: json,
        success: function () {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function () {
    var stats = graphEngine.getStats();
    var typeStr = Object.keys(stats.nodeTypes || {}).map(function (t) {
      return t + ': ' + stats.nodeTypes[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + stats.nodeCount + '\n边: ' + stats.edgeCount + '\n类型: ' + typeStr,
      showCancel: false
    });
  }
});
