# Codex 实施任务：把 Cslivem 品牌视觉应用到现有小程序

请先扫描项目结构、框架、全局样式、页面路由和现有底部导航栏实现，再开始修改。

## 核心要求
1. 保持当前底部导航栏的页面数量、路由和业务逻辑不变，只统一视觉。
2. 首页改为 GPT 移动端式的极简布局：
   - 顶部居中显示 `assets/logo/cslivem-logo-horizontal.svg`，移动端按比例缩小。
   - 主标题：“今天想了解什么？”
   - 下方为圆角问题输入框，placeholder：“输入你的问题…”
   - 右侧为圆形发送按钮，使用品牌渐变。
   - 减少卡片、横幅与装饰，强调留白。
3. 使用 `design-tokens.json` 或 `styles/design-tokens.css` 中的品牌变量，不要在组件中散落重复颜色值。
4. Logo 语义必须保留：C + 对话气泡 + Live 声波。
5. 浅色背景优先；深色模式只做兼容，不重构业务。
6. 保持已有接口、状态管理、登录、聊天和导航逻辑。
7. 所有点击区域至少 44×44；处理安全区、键盘顶起和长屏适配。
8. 不要把整张品牌板截图当页面背景；它只作为视觉参考。

## 资产使用
- `assets/reference/cslivem-brand-board.png`：视觉参考，不进入正式页面。
- `assets/logo/cslivem-mark.svg`：纯图形 Logo。
- `assets/logo/cslivem-logo-horizontal.svg`：首页顶部横版 Logo。
- `assets/logo/cslivem-mark-monochrome.svg`：单色场景。
- 微信小程序原生 tabBar 若不接受 SVG，请将导航图标导出为本地 PNG 后再配置。

## 实施顺序
1. 输出项目现状和拟修改文件列表。
2. 建立全局设计 Token。
3. 重构首页布局和样式。
4. 统一底部导航栏图标、颜色和选中态。
5. 检查不同屏宽、安全区和输入法场景。
6. 运行项目已有 lint、typecheck、test 和 build。
7. 汇报修改文件、测试结果和仍需人工确认的内容。

## 验收标准
- 首屏一眼能识别 Cslivem，而不是通用 AI 聊天模板。
- 页面视觉简洁，但 Logo、声波、发送按钮形成明确品牌记忆点。
- 不破坏现有功能。
- 没有将视觉稿中的文字或图标错误地切成一整张图片。
