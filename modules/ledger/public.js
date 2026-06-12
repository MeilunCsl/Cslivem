const manifest = require('./manifest');

module.exports = {
  manifest,

  getAccounts() {
    return [
      { id: 'acc-1', name: '微信钱包', balance: 1250.50, icon: '💳' },
      { id: 'acc-2', name: '支付宝', balance: 3200.00, icon: '💳' },
      { id: 'acc-3', name: '银行卡', balance: 15600.00, icon: '🏦' }
    ];
  },

  getRecentTransactions(limit = 10) {
    return [];
  },

  getMonthlySummary(year, month) {
    return { income: 0, expense: 0, balance: 0 };
  }
};