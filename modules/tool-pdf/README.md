# Tool PDF

图片转 PDF 工具模块。

## 功能
- 从相册/相机选择多张图片（最多 9 张）
- 生成标准 PDF 文档（每张图片占一页 A4）
- 分享 PDF / 保存到本地
- 进度显示

## 依赖
- `core/pdf/pdf-writer.js` — 轻量 PDF 生成库
- `miniprogram/platform-adapter.js` — 文件系统适配

## API
```js
var pdfTool = require('../../modules/tool-pdf/public');
pdfTool.selectImages(9);           // 选择图片
pdfTool.generatePdf(paths);        // 生成 PDF
pdfTool.sharePdf(filePath);        // 分享
pdfTool.savePdf(filePath);         // 保存
```

## 版本
- v1.7.0 — 真实 PDF 生成实现
- v0.1.0 — 桩实现
