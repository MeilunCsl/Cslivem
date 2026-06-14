// pages/about/about.js
var localStorage = require('../../core/storage/local-storage');
var keys = require('../../core/storage/storage-keys');
var toolRegistry = require('../../miniprogram/tool-registry');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    version: 'v2.1.0',
    buildDate: '2026-06-14',
    stats: {
      modules: 0,
      pages: 27,
      graphNodes: 0,
      graphEdges: 0,
      notes: 0,
      conversations: 0,
      storageSize: '0 KB'
    }
  },

  onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    this.loadStats();
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  loadStats: function() {
    try {
      var modules = toolRegistry.getAll();
      var graph = localStorage.getJSON(keys.GRAPH, { nodes: {}, edges: {} });
      var notes = localStorage.getJSON(keys.NOTES, []);
      var convs = localStorage.getJSON('csl_conversations', []);

      var storageInfo = wx.getStorageInfoSync();
      var sizeKB = storageInfo.currentSize || 0;
      var sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';

      this.setData({
        stats: {
          modules: modules.length,
          pages: 27,
          graphNodes: Object.keys(graph.nodes || {}).length,
          graphEdges: Object.keys(graph.edges || {}).length,
          notes: notes.length,
          conversations: convs.length,
          storageSize: sizeStr
        }
      });
    } catch (e) {
      console.warn('[About] loadStats error:', e);
    }
  },

  onCopyVersion: function() {
    wx.setClipboardData({
      data: 'Cslivem ' + this.data.version + ' (' + this.data.buildDate + ')',
      success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  onClearCache: function() {
    var self = this;
    wx.showModal({
      title: '清理缓存',
      content: '将清理临时数据，不影响笔记和图谱。',
      success: function(res) {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            wx.showToast({ title: '已清理', icon: 'success' });
            self.loadStats();
          } catch (e) {
            wx.showToast({ title: '清理失败', icon: 'none' });
          }
        }
      }
    });
  },

  onGoStats: function() {
    wx.navigateTo({ url: '/pages/stats/stats' });
  },

  onFeedback: function() {
    wx.setClipboardData({
      data: 'https://github.com/MeilunCsl/Cslivem/issues',
      success: function() { wx.showToast({ title: '链接已复制', icon: 'success' }); }
    });
  }
});
