const api = require('../../utils/api');
const tabbar = require('../../utils/tabbar');

Page({
  data: {
    loading: true,
    error: '',
    items: [],
    feeds: {
      latest: []
    },
    stats: {
      posts: 0,
      essays: 0,
      tags: 0,
      minutes: 0
    }
  },

  onLoad() {
    this.loadData();
    this.applySettings();
  },

  onShow() {
    tabbar.selectTab(this, 0);
  },

  applySettings() {
    const app = getApp();
    const updateSettings = (settings) => {
      if (settings) {
        this.setData({ 
          notice: settings.site_notice || '欢迎来到我的数字空间',
          siteName: settings.site_name || 'Nianshu 的空间'
        });
        if (settings.site_name) {
          wx.setNavigationBarTitle({ title: settings.site_name });
        }
      }
    };

    if (app.globalData.settings) {
      updateSettings(app.globalData.settings);
    } else {
      app.settingsReadyCallback = updateSettings;
    }
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    this.setData({ loading: true, error: '' });

    try {
      const [garden, tags] = await Promise.all([api.getGarden(), api.getTags()]);
      const normalized = garden.map(api.normalizeItem);

      const latest = normalized.slice(0, 2);
      const minutes = normalized.reduce((total, item) => {
        const matched = String(item.readingTime || '').match(/\d+/);
        return total + (matched ? Number(matched[0]) : 0);
      }, 0);

      this.setData({
        loading: false,
        feeds: { latest },
        items: latest,
        stats: {
          posts: garden.filter((item) => item.type === 'post').length,
          essays: garden.filter((item) => item.type === 'essay').length,
          tags: tags.length,
          minutes
        }
      });
    } catch (error) {
      this.setData({
        loading: false,
        error: error.message || '内容加载失败，请稍后再试。'
      });
    }
  },


  openDetail(event) {
    const { collection, slug } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?collection=${collection}&slug=${slug}`
    });
  }
});
