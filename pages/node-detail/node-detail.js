// pages/node-detail/node-detail.js
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var noteService = require('../../core/notes/note-service');

var NODE_COLORS = {
  note: '#5B4CFF', tag: '#3A7BFF', concept: '#00D4D9',
  entity: '#F59E0B', question: '#FF6B6B', source: '#96CEB4'
};

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    nodeId: '',
    node: {},
    nodeColor: '#5B4CFF',
    neighbors: [],
    relatedNotes: []
  },

  onLoad: function (options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) { /* ignore */ }
    if (options.id) {
      this.setData({ nodeId: options.id });
      this.loadNode(options.id);
    }
    var self = this;
    setTimeout(function () { self.setData({ ready: true }); }, 100);
  },

  loadNode: function (id) {
    var node = graphEngine.getNode(id);
    if (!node) {
      wx.showToast({ title: '节点不存在', icon: 'none' });
      return;
    }
    var color = NODE_COLORS[node.type] || NODE_COLORS.note;
    var metadataDesc = '';
    if (node.metadata) {
      var parts = [];
      Object.keys(node.metadata).forEach(function (k) {
        if (k !== 'description') parts.push(k + ': ' + node.metadata[k]);
      });
      metadataDesc = parts.join(' | ');
    }
    this.setData({
      node: {
        id: node.id,
        label: node.label,
        type: node.type,
        refId: node.refId || '',
        createdAt: node.createdAt,
        createdAtFormatted: this.formatDate(node.createdAt),
        metadataDesc: metadataDesc
      },
      nodeColor: color
    });
    this.loadNeighbors(id);
    this.loadRelatedNotes(id);
  },

  loadNeighbors: function (id) {
    var neighbors = graphEngine.getNeighbors(id);
    this.setData({
      neighbors: neighbors.map(function (item) {
        var n = item.node;
        var edgeType = item.edges.length > 0 ? item.edges[0].type : '';
        return {
          id: n.id,
          label: n.label,
          type: n.type,
          color: NODE_COLORS[n.type] || NODE_COLORS.note,
          edgeType: edgeType
        };
      })
    });
  },

  loadRelatedNotes: function (id) {
    // If this node is referenced by notes, show them
    var node = graphEngine.getNode(id);
    if (!node) return;
    var notes = [];
    if (node.type === 'tag') {
      notes = noteService.listNotes({ tags: [node.label], limit: 10 });
    } else if (node.refId) {
      var note = noteService.getNote(node.refId);
      if (note) notes = [note];
    }
    this.setData({
      relatedNotes: notes.map(function (n) {
        return {
          id: n.id,
          title: n.title || '无标题',
          summary: (n.content || '').substring(0, 80)
        };
      })
    });
  },

  formatDate: function (iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    } catch (e) { return ''; }
  },

  goBack: function () {
    wx.navigateBack({ fail: function () { wx.switchTab({ url: '/pages/home/home' }); } });
  },

  onMore: function () {
    var self = this;
    wx.showActionSheet({
      itemList: ['复制节点 ID', '查看图谱', '删除节点'],
      success: function (res) {
        if (res.tapIndex === 0) {
          wx.setClipboardData({ data: self.data.nodeId });
        } else if (res.tapIndex === 1) {
          self.onViewInGraph();
        } else if (res.tapIndex === 2) {
          self.onDeleteNode();
        }
      }
    });
  },

  onNeighborTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: '/pages/node-detail/node-detail?id=' + id });
  },

  onNoteTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/note-editor/note-editor?id=' + id });
  },

  onViewInGraph: function () {
    wx.navigateTo({ url: '/pages/graph-view/graph-view?focus=' + this.data.nodeId });
  },

  onDeleteNode: function () {
    var self = this;
    wx.showModal({
      title: '删除节点',
      content: '确认删除节点「' + self.data.node.label + '」？相关关系也会被删除。',
      success: function (res) {
        if (res.confirm) {
          graphEngine.deleteNode(self.data.nodeId);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(function () { wx.navigateBack(); }, 500);
        }
      }
    });
  }
});
