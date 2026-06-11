# 记账模块 (Ledger Module)

- **ID**: `ledger`
- **版本**: 0.1.0
- **状态**: draft

## 职责
- 收支记录
- 月度流水
- 分类统计
- 预算管理

## Public API
- `getMonthlySummary(year, month)` — 月度摘要
- `getRecentTransactions(limit)` — 最近流水
- `createTransaction(data)` — 创建流水
- `getAccounts()` — 账户列表
