// pages/notes/notes.js
var noteService = require('../../core/notes/note-service');
var graphEngine = require('../../core/graph/graph-engine');
var graphQuery = require('../../core/graph/graph-query');
var graphStore = require('../../core/graph/graph-store');

var NODE_COLORS = {
  note: '#5B4CFF', tag: '#3A7BFF', concept: '#00D4D9',
  entity: '#F59E0B', question: '#FF6B6B', source: '#96CEB4'
};

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    activeTab: 'notes',
    // Notes tab
    activeFilter: 'recent',
    inboxCount: 0,
    notes: [],
    pageSize: 20,
    currentPage: 1,
    hasMore: true,
    loadingMore: false,
    selectMode: false,
    selectedIds: [],
    filters: [
      { key: 'inbox', label: '收件箱' },
      { key: 'recent', label: '最近' },
      { key: 'all', label: '全部' },
      { key: 'fav', label: '收藏' },
      { key: 'tags', label: '标签' }
    ],
    // Tags tab
    allTags: [],
    // Graph tab
    graphNodeCount: 0,
    graphEdgeCount: 0,
    graphTypeStats: []
  },

  onLoad: function () {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) { /* ignore */ }
    this.loadNotes();
    this.loadGraphStats();
    var self = this;
    setTimeout(function () { self.setData({ ready: true }); }, 100);
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.loadNotes();
    this.loadGraphStats();
  },

  // ===== Tab Switching =====
  switchTab: function (e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'tags') this.loadAllTags();
    if (tab === 'graph') this.loadGraphStats();
  },

  // ===== Notes Tab =====
  setFilter: function (e) {
    var filter = e.currentTarget.dataset.filter;
    this.setData({ activeFilter: filter, currentPage: 1, hasMore: true });
    this.loadNotes();
  },

  loadNotes: function () {
    var self = this;
    var filter = self.data.activeFilter;
    var limit = self.data.pageSize;
    var offset = 0;
    var allNotes = noteService.listNotes({ limit: 200 });
    var filtered = allNotes.filter(function (n) { return !n.deletedAt; });
    // Apply filter
    if (filter === 'recent') {
      filtered.sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    } else if (filter === 'inbox') {
      filtered = filtered.filter(function (n) { return !n.tags || n.tags.length === 0; });
    } else if (filter === 'fav') {
      filtered = filtered.filter(function (n) { return n.tags && n.tags.indexOf('收藏') >= 0; });
    } else if (filter === 'tags') {
      filtered = filtered.filter(function (n) { return n.tags && n.tags.length > 0; });
    }
    var inboxCount = allNotes.filter(function (n) { return !n.deletedAt && (!n.tags || n.tags.length === 0); }).length;
    // Pagination
    var page = self.data.currentPage;
    var paged = filtered.slice(0, page * limit);
    var notes = paged.map(function (n) {
      return {
        id: n.id,
        title: n.title || '无标题',
        summary: n.summary || (n.content || '').substring(0, 80),
        content: n.content || '',
        tags: n.tags || [],
        timeAgo: self.formatTime(n.updatedAt)
      };
    });
    self.setData({
      notes: notes,
      inboxCount: inboxCount,
      hasMore: paged.length < filtered.length,
      loadingMore: false
    });
  },

  onScrollToLower: function () {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true, currentPage: this.data.currentPage + 1 });
    this.loadNotes();
  },

  formatTime: function (iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      var now = new Date();
      var diff = now - d;
      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
      if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
      if (diff < 172800000) return '昨天';
      return (d.getMonth() + 1) + '/' + d.getDate();
    } catch (e) { return ''; }
  },

  onTapNote: function (e) {
    if (this.data.selectMode) {
      this.onNoteSelect(e);
      return;
    }
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/note-editor/note-editor?id=' + id });
  },

  createNote: function () {
    wx.navigateTo({ url: '/pages/note-editor/note-editor' });
  },

  onSearchInput: function (e) {
    var q = (e.detail.value || '').trim();
    if (!q) {
      this.loadNotes();
      return;
    }
    var results = noteService.searchNotes(q);
    this.setData({
      notes: results.map(function (n) {
        return {
          id: n.id, title: n.title || '无标题',
          summary: n.summary || (n.content || '').substring(0, 80),
          content: n.content || '', tags: n.tags || [],
          timeAgo: ''
        };
      })
    });
  },

  // ===== Batch Operations =====
  onNoteLongPress: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      try { wx.vibrateShort({ type: 'medium' }); } catch (err) { /* ignore */ }
    }
  },

  onNoteSelect: function (e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) { selected.splice(idx, 1); } else { selected.push(id); }
    this.setData({ selectedIds: selected, selectMode: selected.length > 0 });
  },

  exitSelectMode: function () {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function () {
    var allIds = this.data.notes.map(function (n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function () {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function (res) {
        if (res.confirm) {
          self.data.selectedIds.forEach(function (id) { noteService.deleteNote(id); });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function () {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function (res) {
        if (res.confirm && res.content) {
          var tag = res.content.trim();
          self.data.selectedIds.forEach(function (id) {
            var note = noteService.getNote(id);
            if (note) {
              var tags = (note.tags || []).slice();
              if (tags.indexOf(tag) < 0) tags.push(tag);
              noteService.updateNote(id, { tags: tags });
            }
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function () {
    var self = this;
    var notes = self.data.selectedIds.map(function (id) { return noteService.getNote(id); }).filter(function (n) { return n; });
    var text = notes.map(function (n) {
      return '# ' + (n.title || '未命名') + '\n\n' + (n.content || '') + '\n\n---\n';
    }).join('\n');
    wx.setClipboardData({
      data: text,
      success: function () {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

  // ===== Tags Tab =====
  loadAllTags: function () {
    var tagNodes = graphQuery.getNodesByType('tag');
    var graph = graphStore.loadGraph();
    var tags = tagNodes.map(function (node) {
      var count = 0;
      Object.values(graph.edges || {}).forEach(function (e) {
        if (e.target === node.id || e.source === node.id) count++;
      });
      return { label: node.label, count: count };
    });
    tags.sort(function (a, b) { return b.count - a.count; });
    this.setData({ allTags: tags });
  },

  onTagTap: function (e) {
    var tag = e.currentTarget.dataset.tag;
    this.setData({ activeTab: 'notes', activeFilter: 'tags' });
    // Filter notes by tag
    var allNotes = noteService.listNotes({ limit: 200 });
    var filtered = allNotes.filter(function (n) {
      return !n.deletedAt && n.tags && n.tags.indexOf(tag) >= 0;
    });
    this.setData({
      notes: filtered.map(function (n) {
        return {
          id: n.id, title: n.title || '无标题',
          summary: n.summary || (n.content || '').substring(0, 80),
          content: n.content || '', tags: n.tags || [], timeAgo: ''
        };
      })
    });
  },

  // ===== Graph Tab =====
  loadGraphStats: function () {
    var stats = graphEngine.getStats();
    var typeStats = Object.keys(stats.nodeTypes || {}).map(function (type) {
      return { type: type, count: stats.nodeTypes[type], color: NODE_COLORS[type] || '#96CEB4' };
    });
    typeStats.sort(function (a, b) { return b.count - a.count; });
    this.setData({
      graphNodeCount: stats.nodeCount,
      graphEdgeCount: stats.edgeCount,
      graphTypeStats: typeStats
    });
  },

  openGraphView: function () {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' });
  },

  onShowTemplates: function () {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    if (!templates || templates.length === 0) {
      wx.showToast({ title: '暂无模板', icon: 'none' });
      return;
    }
    var names = templates.map(function (t) { return (t.icon || '') + ' ' + t.name; });
    var self = this;
    wx.showActionSheet({
      itemList: names,
      success: function (res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id });
        }
      }
    });
  }
});
