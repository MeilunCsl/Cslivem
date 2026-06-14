// miniprogram/ecs-adapter.js
// 阿里云 ECS 同步适配器（预留接口）
// 当前为桩实现，后续接入真实 ECS 服务器

var storage = require('./storage');
var apiConfig = require('./api-config');

var SYNC_QUEUE_KEY = 'ecs_sync_queue';
var SYNC_META_KEY = 'ecs_sync_meta';

function loadQueue() { return storage.get(SYNC_QUEUE_KEY) || []; }
function saveQueue(q) { storage.set(SYNC_QUEUE_KEY, q); }
function loadMeta() { return storage.get(SYNC_META_KEY) || { lastSync: null, version: 0 }; }
function saveMeta(m) { storage.set(SYNC_META_KEY, m); }

module.exports = {
  // 初始化
  init: function() {
    console.log('[ECS] adapter initialized (stub mode)');
  },

  // 检查是否可用
  isAvailable: function() {
    var config = apiConfig.getConfig();
    return config.ecs && config.ecs.enabled && config.ecs.endpoint;
  },

  // 添加到同步队列
  enqueue: function(operation) {
    var queue = loadQueue();
    queue.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      type: operation.type || 'unknown',
      module: operation.module || '',
      entityId: operation.entityId || '',
      data: operation.data || null,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    saveQueue(queue);
  },

  // 执行同步（桩）
  sync: function() {
    if (!this.isAvailable()) {
      return Promise.resolve({ synced: 0, message: 'ECS not configured' });
    }
    var queue = loadQueue();
    var pending = queue.filter(function(op) { return op.status === 'pending'; });
    console.log('[ECS] sync called, pending:', pending.length);
    // TODO: implement real sync with ECS server
    var meta = loadMeta();
    meta.lastSync = new Date().toISOString();
    meta.version += 1;
    saveMeta(meta);
    return Promise.resolve({ synced: 0, pending: pending.length, message: 'ECS sync stub' });
  },

  // 下载数据（桩）
  download: function() {
    if (!this.isAvailable()) {
      return Promise.resolve({ downloaded: 0, message: 'ECS not configured' });
    }
    console.log('[ECS] download called (stub)');
    return Promise.resolve({ downloaded: 0, message: 'ECS download stub' });
  },

  // 上传数据（桩）
  upload: function(data) {
    if (!this.isAvailable()) {
      return Promise.resolve({ uploaded: 0, message: 'ECS not configured' });
    }
    console.log('[ECS] upload called (stub)');
    return Promise.resolve({ uploaded: 0, message: 'ECS upload stub' });
  },

  // 获取同步状态
  getStatus: function() {
    var queue = loadQueue();
    var meta = loadMeta();
    return {
      available: this.isAvailable(),
      pending: queue.filter(function(op) { return op.status === 'pending'; }).length,
      lastSync: meta.lastSync,
      version: meta.version
    };
  },

  // 清理已完成操作
  cleanup: function() {
    var queue = loadQueue().filter(function(op) { return op.status !== 'done'; });
    saveQueue(queue);
    return queue.length;
  }
};
