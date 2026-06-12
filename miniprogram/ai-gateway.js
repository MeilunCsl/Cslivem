// miniprogram/ai-gateway.js

module.exports = {
  summarize(text) {
    console.log('[AI] summarize, length:', text.length);
    return Promise.resolve({
      summary: '(AI stub) ' + text.substring(0, 50) + '...'
    });
  },

  suggestTags(text) {
    console.log('[AI] suggestTags');
    return Promise.resolve({ tags: ['pending', 'ai-suggested'] });
  },

  classify(text) {
    console.log('[AI] classify');
    return Promise.resolve({ category: 'uncategorized', confidence: 0.5 });
  },

  parseIntent(query) {
    console.log('[AI] parseIntent:', query);
    return Promise.resolve({ intent: 'unknown', entities: {}, raw: query });
  },

  ask(question, context) {
    console.log('[AI] ask:', question);
    return Promise.resolve({
      answer: '(AI stub) This is a mock answer, real AI coming soon.',
      sources: []
    });
  },

  ocr(imageUrl) {
    console.log('[AI] ocr:', imageUrl);
    return Promise.resolve({ text: '(OCR stub)', confidence: 0.9 });
  }
};
