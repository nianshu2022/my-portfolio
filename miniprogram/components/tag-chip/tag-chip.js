Component({
  properties: {
    text: { type: String, value: '' },
    active: { type: Boolean, value: false },
    count: { type: Number, value: 0 }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { text: this.data.text })
    }
  }
})
