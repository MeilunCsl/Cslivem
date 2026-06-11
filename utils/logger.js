// utils/logger.js - 日志工具

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

let currentLevel = __wxConfig ? LEVELS.INFO : LEVELS.DEBUG;

function _log(level, tag, message, data) {
  if (level < currentLevel) return;
  const prefix = `[${tag}]`;
  switch (level) {
    case LEVELS.DEBUG:
      console.debug(prefix, message, data || '');
      break;
    case LEVELS.INFO:
      console.info(prefix, message, data || '');
      break;
    case LEVELS.WARN:
      console.warn(prefix, message, data || '');
      break;
    case LEVELS.ERROR:
      console.error(prefix, message, data || '');
      break;
  }
}

module.exports = {
  setLevel(level) { currentLevel = level; },

  debug(tag, message, data) { _log(LEVELS.DEBUG, tag, message, data); },
  info(tag, message, data) { _log(LEVELS.INFO, tag, message, data); },
  warn(tag, message, data) { _log(LEVELS.WARN, tag, message, data); },
  error(tag, message, data) { _log(LEVELS.ERROR, tag, message, data); }
};
