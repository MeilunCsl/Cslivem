var ingestionService = require('../../core/knowledge/ingestion-service');

Page({
  data: {
    conversationId: '',
    preview: { nodes: [], edges: [], ingested: false },
    loading: true
  },

  onLoad: function(options) {
    if (options && options.id) {
      this.setData({ conversationId: options.id });
      this.loadPreview(options.id);
    }
  },

  loadPreview: function(id) {
    var preview = ingestionService.getIngestPreview(id);
    this.setData({ preview: preview, loading: false });
  },

  onConfirm: function() {
    var self = this;
    var result = ingestionService.ingestConversation(self.data.conversationId);
    if (result.success) {
      wx.showToast({ title: 'Ingested ' + result.entityCount + ' entities', icon: 'success' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
    } else {
      wx.showToast({ title: result.error, icon: 'none' });
    }
  },

  onBack: function() { wx.navigateBack(); }
});
