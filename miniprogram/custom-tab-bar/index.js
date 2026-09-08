Component({
  data: {
    selected: 0,
    list: [
      { 
        pagePath: '/pages/index/index', 
        text: '案卷',
        icon: 'M4 4h16v16H4z M8 8h8 M8 12h6',
        iconType: 'doc'
      },
      { 
        pagePath: '/pages/tags/tags', 
        text: '索引',
        icon: 'M7 7h10v10H7z M10 10h4v4h-4z',
        iconType: 'index'
      },
      { 
        pagePath: '/pages/essays/essays', 
        text: '样本',
        icon: 'M5 5h14v14H5z M8 9h8 M8 13h6',
        iconType: 'essay'
      },
      { 
        pagePath: '/pages/about/about', 
        text: '档案',
        icon: 'M4 6h16v12H4z M4 6l4-2h8l4 2',
        iconType: 'archive'
      }
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
