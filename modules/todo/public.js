// modules/todo/public.js
var manifest = require('./manifest');
var model = require('./model');
var repository = require('./repository');

module.exports = {
  manifest: manifest,

  init: function() {
    repository.initLists();
  },

  // Todo CRUD
  createTodo: function(data) {
    var todo = model.createTodo(data);
    var validation = model.validateTodo(todo);
    if (!validation.valid) throw new Error('Validation: ' + validation.errors.join(', '));
    return repository.saveTodo(todo);
  },

  updateTodo: function(id, updates) {
    var todo = repository.getTodoById(id);
    if (!todo) throw new Error('Todo not found');
    Object.keys(updates).forEach(function(k) { todo[k] = updates[k]; });
    todo.updatedAt = new Date().toISOString();
    return repository.saveTodo(todo);
  },

  deleteTodo: function(id) {
    repository.deleteTodo(id);
  },

  toggleTodo: function(id) {
    var todo = repository.getTodoById(id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date().toISOString() : null;
    todo.updatedAt = new Date().toISOString();
    return repository.saveTodo(todo);
  },

  getTodo: function(id) {
    return repository.getTodoById(id);
  },

  // Query
  getAllTodos: function() {
    return repository.getAllTodos();
  },

  getPendingTodos: function() {
    return repository.getPendingTodos();
  },

  getCompletedTodos: function() {
    return repository.getCompletedTodos();
  },

  getTodosByList: function(listId) {
    return repository.getTodosByList(listId);
  },

  getStats: function() {
    var all = repository.getAllTodos();
    var pending = all.filter(function(t) { return !t.completed; });
    var completed = all.filter(function(t) { return t.completed; });
    var overdue = pending.filter(function(t) {
      return t.dueDate && t.dueDate < new Date().toISOString().split('T')[0];
    });
    return {
      total: all.length,
      pending: pending.length,
      completed: completed.length,
      overdue: overdue.length
    };
  },

  // Lists
  getLists: function() {
    return repository.getAllLists();
  },

  createList: function(data) {
    var list = model.createList(data);
    return repository.saveList(list);
  },

  searchTodos: function(query) {
    if (!query) return [];
    var q = query.toLowerCase();
    return repository.getAllTodos().filter(function(t) {
      return (t.title && t.title.toLowerCase().indexOf(q) >= 0) ||
             (t.description && t.description.toLowerCase().indexOf(q) >= 0) ||
             (t.tags && t.tags.join(' ').toLowerCase().indexOf(q) >= 0);
    });
  }
};
