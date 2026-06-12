// miniprogram/sync-manager.js
// 数据同步管理器（本地操作队列 + 冲突解决桩）
// 当前版本仅本地持久化，后续接入云端

var storage = require('./storage');

var QUEUE_KEY = 'sync_operations';
var META_KEY = 'sync_meta';

function loadQueue() {
  return storage.get(QUEUE_KEY) || [];
}
function saveQueue(queue) {
  storage.set(QUEUE_KEY, queue);
}
function loadMeta() {
  return storage.get(META_KEY) || { lastSyncAt: null, version: 0 };
}
function saveMeta(meta) {
  storage.set(META_KEY, meta);
}

module.exports = {
  // 初始化
  init: function() {
    var queue = loadQueue();
    console.log('[Sync] init, pending ops:', queue.length);
  },

  // 添加操作到队列
  enqueue: function(operation) {
    var queue = loadQueue();
    var op = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      type: operation.type || 'unknown',
      module: operation.module || '',
      entityId: operation.entityId || '',
      data: operation.data || null,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending'
    };
    queue.push(op);
    saveQueue(queue);
    console.log('[Sync] enqueued:', op.type, op.module, op.entityId);
    return op;
  },

  // 获取待同步操作
  getPending: function() {
    return loadQueue().filter(function(op) { return op.status === 'pending'; });
  },

  // 标记操作完成
  markDone: function(opId) {
    var queue = loadQueue();
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].id === opId) {
        queue[i].status = 'done';
        break;
      }
    }
    saveQueue(queue);
  },

  // 标记操作失败
  markFailed: function(opId, error) {
    var queue = loadQueue();
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].id === opId) {
        queue[i].status = 'failed';
        queue[i].retries += 1;
        queue[i].lastError = error || '';
        break;
      }
    }
    saveQueue(queue);
  },

  // 清理已完成操作
  cleanup: function() {
    var queue = loadQueue().filter(function(op) { return op.status !== 'done'; });
    saveQueue(queue);
    return queue.length;
  },

  // 获取队列状态
  getStatus: function() {
    var queue = loadQueue();
    var pending = 0;
    var failed = 0;
    queue.forEach(function(op) {
      if (op.status === 'pending') pending++;
      if (op.status === 'failed') failed++;
    });
    return {
      total: queue.length,
      pending: pending,
      failed: failed,
      lastSyncAt: loadMeta().lastSyncAt
    };
  },

  // 强制重试失败操作
  retryFailed: function() {
    var queue = loadQueue();
    var count = 0;
    queue.forEach(function(op) {
      if (op.status === 'failed' && op.retries < 3) {
        op.status = 'pending';
        count++;
      }
    });
    saveQueue(queue);
    return count;
  },

  // 模拟同步（桩实现）
  sync: function() {
    var pending = this.getPending();
    console.log('[Sync] sync called, pending:', pending.length);
    var meta = loadMeta();
    meta.lastSyncAt = new Date().toISOString();
    meta.version += 1;
    saveMeta(meta);
    return Promise.resolve({
      synced: 0,
      failed: 0,
      message: '同步功能开发中'
    });
  },

  // 冲突解决策略（桩）
  resolveConflict: function(local, remote) {
    // 默认策略：最后修改时间较新的胜出
    if (!local || !remote) return local || remote;
    var localTime = local.updatedAt || local.createdAt || '';
    var remoteTime = remote.updatedAt || remote.createdAt || '';
    return localTime >= remoteTime ? local : remote;
  }
};
