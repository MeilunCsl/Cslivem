# CHANGELOG

> 版本管理遵循 [语义化版本](https://semver.org/lang/zh-CN/)
> 格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

## 版本路线图
| 版本 | 代号 | 内容 | 状态 |
|------|------|------|------|
| v0.1.0 | Skeleton | 项目骨架、设计系统、底部导航、首页工作台 | ✅ 已完成 |
| v0.2.0 | Note | 笔记模块：列表、详情、编辑器、标签、收藏、持久化 | ✅ 已完成 |
| v0.3.0 | Calendar | 日历模块：月视图、事件管理、日记 | ⏳ 待开发 |
| v0.4.0 | Ledger | 记账模块：收支记录、月度流水、分类 | ⏳ 待开发 |
| v0.5.0 | AI-Core | AI 能力：意图识别、标签建议、摘要 | ⏳ 待开发 |
| v0.6.0 | Tools | 工具平台：图片转PDF、OCR、扫描 | ⏳ 待开发 |
| v0.7.0 | Sync | 云同步：登录、数据同步、冲突处理 | ⏳ 待开发 |
| v0.8.0 | Search | 全局搜索、知识图谱 | ⏳ 待开发 |
| v0.9.0 | Polish | 性能优化、UI 细节、动画 | ⏳ 待开发 |
| v1.0.0 | Release | 正式发布版 | ⏳ 待开发 |

---

## v0.2.0 — Note（2026-06-12）

### 新增
- 笔记领域模型 `modules/note/model.js`：
  - Note 实体定义（id, title, content, summary, tags, isFavorite, category, source）
  - 数据验证（validate）
  - 摘要自动生成（从 Markdown 内容提取纯文本前 100 字符）
  - 时间戳自动更新（touch）
- 笔记数据仓储 `modules/note/repository.js`：
  - CRUD 操作（getAll, getById, save, delete）
  - 搜索功能（按标题、内容、标签模糊匹配）
  - 筛选功能（按标签、收藏状态）
  - 收件箱管理（addToInbox, archiveFromInbox）
  - 统计信息（getStats）
  - 本地存储持久化
- 笔记模块 Public API 更新：
  - 创建笔记（createNote）
  - 更新笔记（updateNote）
  - 删除笔记（deleteNote）
  - 切换收藏（toggleFavorite）
  - 标签管理（addTag, removeTag）
  - 快速记录（addQuickNote）
- 笔记详情页 `pages/note-detail/`：
  - 笔记内容展示
  - 在线编辑（切换编辑/预览模式）
  - 收藏切换
  - 标签增删
  - 删除确认
- 笔记编辑器页 `pages/note-editor/`：
  - 标题输入
  - Markdown 工具栏（粗体、斜体、标题、列表、代码、链接、分割线）
  - 自动保存草稿
- 知识列表页升级：
  - 5 种筛选模式（收件箱/最近/全部/收藏/标签）
  - 笔记点击跳转详情
  - 右下角 FAB 新建按钮
  - 空态提示
- `utils/format.js` 新增 generateId 函数

### 变更
- `app.json` 注册 note-detail 和 note-editor 页面
- `modules/note/public.js` 从桩数据切换为仓储数据
- `pages/notes/notes.js` 使用真实数据 + 筛选逻辑
- `pages/notes/notes.wxml` 添加 FAB 按钮和详情跳转

### 不变性
- 模块间只通过 `public.js` 通信
- 业务模块不直接调用 `wx.*`，统一走 `platform-adapter`
- 所有数据集中在模块 `public.js` 暴露

---

## v0.1.0 — Skeleton（2026-06-11）

### 新增
- 项目脚手架：原生微信小程序结构
- 设计系统：CSS 变量、reset、mixins
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
  - 首页智能工作台
  - 知识列表页
  - 日历月视图
  - 工具中心页
- 公共组件：
  - `custom-tabbar` — 自定义底部导航 + 中央 FAB
  - `search-input` — AI 搜索输入框
  - `card` — 通用卡片
  - `nav-bar` — 自定义顶部导航栏
- Git 版本管理初始化

---

*v0.2.0 笔记模块完成 — 可进入下一阶段开发。*