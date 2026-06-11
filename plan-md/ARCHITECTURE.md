# AI Knowledge Hub 小程序架构设计

> 一个以“随手记录 + AI 整理 + 知识图谱 + 独立工具集”为核心的个人知识与生活管理产品。

## 1. 产品定位

本产品不是简单复制 Obsidian，而是将 Obsidian 的双链、Markdown、标签和知识图谱能力，改造成更适合移动端的“低门槛输入、自动整理、随时调用”体验。

核心原则：

1. **输入优先**：首页第一操作永远是输入，而不是先选择文件夹或功能。
2. **先记录，后整理**：用户可以杂乱输入，由 AI 在后台建议分类、标签、关联和日期。
3. **模块独立**：笔记、日历、AI、图片转 PDF、OCR、饮食记录等功能互不耦合。
4. **统一入口**：所有功能通过首页、全局搜索和命令面板聚合。
5. **数据归用户**：支持 Markdown/JSON/附件导入导出，避免平台锁定。
6. **渐进式多端**：先做好微信小程序 MVP，再复用代码扩展 H5 与 App。

---

## 2. 平台选择建议

### 2.1 推荐结论

采用 **多端架构、微信小程序优先发布**。

推荐技术路线：

- 前端：`Taro + React + TypeScript`，或团队偏 Vue 时使用 `uni-app + Vue 3 + TypeScript`。
- 第一阶段：微信小程序。
- 第二阶段：H5/PWA。
- 第三阶段：iOS/Android App。
- 后端：Node.js/NestJS 或云函数。
- 数据：本地缓存 + 云端主数据 + 对象存储。

### 2.2 为什么不建议只做原生微信小程序

只做原生微信小程序，上线快，但后续扩展 H5、App、桌面端时，需要重复开发；知识库、编辑器、文件管理和图谱又天然适合跨端。使用跨端框架可保留微信生态能力，同时减少长期重构成本。

### 2.3 跨端的现实边界

以下能力应通过适配器隔离：

- 登录：微信登录、手机号、邮箱。
- 文件选择与保存。
- 相机、相册、扫码。
- 支付与订阅。
- 消息通知。
- 分享。
- 本地数据库。

业务模块不得直接调用 `wx.*`，统一通过 `platformAdapter`。

---

## 3. 产品信息架构

```text
首页 Home
├── AI 输入框 / 全局搜索 / 快速记录
├── 今日摘要
├── 最近笔记
├── AI 待整理收件箱
├── 常用工具
└── 快捷入口

知识 Note
├── 收件箱 Inbox
├── 全部笔记
├── 收藏
├── 标签
├── 文件夹/空间
├── 知识图谱
├── 笔记详情
└── 编辑器

日历 Calendar
├── 月视图
├── 周视图
├── 日视图
├── 日记
├── 事件
└── 与笔记/饮食记录联动

AI Assistant
├── 全库问答
├── 当前笔记问答
├── 自动分类
├── 摘要与改写
├── 标签建议
├── 关联建议
├── OCR/识图
└── AI 任务历史

工具 Tools
├── 图片转 PDF
├── OCR 文字识别
├── 图片理解
├── 饮食记录
├── 扫描归档
└── 后续插件

设置 Settings
├── 账号与同步
├── AI 模型
├── 数据导入导出
├── 隐私与权限
├── 主题
└── 插件管理
```

---

## 4. 页面设计规范

### 4.1 全局导航

移动端推荐底部 5 个一级入口：

1. 首页
2. 知识
3. 中央“记录”按钮
4. 日历
5. 工具

AI 不一定单独占底部导航。AI 应作为全局能力存在于：

- 首页输入框。
- 编辑器工具栏。
- 笔记详情页悬浮按钮。
- 图谱页分析按钮。
- OCR/饮食等工具的结果处理阶段。

### 4.2 首页

首页不是普通宫格导航，而是“智能工作台”。

页面结构：

```text
状态栏
欢迎语 + 头像
AI 对话/搜索输入框
快捷动作：记录文字 / 拍照 / 语音 / 扫描
今日卡片：待办、事件、饮食、笔记统计
AI 收件箱：3 条待整理内容
最近笔记横向列表
常用工具 2×N 网格
底部导航
```

输入框支持自然语言：

- “记一下，下周三和李明沟通方案”
- “找出我关于向量数据库的所有笔记”
- “把今天拍的菜单识别成饮食记录”
- “把这 6 张图片合并为 PDF”

系统先做意图识别，再路由到对应模块；执行前对高风险或不可逆操作进行确认。

### 4.3 知识列表

主要筛选：收件箱、最近、全部、收藏、标签。

卡片字段：

- 标题。
- 摘要。
- 更新时间。
- 标签。
- 关联数量。
- AI 待整理状态。

列表应支持长按多选、批量加标签、移动、归档和导出。

### 4.4 笔记编辑器

移动端采用“所见即所得为主、Markdown 兼容为底层”的方案。

首期支持：

- 标题、正文。
- H1/H2/H3。
- 粗体、斜体、删除线。
- 列表、待办。
- 引用、代码块。
- 图片、附件。
- `[[双向链接]]`。
- `#标签`。
- 日期引用。
- AI 菜单：续写、总结、整理、提取任务、建议链接。

不建议第一版实现完整桌面级 Markdown 编辑器。重点是稳定输入和数据兼容。

### 4.5 知识图谱

移动端默认展示“局部图谱”，而不是全库几千节点。

视图模式：

- 当前笔记邻居。
- 标签图谱。
- 最近 30 天。
- 全局图谱。

交互：点击节点预览；再次点击进入笔记；双指缩放；按类型、标签、时间过滤。

### 4.6 日历

日历不是独立数据孤岛，所有带日期的对象都可聚合：

- 日记。
- 事件。
- 待办。
- 饮食记录。
- AI 从笔记提取的日期。

点击某天展示“时间线抽屉”，而不是跳转多个页面。

### 4.7 AI 页面

推荐三种会话模式：

- 全库问答。
- 当前笔记。
- 临时会话，不写入知识库。

回答必须展示来源笔记，允许：打开来源、复制、保存为笔记、生成关联。

### 4.8 工具中心

工具中心使用插件式卡片，每个工具独立路由、独立 service、独立权限声明。

工具卡片字段：

- 名称。
- 简介。
- 图标。
- 是否本地处理。
- 是否需要 AI。
- 最近使用时间。

---

## 5. 推荐目录结构

```text
apps/
├── client/                         # Taro/uni-app 跨端客户端
│   ├── src/
│   │   ├── app.config.ts
│   │   ├── app.tsx
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── note-list/
│   │   │   ├── note-editor/
│   │   │   ├── graph/
│   │   │   ├── calendar/
│   │   │   ├── ai-chat/
│   │   │   ├── tools/
│   │   │   └── settings/
│   │   ├── modules/
│   │   │   ├── note/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── note.service.ts
│   │   │   │   ├── note.repository.ts
│   │   │   │   ├── note.store.ts
│   │   │   │   ├── note.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── calendar/
│   │   │   ├── ai/
│   │   │   ├── graph/
│   │   │   ├── food/
│   │   │   └── pdf/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   ├── types/
│   │   │   └── theme/
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   ├── storage/
│   │   │   ├── database/
│   │   │   ├── telemetry/
│   │   │   └── platform/
│   │   └── store/
│   └── tests/
│
├── api/                            # 后端 API / 云函数
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── notes/
│   │   │   ├── calendar/
│   │   │   ├── files/
│   │   │   ├── ai/
│   │   │   ├── search/
│   │   │   └── sync/
│   │   ├── common/
│   │   └── main.ts
│   └── tests/
│
packages/
├── domain/                         # 跨端共享领域模型
├── api-client/                     # 自动生成/手写 API SDK
├── editor-core/                    # Markdown/双链解析
├── ai-contracts/                   # AI 请求、响应、工具协议
├── design-tokens/                  # 颜色、字体、间距
└── eslint-config/

docs/
├── ARCHITECTURE.md
├── API.md
├── DATA_MODEL.md
├── AI_DESIGN.md
└── UI_SPEC.md
```

若第一阶段团队很小，可保留单仓库简化结构，但仍应按 `modules` 划分，而不是把所有 service 平铺。

---

## 6. 模块边界

每个功能模块只暴露自己的公开接口：

```ts
export interface NoteModule {
  create(input: CreateNoteInput): Promise<Note>;
  update(id: string, patch: UpdateNoteInput): Promise<Note>;
  search(query: NoteSearchQuery): Promise<NoteSearchResult>;
  link(sourceId: string, targetId: string): Promise<void>;
}
```

禁止：

- 日历组件直接访问笔记数据库表。
- AI 页面直接写笔记状态。
- 工具页面直接调用云数据库 SDK。
- 页面层直接拼接 API URL。

正确方式：页面 → use case/service → repository → infrastructure。

---

## 7. 核心领域模型

### 7.1 Note

```ts
interface Note {
  id: string;
  userId: string;
  spaceId: string;
  title: string;
  content: string;
  contentFormat: 'markdown' | 'richtext';
  plainText: string;
  status: 'inbox' | 'active' | 'archived' | 'deleted';
  source: 'manual' | 'import' | 'ai' | 'ocr' | 'voice';
  tags: string[];
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

### 7.2 NoteLink

```ts
interface NoteLink {
  id: string;
  sourceNoteId: string;
  targetNoteId: string;
  type: 'manual' | 'wikilink' | 'ai-suggested';
  context?: string;
  confidence?: number;
}
```

### 7.3 CalendarItem

```ts
interface CalendarItem {
  id: string;
  type: 'event' | 'task' | 'journal' | 'food';
  title: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  noteId?: string;
  metadata: Record<string, unknown>;
}
```

### 7.4 Attachment

```ts
interface Attachment {
  id: string;
  noteId?: string;
  mimeType: string;
  fileName: string;
  size: number;
  localUri?: string;
  remoteUrl?: string;
  checksum: string;
  uploadStatus: 'local' | 'uploading' | 'synced' | 'failed';
}
```

### 7.5 AIJob

```ts
interface AIJob {
  id: string;
  type: 'chat' | 'classify' | 'summarize' | 'ocr' | 'vision' | 'embed';
  inputRef?: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  model: string;
  promptVersion: string;
  result?: unknown;
  tokenUsage?: number;
  createdAt: string;
}
```

---

## 8. 数据存储与同步

### 8.1 数据分层

- 本地 UI 状态：Zustand/Pinia。
- 本地持久化：SQLite 或跨端 KV；小程序首期可用本地缓存 + IndexedDB/H5 适配。
- 云端结构化数据：PostgreSQL、云数据库或 Supabase 类服务。
- 文件：对象存储。
- 搜索：首期数据库全文检索；后期增加 Elasticsearch/Meilisearch。
- 语义检索：向量数据库或 PostgreSQL pgvector。

### 8.2 Offline-first

写操作先落本地操作日志，再异步同步：

```text
用户编辑
→ 本地立即保存
→ 写入 SyncOperation
→ 网络可用时上传
→ 服务端校验版本
→ 成功后标记 synced
→ 冲突时生成副本或进入冲突解决页
```

### 8.3 冲突策略

- 标题、标签、属性：字段级合并。
- 正文：基于版本号和编辑时间，首期使用“保留双方副本”。
- 附件：按 checksum 去重。
- 删除：软删除 + 30 天回收站。

---

## 9. AI 架构

### 9.1 AI 不能成为业务数据库

AI 只负责理解、建议和生成；业务事实最终仍写入笔记、日历、饮食等领域模型。

### 9.2 AI 编排层

```text
AI Request
├── Intent Router：判断搜索、记录、问答或工具调用
├── Context Builder：获取当前页、用户选择和相关笔记
├── Retrieval：关键词 + 向量混合检索
├── Prompt Registry：版本化 Prompt
├── Model Gateway：屏蔽不同模型供应商
├── Tool Executor：调用笔记、日历、OCR、PDF 等受控工具
├── Safety Layer：权限、敏感信息、注入防护
└── Result Formatter：来源、置信度、可执行建议
```

### 9.3 RAG 流程

```text
笔记保存
→ 提取纯文本
→ 按标题/段落切块
→ 生成 embedding
→ 写入向量索引
→ 用户提问
→ 关键词 + 向量召回
→ 权限过滤
→ 重排序
→ 模型生成答案
→ 返回引用来源
```

### 9.4 自动归类策略

AI 输出建议，不应默认静默移动数据：

```json
{
  "suggestedTitle": "向量数据库选型记录",
  "suggestedTags": ["AI", "数据库"],
  "suggestedFolder": "技术研究",
  "relatedNoteIds": ["note_123"],
  "extractedTasks": [],
  "confidence": 0.88
}
```

高置信度可自动打“建议标签”，移动文件夹和删除操作必须由用户确认。

### 9.5 成本控制

- 先本地规则和关键词判断，再调用模型。
- 摘要、分类使用小模型。
- 复杂问答使用大模型。
- embedding 增量更新。
- 内容 hash 未变化时不重复处理。
- AI Job 可取消、重试和计量。

---

## 10. API 设计示例

```text
POST   /v1/notes
GET    /v1/notes
GET    /v1/notes/:id
PATCH  /v1/notes/:id
DELETE /v1/notes/:id
POST   /v1/notes/:id/links
GET    /v1/graph?noteId=&depth=

GET    /v1/calendar/items
POST   /v1/calendar/items
PATCH  /v1/calendar/items/:id

POST   /v1/ai/chat
POST   /v1/ai/classify
POST   /v1/ai/summarize
POST   /v1/ai/vision
POST   /v1/ai/ocr
GET    /v1/ai/jobs/:id

POST   /v1/files/presign
POST   /v1/sync/push
GET    /v1/sync/pull?cursor=
```

所有写接口支持：

- `Idempotency-Key`。
- 客户端版本号。
- 请求追踪 ID。
- 乐观锁版本字段。

---

## 11. 工具插件规范

新增工具只需实现统一声明：

```ts
interface ToolManifest {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  permissions: Array<'camera' | 'album' | 'microphone' | 'storage'>;
  capabilities: Array<'local' | 'cloud' | 'ai'>;
  enabledByDefault: boolean;
}
```

示例：图片转 PDF 不依赖笔记模块；完成后通过公共动作“保存到知识库”关联到笔记。

```ts
interface ToolResultAction {
  type: 'save-as-note' | 'attach-to-note' | 'share' | 'download';
  payload: unknown;
}
```

---

## 12. 设计系统

### 12.1 视觉方向

关键词：安静、知识感、可信、轻量、非工具箱堆砌。

建议色彩：

- 主色：`#6C5CE7` 紫色，用于 AI 与主动作。
- 背景：`#F7F7FA`。
- 卡片：`#FFFFFF`。
- 主文字：`#17171C`。
- 次文字：`#74747E`。
- 成功：`#24A148`。
- 警告：`#F59E0B`。

### 12.2 间距

使用 4pt 基准：4、8、12、16、20、24、32、40。

移动端页面左右边距 16；卡片圆角 16；按钮高度 44–48；最小点击区域 44×44。

### 12.3 字体

中文使用系统字体；标题 22/28、18/24；正文 15/22；辅助文字 12/18。

---

## 13. 安全与隐私

- API Key 只保存在服务端，绝不下发到客户端。
- 上传文件使用短时签名 URL。
- 敏感内容加密传输；必要字段加密存储。
- 数据按 userId/spaceId 强隔离。
- AI 调用前做权限过滤，禁止检索其他用户内容。
- Prompt 中明确区分“系统指令”和“用户笔记内容”，防止提示注入。
- 提供 AI 数据使用开关、内容删除和账号注销。
- 图片、麦克风、相册权限按需申请，进入功能前解释用途。

---

## 14. 监控与测试

关键指标：

- 首次记录完成率。
- 首页输入到成功保存耗时。
- AI 分类采纳率。
- 搜索无结果率。
- 同步失败率。
- 编辑器崩溃率。
- AI 请求成功率、延迟、成本。

测试分层：

- 领域逻辑单元测试。
- Repository 集成测试。
- API 合约测试。
- 编辑器和同步端到端测试。
- AI 输出结构校验与回归数据集。

---

## 15. MVP 范围

### 第一阶段：8–12 周建议范围

必须完成：

- 微信登录。
- 首页快速记录和搜索。
- 笔记列表、编辑、删除、收藏、标签。
- Markdown 基础格式和双链。
- 局部知识图谱。
- 月历与日记。
- AI 总结、标签建议、全库问答。
- OCR。
- 图片转 PDF。
- 数据导出。
- 云同步基础版。

暂缓：

- 多人协作。
- 完整插件市场。
- 桌面端完整编辑器。
- 复杂 CRDT 实时协同。
- 全自动文件夹移动。
- 高级图谱动画。

### 第二阶段

- H5/PWA。
- 饮食记录和统计。
- 语音输入。
- Obsidian Vault 批量导入。
- AI 工作流模板。
- 全局离线搜索。

### 第三阶段

- 原生 App。
- 桌面端。
- 插件 SDK。
- 多空间、家庭共享与协作。

---

## 16. 开发任务拆分

```text
Epic 1：基础工程
- 跨端脚手架
- 路由、主题、状态管理
- API Client
- 登录和权限

Epic 2：笔记
- 领域模型
- 列表和详情
- 编辑器
- 标签、收藏、双链
- 导入导出

Epic 3：搜索与图谱
- 全文搜索
- 链接索引
- 局部图谱
- 过滤器

Epic 4：日历
- CalendarItem 模型
- 月视图
- 日记和事件
- 笔记日期关联

Epic 5：AI
- 模型网关
- AI Job
- 总结和分类
- RAG 问答
- 来源引用

Epic 6：工具
- 工具 manifest
- 图片转 PDF
- OCR
- 保存到知识库

Epic 7：同步与质量
- 操作日志
- 增量同步
- 冲突副本
- 监控和测试
```

---

## 17. 验收标准示例

首页快速记录：

- 用户打开首页后 1 次点击即可输入。
- 纯文本在弱网下也可立即保存本地。
- AI 整理失败不影响原始记录保存。
- 保存后可在收件箱看到记录。
- AI 建议可逐项接受或忽略。

全库问答：

- 回答只能引用当前用户有权限的笔记。
- 每个关键结论显示来源。
- 无可靠来源时明确提示“不确定”。
- 用户可以一键保存回答为新笔记。

---

## 18. 首选落地组合

对于 1–5 人的小团队：

```text
客户端：Taro + React + TypeScript
状态：Zustand + TanStack Query
表单：React Hook Form + Zod
后端：NestJS 或微信云函数
数据库：PostgreSQL
对象存储：云存储/S3 兼容服务
搜索：PostgreSQL FTS
向量：pgvector
AI：统一 Model Gateway
部署：Docker + CI/CD
监控：Sentry + 结构化日志
```

若目标只是尽快验证，可采用微信云开发；但领域模型、repository 和模型网关仍应保留，以便未来迁移。

---

## 19. 最终架构决策

1. **产品形态**：多端设计，微信小程序优先。
2. **前端结构**：按领域模块组织，不按页面类型简单堆文件。
3. **AI 位置**：AI 是平台能力，不是孤立聊天页面。
4. **工具机制**：每个工具独立，通过 manifest 注册，通过公共动作连接知识库。
5. **数据策略**：本地优先、云端同步、可导出。
6. **知识图谱**：双链为真实关系，AI 关系作为可确认建议。
7. **首期重点**：记录体验、稳定编辑、可解释 AI、可靠同步。
