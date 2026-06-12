Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    currentYear: 2026,
    currentMonth: 6,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    dates: [],
    todayEvents: []
  },
  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
    const now = new Date();
    this.setData({ currentYear: now.getFullYear(), currentMonth: now.getMonth() + 1 });
    this.buildCalendar();
    this.loadEvents();
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },
  buildCalendar() {
    const { currentYear, currentMonth } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const today = new Date().getDate();
    const isCurrentMonth = new Date().getFullYear() === currentYear && new Date().getMonth() + 1 === currentMonth;
    const dates = [];
    for (let i = 0; i < firstDay; i++) { dates.push({ day: '', isEmpty: true }); }
    for (let d = 1; d <= daysInMonth; d++) {
      dates.push({ day: d, date: `${currentYear}-${String(currentMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isToday: isCurrentMonth && d === today, hasEvent: [3, 7, 11, 14, 20, 25].includes(d) });
    }
    this.setData({ dates });
  },
  loadEvents() {
    const calendarModule = require('../../modules/calendar/public');
    this.setData({ todayEvents: calendarModule.getTodayEvents() });
  },
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--; if (currentMonth < 1) { currentMonth = 12; currentYear--; }
    this.setData({ currentYear, currentMonth }); this.buildCalendar();
  },
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++; if (currentMonth > 12) { currentMonth = 1; currentYear++; }
    this.setData({ currentYear, currentMonth }); this.buildCalendar();
  },
  onDateTap(e) {
    const date = e.currentTarget.dataset.date;
    if (date) wx.showToast({ title: date, icon: 'none' });
  }
});