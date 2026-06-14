Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    note: null,
    isEditing: false,
    editContent: '',
    showTagInput: false,
    backlinks: [],
    parsedContent: '',
    newTag: ''
  },

  onLoad(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    const noteId = options.id || '';
    this.setData({ noteId });
    this.loadNote(noteId);
    this.loadBacklinks(noteId);
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },

  loadNote(id) {
    const noteModule = require('../../modules/note/public');
    const note = noteModule.getRecentNotes(100).find(n => n.id === id);
    if (note) {
      this.setData({ note, editContent: note.content });
      this.parseWikiLinks(note.content || '');
    } else {
      wx.showToast({ title: '笔记不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  toggleEdit() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  onContentInput(e) {
    this.setData({ editContent: e.detail.value });
  },

  saveNote() {
    const noteModule = require('../../modules/note/public');
    const { noteId, editContent, note } = this.data;
    if (!note) return;
    const updated = noteModule.updateNote(noteId, {
      content: editContent,
      summary: noteModule.generateSummary(editContent)
    });
    this.setData({ note: updated, isEditing: false });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  toggleFavorite() {
    const noteModule = require('../../modules/note/public');
    const { noteId } = this.data;
    const updated = noteModule.toggleFavorite(noteId);
    this.setData({ note: updated });
  },

  showAddTag() {
    this.setData({ showTagInput: true });
  },

  onTagInput(e) {
    this.setData({ newTag: e.detail.value });
  },

  confirmAddTag() {
    const noteModule = require('../../modules/note/public');
    const { noteId, newTag } = this.data;
    if (!newTag.trim()) return;
    const updated = noteModule.addTag(noteId, newTag.trim());
    this.setData({ note: updated, newTag: '', showTagInput: false });
  },

  removeTag(e) {
    const noteModule = require('../../modules/note/public');
    const { noteId } = this.data;
    const tag = e.currentTarget.dataset.tag;
    const updated = noteModule.removeTag(noteId, tag);
    this.setData({ note: updated });
  },

  loadBacklinks(id) {
    try {
      const knowledgeModule = require('../../modules/knowledge/public');
      const node = knowledgeModule.findNodeByRef(id);
      if (node) {
        const backlinkNodes = knowledgeModule.getBacklinks(node.id);
        this.setData({ backlinks: backlinkNodes.map(n => ({
          id: n.refId || n.id,
          title: n.label,
          summary: n.metadata && n.metadata.description || ''
        }))});
      }
    } catch(e) {
      console.warn('[NoteDetail] loadBacklinks error:', e);
    }
  },

  onTapBacklink(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: '/pages/note-detail/note-detail?id=' + id });
  },

  goBack() { wx.navigateBack(); },

  openGraph() {
    wx.navigateTo({ url: '/pages/graph-view/graph-view' });
  },

  deleteNote() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这条笔记吗？',
      success: (res) => {
        if (res.confirm) {
          const noteModule = require('../../modules/note/public');
          noteModule.deleteNote(this.data.noteId);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1000);
        }
      }
    });
  }
});