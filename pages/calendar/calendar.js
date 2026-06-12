// pages/calendar/calendar.js
const calendarModule = require('../../modules/calendar/public');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    currentYear: 2026,
    currentMonth: 6,
    selectedDate: '',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    dates: [],
    todayEvents: [],
    selectedEvents: [],
    diary: null,
    showCreateEvent: false,
    newEventTitle: '',
    newEventTime: ''
  },

  onLoad() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    const now = new Date();
    const today = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      selectedDate: today
    });
    this.buildCalendar();
    this.loadEvents();
    setTimeout(() => { this.setData({ ready: true }); }, 100);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.loadEvents();
  },

  buildCalendar() {
    const { currentYear, currentMonth, selectedDate } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;

    // Get events for this month to mark dates with events
    const monthEvents = calendarModule.getMonthEvents(currentYear, currentMonth);
    const eventDates = {};
    monthEvents.forEach(function(ev) { eventDates[ev.date] = true; });

    const dates = [];
    for (let i = 0; i < firstDay; i++) {
      dates.push({ day: '', isEmpty: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = currentYear + '-' +
        String(currentMonth).padStart(2, '0') + '-' +
        String(d).padStart(2, '0');
      dates.push({
        day: d,
        date: dateStr,
        isToday: isCurrentMonth && d === today.getDate(),
        isSelected: dateStr === selectedDate,
        hasEvent: !!eventDates[dateStr]
      });
    }
    this.setData({ dates });
  },

  loadEvents() {
    const { selectedDate } = this.data;
    const todayEvents = calendarModule.getTodayEvents();
    const selectedEvents = selectedDate ? calendarModule.getEventsByDate(selectedDate) : [];
    const diary = selectedDate ? calendarModule.getDiary(selectedDate) : null;
    this.setData({ todayEvents, selectedEvents, diary });
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 1) { currentMonth = 12; currentYear--; }
    this.setData({ currentYear, currentMonth });
    this.buildCalendar();
    this.loadEvents();
  },

  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 12) { currentMonth = 1; currentYear++; }
    this.setData({ currentYear, currentMonth });
    this.buildCalendar();
    this.loadEvents();
  },

  onDateTap(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    this.setData({ selectedDate: date });
    // Update isSelected in dates grid
    const dates = this.data.dates.map(function(d) {
      return Object.assign({}, d, { isSelected: d.date === date });
    });
    this.setData({ dates });
    this.loadEvents();
  },

  // Create event
  toggleCreateEvent() {
    this.setData({ showCreateEvent: !this.data.showCreateEvent });
  },

  onEventTitleInput(e) {
    this.setData({ newEventTitle: e.detail.value });
  },

  onEventTimeInput(e) {
    this.setData({ newEventTime: e.detail.value });
  },

  saveEvent() {
    const { newEventTitle, newEventTime, selectedDate } = this.data;
    if (!newEventTitle.trim()) {
      wx.showToast({ title: '请输入事件标题', icon: 'none' });
      return;
    }
    calendarModule.createEvent({
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime || ''
    });
    this.setData({
      newEventTitle: '',
      newEventTime: '',
      showCreateEvent: false
    });
    this.buildCalendar();
    this.loadEvents();
    wx.showToast({ title: '事件已创建', icon: 'success' });
  },

  deleteEvent(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个事件吗？',
      success: (res) => {
        if (res.confirm) {
          calendarModule.deleteEvent(id);
          this.buildCalendar();
          this.loadEvents();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // Diary
  onDiaryInput(e) {
    const { selectedDate, diary } = this.data;
    const content = e.detail.value;
    if (diary) {
      diary.content = content;
    }
  },

  saveDiary() {
    const { selectedDate, diary } = this.data;
    if (!diary || !diary.content.trim()) return;
    calendarModule.saveDiary({
      date: selectedDate,
      content: diary.content
    });
    wx.showToast({ title: '日记已保存', icon: 'success' });
  }
});
