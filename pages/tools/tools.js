// pages/tools/tools.js
var toolRegistry = require('../../miniprogram/tool-registry');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    tools: [],
    comingSoon: [
      { id: 'habit', icon: '✓', name: '习惯' },
      { id: 'pomodoro', icon: '◴', name: '番茄钟' },
      { id: 'watermark', icon: '☀', name: '去水印' },
      { id: 'translate', icon: '🌐', name: '翻译' },
      { id: 'weather', icon: '⛅', name: '天气' },
      { id: 'calculator', icon: '🖩', name: '计算器' }
    ]
  },

  onLoad: function() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.loadTools();
  },

  loadTools: function() {
    // Load storage stats
    var convStore = require('../../core/conversation/store');
    var assetStore = require('../../core/assets/local-asset-store');
    var convStats = convStore.getStats();
    var assetStats = assetStore.getStats();
    this.setData({
      storageInfo: {
        conversations: convStats.conversations,
        messages: convStats.messages,
        assets: assetStats.count,
        storageKB: convStats.storageKB || 0
      }
    });

    var all = toolRegistry.getEnabled();
    var tools = all.map(function(t) {
      return {
        id: t.id,
        icon: t.icon || '◻',
        name: t.name,
        description: t.description || ''
      };
    });
    this.setData({ tools: tools });
  },

  onSettingsTap: function() {
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onToolTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.vibrateShort({ type: 'light' }).catch(function() {});
    var routes = {
      'knowledge': '/pages/graph-view/graph-view',
      'note': '/pages/note-editor/note-editor',
      'calendar': '/pages/calendar/calendar',
      'ledger': '/pages/ledger/ledger',
      'tool-pdf': '/pages/pdf/pdf',
      'tool-ocr': '/pages/ocr/ocr',
      'tool-scanner': '/pages/tools/tools'
    };
    if (routes[id]) {
      wx.navigateTo({ url: routes[id] });
    } else {
      wx.showToast({ title: '工具详情（开发中）', icon: 'none' });
    }
  }
});
