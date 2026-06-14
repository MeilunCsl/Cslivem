// core/storage/local-storage.js
// 统一本地存储封装
// 所有业务代码必须通过此模块读写，禁止散落 wx.getStorageSync

function getJSON(key, fallback) {
  fallback = fallback !== undefined ? fallback : null;
  try {
    var raw = wx.getStorageSync(key);
    if (raw === '' || raw === undefined || raw === null) return fallback;
    if (typeof raw === 'object') return raw;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Storage] getJSON error:', key, e.message);
    return fallback;
  }
}

function setJSON(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (e) {
    console.error('[Storage] setJSON error:', key, e.message);
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error('[Storage] remove error:', key, e.message);
    return false;
  }
}

function clear() {
  try {
    wx.clearStorageSync();
    return true;
  } catch (e) {
    console.error('[Storage] clear error:', e.message);
    return false;
  }
}

function getInfo() {
  try {
    var info = wx.getStorageInfoSync();
    return {
      keys: info.keys || [],
      currentSize: info.currentSize || 0,
      limitSize: info.limitSize || 0
    };
  } catch (e) {
    return { keys: [], currentSize: 0, limitSize: 0 };
  }
}

module.exports = {
  getJSON: getJSON,
  setJSON: setJSON,
  remove: remove,
  clear: clear,
  getInfo: getInfo
};
