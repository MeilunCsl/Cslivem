// utils/logger.js

const PREFIX = '[AKH]';

module.exports = {
  info(msg, ...args) {
    console.log(PREFIX, msg, ...args);
  },

  warn(msg, ...args) {
    console.warn(PREFIX, msg, ...args);
  },

  error(msg, ...args) {
    console.error(PREFIX, msg, ...args);
  },

  debug(msg, ...args) {
    console.log(PREFIX, '[DEBUG]', msg, ...args);
  }
};
