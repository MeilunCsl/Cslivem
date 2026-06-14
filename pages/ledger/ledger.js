// pages/ledger/ledger.js
const ledgerModule = require('../../modules/ledger/public');
const format = require('../../utils/format');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    currentYear: 2026,
    currentMonth: 6,
    summary: { income: 0, expense: 0, balance: 0 },
    accounts: [],
    recentTransactions: [],
    categories: [],
    categoryMap: {},
    // Create form
    showCreate: false,
    budgetProgress: [],
    showBudgetModal: false,
    budgetCatIndex: 0,
    budgetAmount: '',
    expenseCategories: [],
    txType: 'expense',
    amountInput: '',
    selectedCategory: '',
    selectedAccount: '',
    txNote: '',
    txDate: ''
  },

  onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    ledgerModule.init();
    var now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      txDate: now.toISOString().split('T')[0]
    });
    this.loadData();
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.loadData();
  },

  loadData: function() {
    var y = this.data.currentYear;
    var m = this.data.currentMonth;
    var summary = ledgerModule.getMonthlySummary(y, m);
    var accounts = ledgerModule.getAccounts();
    var recent = ledgerModule.getRecentTransactions(10);
    var categories = ledgerModule.getCategories();
    var catMap = {};
    categories.forEach(function(c) { catMap[c.id] = c; });
    this.setData({
      summary: summary,
      accounts: accounts,
      recentTransactions: recent,
      categories: categories,
      categoryMap: catMap
    });
  },

  prevMonth: function() {
    var y = this.data.currentYear;
    var m = this.data.currentMonth - 1;
    if (m < 1) { m = 12; y--; }
    this.setData({ currentYear: y, currentMonth: m });
    this.loadData();
  },

  nextMonth: function() {
    var y = this.data.currentYear;
    var m = this.data.currentMonth + 1;
    if (m > 12) { m = 1; y++; }
    this.setData({ currentYear: y, currentMonth: m });
    this.loadData();
  },

  toggleCreate: function() {
    var accounts = ledgerModule.getAccounts();
    var expenseCats = ledgerModule.getExpenseCategories();
    this.setData({
      showCreate: !this.data.showCreate,
      txType: 'expense',
      amountInput: '',
      selectedCategory: expenseCats.length > 0 ? expenseCats[0].id : '',
      selectedAccount: accounts.length > 0 ? accounts[0].id : '',
      txNote: ''
    });
  },

  switchTxType: function(e) {
    var type = e.currentTarget.dataset.type;
    var cats = type === 'income' ? ledgerModule.getIncomeCategories() : ledgerModule.getExpenseCategories();
    this.setData({
      txType: type,
      selectedCategory: cats.length > 0 ? cats[0].id : ''
    });
  },

  onAmountInput: function(e) {
    this.setData({ amountInput: e.detail.value });
  },

  selectCategory: function(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.id });
  },

  selectAccount: function(e) {
    this.setData({ selectedAccount: e.currentTarget.dataset.id });
  },

  onNoteInput: function(e) {
    this.setData({ txNote: e.detail.value });
  },

  saveTransaction: function() {
    var amount = parseFloat(this.data.amountInput);
    if (isNaN(amount) || amount <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }
    var amountMinor = Math.round(amount * 100);
    try {
      ledgerModule.createTransaction({
        type: this.data.txType,
        amountMinor: amountMinor,
        categoryId: this.data.selectedCategory,
        accountId: this.data.selectedAccount,
        date: this.data.txDate,
        note: this.data.txNote
      });
      wx.vibrateShort({ type: 'light' }).catch(function() {});
      wx.showToast({ title: '已记账', icon: 'success' });
      this.setData({ showCreate: false });
      this.loadData();
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  deleteTx: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: function(res) {
        if (res.confirm) {
          ledgerModule.deleteTransaction(id);
          self.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  formatAmount: function(minor) {
    return (minor / 100).toFixed(2);
  }
});
