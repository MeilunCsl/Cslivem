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
const knowledgeModule = require('./modules/knowledge/public');
const habitModule = require('./modules/habit/public');
const pomodoroModule = require('./modules/pomodoro/public');
const countdownModule = require('./modules/countdown/public');
const foodModule = require('./modules/food/public');
const flashcardModule = require('./modules/flashcard/public');
const moodModule = require('./modules/mood/public');
const toolCompress = require('./modules/tool-compress/public');
const toolText = require('./modules/tool-text/public');
const toolConvert = require('./modules/tool-convert/public');
const syncManager = require('./miniprogram/sync-manager');
const ecsAdapter = require('./miniprogram/ecs-adapter');
const migrationManager = require('./miniprogram/migration-manager');

App({
  globalData: {
    userInfo: null,
    theme: 'light',
    appName: 'Cslivem'
  },

  onLaunch() {
    console.log('[App] Cslivem started');

    toolRegistry.register(noteModule.manifest);
    toolRegistry.register(calendarModule.manifest);
    toolRegistry.register(ledgerModule.manifest);
    toolRegistry.register(toolPdf.manifest);
    toolRegistry.register(toolOcr.manifest);
    toolRegistry.register(toolScanner.manifest);
    toolRegistry.register(knowledgeModule.manifest);
    toolRegistry.register(habitModule.manifest);
    toolRegistry.register(pomodoroModule.manifest);
    toolRegistry.register(countdownModule.manifest);
    toolRegistry.register(foodModule.manifest);
    toolRegistry.register(flashcardModule.manifest);
    toolRegistry.register(moodModule.manifest);
    toolRegistry.register(toolCompress.manifest);
    toolRegistry.register(toolText.manifest);
    toolRegistry.register(toolConvert.manifest);

    console.log('[App] Registered tools:', toolRegistry.getAll().map(t => t.name).join(', '));

    ledgerModule.init();
    syncManager.init();

    migrationManager.runAll();
    storage.init();
    ecsAdapter.init();
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
