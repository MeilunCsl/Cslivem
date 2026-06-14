Page({
  data: {
    statusBarHeight: 20,
    ready: false,
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
    ]
  },

  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

}); } catch(e) {}
    setTimeout(() => { this.setData({ ready: true 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

}); }, 100);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    this.loadNotes();
  },

  loadNotes() {
    const noteModule = require('../../modules/note/public');
    const format = require('../../utils/format');
    const stats = noteModule.getStats();
    let notes = [];
    const { activeFilter } = this.data;
    switch (activeFilter) {
      case 'inbox':
        notes = noteModule.getInbox(20);
        break;
      case 'recent':
        notes = noteModule.getRecentNotes(this.data.pageSize);
        break;
      case 'all':
        notes = noteModule.getRecentNotes(this.data.pageSize);
        break;
      case 'fav':
        notes = noteModule.getFavorites();
        break;
      case 'tags':
        try {
          const knowledgeModule = require('../../modules/knowledge/public');
          const tagNodes = knowledgeModule.getNodesByType('tag');
          notes = tagNodes.map(n => ({
            id: n.refId || n.id,
            title: n.label,
            summary: (n.metadata && n.metadata.description) || '',
            tags: [],
            updatedAt: n.updatedAt,
            createdAt: n.createdAt,
            isTagNode: true
          }));
        } catch(e) {
          notes = noteModule.getRecentNotes(this.data.pageSize);
        }
        break;
      default:
        notes = noteModule.getRecentNotes(this.data.pageSize);
    }
    this.setData({
      notes: notes.map(n => ({
        ...n,
        timeAgo: format.getRelativeTime(n.updatedAt || n.createdAt)
      })),
      inboxCount: stats.inbox
    

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },

  setFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    this.loadNotes();
  },

  onTapNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/note-detail/note-detail?id=' + id 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },

  openGraph: function() {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },

  createNote: function() {
    wx.navigateTo({ url: '/pages/note-editor/note-editor' 

  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  }


  loadMore: function() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    var self = this;
    var noteModule = require('../../modules/note/public');
    var page = self.data.currentPage + 1;
    var limit = self.data.pageSize;
    var allNotes = noteModule.getRecentNotes(page * limit);
    var newNotes = allNotes.slice((page - 1) * limit, page * limit);
    if (newNotes.length < limit) {
      self.setData({ hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }
    setTimeout(function() {
      self.setData({
        notes: self.data.notes.concat(newNotes),
        currentPage: page,
        loadingMore: false
      

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 200);
  },

  onScrollToLower: function() {
    this.loadMore();
  },

  throttleTimer: null,
  onSearchInput: function(e) {
    var self = this;
    if (self.throttleTimer) clearTimeout(self.throttleTimer);
    self.throttleTimer = setTimeout(function() {
      var query = e.detail.value;
      if (!query || query.length < 2) {
        self.loadNotes();
        return;
      }
      var noteModule = require('../../modules/note/public');
      var results = noteModule.searchNotes(query);
      self.setData({ notes: results.slice(0, 20), hasMore: false 

  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    }, 300);
  },



  onShowTemplates: function() {
    var noteModule = require('../../modules/note/public');
    var templates = noteModule.getTemplates();
    var names = templates.map(function(t) { return t.icon + ' ' + t.name; 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
    wx.showActionSheet({
      itemList: names,
      success: function(res) {
        var template = templates[res.tapIndex];
        if (template) {
          wx.navigateTo({ url: '/pages/note-editor/note-editor?template=' + template.id 

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
        }
      }
    

  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});
  },



  onNoteLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
      wx.vibrateShort({ type: 'medium' }).catch(function() {});
    }
  },

  onNoteSelect: function(e) {
    if (!this.data.selectMode) return;
    var id = e.currentTarget.dataset.id;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
    if (selected.length === 0) {
      this.setData({ selectMode: false });
    }
  },

  exitSelectMode: function() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  onSelectAll: function() {
    var allIds = this.data.notes.map(function(n) { return n.id; });
    this.setData({ selectedIds: allIds });
  },

  onBatchDelete: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量删除',
      content: '确认删除 ' + count + ' 条笔记？',
      success: function(res) {
        if (res.confirm) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.deleteNote(id);
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已删除 ' + count + ' 条', icon: 'success' });
        }
      }
    });
  },

  onBatchTag: function() {
    var self = this;
    var count = self.data.selectedIds.length;
    if (count === 0) return;
    wx.showModal({
      title: '批量加标签',
      editable: true,
      placeholderText: '输入标签名',
      success: function(res) {
        if (res.confirm && res.content) {
          var noteModule = require('../../modules/note/public');
          self.data.selectedIds.forEach(function(id) {
            noteModule.addTag(id, res.content.trim());
          });
          self.setData({ selectMode: false, selectedIds: [] });
          self.loadNotes();
          wx.showToast({ title: '已加标签', icon: 'success' });
        }
      }
    });
  },

  onBatchExport: function() {
    var self = this;
    var noteModule = require('../../modules/note/public');
    var notes = self.data.selectedIds.map(function(id) {
      return noteModule.getRecentNotes(100).find(function(n) { return n.id === id; });
    }).filter(function(n) { return n; });
    var text = notes.map(function(n) {
      return '# ' + (n.title || '未命名') + '

' + (n.content || '') + '

---
';
    }).join('
');
    wx.setClipboardData({
      data: text,
      success: function() {
        self.setData({ selectMode: false, selectedIds: [] });
        wx.showToast({ title: '已复制 ' + notes.length + ' 条', icon: 'success' });
      }
    });
  },

});