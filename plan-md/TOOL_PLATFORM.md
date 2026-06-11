# 工具平台与插件扩展规范

> 目标：让图片转 PDF、OCR、饮食、记账、习惯、番茄钟、清单、扫描、单位换算等功能可以独立开发、独立测试、独立发布、独立关闭；完成一个模块后冻结其边界，再开发下一个模块。

## 1. 核心原则

### 1.1 平台内核稳定，工具插件可变

整个产品分成两部分：

- **平台内核 Core**：账号、权限、路由、主题、文件、同步、AI 网关、事件总线、统一搜索、导入导出。
- **工具插件 Tool Module**：记账、PDF、OCR、饮食、习惯等具体功能。

工具插件只能通过平台公开的 SDK 使用平台能力，不得访问平台内部数据库、Store、页面组件或云 SDK。

### 1.2 一个模块一个边界

每个工具模块必须拥有自己的：

- 领域模型。
- 数据表或存储命名空间。
- 页面与组件。
- Service / Use Case。
- Repository。
- API。
- 权限声明。
- 数据迁移。
- 测试。
- 埋点。
- 文档。

### 1.3 完成后冻结

模块达到验收标准后进入 `frozen` 状态：

- 不再允许其他模块引用其内部文件。
- 对外接口进入语义化版本管理。
- 新需求优先通过新增 API、事件或适配器实现。
- 破坏性修改必须走 ADR 和主版本升级。

---

## 2. 总体分层

```text
┌───────────────────────────────────────────────┐
│                Shell / App Host               │
│ 路由、导航、登录、主题、错误边界、功能开关       │
├───────────────────────────────────────────────┤
│                  Platform SDK                 │
│ Storage / Files / AI / Events / Search / Sync │
├───────────────────────────────────────────────┤
│                   Tool Modules                │
│ PDF │ OCR │ Food │ Ledger │ Habit │ Scanner   │
├───────────────────────────────────────────────┤
│                Infrastructure                 │
│ API Client / DB / Cloud / Platform Adapters   │
└───────────────────────────────────────────────┘
```

依赖方向只能从上层业务指向抽象接口，再由基础设施实现：

```text
Page → UseCase → Domain → Repository Interface
                         ↑
                  Repository Adapter
```

禁止反向依赖和跨模块内部依赖。

---

## 3. 推荐目录

```text
apps/client/src/
├── app-shell/
│   ├── navigation/
│   ├── command-palette/
│   ├── error-boundary/
│   ├── feature-flags/
│   └── tool-registry/
├── platform-sdk/
│   ├── auth/
│   ├── ai/
│   ├── analytics/
│   ├── events/
│   ├── files/
│   ├── search/
│   ├── storage/
│   ├── sync/
│   └── ui/
├── modules/
│   ├── note/
│   ├── calendar/
│   ├── ledger/
│   ├── pdf/
│   ├── ocr/
│   ├── food/
│   └── habit/
└── infrastructure/
    ├── api/
    ├── database/
    ├── cloud/
    └── platform/
```

单个工具模块统一结构：

```text
modules/ledger/
├── manifest.ts                 # 工具注册信息
├── public.ts                   # 唯一允许外部引用的公开入口
├── routes.ts                   # 模块路由声明
├── domain/
│   ├── entities.ts
│   ├── value-objects.ts
│   ├── rules.ts
│   ├── events.ts
│   └── errors.ts
├── application/
│   ├── use-cases/
│   ├── dto/
│   ├── ports.ts
│   └── policies.ts
├── infrastructure/
│   ├── ledger.repository.ts
│   ├── ledger.api.ts
│   ├── ledger.storage.ts
│   └── migrations/
├── presentation/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── store/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   └── e2e/
├── README.md
├── CHANGELOG.md
└── module.config.ts
```

`public.ts` 是模块唯一出口。其他模块不得使用类似：

```ts
import { ledgerDb } from '@/modules/ledger/infrastructure/ledger.storage';
```

只能使用：

```ts
import { ledgerPublicApi } from '@/modules/ledger/public';
```

---

## 4. ToolManifest 2.0

```ts
export type ToolPermission =
  | 'camera'
  | 'album'
  | 'microphone'
  | 'location'
  | 'calendar-read'
  | 'calendar-write'
  | 'file-read'
  | 'file-write'
  | 'notification'
  | 'cloud-sync'
  | 'ai-text'
  | 'ai-vision';

export type ToolCapability =
  | 'local-first'
  | 'cloud-sync'
  | 'offline'
  | 'ai-assisted'
  | 'exportable'
  | 'searchable'
  | 'calendar-linked'
  | 'knowledge-linked';

export interface ToolManifest {
  id: string;                       // ledger
  version: string;                  // 1.0.0
  apiVersion: string;               // platform SDK contract
  name: string;
  shortName: string;
  description: string;
  icon: string;
  category: 'knowledge' | 'life' | 'document' | 'finance' | 'health' | 'productivity';
  entryRoute: string;
  routes: ToolRoute[];
  permissions: ToolPermission[];
  capabilities: ToolCapability[];
  defaultEnabled: boolean;
  searchableEntities: string[];
  exportFormats: string[];
  featureFlags: string[];
  navigation: {
    showOnHome: boolean;
    showInToolCenter: boolean;
    recommendedOrder?: number;
  };
  lifecycle: {
    status: 'draft' | 'beta' | 'stable' | 'frozen' | 'deprecated';
    owner: string;
  };
}
```

示例：

```ts
export const ledgerManifest: ToolManifest = {
  id: 'ledger',
  version: '1.0.0',
  apiVersion: '1.x',
  name: '记账与流水',
  shortName: '记账',
  description: '记录收入、支出、转账并生成月度流水和统计。',
  icon: 'wallet',
  category: 'finance',
  entryRoute: '/tools/ledger',
  routes: [
    { path: '/tools/ledger', page: 'LedgerHomePage' },
    { path: '/tools/ledger/transaction/new', page: 'TransactionEditorPage' },
    { path: '/tools/ledger/month/:month', page: 'MonthlyFlowPage' },
    { path: '/tools/ledger/accounts', page: 'AccountListPage' },
    { path: '/tools/ledger/settings', page: 'LedgerSettingsPage' }
  ],
  permissions: ['cloud-sync', 'file-write', 'ai-text'],
  capabilities: ['local-first', 'offline', 'cloud-sync', 'exportable', 'searchable', 'calendar-linked'],
  defaultEnabled: true,
  searchableEntities: ['transaction', 'account', 'category'],
  exportFormats: ['csv', 'xlsx', 'json'],
  featureFlags: ['ledger.aiCategorization', 'ledger.budget'],
  navigation: { showOnHome: true, showInToolCenter: true, recommendedOrder: 20 },
  lifecycle: { status: 'draft', owner: 'finance-domain' }
};
```

---

## 5. 平台 SDK 契约

模块只能依赖以下平台接口。

```ts
export interface PlatformContext {
  auth: AuthPort;
  storage: StoragePort;
  files: FilePort;
  ai: AIPort;
  events: EventBusPort;
  search: SearchIndexPort;
  sync: SyncPort;
  analytics: AnalyticsPort;
  navigation: NavigationPort;
  permissions: PermissionPort;
  clock: ClockPort;
  idGenerator: IdGeneratorPort;
}
```

### 5.1 StoragePort

```ts
interface StoragePort {
  get<T>(namespace: string, key: string): Promise<T | null>;
  set<T>(namespace: string, key: string, value: T): Promise<void>;
  remove(namespace: string, key: string): Promise<void>;
  transaction<T>(work: () => Promise<T>): Promise<T>;
}
```

每个模块只能使用自己的 namespace：

```text
module.ledger.*
module.pdf.*
module.food.*
```

### 5.2 EventBusPort

事件用于松耦合联动，不用于绕过模块 API。

```ts
interface DomainEvent<T = unknown> {
  id: string;
  name: string;
  version: number;
  occurredAt: string;
  producer: string;
  payload: T;
}
```

命名规范：

```text
ledger.transaction.created.v1
ledger.transaction.updated.v1
ledger.month.closed.v1
calendar.item.created.v1
note.created.v1
food.record.created.v1
```

### 5.3 SearchIndexPort

工具可以将摘要数据注册到全局搜索，但不能把内部数据库暴露给搜索模块。

```ts
interface SearchDocument {
  id: string;
  moduleId: string;
  entityType: string;
  title: string;
  content: string;
  keywords: string[];
  route: string;
  updatedAt: string;
  accessScope: string;
}
```

### 5.4 AIPort

```ts
interface AIPort {
  execute<TInput, TOutput>(request: {
    capability: 'classify' | 'extract' | 'summarize' | 'vision' | 'chat';
    schemaId: string;
    input: TInput;
    privacyLevel: 'local-only' | 'masked' | 'cloud-allowed';
  }): Promise<TOutput>;
}
```

记账模块只提交必要字段，不应发送账号余额、身份证号、完整备注等无关敏感信息。

---

## 6. 跨模块协作方式

允许三种方式：

### 6.1 公共 API

适合需要立即结果的同步业务动作。

```ts
ledgerPublicApi.getMonthlySummary({ month: '2026-06' });
```

### 6.2 领域事件

适合通知其他模块“某件事已经发生”。

```ts
events.publish({
  name: 'ledger.transaction.created.v1',
  payload: { transactionId, occurredOn, amountMinor, categoryId }
});
```

### 6.3 公共动作 Action

适合用户在工具完成页主动选择下一步。

```ts
interface ToolAction {
  type:
    | 'save-as-note'
    | 'attach-to-note'
    | 'add-to-calendar'
    | 'share-file'
    | 'export-file'
    | 'open-tool';
  payload: unknown;
}
```

禁止：

- 直接读取其他模块 Store。
- 直接 join 其他模块数据表。
- import 其他模块内部组件。
- 直接修改其他模块实体。
- 通过全局变量共享业务数据。

---

## 7. 工具注册中心

```ts
interface ToolRegistry {
  register(manifest: ToolManifest, factory: ToolFactory): void;
  unregister(toolId: string): void;
  get(toolId: string): RegisteredTool | undefined;
  list(filter?: ToolFilter): RegisteredTool[];
  enable(toolId: string): Promise<void>;
  disable(toolId: string): Promise<void>;
}
```

启动过程：

```text
App 启动
→ 读取内置 manifests
→ 校验 apiVersion
→ 校验路由冲突
→ 校验权限声明
→ 按 feature flag 注册
→ 生成工具中心列表
→ 注册搜索提供者
→ 注册事件订阅者
```

注册失败只能影响单个工具，不能导致整个 App 白屏。

---

## 8. 数据隔离与迁移

### 8.1 每模块独立 schema

服务端推荐：

```text
core_*              平台表
note_*              笔记模块
calendar_*          日历模块
ledger_*            记账模块
food_*              饮食模块
pdf_*               PDF 任务模块
```

客户端推荐逻辑隔离：

```text
ledger.accounts
ledger.transactions
ledger.categories
ledger.budgets
ledger.settings
```

### 8.2 迁移规则

每个模块自带迁移：

```text
migrations/
├── 001_initial.ts
├── 002_add_transfer_pair.ts
└── 003_add_transaction_tags.ts
```

要求：

- 迁移必须可重复检测。
- 迁移失败回滚到上一个可用版本。
- 大迁移使用后台任务和进度展示。
- 模块禁用不删除数据。
- 模块卸载前必须提供导出和明确确认。

---

## 9. 权限与隐私

权限按工具首次使用时申请，不在 App 启动时一次性申请。

每个模块必须声明：

- 为什么需要权限。
- 数据在哪里处理。
- 是否上传云端。
- 是否交给 AI。
- 是否可以关闭同步。
- 导出与删除方式。

对记账、健康等敏感模块增加：

- 独立应用锁。
- 截屏模糊开关。
- 通知隐藏金额。
- AI 使用默认关闭或字段脱敏。
- 导出文件密码保护选项。

---

## 10. 功能开关与发布

每个工具至少有以下开关：

```text
tool.ledger.enabled
ledger.aiCategorization.enabled
ledger.budget.enabled
ledger.cloudSync.enabled
ledger.import.enabled
```

发布阶段：

```text
local → internal → alpha → beta → stable → frozen
```

发生重大问题时可只关闭单个工具，不影响笔记、日历和其他工具。

---

## 11. 模块开发顺序与冻结机制

### Gate 0：立项

输出：

- 目标用户问题。
- MVP 用例。
- 明确不做什么。
- 权限与敏感数据评估。
- 是否需要 AI、云同步、文件、日历。

通过条件：范围能在一个独立迭代内完成。

### Gate 1：边界设计

输出：

- 领域模型。
- 对外 API。
- 领域事件。
- 数据表。
- 路由。
- Manifest。
- 依赖清单。

通过条件：其他模块不需要知道其内部实现。

### Gate 2：契约测试

先写测试，再写页面：

- Public API contract test。
- Repository contract test。
- Event schema test。
- Migration test。
- Permission test。

通过条件：Mock 实现和真实实现都通过同一套测试。

### Gate 3：功能开发

推荐顺序：

```text
Domain rules
→ Repository
→ Use cases
→ API
→ Store/hooks
→ Pages/components
→ Analytics
→ Error handling
```

### Gate 4：质量验收

要求：

- 单元测试通过。
- 合约测试通过。
- 核心 E2E 通过。
- 弱网和离线通过。
- 数据导出可恢复。
- 权限拒绝有降级路径。
- 崩溃不影响 App Shell。
- 关键埋点可见。

### Gate 5：冻结边界

完成：

- `public.ts` 标记 1.0.0。
- Manifest 状态改为 `frozen`。
- 创建 ADR。
- 生成 API 快照。
- 生成数据库 schema 快照。
- CODEOWNERS 限制内部目录。
- 禁止其他模块引用内部路径。

冻结后开发下一个工具。

### Gate 6：变更管理

冻结模块变更分类：

| 变更 | 版本 | 处理方式 |
|---|---:|---|
| 修复内部 Bug | patch | 不改变公共契约 |
| 新增可选字段/API | minor | 保持向后兼容 |
| 删除或改变字段语义 | major | ADR、迁移、兼容层 |

---

## 12. 自动边界检查

建议在 CI 中加入：

```text
1. ESLint import boundary rule
2. dependency-cruiser / madge 循环依赖检查
3. public API snapshot
4. OpenAPI diff
5. database schema diff
6. event schema compatibility check
7. forbidden direct wx.* calls
8. bundle size budget per module
```

边界规则示例：

```js
{
  from: { path: '^src/modules/([^/]+)/' },
  to: {
    path: '^src/modules/([^/]+)/',
    pathNot: '/public$'
  },
  forbidden: true
}
```

---

## 13. 模块完成定义 Definition of Done

一个工具只有满足全部条件才能视为完成：

- [ ] Manifest 完整。
- [ ] 业务范围和非目标明确。
- [ ] Domain 无 UI 和平台依赖。
- [ ] 只有 `public.ts` 可供外部引用。
- [ ] 数据有版本和迁移。
- [ ] 离线可用或有明确说明。
- [ ] 导入导出可测试。
- [ ] 所有权限可拒绝。
- [ ] AI 失败不影响核心功能。
- [ ] 错误被模块级 Error Boundary 捕获。
- [ ] 有使用日志和错误监控。
- [ ] API、事件和 Schema 有快照。
- [ ] 文档和 CHANGELOG 完成。
- [ ] 冻结评审通过。

---

## 14. 可预留工具清单

### 文档类

- 图片转 PDF。
- PDF 合并/拆分。
- OCR。
- 扫描归档。
- 图片压缩。
- 格式转换。
- 证件扫描。

### 知识类

- 网页收藏。
- 稍后阅读。
- 闪卡。
- 阅读摘录。
- 思维导图。
- 会议记录。
- 语音转文字。

### 生活类

- 饮食记录。
- 饮水。
- 睡眠。
- 体重。
- 习惯打卡。
- 心情记录。
- 旅行清单。

### 财务类

- 记账与月度流水。
- 预算。
- 订阅提醒。
- 报销扫描。
- 账单导入。
- 资产账户。

### 效率类

- 番茄钟。
- 倒数日。
- 清单模板。
- 随机决策。
- 单位换算。
- 文本处理。

这些工具全部复用同一个 Manifest、Platform SDK、冻结流程和模块模板。
