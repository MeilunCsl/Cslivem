# 日历模块 (calendar)

## 简介
月视图、事件管理与日记。

## 版本
v0.3.0 — active

## 公共 API

### 事件管理
- getTodayEvents() — 获取今日事件
- getMonthEvents(year, month) — 获取某月所有事件
- getEventsByDate(date) — 按日期获取事件
- createEvent(data) — 创建事件（验证后保存）
- updateEvent(id, updates) — 更新事件
- deleteEvent(id) — 删除事件

### 日记
- getDiary(date) — 获取某日日记
- saveDiary(data) — 保存日记

### 统计
- getStats() — 获取日历统计信息

## 数据模型
- Event: id, title, date, time, endTime, description, type, color, isAllDay, reminder, relatedNoteId
- Diary: id, date, content, mood, weather, tags

## 依赖
- ../../miniprogram/storage — 本地存储
- ../../utils/format — generateId
