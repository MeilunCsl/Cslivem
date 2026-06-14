// miniprogram/api-config.js
// AI API 配置（可配置多种服务）

var storage = require('./storage');

var CONFIG_KEY = 'api_config';

var DEFAULT_CONFIG = {
  // 当前活跃的 AI 服务
  activeProvider: 'mimo',

  // 本地模式（离线兜底）
  localMode: {
    enabled: true
  },

  // MiMo 配置（小米本地模型，OpenAI 兼容格式）
  mimo: {
    enabled: true,
    endpoint: 'http://127.0.0.1:11434/v1/chat/completions',
    apiKey: '',
    model: 'mimo',
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 30000
  },

  // 阿里云 ECS 预留接口（未来扩展）
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
  var saved = storage.get(CONFIG_KEY);
  if (!saved) return DEFAULT_CONFIG;
  // Merge with defaults to handle new fields
  var config = {};
  Object.keys(DEFAULT_CONFIG).forEach(function(k) {
    if (typeof DEFAULT_CONFIG[k] === 'object' && !Array.isArray(DEFAULT_CONFIG[k])) {
      config[k] = Object.assign({}, DEFAULT_CONFIG[k], saved[k] || {});
    } else {
      config[k] = saved[k] !== undefined ? saved[k] : DEFAULT_CONFIG[k];
    }
  });
  return config;
}

function saveConfig(config) {
  storage.set(CONFIG_KEY, config);
}

function getActiveConfig() {
  var config = getConfig();
  var provider = config.activeProvider;
  if (provider === 'mimo' && config.mimo.enabled) return config.mimo;
  if (provider === 'ecs' && config.ecs.enabled) return config.ecs;
  return null;
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
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  getConfig: getConfig,
  saveConfig: saveConfig,
  getActiveConfig: getActiveConfig,
  updateProvider: updateProvider
};
