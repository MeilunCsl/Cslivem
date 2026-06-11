// miniprogram/ai-gateway.js - AI 请求统一网关
// 所有 AI 能力通过此入口调用，方便统一管理 API Key、限流、计费
// 桩实现：返回模拟数据，后续替换为真实 API 调用

module.exports = {
  /**
   * 文本摘要
   * @param {string} text 原文
   * @returns {Promise<{summary: string}>}
   */
  summarize(text) {
    console.log('[AI] summarize 请求，文本长度:', text.length);
    return Promise.resolve({
      summary: '（AI 摘要桩）' + text.substring(0, 50) + '...'
    });
  },

  /**
   * 标签建议
   * @param {string} text 笔记内容
   * @returns {Promise<{tags: string[]}>}
   */
  suggestTags(text) {
    console.log('[AI] suggestTags 请求');
    return Promise.resolve({
      tags: ['待整理', 'AI建议']
    });
  },

  /**
   * 自动分类
   * @param {string} text 内容
   * @returns {Promise<{category: string, confidence: number}>}
   */
  classify(text) {
    console.log('[AI] classify 请求');
    return Promise.resolve({
      category: '未分类',
      confidence: 0.5
    });
  },

  /**
   * 意图识别
   * @param {string} query 用户输入的自然语言
   * @returns {Promise<{intent: string, entities: Object}>}
   */
  parseIntent(query) {
    console.log('[AI] parseIntent 请求:', query);
    return Promise.resolve({
      intent: 'unknown',
      entities: {},
      raw: query
    });
  },

  /**
   * 全库问答
   * @param {string} question 问题
   * @param {Object} context 上下文
   * @returns {Promise<{answer: string, sources: Array}>}
   */
  ask(question, context) {
    console.log('[AI] ask 请求:', question);
    return Promise.resolve({
      answer: '（AI 问答桩）这是一个模拟回答，后续将接入真实 AI 服务。',
      sources: []
    });
  },

  /**
   * OCR 文字识别
   * @param {string} imageUrl 图片临时路径
   * @returns {Promise<{text: string, confidence: number}>}
   */
  ocr(imageUrl) {
    console.log('[AI] ocr 请求:', imageUrl);
    return Promise.resolve({
      text: '（OCR 桩）识别结果将在此显示',
      confidence: 0.9
    });
  }
};
