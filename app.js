// app.js - AI Knowledge Hub 应用入口
const eventBus = require('./miniprogram/event-bus');
const toolRegistry = require('./miniprogram/tool-registry');
const storage = require('./miniprogram/storage');

// 注册工具模块
const noteModule = require('./modules/note/public');
const calendarModule = require('./modules/calendar/public');
const ledgerModule = require('./modules/ledger/public');

App({
  globalData: {
    userInfo: null,
    theme: 'light',
    appName: 'AI Knowledge Hub'
  },

  onLaunch() {
    console.log('[App] AI Knowledge Hub 启动');

    // 初始化工具注册表
    toolRegistry.register(noteModule.manifest);
    toolRegistry.register(calendarModule.manifest);
    toolRegistry.register(ledgerModule.manifest);

    console.log('[App] 已注册工具:', toolRegistry.getAll().map(t => t.name).join(', '));

    // 初始化本地存储版本
    storage.init();

    // 尝试恢复用户信息
    this.restoreUserInfo();
  },

  restoreUserInfo() {
    try {
      const userInfo = storage.get('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (e) {
      console.warn('[App] 恢复用户信息失败:', e);
    }
  },

  // 全局事件总线
  eventBus,

  // 工具注册表
  toolRegistry
});
