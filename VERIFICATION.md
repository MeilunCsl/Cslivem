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

## v0.3.0 — Calendar 验收（2026-06-12）

**验收人**: cansen  
**环境**: Windows, 微信开发者工具 2.01.2510290, 基础库 3.16.1

### 文件结构

- [x] modules/calendar/manifest.js — 内容完整（id, name, version, lifecycle, icon, description）
- [x] modules/calendar/model.js — Event + Diary 实体 + 验证
- [x] modules/calendar/repository.js — CRUD + 日期查询 + 持久化
- [x] modules/calendar/public.js — 完整 Public API（11 个方法）
- [x] pages/calendar/calendar.js — 中文正常、数据接入真实
- [x] pages/calendar/calendar.wxml — 日历网格 + 事件 + 日记模板
- [x] pages/calendar/calendar.wxss — 花括号配对 (48/48) 验证通过

### 功能验证

- [x] 日历模块可被 	ool-registry 注册和查询
- [x] 事件创建、列表、删除流程正常
- [x] 日记区域可输入并自动保存
- [x] 月视图切换正常（前/后月）
- [x] 选中日期高亮 + 事件点标记来自真实数据
- [x] 底部 Tab 导航正确定位到日历 Tab
- [x] 入场动画淡入效果正常

### v1.6.0 — AI-UX 验收（2026-06-14）

**验收人**: cansen
**环境**: Windows, 微信开发者工具 2.01.2510290, 基座 3.16.1

### 文件变更

- [x] `pages/home/home.js` — 输入框改为真实 input，发送到 AI 对话页
- [x] `pages/home/home.wxml` — 真实 `<input>` 替代点击跳转
- [x] `pages/ai-chat/ai-chat.js` — 接受 query 参数、增强知识上下文、保存笔记
- [x] `pages/ai-chat/ai-chat.wxml` — 欢迎建议、保存按钮、打字动画
- [x] `pages/ai-chat/ai-chat.wxss` — 完整重写 (47/47 平衡)
- [x] `pages/graph-view/graph-view.js` — 加载邻居节点详情
- [x] `pages/graph-view/graph-view.wxml` — 关联节点 chip 列表
- [x] `pages/graph-view/graph-view.wxss` — 邻居节点样式 (38/38 平衡)

### 功能验证

- [x] 首页输入问题后跳转到 AI 对话页并自动发送
- [x] 快捷建议点击后跳转到对应页面
- [x] AI 对话页欢迎语 + 快捷建议卡片显示
- [x] AI 回复下方显示「保存」按钮
- [x] 保存为笔记功能正常
- [x] AI 对话上下文包含知识图谱节点信息
- [x] 图谱视图点击节点显示关联节点列表
- [x] 点击关联节点可跳转定位
- [x] 打字动画三点弹跳效果

### 质量检查

- [x] 20 WXSS 花括号全部平衡
- [x] 56 JS 无 BOM
- [x] 21 JSON 格式正确

---

*v1.6.0 验收通过 — AI 对话体验增强、图谱节点详情卡完成。*

## 教训记录

| # | 问题 | 状态 | 备注 |
|---|------|------|------|
| BUG-004 | manifest.js 0字节导致启动失败 | ✅ 已修复 | Python 写入避免编码问题 |
| BUG-005 | calendar.js 中文乱码 | ✅ 已修复 | 整文件用 Python 重写 |
| BUG-006 | PowerShell || && 被解析为运算符 | ✅ 已规避 | 复杂 HTML 用 Python 脚本文件写入 |

---

*v0.3.0 验收通过 — 日历模块完整，可进入下一阶段开发。*


## v0.4.0 — Ledger 验收（2026-06-12）

**验收人**: cansen
**环境**: Windows, 微信开发者工具 2.01.2510290, 基础库 3.16.1

### 文件结构

- [x] `modules/ledger/manifest.js` — v0.4.0 active
- [x] `modules/ledger/model.js` — Account + Transaction + Category 实体
- [x] `modules/ledger/repository.js` — CRUD + 月度查询 + 余额计算 + 持久化
- [x] `modules/ledger/public.js` — 完整 Public API (15 个方法)
- [x] `pages/ledger/ledger.js` — 记账页面逻辑
- [x] `pages/ledger/ledger.wxml` — 汇总卡 + 账户 + 流水 + 创建表单
- [x] `pages/ledger/ledger.wxss` — 花括号配对 (75/75) 验证通过
- [x] `app.json` — ledger 页面已注册
- [x] `app.js` — ledgerModule.init() 已调用

### 功能验证

- [x] 记账模块可被 tool-registry 注册和查询
- [x] 默认账户初始化（现金/微信/支付宝/银行卡）
- [x] 默认分类初始化（8支出 + 6收入）
- [x] 流水创建、列表、删除流程正常
- [x] 月度汇总计算正确（收入/支出/结余）
- [x] 账户余额自动更新
- [x] 底部 Tab 导航正确定位到工具 Tab
- [x] 所有 JS 文件 UTF-8 无 BOM
- [x] 所有 WXSS 花括号配对验证通过

### 教训记录

| # | 问题 | 状态 | 备注 |
|---|------|------|------|
| BUG-007 | PowerShell `\|\|` 被解析为运算符 | ✅ 已规避 | 使用 PowerShell here-string `‘@ ... ’@` pipe 到 python |

---

*v0.4.0 验收通过 — 记账模块 M0+M1 完成，可进入下一阶段开发。*

## v0.5.0 + v0.6.0 — AI-Core + Tools 验收（2026-06-12）

**验收人**: cansen

### v0.5.0 AI-Core

- [x] `ai-gateway.js` 意图解析支持 6 种中文意图
- [x] 标签建议支持 7 种关键词模式
- [x] 分类支持 5 种类型
- [x] 请求日志功能正常

### v0.6.0 Tools

- [x] 3 个工具模块注册到 tool-registry
- [x] `app.js` 启动时注册所有工具
- [x] 工具模块独立、符合最小出口原则
- [x] manifest 正确定义 permissions 和 lifecycle

### 框架完整性检查

- [x] 平台内核 `miniprogram/` 5 个文件全部实现
- [x] 领域模块 `modules/` 7 个（note, calendar, ledger, tool-pdf, tool-ocr, tool-scanner + 原 ledger）
- [x] 页面 `pages/` 7 个（home, notes, note-detail, note-editor, calendar, ledger, tools）
- [x] 组件 `components/` 4 个（custom-tabbar, card, search-input, nav-bar）
- [x] 设计系统 `styles/` 3 个 + `app.wxss`
- [x] 工具函数 `utils/` 3 个
- [x] 所有 WXSS 花括号配对验证通过
- [x] 所有 JS UTF-8 无 BOM

---

*v0.5.0 + v0.6.0 验收通过 — 框架搭建完成，可进入功能迭代阶段。*

## v0.7.0 + v0.8.0 — Sync + Search 验收（2026-06-12）

**验收人**: cansen

### v0.7.0 Sync

- [x] `sync-manager.js` 操作队列正常
- [x] enqueue/markDone/markFailed/cleanup 流程正常
- [x] getStatus 返回正确状态
- [x] retryFailed 重试逻辑正确
- [x] resolveConflict 最后修改时间策略
- [x] app.js 启动时初始化

### v0.8.0 Search

- [x] 搜索页面可打开
- [x] 跨模块搜索（笔记/日历/记账）
- [x] 搜索结果展示 + 跳转
- [x] 热门搜索词功能
- [x] 首页搜索框跳转搜索页
- [x] 建议词带参数跳转
- [x] WXSS 花括号配对 (27/27)
- [x] 所有 JS UTF-8 无 BOM

### 框架完整性统计

| 层 | 文件数 | 状态 |
|------|---------|------|
| 平台内核 miniprogram/ | 6 | ✅ |
| 领域模块 modules/ | 8 | ✅ |
| 页面 pages/ | 8 | ✅ |
| 组件 components/ | 4 | ✅ |
| 设计系统 styles/ | 3 | ✅ |
| 工具 utils/ | 3 | ✅ |
| 总文件数 | 122 | ✅ |

---

*v0.7.0 + v0.8.0 验收通过 — 框架搭建基本完成。*

## v0.9.0 — Polish 验收（2026-06-12）

**验收人**: cansen

### 动画统一性

- [x] home: anim-fade-up + anim-visible
- [x] notes: anim-fade + anim-show
- [x] note-detail: anim-fade + anim-show
- [x] note-editor: anim-fade + anim-show
- [x] calendar: anim-fade + anim-show
- [x] ledger: anim-fade + anim-show
- [x] search: anim-fade + anim-show (新增)
- [x] tools: anim-fade + anim-show

### 数据源统一

- [x] tools 页从 tool-registry 动态加载工具列表
- [x] 所有模块通过 public.js 暴露 API
- [x] 所有页面通过 require 引入模块

### 质量检查

- [x] 0 JS 编码问题
- [x] 16 WXSS 花括号全部配对
- [x] 所有 JSON 格式正确

---

*v0.9.0 验收通过 — 框架搭建完成，可进入 v1.0.0 发布准备。*

### 追加验收（2026-06-11 首页重设计）

- [x] 首页改为 ChatGPT 极简风格（居中 Logo + 输入框 + 建议词）
- [x] Logo 生成完成（紫色渐变几何 C 风格）
- [x] app-icon.png / logo.png / logo-small.png 三个尺寸就位
- [x] appid 已替换为正式 AppID wxe8c16cbcf5c42920
- [x] 旧根目录 project.config.json.bak 已清理

---

*v0.1.0 补充验收通过 — 首页极简风格 + Logo 完成。*

---

## 教训记录

### BUG-001: 正则替换 CSS 导致花括号缺失 (2026-06-11)

**问题**: PowerShell 正则替换 WXSS 中 padding-bottom 时，误吃了 .page-container 的闭合 }，导致编译报错 unexpected '{'。

**影响**: calendar.wxss、notes.wxss、tools.wxss 三个文件同时出错。

**修复规则**:
1. 禁止用正则批量修改 CSS/WXSS。改用完整文件重写。
2. 修改后必须校验花括号配对: { 数量 == } 数量。
3. 批量修改前备份原文件，用 git diff 确认变更范围。


## v1.5.0 — ECS-Sync ?????026-06-14??

**?????*: cansen
**???*: Windows, ??????????2.01.2510290, ????3.16.1

### ??????

- [x] `miniprogram/ecs-adapter.js` — ????????80+ ????????? HTTP ???
- [x] `pages/settings/settings.js` — ??????????I/ECS ??????????????????????
- [x] `pages/settings/settings.wxml` — ?????????Provider ???????????????????
- [x] `pages/settings/settings.wxss` — ??????????????4/54 ?????
- [x] `pages/settings/settings.json` — ????????
- [x] `pages/tools/tools.js` — ??? onSettingsTap ???
- [x] `pages/tools/tools.wxml` — ????????????
- [x] `pages/tools/tools.wxss` — ???????????????4/34 ?????
- [x] `app.js` — ??? ecsAdapter ????????
- [x] `app.json` — ??? pages/settings/settings

### ??????

- [x] ECS ?????init ??????
- [x] isAvailable ?????? ECS ???
- [x] enqueue ?????????
- [x] exportData ?????? JSON ???
- [x] importData ?????????ID ??? + updatedAt ?????
- [x] getPackagePreview ????????????
- [x] getStatus ??????????
- [x] ????? ???/??? ????????
- [x] Provider ??? MiMo/ECS ???
- [x] ????????????

### ???????

- [x] 20 ? WXSS ??????????????
- [x] 56 ? JS ???? BOM
- [x] 21 ? JSON ??????
- [x] ???????????????????????

### ??????

| # | ? | ?? | ??? |
|---|------|------|------|
| — | — | — | v1.5.0 ?????UG |

---

*v1.5.0 ?????? — ECS ??? ????? ???/??? ????????
