// miniprogram/prompt-registry.js
// Versioned prompt templates for AI features v2.3.0
// Centralizes all AI prompts for easy tuning and A/B testing

var localStorage = require('../core/storage/local-storage');

var PROMPTS_KEY = 'csl_prompt_overrides';

// Default prompts - versioned
var DEFAULT_PROMPTS = {
  summarize: {
    version: 1,
    system: '你是一个笔记摘要助手。用一句话（不超过50字）概括下列内容的核心要点，只输出摘要本身。',
    temperature: 0.3,
    maxTokens: 200
  },
  suggestTags: {
    version: 1,
    system: '你是一个标签推荐助手。根据下列内容，推荐3-5个简短中文标签，用英文逗号分隔，只输出标签列表。',
    temperature: 0.3,
    maxTokens: 100
  },
  suggestRelated: {
    version: 1,
    system: '你是一个知识关联助手。根据下列内容，提取3-5个关键词或概念，用英文逗号分隔，只输出关键词。',
    temperature: 0.3,
    maxTokens: 100
  },
  generateTitle: {
    version: 1,
    system: '你是一个标题生成器，只输出短标题。用一个简短的中文短语（5-15字）概括以下对话的主题。',
    temperature: 0.3,
    maxTokens: 50
  },
  imageAnalysis: {
    version: 1,
    system: '请详细描述这张图片的内容，用中文回答。',
    temperature: 0.5,
    maxTokens: 1024
  },
  chat: {
    version: 1,
    system: '你是 Cslivem AI 助手，帮助用户管理知识、笔记和日常任务。简洁、有用、友好。',
    temperature: 0.7,
    maxTokens: 2048
  }
};

function getOverrides() {
  return localStorage.getJSON(PROMPTS_KEY, {});
}

module.exports = {
  // Get a prompt by key, with optional override
  get: function(key) {
    var overrides = getOverrides();
    if (overrides[key]) return overrides[key];
    return DEFAULT_PROMPTS[key] || null;
  },

  // Get system prompt text
  getSystem: function(key) {
    var prompt = this.get(key);
    return prompt ? prompt.system : '';
  },

  // Get all prompt keys
  getKeys: function() {
    return Object.keys(DEFAULT_PROMPTS);
  },

  // Override a prompt (for A/B testing or user customization)
  setOverride: function(key, promptData) {
    var overrides = getOverrides();
    overrides[key] = promptData;
    localStorage.setJSON(PROMPTS_KEY, overrides);
  },

  // Reset a prompt to default
  resetOverride: function(key) {
    var overrides = getOverrides();
    delete overrides[key];
    localStorage.setJSON(PROMPTS_KEY, overrides);
  },

  // Reset all overrides
  resetAll: function() {
    localStorage.setJSON(PROMPTS_KEY, {});
  },

  // Get default prompts (for reference)
  getDefaults: function() {
    return JSON.parse(JSON.stringify(DEFAULT_PROMPTS));
  }
};
