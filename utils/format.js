// utils/format.js - 日期与金额格式化工具

function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

function formatDate(date) {
  if (!date) date = new Date();
  if (typeof date === 'string') date = new Date(date);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateCN(date) {
  if (!date) date = new Date();
  if (typeof date === 'string') date = new Date(date);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const weeks = ['日', '一', '二', '三', '四', '五', '六'];
  const w = weeks[date.getDay()];
  return `${m}月${d}日 周${w}`;
}

function formatMoney(amountMinor) {
  if (typeof amountMinor !== 'number') return '0.00';
  const yuan = (amountMinor / 100).toFixed(2);
  return yuan.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatMoneyCN(amountMinor) {
  return '¥' + formatMoney(amountMinor);
}

function getRelativeTime(date) {
  if (typeof date === 'string') date = new Date(date);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return minutes + '分钟前';
  if (hours < 24) return hours + '小时前';
  if (days < 7) return days + '天前';
  return formatDate(date);
}

module.exports = {
  generateId,
  formatDate,
  formatDateCN,
  formatMoney,
  formatMoneyCN,
  getRelativeTime
};