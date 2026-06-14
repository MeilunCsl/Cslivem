/**
 * local-fallback.js
 * 本地 AI 降级能力
 * 当 AI API 不可用时（未配置 API Key、网络失败、超时），使用本地正则和关键词匹配提供基本能力。
 */

/**
 * 从内容生成标题
 * - 取第一行非空文本，截取前 30 字
 * - 如果第一行是 # 开头的 Markdown 标题，去掉 #
 * @param {string} content
 * @returns {Promise<string>}
 */
function generateTitle(content) {
  return new Promise((resolve) => {
    if (!content || typeof content !== 'string') {
      resolve('');
      return;
    }
    const lines = content.split('\n');
    let firstLine = '';
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed) {
        firstLine = trimmed;
        break;
      }
    }
    // 去掉 Markdown 标题标记
    firstLine = firstLine.replace(/^#{1,6}\s+/, '');
    resolve(firstLine.slice(0, 30));
  });
}

/**
 * 生成摘要
 * - maxLen 默认 120
 * - 去掉 Markdown 标记（#、*、`、>、-）
 * - 截取前 maxLen 字，尝试在句号/问号/感叹号处断句
 * @param {string} content
 * @param {number} [maxLen=120]
 * @returns {Promise<string>}
 */
function generateSummary(content, maxLen) {
  return new Promise((resolve) => {
    if (!content || typeof content !== 'string') {
      resolve('');
      return;
    }
    if (typeof maxLen !== 'number' || maxLen <= 0) {
      maxLen = 120;
    }

    // 去掉 Markdown 标记
    let text = content
      .replace(/^#{1,6}\s+/gm, '')       // 标题
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // 粗体/斜体
      .replace(/`([^`]+)`/g, '$1')       // 行内代码
      .replace(/^>\s?/gm, '')            // 引用
      .replace(/^[-*+]\s+/gm, '')        // 列表
      .replace(/\n+/g, ' ')              // 换行替换为空格
      .replace(/\s+/g, ' ')              // 合并多余空格
      .trim();

    if (text.length <= maxLen) {
      resolve(text);
      return;
    }

    // 截取前 maxLen 字
    let truncated = text.slice(0, maxLen);
    // 尝试在句号/问号/感叹号处断句（中文+英文标点）
    const breakMatch = truncated.match(/^(.*[。！？.!?])/);
    if (breakMatch && breakMatch[1].length >= maxLen * 0.4) {
      resolve(breakMatch[1]);
    } else {
      resolve(truncated + '...');
    }
  });
}

/**
 * 提取标签
 * - 匹配 #标签（中文/英文/数字）
 * - 匹配 [[WikiLink]]
 * - 匹配高频词（出现 3 次以上的中文词，2 字以上）
 * - 去重返回
 * @param {string} content
 * @returns {Promise<string[]>}
 */
function extractTags(content) {
  return new Promise((resolve) => {
    if (!content || typeof content !== 'string') {
      resolve([]);
      return;
    }

    const tags = new Set();

    // 匹配 #标签（中文/英文/数字，不跟空格）
    const hashTags = content.match(/#[\u4e00-\u9fa5a-zA-Z0-9_]+/g);
    if (hashTags) {
      hashTags.forEach((t) => tags.add(t.replace(/^#/, '')));
    }

    // 匹配 [[WikiLink]]
    const wikiLinks = content.match(/\[\[([^\]]+)\]\]/g);
    if (wikiLinks) {
      wikiLinks.forEach((t) => tags.add(t.replace(/^\[\[|\]\]$/g, '')));
    }

    // 匹配高频中文词（出现 3 次以上，2 字以上）
    const cnSegments = _segmentChinese(content);
    if (cnSegments.length > 0) {
      const freq = {};
      cnSegments.forEach((w) => {
        freq[w] = (freq[w] || 0) + 1;
      });
      Object.keys(freq).forEach((w) => {
        if (freq[w] >= 3) {
          tags.add(w);
        }
      });
    }

    resolve([...tags]);
  });
}

/**
 * 提取实体
 * - 英文型号：大写字母+数字组合（如 NV10、BV30、API）
 * - 数字型号：纯数字或数字+字母
 * - 中文专有名词：连续 2-6 个中文字符，前后有标点或空行
 * - 去重返回
 * @param {string} content
 * @returns {Promise<string[]>}
 */
function extractEntities(content) {
  return new Promise((resolve) => {
    if (!content || typeof content !== 'string') {
      resolve([]);
      return;
    }

    const entities = new Set();

    // 英文型号：大写字母+数字组合（如 NV10、BV30）
    const modelPatterns = content.match(/\b[A-Z]{1,5}[0-9]{1,6}\b/g);
    if (modelPatterns) {
      modelPatterns.forEach((e) => entities.add(e));
    }
    // 纯大写缩写词（API、USB 等，2-6 字母）
    const acronyms = content.match(/\b[A-Z]{2,6}\b/g);
    if (acronyms) {
      acronyms.forEach((e) => entities.add(e));
    }

    // 数字型号：纯数字或数字+字母（如 304、12C）
    const numModels = content.match(/\b\d{1,4}[A-Za-z]?\b/g);
    if (numModels) {
      numModels.forEach((e) => {
        if (e.length >= 2) {
          entities.add(e);
        }
      });
    }

    // 中文专有名词：连续 2-6 个中文字符，前后有标点、空格、换行或行首行尾
    const cnEntities = content.match(
      /(?:^|[\s，。！？、；：""''（）《》【】\[\]\(\)\n\r])([\u4e00-\u9fa5]{2,6})(?=[\s，。！？、；：""''（）《》【】\[\]\(\)\n\r]|$)/g
    );
    if (cnEntities) {
      cnEntities.forEach((match) => {
        const cleaned = match.replace(/^[\s，。！？、；：""''（）《》【】\[\]\(\)\n\r]+/, '').trim();
        if (cleaned) {
          entities.add(cleaned);
        }
      });
    }

    resolve([...entities]);
  });
}

/**
 * 将连续中文字符串分割为 2~4 字的 n-gram 片段（内部辅助）
 * @param {string} text
 * @returns {string[]}
 */
function _segmentChinese(text) {
  // 提取所有连续中文片段（去除标点和非中文字符）
  const runs = text.match(/[\u4e00-\u9fa5]{2,}/g);
  if (!runs) return [];

  const segments = [];
  for (const run of runs) {
    // 对每个片段生成 2~4 字的 n-gram
    const maxN = Math.min(run.length, 4);
    for (let n = 2; n <= maxN; n++) {
      for (let i = 0; i <= run.length - n; i++) {
        segments.push(run.slice(i, i + n));
      }
    }
  }
  return segments;
}

/**
 * 从文本中提取关键词（内部辅助函数）
 * @param {string} text
 * @returns {string[]}
 */
function _extractKeywords(text) {
  if (!text) return [];

  const keywords = new Set();

  // 中文 n-gram（2~4 字）
  const cnSegments = _segmentChinese(text);
  cnSegments.forEach((w) => keywords.add(w));

  // 英文单词（3 字母以上）
  const enWords = text.match(/[a-zA-Z]{3,}/g);
  if (enWords) {
    enWords.forEach((w) => keywords.add(w.toLowerCase()));
  }

  // 标签
  const hashTags = text.match(/#[\u4e00-\u9fa5a-zA-Z0-9_]+/g);
  if (hashTags) {
    hashTags.forEach((t) => keywords.add(t.replace(/^#/, '')));
  }

  return [...keywords];
}

/**
 * 建议关联
 * - 提取当前内容的关键词
 * - 遍历 allNotes，计算关键词重合度
 * - 返回按相关度排序的笔记列表（最多 5 条）
 * @param {string} content
 * @param {Array<{id:string, title?:string, content?:string, summary?:string}>} allNotes
 * @returns {Promise<Array<{note:Object, score:number}>>}
 */
function suggestLinks(content, allNotes) {
  return new Promise((resolve) => {
    if (!content || !Array.isArray(allNotes) || allNotes.length === 0) {
      resolve([]);
      return;
    }

    const sourceKeywords = new Set(_extractKeywords(content));
    if (sourceKeywords.size === 0) {
      resolve([]);
      return;
    }

    const results = [];

    for (let i = 0; i < allNotes.length; i++) {
      const note = allNotes[i];
      if (!note) continue;

      const noteText = [note.title, note.content, note.summary].filter(Boolean).join(' ');
      const noteKeywords = new Set(_extractKeywords(noteText));

      let overlap = 0;
      sourceKeywords.forEach((kw) => {
        if (noteKeywords.has(kw)) {
          overlap++;
        }
      });

      if (overlap > 0) {
        results.push({ note, score: overlap });
      }
    }

    results.sort((a, b) => b.score - a.score);
    resolve(results.slice(0, 5));
  });
}

/**
 * 本地问答
 * - 从 notes 中搜索与 question 关键词匹配的笔记
 * - 返回最相关的 3 条笔记摘要作为回答上下文
 * @param {string} question
 * @param {Array<{id:string, title?:string, content?:string, summary?:string}>} notes
 * @returns {Promise<{context:Array<{title:string, summary:string, score:number}>}>}
 */
function answerQuestion(question, notes) {
  return new Promise((resolve) => {
    if (!question || !Array.isArray(notes) || notes.length === 0) {
      resolve({ context: [] });
      return;
    }

    const questionKeywords = new Set(_extractKeywords(question));
    if (questionKeywords.size === 0) {
      resolve({ context: [] });
      return;
    }

    const scored = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (!note) continue;

      const noteText = [note.title, note.content, note.summary].filter(Boolean).join(' ');
      const noteKeywords = new Set(_extractKeywords(noteText));

      let overlap = 0;
      questionKeywords.forEach((kw) => {
        if (noteKeywords.has(kw)) {
          overlap++;
        }
      });

      if (overlap > 0) {
        scored.push({
          title: note.title || '',
          summary: note.summary || noteText.slice(0, 120),
          score: overlap,
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    resolve({ context: scored.slice(0, 3) });
  });
}

module.exports = {
  generateTitle,
  generateSummary,
  extractTags,
  extractEntities,
  suggestLinks,
  answerQuestion,
};