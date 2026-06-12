# CHANGELOG

> 版本管理遵循 [语义化版本](https://semver.org/lang/zh-CN/)
> 格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)

## 版本路线图
| 版本 | 代号 | 内容 | 状态 |
|------|------|------|------|
| v0.1.0 | Skeleton | 项目骨架、设计系统、底部导航、首页工作台 | ✅ 已完成 |
| v0.2.0 | Note | 笔记模块：列表、详情、编辑器、标签、收藏、持久化 | ✅ 已完成 |
| v0.3.0 | Calendar | 日历模块：月视图、事件管理、日记 | ✅ 已完成 |
| v0.4.0 | Ledger | 记账模块：收支记录、月度流水、分类 | ✅ 已完成 |
| v0.5.0 | AI-Core | AI 能力：意图识别、标签建议、摘要 | ✅ 已完成 |
| v0.6.0 | Tools | 工具平台：图片转PDF、OCR、扫描 | ✅ 已完成 |
| v0.7.0 | Sync | 云同步：登录、数据同步、冲突处理 | ✅ 已完成 |
| v0.8.0 | Search | 全局搜索、知识图谱 | ✅ 已完成 |
| v0.9.0 | Polish | 性能优化、UI 细节、动画 | ⏳ 待开发 |
| v1.0.0 | Release | 正式发布版 | ⏳ 待开发 |

---



## v0.8.0 — Search（2026-06-12）

### 新增
- 全局搜索页面 `pages/search/`：
  - 跨模块搜索（笔记 + 日历事件 + 记账流水）
  - 搜索结果分类展示 + 跳转详情
  - 热门搜索快捷词
  - 空态提示 + 清除按钮
- 首页搜索框改为点击跳转搜索页
- 建议词点击带参数跳转搜索页

### 变更
- `app.json` 注册 search 页面
- `home.js` 新增 onInputTap + 建议词跳转
- `home.wxml` 输入框改为可点击匹配区
- `home.wxss` 新增点击态样式

---

## v0.7.0 — Sync（2026-06-12）

### 新增
- 同步管理器 `miniprogram/sync-manager.js`：
  - 操作队列（enqueue/getPending/markDone/markFailed）
  - 失败重试（最多 3 次）
  - 队列清理和状态查询
  - 冲突解决策略桩（最后修改时间胜出）
  - 模拟同步接口
- `app.js` 启动时初始化 syncManager

---

## v0.6.0 — Tools（2026-06-12）

### 新增
- 图片转PDF 工具模块 `modules/tool-pdf/`：manifest + public API 桩
- OCR 识别 工具模块 `modules/tool-ocr/`：manifest + public API 桩
- 扫描归档 工具模块 `modules/tool-scanner/`：manifest + public API 桩
- `app.js` 注册三个工具模块到 tool-registry

### 不变性
- 工具模块独立，通过 tool-registry 注册和查询
- 工具功能为桩实现，后续逐步实现真实逻辑

---

## v0.5.0 — AI-Core（2026-06-12）

### 变更
- `miniprogram/ai-gateway.js` 升级：
  - 意图解析（parseIntent）支持中文关键词匹配（创建/搜索/删除/查看/统计/更新）
  - 标签建议（suggestTags）基于正则模式匹配（会议/待办/灵感/学习/工作/餐饮/购物）
  - 分类（classify）支持笔记/事件/记账/任务/问题分类
  - 请求日志记录（最近 100 条）

---

## v0.4.0 — Ledger（2026-06-12）

### 新增
- 记账领域模型 `modules/ledger/model.js`：
  - Account 实体（id, name, type, icon, currency, balance）
  - Transaction 实体（id, type, amountMinor, categoryId, accountId, date, note）
  - Category 实体（id, name, type, icon, color）
  - 8 个默认支出分类 + 6 个默认收入分类
  - 事务验证（validateTransaction）
  - 金额统一使用最小货币单位整数（禁浮点）
- 记账数据仓储 `modules/ledger/repository.js`：
  - Account CRUD（getAll, getById, save, delete）
  - Transaction CRUD + 余额自动计算
  - 按月查询（getTransactionsByMonth, getMonthlySummary）
  - 分类管理（getAll, getByType, getById）
  - 默认账户初始化（现金/微信/支付宝/银行卡）
  - 本地存储持久化
- 记账模块 Public API：
  - 账户管理（getAccounts, createAccount, updateAccount）
  - 流水管理（createTransaction, deleteTransaction, getRecentTransactions）
  - 月度查询（getMonthTransactions, getMonthlySummary）
  - 分类查询（getCategories, getExpenseCategories, getIncomeCategories）
  - 统计（getStats）
- 记账页面 `pages/ledger/`：
  - 月份切换 + 收支/结余汇总卡
  - 账户横向滚动展示
  - 最近流水列表
  - 快速记账 FAB + 滑出面板（类型/金额/分类/账户/备注）
  - 入场动画
- `app.json` 注册 ledger 页面
- `app.js` 启动时调用 ledgerModule.init()

### 不变性
- 模块间只通过 `public.js` 通信
- 数据本地存储，不接入后端
- M0+M1 范围，转账/预算/周期账单后续实现

---

## v0.3.0 — Calendar（2026-06-12）

### 新增
- 日历领域模型 modules/calendar/model.js：
  - Event 实体定义（id, title, date, time, endTime, description, type, color, isAllDay, reminder, relatedNoteId）
  - Diary 实体定义（id, date, content, mood, weather, tags）
  - 数据验证（validateEvent）
  - 时间戳自动更新（touch）
- 日历数据仓储 modules/calendar/repository.js：
  - Event CRUD（getAll, getById, save, delete）
  - 按日期查询（getEventsByDate, getEventsByMonth）
  - Diary 读写（getDiaryByDate, saveDiary）
  - 统计信息（getStats）
  - 本地存储持久化
- 日历模块 Public API：
  - 事件管理（createEvent, updateEvent, deleteEvent, getTodayEvents, getMonthEvents, getEventsByDate）
  - 日记管理（getDiary, saveDiary）
  - 统计（getStats）
- 日历页面升级 pages/calendar/：
  - 月视图日期网格，支持前/后月切换
  - 选中日期高亮 + 事件点标记
  - 事件创建表单（标题 + 时间）
  - 事件列表展示 + 删除
  - 日记区域（自动保存）
  - 入场动画（淡入 + 上移）

### 修复
- manifest.js 空文件（0字节）导致 app.js 启动失败
- calendar.js 中文乱码（星期名称编码损坏）

### 变更
- calendar.wxml 模板重写，对齐新的数据结构
- calendar.wxss 补充事件表单/日记/选中状态样式
- 花括号配对验证通过（48/48）

### 不变性
- 模块间只通过 public.js 通信
- 日历数据存储在本地 localStorage

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