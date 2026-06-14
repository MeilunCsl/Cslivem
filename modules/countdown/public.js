// modules/countdown/public.js
// Countdown module v1.8.0

var manifest = require('./manifest');
var localStorage = require('../../core/storage/local-storage');

var KEY = 'csl_countdowns';

function load() { return localStorage.getJSON(KEY, []); }
function save(list) { localStorage.setJSON(KEY, list); }

function getAll() {
  var list = load();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return list.map(function(item) {
    var target = new Date(item.date);
    target.setHours(0, 0, 0, 0);
    var diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return Object.assign({}, item, {
      daysLeft: diff,
      isPast: diff < 0,
      isToday: diff === 0
    });
  }).sort(function(a, b) { return a.daysLeft - b.daysLeft; });
}

function add(data) {
  var list = load();
  var item = {
    id: 'cd_' + Date.now(),
    title: data.title || '',
    date: data.date || '',
    icon: data.icon || '\u23f3',
    color: data.color || '#6C5CE7',
    repeat: data.repeat || 'none',
    createdAt: new Date().toISOString()
  };
  list.push(item);
  save(list);
  return item;
}

function update(id, data) {
  var list = load();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
      save(list);
      return list[i];
    }
  }
  return null;
}

function remove(id) {
  var list = load().filter(function(item) { return item.id !== id; });
  save(list);
}

module.exports = {
  manifest: manifest,
  getAll: getAll,
  add: add,
  update: update,
  remove: remove
};
