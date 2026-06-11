# 验收记录

> 每次版本验收后在此记录结果。  
> 格式：版本号 → 验收项 → 通过/未通过 → 备注

---

## v0.1.0 — Skeleton 验收（2026-06-11）

**验收人**: cansen  
**环境**: Windows, 微信开发者工具 2.01.2510290, 基础库 3.16.1

### 文件结构

- [x] 60 个文件全部创建完成
- [x] 目录结构符合计划（miniprogram/ modules/ pages/ components/ styles/ assets/ utils/）
- [x] 所有 JSON 文件格式验证通过（11 个）
- [x] 所有 JS 文件语法验证通过（23 个）

### 配置

- [x] `project.config.json` — libVersion 已对齐 3.16.1
- [x] `app.json` — 4 个 Tab 页 + custom tabBar 配置
- [x] `sitemap.json` — 爬虫规则
- [x] 所有文件 UTF-8 无 BOM 编码

### 设计系统

- [x] CSS 变量：主色 `#6C5CE7`、背景 `#F7F7FA`、卡片 `#FFFFFF`
- [x] 间距 4pt 基准（8rpx 单位）
- [x] 圆角规范：sm/md/lg/xl/full
- [x] 字体规范：标题/正文/辅助
- [x] reset.wxss 基础重置
- [x] mixins.wxss 工具类

### 平台内核

- [x] `event-bus.js` — on/emit/off/once 正常
- [x] `storage.js` — init/set/get/remove 版本迁移
- [x] `platform-adapter.js` — 登录/文件/相机/通知/网络/系统桩
- [x] `ai-gateway.js` — 摘要/标签/分类/意图/问答/OCR 桩
- [x] `tool-registry.js` — register/getAll/getEnabled/isEnabled

### 模块骨架

- [x] `note` — manifest + public（含 5 条桩数据最近笔记、3 条收件箱）
- [x] `calendar` — manifest + public（含 2 条今日事件桩）
- [x] `ledger` — manifest + public（含 3 个默认账户桩）
- [x] 各模块 README.md 文档

### 页面

- [x] 首页 — 欢迎语、AI 搜索框、快捷动作 4 宫格、今日卡片、收件箱、最近笔记横滑、工具 2×2 网格
- [x] 知识 — 筛选标签栏、笔记列表、空态
- [x] 日历 — 月份切换、星期头、日期网格、今日事件
- [x] 工具 — 可用工具网格、即将推出预告

### 组件

- [x] `custom-tabbar` — 五 Tab 导航 + 中央 FAB + 快速记录弹出面板
- [x] `search-input` — 带 AI 徽标
- [x] `card` — 通用卡片
- [x] `nav-bar` — 自定义顶部导航

### 待解决问题

| # | 问题 | 状态 | 备注 |
|---|------|------|------|
| 1 | appid 使用测试号 | 🔲 待替换 | 正式开发需替换为真实 AppID |
| 2 | Tab 图标为占位 PNG | 🔲 待替换 | 后续用设计稿图标替换 |
| 3 | 自定义 TabBar 与页面绑定 | 🔲 待验证 | 需在真机验证 Tab 切换 |
| 4 | 桩数据未持久化 | ✅ 预期行为 | v0.2.0 起接入真实数据 |

---

*v0.1.0 验收通过 — 框架搭建完成，可进入下一阶段开发。*