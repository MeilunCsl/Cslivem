Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    note: null,
    isEditing: false,
    editContent: '',
    showTagInput: false,
    newTag: ''
  },

  onLoad(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    const noteId = options.id || '';
    this.setData({ noteId });
    this.loadNote(noteId);
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },

  loadNote(id) {
    const noteModule = require('../../modules/note/public');
    const note = noteModule.getRecentNotes(100).find(n => n.id === id);
    if (note) {
      this.setData({ note, editContent: note.content });
    } else {
      wx.showToast({ title: '绗旇涓嶅瓨鍦?, icon: 'none' });
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
    wx.showToast({ title: '宸蹭繚瀛?, icon: 'success' });
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

  goBack() { wx.navigateBack(); },

  deleteNote() {
    wx.showModal({
      title: '纭鍒犻櫎',
      content: '鍒犻櫎鍚庢棤娉曟仮澶嶏紝纭畾瑕佸垹闄よ繖鏉＄瑪璁板悧锛?,
      success: (res) => {
        if (res.confirm) {
          const noteModule = require('../../modules/note/public');
          noteModule.deleteNote(this.data.noteId);
          wx.showToast({ title: '宸插垹闄?, icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1000);
        }
      }
    });
  }
});