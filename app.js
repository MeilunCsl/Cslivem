// app.js
const eventBus = require('./miniprogram/event-bus');
const toolRegistry = require('./miniprogram/tool-registry');
const storage = require('./miniprogram/storage');

const noteModule = require('./modules/note/public');
const calendarModule = require('./modules/calendar/public');
const ledgerModule = require('./modules/ledger/public');
const toolPdf = require('./modules/tool-pdf/public');
const toolOcr = require('./modules/tool-ocr/public');
const toolScanner = require('./modules/tool-scanner/public');

App({
  globalData: {
    userInfo: null,
    theme: 'light',
    appName: 'AI Knowledge Hub'
  },

  onLaunch() {
    console.log('[App] AI Knowledge Hub started');

    toolRegistry.register(noteModule.manifest);
    toolRegistry.register(calendarModule.manifest);
    toolRegistry.register(ledgerModule.manifest);
    toolRegistry.register(toolPdf.manifest);
    toolRegistry.register(toolOcr.manifest);
    toolRegistry.register(toolScanner.manifest);

    console.log('[App] Registered tools:', toolRegistry.getAll().map(t => t.name).join(', '));

    ledgerModule.init();

    storage.init();
    this.restoreUserInfo();
  },

  restoreUserInfo() {
    try {
      const userInfo = storage.get('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (e) {
      console.warn('[App] restore user info failed:', e);
    }
  },

  eventBus,
  toolRegistry
});
