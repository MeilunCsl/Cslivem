Component({
  properties: {
    placeholder: { type: String, value: '搜索笔记、工具，或输入你的想法...' },
    value: { type: String, value: '' },
    focus: { type: Boolean, value: false },
    showAi: { type: Boolean, value: true }
  },
  methods: {
    onTap() { this.triggerEvent('tap'); },
    onInput(e) { this.triggerEvent('input', { value: e.detail.value }); },
    onConfirm(e) { this.triggerEvent('confirm', { value: e.detail.value }); }
  }
});