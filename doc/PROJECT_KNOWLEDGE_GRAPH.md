# Cslivem AI Knowledge Hub — 完整知识图谱

> 生成时间: 2026-06-14 | 版本: v1.7.4 | 框架: 原生微信小程序
> 仓库: https://github.com/MeilunCsl/Cslivem.git

---

## 一、项目全局架构

`
┌─────────────────────────────────────────────────────────┐
│                    app.json (路由+Tab+窗口)               │
│                    app.js   (入口+模块注册)               │
│                    app.wxss (全局样式)                    │
├─────────────┬───────────────┬──────────────┬────────────┤
│   pages/    │  components/  │   modules/   │   core/    │
│   32 页面    │   4 公共组件   │  17 功能模块  │  11 核心库 │
├─────────────┼───────────────┼──────────────┼────────────┤
│ miniprogram/│    styles/    │   assets/    │   utils/   │
│  10 平台层   │  3 设计系统    │  图标+图片    │  3 工具函数 │
└─────────────┴───────────────┴──────────────┴────────────┘
`

---

## 二、底部导航栏 (TabBar)

| 列 | 名称 | 路由 | selected | 图标 |
|----|------|------|----------|------|
| 1 | 首页 | pages/home/home | 0 | 🏠 |
| 2 | 对话 | pages/conversations/conversations | 1 | 💬 |
| 3 | + | (中央按钮，弹出快捷面板) | - | ➕ |
| 4 | 知识 | pages/notes/notes | 3 | 📖 |
| 5 | 工具 | pages/tools/tools | 4 | 🛠️ |

**组件**: components/custom-tabbar/ — 自定义 TabBar，指示器用 wx:if 内嵌在每个 tab-item 中。

---

## 三、全部页面清单 (32页)

### 🔵 Tab 页面 (4个，常驻)

#### 1. home — 首页 (智能工作台)
- **路由**: pages/home/home
- **作用**: 应用入口，展示 AI 搜索框、快捷工具网格、最近对话、仪表盘统计
- **导航到**: 
  - → 对话页 (输入问题后 chat?send=xxx)
  - → 各工具页 (快捷工具网格点击)
  - → 搜索页、图谱页、设置页
- **数据**: conversationStore, habitModule, fcModule, moodModule, foodModule
- **关键方法**: onSend, loadDashboard, loadRecentConversations, onInput

#### 2. conversations — 对话列表
- **路由**: pages/conversations/conversations
- **作用**: 展示所有 AI 对话，支持搜索/筛选/删除/置顶
- **导航到**: 
  - → chat?id=xxx (查看对话)
  - → chat (新建对话)
  - → settings (设置)
- **数据**: conversationStore
- **筛选**: 全部/文本/图片/语音/已入库/未入库
- **关键方法**: loadConversations, onTapConversation, onCreateNew, onDelete, onTogglePin

#### 3. notes — 知识库
- **路由**: pages/notes/notes
- **作用**: 笔记管理 + 标签管理 + 知识图谱统计
- **导航到**:
  - → note-editor?id=xxx (编辑笔记)
  - → note-editor (新建笔记)
  - → note-detail?id=xxx (查看笔记)
  - → graph-view (图谱视图)
- **Tab**: 全部笔记 | 标签 | 图谱
- **数据**: noteService, graphEngine, graphQuery, graphStore
- **筛选**: 收件箱/最近/全部/收藏/标签

#### 4. tools — 工具中心
- **路由**: pages/tools/tools
- **作用**: 工具网格入口，注册所有工具模块
- **导航到**: 18 个工具页面 (见下方工具路由表)
- **数据**: toolRegistry

### 🟢 AI 对话 (2个)

#### 5. chat — AI 聊天
- **路由**: pages/chat/chat
- **参数**: ?id=xxx (已有对话) 或 ?send=xxx (自动发送)
- **作用**: 与 AI 多轮对话，支持图片/语音发送，消息保存到知识图谱
- **导航到**:
  - → settings (设置)
  - → note-detail (保存为笔记)
  - → graph-ingest (入库知识图谱)
- **数据**: conversationStore, gateway, types, assetStore, recorder, promptRegistry
- **关键方法**: onSend, onChooseImage, onStartRecord/Stop, startTypingEffect, onRetry, onSaveAsNote, onIngestToGraph

#### 6. ai-chat — 独立 AI 聊天
- **路由**: pages/ai-chat/ai-chat
- **作用**: 简化版 AI 聊天，带建议问题
- **导航到**: 返回

### 🟡 笔记相关 (3个)

#### 7. note-editor — 笔记编辑器
- **路由**: pages/note-editor/note-editor
- **参数**: ?id=xxx (编辑) 或无参 (新建)
- **作用**: 创建/编辑笔记，支持 Markdown 预览、AI 续写/改写
- **导航到**: 返回 notes
- **数据**: noteService
- **关键方法**: onTitleInput, onContentInput, togglePreview, onAiContinue, onAiRewrite

#### 8. note-detail — 笔记详情
- **路由**: pages/note-detail/note-detail
- **参数**: ?id=xxx
- **作用**: 查看笔记详情，收藏/分享/删除/AI 摘要
- **导航到**: 返回, graph (图谱)
- **数据**: noteService
- **关键方法**: toggleFavorite, onShareNote, deleteNote, onAiSummarize

#### 9. search — 搜索
- **路由**: pages/search/search
- **作用**: 全局搜索笔记和知识
- **导航到**: 各搜索结果页
- **数据**: noteService, graphQuery

### 🔴 知识图谱 (4个)

#### 10. graph-view — 图谱可视化
- **路由**: pages/graph-view/graph-view
- **作用**: Canvas 力导向图谱可视化，缩放/平移/节点点击
- **导航到**: 
  - → node-detail?id=xxx (节点详情)
  - → note-detail?id=xxx (关联笔记)
- **数据**: graphEngine, graphStore
- **关键方法**: loadGraphData, onCanvasTouchStart/Move/End, onZoomIn/Out

#### 11. node-detail — 节点详情
- **路由**: pages/node-detail/node-detail
- **参数**: ?id=xxx
- **作用**: 查看图谱节点详情、邻居节点、关联笔记
- **导航到**: 
  - → node-detail?id=xxx (跳转邻居)
  - → note-editor?id=xxx (编辑关联笔记)
- **数据**: graphEngine

#### 12. graph-ingest — 知识入库
- **路由**: pages/graph-ingest/graph-ingest
- **作用**: 将对话消息预览并入库到知识图谱
- **导航到**: 返回
- **数据**: ingestionService

#### 13. graph-debug — 图谱调试
- **路由**: pages/graph-debug/graph-debug
- **作用**: 开发调试用，查看图谱原始数据

### 🟣 工具页面 (15个)

| # | 页面 | 路由 | 模块 | 作用 |
|---|------|------|------|------|
| 14 | 日历 | pages/calendar/calendar | calendar | 月/周/日视图，事件管理 |
| 15 | 记账 | pages/ledger/ledger | ledger | 收支记录，月度流水 |
| 16 | 图片转PDF | pages/pdf/pdf | tool-pdf | 选图→A4排版→生成PDF→分享 |
| 17 | OCR识别 | pages/ocr/ocr | tool-ocr | 拍照/选图→文字识别→复制 |
| 18 | 扫描归档 | pages/scanner/scanner | tool-scanner | 拍照→亮度/对比度/灰度增强 |
| 19 | 图片压缩 | pages/compress/compress | tool-compress | 选图→质量调节→压缩→保存 |
| 20 | 单位换算 | pages/convert/convert | tool-convert | 长度/重量/温度/面积换算 |
| 21 | 文本处理 | pages/text-tool/text-tool | tool-text | 字数/大小写/反转/去重等 |
| 22 | 习惯打卡 | pages/habit/habit | habit | 创建习惯→每日打卡→统计 |
| 23 | 番茄钟 | pages/pomodoro/pomodoro | pomodoro | 25分钟计时→休息→循环 |
| 24 | 倒数日 | pages/countdown/countdown | countdown | 创建倒数日→首页提醒 |
| 25 | 饮食记录 | pages/food/food | food | 早/中/晚/加餐→卡路里记录 |
| 26 | 闪卡复习 | pages/flashcard/flashcard | flashcard | 创建卡组→翻卡→评分→复习 |
| 27 | 心情记录 | pages/mood/mood | mood | 选择心情→添加笔记→保存 |
| 28 | 随机工具 | pages/random/random | - | 骰子/随机数/随机问题 |

### ⚪ 其他页面 (4个)

| # | 页面 | 路由 | 作用 |
|---|------|------|------|
| 29 | 设置 | pages/settings/settings | AI 配置/ECS/同步/数据管理/导出导入 |
| 30 | 关于 | pages/about/about | 版本信息/统计入口/缓存清理 |
| 31 | 统计 | pages/stats/stats | 使用统计/导出 |
| 32 | 待办 | pages/todo/todo | 创建待办→完成→删除 |

---

## 四、核心模块详解

### 📦 modules/ — 17 个功能模块

每个模块遵循 manifest.js + public.js 规范：

| 模块 | ID | 版本 | manifest 入口 | 核心功能 |
|------|----|----|-------------|---------|
| note | note | 0.1.0 | note/manifest.js | 笔记 CRUD、搜索、标签 |
| calendar | calendar | 0.3.0 | calendar/manifest.js | 日历事件、月视图 |
| ledger | ledger | 0.4.0 | ledger/manifest.js | 收支记录、分类 |
| knowledge | knowledge | 1.1.0 | knowledge/manifest.js | 知识图谱元数据 |
| flashcard | flashcard | 2.0.0 | flashcard/manifest.js | 闪卡卡组、复习算法 |
| habit | habit | 1.8.0 | habit/manifest.js | 习惯打卡、统计 |
| todo | todo | 2.4.2 | todo/manifest.js | 待办清单 |
| pomodoro | pomodoro | 1.8.0 | pomodoro/manifest.js | 番茄钟计时 |
| countdown | countdown | 1.8.0 | countdown/manifest.js | 倒数日 |
| food | food | 1.9.0 | food/manifest.js | 饮食记录 |
| mood | mood | 2.0.0 | mood/manifest.js | 心情记录 |
| tool-pdf | tool-pdf | 1.7.0 | tool-pdf/manifest.js | 图片转PDF |
| tool-ocr | tool-ocr | 0.1.0 | tool-ocr/manifest.js | OCR识别 |
| tool-scanner | tool-scanner | 1.7.0 | tool-scanner/manifest.js | 扫描增强 |
| tool-compress | tool-compress | 2.0.0 | tool-compress/manifest.js | 图片压缩 |
| tool-convert | tool-convert | 2.0.0 | tool-convert/manifest.js | 单位换算 |
| tool-text | tool-text | 2.0.0 | tool-text/manifest.js | 文本处理 |

### 🧠 core/ — 11 个核心库

| 文件 | 作用 | 导出方法 |
|------|------|---------|
| ai/local-fallback.js | AI 本地降级（正则匹配） | generateTitle, generateSummary, extractTags, extractEntities, suggestLinks, answerQuestion |
| assets/local-asset-store.js | 资产存储（图片/语音） | add, get, getByMessage, getByConversation, remove, getStats |
| audio/recorder.js | 录音管理 | start, stop, onPause, onResume, onStop, onError, isRecording |
| audio/player.js | 音频播放 | play, pause, resume, stop, seek, getCurrentTime, getDuration |
| conversation/store.js | 对话存储 | getAllConversations, createConversation, deleteConversation, togglePin, getMessages, addMessage, getStats |
| conversation/types.js | 类型工厂 | generateId, createConversation, createMessage |
| graph/graph-engine.js | 图谱引擎 | upsertNode, deleteNode, upsertEdge, deleteEdge, getNeighbors, getStats, exportGraph, importGraph |
| graph/graph-query.js | 图谱查询 | searchNodes, getNodesByType, traverse, findPath, getSecondDegreeNeighbors |
| graph/graph-store.js | 图谱持久化 | loadGraph, saveGraph, exportGraph, importGraph, rebuildIndexes |
| graph/types.js | 图谱类型 | NodeType, EdgeType, createNode, createEdge, validateNode, validateEdge |
| knowledge/ingestion-service.js | 知识入库 | ingestConversation, ingestMessage, getIngestPreview, extractKeywords |
| notes/note-service.js | 笔记服务 | createNote, getNote, updateNote, deleteNote, listNotes, searchNotes, enrichNote |
| notes/wiki-link-parser.js | Wiki链接解析 | parseWikiLinks, extractLinkedTitles, replaceWikiLinks |
| storage/local-storage.js | 本地存储封装 | getJSON, setJSON, remove, clear, getInfo |
| storage/storage-keys.js | 存储键名 | GRAPH, NOTES, INBOX, API_CONFIG, SYNC_QUEUE, LEDGER_*, CALENDAR_* |

### ⚙️ miniprogram/ — 10 个平台层

| 文件 | 作用 | 导出 |
|------|------|------|
| ai-gateway.js | AI 统一网关 | ask, analyzeImage, transcribeVoice, summarize, generateTitle, extractTags, ocr |
| api-config.js | 多供应商配置 | PROVIDER_PRESETS (MiMo/DashScope/DeepSeek/OpenAI/Zhipu/Local), getConfig, saveConfig, getActiveConfig, updateProvider |
| ecs-adapter.js | 阿里云 ECS 同步 | init, sync, upload, download, getStatus |
| event-bus.js | 全局事件总线 | on, emit, off |
| migration-manager.js | 数据迁移 | runAll, getStatus |
| platform-adapter.js | wx.* 能力封装 | wxLogin, getUserProfile, chooseImage |
| prompt-registry.js | Prompt 模板注册 | get, set, getAll |
| storage.js | 存储版本管理 | init, get, set, migrate |
| sync-manager.js | 同步管理 | init, enqueue, process, getStatus |
| tool-registry.js | 工具注册表 | register, getAll, get, isEnabled, toggle |

---

## 五、组件

| 组件 | 路径 | 作用 |
|------|------|------|
| custom-tabbar | components/custom-tabbar/ | 底部导航栏（5列grid + 中央+按钮 + 快捷面板） |
| nav-bar | components/nav-bar/ | 自定义顶部导航栏 |
| search-input | components/search-input/ | AI 搜索/输入框 |
| card | components/card/ | 通用卡片组件 |

---

## 六、设计系统

| 文件 | 作用 |
|------|------|
| styles/variables.wxss | CSS 变量（颜色、间距、圆角、字体） |
| styles/mixins.wxss | 通用样式 mixin |
| styles/reset.wxss | 基础 reset |

**品牌色**: #6C5CE7 (主色) / #F7F7FA (背景) / #FFFFFF (卡片)

---

## 七、导航拓扑图

`
app.js (入口)
  │
  ├─→ home (首页) ─────────────────────────────────────────┐
  │     ├─→ chat?send=xxx (AI对话)                          │
  │     ├─→ notes (知识)                                    │
  │     ├─→ calendar (日历)                                 │
  │     ├─→ ledger (记账)                                   │
  │     ├─→ graph-view (图谱)                               │
  │     ├─→ ocr (OCR)                                       │
  │     ├─→ pdf (PDF)                                       │
  │     ├─→ flashcard (闪卡)                                │
  │     └─→ pomodoro (番茄钟)                               │
  │                                                          │
  ├─→ conversations (对话列表) ─────────────────────────────┤
  │     ├─→ chat?id=xxx (查看对话)                          │
  │     └─→ chat (新建对话)                                 │
  │                                                          │
  ├─→ [+] 快捷面板 ────────────────────────────────────────┤
  │     ├─→ 文字记录                                         │
  │     ├─→ 拍照                                             │
  │     ├─→ 语音                                             │
  │     └─→ 扫描                                             │
  │                                                          │
  ├─→ notes (知识库) ──────────────────────────────────────┤
  │     ├─→ note-editor?id=xxx (编辑)                       │
  │     ├─→ note-editor (新建)                              │
  │     ├─→ note-detail?id=xxx (详情)                       │
  │     ├─→ graph-view (图谱视图)                           │
  │     └─→ search (搜索)                                   │
  │                                                          │
  └─→ tools (工具中心) ────────────────────────────────────┤
        ├─→ calendar (日历)                                 │
        ├─→ ledger (记账)                                   │
        ├─→ graph-view (图谱)                               │
        ├─→ note-editor (笔记)                              │
        ├─→ pdf (图片转PDF)                                 │
        ├─→ ocr (OCR)                                       │
        ├─→ scanner (扫描)                                  │
        ├─→ compress (压缩)                                 │
        ├─→ text-tool (文本)                                │
        ├─→ convert (换算)                                  │
        ├─→ habit (习惯)                                    │
        ├─→ pomodoro (番茄钟)                               │
        ├─→ countdown (倒数日)                              │
        ├─→ food (饮食)                                     │
        ├─→ flashcard (闪卡)                                │
        ├─→ mood (心情)                                     │
        ├─→ random (随机)                                   │
        ├─→ todo (待办)                                     │
        └─→ settings (设置) ──→ about (关于) ──→ stats (统计)
`

---

## 八、AI 供应商配置

| 供应商 | ID | Endpoint | 默认模型 | 域名 |
|--------|-----|----------|---------|------|
| MiMo | mimo | token-plan-cn.xiaomimimo.com/v1/chat/completions | MiMo-7B-RL | token-plan-cn.xiaomimimo.com |
| DashScope | dashscope | dashscope.aliyuncs.com/compatible-mode/v1/chat/completions | qwen-plus | dashscope.aliyuncs.com |
| DeepSeek | deepseek | api.deepseek.com/v1/chat/completions | deepseek-chat | api.deepseek.com |
| OpenAI | openai | api.openai.com/v1/chat/completions | gpt-4o-mini | api.openai.com |
| 智谱 | zhipu | open.bigmodel.cn/api/paas/v4/chat/completions | glm-4-flash | open.bigmodel.cn |
| 本地 | local | http://127.0.0.1:11434/v1/chat/completions | mimo | - |

**模型路由**: 图片 → MiMo-V2.5-Pro | 文本 → 配置模型 | 无配置 → 本地降级

---

## 九、存储键名

| 键名 | 模块 | 用途 |
|------|------|------|
| core_graph | graph | 知识图谱数据 |
| core_notes | notes | 笔记列表 |
| core_inbox | notes | 收件箱 |
| core_api_config | settings | AI 配置 |
| core_sync_queue | sync | 同步队列 |
| ledger_accounts | ledger | 账户 |
| ledger_transactions | ledger | 交易记录 |
| calendar_events | calendar | 日历事件 |
| calendar_diary | calendar | 日记 |

---

## 十、版本历史 (关键节点)

| 版本 | 代号 | 内容 |
|------|------|------|
| v0.1.0 | Skeleton | 项目骨架、设计系统、底部导航、首页工作台 |
| v0.2.0~v0.6.0 | Note~Tools | 笔记/日历/记账/AI能力/工具平台 |
| v1.7.0 | Tools-Complete | PDF/扫描/图谱缩放/日历多视图/Markdown预览 |
| v1.7.1 | Navigation-Fix | 导航栏描点+白色背景+AI友好回复 |
| v1.7.2 | Bugfix-Round2 | 录音转文字+图片识别+页面去重 |
| v1.7.3 | AI-Config-Hint | AI配置提示+本地模式标识 |
| v1.7.4 | Tabbar-Rewrite | 指示器纯flex重写，告别absolute定位 |

---

## 十一、数据流

`
用户输入 → chat.onSend()
  → conversationStore.addMessage() (本地持久化)
  → gateway.ask(question)
    → apiConfig.getActiveConfig()
    → 有配置? callOpenAI() → AI响应
    → 无配置? localAnswerQuestion() → 本地降级
  → startTypingEffect() (打字动画)
  → conversationStore.addMessage() (AI回复持久化)
`

---

## 十二、文件统计

| 目录 | 文件数 | 说明 |
|------|--------|------|
| pages/ | 32 × 4 = 128 | 页面文件 |
| components/ | 4 × 4 = 16 | 组件文件 |
| modules/ | 17 × 3 ≈ 51 | 模块文件 |
| core/ | 11 | 核心库 |
| miniprogram/ | 10 | 平台层 |
| utils/ | 3 | 工具函数 |
| styles/ | 3 | 设计系统 |
| **合计** | **~222** | |

---

*本文档由 Codex 自动生成，基于项目源码扫描。*