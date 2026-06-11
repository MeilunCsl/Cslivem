// miniprogram/tool-registry.js - 工具模块注册表
// 所有工具模块通过此表注册，平台内核通过注册表查询和管理工具

const _tools = {};

module.exports = {
  /**
   * 注册工具模块
   * @param {Object} manifest 工具清单对象
   * @param {string} manifest.id 模块唯一 ID
   * @param {string} manifest.name 显示名称
   * @param {string} manifest.version 版本号
   * @param {string} manifest.lifecycle 生命周期状态
   * @param {string[]} manifest.permissions 所需权限
   * @param {boolean} manifest.enabledByDefault 默认启用
   * @param {string} manifest.icon 图标
   */
  register(manifest) {
    if (!manifest || !manifest.id) {
      console.error('[ToolRegistry] 注册失败：缺少 id');
      return;
    }
    if (_tools[manifest.id]) {
      console.warn('[ToolRegistry] 覆盖已注册工具:', manifest.id);
    }
    _tools[manifest.id] = {
      ...manifest,
      enabled: manifest.enabledByDefault !== false,
      registeredAt: Date.now()
    };
    console.log('[ToolRegistry] 已注册:', manifest.id, manifest.name);
  },

  /**
   * 获取所有已注册工具
   * @returns {Object[]}
   */
  getAll() {
    return Object.values(_tools);
  },

  /**
   * 获取已启用的工具
   * @returns {Object[]}
   */
  getEnabled() {
    return Object.values(_tools).filter(t => t.enabled);
  },

  /**
   * 获取单个工具
   * @param {string} id 模块 ID
   * @returns {Object|null}
   */
  get(id) {
    return _tools[id] || null;
  },

  /**
   * 判断工具是否已注册且启用
   * @param {string} id 模块 ID
   * @returns {boolean}
   */
  isEnabled(id) {
    const tool = _tools[id];
    return !!tool && tool.enabled;
  },

  /**
   * 启用/禁用工具
   * @param {string} id 模块 ID
   * @param {boolean} enabled
   */
  setEnabled(id, enabled) {
    if (_tools[id]) {
      _tools[id].enabled = !!enabled;
    }
  }
};
