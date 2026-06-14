// modules/knowledge/public.js

var manifest = require('./manifest');
var model = require('./model');
var repository = require('./repository');

module.exports = {
  manifest: manifest,

  // ===== Node Operations =====
  createNode: function(data) {
    var node = model.createNode(data);
    var validation = model.validateNode(node);
    if (!validation.valid) {
      throw new Error('Node validation: ' + validation.errors.join(', '));
    }
    return repository.saveNode(node);
  },

  updateNode: function(id, updates) {
    var node = repository.getNodeById(id);
    if (!node) throw new Error('Node not found: ' + id);
    Object.keys(updates).forEach(function(k) { node[k] = updates[k]; });
    return repository.saveNode(node);
  },

  deleteNode: function(id) {
    return repository.deleteNode(id);
  },

  getNode: function(id) {
    return repository.getNodeById(id);
  },

  findNodeByRef: function(refId) {
    return repository.getNodeByRefId(refId);
  },

  searchNodes: function(query) {
    return repository.searchNodes(query);
  },

  getNodesByType: function(type) {
    return repository.getNodesByType(type);
  },

  // ===== Edge Operations =====
  createEdge: function(data) {
    var edge = model.createEdge(data);
    var validation = model.validateEdge(edge);
    if (!validation.valid) {
      throw new Error('Edge validation: ' + validation.errors.join(', '));
    }
    // Prevent duplicate edges
    var existing = repository.getAllEdges().filter(function(e) {
      return e.source === edge.source && e.target === edge.target && e.type === edge.type;
    });
    if (existing.length > 0) return existing[0];
    return repository.saveEdge(edge);
  },

  deleteEdge: function(id) {
    repository.deleteEdge(id);
  },

  // ===== Graph Queries =====
  getNeighbors: function(nodeId) {
    return repository.getNeighbors(nodeId);
  },

  getBacklinks: function(nodeId) {
    return repository.getBacklinks(nodeId);
  },

  getForwardLinks: function(nodeId) {
    return repository.getForwardLinks(nodeId);
  },

  findPath: function(fromId, toId) {
    return repository.findPath(fromId, toId);
  },

  // ===== High-level Operations =====
  // Link a note to the graph
  linkNote: function(noteId, noteTitle) {
    var existing = repository.getNodeByRefId(noteId);
    if (existing) {
      existing.label = noteTitle;
      return repository.saveNode(existing);
    }
    return this.createNode({
      type: 'note',
      refId: noteId,
      label: noteTitle
    });
  },

  // Create a relation between two notes
  linkNotes: function(sourceNoteId, targetNoteId, relationType) {
    var sourceNode = repository.getNodeByRefId(sourceNoteId);
    var targetNode = repository.getNodeByRefId(targetNoteId);
    if (!sourceNode) sourceNode = this.linkNote(sourceNoteId, sourceNoteId);
    if (!targetNode) targetNode = this.linkNote(targetNoteId, targetNoteId);
    return this.createEdge({
      source: sourceNode.id,
      target: targetNode.id,
      type: relationType || 'link'
    });
  },

  // Get all notes linked to a given note
  getRelatedNotes: function(noteId) {
    var node = repository.getNodeByRefId(noteId);
    if (!node) return [];
    var neighbors = repository.getNeighbors(node.id);
    return neighbors.filter(function(n) { return n.type === 'note'; });
  },

  // ===== Stats =====
  getStats: function() {
    return repository.getStats();
  },

  getFullGraph: function() {
    return repository.getFullGraph();
  },

  rebuildIndex: function() {
    return repository.rebuildAdjacency();
  }
};
