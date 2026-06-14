// pages/graph-view/graph-view.js
var knowledgeModule = require('../../modules/knowledge/public');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    nodeCount: 0,
    edgeCount: 0,
    selectedNode: null
  },

  canvas: null,
  ctx: null,
  nodes: [],
  edges: [],
  animFrame: null,
  dragging: null,
  touchStart: null,

  onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onReady: function() {
    var self = this;
    var query = wx.createSelectorQuery();
    query.select('#graphCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0]) return;
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        self.canvas = canvas;
        self.ctx = ctx;
        self.loadGraph();
        self.startLayout();
      });
  },

  onShow: function() {
    this.loadGraph();
  },

  loadGraph: function() {
    var graph = knowledgeModule.getFullGraph();
    var nodeMap = {};
    graph.nodes.forEach(function(n) {
      nodeMap[n.id] = {
        id: n.id,
        label: n.label || n.id.substring(0, 8),
        type: n.type,
        refId: n.refId,
        x: Math.random() * 600 + 50,
        y: Math.random() * 800 + 100,
        vx: 0,
        vy: 0
      };
    });
    this.nodes = Object.values(nodeMap);
    this.edges = graph.edges.filter(function(e) {
      return nodeMap[e.source] && nodeMap[e.target];
    }).map(function(e) {
      return { source: e.source, target: e.target, type: e.type };
    });
    this.setData({
      nodeCount: this.nodes.length,
      edgeCount: this.edges.length
    });
  },

  startLayout: function() {
    var self = this;
    var W = 700, H = 1200;
    var iterations = 0;

    function tick() {
      if (iterations > 300) return;
      iterations++;
      self.applyForces(W, H);
      self.drawGraph(W, H);
      self.animFrame = self.canvas.requestAnimationFrame(tick);
    }
    tick();
  },

  applyForces: function(W, H) {
    var nodes = this.nodes;
    var edges = this.edges;
    var k = 0.01;

    // Repulsion between all nodes
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = 5000 / (dist * dist);
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
    nodes.forEach(function(n) { nodeMap[n.id] = n; });
    edges.forEach(function(e) {
      var src = nodeMap[e.source];
      var tgt = nodeMap[e.target];
      if (!src || !tgt) return;
      var dx = tgt.x - src.x;
      var dy = tgt.y - src.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var force = (dist - 150) * k;
      src.vx += (dx / dist) * force;
      src.vy += (dy / dist) * force;
      tgt.vx -= (dx / dist) * force;
      tgt.vy -= (dy / dist) * force;
    });

    // Center gravity
    nodes.forEach(function(n) {
      n.vx += (W / 2 - n.x) * 0.001;
      n.vy += (H / 2 - n.y) * 0.001;
      n.vx *= 0.85;
      n.vy *= 0.85;
      if (!n.fixed) {
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(30, Math.min(W - 30, n.x));
        n.y = Math.max(30, Math.min(H - 30, n.y));
      }
    });
  },

  drawGraph: function(W, H) {
    var ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    var nodeMap = {};
    this.nodes.forEach(function(n) { nodeMap[n.id] = n; });

    // Draw edges
    ctx.strokeStyle = 'rgba(91, 76, 255, 0.15)';
    ctx.lineWidth = 1;
    this.edges.forEach(function(e) {
      var src = nodeMap[e.source];
      var tgt = nodeMap[e.target];
      if (!src || !tgt) return;
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.stroke();
    });

    // Draw nodes
    var colors = {
      note: '#5B4CFF',
      tag: '#3A7BFF',
      concept: '#00D4D9',
      entity: '#F59E0B'
    };
    this.nodes.forEach(function(n) {
      var r = 16;
      var color = colors[n.type] || '#B8B8D1';
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#0A0F1A';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label.substring(0, 8), n.x, n.y + r + 14);
    });
  },

  onTouchStart: function(e) {
    var touch = e.touches[0];
    var self = this;
    this.nodes.forEach(function(n) {
      var dx = touch.x - n.x;
      var dy = touch.y - n.y;
      if (dx * dx + dy * dy < 900) {
        self.dragging = n;
        n.fixed = true;
        self.setData({ selectedNode: n });
      }
    });
  },

  onTouchMove: function(e) {
    if (this.dragging) {
      var touch = e.touches[0];
      this.dragging.x = touch.x;
      this.dragging.y = touch.y;
    }
  },

  onTouchEnd: function() {
    if (this.dragging) {
      this.dragging.fixed = false;
      this.dragging = null;
    }
  },

  onNodeTap: function() {
    var node = this.data.selectedNode;
    if (node && node.refId) {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + node.refId });
    }
  },

  onBack: function() {
    if (this.animFrame) {
      this.canvas.cancelAnimationFrame(this.animFrame);
    }
    wx.navigateBack();
  },

  onUnload: function() {
    if (this.animFrame) {
      this.canvas.cancelAnimationFrame(this.animFrame);
    }
  }
});
