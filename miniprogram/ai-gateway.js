// miniprogram/ai-gateway.js
// AI 统一网关（桩实现，后续接入真实 API）

var _requestLog = [];

function logRequest(method, input, output) {
  _requestLog.push({
    method: method,
    inputLength: typeof input === 'string' ? input.length : 0,
    timestamp: new Date().toISOString()
  });
  if (_requestLog.length > 100) { _requestLog = _requestLog.slice(-50); }
}

module.exports = {
  // 文本摘要
  summarize: function(text) {
    logRequest('summarize', text);
    var preview = text.replace(/[#*>\-`]/g, '').trim();
    if (preview.length > 100) { preview = preview.substring(0, 100) + '...'; }
    return Promise.resolve({ summary: preview || '(空内容)' });
  },

  // 标签建议
  suggestTags: function(text) {
    logRequest('suggestTags', text);
    var tags = [];
    var patterns = [
      { re: /\u4f1a\u8bae|\u8bae\u9898|\u8ba8\u8bba/i, tag: '\u4f1a\u8bae' },
      { re: /\u5f85\u529e|todo|\u4efb\u52a1/i, tag: '\u5f85\u529e' },
      { re: /\u7075\u611f|idea|\u60f3\u6cd5/i, tag: '\u7075\u611f' },
      { re: /\u5b66\u4e60|\u7b14\u8bb0|\u8bb0\u5f55/i, tag: '\u5b66\u4e60' },
      { re: /\u5de5\u4f5c|project|\u9879\u76ee/i, tag: '\u5de5\u4f5c' },
      { re: /\u9910\u996e|\u5403|\u559d|food/i, tag: '\u9910\u996e' },
      { re: /\u8d2d\u7269|\u4e70|buy/i, tag: '\u8d2d\u7269' }
    ];
    patterns.forEach(function(p) {
      if (p.re.test(text)) { tags.push(p.tag); }
    });
    if (tags.length === 0) { tags.push('\u672a分类'); }
    return Promise.resolve({ tags: tags });
  },

  // 分类
  classify: function(text) {
    logRequest('classify', text);
    var rules = [
      { re: /\u7b14\u8bb0|note|\u8bb0\u5f55/i, cat: 'note', conf: 0.8 },
      { re: /\u4e8b\u4ef6|\u65e5\u7a0b|calendar/i, cat: 'event', conf: 0.8 },
      { re: /\u8bb0\u8d26|\u6536\u5165|\u652f\u51fa|\u82b1\u8d39/i, cat: 'ledger', conf: 0.8 },
      { re: /\u5f85\u529e|todo|\u4efb\u52a1/i, cat: 'task', conf: 0.7 },
      { re: /\u95ee\u9898|\u600e\u4e48|why|how/i, cat: 'question', conf: 0.6 }
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].re.test(text)) {
        return Promise.resolve({ category: rules[i].cat, confidence: rules[i].conf });
      }
    }
    return Promise.resolve({ category: 'uncategorized', confidence: 0.3 });
  },

  // 意图解析
  parseIntent: function(query) {
    logRequest('parseIntent', query);
    var intents = [
      { re: /\u521b\u5efa|\u65b0\u5efa|\u65b0\u589e|\u5199|\u8bb0\u5f55/i, intent: 'create' },
      { re: /\u641c\u7d22|\u67e5\u627e|\u627e/i, intent: 'search' },
      { re: /\u5220\u9664|\u53bb\u6389|\u5220/i, intent: 'delete' },
      { re: /\u67e5\u770b|\u663e\u793a|\u5217\u8868/i, intent: 'list' },
      { re: /\u7edf\u8ba1|\u6c47总|\u603b结/i, intent: 'summary' },
      { re: /\u8bbe\u7f6e|\u914d\u7f6e|\u66f4\u65b0/i, intent: 'update' }
    ];
    for (var i = 0; i < intents.length; i++) {
      if (intents[i].re.test(query)) {
        return Promise.resolve({ intent: intents[i].intent, entities: {}, raw: query });
      }
    }
    return Promise.resolve({ intent: 'unknown', entities: {}, raw: query });
  },

  // 问答
  ask: function(question, context) {
    logRequest('ask', question);
    return Promise.resolve({
      answer: '(桩实现) AI 功能开发中，后续将支持智能问答。',
      sources: []
    });
  },

  // OCR
  ocr: function(imageUrl) {
    logRequest('ocr', imageUrl);
    return Promise.resolve({
      text: '(桩实实现) OCR 功能开发中',
      confidence: 0.9
    });
  },

  // 获取请求日志
  getRequestLog: function() {
    return _requestLog.slice();
  },

  // 清除日志
  clearLog: function() {
    _requestLog = [];
  }
};
