var ingestionService = require('../../core/knowledge/ingestion-service');
var graphStore = require('../../core/graph/graph-store');

Page({
  data: {
    conversationId: '',
    preview: { nodes: [], edges: [], ingested: false },
    loading: true,
    selectedCount: 0
  },

  onLoad: function(options) {
    if (options && options.id) {
      this.setData({ conversationId: options.id });
      this.loadPreview(options.id);
    }
  },

  loadPreview: function(id) {
    var self = this;
    var preview = ingestionService.getIngestPreview(id);
    
    // Check for duplicates
    var existingNodes = graphStore.getAllNodes ? graphStore.getAllNodes() : [];
    preview.nodes.forEach(function(node) {
      node.selected = true;
      node.isDuplicate = existingNodes.some(function(existing) {
        return existing.label === node.label && existing.type === node.type;
      });
    });
    
    var selectedCount = preview.nodes.filter(function(n) { return n.selected; }).length;
    self.setData({ preview: preview, loading: false, selectedCount: selectedCount });
  },

  toggleNode: function(e) {
    var index = e.currentTarget.dataset.index;
    var nodes = this.data.preview.nodes;
    nodes[index].selected = !nodes[index].selected;
    var selectedCount = nodes.filter(function(n) { return n.selected; }).length;
    this.setData({ 'preview.nodes': nodes, selectedCount: selectedCount });
  },

  onConfirm: function() {
    var self = this;
    if (self.data.selectedCount === 0) return;
    
    wx.showModal({
      title: '确认入库',
      content: '将入库 ' + self.data.selectedCount + ' 个节点？',
      success: function(res) {
        if (res.confirm) {
          var selectedNodes = self.data.preview.nodes.filter(function(n) { return n.selected; });
          var result = ingestionService.ingestConversation(self.data.conversationId, {
            nodes: selectedNodes
          });
          if (result.success) {
            self.setData({ 'preview.ingested': true });
            wx.showToast({ title: '入库成功', icon: 'success' });
            setTimeout(function() { wx.navigateBack(); }, 1500);
          } else {
            wx.showToast({ title: result.error || '入库失败', icon: 'none' });
          }
        }
      }
    });
  },

  onBack: function() { wx.navigateBack(); }
});
