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

  // Auto-append /chat/completions if missing
  var url = config.endpoint;
  if (url && url.indexOf('/chat/completions') === -1) {
    url = url.replace(/\/+$/, '') + '/chat/completions';
  }

  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
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

// ===== Local Knowledge Search =====
function localSearchKnowledge(query) {
  var localStorage = require('../core/storage/local-storage');
  var keys = require('../core/storage/storage-keys');
  var notes = localStorage.getJSON(keys.NOTES, []);
  var graph = localStorage.getJSON(keys.GRAPH, { nodes: {}, edges: {} });

  var queryLower = query.toLowerCase();
  var queryWords = queryLower.split(/[\s,.\?!，。？！]+/).filter(function(w) { return w.length > 1; });

  // Search notes
  var matchedNotes = [];
  notes.forEach(function(note) {
    var titleLower = (note.title || '').toLowerCase();
    var contentLower = (note.content || '').toLowerCase();
    var tags = (note.tags || []).join(' ').toLowerCase();
    var score = 0;

    queryWords.forEach(function(word) {
      if (titleLower.indexOf(word) >= 0) score += 3;
      if (contentLower.indexOf(word) >= 0) score += 1;
      if (tags.indexOf(word) >= 0) score += 2;
    });

    if (score > 0) {
      matchedNotes.push({ title: note.title, content: note.content, tags: note.tags, score: score });
    }
  });

  // Sort by score
  matchedNotes.sort(function(a, b) { return b.score - a.score; });
  matchedNotes = matchedNotes.slice(0, 3);

  // Search graph nodes
  var matchedNodes = [];
  Object.keys(graph.nodes || {}).forEach(function(id) {
    var node = graph.nodes[id];
    var labelLower = (node.label || '').toLowerCase();
    queryWords.forEach(function(word) {
      if (labelLower.indexOf(word) >= 0) {
        matchedNodes.push({ label: node.label, type: node.type });
      }
    });
  });

  return { notes: matchedNotes, nodes: matchedNodes.slice(0, 5) };
}

function localAnswerQuestion(query) {
  var results = localSearchKnowledge(query);

  if (results.notes.length === 0 && results.nodes.length === 0) {
    return '本地知识库中没有找到相关内容。请尝试重新表述问题，或在设置中配置 AI 服务以获得更好的回答。';
  }

  var answer = '';

  if (results.notes.length > 0) {
    answer += '找到以下相关笔记：\n\n';
    results.notes.forEach(function(note, i) {
      answer += (i + 1) + '. ' + note.title;
      if (note.tags && note.tags.length > 0) {
        answer += ' [' + note.tags.join(', ') + ']';
      }
      var preview = (note.content || '').replace(/[#*>\-`\[\]]/g, '').trim();
      if (preview.length > 80) preview = preview.substring(0, 80) + '...';
      if (preview) answer += '\n   ' + preview;
      answer += '\n';
    });
  }

  if (results.nodes.length > 0) {
    answer += '\n相关知识节点：';
    results.nodes.forEach(function(node) {
      answer += ' ' + node.label + '(' + node.type + ')';
    });
    answer += '\n';
  }

  answer += '\n（本地模式 · 基于知识库检索）';
  return answer;
}


function selectModel(text, hasImage) {
  var config = apiConfig.getActiveConfig();
  if (!config) return null;
  var baseModel = config.model || 'MiMo-7B-RL';
  
  // Image → vision model
  if (hasImage) {
    return baseModel.includes('mimo') ? 'MiMo-V2.5-Pro' : baseModel;
  }
  
  // Long or complex text → pro model
  if (text && text.length > 500) {
    return baseModel.includes('mimo') ? 'MiMo-V2.5-Pro' : baseModel;
  }
  
  // Code or technical content → pro model
  if (text && (text.indexOf('```') >= 0 || text.indexOf('function') >= 0 || 
      text.indexOf('class ') >= 0 || text.indexOf('import ') >= 0)) {
    return baseModel.includes('mimo') ? 'MiMo-V2.5-Pro' : baseModel;
  }
  
  // Simple text → fast model
  return baseModel.includes('mimo') ? 'MiMo-7B-RL' : baseModel;
}

// ===== Public API =====
module.exports = {
  // Multi-modal: image analysis
  analyzeImage: function(imagePath, prompt) {
    logRequest('analyzeImage', prompt || 'image');
    var config = apiConfig.getActiveConfig();
    if (!config) {
      return Promise.resolve({ content: '(local) Image analysis requires AI service', mode: 'local' });
    }

    // Read image as base64 and send as multimodal message
    return new Promise(function(resolve, reject) {
      wx.getFileSystemManager().readFile({
        filePath: imagePath,
        encoding: 'base64',
        success: function(res) {
          var base64Data = res.data;
          var ext = (imagePath.split('.').pop() || 'jpeg').toLowerCase();
          var mimeType = 'image/jpeg';
          if (ext === 'png') mimeType = 'image/png';
          else if (ext === 'webp') mimeType = 'image/webp';
          else if (ext === 'gif') mimeType = 'image/gif';

          var messages = [
            { role: 'system', content: prompt || '请详细描述这张图片的内容，用中文回答。' },
            {
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: 'data:' + mimeType + ';base64,' + base64Data } },
                { type: 'text', text: prompt || '请描述这张图片' }
              ]
            }
          ];

          callOpenAI(messages, { model: config.model, maxTokens: 1024 }).then(function(r) {
            r.mode = 'api';
            resolve(r);
          }).catch(function(err) {
            resolve({ content: '(分析失败) ' + err.message, mode: 'error' });
          });
        },
        fail: function(err) {
          resolve({ content: '(读取图片失败) ' + (err.errMsg || ''), mode: 'error' });
        }
      });
    });
  },

  // Multi-modal: voice transcription (placeholder for ASR)
  transcribeVoice: function(audioPath) {
    logRequest('transcribeVoice', audioPath);
    var config = apiConfig.getActiveConfig();
    
    // Try provider's audio transcription endpoint
    var asrUrl = config.endpoint.replace('/chat/completions', '/audio/transcriptions');
    
    return new Promise(function(resolve, reject) {
      wx.uploadFile({
        url: asrUrl,
        filePath: audioPath,
        name: 'file',
        formData: { model: 'whisper-1', language: 'zh' },
        header: { 'Authorization': 'Bearer ' + (config.apiKey || 'no-key') },
        success: function(res) {
          if (res.statusCode === 200) {
            try {
              var data = JSON.parse(res.data);
              resolve({ text: data.text || '', mode: 'api' });
            } catch (e) {
              resolve({ text: res.data, mode: 'api' });
            }
          } else {
            // Fallback: send audio info as text message
            resolve({ text: '[\u8bed\u97f3\u6d88\u606f] \u8bf7\u67e5\u770b\u9644\u4ef6', mode: 'local' });
          }
        },
        fail: function(err) {
          resolve({ text: '[\u8bed\u97f3\u6d88\u606f] \u8bf7\u67e5\u770b\u9644\u4ef6', mode: 'local' });
        }
      });
    });
  },

  // Multi-modal: text-to-speech (placeholder for TTS)
  synthesizeSpeech: function(text) {
    logRequest('synthesizeSpeech', text);
    var config = apiConfig.getActiveConfig();
    
    // Try provider's audio speech endpoint
    var ttsUrl = config.endpoint.replace('/chat/completions', '/audio/speech');
    
    return new Promise(function(resolve, reject) {
      wx.request({
        url: ttsUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (config.apiKey || 'no-key')
        },
        data: { model: 'tts-1', input: text, voice: 'alloy' },
        responseType: 'arraybuffer',
        success: function(res) {
          if (res.statusCode === 200) {
            // Save audio to temp file
            var fs = wx.getFileSystemManager();
            var tempPath = wx.env.USER_DATA_PATH + '/tts_' + Date.now() + '.mp3';
            fs.writeFile({
              filePath: tempPath,
              data: res.data,
              encoding: 'binary',
              success: function() {
                resolve({ audioUrl: tempPath, mode: 'api' });
              },
              fail: function() {
                resolve({ audioUrl: '', mode: 'local' });
              }
            });
          } else {
            resolve({ audioUrl: '', mode: 'local' });
          }
        },
        fail: function() {
          resolve({ audioUrl: '', mode: 'local' });
        }
      });
    });
  },


// ===== Model Auto-Routing =====

  // AI 问答（对话式）
  ask: function(question, context) {
    logRequest('ask', question);
    var config = apiConfig.getActiveConfig();
    var routedModel = selectModel(question, false);
    
    // 无配置时用本场模式
    if (!config) {
      var localAnswer = localAnswerQuestion(question);
      return Promise.resolve({
        content: localAnswer,
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

    return callOpenAI(messages, { model: routedModel }).then(function(result) {
      _conversationHistory.push({ role: 'user', content: question });
      _conversationHistory.push({ role: 'assistant', content: result.content });
      if (_conversationHistory.length > 20) {
        _conversationHistory = _conversationHistory.slice(-12);
      }
      result.mode = 'api';
      return result;
    }).catch(function(err) {
      // Local fallback: search knowledge base
      var localAnswer = localAnswerQuestion(question);
      return {
        content: localAnswer,
        mode: 'local',
        error: err.message
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




  // Streaming AI chat (real streaming via enableChunked)
  streamChat: function(messages, options, onChunk, onDone, onError) {
    options = options || {};
    var config = apiConfig.getActiveConfig();
    if (!config) {
      onError && onError(new Error('No AI provider configured'));
      return null;
    }

    var body = {
      model: options.model || config.model,
      messages: messages,
      max_tokens: options.maxTokens || config.maxTokens || 2048,
      temperature: options.temperature !== undefined ? options.temperature : (config.temperature || 0.7),
      stream: true
    };

    var url = config.endpoint;
    if (url && url.indexOf('/chat/completions') === -1) {
      url = url.replace(/\/+$/, '') + '/chat/completions';
    }

    var fullContent = '';
    var buffer = '';

    var task = wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (config.apiKey || 'no-key')
      },
      data: body,
      timeout: config.timeout || 60000,
      enableChunked: true,
      success: function(res) {
        if (onDone) onDone(fullContent);
      },
      fail: function(err) {
        var msg = err.errMsg || 'unknown';
        if (msg.indexOf('url not in domain') >= 0 || msg.indexOf('not in domain') >= 0) {
          onError && onError(new Error('Domain not whitelisted.'));
        } else {
          onError && onError(new Error('Network error: ' + msg));
        }
      }
    });

    if (task && task.onChunkReceived) {
      task.onChunkReceived(function(res) {
        try {
          var chunk = '';
          if (res.data instanceof ArrayBuffer) {
            chunk = String.fromCharCode.apply(null, new Uint8Array(res.data));
          } else if (typeof res.data === 'string') {
            chunk = res.data;
          }
          buffer += chunk;
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';
          lines.forEach(function(line) {
            line = line.trim();
            if (!line || line === 'data: [DONE]') return;
            if (line.indexOf('data: ') === 0) {
              try {
                var json = JSON.parse(line.substring(6));
                var delta = json.choices && json.choices[0] && json.choices[0].delta;
                if (delta && delta.content) {
                  fullContent += delta.content;
                  if (onChunk) onChunk(delta.content, fullContent);
                }
              } catch (e) {
                // ignore parse errors in streaming
              }
            }
          });
        } catch (e) {
          console.warn('[AI] chunk parse error:', e);
        }
      });
    } else {
      // Fallback: chunked not supported, use regular request
      // The success handler will call onDone with full content
    }

    return task;
  },

  // AI 笔记摘要（优先用真实 AI，降级用本地）
  summarizeNote: function(content) {
    if (!content || content.length < 20) {
      return Promise.resolve({ summary: content || '', source: 'local' });
    }
    var systemPrompt = '你是一个笔记摘要助手。用一句话（不超过50字）概括下列内容的核心要点，只输出摘要本身。';
    var userMsg = content.substring(0, 2000);
    return callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMsg }
    ], { maxTokens: 200, temperature: 0.3 }).then(function(res) {
      return { summary: res.content.trim(), source: 'ai' };
    }).catch(function() {
      return { summary: localSummarize(content), source: 'local' };
    });
  },

  // AI 标签推荐（优先用真实 AI，降级用本地）
  suggestTagsForNote: function(content) {
    if (!content || content.length < 10) {
      return Promise.resolve({ tags: [], source: 'local' });
    }
    var systemPrompt = '你是一个标签推荐助手。根据下列内容，推荐3-5个简短中文标签，用英文逗号分隔，只输出标签列表。';
    var userMsg = content.substring(0, 1500);
    return callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMsg }
    ], { maxTokens: 100, temperature: 0.3 }).then(function(res) {
      var tags = res.content.split(/[,，、\s]+/).map(function(t) { return t.trim(); }).filter(function(t) { return t.length > 0 && t.length < 20; });
      return { tags: tags.slice(0, 5), source: 'ai' };
    }).catch(function() {
      return { tags: localSuggestTags(content), source: 'local' };
    });
  },

  // AI 关联推荐（基于笔记内容搜索相关知识节点）
  suggestRelated: function(content) {
    if (!content || content.length < 10) {
      return Promise.resolve({ related: [], source: 'local' });
    }
    var systemPrompt = '你是一个知识关联助手。根据下列内容，提取3-5个关键词或概念，用英文逗号分隔，只输出关键词。';
    var userMsg = content.substring(0, 1500);
    return callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMsg }
    ], { maxTokens: 100, temperature: 0.3 }).then(function(res) {
      var keywords = res.content.split(/[,，、\s]+/).map(function(t) { return t.trim(); }).filter(function(t) { return t.length > 1; });
      return { keywords: keywords.slice(0, 5), source: 'ai' };
    }).catch(function() {
      var words = localSuggestTags(content);
      return { keywords: words, source: 'local' };
    });
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