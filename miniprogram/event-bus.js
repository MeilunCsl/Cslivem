// miniprogram/event-bus.js - 全局事件总线
// 模块间解耦通信的核心机制

const _listeners = {};

module.exports = {
  /**
   * 监听事件
   * @param {string} event 事件名
   * @param {Function} callback 回调
   */
  on(event, callback) {
    if (!_listeners[event]) {
      _listeners[event] = [];
    }
    _listeners[event].push(callback);
  },

  /**
   * 取消监听
   * @param {string} event 事件名
   * @param {Function} callback 回调（不传则清除该事件所有监听）
   */
  off(event, callback) {
    if (!_listeners[event]) return;
    if (!callback) {
      delete _listeners[event];
      return;
    }
    _listeners[event] = _listeners[event].filter(cb => cb !== callback);
  },

  /**
   * 触发事件
   * @param {string} event 事件名
   * @param {*} data 事件数据
   */
  emit(event, data) {
    if (!_listeners[event]) return;
    _listeners[event].forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error('[EventBus] 处理事件异常:', event, e);
      }
    });
  },

  /**
   * 一次性监听
   * @param {string} event 事件名
   * @param {Function} callback 回调
   */
  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    this.on(event, wrapper);
  }
};
