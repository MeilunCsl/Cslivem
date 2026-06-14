// pages/stats/stats.js
var noteModule = require('../../modules/note/public');
var todoModule = require('../../modules/todo/public');
var habitModule = require('../../modules/habit/public');
var fcModule = require('../../modules/flashcard/public');
var moodModule = require('../../modules/mood/public');
var foodModule = require('../../modules/food/public');
var ledgerModule = require('../../modules/ledger/public');
var convStore = require('../../core/conversation/store');
var graphStore = require('../../core/graph/graph-store');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    stats: {}
  },

  onLoad: function() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch (e) {}
    this.loadStats();
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  loadStats: function() {
    try {
      var notes = noteModule.getRecentNotes(1000);
      var todoStats = todoModule.getStats();
      var habitStats = habitModule.getStats();
      var fcStats = fcModule.getStats();
      var moodRecords = moodModule.getAll ? moodModule.getAll() : [];
      var foodSummary = foodModule.getTodaySummary();
      var convStats = convStore.getStats();
      var graph = graphStore.loadGraph();
      var graphNodes = Object.keys(graph.nodes || {}).length;
      var graphEdges = Object.keys(graph.edges || {}).length;
      var storageInfo = wx.getStorageInfoSync();
      var sizeKB = storageInfo.currentSize || 0;
      var sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';

      this.setData({
        stats: {
          notesTotal: notes.length,
          notesWeek: notes.filter(function(n) { return n.createdAt && Date.now() - new Date(n.createdAt).getTime() < 604800000; }).length,
          todoTotal: todoStats.total,
          todoPending: todoStats.pending,
          todoCompleted: todoStats.completed,
          todoOverdue: todoStats.overdue,
          habitTotal: habitStats.totalHabits,
          habitDone: habitStats.todayDone,
          habitStreak: habitStats.longestStreak || 0,
          fcTotal: fcStats.totalCards || 0,
          fcDue: fcStats.dueNow || 0,
          fcReviewed: fcStats.todayReviews || 0,
          moodToday: moodModule.getToday ? (moodModule.getToday().mood || 0) : 0,
          foodCalories: foodSummary.totalCalories || 0,
          convTotal: convStats.conversations,
          convMessages: convStats.messages,
          graphNodes: graphNodes,
          graphEdges: graphEdges,
          storageUsed: sizeKB,
          storageTotal: storageInfo.limitSize || 10240,
          storageDisplay: sizeStr
        }
      });
    } catch (e) {
      console.warn('[Stats] error:', e);
    }
  },

  onRefresh: function() {
    this.loadStats();
    wx.showToast({ title: '已刷新', icon: 'success' });
  },

  onExportStats: function() {
    var s = this.data.stats;
    var text = 'Cslivem 数据统计\n' +
      '\n笔记: ' + s.notesTotal + ' (本周 ' + s.notesWeek + ')' +
      '\n待办: ' + s.todoTotal + ' (待办 ' + s.todoPending + ')' +
      '\n习惯: ' + s.habitTotal + ' (今天 ' + s.habitDone + ')' +
      '\n图谱: ' + s.graphNodes + '节点 ' + s.graphEdges + '边' +
      '\n存储: ' + s.storageDisplay;
    wx.setClipboardData({ data: text, success: function() { wx.showToast({ title: '已复制', icon: 'success' }); } });
  }
});
