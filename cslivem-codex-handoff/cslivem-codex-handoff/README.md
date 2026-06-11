# Cslivem → Codex 交付包

## 最快使用方式

把整个 `cslivem-codex-handoff` 文件夹复制到项目根目录，然后在 Codex 中输入：

> 请读取 `cslivem-codex-handoff/CODEX_TASK.md`，扫描当前项目并按照文档实施。先汇报修改计划和涉及文件，再直接完成代码修改与测试。

Codex CLI 支持把 PNG/JPEG 作为视觉输入；也可以在提示中同时附上品牌板图片和文字要求。正式开发时，应让 Codex读取独立 SVG、颜色 Token 和任务文档，而不是只看截图。

## 推荐项目放置方式

```text
your-project/
├─ cslivem-codex-handoff/
├─ src/ 或 miniprogram/
├─ app.json
└─ package.json
```

## 重要说明

当前 SVG 是依据视觉方向制作的可落地初版，不是从品牌板截图中自动提取的精确矢量稿。上线前建议在 Figma/Illustrator 中做最后的曲线、字距和小尺寸像素校正。

微信小程序原生 `tabBar` 场景通常建议准备本地 PNG 图标；页面内部 Logo 可依据项目渲染能力选择 SVG 或 PNG。
