// pages/search/search.js
var noteModule = require('../../modules/note/public');
var calendarModule = require('../../modules/calendar/public');
var ledgerModule = require('../../modules/ledger/public');
var habitModule = require('../../modules/habit/public');
var fcModule = require('../../modules/flashcard/public');
var foodModule = require('../../modules/food/public');
var cdModule = require('../../modules/countdown/public');
var convStore = require('../../core/conversation/store');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    query: '',
    results: [],
    searched: false,
    hotKeys: ['笔记', '习惯', '闪卡', '饮食', '心情']
  },

  onLoad: function(options) {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
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


    // Search habits
    try {
      var habits = habitModule.getHabits();
      habits.forEach(function(h) {
        if (h.name && h.name.toLowerCase().indexOf(qLower) >= 0) {
          results.push({ type: 'habit', icon: h.icon, title: h.name, subtitle: '习惯', id: h.id, url: '/pages/habit/habit' });
        }
      });
    } catch (e) {}

    // Search flashcard decks
    try {
      var decks = fcModule.getDecks();
      decks.forEach(function(d) {
        if (d.name && d.name.toLowerCase().indexOf(qLower) >= 0) {
          results.push({ type: 'flashcard', icon: '◆', title: d.name, subtitle: d.cardCount + ' 张', id: d.id, url: '/pages/flashcard/flashcard' });
        }
      });
    } catch (e) {}

    // Search food records
    try {
      var today = new Date().toISOString().substring(0, 10);
      var foodRecords = foodModule.getByDate(today);
      foodRecords.forEach(function(r) {
        if (r.name && r.name.toLowerCase().indexOf(qLower) >= 0) {
          results.push({ type: 'food', icon: '◈', title: r.name, subtitle: r.calories + '卡', id: r.id, url: '/pages/food/food' });
        }
      });
    } catch (e) {}

    // Search countdowns
    try {
      var countdowns = cdModule.getAll();
      countdowns.forEach(function(c) {
        if (c.title && c.title.toLowerCase().indexOf(qLower) >= 0) {
          results.push({ type: 'countdown', icon: c.icon, title: c.title, subtitle: c.date, id: c.id, url: '/pages/countdown/countdown' });
        }
      });
    } catch (e) {}

    // Search conversations
    try {
      var convs = convStore.getRecentConversations(50);
      convs.forEach(function(c) {
        if ((c.title || '').toLowerCase().indexOf(qLower) >= 0) {
          results.push({ type: 'conversation', icon: '○', title: c.title || '新对话', subtitle: (c.summary || '').substring(0, 40), id: c.id, url: '/pages/chat/chat?id=' + c.id });
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
