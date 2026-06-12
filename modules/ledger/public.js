// modules/ledger/public.js

const manifest = require('./manifest');
const model = require('./model');
const repository = require('./repository');

module.exports = {
  manifest,

  init() {
    repository.initCategories();
    repository.initAccounts();
  },

  // Account
  getAccounts() {
    return repository.getAllAccounts();
  },
  getAccountById(id) {
    return repository.getAccountById(id);
  },
  createAccount(data) {
    var account = model.createAccount(data);
    return repository.saveAccount(account);
  },
  updateAccount(id, updates) {
    var account = repository.getAccountById(id);
    if (!account) throw new Error('Account not found');
    Object.assign(account, updates);
    return repository.saveAccount(account);
  },

  // Transaction
  createTransaction(data) {
    var tx = model.createTransaction(data);
    var validation = model.validateTransaction(tx);
    if (!validation.valid) {
      throw new Error('Validation failed: ' + validation.errors.join(', '));
    }
    return repository.saveTransaction(tx);
  },
  deleteTransaction(id) {
    repository.deleteTransaction(id);
  },
  getRecentTransactions(limit) {
    var all = repository.getAllTransactions();
    all.sort(function(a, b) { return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt); });
    return all.slice(0, limit || 20);
  },

  // Monthly
  getMonthTransactions(year, month) {
    return repository.getTransactionsByMonth(year, month);
  },
  getMonthlySummary(year, month) {
    return repository.getMonthlySummary(year, month);
  },

  // Category
  getCategories() {
    return repository.getAllCategories();
  },
  getExpenseCategories() {
    return repository.getCategoriesByType('expense');
  },
  getIncomeCategories() {
    return repository.getCategoriesByType('income');
  },

  // Stats
  getStats() {
    var accounts = repository.getAllAccounts();
    var totalBalance = 0;
    accounts.forEach(function(a) { totalBalance += a.currentBalanceMinor; });
    var now = new Date();
    var summary = repository.getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
    return {
      accountCount: accounts.length,
      totalBalance: totalBalance,
      monthIncome: summary.income,
      monthExpense: summary.expense,
      monthBalance: summary.balance
    };
  }
};
