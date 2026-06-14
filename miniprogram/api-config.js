// miniprogram/api-config.js
// AI API 配置（可配置多种服务）

var localStorage = require('../core/storage/local-storage');
var keys = require('../core/storage/storage-keys');

var DEFAULT_CONFIG = {
  activeProvider: 'mimo',
  localMode: { enabled: true },
  mimo: {
    enabled: true,
    endpoint: 'http://127.0.0.1:11434/v1/chat/completions',
    apiKey: '',
    model: 'mimo',
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
  if (!saved) return DEFAULT_CONFIG;
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
  localStorage.setJSON(keys.API_CONFIG, config);
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
