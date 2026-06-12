// miniprogram/platform-adapter.js

module.exports = {
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => resolve({ code: res.code }),
        fail: (err) => reject(err)
      });
    });
  },

  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: 'profile',
        success: (res) => resolve(res.userInfo),
        fail: (err) => reject(err)
      });
    });
  },

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

  previewImage(current, urls) {
    wx.previewImage({ current, urls });
  },

  scanCode() {
    return new Promise((resolve, reject) => {
      wx.scanCode({ success: resolve, fail: reject });
    });
  },

  showToast(title, icon = 'none') {
    wx.showToast({ title, icon, duration: 2000 });
  },

  showLoading(title = 'loading...') {
    wx.showLoading({ title, mask: true });
  },

  hideLoading() {
    wx.hideLoading();
  },

  showModal(title, content) {
    return new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        success: (res) => resolve({ confirm: res.confirm })
      });
    });
  },

  getNetworkType() {
    return new Promise((resolve) => {
      wx.getNetworkType({ success: resolve });
    });
  },

  getSystemInfo() {
    try {
      return wx.getSystemInfoSync();
    } catch (e) {
      return {};
    }
  }
};
