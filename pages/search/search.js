// pages/search/search.js
var noteModule = require('../../modules/note/public');
var calendarModule = require('../../modules/calendar/public');
var ledgerModule = require('../../modules/ledger/public');

Page({
  data: {
    statusBarHeight: 20,
    query: '',
    results: [],
    searched: false,
    hotKeys: ['笔记', '今日', '收支', '支出', '收藏']
  },

  onLoad: function(options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    if (options && options.query) {
      var q = decodeURIComponent(options.query);
      this.setData({ query: q });
      var self = this;
      setTimeout(function() { self.onSearch(); }, 100);
    }
  },

  onInput: function(e) {
    this.setData({ query: e.detail.value });
  },

  onSearch: function() {
    var q = this.data.query.trim();
    if (!q) return;
    var results = [];
    var qLower = q.toLowerCase();

    // Search notes
    try {
      var notes = noteModule.searchNotes(q);
      notes.forEach(function(n) {
        results.push({
          type: 'note',
          icon: '📝',
          title: n.title || '未命名笔记',
          subtitle: (n.summary || '').substring(0, 60),
          id: n.id,
          url: '/pages/note-detail/note-detail?id=' + n.id
        });
      });
    } catch (e) {}

    // Search calendar events
    try {
      var now = new Date();
      var events = calendarModule.getMonthEvents(now.getFullYear(), now.getMonth() + 1);
      events.forEach(function(ev) {
        if (ev.title && ev.title.toLowerCase().indexOf(qLower) >= 0) {
          results.push({
            type: 'event',
            icon: '📅',
            title: ev.title,
            subtitle: ev.date + (ev.time ? ' ' + ev.time : ''),
            id: ev.id,
            url: '/pages/calendar/calendar'
          });
        }
      });
    } catch (e) {}

    // Search ledger transactions
    try {
      var txs = ledgerModule.getRecentTransactions(100);
      txs.forEach(function(tx) {
        var cats = ledgerModule.getCategories();
        var catMap = {};
        cats.forEach(function(c) { catMap[c.id] = c; });
        var catName = catMap[tx.categoryId] ? catMap[tx.categoryId].name : '';
        var searchText = (catName + ' ' + (tx.note || '') + ' ' + (tx.merchant || '')).toLowerCase();
        if (searchText.indexOf(qLower) >= 0) {
          var prefix = tx.type === 'income' ? '+' : '-';
          results.push({
            type: 'ledger',
            icon: tx.type === 'income' ? '💸' : '💳',
            title: catName || '未分类',
            subtitle: tx.date + ' ' + prefix + (tx.amountMinor / 100).toFixed(2),
            id: tx.id,
            url: '/pages/ledger/ledger'
          });
        }
      });
    } catch (e) {}

    this.setData({ results: results, searched: true });
    wx.vibrateShort({ type: 'light' }).catch(function() {});
  },

  onHotKey: function(e) {
    this.setData({ query: e.currentTarget.dataset.key });
    this.onSearch();
  },

  onResultTap: function(e) {
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url: url });
    }
  },

  onClear: function() {
    this.setData({ query: '', results: [], searched: false });
  },

  onBack: function() {
    wx.navigateBack();
  }
});
