// pages/graph-view/graph-view.js
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var graphStore = require('../../core/graph/graph-store');
var types = require('../../core/graph/types');

var NODE_COLORS = {
  note: '#5B4CFF',
  tag: '#3A7BFF',
  concept: '#00D4D9',
  entity: '#F59E0B',
  question: '#FF6B6B',
  source: '#96CEB4'
};

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
    neighborNodes: []
  },

  canvas: null,
  ctx: null,
  nodes: [],
  edges: [],
  animFrame: null,
  // Interaction state
  dragging: null,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  lastTapTime: 0,
  lastTapNode: null,
  highlightedNode: null,
  // Canvas size
  canvasW: 375,
  canvasH: 600,

  onLoad: function() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

}); } catch(e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

}); }, 100);
  },

  onReady: function() {
    var self = this;
    var query = wx.createSelectorQuery();
    query.select('#graphCanvas').fields({ node: true, size: true }).exec(function(res) {
      if (!res || !res[0]) return;
      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      self.canvasW = res[0].width;
      self.canvasH = res[0].height;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      self.canvas = canvas;
      self.ctx = ctx;
      self.loadGraph();
      self.startRender();
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  onShow: function() {
    this.loadGraph();
  },

  loadGraph: function() {
    var graph = graphStore.loadGraph();
    var nodeMap = {};
    var cx = this.canvasW / 2;
    var cy = this.canvasH / 2;
    Object.keys(graph.nodes).forEach(function(id, i) {
      var n = graph.nodes[id];
      var angle = (2 * Math.PI * i) / Math.max(Object.keys(graph.nodes).length, 1);
      var r = 100 + Math.random() * 80;
      nodeMap[id] = {
        id: n.id,
        label: n.label || id.substring(0, 8),
        type: n.type,
        refId: n.refId,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0, vy: 0,
        neighbors: []
      };
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    this.nodes = Object.values(nodeMap);
    this.edges = [];
    var self = this;
    Object.keys(graph.edges).forEach(function(eid) {
      var e = graph.edges[eid];
      if (nodeMap[e.source] && nodeMap[e.target]) {
        self.edges.push({ source: e.source, target: e.target, type: e.type 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        nodeMap[e.source].neighbors.push(e.target);
        nodeMap[e.target].neighbors.push(e.source);
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    this.setData({ nodeCount: this.nodes.length, edgeCount: this.edges.length 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  startRender: function() {
    var self = this;
    var iter = 0;
    function tick() {
      if (iter < 200) {
        self.applyForces();
        iter++;
      }
      self.draw();
      self.animFrame = self.canvas.requestAnimationFrame(tick);
    }
    tick();
  },

  applyForces: function() {
    var nodes = this.nodes;
    var W = this.canvasW, H = this.canvasH;
    // Repulsion
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var f = 3000 / (d * d);
        nodes[i].vx -= (dx / d) * f;
        nodes[i].vy -= (dy / d) * f;
        nodes[j].vx += (dx / d) * f;
        nodes[j].vy += (dy / d) * f;
      }
    }
    // Attraction
    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    this.edges.forEach(function(e) {
      var s = nodeMap[e.source], t = nodeMap[e.target];
      if (!s || !t) return;
      var dx = t.x - s.x, dy = t.y - s.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var f = (d - 120) * 0.005;
      s.vx += (dx / d) * f; s.vy += (dy / d) * f;
      t.vx -= (dx / d) * f; t.vy -= (dy / d) * f;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    // Center gravity + damping
    nodes.forEach(function(n) {
      n.vx += (W / 2 - n.x) * 0.0005;
      n.vy += (H / 2 - n.y) * 0.0005;
      n.vx *= 0.8; n.vy *= 0.8;
      if (!n.fixed) {
        n.x += n.vx; n.y += n.vy;
        n.x = Math.max(20, Math.min(W - 20, n.x));
        n.y = Math.max(20, Math.min(H - 20, n.y));
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  draw: function() {
    var ctx = this.ctx;
    if (!ctx) return;
    var W = this.canvasW, H = this.canvasH;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    var nodeMap = {};
    this.nodes.forEach(function(n) { nodeMap[n.id] = n; 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var highlighted = this.highlightedNode;
    var hlNeighbors = highlighted ? (nodeMap[highlighted] || {}).neighbors || [] : [];

    // Draw edges
    this.edges.forEach(function(e) {
      var s = nodeMap[e.source], t = nodeMap[e.target];
      if (!s || !t) return;
      var isHl = highlighted && (e.source === highlighted || e.target === highlighted);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = isHl ? 'rgba(91, 76, 255, 0.5)' : 'rgba(91, 76, 255, 0.1)';
      ctx.lineWidth = isHl ? 2 : 1;
      ctx.stroke();
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});

    // Draw nodes
    var self = this;
    this.nodes.forEach(function(n) {
      var r = 14;
      var color = NODE_COLORS[n.type] || '#B8B8D1';
      var isHl = highlighted === n.id;
      var isNeighbor = hlNeighbors.indexOf(n.id) >= 0;
      var dimmed = highlighted && !isHl && !isNeighbor;

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? '#E0E0E0' : color;
      ctx.fill();
      ctx.strokeStyle = isHl ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
      ctx.lineWidth = isHl ? 3 : 2;
      ctx.stroke();

      if (isHl) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(91, 76, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = dimmed ? '#CCC' : '#0A0F1A';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label.substring(0, 8), n.x, n.y + r + 14);
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});

    ctx.restore();
  },

  // ===== Touch Interactions =====
  onTouchStart: function(e) {
    var touch = e.touches[0];
    var x = (touch.x - this.offsetX) / this.scale;
    var y = (touch.y - this.offsetY) / this.scale;
    var self = this;

    // Find tapped node
    var tapped = null;
    this.nodes.forEach(function(n) {
      var dx = x - n.x, dy = y - n.y;
      if (dx * dx + dy * dy < 400) tapped = n;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});

    if (tapped) {
      // Double-tap detection
      var now = Date.now();
      if (this.lastTapNode === tapped.id && now - this.lastTapTime < 300) {
        // Double-tap: navigate to note
        if (tapped.refId) {
          wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + tapped.refId 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
        this.lastTapTime = 0;
        return;
      }
      this.lastTapTime = now;
      this.lastTapNode = tapped.id;

      // Single tap: highlight
      if (this.highlightedNode === tapped.id) {
        this.highlightedNode = null;
        this.setData({ selectedNode: null, neighborNodes: [] 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      } else {
        this.highlightedNode = tapped.id;
        // Load neighbor details
        var neighborNodes = [];
        (tapped.neighbors || []).forEach(function(nid) {
          for (var i = 0; i < self.nodes.length; i++) {
            if (self.nodes[i].id === nid) {
              neighborNodes.push(self.nodes[i]);
              break;
            }
          }
        

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        this.setData({ selectedNode: tapped, neighborNodes: neighborNodes.slice(0, 6) 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      }

      // Start drag
      tapped.fixed = true;
      this.dragging = tapped;
      this._dragStartX = x;
      this._dragStartY = y;
    } else {
      // Tap on canvas: start panning
      this.highlightedNode = null;
      this.setData({ selectedNode: null, neighborNodes: [] 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      this._panStartX = touch.x;
      this._panStartY = touch.y;
      this._panOffsetX = this.offsetX;
      this._panOffsetY = this.offsetY;
    }
  },

  onTouchMove: function(e) {
    var touch = e.touches[0];
    if (this.dragging) {
      var x = (touch.x - this.offsetX) / this.scale;
      var y = (touch.y - this.offsetY) / this.scale;
      this.dragging.x = x;
      this.dragging.y = y;
    } else if (this._panStartX !== undefined) {
      this.offsetX = this._panOffsetX + (touch.x - this._panStartX);
      this.offsetY = this._panOffsetY + (touch.y - this._panStartY);
    }
  },

  onTouchEnd: function() {
    if (this.dragging) {
      this.dragging.fixed = false;
      this.dragging = null;
    }
    this._panStartX = undefined;
    this._panStartY = undefined;
  },

  // Pinch zoom
  onCanvasTouchStart: function(e) {
    if (e.touches.length === 2) {
      var dx = e.touches[1].x - e.touches[0].x;
      var dy = e.touches[1].y - e.touches[0].y;
      this._pinchDist = Math.sqrt(dx * dx + dy * dy);
      this._pinchScale = this.scale;
    }
  },

  onCanvasTouchMove: function(e) {
    if (e.touches.length === 2 && this._pinchDist) {
      var dx = e.touches[1].x - e.touches[0].x;
      var dy = e.touches[1].y - e.touches[0].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this.scale = Math.max(0.3, Math.min(3, this._pinchScale * (dist / this._pinchDist)));
    }
  },

  // ===== Search =====
  toggleSearch: function() {
    this.setData({ showSearch: !this.data.showSearch, searchResults: [], searchQuery: '' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  onSearchInput: function(e) {
    var q = e.detail.value;
    this.setData({ searchQuery: q 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    if (q.trim()) {
      var results = graphQuery.searchNodes(q).slice(0, 10);
      this.setData({ searchResults: results 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } else {
      this.setData({ searchResults: [] 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  onSearchResultTap: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var node = null;
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].id === nodeId) { node = this.nodes[i]; break; }
    }
    if (node) {
      // Center on node
      this.offsetX = this.canvasW / 2 - node.x * this.scale;
      this.offsetY = this.canvasH / 2 - node.y * this.scale;
      this.highlightedNode = nodeId;
      this.setData({ selectedNode: node, showSearch: false 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  // ===== Navigation =====
  onNodeDetail: function() {
    var node = this.data.selectedNode;
    if (node && node.refId) {
      wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + node.refId 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  onNeighborTap: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var node = null;
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].id === nodeId) { node = this.nodes[i]; break; }
    }
    if (node) {
      this.offsetX = this.canvasW / 2 - node.x * this.scale;
      this.offsetY = this.canvasH / 2 - node.y * this.scale;
      this.highlightedNode = nodeId;
      var neighborNodes = [];
      var self = this;
      (node.neighbors || []).forEach(function(nid) {
        for (var i = 0; i < self.nodes.length; i++) {
          if (self.nodes[i].id === nid) { neighborNodes.push(self.nodes[i]); break; }
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      this.setData({ selectedNode: node, neighborNodes: neighborNodes.slice(0, 6) 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },



  // ===== Zoom Controls =====
  onZoomIn: function() {
    this.scale = Math.min(3, this.scale * 1.2);
  },

  onZoomOut: function() {
    this.scale = Math.max(0.3, this.scale / 1.2);
  },

  onResetView: function() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.highlightedNode = null;
    this.setData({ selectedNode: null, neighborNodes: [] 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  onFitAll: function() {
    if (this.nodes.length === 0) return;
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.nodes.forEach(function(n) {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var graphW = maxX - minX + 80;
    var graphH = maxY - minY + 80;
    this.scale = Math.min(this.canvasW / graphW, this.canvasH / graphH, 2);
    var cx = (minX + maxX) / 2;
    var cy = (minY + maxY) / 2;
    this.offsetX = this.canvasW / 2 - cx * this.scale;
    this.offsetY = this.canvasH / 2 - cy * this.scale;
  },

  onBack: function() {
    if (this.animFrame) this.canvas.cancelAnimationFrame(this.animFrame);
    wx.navigateBack();
  },

  onUnload: function() {
    if (this.animFrame) this.canvas.cancelAnimationFrame(this.animFrame);
  }


  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
        }
      

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' 

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var edges = Object.values(graph.edges || {

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    

  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
  }



  onExportGraph: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['导出 JSON (剪贴板)', '图谱统计'],
      success: function(res) {
        if (res.tapIndex === 0) {
          self.exportJSON();
        } else if (res.tapIndex === 1) {
          self.showStats();
        }
      }
    });
  },

  exportJSON: function() {
    try {
      var graphStore = require('../../core/graph/graph-store');
      var graph = graphStore.loadGraph();
      var nodes = Object.values(graph.nodes || {});
      var edges = Object.values(graph.edges || {});
      var exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes,
        edges: edges
      };
      var json = JSON.stringify(exportData, null, 2);
      wx.setClipboardData({
        data: json,
        success: function() {
          wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  showStats: function() {
    var graphStore = require('../../core/graph/graph-store');
    var graph = graphStore.loadGraph();
    var nodes = Object.values(graph.nodes || {});
    var edges = Object.values(graph.edges || {});
    var typeCount = {};
    nodes.forEach(function(n) {
      var t = n.type || 'unknown';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    var typeStr = Object.keys(typeCount).map(function(t) {
      return t + ': ' + typeCount[t];
    }).join(', ');
    wx.showModal({
      title: '图谱统计',
      content: '节点: ' + nodes.length + '\n边: ' + edges.length + '\n类型: ' + typeStr,
      showCancel: false
    });
  }

});
