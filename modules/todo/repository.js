// modules/todo/repository.js
var storage = require('../../miniprogram/storage');

var TODOS_KEY = 'csl_todos';
var LISTS_KEY = 'csl_todo_lists';

function loadTodos() { return storage.get(TODOS_KEY) || []; }
function saveTodos(list) { storage.set(TODOS_KEY, list); }
function loadLists() { return storage.get(LISTS_KEY) || null; }
function saveLists(list) { storage.set(LISTS_KEY, list); }

function initLists() {
  if (!loadLists()) {
    var model = require('./model');
    saveLists(model.DEFAULT_LISTS);
  }
}

function getAllTodos() { return loadTodos(); }
function getTodoById(id) { return loadTodos().find(function(t) { return t.id === id; }) || null; }
function getTodosByList(listId) { return loadTodos().filter(function(t) { return t.listId === listId; }); }
function getPendingTodos() { return loadTodos().filter(function(t) { return !t.completed; }); }
function getCompletedTodos() { return loadTodos().filter(function(t) { return t.completed; }); }

function saveTodo(todo) {
  var todos = loadTodos();
  var idx = todos.findIndex(function(t) { return t.id === todo.id; });
  if (idx >= 0) {
    todos[idx] = todo;
  } else {
    todos.push(todo);
  }
  saveTodos(todos);
  return todo;
}

function deleteTodo(id) {
  var todos = loadTodos().filter(function(t) { return t.id !== id; });
  saveTodos(todos);
}

function getAllLists() {
  initLists();
  return loadLists();
}

function saveList(list) {
  var lists = loadLists() || [];
  var idx = lists.findIndex(function(l) { return l.id === list.id; });
  if (idx >= 0) {
    lists[idx] = list;
  } else {
    lists.push(list);
  }
  saveLists(lists);
  return list;
}

module.exports = {
  getAllTodos: getAllTodos,
  getTodoById: getTodoById,
  getTodosByList: getTodosByList,
  getPendingTodos: getPendingTodos,
  getCompletedTodos: getCompletedTodos,
  saveTodo: saveTodo,
  deleteTodo: deleteTodo,
  getAllLists: getAllLists,
  saveList: saveList,
  initLists: initLists
};
