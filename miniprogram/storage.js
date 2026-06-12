// miniprogram/storage.js

const { STORAGE_PREFIX } = require('../utils/constants');

const CURRENT_VERSION = 1;
const VERSION_KEY = STORAGE_PREFIX + 'storage_version';

module.exports = {
  init() {
    try {
      const stored = wx.getStorageSync(VERSION_KEY);
      if (!stored || stored < CURRENT_VERSION) {
        this._migrate(stored || 0, CURRENT_VERSION);
        wx.setStorageSync(VERSION_KEY, CURRENT_VERSION);
      }
    } catch (e) {
      console.warn('[Storage] init failed:', e);
    }
  },

  set(key, value) {
    try {
      wx.setStorageSync(STORAGE_PREFIX + key, value);
    } catch (e) {
      console.error('[Storage] write failed:', key, e);
    }
  },

  get(key, defaultValue) {
    try {
      const val = wx.getStorageSync(STORAGE_PREFIX + key);
      return val !== '' ? val : defaultValue;
    } catch (e) {
      console.error('[Storage] read failed:', key, e);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(STORAGE_PREFIX + key);
    } catch (e) {
      console.error('[Storage] remove failed:', key, e);
    }
  },

  clearAll() {
    try {
      const { keys } = wx.getStorageInfoSync();
      keys.forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) {
          wx.removeStorageSync(k);
        }
      });
    } catch (e) {
      console.error('[Storage] clearAll failed:', e);
    }
  },

  _migrate(from, to) {
    console.log('[Storage] migrate v' + from + ' -> v' + to);
  }
};
