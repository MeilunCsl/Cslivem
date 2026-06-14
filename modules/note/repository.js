// modules/note/repository.js

var storage = require('../../miniprogram/storage');
var model = require('./model');
var graphEngine = require('../../core/graph/graph-engine');
var types = require('../../core/graph/types');
var wikiLink = require('../../utils/wiki-link');

var STORAGE_KEY = 'notes';
var INBOX_KEY = 'inbox_notes';

module.exports = {
  getAll: function() {
    return storage.get(STORAGE_KEY, []);
  },

  getById: function(id) {
    var notes = this.getAll();
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === id) return notes[i];
    }
    return null;
  },

  save: function(note) {
    var notes = this.getAll();
    var index = -1;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === note.id) { index = i; break; }
    }
    var updated = model.touch(note);
    if (index >= 0) {
      notes[index] = updated;
    } else {
      notes.unshift(updated);
    }
    storage.set(STORAGE_KEY, notes);
    // Sync with knowledge graph
    this._syncGraph(updated);
    return updated;
  },

  _syncGraph: function(note) {
    try {
      // Ensure note has a graph node
      graphEngine.upsertNode({
        id: 'node_note_' + note.id,
        type: types.NodeType.NOTE,
        refId: note.id,
        label: note.title || (note.content || '').substring(0, 50),
        metadata: { summary: note.summary || '' }
      });
      // Create tag nodes and edges
      (note.tags || []).forEach(function(tag) {
        var tagNodeId = 'node_tag_' + tag;
        graphEngine.upsertNode({
          id: tagNodeId,
          type: types.NodeType.TAG,
          label: tag
        });
        graphEngine.upsertEdge({
          source: 'node_note_' + note.id,
          target: tagNodeId,
          type: types.EdgeType.TAG
        });
      });
      // Extract wiki-links and create edges
      var fullText = (note.title || '') + ' ' + (note.content || '');
      var links = wikiLink.extractLinks(fullText);
      links.forEach(function(link) {
        var targetNodeId = 'node_concept_' + link.target.replace(/\s+/g, '_');
        graphEngine.upsertNode({
          id: targetNodeId,
          type: types.NodeType.CONCEPT,
          label: link.target
        });
        graphEngine.upsertEdge({
          source: 'node_note_' + note.id,
          target: targetNodeId,
          type: types.EdgeType.LINK
        });
      });
    } catch (e) {
      console.warn('[NoteRepo] graph sync failed:', e.message);
    }
  },

  delete: function(id) {
    var notes = this.getAll();
    var filtered = [];
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id !== id) filtered.push(notes[i]);
    }
    if (filtered.length === notes.length) return false;
    storage.set(STORAGE_KEY, filtered);
    // Clean up graph node
    try {
      graphEngine.deleteNode('node_note_' + id);
    } catch (e) {}
    return true;
  },

  search: function(query) {
    if (!query) return this.getAll();
    var q = query.toLowerCase();
    return this.getAll().filter(function(n) {
      return (n.title || '').toLowerCase().indexOf(q) >= 0 ||
             (n.content || '').toLowerCase().indexOf(q) >= 0 ||
             (n.tags || []).some(function(t) { return t.toLowerCase().indexOf(q) >= 0; });
    });
  },

  getByTag: function(tag) {
    return this.getAll().filter(function(n) { return (n.tags || []).indexOf(tag) >= 0; });
  },

  getFavorites: function() {
    return this.getAll().filter(function(n) { return n.isFavorite; });
  },

  getRecent: function(limit) {
    limit = limit || 10;
    return this.getAll()
      .sort(function(a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); })
      .slice(0, limit);
  },

  getInbox: function() {
    return storage.get(INBOX_KEY, []);
  },

  addToInbox: function(data) {
    var note = model.create(Object.assign({}, data, { source: 'quick' }));
    var inbox = this.getInbox();
    inbox.unshift(note);
    storage.set(INBOX_KEY, inbox);
    return note;
  },

  archiveFromInbox: function(id) {
    var inbox = this.getInbox();
    var note = null;
    for (var i = 0; i < inbox.length; i++) {
      if (inbox[i].id === id) { note = inbox[i]; break; }
    }
    if (!note) return null;
    storage.set(INBOX_KEY, inbox.filter(function(n) { return n.id !== id; }));
    return this.save(note);
  },

  // Get backlinks for a note (from graph)
  getBacklinks: function(noteId) {
    try {
      var nodeId = 'node_note_' + noteId;
      var neighbors = graphEngine.getNeighbors(nodeId);
      return neighbors.filter(function(item) {
        return item.node && item.node.type === types.NodeType.NOTE;
      }).map(function(item) {
        return this.getById(item.node.refId);
      }.bind(this)).filter(function(n) { return !!n; });
    } catch (e) {
      return [];
    }
  },

  getAllTags: function() {
    var notes = this.getAll();
    var tagSet = {};
    notes.forEach(function(n) {
      (n.tags || []).forEach(function(t) { tagSet[t] = true; });
    });
    return Object.keys(tagSet).sort();
  },

  getStats: function() {
    var notes = this.getAll();
    var inbox = this.getInbox();
    var now = new Date();
    var weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return {
      total: notes.length,
      thisWeek: notes.filter(function(n) { return new Date(n.updatedAt) > weekAgo; }).length,
      inbox: inbox.length,
      favorites: notes.filter(function(n) { return n.isFavorite; }).length,
      tags: this.getAllTags().length
    };
  }
};
