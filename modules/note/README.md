# 笔记模块 (note)

## 简介
知识记录、标签、双链与知识图谱。

## 公共 API
- `getRecentNotes(limit)` - 获取最近笔记
- `searchNotes(query)` - 搜索笔记
- `getInbox(limit)` - 获取收件箱笔记
- `getFavorites()` - 获取收藏笔记
- `getByTag(tag)` - 按标签获取笔记
- `getAllTags()` - 获取所有标签
- `getStats()` - 获取统计信息
- `createNote(data)` - 创建笔记
- `updateNote(id, updates)` - 更新笔记
- `deleteNote(id)` - 删除笔记
- `toggleFavorite(id)` - 切换收藏
- `addTag(id, tag)` - 添加标签
- `removeTag(id, tag)` - 移除标签
- `addQuickNote(content)` - 快速记录
- `archiveNote(id)` - 归档笔记