Component({
  properties: {
    count: { type: Number, value: 3 }
  },

  data: {
    items: []
  },

  lifetimes: {
    attached() {
      const items = Array.from({ length: this.data.count }, (_, i) => i)
      this.setData({ items })
    }
  }
})
