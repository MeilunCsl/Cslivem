// miniprogram/ai-gateway.js
// AI 统一网关
// 支持: MiMo(本地) / ECS(阿里云) / Local(正则匹配兜底)

var apiConfig = require('./api-config');

var _requestLog = [];
var _conversationHistory = [];

function logRequest(method, input) {
  _requestLog.push({
    method: method,
    inputLength: typeof input === 'string' ? input.length : 0,
    timestamp: new Date().toISOString()
  });
  if (_requestLog.length > 100) { _requestLog = _requestLog.slice(-50); }
}

// ===== OpenAI 兼容请求 =====
function callOpenAI(messages, options) {
  options = options || {};
  var config = apiConfig.getActiveConfig();
  if (!config) {
    return Promise.reject(new Error('No AI provider configured'));
  }

  var body = {
    model: options.model || config.model,
    messages: messages,
    max_tokens: options.maxTokens || config.maxTokens || 2048,
    temperature: options.temperature !== undefined ? options.temperature : (config.temperature || 0.7),
    stream: false
  };

  return new Promise(function(resolve, reject) {
    wx.request({
      url: config.endpoint,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (config.apiKey || 'no-key')
      },
      data: body,
      timeout: config.timeout || 30000,
      success: function(res) {
        if (res.statusCode === 200 && res.data) {
          var choice = res.data.choices && res.data.choices[0];
          if (choice && choice.message) {
            resolve({
              content: choice.message.content || '',
              usage: res.data.usage || {},
              model: res.data.model || body.model
            });
          } else {
            reject(new Error('Invalid response format'));
          }
        } else {
          var errMsg = (res.data && res.data.error && res.data.error.message) || '';
          reject(new Error('API error ' + res.statusCode + (errMsg ? ': ' + errMsg : '')));
        }
      },
      fail: function(err) {
        var msg = err.errMsg || 'unknown';
        if (msg.indexOf('url not in domain') >= 0 || msg.indexOf('not in domain') >= 0) {
          reject(new Error('Domain not whitelisted. Add this domain in WeChat MP admin -> Settings -> Server Domain.'));
        } else {
          reject(new Error('Network error: ' + msg));
        }
      }
    });
  });
}

// ===== 本场模式兜底 =====
function localSummarize(text) {
  var preview = text.replace(/[#*>\-\`]/g, '').trim();
  return preview.length > 100 ? preview.substring(0, 100) + '...' : (preview || '(空内容)');
}

function localSuggestTags(text) {
  var tags = [];
  var patterns = [
    { re: /会议|议题|讨论/i, tag: '会议' },
    { re: /待办|todo|任务/i, tag: '待办' },
    { re: /灵感|idea|想法/i, tag: '灵感' },
    { re: /学习|笔记|记录/i, tag: '学习' },
    { re: /工作|project|项目/i, tag: '工作' }
  ];
  patterns.forEach(function(p) {
    if (p.re.test(text)) { tags.push(p.tag); }
  });
  if (tags.length === 0) { tags.push('未分类'); }
  return tags;
}

function localClassify(text) {
  var rules = [
    { re: /笔记|note/i, cat: 'note', conf: 0.8 },
    { re: /事件|日程/i, cat: 'event', conf: 0.8 },
    { re: /记账|收入|支出/i, cat: 'ledger', conf: 0.8 },
    { re: /待办|todo/i, cat: 'task', conf: 0.7 }
  ];
  for (var i = 0; i < rules.length; i++) {
    if (rules[i].re.test(text)) {
      return { category: rules[i].cat, confidence: rules[i].conf };
    }
  }
  return { category: 'uncategorized', confidence: 0.3 };
}

// ===== Public API =====
module.exports = {
  // AI 问答（对话式）
  ask: function(question, context) {
    logRequest('ask', question);
    var config = apiConfig.getActiveConfig();
    
    // 无配置时用本场模式
    if (!config) {
      return Promise.resolve({
        content: '(本场模式) 无法连接 AI 服务，请在设置中配置 API。',
        mode: 'local'
      });
    }

    var messages = [
      { role: 'system', content: context || '你是 Cslivem 智能助手，帮助用户管理知识、笔记和任务。简洁明了地回答。' },
      { role: 'user', content: question }
    ];

    // 追加对话历史
    if (_conversationHistory.length > 0) {
      var history = _conversationHistory.slice(-6);
      messages = [messages[0]].concat(history).concat([messages[1]]);
    }

    return callOpenAI(messages).then(function(result) {
      _conversationHistory.push({ role: 'user', content: question });
      _conversationHistory.push({ role: 'assistant', content: result.content });
      if (_conversationHistory.length > 20) {
        _conversationHistory = _conversationHistory.slice(-12);
      }
      result.mode = 'api';
      return result;
    }).catch(function(err) {
      return {
        content: '(连接失败) ' + err.message + '\n请检查 AI 服务是否运行。',
        mode: 'error'
      };
    });
  },

  // 文本摘要
  summarize: function(text) {
    logRequest('summarize', text);
    var config = apiConfig.getActiveConfig();
    if (!config) {
      return Promise.resolve({ summary: localSummarize(text), mode: 'local' });
    }
    var messages = [
      { role: 'system', content: '用一句话摘要以下内容，不超过100字。' },
      { role: 'user', content: text }
    ];
    return callOpenAI(messages).then(function(r) {
      return { summary: r.content, mode: 'api' };
    }).catch(function() {
      return { summary: localSummarize(text), mode: 'local' };
    });
  },

  // 标签建议
  suggestTags: function(text) {
    logRequest('suggestTags', text);
    var config = apiConfig.getActiveConfig();
    if (!config) {
      return Promise.resolve({ tags: localSuggestTags(text), mode: 'local' });
    }
    var messages = [
      { role: 'system', content: '从文本中提取3-5个标签，用 JSON 数组格式返回，如 ["标签1","标签2"]。只返回 JSON，不要其他内容。' },
      { role: 'user', content: text }
    ];
    return callOpenAI(messages).then(function(r) {
      try {
        var tags = JSON.parse(r.content);
        return { tags: Array.isArray(tags) ? tags : [r.content], mode: 'api' };
      } catch (e) {
        return { tags: localSuggestTags(text), mode: 'local' };
      }
    }).catch(function() {
      return { tags: localSuggestTags(text), mode: 'local' };
    });
  },

  // 分类
  classify: function(text) {
    logRequest('classify', text);
    var config = apiConfig.getActiveConfig();
    if (!config) {
      return Promise.resolve(Object.assign(localClassify(text), { mode: 'local' }));
    }
    var messages = [
      { role: 'system', content: '将文本分类为: note/event/ledger/task/other。只返回类别名。' },
      { role: 'user', content: text }
    ];
    return callOpenAI(messages).then(function(r) {
      return { category: r.content.trim().toLowerCase(), confidence: 0.9, mode: 'api' };
    }).catch(function() {
      return Object.assign(localClassify(text), { mode: 'local' });
    });
  },

  // 意图解析
  parseIntent: function(query) {
    logRequest('parseIntent', query);
    var intents = [
      { re: /创建|新建|写|记录/i, intent: 'create' },
      { re: /搜索|查找|找/i, intent: 'search' },
      { re: /删除|去掉/i, intent: 'delete' },
      { re: /查看|显示|列表/i, intent: 'list' },
      { re: /统计|汇总|总结/i, intent: 'summary' }
    ];
    for (var i = 0; i < intents.length; i++) {
      if (intents[i].re.test(query)) {
        return Promise.resolve({ intent: intents[i].intent, entities: {}, raw: query });
      }
    }
    return Promise.resolve({ intent: 'unknown', entities: {}, raw: query });
  },

  // OCR
  ocr: function(imageUrl) {
    logRequest('ocr', imageUrl);
    return Promise.resolve({ text: '(桩实现) OCR 功能开发中', confidence: 0.9 });
  },

  // 清除对话历史
  clearHistory: function() {
    _conversationHistory = [];
  },

  // 获取配置
  getConfig: function() {
    return apiConfig.getConfig();
  },

  // 更新配置
  updateConfig: function(provider, settings) {
    return apiConfig.updateProvider(provider, settings);
  },

  getRequestLog: function() {
    return _requestLog.slice();
  }
};
