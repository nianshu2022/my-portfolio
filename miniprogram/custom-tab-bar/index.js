Component({
  data: {
    selected: -1,
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

  lifetimes: {
    attached() {
      this.syncSelectedByRoute();
    }
  },

  pageLifetimes: {
    show() {
      this.syncSelectedByRoute();
    }
  },

  methods: {
    syncSelectedByRoute() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (!current) return;

      const route = `/${current.route}`;
      const selected = this.data.list.findIndex((item) => item.pagePath === route);
      if (selected > -1 && selected !== this.data.selected) {
        this.setData({ selected });
      }
    },

    switchTab(event) {
      const { path } = event.currentTarget.dataset;
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (current && `/${current.route}` === path) return;

      wx.switchTab({ url: path });
    }
  }
});
