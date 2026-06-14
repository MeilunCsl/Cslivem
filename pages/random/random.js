// pages/random/random.js
Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    mode: 'coin',
    result: '',
    resultVisible: false,
    history: [],
    // Dice
    diceCount: 1,
    diceResults: [],
    // Yes/No
    question: ''
  },

  onLoad: function() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch (e) {}
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onModeChange: function(e) {
    this.setData({ mode: e.currentTarget.dataset.mode, result: '', resultVisible: false, diceResults: [] });
  },

  // Coin flip
  flipCoin: function() {
    var self = this;
    wx.vibrateShort({ type: 'medium' }).catch(function() {});
    self.setData({ resultVisible: false });
    setTimeout(function() {
      var result = Math.random() < 0.5 ? '正面' : '反面';
      self.setData({ result: result, resultVisible: true });
      self.addHistory('投硬币: ' + result);
    }, 300);
  },

  // Dice roll
  rollDice: function() {
    var self = this;
    wx.vibrateShort({ type: 'medium' }).catch(function() {});
    self.setData({ resultVisible: false });
    setTimeout(function() {
      var count = self.data.diceCount;
      var results = [];
      for (var i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * 6) + 1);
      }
      var total = results.reduce(function(a, b) { return a + b; }, 0);
      var display = count > 1 ? results.join(' + ') + ' = ' + total : results[0].toString();
      self.setData({ diceResults: results, result: display, resultVisible: true });
      self.addHistory('抛骰子(' + count + '个): ' + display);
    }, 300);
  },

  onDiceCountChange: function(e) {
    this.setData({ diceCount: parseInt(e.detail.value) || 1 });
  },

  // Yes/No
  askYesNo: function() {
    var self = this;
    var question = self.data.question.trim();
    if (!question) {
      wx.showToast({ title: '输入问题', icon: 'none' });
      return;
    }
    wx.vibrateShort({ type: 'medium' }).catch(function() {});
    self.setData({ resultVisible: false });
    setTimeout(function() {
      var answers = ['是', '否', '可能', '试试看', '再想想', '当然不', '绝对是', '别这样'];
      var result = answers[Math.floor(Math.random() * answers.length)];
      self.setData({ result: result, resultVisible: true });
      self.addHistory('问: ' + question.substring(0, 10) + ' → ' + result);
    }, 500);
  },

  onQuestionInput: function(e) {
    this.setData({ question: e.detail.value });
  },

  // Random number
  generateRandom: function() {
    var self = this;
    wx.vibrateShort({ type: 'medium' }).catch(function() {});
    self.setData({ resultVisible: false });
    setTimeout(function() {
      var result = Math.floor(Math.random() * 100) + 1;
      self.setData({ result: result.toString(), resultVisible: true });
      self.addHistory('随机数: ' + result);
    }, 300);
  },

  addHistory: function(item) {
    var history = this.data.history.slice(0, 19);
    history.unshift({ text: item, time: new Date().toLocaleTimeString() });
    this.setData({ history: history });
  },

  clearHistory: function() {
    this.setData({ history: [] });
  }
});
