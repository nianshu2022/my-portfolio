Component({
  properties: {
    count: {
      type: Number,
      value: 3
    },
    variant: {
      type: String,
      value: 'card'
    }
  },

  data: {
    rows: [1, 2, 3]
  },

  observers: {
    count(value) {
      const count = Math.max(1, Math.min(Number(value) || 3, 8));
      this.setData({
        rows: Array.from({ length: count }, (_, index) => index + 1)
      });
    }
  }
});
