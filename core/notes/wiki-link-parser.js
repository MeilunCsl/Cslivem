/**
 * Wiki-Link 解析器
 * 提取和替换 [[target]] / [[target|alias]] 形式的链接
 */

const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * 从文本中提取所有 WikiLink
 * @param {string} content
 * @returns {Array<{raw: string, target: string, alias: string|null, start: number, end: number}>}
 */
function parseWikiLinks(content) {
  if (!content || typeof content !== 'string') return [];

  const results = [];
  let match;

  // 每次调用前重置 lastIndex（全局正则）
  WIKI_LINK_REGEX.lastIndex = 0;

  while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
    results.push({
      raw: match[0],
      target: match[1].trim(),
      alias: match[2] ? match[2].trim() : null,
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * 返回去重的 target 数组
 * @param {string} content
 * @returns {string[]}
 */
function extractLinkedTitles(content) {
  const links = parseWikiLinks(content);
  const seen = new Set();
  const titles = [];

  for (const link of links) {
    if (!seen.has(link.target)) {
      seen.add(link.target);
      titles.push(link.target);
    }
  }

  return titles;
}

/**
 * 替换 WikiLink 为其他文本
 * @param {string} content
 * @param {(target: string, alias: string|null) => string} replacerFn
 * @returns {string}
 */
function replaceWikiLinks(content, replacerFn) {
  if (!content || typeof content !== 'string') return content || '';
  if (typeof replacerFn !== 'function') return content;

  return content.replace(WIKI_LINK_REGEX, (raw, target, alias) => {
    return replacerFn(target.trim(), alias ? alias.trim() : null);
  });
}

module.exports = {
  parseWikiLinks,
  extractLinkedTitles,
  replaceWikiLinks,
};
