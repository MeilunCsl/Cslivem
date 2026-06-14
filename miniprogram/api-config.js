// miniprogram/api-config.js
// AI API Multi-Provider Configuration v1.8.0
// Supports: MiMo, DashScope(Qwen), DeepSeek, OpenAI, Zhipu(GLM), Custom

var localStorage = require('../core/storage/local-storage');
var keys = require('../core/storage/storage-keys');

// Provider presets - each defines endpoint/model/auth for quick setup
var PROVIDER_PRESETS = {
  mimo: {
    id: 'mimo',
    name: 'Xiaomi MiMo',
    description: '小米 MiMo 大模型',
    endpoint: 'https://api.mimo.xiaomi.com/v1/chat/completions',
    model: 'MiMo-7B-RL',
    authPrefix: 'Bearer ',
    domain: 'api.mimo.xiaomi.com',
    isNative: false
  },
  dashscope: {
    id: 'dashscope',
    name: 'DashScope (Qwen)',
    description: '阿里云通义千问',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-plus',
    authPrefix: 'Bearer ',
    domain: 'dashscope.aliyuncs.com',
    isNative: false
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek 大模型',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    authPrefix: 'Bearer ',
    domain: 'api.deepseek.com',
    isNative: false
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o / GPT-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    authPrefix: 'Bearer ',
    domain: 'api.openai.com',
    isNative: false
  },
  zhipu: {
    id: 'zhipu',
    name: 'Zhipu AI (GLM)',
    description: '智谱 GLM-4 系列',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4-flash',
    authPrefix: 'Bearer ',
    domain: 'open.bigmodel.cn',
    isNative: false
  },
  local: {
    id: 'local',
    name: 'Local (Ollama)',
    description: '本地 Ollama / MiMo 本地部署',
    endpoint: 'http://127.0.0.1:11434/v1/chat/completions',
    model: 'mimo',
    authPrefix: 'Bearer ',
    domain: '',
    isNative: true
  }
};

var DEFAULT_CONFIG = {
  activeProvider: 'mimo',
  localMode: { enabled: true },
  mimo: {
    enabled: true,
    endpoint: PROVIDER_PRESETS.mimo.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.mimo.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  dashscope: {
    enabled: false,
    endpoint: PROVIDER_PRESETS.dashscope.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.dashscope.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  deepseek: {
    enabled: false,
    endpoint: PROVIDER_PRESETS.deepseek.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.deepseek.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  openai: {
    enabled: false,
    endpoint: PROVIDER_PRESETS.openai.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.openai.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  zhipu: {
    enabled: false,
    endpoint: PROVIDER_PRESETS.zhipu.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.zhipu.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  local: {
    enabled: false,
    endpoint: PROVIDER_PRESETS.local.endpoint,
    apiKey: '',
    model: PROVIDER_PRESETS.local.model,
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },
  ecs: {
    enabled: false,
    endpoint: '',
    apiKey: '',
    model: '',
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  }
};

function getConfig() {
  var saved = localStorage.getJSON(keys.API_CONFIG);
  if (!saved) return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  var config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  Object.keys(DEFAULT_CONFIG).forEach(function(k) {
    if (typeof DEFAULT_CONFIG[k] === 'object' && DEFAULT_CONFIG[k] !== null && !Array.isArray(DEFAULT_CONFIG[k])) {
      config[k] = Object.assign({}, DEFAULT_CONFIG[k], saved[k] || {});
    } else {
      config[k] = saved[k] !== undefined ? saved[k] : DEFAULT_CONFIG[k];
    }
  });
  return config;
}

function saveConfig(config) {
  localStorage.setJSON(keys.API_CONFIG, config);
}

function getActiveConfig() {
  var config = getConfig();
  var provider = config.activeProvider;
  if (provider === 'ecs' && config.ecs.enabled) return config.ecs;
  if (config[provider] && config[provider].enabled) return config[provider];
  return null;
}

function getActivePreset() {
  var config = getConfig();
  return PROVIDER_PRESETS[config.activeProvider] || null;
}

function updateProvider(provider, settings) {
  var config = getConfig();
  if (config[provider]) {
    Object.assign(config[provider], settings);
    saveConfig(config);
  }
  return config;
}

module.exports = {
  PROVIDER_PRESETS: PROVIDER_PRESETS,
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  getConfig: getConfig,
  saveConfig: saveConfig,
  getActiveConfig: getActiveConfig,
  getActivePreset: getActivePreset,
  updateProvider: updateProvider
};
