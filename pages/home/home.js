// pages/home/home.js - 首页智能工作台
const noteModule = require('../../modules/note/public');
const calendarModule = require('../../modules/calendar/public');
const format = require('../../utils/format');

Page({
  data: {
    statusBarHeight: 20,
    greeting: '早上好',
    userName: '用户',
    avatarLetter: 'U',
    stats: {
      todayTodos: 3,
      thisWeekNotes: 12
    },
    inbox: [],
    recentNotes: [],
    tools: []
  },

  onLoad() {
    // 获取系统信息
    try {
      const sys = wx.getSystemInfoSync();
      this.setData({ statusBarHeight: sys.statusBarHeight || 20 });
    } catch (e) {}

    this.setGreeting();
    this.loadData();
  },

  onShow() {
    // 切换回首页时刷新自定义 TabBar 状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  /** 根据时间段设置问候语 */
  setGreeting() {
    const hour = new Date().getHours();
    let greeting = '你好';
    if (hour < 6) greeting = '夜深了';
    else if (hour < 12) greeting = '早上好';
    else if (hour < 14) greeting = '中午好';
    else if (hour < 18) greeting = '下午好';
    else greeting = '晚上好';

    this.setData({ greeting });
  },

  /** 加载所有数据 */
  loadData() {
    this.loadInbox();
    this.loadRecentNotes();
    this.loadTools();
    this.loadStats();
  },

  /** 加载 AI 收件箱 */
  loadInbox() {
    const inbox = noteModule.getInbox(3);
    const processed = inbox.map(item => ({
      ...item,
      timeAgo: format.getRelativeTime(item.createdAt)
    }));
    this.setData({ inbox: processed });
  },

  /** 加载最近笔记 */
  loadRecentNotes() {
    const notes = noteModule.getRecentNotes(5);
    const processed = notes.map(note => ({
      ...note,
      timeAgo: format.getRelativeTime(note.updatedAt)
    }));
    this.setData({ recentNotes: processed });
  },

  /** 加载工具列表 */
  loadTools() {
    const tools = [
      { id: 'pdf', icon: '▤', name: '图片转 PDF', description: '本地处理，可保存到知识库' },
      { id: 'ocr', icon: '◎', name: 'OCR 识别', description: '需要相册或相机权限' },
      { id: 'food', icon: '◒', name: '饮食记录', description: 'AI 识别食物与营养' },
      { id: 'scanner', icon: '▧', name: '扫描归档', description: '自动裁切和增强文档' }
    ];
    this.setData({ tools });
  },

  /** 加载统计数据 */
  loadStats() {
    const noteStats = noteModule.getStats();
    const todayEvents = calendarModule.getTodayEvents();
    this.setData({
      stats: {
        todayTodos: todayEvents.length,
        thisWeekNotes: noteStats.thisWeek
      }
    });
  },

  /** 搜索确认 */
  onSearch(e) {
    const value = e.detail.value;
    if (!value) return;
    console.log('[Home] 搜索:', value);
    wx.showToast({ title: '搜索: ' + value, icon: 'none' });
  },

  onSearchTap() {
    console.log('[Home] 搜索框聚焦');
  },

  /** 快捷动作 */
  onQuickAction(e) {
    const type = e.currentTarget.dataset.type;
    console.log('[Home] 快捷动作:', type);
    wx.showToast({ title: '即将支持: ' + type, icon: 'none' });
  },

  /** 头像点击 */
  onAvatarTap() {
    wx.showToast({ title: '个人中心（开发中）', icon: 'none' });
  },

  /** 查看全部 */
  onViewAll(e) {
    const section = e.currentTarget.dataset.section;
    if (section === 'notes') {
      wx.switchTab({ url: '/pages/notes/notes' });
    }
  },

  /** 笔记点击 */
  onNoteTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('[Home] 打开笔记:', id);
    wx.showToast({ title: '笔记详情（开发中）', icon: 'none' });
  },

  /** 工具点击 */
  onToolTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('[Home] 打开工具:', id);
    wx.showToast({ title: '工具详情（开发中）', icon: 'none' });
  }
});
