# 日历模块 (Calendar Module)

- **ID**: `calendar`
- **版本**: 0.1.0
- **状态**: draft

## 职责
- 月/周/日视图
- 事件与任务管理
- 日记
- 与笔记/饮食记录联动

## Public API
- `getMonthEvents(year, month)` — 获取月事件
- `getTodayEvents()` — 获取今日事件
- `getDiary(date)` — 获取日记
- `createEvent(eventData)` — 创建事件
