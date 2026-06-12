// modules/ledger/model.js
// 领域模型: Account, Transaction, Category
// 金额统一使用最小货币单位整数

const { generateId } = require('../../utils/format');

// ===== Account =====
function createAccount(data) {
  data = data || {};
  var now = new Date().toISOString();
  return {
    id: data.id || generateId(),
    name: data.name || '',
    type: data.type || 'cash',
    icon: data.icon || '💳',
    currency: data.currency || 'CNY',
    initialBalanceMinor: data.initialBalanceMinor || 0,
    currentBalanceMinor: data.currentBalanceMinor || data.initialBalanceMinor || 0,
    sortOrder: data.sortOrder || 0,
    isArchived: data.isArchived || false,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

// ===== Category =====
var DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'cat-food', name: '餐饮', type: 'expense', icon: '🍜', color: '#FF6B6B' },
  { id: 'cat-transport', name: '交通', type: 'expense', icon: '🚗', color: '#4ECDC4' },
  { id: 'cat-housing', name: '住房', type: 'expense', icon: '🏠', color: '#45B7D1' },
  { id: 'cat-shopping', name: '购物', type: 'expense', icon: '🛍', color: '#96CEB4' },
  { id: 'cat-entertainment', name: '娱乐', type: 'expense', icon: '🎬', color: '#DDA0DD' },
  { id: 'cat-medical', name: '医疗', type: 'expense', icon: '🏥', color: '#FF8C94' },
  { id: 'cat-education', name: '教育', type: 'expense', icon: '📚', color: '#A8D8EA' },
  { id: 'cat-other', name: '其他', type: 'expense', icon: '💼', color: '#B8B8D1' }
];

var DEFAULT_INCOME_CATEGORIES = [
  { id: 'cat-salary', name: '工资', type: 'income', icon: '💰', color: '#24A148' },
  { id: 'cat-bonus', name: '奖金', type: 'income', icon: '🎁', color: '#2DB55D' },
  { id: 'cat-investment', name: '投资', type: 'income', icon: '📈', color: '#5B4CFF' },
  { id: 'cat-freelance', name: '兼职', type: 'income', icon: '💻', color: '#3A7BFF' },
  { id: 'cat-gift', name: '礼金', type: 'income', icon: '🎁', color: '#F59E0B' },
  { id: 'cat-other-income', name: '其他', type: 'income', icon: '💵', color: '#B8B8D1' }
];

function createCategory(data) {
  data = data || {};
  return {
    id: data.id || generateId(),
    name: data.name || '',
    type: data.type || 'expense',
    icon: data.icon || '💼',
    color: data.color || '#B8B8D1',
    isDefault: data.isDefault || false
  };
}

// ===== Transaction =====
function createTransaction(data) {
  data = data || {};
  var now = new Date().toISOString();
  return {
    id: data.id || generateId(),
    type: data.type || 'expense',
    amountMinor: data.amountMinor || 0,
    currency: data.currency || 'CNY',
    categoryId: data.categoryId || '',
    accountId: data.accountId || '',
    toAccountId: data.toAccountId || null,
    date: data.date || new Date().toISOString().split('T')[0],
    time: data.time || '',
    merchant: data.merchant || '',
    note: data.note || '',
    tags: data.tags || [],
    status: data.status || 'confirmed',
    transferGroupId: data.transferGroupId || null,
    idempotencyKey: data.idempotencyKey || generateId(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

function validateTransaction(tx) {
  var errors = [];
  if (!tx.type) errors.push('Type is required');
  if (!tx.amountMinor || tx.amountMinor <= 0) errors.push('Amount must be positive');
  if (!tx.date) errors.push('Date is required');
  if (!tx.accountId) errors.push('Account is required');
  if (tx.type === 'transfer' && !tx.toAccountId) errors.push('Transfer requires toAccountId');
  return { valid: errors.length === 0, errors: errors };
}

module.exports = {
  createAccount: createAccount,
  createCategory: createCategory,
  createTransaction: createTransaction,
  validateTransaction: validateTransaction,
  DEFAULT_EXPENSE_CATEGORIES: DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES: DEFAULT_INCOME_CATEGORIES
};
