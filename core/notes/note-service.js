/**
 * 笔记 CRUD 服务层
 * 职责：笔记的创建、读取、更新、删除，以及保存时自动触发图谱更新
 */

const { getJSON, setJSON } = require('../storage/local-storage');
const { NOTES } = require('../storage/storage-keys');
const { upsertNode } = require('../graph/graph-engine');
const { parseWikiLinks, extractLinkedTitles } = require('./wiki-link-parser');

// ── 工具函数 ─────────────────────────────────────────────

function generateId() {
  return 'n_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

function now() {
  return new Date().toISOString();
}

function loadAll() {
  return getJSON(NOTES) || [];
}

function saveAll(notes) {
  setJSON(NOTES, notes);
}

// ── 图谱同步 ─────────────────────────────────────────────

/**
 * 将笔记信息同步到图谱引擎
 */
function syncGraph(note) {
  // 1. 创建 / 更新 note 节点
  upsertNode({
    id: note.nodeId || note.id,
    type: 'note',
    title: note.title,
    data: {
      noteId: note.id,
      summary: note.summary || '',
      tags: note.tags || [],
    },
  });

  // 2. 为每个 tag 创建 tag 节点并建立边
  if (note.tags && note.tags.length > 0) {
    for (const tag of note.tags) {
      const tagNodeId = 'tag_' + tag.toLowerCase().replace(/\s+/g, '_');
      upsertNode({
        id: tagNodeId,
        type: 'tag',
        title: tag,
        data: {},
      });
      upsertNode({
        id: note.nodeId || note.id,
        type: 'note',
        title: note.title,
        data: {},
        edges: [{ targetId: tagNodeId, type: 'has_tag' }],
      });
    }
  }

  // 3. 解析 WikiLink，为每个 link 创建 concept 节点并建立边
  const links = parseWikiLinks(note.content);
  if (links.length > 0) {
    const linkedTitles = [];
    for (const link of links) {
      const conceptNodeId = 'concept_' + link.target.toLowerCase().replace(/\s+/g, '_');
      upsertNode({
        id: conceptNodeId,
        type: 'concept',
        title: link.target,
        data: {},
      });
      upsertNode({
        id: note.nodeId || note.id,
        type: 'note',
        title: note.title,
        data: {},
        edges: [{ targetId: conceptNodeId, type: 'references' }],
      });
      linkedTitles.push(link.target);
    }
    // 更新 note 的 linkedTitles（去重）
    note.linkedTitles = [...new Set([...(note.linkedTitles || []), ...linkedTitles])];
  }
}

// ── CRUD ─────────────────────────────────────────────────

/**
 * 创建笔记
 * @param {object} data - { title, content, summary?, tags? }
 * @returns {object} note
 */
function createNote(data) {
  const notes = loadAll();

  const id = generateId();
  const nodeId = id;
  const timestamp = now();
  const linkedTitles = extractLinkedTitles(data.content || '');

  const note = {
    id,
    title: data.title || '',
    content: data.content || '',
    summary: data.summary || '',
    tags: data.tags || [],
    linkedTitles,
    nodeId,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  };

  notes.push(note);
  saveAll(notes);

  syncGraph(note);
  enrichNote(id);
  return note;
}

/**
 * 获取单条笔记
 * @param {string} id
 * @returns {object|null}
 */
function getNote(id) {
  const notes = loadAll();
  return notes.find((n) => n.id === id && !n.deletedAt) || null;
}

/**
 * 更新笔记
 * @param {string} id
 * @param {object} data - 可更新字段：title, content, summary, tags
 * @returns {object|null}
 */
function updateNote(id, data) {
  const notes = loadAll();
  const idx = notes.findIndex((n) => n.id === id && !n.deletedAt);
  if (idx === -1) return null;

  const note = notes[idx];

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;
  if (data.summary !== undefined) note.summary = data.summary;
  if (data.tags !== undefined) note.tags = data.tags;

  note.updatedAt = now();
  note.linkedTitles = extractLinkedTitles(note.content);

  notes[idx] = note;
  saveAll(notes);

  syncGraph(note);
  enrichNote(id);
  return note;
}

/**
 * 删除笔记（软删除）
 * @param {string} id
 * @returns {boolean}
 */
function deleteNote(id) {
  const notes = loadAll();
  const idx = notes.findIndex((n) => n.id === id && !n.deletedAt);
  if (idx === -1) return false;

  notes[idx].deletedAt = now();
  saveAll(notes);

  return true;
}

/**
 * 列表笔记
 * @param {object} options
 * @param {number}  [options.limit=20]
 * @param {number}  [options.offset=0]
 * @param {string[]} [options.tags]
 * @param {string}  [options.search]
 * @returns {object[]}
 */
function listNotes(options = {}) {
  const { limit = 20, offset = 0, tags, search } = options;

  let results = loadAll().filter((n) => !n.deletedAt);

  // 按标签过滤
  if (tags && tags.length > 0) {
    const tagSet = new Set(tags.map((t) => t.toLowerCase()));
    results = results.filter((n) =>
      (n.tags || []).some((t) => tagSet.has(t.toLowerCase()))
    );
  }

  // 按关键词搜索（标题+内容+标签）
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((n) => {
      const inTitle = (n.title || '').toLowerCase().includes(q);
      const inContent = (n.content || '').toLowerCase().includes(q);
      const inTags = (n.tags || []).some((t) => t.toLowerCase().includes(q));
      return inTitle || inContent || inTags;
    });
  }

  // 按更新时间倒序
  results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return results.slice(offset, offset + limit);
}

/**
 * 全文搜索（标题+内容+标签）
 * @param {string} query
 * @returns {object[]}
 */
function searchNotes(query) {
  return listNotes({ search: query, limit: 100 });
}

/**
 * 获取最近笔记
 * @param {number} [limit=10]
 * @returns {object[]}
 */
function getRecentNotes(limit = 10) {
  const notes = loadAll()
    .filter((n) => !n.deletedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return notes.slice(0, limit);
}

// ── 导出 ─────────────────────────────────────────────────


/**
 * 自动丰富笔记（生成摘要 + 标签）
 * 使用本地降级能力，不阻塞主流程
 */
function enrichNote(noteId) {
  const note = getNote(noteId);
  if (!note || !note.content) return;

  // Auto-generate summary if empty
  if (!note.summary) {
    localFallback.generateSummary(note.content, 120).then(function(summary) {
      const notes = loadAll();
      const idx = notes.findIndex((n) => n.id === noteId);
      if (idx >= 0) {
        notes[idx].summary = summary;
        saveAll(notes);
      }
    }).catch(function() {});
  }

  // Auto-extract tags if empty
  if (!note.tags || note.tags.length === 0) {
    localFallback.extractTags(note.content).then(function(tags) {
      const notes = loadAll();
      const idx = notes.findIndex((n) => n.id === noteId);
      if (idx >= 0 && tags.length > 0) {
        const existing = notes[idx].tags || [];
        const merged = [...new Set([...existing, ...tags.slice(0, 5)])];
        notes[idx].tags = merged;
        saveAll(notes);
        // Sync new tag nodes to graph
        syncGraph(notes[idx]);
      }
    }).catch(function() {});
  }
}

module.exports = {
  createNote,
  getNote,
  updateNote,
  deleteNote,
  listNotes,
  searchNotes,
  getRecentNotes,
  enrichNote,
};
