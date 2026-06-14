Component({
  properties: {
    selected: {
      type: Number,
      value: -1
    }
  },

  data: {
    list: [
      {
        pagePath: '/pages/index/index',
        text: '花园',
        mark: 'G'
      },
      {
        pagePath: '/pages/tags/tags',
        text: '发现',
        mark: 'T'
      },
      {
        pagePath: '/pages/reading/index',
        text: '书架',
        mark: 'R'
      },
      {
        pagePath: '/pages/about/about',
        text: '我的',
        mark: 'M'
      }
    ]
  },

  methods: {
    switchTab(event) {
      const { path } = event.currentTarget.dataset;
      wx.switchTab({ url: path });
    }
  }
});
