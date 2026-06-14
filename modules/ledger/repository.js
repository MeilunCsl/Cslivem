// modules/ledger/repository.js
const storage = require('../../miniprogram/storage');
const model = require('./model');

var ACCOUNTS_KEY = 'ledger_accounts';
var TRANSACTIONS_KEY = 'ledger_transactions';
var CATEGORIES_KEY = 'ledger_categories';
var BUDGETS_KEY = 'ledger_budgets';

function loadAccounts() { return storage.get(ACCOUNTS_KEY) || []; }
function saveAccounts(list) { storage.set(ACCOUNTS_KEY, list); }
function loadTransactions() { return storage.get(TRANSACTIONS_KEY) || []; }
function saveTransactions(list) { storage.set(TRANSACTIONS_KEY, list); }
function loadCategories() { return storage.get(CATEGORIES_KEY) || null; }
function saveCategories(list) { storage.set(CATEGORIES_KEY, list); }
function loadBudgets() { return storage.get(BUDGETS_KEY) || []; }
function saveBudgets(list) { storage.set(BUDGETS_KEY, list); }

function initCategories() {
  if (!loadCategories()) {
    var all = model.DEFAULT_EXPENSE_CATEGORIES.concat(model.DEFAULT_INCOME_CATEGORIES);
    saveCategories(all);
  }
}

function initAccounts() {
  if (loadAccounts().length === 0) {
    var defaults = [
      model.createAccount({ name: '现金', type: 'cash', icon: '💵', initialBalanceMinor: 0 }),
      model.createAccount({ name: '微信', type: 'wechat', icon: '📱', initialBalanceMinor: 0 }),
      model.createAccount({ name: '支付宝', type: 'alipay', icon: '📲', initialBalanceMinor: 0 }),
      model.createAccount({ name: '银行卡', type: 'bank', icon: '🏦', initialBalanceMinor: 0 })
    ];
    saveAccounts(defaults);
  }
}

// ===== Account =====
function getAllAccounts() {
  return loadAccounts().filter(function(a) { return !a.isArchived; });
}
function getAccountById(id) {
  return loadAccounts().find(function(a) { return a.id === id; }) || null;
}
function saveAccount(account) {
  var list = loadAccounts();
  var idx = list.findIndex(function(a) { return a.id === account.id; });
  account.updatedAt = new Date().toISOString();
  if (idx >= 0) { list[idx] = account; } else { list.push(account); }
  saveAccounts(list);
  return account;
}
function deleteAccount(id) {
  var list = loadAccounts().filter(function(a) { return a.id !== id; });
  saveAccounts(list);
}

// ===== Transaction =====
function getAllTransactions() { return loadTransactions(); }
function getTransactionById(id) {
  return loadTransactions().find(function(t) { return t.id === id; }) || null;
}
function saveTransaction(tx) {
  var list = loadTransactions();
  var idx = list.findIndex(function(t) { return t.id === tx.id; });
  tx.updatedAt = new Date().toISOString();
  if (idx >= 0) { list[idx] = tx; } else { list.push(tx); }
  saveTransactions(list);
  updateAccountBalance(tx.accountId);
  if (tx.toAccountId) { updateAccountBalance(tx.toAccountId); }
  return tx;
}
function deleteTransaction(id) {
  var tx = getTransactionById(id);
  var list = loadTransactions().filter(function(t) { return t.id !== id; });
  saveTransactions(list);
  if (tx) {
    updateAccountBalance(tx.accountId);
    if (tx.toAccountId) { updateAccountBalance(tx.toAccountId); }
  }
}
function updateAccountBalance(accountId) {
  var account = getAccountById(accountId);
  if (!account) return;
  var txs = loadTransactions().filter(function(t) {
    return t.accountId === accountId && t.status === 'confirmed';
  });
  var balance = account.initialBalanceMinor;
  txs.forEach(function(t) {
    if (t.type === 'income') balance += t.amountMinor;
    else if (t.type === 'expense') balance -= t.amountMinor;
    else if (t.type === 'transfer' && t.accountId === accountId) balance -= t.amountMinor;
  });
  var incoming = loadTransactions().filter(function(t) {
    return t.toAccountId === accountId && t.type === 'transfer' && t.status === 'confirmed';
  });
  incoming.forEach(function(t) { balance += t.amountMinor; });
  account.currentBalanceMinor = balance;
  saveAccount(account);
}

function getTransactionsByMonth(year, month) {
  var prefix = year + '-' + String(month).padStart(2, '0');
  return loadTransactions().filter(function(t) {
    return t.date && t.date.indexOf(prefix) === 0 && t.status === 'confirmed';
  });
}
function getMonthlySummary(year, month) {
  var txs = getTransactionsByMonth(year, month);
  var income = 0;
  var expense = 0;
  txs.forEach(function(t) {
    if (t.type === 'income') income += t.amountMinor;
    else if (t.type === 'expense') expense += t.amountMinor;
  });
  return { income: income, expense: expense, balance: income - expense };
}

function getAllCategories() { return loadCategories() || []; }
function getCategoriesByType(type) {
  return getAllCategories().filter(function(c) { return c.type === type; });
}
function getCategoryById(id) {
  return getAllCategories().find(function(c) { return c.id === id; }) || null;
}



// ===== Budget =====
function getAllBudgets() { return loadBudgets(); }
function getBudgetByCategory(category, yearMonth) {
  return loadBudgets().find(function(b) { return b.category === category && b.yearMonth === yearMonth; }) || null;
}
function setBudget(data) {
  var budgets = loadBudgets();
  var existing = budgets.findIndex(function(b) { return b.category === data.category && b.yearMonth === data.yearMonth; });
  var budget = {
    category: data.category,
    yearMonth: data.yearMonth,
    amountMinor: data.amountMinor || 0,
    updatedAt: new Date().toISOString()
  };
  if (existing >= 0) {
    budgets[existing] = budget;
  } else {
    budget.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    budgets.push(budget);
  }
  saveBudgets(budgets);
  return budget;
}
function deleteBudget(category, yearMonth) {
  var budgets = loadBudgets().filter(function(b) { return !(b.category === category && b.yearMonth === yearMonth); });
  saveBudgets(budgets);
}
function getBudgetProgress(yearMonth, transactions) {
  var budgets = loadBudgets().filter(function(b) { return b.yearMonth === yearMonth; });
  return budgets.map(function(b) {
    var spent = 0;
    transactions.forEach(function(tx) {
      if (tx.type === 'expense' && tx.category === b.category) {
        spent += Math.abs(tx.amountMinor || 0);
      }
    });
    return {
      category: b.category,
      budgetMinor: b.amountMinor,
      spentMinor: spent,
      remainingMinor: b.amountMinor - spent,
      percentage: b.amountMinor > 0 ? Math.round(spent / b.amountMinor * 100) : 0
    };
  });
}

module.exports = {
  initCategories: initCategories,
  initAccounts: initAccounts,
  getAllAccounts: getAllAccounts,
  getAccountById: getAccountById,
  saveAccount: saveAccount,
  deleteAccount: deleteAccount,
  getAllTransactions: getAllTransactions,
  getTransactionById: getTransactionById,
  saveTransaction: saveTransaction,
  deleteTransaction: deleteTransaction,
  getTransactionsByMonth: getTransactionsByMonth,
  getMonthlySummary: getMonthlySummary,
  getAllCategories: getAllCategories,
  getCategoriesByType: getCategoriesByType,
  getCategoryById: getCategoryById
};
