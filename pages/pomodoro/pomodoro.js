// pages/pomodoro/pomodoro.js
var pomoModule = require('../../modules/pomodoro/public');

var timer = null;

Page({
  data: {
    mode: 'focus', // focus, break, longBreak
    status: 'idle', // idle, running, paused
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    progress: 100,
    display: '25:00',
    sessionCount: 0,
    stats: {},
    ready: false
  },

  onLoad: function() {
    var stats = pomoModule.getStats();
    var settings = pomoModule.getSettings();
    this.setData({
      stats: stats,
      totalSeconds: settings.focusMinutes * 60,
      remainingSeconds: settings.focusMinutes * 60,
      display: this.formatTime(settings.focusMinutes * 60)
    });
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onUnload: function() {
    if (timer) clearInterval(timer);
  },

  formatTime: function(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  },

  onStart: function() {
    var self = this;
    if (this.data.status === 'running') return;

    this.setData({ status: 'running' });
    timer = setInterval(function() {
      var remaining = self.data.remainingSeconds - 1;
      if (remaining <= 0) {
        clearInterval(timer);
        self.onTimerEnd();
        return;
      }
      var progress = (remaining / self.data.totalSeconds) * 100;
      self.setData({
        remainingSeconds: remaining,
        progress: progress,
        display: self.formatTime(remaining)
      });
    }, 1000);
  },

  onPause: function() {
    if (timer) clearInterval(timer);
    this.setData({ status: 'paused' });
  },

  onReset: function() {
    if (timer) clearInterval(timer);
    var settings = pomoModule.getSettings();
    var seconds = this.data.mode === 'focus' ? settings.focusMinutes * 60 :
                  this.data.mode === 'break' ? settings.breakMinutes * 60 :
                  settings.longBreakMinutes * 60;
    this.setData({
      status: 'idle',
      totalSeconds: seconds,
      remainingSeconds: seconds,
      progress: 100,
      display: this.formatTime(seconds)
    });
  },

  onTimerEnd: function() {
    var self = this;
    var mode = this.data.mode;
    var settings = pomoModule.getSettings();
    var sessionCount = this.data.sessionCount;

    if (mode === 'focus') {
      pomoModule.recordSession({ type: 'focus', duration: this.data.totalSeconds });
      sessionCount++;
      wx.vibrateShort({ type: 'heavy' }).catch(function() {});
      wx.showToast({ title: '\u4e13\u6ce8\u5b8c\u6210\uff01', icon: 'success' });

      var nextMode = sessionCount % settings.sessionsBeforeLong === 0 ? 'longBreak' : 'break';
      var nextSeconds = nextMode === 'longBreak' ? settings.longBreakMinutes * 60 : settings.breakMinutes * 60;
      this.setData({
        mode: nextMode,
        status: 'idle',
        sessionCount: sessionCount,
        totalSeconds: nextSeconds,
        remainingSeconds: nextSeconds,
        progress: 100,
        display: this.formatTime(nextSeconds),
        stats: pomoModule.getStats()
      });
    } else {
      wx.showToast({ title: '\u4f11\u606f\u7ed3\u675f\uff0c\u5f00\u59cb\u4e13\u6ce8\uff01', icon: 'none' });
      var focusSeconds = settings.focusMinutes * 60;
      this.setData({
        mode: 'focus',
        status: 'idle',
        totalSeconds: focusSeconds,
        remainingSeconds: focusSeconds,
        progress: 100,
        display: this.formatTime(focusSeconds)
      });
    }
  },

  onBack: function() {
    if (timer) clearInterval(timer);
    wx.navigateBack();
  }
});
