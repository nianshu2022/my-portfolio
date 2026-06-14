Component({
  properties: {
    title: { type: String, value: '' },
    date: { type: String, value: '' },
    tags: { type: Array, value: [] },
    caseNumber: { type: String, value: 'NS-0000-000' },
    excerpt: { type: String, value: '' },
    type: { type: String, value: 'post' },
    slug: { type: String, value: '' }
  },

  data: {
    shortNumber: '000'
  },

  observers: {
    'caseNumber': function (val) {
      const parts = val.split('-')
      this.setData({
        shortNumber: parts[parts.length - 1] || '000'
      })
    }
  },

  methods: {
    onTap() {
      const { slug, type } = this.data
      this.triggerEvent('tap', { slug, type })
    }
  }
})
