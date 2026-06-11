// miniprogram/storage.js - 本地存储封装
// 带版本管理和前缀隔离

const { STORAGE_PREFIX } = require('../utils/constants');

const CURRENT_VERSION = 1;
const VERSION_KEY = STORAGE_PREFIX + 'storage_version';

module.exports = {
  /**
   * 初始化存储，处理版本迁移
   */
  init() {
    try {
      const stored = wx.getStorageSync(VERSION_KEY);
      if (!stored || stored < CURRENT_VERSION) {
        this._migrate(stored || 0, CURRENT_VERSION);
        wx.setStorageSync(VERSION_KEY, CURRENT_VERSION);
      }
    } catch (e) {
      console.warn('[Storage] 初始化失败:', e);
    }
  },

  /**
   * 存储数据
   * @param {string} key 键名（自动加前缀）
   * @param {*} value 值
   */
  set(key, value) {
    try {
      wx.setStorageSync(STORAGE_PREFIX + key, value);
    } catch (e) {
      console.error('[Storage] 写入失败:', key, e);
    }
  },

  /**
   * 读取数据
   * @param {string} key 键名
   * @param {*} defaultValue 默认值
   * @returns {*}
   */
  get(key, defaultValue) {
    try {
      const val = wx.getStorageSync(STORAGE_PREFIX + key);
      return val !== '' ? val : defaultValue;
    } catch (e) {
      console.error('[Storage] 读取失败:', key, e);
      return defaultValue;
    }
  },

  /**
   * 删除数据
   * @param {string} key 键名
   */
  remove(key) {
    try {
      wx.removeStorageSync(STORAGE_PREFIX + key);
    } catch (e) {
      console.error('[Storage] 删除失败:', key, e);
    }
  },

  /**
   * 清除所有带前缀的数据
   */
  clearAll() {
    try {
      const { keys } = wx.getStorageInfoSync();
      keys.forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) {
          wx.removeStorageSync(k);
        }
      });
    } catch (e) {
      console.error('[Storage] 清除失败:', e);
    }
  },

  /**
   * �本迁移逻辑
   * @private
   */
  _migrate(from, to) {
    console.log(`[Storage] 迁移 v${from} → v${to}`);
    // 后续版本在此添加迁移逻辑
  }
};
