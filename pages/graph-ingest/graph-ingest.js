// pages/graph-ingest/graph-ingest.js
var ingestionService = require('../../core/knowledge/ingestion-service');

Page({
  data: {
    conversationId: '',
    preview: { nodes: [], edges: [], ingested: false },
    loading: true,
    selectedCount: 0
  },

  onLoad: function (options) {
    if (options && options.id) {
      this.setData({ conversationId: options.id });
      this.loadPreview(options.id);
    } else {
      this.setData({ loading: false });
    }
  },

  loadPreview: function (id) {
    var self = this;
    self.setData({ loading: true });
    try {
      var preview = ingestionService.getIngestPreview(id);
      // Mark all nodes as selected by default
      preview.nodes.forEach(function (node) { node.selected = true; });
      self.setData({
        preview: preview,
        loading: false,
        selectedCount: preview.nodes.length
      });
    } catch (err) {
      console.error('[GraphIngest] preview error:', err);
      self.setData({ loading: false });
    }
  },

  toggleNode: function (e) {
    var index = e.currentTarget.dataset.index;
    var preview = this.data.preview;
    if (preview.nodes[index]) {
      preview.nodes[index].selected = !preview.nodes[index].selected;
    }
    var selectedCount = preview.nodes.filter(function (n) { return n.selected; }).length;
    this.setData({ preview: preview, selectedCount: selectedCount });
  },

  onConfirm: function () {
    var self = this;
    if (self.data.selectedCount === 0) return;
    wx.showLoading({ title: '入库中...' });
    try {
      var result = ingestionService.ingestConversation(self.data.conversationId);
      wx.hideLoading();
      if (result.success) {
        wx.showToast({ title: '已入库 ' + result.nodeCount + ' 个节点', icon: 'success' });
        self.loadPreview(self.data.conversationId);
      } else {
        wx.showToast({ title: result.error || '入库失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '入库失败', icon: 'none' });
    }
  },

  onBack: function () {
    wx.navigateBack({ fail: function () { wx.switchTab({ url: '/pages/home/home' }); } });
  }
});
