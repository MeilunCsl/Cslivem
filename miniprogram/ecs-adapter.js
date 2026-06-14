// miniprogram/ecs-adapter.js
// ECS ????? v1.5.0
// ????????? + ???? + ???? + ???? + ??/??
// ?? OpenAI ?? REST API?ECS / DashScope / ?????

var storage = require('./storage');
var localStorage = require('../core/storage/local-storage');
var keys = require('../core/storage/storage-keys');
var apiConfig = require('./api-config');
var eventBus = require('./event-bus');

var QUEUE_KEY = keys.SYNC_QUEUE;
var META_KEY = keys.SYNC_META;

// ===== Persistence Helpers =====
function loadQueue() { return localStorage.getJSON(QUEUE_KEY, []); }
function saveQueue(q) { localStorage.setJSON(QUEUE_KEY, q); }
function loadMeta() {
  return localStorage.getJSON(META_KEY, {
    lastSyncAt: null,
    lastUploadAt: null,
    lastDownloadAt: null,
    version: 0,
    conflictCount: 0
  });
}
function saveMeta(m) { localStorage.setJSON(META_KEY, m); }

// ===== Data Packaging =====
function packageLocalData() {
  var graph = localStorage.getJSON(keys.GRAPH, { nodes: {}, edges: {} });
  var notes = localStorage.getJSON(keys.NOTES, []);
  var inbox = localStorage.getJSON(keys.INBOX, []);
  var calendarEvents = localStorage.getJSON(keys.CALENDAR_EVENTS, []);
  var calendarDiary = localStorage.getJSON(keys.CALENDAR_DIARY, []);
  var ledgerAccounts = localStorage.getJSON(keys.LEDGER_ACCOUNTS, []);
  var ledgerTransactions = localStorage.getJSON(keys.LEDGER_TRANSACTIONS, []);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    graph: {
      nodes: graph.nodes || {},
      edges: graph.edges || {},
      version: graph.version || 1
    },
    notes: notes,
    inbox: inbox,
    calendar: {
      events: calendarEvents,
      diary: calendarDiary
    },
    ledger: {
      accounts: ledgerAccounts,
      transactions: ledgerTransactions
    }
  };
}

function importDataToStore(data) {
  if (!data || !data.version) {
    return { success: false, error: 'Invalid data format' };
  }

  var imported = { graph: 0, notes: 0, calendar: 0, ledger: 0 };

  // Import graph
  if (data.graph) {
    var existingGraph = localStorage.getJSON(keys.GRAPH, { nodes: {}, edges: {} });
    var mergedNodes = Object.assign({}, existingGraph.nodes, data.graph.nodes);
    var mergedEdges = Object.assign({}, existingGraph.edges, data.graph.edges);
    existingGraph.nodes = mergedNodes;
    existingGraph.edges = mergedEdges;
    existingGraph.updatedAt = new Date().toISOString();
    // Rebuild indexes
    existingGraph.outEdges = {};
    existingGraph.inEdges = {};
    existingGraph.nodeToEdges = {};
    Object.keys(existingGraph.edges).forEach(function(eid) {
      var edge = existingGraph.edges[eid];
      if (!existingGraph.outEdges[edge.source]) existingGraph.outEdges[edge.source] = [];
      if (!existingGraph.inEdges[edge.target]) existingGraph.inEdges[edge.target] = [];
      if (!existingGraph.nodeToEdges[edge.source]) existingGraph.nodeToEdges[edge.source] = [];
      if (!existingGraph.nodeToEdges[edge.target]) existingGraph.nodeToEdges[edge.target] = [];
      existingGraph.outEdges[edge.source].push(eid);
      existingGraph.inEdges[edge.target].push(eid);
      if (existingGraph.nodeToEdges[edge.source].indexOf(eid) < 0) existingGraph.nodeToEdges[edge.source].push(eid);
      if (existingGraph.nodeToEdges[edge.target].indexOf(eid) < 0) existingGraph.nodeToEdges[edge.target].push(eid);
    });
    localStorage.setJSON(keys.GRAPH, existingGraph);
    imported.graph = Object.keys(mergedNodes).length;
  }

  // Import notes (merge by id)
  if (data.notes && Array.isArray(data.notes)) {
    var existingNotes = localStorage.getJSON(keys.NOTES, []);
    var noteMap = {};
    existingNotes.forEach(function(n) { noteMap[n.id] = n; });
    data.notes.forEach(function(n) {
      if (!noteMap[n.id] || (n.updatedAt && n.updatedAt > (noteMap[n.id].updatedAt || ''))) {
        noteMap[n.id] = n;
      }
    });
    var mergedNotes = Object.values(noteMap);
    localStorage.setJSON(keys.NOTES, mergedNotes);
    imported.notes = mergedNotes.length;
  }

  // Import calendar
  if (data.calendar) {
    if (data.calendar.events && Array.isArray(data.calendar.events)) {
      var existingEvents = localStorage.getJSON(keys.CALENDAR_EVENTS, []);
      var eventMap = {};
      existingEvents.forEach(function(e) { eventMap[e.id] = e; });
      data.calendar.events.forEach(function(e) {
        if (!eventMap[e.id]) eventMap[e.id] = e;
      });
      localStorage.setJSON(keys.CALENDAR_EVENTS, Object.values(eventMap));
      imported.calendar = Object.values(eventMap).length;
    }
    if (data.calendar.diary && Array.isArray(data.calendar.diary)) {
      var existingDiary = localStorage.getJSON(keys.CALENDAR_DIARY, []);
      var diaryMap = {};
      existingDiary.forEach(function(d) { diaryMap[d.date] = d; });
      data.calendar.diary.forEach(function(d) {
        if (!diaryMap[d.date] || (d.updatedAt && d.updatedAt > (diaryMap[d.date].updatedAt || ''))) {
          diaryMap[d.date] = d;
        }
      });
      localStorage.setJSON(keys.CALENDAR_DIARY, Object.values(diaryMap));
    }
  }

  // Import ledger
  if (data.ledger) {
    if (data.ledger.accounts && Array.isArray(data.ledger.accounts)) {
      localStorage.setJSON(keys.LEDGER_ACCOUNTS, data.ledger.accounts);
      imported.ledger = data.ledger.accounts.length;
    }
    if (data.ledger.transactions && Array.isArray(data.ledger.transactions)) {
      localStorage.setJSON(keys.LEDGER_TRANSACTIONS, data.ledger.transactions);
    }
  }

  return { success: true, imported: imported };
}

// ===== Conflict Resolution =====
function resolveConflict(local, remote) {
  if (!local && !remote) return null;
  if (!local) return remote;
  if (!remote) return local;
  // Last-write-wins by updatedAt
  var localTime = local.updatedAt || local.createdAt || '';
  var remoteTime = remote.updatedAt || remote.createdAt || '';
  return localTime >= remoteTime ? local : remote;
}

function mergeNodes(localNodes, remoteNodes) {
  var merged = {};
  var allIds = {};
  Object.keys(localNodes).forEach(function(id) { allIds[id] = true; });
  Object.keys(remoteNodes).forEach(function(id) { allIds[id] = true; });

  Object.keys(allIds).forEach(function(id) {
    merged[id] = resolveConflict(localNodes[id], remoteNodes[id]);
  });
  return merged;
}

// ===== ECS HTTP Client =====
function ecsRequest(path, method, body) {
  var config = apiConfig.getConfig();
  var ecs = config.ecs;
  if (!ecs || !ecs.enabled || !ecs.endpoint) {
    return Promise.reject(new Error('ECS not configured'));
  }

  var url = ecs.endpoint.replace(/\/+$/, '') + path;

  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method || 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (ecs.apiKey || '')
      },
      data: body || undefined,
      timeout: ecs.timeout || 30000,
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error('ECS error ' + res.statusCode + ': ' + JSON.stringify(res.data)));
        }
      },
      fail: function(err) {
        reject(new Error('ECS network error: ' + (err.errMsg || 'unknown')));
      }
    });
  });
}

// ===== Module Export =====
module.exports = {
  init: function() {
    console.log('[ECS] adapter v1.5.0 initialized');
    eventBus.emit('ecs:ready', { available: this.isAvailable() });
  },

  isAvailable: function() {
    var config = apiConfig.getConfig();
    return !!(config.ecs && config.ecs.enabled && config.ecs.endpoint);
  },

  // Add operation to sync queue
  enqueue: function(operation) {
    var queue = loadQueue();
    var op = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      type: operation.type || 'unknown',
      module: operation.module || '',
      entityId: operation.entityId || '',
      data: operation.data || null,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retries: 0
    };
    queue.push(op);
    saveQueue(queue);
    eventBus.emit('ecs:enqueued', op);
    return op;
  },

  // Full sync: upload local changes, download remote changes
  sync: function() {
    var self = this;
    if (!self.isAvailable()) {
      return Promise.resolve({ synced: 0, message: 'ECS not configured', mode: 'offline' });
    }

    var queue = loadQueue();
    var pending = queue.filter(function(op) { return op.status === 'pending'; });

    // Upload local data
    var localData = packageLocalData();
    return ecsRequest('/sync/upload', 'POST', {
      operations: pending,
      snapshot: localData
    }).then(function(uploadResult) {
      // Mark uploaded operations as done
      queue.forEach(function(op) {
        if (op.status === 'pending') op.status = 'done';
      });
      saveQueue(queue);

      // Download remote changes
      return ecsRequest('/sync/download', 'GET').then(function(remoteData) {
        var mergeResult = { success: true };
        if (remoteData && remoteData.snapshot) {
          mergeResult = importDataToStore(remoteData.snapshot);
        }

        var meta = loadMeta();
        meta.lastSyncAt = new Date().toISOString();
        meta.lastUploadAt = new Date().toISOString();
        meta.lastDownloadAt = new Date().toISOString();
        meta.version += 1;
        saveMeta(meta);

        eventBus.emit('ecs:synced', {
          uploaded: pending.length,
          downloaded: remoteData ? 1 : 0,
          merged: mergeResult
        });

        return {
          synced: pending.length,
          downloaded: remoteData ? 1 : 0,
          merged: mergeResult,
          message: 'Sync complete'
        };
      });
    }).catch(function(err) {
      // Mark failed operations
      queue.forEach(function(op) {
        if (op.status === 'pending') {
          op.retries = (op.retries || 0) + 1;
          if (op.retries >= 3) op.status = 'failed';
        }
      });
      saveQueue(queue);
      console.error('[ECS] sync error:', err.message);
      return { synced: 0, error: err.message, message: 'Sync failed' };
    });
  },

  // Upload local snapshot to ECS
  upload: function() {
    var data = packageLocalData();
    return ecsRequest('/sync/upload', 'POST', { snapshot: data }).then(function(result) {
      var meta = loadMeta();
      meta.lastUploadAt = new Date().toISOString();
      meta.version += 1;
      saveMeta(meta);
      return { success: true, data: result };
    }).catch(function(err) {
      return { success: false, error: err.message };
    });
  },

  // Download from ECS and merge
  download: function() {
    return ecsRequest('/sync/download', 'GET').then(function(remoteData) {
      if (!remoteData || !remoteData.snapshot) {
        return { success: true, imported: {}, message: 'No remote data' };
      }
      var result = importDataToStore(remoteData.snapshot);
      var meta = loadMeta();
      meta.lastDownloadAt = new Date().toISOString();
      saveMeta(meta);
      return { success: true, imported: result.imported };
    }).catch(function(err) {
      return { success: false, error: err.message };
    });
  },

  // Export all local data as JSON string
  exportData: function() {
    var data = packageLocalData();
    return JSON.stringify(data, null, 2);
  },

  // Import data from JSON string
  importData: function(jsonString) {
    try {
      var data = JSON.parse(jsonString);
      var result = importDataToStore(data);
      if (result.success) {
        eventBus.emit('ecs:imported', result.imported);
      }
      return result;
    } catch (e) {
      return { success: false, error: 'JSON parse error: ' + e.message };
    }
  },

  // Get sync status
  getStatus: function() {
    var queue = loadQueue();
    var meta = loadMeta();
    var pending = queue.filter(function(op) { return op.status === 'pending'; }).length;
    var failed = queue.filter(function(op) { return op.status === 'failed'; }).length;
    return {
      available: this.isAvailable(),
      pending: pending,
      failed: failed,
      total: queue.length,
      lastSyncAt: meta.lastSyncAt,
      lastUploadAt: meta.lastUploadAt,
      lastDownloadAt: meta.lastDownloadAt,
      version: meta.version,
      conflictCount: meta.conflictCount || 0
    };
  },

  // Retry failed operations
  retryFailed: function() {
    var queue = loadQueue();
    var count = 0;
    queue.forEach(function(op) {
      if (op.status === 'failed' && op.retries < 5) {
        op.status = 'pending';
        count++;
      }
    });
    saveQueue(queue);
    return count;
  },

  // Clear sync queue
  clearQueue: function() {
    saveQueue([]);
    return true;
  },

  // Clean completed operations
  cleanup: function() {
    var queue = loadQueue().filter(function(op) { return op.status !== 'done'; });
    saveQueue(queue);
    return queue.length;
  },

  // Get packaged data for preview
  getPackagePreview: function() {
    var data = packageLocalData();
    return {
      graphNodes: Object.keys(data.graph.nodes).length,
      graphEdges: Object.keys(data.graph.edges).length,
      notes: data.notes.length,
      inbox: data.inbox.length,
      calendarEvents: data.calendar.events.length,
      ledgerTransactions: data.ledger.transactions.length,
      exportedAt: data.exportedAt
    };
  },

  // Update ECS config
  updateConfig: function(ecsSettings) {
    return apiConfig.updateProvider('ecs', ecsSettings);
  },

  getConfig: function() {
    var config = apiConfig.getConfig();
    return config.ecs || {};
  }
};
