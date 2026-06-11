# AI Knowledge Hub 微信小程序

> 随手记录 + AI 整理 + 知识图谱 + 独立工具集

## 快速开始

1. 打开微信开发者工具
2. 导入项目，选择本目录
3. AppID 填写你自己的小程序 AppID（或使用测试号）
4. 编译运行

## 项目结构

```
├── app.js / app.json / app.wxss   入口与全局配置
├── miniprogram/                   平台内核（不依赖 wx.* 的抽象层）
├── modules/                       领域模块（各自独立，通过 public.js 对外）
│   ├── note/                      笔记
│   ├── calendar/                  日历
│   └── ledger/                    记账
├── pages/                         页面
├── components/                    公共组件
├── styles/                        设计系统
├── assets/                        静态资源
└── utils/                         工具函数
```

## 边界规则

### 模块间通信

- 模块只通过 `modules/<name>/public.js` 对外暴露 API
- 禁止跨模块直接引用内部文件（如 `require('../../modules/note/domain/entities')`）
- 模块间解耦通信使用 `miniprogram/event-bus.js`

### 平台适配

- 业务代码禁止直接调用 `wx.*`
- 统一通过 `miniprogram/platform-adapter.js` 封装
- 后续扩展 H5/App 时只需替换 adapter 实现

### 数据隔离

- 每个模块的数据表/存储键以模块 ID 为前缀（如 `note_`、`ledger_`）
- 模块禁用不删除数据
- 导出功能按模块独立实现

### 版本管理

- 遵循语义化版本：MAJOR.MINOR.PATCH
- 每个版本的变更记录在 `CHANGELOG.md`
- 每次验收结果记录在 `VERIFICATION.md`
- Git tag 与版本号对应

## 文档

| 文件 | 内容 |
|------|------|
| `CHANGELOG.md` | 版本路线图与变更记录 |
| `VERIFICATION.md` | 验收记录 |
| `doc/` | UI 原型与交付文档 |
| `plan-md/` | 架构设计与模块详细设计 |

## 当前版本

**v0.1.0 Skeleton** — 项目骨架与首页工作台

下一个版本：v0.2.0 Note — 笔记模块开发