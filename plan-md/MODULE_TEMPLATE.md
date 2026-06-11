# 新工具模块设计模板

> 复制本文件并重命名为 `MODULE_<NAME>.md`。未填写完毕不得进入开发。

## 1. 基本信息

- 模块 ID：
- 中文名称：
- Owner：
- 当前版本：
- 生命周期：draft / beta / stable / frozen
- 目标上线端：微信小程序 / H5 / App

## 2. 用户问题

一句话说明该工具解决什么问题。

## 3. MVP 用例

1. 
2. 
3. 

## 4. 明确不做

1. 
2. 
3. 

## 5. 权限与敏感数据

- 权限：
- 敏感等级：
- 本地处理：
- 云端处理：
- AI 处理：
- 导出：
- 删除：

## 6. 页面与路由

```text
模块首页
├── ...
└── ...
```

## 7. 领域模型

```ts
// Entities and value objects
```

## 8. 业务不变量

- 
- 
- 

## 9. Public API

```ts
export interface ModulePublicApiV1 {
}
```

## 10. 领域事件

```text
module.entity.created.v1
module.entity.updated.v1
```

## 11. Repository

```ts
export interface ModuleRepository {
}
```

## 12. Manifest

```ts
export const manifest: ToolManifest = {
  // ...
};
```

## 13. API

```text
GET  /v1/module/...
POST /v1/module/...
```

## 14. 存储与迁移

- 表/集合：
- Namespace：
- Migration 001：
- 回滚策略：

## 15. 与其他模块协作

- 公共 API：
- 订阅事件：
- 发布事件：
- 公共动作：

## 16. 降级策略

- 离线：
- AI 失败：
- 权限拒绝：
- 云同步失败：
- 文件失败：

## 17. 测试

- Unit：
- Contract：
- Integration：
- E2E：
- 不变量：

## 18. 里程碑

### M0 契约

### M1 MVP

### M2 增强

### M3 稳定与冻结

## 19. Definition of Done

- [ ] Manifest
- [ ] Public API
- [ ] Domain model
- [ ] Repository contract
- [ ] Migration
- [ ] Unit tests
- [ ] Contract tests
- [ ] E2E
- [ ] Export/delete
- [ ] Analytics
- [ ] Privacy review
- [ ] API snapshot
- [ ] Schema snapshot
- [ ] CHANGELOG
- [ ] Frozen review
