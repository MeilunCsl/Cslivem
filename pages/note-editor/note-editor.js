Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    title: '',
    content: '',
    isNew: false,
    showToolbar: true
  },

  onLoad(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    const noteId = options.id || '';
    this.setData({ noteId, isNew: !noteId });
    
    if (noteId) {
      this.loadNote(noteId);
    }
    
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },

  loadNote(id) {
    const noteModule = require('../../modules/note/public');
    const note = noteModule.getRecentNotes(100).find(n => n.id === id);
    if (note) {
      this.setData({ title: note.title, content: note.content });
    }
  },

  goBack() { wx.navigateBack(); },

  onTitleInput() {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  insertMarkdown(type) {
    const content = this.data.content;
    let insert = '';
    
    switch (type) {
      case 'bold': insert = '**绮椾綋**'; break;
      case 'italic': insert = '*鏂滀綋*'; break;
      case 'heading': insert = '## '; break;
      case 'list': insert = '- '; break;
      case 'link': insert = '[閾炬帴鏂囧瓧](url)'; break;
      case 'code': insert = '`浠ｇ爜`'; break;
      case 'divider': insert = '\n---\n'; break;
    }
    
    this.setData({ content: content + insert });
  },

  save() {
    const { noteId, title, content, isNew } = this.data;
    const noteModule = require('../../modules/note/public');
    
    if (!title.trim() && !content.trim()) {
      wx.showToast({ title: '鍐呭涓嶈兘涓虹┖', icon: 'none' });
      return;
    }
    
    if (isNew) {
      const note = noteModule.createNote({ title: title.trim(), content });
      this.setData({ noteId: note.id, isNew: false });
      wx.showToast({ title: '宸插垱寤?, icon: 'success' });
    } else {
      noteModule.updateNote(noteId, {
        title: title.trim(),
        content,
        summary: noteModule.generateSummary(content)
      });
      wx.showToast({ title: '宸蹭繚瀛?, icon: 'success' });
    }
    
    setTimeout(() => wx.navigateBack(), 1000);
  }
});