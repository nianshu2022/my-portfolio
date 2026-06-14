const api = require('../../utils/api');

Page({
  data: {
    latency: 0,
    health: {
      database: {
        post_count: 0,
        comment_count: 0,
        favorite_count: 0,
        stats_count: 0
      },
      platform: '-',
      runtime: '-',
      location: '-'
    },
    libVersion: ''
  },

  onLoad() {
    const info = wx.getSystemInfoSync();
    this.setData({ libVersion: info.SDKVersion });
    this.refreshAll();
  },

  async refreshAll() {
    this.measureLatency();
    this.loadHealth();
  },

  async measureLatency() {
    const start = Date.now();
    try {
      // 使用 check 接口作为 ping
      await api.request('/api/admin/check', 'GET');
      const end = Date.now();
      this.setData({ latency: end - start });
    } catch (e) {
      this.setData({ latency: -1 });
    }
  },

  async loadHealth() {
    try {
      const res = await api.request('/api/admin/health', 'GET');
      if (res && !res.error) {
        this.setData({ health: res });
      }
    } catch (e) {
      console.error('Failed to load health info', e);
    }
  }
});
