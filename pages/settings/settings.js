// pages/settings/settings.js
var apiConfig = require('../../miniprogram/api-config');
var ecsAdapter = require('../../miniprogram/ecs-adapter');
var graphEngine = require('../../core/graph/graph-engine');
var localStorage = require('../../core/storage/local-storage');

Page({
  data: {
    ready: false,
    statusBarHeight: 20,

    // AI Provider
    activeProvider: 'mimo',
    providers: [
      { id: 'mimo', name: 'MiMo (本地)', desc: '小米 MiMo 本地模型' },
      { id: 'ecs', name: 'ECS 服务端', desc: '阿里云 / 自建服务端' }
    ],

    // MiMo Config
    mimoEnabled: true,
    mimoEndpoint: 'http://127.0.0.1:11434/v1/chat/completions',
    mimoApiKey: '',
    mimoModel: 'mimo',

    // ECS Config
    ecsEnabled: false,
    ecsEndpoint: '',
    ecsApiKey: '',
    ecsModel: '',

    // Sync Status
    syncStatus: {
      available: false,
      pending: 0,
      failed: 0,
      lastSyncAt: null,
      version: 0
    },

    // Data Stats
    dataStats: {
      graphNodes: 0,
      graphEdges: 0,
      notes: 0,
      storageUsed: '0 KB'
    },

    // Export/Import
    exportPreview: null,
    showExportModal: false,
    showImportModal: false,
    importJson: '',

    // Testing
    testingConnection: false,
    testResult: ''
  },

  onLoad: function() {
    try {
      var sys = wx.getSystemInfoSync();
      this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    } catch (e) {}
    try { this.loadConfig(); } catch (e) { console.warn('[Settings] loadConfig error:', e); }
    try { this.loadStats(); } catch (e) { console.warn('[Settings] loadStats error:', e); }
    try { this.loadSyncStatus(); } catch (e) { console.warn('[Settings] loadSyncStatus error:', e); }
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    this.loadSyncStatus();
  },

  loadConfig: function() {
    var config = apiConfig.getConfig();
    this.setData({
      activeProvider: config.activeProvider || 'mimo',
      mimoEnabled: config.mimo.enabled,
      mimoEndpoint: config.mimo.endpoint,
      mimoApiKey: config.mimo.apiKey || '',
      mimoModel: config.mimo.model,
      ecsEnabled: config.ecs.enabled,
      ecsEndpoint: config.ecs.endpoint || '',
      ecsApiKey: config.ecs.apiKey || '',
      ecsModel: config.ecs.model || ''
    });
  },

  loadStats: function() {
    try {
      var stats = graphEngine.getStats();
      var info = localStorage.getInfo();
      var notes = localStorage.getJSON('core_notes', []);
      this.setData({
        dataStats: {
          graphNodes: stats.nodeCount,
          graphEdges: stats.edgeCount,
          notes: notes.length,
          storageUsed: (info.currentSize || 0) + ' KB'
        }
      });
    } catch (e) {
      console.warn('[Settings] loadStats error:', e);
    }
  },

  loadSyncStatus: function() {
    var status = ecsAdapter.getStatus();
    this.setData({ syncStatus: status });
  },

  // ===== Provider Switch =====
  onProviderChange: function(e) {
    var provider = e.currentTarget.dataset.provider;
    this.setData({ activeProvider: provider });
    apiConfig.updateProvider('active', { activeProvider: provider });
    // Actually save the activeProvider
    var config = apiConfig.getConfig();
    config.activeProvider = provider;
    apiConfig.saveConfig(config);
    wx.showToast({ title: '已切换到 ' + provider, icon: 'none' });
  },

  // ===== MiMo Config =====
  onMimoEnabledChange: function(e) {
    var enabled = e.detail.value;
    this.setData({ mimoEnabled: enabled });
    apiConfig.updateProvider('mimo', { enabled: enabled });
  },

  onMimoEndpointInput: function(e) {
    this.setData({ mimoEndpoint: e.detail.value });
  },

  onMimoEndpointSave: function() {
    apiConfig.updateProvider('mimo', { endpoint: this.data.mimoEndpoint });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onMimoApiKeyInput: function(e) {
    this.setData({ mimoApiKey: e.detail.value });
  },

  onMimoApiKeySave: function() {
    apiConfig.updateProvider('mimo', { apiKey: this.data.mimoApiKey });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onMimoModelInput: function(e) {
    this.setData({ mimoModel: e.detail.value });
  },

  onMimoModelSave: function() {
    apiConfig.updateProvider('mimo', { model: this.data.mimoModel });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  // ===== ECS Config =====
  onEcsEnabledChange: function(e) {
    var enabled = e.detail.value;
    this.setData({ ecsEnabled: enabled });
    apiConfig.updateProvider('ecs', { enabled: enabled });
  },

  onEcsEndpointInput: function(e) {
    this.setData({ ecsEndpoint: e.detail.value });
  },

  onEcsEndpointSave: function() {
    apiConfig.updateProvider('ecs', { endpoint: this.data.ecsEndpoint });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onEcsApiKeyInput: function(e) {
    this.setData({ ecsApiKey: e.detail.value });
  },

  onEcsApiKeySave: function() {
    apiConfig.updateProvider('ecs', { apiKey: this.data.ecsApiKey });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onEcsModelInput: function(e) {
    this.setData({ ecsModel: e.detail.value });
  },

  onEcsModelSave: function() {
    apiConfig.updateProvider('ecs', { model: this.data.ecsModel });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  // ===== Test Connection =====
  onTestConnection: function() {
    var self = this;
    self.setData({ testingConnection: true, testResult: '' });
    var gateway = require('../../miniprogram/ai-gateway');
    gateway.ask('你好', '测试连接').then(function(result) {
      self.setData({
        testingConnection: false,
        testResult: '连接成功 (' + result.mode + '): ' + result.content.substring(0, 50)
      });
    }).catch(function(err) {
      self.setData({
        testingConnection: false,
        testResult: '连接失败: ' + err.message
      });
    });
  },

  // ===== Sync Actions =====
  onSync: function() {
    var self = this;
    wx.showLoading({ title: '同步中...' });
    ecsAdapter.sync().then(function(result) {
      wx.hideLoading();
      self.loadSyncStatus();
      wx.showToast({
        title: result.mode === 'offline' ? '未配置ECS' : '同步完成',
        icon: result.mode === 'offline' ? 'none' : 'success'
      });
    }).catch(function(err) {
      wx.hideLoading();
      wx.showToast({ title: '同步失败: ' + err.message, icon: 'none' });
    });
  },

  onRetryFailed: function() {
    var count = ecsAdapter.retryFailed();
    this.loadSyncStatus();
    wx.showToast({ title: '已重试 ' + count + ' 条', icon: 'none' });
  },

  onClearQueue: function() {
    var self = this;
    wx.showModal({
      title: '已同步',
      content: '确定清空所有待同步操作？',
      success: function(res) {
        if (res.confirm) {
          ecsAdapter.clearQueue();
          self.loadSyncStatus();
          wx.showToast({ title: '已保存', icon: 'success' });
        }
      }
    });
  },

  // ===== Export =====
  onExport: function() {
    var preview = ecsAdapter.getPackagePreview();
    this.setData({ exportPreview: preview, showExportModal: true });
  },

  onExportConfirm: function() {
    var self = this;
    var jsonStr = ecsAdapter.exportData();
    wx.setClipboardData({
      data: jsonStr,
      success: function() {
        self.setData({ showExportModal: false });
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  onExportClose: function() {
    this.setData({ showExportModal: false });
  },

  // ===== Import =====
  onImport: function() {
    this.setData({ showImportModal: true, importJson: '' });
  },

  onImportJsonInput: function(e) {
    this.setData({ importJson: e.detail.value });
  },

  onImportFromClipboard: function() {
    var self = this;
    wx.getClipboardData({
      success: function(res) {
        if (res.data) {
          self.setData({ importJson: res.data });
          wx.showToast({ title: '已保存', icon: 'success' });
        }
      }
    });
  },

  onImportConfirm: function() {
    var self = this;
    var jsonStr = this.data.importJson.trim();
    if (!jsonStr) {
      wx.showToast({ title: '请输入JSON数据', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '已同步',
      content: '导入将合并到现有数据，确定继续？',
      success: function(res) {
        if (res.confirm) {
          var result = ecsAdapter.importData(jsonStr);
          if (result.success) {
            self.setData({ showImportModal: false });
            self.loadStats();
            wx.showToast({ title: '已同步', icon: 'success' });
          } else {
            wx.showToast({ title: '导入失败: ' + result.error, icon: 'none' });
          }
        }
      }
    });
  },

  onImportClose: function() {
    this.setData({ showImportModal: false });
  },

  // ===== Reset =====
  onResetGraph: function() {
    var self = this;
    wx.showModal({
      title: '清空队列',
      content: '此操作不可恢复，确定清空所有节点和边？',
      success: function(res) {
        if (res.confirm) {
          graphEngine.resetGraph();
          self.loadStats();
          wx.showToast({ title: '已保存', icon: 'success' });
        }
      }
    });
  }
});
