// components/card/card.js
Component({
  options: { multipleSlots: true },
  properties: {
    className: { type: String, value: '' },
    customStyle: { type: String, value: '' }
  },
  methods: {
    onTap() { this.triggerEvent('tap'); }
  }
});
