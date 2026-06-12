// miniprogram/tool-registry.js

const _tools = {};

module.exports = {
  register(manifest) {
    if (!manifest || !manifest.id) {
      console.warn('[ToolRegistry] invalid manifest');
      return;
    }
    _tools[manifest.id] = manifest;
    console.log('[ToolRegistry] registered:', manifest.name);
  },

  getAll() {
    return Object.values(_tools);
  },

  getEnabled() {
    return this.getAll().filter(t => t.enabledByDefault !== false);
  },

  isEnabled(id) {
    const tool = _tools[id];
    return tool ? tool.enabledByDefault !== false : false;
  },

  get(id) {
    return _tools[id] || null;
  }
};
