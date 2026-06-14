// utils/markdown.js
// Simple Markdown to HTML parser for WeChat mini program rich-text
// Supports: headings, bold, italic, code, lists, links, blockquotes, hr, images

function parseMarkdown(md) {
  if (!md) return '';
  var lines = md.split('\n');
  var html = [];
  var inList = false;
  var inCodeBlock = false;
  var codeContent = '';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // Code block
    if (line.trim().indexOf('```') === 0) {
      if (inCodeBlock) {
        html.push('<pre style="background:#f5f5f5;padding:16rpx;border-radius:8rpx;font-size:24rpx;overflow-x:auto;">' + escapeHtml(codeContent) + '</pre>');
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<p style="height:16rpx;"></p>');
      continue;
    }

    // Headings
    if (line.indexOf('### ') === 0) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<h3 style="font-size:30rpx;font-weight:700;margin:16rpx 0 8rpx;">' + inlineFormat(line.substring(4)) + '</h3>');
      continue;
    }
    if (line.indexOf('## ') === 0) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<h2 style="font-size:34rpx;font-weight:700;margin:20rpx 0 8rpx;">' + inlineFormat(line.substring(3)) + '</h2>');
      continue;
    }
    if (line.indexOf('# ') === 0) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<h1 style="font-size:38rpx;font-weight:700;margin:24rpx 0 12rpx;">' + inlineFormat(line.substring(2)) + '</h1>');
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<hr style="border:none;border-top:1rpx solid #e0e0e0;margin:16rpx 0;"/>');
      continue;
    }

    // Blockquote
    if (line.indexOf('> ') === 0) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<blockquote style="border-left:4rpx solid #6C5CE7;padding-left:16rpx;color:#666;margin:8rpx 0;">' + inlineFormat(line.substring(2)) + '</blockquote>');
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s/.test(line)) {
      if (!inList) { html.push('<ul style="padding-left:32rpx;margin:8rpx 0;">'); inList = true; }
      var text = line.replace(/^\s*[-*+]\s/, '');
      html.push('<li style="margin:4rpx 0;line-height:1.6;">' + inlineFormat(text) + '</li>');
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      if (!inList) { html.push('<ul style="padding-left:32rpx;margin:8rpx 0;">'); inList = true; }
      var text = line.replace(/^\s*\d+\.\s/, '');
      html.push('<li style="margin:4rpx 0;line-height:1.6;">' + inlineFormat(text) + '</li>');
      continue;
    }

    // Close list if needed
    if (inList) { html.push('</ul>'); inList = false; }

    // Normal paragraph
    html.push('<p style="line-height:1.8;margin:4rpx 0;">' + inlineFormat(line) + '</p>');
  }

  if (inList) html.push('</ul>');
  if (inCodeBlock) html.push('<pre style="background:#f5f5f5;padding:16rpx;border-radius:8rpx;">' + escapeHtml(codeContent) + '</pre>');

  return html.join('');
}

function inlineFormat(text) {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2rpx 8rpx;border-radius:4rpx;font-size:24rpx;">$1</code>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color:#6C5CE7;" href="$2">$1</a>');
  // Wiki-links
  text = text.replace(/\[\[([^\]]+)\]\]/g, '<span style="color:#6C5CE7;font-weight:600;">[[$1]]</span>');
  // Images
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8rpx;"/>');
  return text;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = { parseMarkdown: parseMarkdown };
