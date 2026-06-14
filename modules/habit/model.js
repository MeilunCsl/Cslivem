// modules/habit/model.js
// Habit domain model

function createHabit(data) {
  return {
    id: data.id || ('h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)),
    name: data.name || '',
    icon: data.icon || '\u2713',
    color: data.color || '#6C5CE7',
    frequency: data.frequency || 'daily', // daily, weekly
    target: data.target || 1,
    createdAt: data.createdAt || new Date().toISOString(),
    archived: data.archived || false
  };
}

function createCheckin(data) {
  var today = new Date();
  var dateStr = data.date || (today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0'));
  return {
    habitId: data.habitId,
    date: dateStr,
    timestamp: data.timestamp || Date.now()
  };
}

function validateHabit(data) {
  if (!data.name || !data.name.trim()) return '\u4e60\u60ef\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a';
  if (data.name.length > 20) return '\u4e60\u60ef\u540d\u79f0\u4e0d\u80fd\u8d85\u8fc720\u5b57';
  return null;
}

module.exports = {
  createHabit: createHabit,
  createCheckin: createCheckin,
  validateHabit: validateHabit
};
