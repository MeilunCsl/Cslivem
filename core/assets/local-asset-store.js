// core/assets/local-asset-store.js v1.3.8
var localStorage = require('../storage/local-storage');
var types = require('./asset-types');

var ASSETS_KEY = 'core_assets';

function getAll() { return localStorage.getJSON(ASSETS_KEY, []); }
function saveAll(list) { localStorage.setJSON(ASSETS_KEY, list); }

function add(opts) {
  var asset = types.createAsset(opts);
  var list = getAll();
  list.push(asset);
  saveAll(list);
  return asset;
}

function get(id) {
  var list = getAll();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

function getByMessage(messageId) {
  return getAll().filter(function(a) { return a.messageId === messageId; });
}

function getByConversation(conversationId) {
  return getAll().filter(function(a) { return a.conversationId === conversationId; });
}

function remove(id) {
  var list = getAll();
  var asset = null;
  list = list.filter(function(a) {
    if (a.id === id) { asset = a; return false; }
    return true;
  });
  saveAll(list);
  // Delete file from storage
  if (asset && asset.filePath) {
    wx.removeFileSystemManager && wx.removeFileSystemManager().unlink({ filePath: asset.filePath });
  }
  return asset;
}

function removeByMessage(messageId) {
  var assets = getByMessage(messageId);
  assets.forEach(function(a) { remove(a.id); });
}

function getStats() {
  var list = getAll();
  var totalSize = 0;
  list.forEach(function(a) { totalSize += a.fileSize || 0; });
  return { count: list.length, totalSize: totalSize };
}

module.exports = { add: add, get: get, getByMessage: getByMessage, getByConversation: getByConversation, remove: remove, removeByMessage: removeByMessage, getStats: getStats };
