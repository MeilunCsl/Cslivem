# 记账与月度流水模块详细设计

> 模块 ID：`ledger`  
> 目标：快速记录收入、支出和转账，查看每个月的流水、分类统计、账户变化与预算执行情况。

## 1. 模块边界

### 1.1 模块负责

- 账户管理。
- 收入、支出、转账记录。
- 月度流水。
- 分类与标签。
- 月度收支统计。
- 预算。
- 周期性账单。
- 账单导入导出。
- 账目搜索。
- AI 分类建议。

### 1.2 模块不负责

第一版明确不做：

- 银行卡自动直连。
- 投资交易和实时行情。
- 税务申报。
- 多人复式会计。
- 企业财务审批。
- 借贷撮合。
- 自动读取短信且无确认入账。

后续功能必须单独评审，不能因为“记账”而无限扩张范围。

### 1.3 与其他模块的关系

- 可向日历发布“周期账单到期”事件。
- 可把月度总结保存为笔记。
- 可被全局搜索索引。
- 可通过 AI 获得分类建议。
- 不直接读取日历表、笔记表、AI Job 表。

---

## 2. 用户场景

### 2.1 快速记一笔

```text
打开首页
→ 点击“＋”
→ 选择记账
→ 输入 36.5
→ 选择支出 / 餐饮 / 微信
→ 保存
→ 月度流水立即更新
```

目标：熟练用户 3–5 秒完成。

### 2.2 自然语言记账

```text
“今天午饭微信付了 36.5”
→ AI 提取金额 36.50
→ 类型：支出
→ 分类：餐饮
→ 账户：微信
→ 日期：今天
→ 用户确认
→ 入账
```

AI 只能生成草稿，默认需要确认。高频规则可由用户开启自动确认。

### 2.3 查看每月流水

```text
进入记账首页
→ 顶部切换 2026 年 6 月
→ 查看收入、支出、结余
→ 查看分类占比
→ 按日期浏览流水
→ 筛选账户/分类/标签
```

### 2.4 转账

```text
从“银行卡”转 500 到“微信”
→ 创建同一个 transferGroupId 下的两条账户变动
→ 不计入总收入和总支出
→ 两个账户余额同步变化
```

### 2.5 月末总结

```text
月末
→ 生成 6 月统计
→ 比较预算和上月
→ 展示异常增长分类
→ 用户可保存为笔记
```

---

## 3. 页面结构

```text
记账 Ledger
├── 记账首页
│   ├── 月份切换
│   ├── 本月收入 / 支出 / 结余
│   ├── 预算进度
│   ├── 分类概览
│   ├── 最近流水
│   └── 快速记账按钮
├── 新建/编辑流水
│   ├── 收入 / 支出 / 转账
│   ├── 金额
│   ├── 分类
│   ├── 账户
│   ├── 日期时间
│   ├── 商户/对象
│   ├── 标签
│   ├── 备注
│   └── 附件/票据
├── 月度流水
│   ├── 日分组列表
│   ├── 筛选
│   ├── 搜索
│   └── 导出
├── 统计
│   ├── 分类排行
│   ├── 日趋势
│   ├── 同比/环比
│   └── 账户变化
├── 预算
│   ├── 总预算
│   ├── 分类预算
│   └── 超支提醒
├── 账户
│   ├── 现金
│   ├── 微信
│   ├── 支付宝
│   ├── 银行卡
│   └── 自定义账户
└── 记账设置
    ├── 默认账户
    ├── 默认币种
    ├── 分类管理
    ├── 周期账单
    ├── 导入导出
    ├── 隐私锁
    └── AI 分类开关
```

---

## 4. 记账首页设计

### 4.1 顶部

```text
‹  2026 年 6 月  ›
本月结余  ¥ 5,280.50
收入 ¥12,800.00    支出 ¥7,519.50
```

金额默认允许隐私模式显示为 `••••`。

### 4.2 月度预算卡

```text
本月预算  ¥8,000
已使用    ¥7,519.50
剩余      ¥480.50
进度      94%
```

达到 80%、100% 时通过事件请求通知模块发送提醒。

### 4.3 分类概览

展示前五类：

- 餐饮。
- 住房。
- 交通。
- 购物。
- 娱乐。

点击进入筛选后的月度流水。

### 4.4 流水列表

按日期分组：

```text
6 月 11 日  周四             -¥126.50
午餐 · 餐饮 · 微信            -¥36.50
地铁 · 交通 · 支付宝           -¥6.00
日用品 · 购物 · 银行卡         -¥84.00

6 月 10 日  周三           +¥12,000.00
工资 · 工资收入 · 银行卡    +¥12,000.00
```

---

## 5. 核心领域模型

金额一律使用最小货币单位整数，禁止使用浮点数保存金额。

```ts
export type Money = {
  amountMinor: number;       // 3650 表示 ¥36.50
  currency: 'CNY' | 'USD' | 'SGD' | string;
};
```

### 5.1 Account

```ts
export interface LedgerAccount {
  id: string;
  userId: string;
  name: string;
  type: 'cash' | 'bank' | 'wechat' | 'alipay' | 'credit' | 'virtual' | 'other';
  currency: string;
  initialBalanceMinor: number;
  currentBalanceMinor: number;
  includeInNetWorth: boolean;
  icon?: string;
  colorToken?: string;
  status: 'active' | 'archived';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

### 5.2 Transaction

```ts
export interface LedgerTransaction {
  id: string;
  userId: string;
  type: 'expense' | 'income' | 'transfer';
  amountMinor: number;
  currency: string;
  accountId: string;
  targetAccountId?: string;
  transferGroupId?: string;
  categoryId: string;
  merchant?: string;
  occurredAt: string;
  timezone: string;
  note?: string;
  tags: string[];
  attachmentIds: string[];
  source: 'manual' | 'ai' | 'import' | 'recurring';
  status: 'confirmed' | 'draft' | 'voided';
  aiSuggestion?: {
    categoryId?: string;
    confidence: number;
    modelVersion: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

### 5.3 Category

```ts
export interface LedgerCategory {
  id: string;
  userId: string;
  name: string;
  type: 'expense' | 'income';
  parentId?: string;
  icon?: string;
  sortOrder: number;
  status: 'active' | 'archived';
}
```

### 5.4 Budget

```ts
export interface LedgerBudget {
  id: string;
  userId: string;
  month: string;                  // YYYY-MM
  categoryId?: string;            // 空表示总预算
  amountMinor: number;
  currency: string;
  alertThresholds: number[];      // [0.8, 1]
  rollover: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 5.5 RecurringRule

```ts
export interface RecurringRule {
  id: string;
  userId: string;
  template: Omit<LedgerTransaction, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
  recurrence: string;             // RRULE
  nextRunAt: string;
  autoConfirm: boolean;
  enabled: boolean;
}
```

### 5.6 MonthlySnapshot

月度统计可以实时计算；数据量增大后使用快照缓存。

```ts
export interface MonthlyLedgerSnapshot {
  userId: string;
  month: string;
  currency: string;
  incomeMinor: number;
  expenseMinor: number;
  netMinor: number;
  transferMinor: number;
  transactionCount: number;
  categoryTotals: Array<{
    categoryId: string;
    amountMinor: number;
    count: number;
  }>;
  generatedAt: string;
  sourceVersion: number;
}
```

---

## 6. 关键业务规则

### 6.1 金额规则

- 金额必须大于 0。
- 金额保存为整数最小单位。
- 展示时才格式化小数和千位分隔。
- 不同币种不能直接相加。
- 多币种首期按币种分开统计。

### 6.2 转账规则

- 转出账户和转入账户不能相同。
- 转账不计入收入/支出统计。
- 创建、更新、删除必须在事务中同时处理两侧。
- 两侧共享 `transferGroupId`。

### 6.3 删除规则

- 流水默认软删除或作废。
- 作废必须反向修正账户余额。
- 转账任何一侧作废时两侧一起作废。
- 已导出/已月结记录仍可修正，但要保留审计信息。

### 6.4 月份规则

- 月份以流水发生地时区计算。
- 查询范围使用半开区间 `[monthStart, nextMonthStart)`。
- 用户修改时区不自动改变历史月份归属。

### 6.5 余额规则

```text
账户余额 = 初始余额
         + 收入
         - 支出
         + 转入
         - 转出
         + 调整
```

建议流水表为事实来源，账户余额为可重建缓存。

---

## 7. 应用用例

```ts
export interface LedgerUseCases {
  createTransaction(input: CreateTransactionInput): Promise<LedgerTransaction>;
  updateTransaction(id: string, patch: UpdateTransactionInput): Promise<LedgerTransaction>;
  voidTransaction(id: string, reason?: string): Promise<void>;
  getTransaction(id: string): Promise<LedgerTransaction>;
  listMonthlyTransactions(query: MonthlyTransactionQuery): Promise<MonthlyTransactionPage>;
  getMonthlySummary(query: MonthlySummaryQuery): Promise<MonthlySummary>;
  createAccount(input: CreateAccountInput): Promise<LedgerAccount>;
  transfer(input: CreateTransferInput): Promise<TransferResult>;
  setBudget(input: SetBudgetInput): Promise<LedgerBudget>;
  exportMonth(input: ExportMonthInput): Promise<ExportedFile>;
}
```

### 7.1 CreateTransactionInput

```ts
export interface CreateTransactionInput {
  type: 'expense' | 'income';
  amountMinor: number;
  currency: string;
  accountId: string;
  categoryId: string;
  occurredAt: string;
  merchant?: string;
  note?: string;
  tags?: string[];
  attachmentIds?: string[];
  idempotencyKey: string;
}
```

### 7.2 MonthlyTransactionQuery

```ts
export interface MonthlyTransactionQuery {
  month: string;
  timezone: string;
  accountIds?: string[];
  categoryIds?: string[];
  types?: Array<'expense' | 'income' | 'transfer'>;
  tags?: string[];
  keyword?: string;
  cursor?: string;
  limit?: number;
}
```

---

## 8. 对外公共接口

其他模块只能使用以下稳定接口：

```ts
export interface LedgerPublicApiV1 {
  createDraftFromText(input: {
    text: string;
    occurredAt?: string;
  }): Promise<LedgerTransactionDraft>;

  getMonthlySummary(input: {
    month: string;
    currency?: string;
  }): Promise<{
    incomeMinor: number;
    expenseMinor: number;
    netMinor: number;
  }>;

  openTransaction(transactionId: string): Promise<void>;
  openMonth(month: string): Promise<void>;
}
```

明确不对外暴露：

- 账户真实余额明细。
- Repository。
- 内部 Store。
- 数据表结构。
- 预算计算器内部实现。

---

## 9. 领域事件

```ts
export type LedgerEvents =
  | {
      name: 'ledger.transaction.created.v1';
      payload: {
        transactionId: string;
        type: 'expense' | 'income' | 'transfer';
        amountMinor: number;
        currency: string;
        occurredAt: string;
        categoryId: string;
      };
    }
  | {
      name: 'ledger.transaction.updated.v1';
      payload: { transactionId: string; changedFields: string[] };
    }
  | {
      name: 'ledger.transaction.voided.v1';
      payload: { transactionId: string; occurredAt: string };
    }
  | {
      name: 'ledger.budget.thresholdReached.v1';
      payload: { month: string; categoryId?: string; threshold: number };
    }
  | {
      name: 'ledger.month.closed.v1';
      payload: { month: string; snapshotId: string };
    };
```

事件载荷保持最小化，避免泄露完整备注、商户和账户信息。

---

## 10. API 设计

```text
GET    /v1/ledger/accounts
POST   /v1/ledger/accounts
PATCH  /v1/ledger/accounts/:id

GET    /v1/ledger/categories
POST   /v1/ledger/categories
PATCH  /v1/ledger/categories/:id

GET    /v1/ledger/transactions?month=2026-06
POST   /v1/ledger/transactions
GET    /v1/ledger/transactions/:id
PATCH  /v1/ledger/transactions/:id
POST   /v1/ledger/transactions/:id/void
POST   /v1/ledger/transfers

GET    /v1/ledger/months/:month/summary
GET    /v1/ledger/months/:month/category-breakdown
POST   /v1/ledger/months/:month/export

GET    /v1/ledger/budgets?month=2026-06
PUT    /v1/ledger/budgets/:id

GET    /v1/ledger/recurring-rules
POST   /v1/ledger/recurring-rules
PATCH  /v1/ledger/recurring-rules/:id
```

所有写操作要求：

- `Idempotency-Key`。
- `If-Match` 或 version 乐观锁。
- requestId。
- 审计时间。

---

## 11. AI 分类设计

### 11.1 输入

```json
{
  "text": "今天午饭微信付了36.5",
  "dateContext": "2026-06-11",
  "availableAccounts": ["微信", "支付宝", "银行卡"],
  "availableCategories": ["餐饮", "交通", "购物"]
}
```

### 11.2 输出

```json
{
  "type": "expense",
  "amountMinor": 3650,
  "currency": "CNY",
  "accountName": "微信",
  "categoryName": "餐饮",
  "merchant": null,
  "occurredAt": "2026-06-11T12:00:00+08:00",
  "confidence": 0.93,
  "needsConfirmation": true
}
```

### 11.3 规则

- 金额和币种必须通过 schema 校验。
- AI 不直接写库。
- 所有结果先生成 Draft。
- 用户可以逐字段修改。
- 低于置信度阈值不预选分类。
- 用户历史映射优先于大模型。
- 敏感备注发送前脱敏。

---

## 12. 搜索与知识联动

注册到全局搜索的内容：

- 月份摘要，例如“2026 年 6 月支出”。
- 商户名。
- 分类名。
- 标签。
- 用户备注。

默认不把完整流水金额直接显示在锁屏搜索结果中。

保存月报为笔记时只生成快照：

```markdown
# 2026 年 6 月财务总结

- 收入：¥12,800.00
- 支出：¥7,519.50
- 结余：¥5,280.50
- 最大支出分类：住房 ¥3,200.00
- 相比上月：支出下降 8.2%

来源：记账模块月度快照 ledger_snapshot_xxx
```

笔记只保存摘要和来源引用，不复制所有流水。

---

## 13. 导入与导出

### 13.1 导出

支持：

- CSV。
- XLSX。
- JSON 完整备份。
- 月度 PDF 报表（后续）。

字段：

```text
日期,类型,金额,币种,分类,账户,商户,标签,备注
```

### 13.2 导入

首期采用映射向导：

```text
选择文件
→ 识别列
→ 映射日期/金额/分类/账户
→ 预览 20 条
→ 检测重复
→ 批量导入
→ 生成导入报告
```

重复检测可使用：

```text
日期 + 金额 + 账户 + 商户 + 导入批次
```

导入必须支持撤销整个批次。

---

## 14. 本地优先与同步

### 14.1 本地写入

```text
保存流水
→ 本地事务写 Transaction
→ 更新 Account balance cache
→ 标记 SyncOperation pending
→ 更新月度聚合缓存
→ UI 立即反馈成功
```

### 14.2 云同步

- 每条流水有 version。
- 同一流水冲突采用字段级策略或冲突副本。
- 金额、类型、账户冲突不能静默合并。
- 标签、备注可尝试合并。
- 作废和更新冲突时优先提示用户。

### 14.3 幂等

自然语言或弱网重复点击不能产生重复流水。客户端生成 `idempotencyKey` 并持久化到同步成功。

---

## 15. 隐私与安全

- 记账数据默认属于高敏感等级。
- 支持单独开启生物识别/密码锁。
- 通知默认不显示具体金额。
- 截图和后台任务切换时可覆盖敏感内容。
- 导出前二次确认。
- 云端按用户隔离。
- 删除账号时包括所有流水、附件和快照。
- AI 分类可完全关闭。
- 日志不得记录金额备注、账户名和附件内容。

---

## 16. 测试清单

### 16.1 单元测试

- 金额格式化。
- 月份边界。
- 收支汇总。
- 转账不计收支。
- 余额重建。
- 预算阈值。
- 多币种隔离。

### 16.2 Repository 合约测试

- 新增流水。
- 更新流水乐观锁。
- 作废流水。
- 月份分页。
- 筛选组合。
- 迁移。

### 16.3 E2E

- 新建支出。
- 新建收入。
- 新建转账。
- 编辑后月度汇总更新。
- 作废后余额恢复。
- 离线创建后联网同步。
- 导出本月 CSV。
- 权限拒绝仍可手工记账。

### 16.4 财务不变量测试

```text
所有账户余额可由流水重建
转账净收入 = 0
作废交易不进入统计
月度分类合计 = 月度总支出/收入
同一个 idempotencyKey 最多产生一条业务交易
```

---

## 17. 分阶段开发与冻结

### Ledger M0：契约与骨架

- Manifest。
- 领域模型。
- Public API。
- 事件 schema。
- Repository 接口。
- 数据迁移 001。

冻结内容：实体标识、金额单位、公共 API v1 基本形态。

### Ledger M1：基础记账

- 账户。
- 分类。
- 收入/支出。
- 月度流水。
- 本月汇总。
- 离线保存。

验收后冻结：Transaction 核心字段、月度查询接口。

### Ledger M2：转账与导出

- 转账。
- 作废。
- CSV/JSON 导出。
- 搜索索引。

验收后冻结：转账语义、导出格式 v1。

### Ledger M3：预算与周期账单

- 月度预算。
- 分类预算。
- 周期规则。
- 提醒事件。

验收后冻结：Budget 与 RecurringRule v1。

### Ledger M4：AI 与导入

- 自然语言草稿。
- 分类建议。
- CSV 导入映射。
- 重复检测。

AI 失败不能阻塞 M1–M3 的任何功能。

### Ledger M5：稳定与冻结

- 性能压测。
- 数据恢复演练。
- 安全评审。
- API 快照。
- Schema 快照。
- 文档和 CHANGELOG。
- 状态改为 `frozen`。

冻结完成后开始开发下一个工具，例如饮食或习惯模块。

---

## 18. MVP 验收标准

- [ ] 用户可创建至少一个账户。
- [ ] 可记录收入、支出。
- [ ] 可按月份查看全部流水。
- [ ] 本月收入、支出、结余计算正确。
- [ ] 可按分类和账户筛选。
- [ ] 弱网/离线不丢数据。
- [ ] 重复点击不产生重复记录。
- [ ] 删除或作废后统计正确回滚。
- [ ] 可导出 CSV 和 JSON。
- [ ] 模块禁用后其他功能不受影响。
- [ ] 其他模块没有引用 ledger 内部文件。
- [ ] AI 关闭时可完整手工使用。

---

## 19. 建议的第一版开发任务

```text
L-001 创建 ledger 模块骨架与 manifest
L-002 定义 Money、Account、Transaction、Category
L-003 实现本地 Repository 与 migration 001
L-004 实现 CreateTransaction use case
L-005 实现 ListMonthlyTransactions use case
L-006 实现 GetMonthlySummary use case
L-007 完成记账首页
L-008 完成新建流水页
L-009 完成账户与分类管理
L-010 加入同步操作日志
L-011 完成 CSV/JSON 导出
L-012 完成合约测试和 E2E
L-013 生成 API 与 schema 快照
L-014 冻结 Ledger M1 边界
```
