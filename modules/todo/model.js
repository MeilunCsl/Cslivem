// modules/todo/model.js
function createTodo(data) {
  return {
    id: data.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    title: data.title || '',
    description: data.description || '',
    completed: data.completed || false,
    priority: data.priority || 'normal',
    dueDate: data.dueDate || '',
    tags: data.tags || [],
    listId: data.listId || 'default',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    completedAt: data.completedAt || null
  };
}

function validateTodo(todo) {
  var errors = [];
  if (!todo.title || todo.title.trim().length === 0) errors.push('Title is required');
  if (todo.title && todo.title.length > 200) errors.push('Title too long');
  return { valid: errors.length === 0, errors: errors };
}

function createList(data) {
  return {
    id: data.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    name: data.name || '新清单',
    icon: data.icon || '☑',
    color: data.color || '#5B4CFF',
    createdAt: data.createdAt || new Date().toISOString()
  };
}

var DEFAULT_LISTS = [
  { id: 'default', name: '默认', icon: '☑', color: '#5B4CFF' },
  { id: 'work', name: '工作', icon: '▣', color: '#3A7BFF' },
  { id: 'personal', name: '生活', icon: '◆', color: '#00D4D9' },
  { id: 'shopping', name: '购物', icon: '▢', color: '#F59E0B' }
];

module.exports = {
  createTodo: createTodo,
  validateTodo: validateTodo,
  createList: createList,
  DEFAULT_LISTS: DEFAULT_LISTS
};
