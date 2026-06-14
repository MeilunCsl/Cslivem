// utils/wiki-link.js
// [[wiki-link]] 解析器
// 提取文本中的 [[target]] 链接

var LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

// 提取所有 wiki-links
function extractLinks(text) {
  if (!text) return [];
  var links = [];
  var match;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    var raw = match[1].trim();
    // Support [[display|target]] syntax
    var parts = raw.split('|');
    links.push({
      display: parts.length > 1 ? parts[0].trim() : raw,
      target: parts.length > 1 ? parts[1].trim() : raw,
      start: match.index,
      end: match.index + match[0].length
    });
  }
  return links;
}

// 检查文本是否包含某个 link
function hasLink(text, target) {
  if (!text) return false;
  var links = extractLinks(text);
  return links.some(function(l) { return l.target === target; });
}

// 替换文本中的 wiki-links 为可点击样式
function renderLinks(text, className) {
  if (!text) return '';
  className = className || 'wiki-link';
  return text.replace(LINK_PATTERN, function(match, inner) {
    var parts = inner.split('|');
    var display = parts.length > 1 ? parts[0].trim() : inner.trim();
    var target = parts.length > 1 ? parts[1].trim() : inner.trim();
    return '<text class="' + className + '" data-target="' + target + '">' + display + '</text>';
  });
}

module.exports = {
  extractLinks: extractLinks,
  hasLink: hasLink,
  renderLinks: renderLinks
};
