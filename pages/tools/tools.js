// pages/tools/tools.js
Page({
  data: {
    statusBarHeight: 20,
    tools: [
      { id: 'pdf', icon: '▤', name: '图片转 PDF', description: '本地处理，可保存到知识库' },
      { id: 'ocr', icon: '◎', name: 'OCR 识别', description: '需要相册或相机权限' },
      { id: 'food', icon: '◒', name: '饮食记录', description: 'AI 识别食物与营养' },
      { id: 'scanner', icon: '▧', name: '扫描归档', description: '自动裁切和增强文档' },
      { id: 'ledger', icon: '￥', name: '记账', description: '收支记录与月度流水' }
    ],
    comingSoon: [
      { id: 'habit', icon: '✓', name: '习惯' },
      { id: 'pomodoro', icon: '⏱', name: '番茄钟' },
      { id: 'watermark', icon: '💧', name: '去水印' },
      { id: 'translate', icon: '🌐', name: '翻译' }
    ]
  },
  onLoad() {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 }); } catch(e) {}
  },
  onToolTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '工具详情（开发中）: ' + id, icon: 'none' });
  }
});
