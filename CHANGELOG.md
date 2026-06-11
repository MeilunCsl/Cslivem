# CHANGELOG

> 版本管理遵循 [语义化版本](https://semver.org/lang/zh-CN/)  
> 格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

## 版本路线图

| 版本 | 代号 | 内容 | 状态 |
|------|------|------|------|
| v0.1.0 | Skeleton | 项目骨架、设计系统、底部导航、首页工作台 | ✅ 已完成 |
| v0.2.0 | Note | 笔记模块：列表、详情、编辑器基础 | 🔲 待开发 |
| v0.3.0 | Calendar | 日历模块：月视图、事件管理、日记 | 🔲 待开发 |
| v0.4.0 | Ledger | 记账模块：收支记录、月度流水、分类 | 🔲 待开发 |
| v0.5.0 | AI-Core | AI 能力：意图识别、标签建议、摘要 | 🔲 待开发 |
| v0.6.0 | Tools | 工具平台：图片转PDF、OCR、扫描 | 🔲 待开发 |
| v0.7.0 | Sync | 云同步：登录、数据同步、冲突处理 | 🔲 待开发 |
| v0.8.0 | Search | 全局搜索、知识图谱 | 🔲 待开发 |
| v0.9.0 | Polish | 性能优化、UI 细节、动画 | 🔲 待开发 |
| v1.0.0 | Release | 正式发布版 | 🔲 待开发 |

---

## v0.1.0 — Skeleton（2026-06-11）

### 新增
- 项目脚手架：原生微信小程序结构
- 设计系统：CSS 变量（颜色、间距、圆角、字体）、reset、mixins
- 平台内核 `miniprogram/`：
  - `event-bus.js` — 模块间事件通信
  - `storage.js` — 本地存储封装 + 版本迁移
  - `platform-adapter.js` — wx.* 能力适配器
  - `ai-gateway.js` — AI 统一网关桩
  - `tool-registry.js` — 工具模块注册表
- 模块骨架：
  - `note` — 笔记模块 manifest + public API（含桩数据）
  - `calendar` — 日历模块 manifest + public API（含桩数据）
  - `ledger` — 记账模块 manifest + public API（含桩数据）
- 页面：
  - 首页智能工作台（欢迎语、AI 搜索、快捷动作、今日卡片、收件箱、最近笔记横向滚动、常用工具）
  - 知识列表页（筛选标签、笔记列表、空态）
  - 日历月视图（月份切换、日期网格、今日事件）
  - 工具中心页（可用工具网格、更多工具预告）
- 公共组件：
  - `custom-tabbar` — 自定义底部五 Tab + 中央 FAB + 快速记录面板
  - `search-input` — AI 搜索输入框
  - `card` — 通用卡片
  - `nav-bar` — 自定义顶部导航栏
- Git 版本管理初始化

### 不变性
- 模块间只通过 `public.js` 通信
- 业务模块不直接调用 `wx.*`，统一走 `platform-adapter`
- 所有桩数据集中在模块 `public.js` 中