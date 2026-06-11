// miniprogram/platform-adapter.js - 平台能力适配器
// 封装 wx.* 能力，业务模块禁止直接调用 wx.*
// 后续扩展 H5/App 时只需替换此文件

module.exports = {
  // ==================== 登录 ====================

  /**
   * 微信登录
   * @returns {Promise<{code: string}>}
   */
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          console.log('[Platform] wx.login 成功');
          resolve({ code: res.code });
        },
        fail: (err) => {
          console.error('[Platform] wx.login 失败', err);
          reject(err);
        }
      });
    });
  },

  /**
   * 获取用户信息（需要用户授权）
   * @returns {Promise<{nickName: string, avatarUrl: string}>}
   */
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于展示用户头像和昵称',
        success: (res) => {
          resolve(res.userInfo);
        },
        fail: (err) => {
          console.warn('[Platform] 用户拒绝授权', err);
          reject(err);
        }
      });
    });
  },

  // ==================== 文件 ====================

  /**
   * 选择图片
   * @param {number} count 最多选择数量
   * @returns {Promise<{tempFilePaths: string[]}>}
   */
  chooseImage(count = 9) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: resolve,
        fail: reject
      });
    });
  },

  /**
   * 预览图片
   * @param {string} current 当前图片URL
   * @param {string[]} urls 图片URL列表
   */
  previewImage(current, urls) {
    wx.previewImage({ current, urls });
  },

  // ==================== 相机 ====================

  /**
   * 扫码
   * @returns {Promise<{result: string}>}
   */
  scanCode() {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        success: resolve,
        fail: reject
      });
    });
  },

  // ==================== 通知 ====================

  /**
   * 显示提示
   * @param {string} title
   * @param {'success'|'error'|'loading'|'none'} icon
   */
  showToast(title, icon = 'none') {
    wx.showToast({ title, icon, duration: 2000 });
  },

  /**
   * 显示加载中
   * @param {string} title
   */
  showLoading(title = '加载中...') {
    wx.showLoading({ title, mask: true });
  },

  hideLoading() {
    wx.hideLoading();
  },

  /**
   * 显示模态对话框
   * @param {string} title
   * @param {string} content
   * @returns {Promise<{confirm: boolean}>}
   */
  showModal(title, content) {
    return new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        success: (res) => {
          resolve({ confirm: res.confirm });
        }
      });
    });
  },

  // ==================== 网络 ====================

  /**
   * 检查网络状态
   * @returns {Promise<{isConnected: boolean, networkType: string}>}
   */
  getNetworkType() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: resolve
      });
    });
  },

  // ==================== 系统 ====================

  /**
   * 获取系统信息
   * @returns {Object}
   */
  getSystemInfo() {
    try {
      return wx.getSystemInfoSync();
    } catch (e) {
      return {};
    }
  }
};
