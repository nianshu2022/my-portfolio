Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '案卷', icon: '📋' },
      { pagePath: '/pages/tags/tags', text: '索引', icon: '🏷️' },
      { pagePath: '/pages/essays/essays', text: '样本', icon: '📝' },
      { pagePath: '/pages/about/about', text: '档案', icon: '📁' }
    ]
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const item = this.data.list[index]
      
      wx.switchTab({
        url: item.pagePath
      })
    }
  }
})
