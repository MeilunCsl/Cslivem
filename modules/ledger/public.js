// modules/ledger/public.js - 记账模块唯一对外出口
const manifest = require('./manifest');

module.exports = {
  manifest,

  /** 获取本月摘要 */
  getMonthlySummary(year, month) {
    console.log('[Ledger] getMonthlySummary:', year, month);
    return { income: 0, expense: 0, balance: 0 };
  },

  /** 获取最近流水 */
  getRecentTransactions(limit = 10) {
    console.log('[Ledger] getRecentTransactions, limit:', limit);
    return [];
  },

  /** 创建流水 */
  createTransaction(data) {
    console.log('[Ledger] createTransaction:', data);
    return { id: 'txn-new', ...data };
  },

  /** 获取账户列表 */
  getAccounts() {
    return [
      { id: 'acc-1', name: '现金', type: 'cash', balance: 0 },
      { id: 'acc-2', name: '微信', type: 'wechat', balance: 0 },
      { id: 'acc-3', name: '支付宝', type: 'alipay', balance: 0 }
    ];
  }
};
