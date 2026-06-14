// pages/todo/todo.js
var todoModule = require('../../modules/todo/public');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    activeList: 'all',
    lists: [],
    todos: [],
    filteredTodos: [],
    showCreate: false,
    newTitle: '',
    newPriority: 'normal',
    newDueDate: '',
    priorities: [
      { key: 'low', label: '低', color: '#24A148' },
      { key: 'normal', label: '中', color: '#3A7BFF' },
      { key: 'high', label: '高', color: '#F59E0B' },
      { key: 'urgent', label: '紧急', color: '#DC3545' }
    ],
    stats: { total: 0, pending: 0, completed: 0, overdue: 0 }
  },

  onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    todoModule.init();
    this.loadData();
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    var lists = todoModule.getLists();
    var todos = todoModule.getAllTodos();
    var stats = todoModule.getStats();
    this.setData({ lists: lists, todos: todos, stats: stats });
    this.filterTodos();
  },

  filterTodos: function() {
    var list = this.data.activeList;
    var todos = this.data.todos;
    var filtered;
    if (list === 'all') {
      filtered = todos;
    } else if (list === 'pending') {
      filtered = todos.filter(function(t) { return !t.completed; });
    } else if (list === 'completed') {
      filtered = todos.filter(function(t) { return t.completed; });
    } else {
      filtered = todos.filter(function(t) { return t.listId === list; });
    }
    filtered.sort(function(a, b) {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      var pri = { urgent: 0, high: 1, normal: 2, low: 3 };
      return (pri[a.priority] || 2) - (pri[b.priority] || 2);
    });
    this.setData({ filteredTodos: filtered });
  },

  onListTap: function(e) {
    var list = e.currentTarget.dataset.list;
    this.setData({ activeList: list });
    this.filterTodos();
  },

  onToggleTodo: function(e) {
    var id = e.currentTarget.dataset.id;
    todoModule.toggleTodo(id);
    this.loadData();
  },

  onDeleteTodo: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '删除待办',
      content: '确认删除这个待办项？',
      success: function(res) {
        if (res.confirm) {
          todoModule.deleteTodo(id);
          self.loadData();
        }
      }
    });
  },

  showCreateForm: function() {
    this.setData({ showCreate: true, newTitle: '', newPriority: 'normal', newDueDate: '' });
  },

  hideCreateForm: function() {
    this.setData({ showCreate: false });
  },

  onTitleInput: function(e) {
    this.setData({ newTitle: e.detail.value });
  },

  onPriorityTap: function(e) {
    this.setData({ newPriority: e.currentTarget.dataset.key });
  },

  onDueDateChange: function(e) {
    this.setData({ newDueDate: e.detail.value });
  },

  onCreateTodo: function() {
    var title = this.data.newTitle.trim();
    if (!title) {
      wx.showToast({ title: '输入待办内容', icon: 'none' });
      return;
    }
    try {
      todoModule.createTodo({
        title: title,
        priority: this.data.newPriority,
        dueDate: this.data.newDueDate,
        listId: 'default'
      });
      this.setData({ showCreate: false });
      this.loadData();
      wx.showToast({ title: '已添加', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  onShowTemplates: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['购物清单', '工作任务', '旅行清单', '学习计划'],
      success: function(res) {
        var templates = [
          ['物品1', '物品2', '物品3'],
          ['任务1', '任务2', '任务3'],
          ['护照', '充电器', '衣物'],
          ['第一章', '第二章', '第三章']
        ];
        var items = templates[res.tapIndex] || [];
        items.forEach(function(item) {
          todoModule.createTodo({ title: item, listId: 'default' });
        });
        self.loadData();
        wx.showToast({ title: '已添加 ' + items.length + ' 项', icon: 'success' });
      }
    });
  }
});
