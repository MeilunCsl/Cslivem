# 记账模块 (ledger)

## 简介
收支记录、账户管理、月度流水与分类统计。

## 版本
v0.4.0 — active (M0+M1)

## 公共 API

### 账户管理
- `getAccounts()` — 获取所有活跃账户
- `getAccountById(id)` — 按 ID 获取账户
- `createAccount(data)` — 创建账户
- `updateAccount(id, updates)` — 更新账户

### 流水管理
- `createTransaction(data)` — 创建流水（验证后保存，自动更新余额）
- `deleteTransaction(id)` — 删除流水（自动恢复余额）
- `getRecentTransactions(limit)` — 获取最近流水
- `getMonthTransactions(year, month)` — 按月获取流水
- `getMonthlySummary(year, month)` — 月度汇总（收入/支出/结余）

### 分类
- `getCategories()` — 获取所有分类
- `getExpenseCategories()` — 支出分类
- `getIncomeCategories()` — 收入分类

### 统计
- `getStats()` — 账户数/总余额/月度汇总

## 数据模型
- Account: id, name, type, icon, currency, initialBalanceMinor, currentBalanceMinor
- Transaction: id, type(expense/income/transfer), amountMinor, categoryId, accountId, date, note
- Category: id, name, type, icon, color

## 金额规范
统一使用最小货币单位整数（如 3650 表示 ¥36.50），禁止浮点数。

## 依赖
- `../../miniprogram/storage` — 本地存储
- `../../utils/format` — generateId

## 后续规划
- M2: 转账 + 作废 + CSV导出
- M3: 预算 + 周期账单
- M4: AI 分类 + 导入
