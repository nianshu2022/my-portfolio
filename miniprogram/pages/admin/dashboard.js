const api = require('../../utils/api');

Page({
  data: {
    stats: {
      total_views: 0,
      total_likes: 0,
      total_comments: 0,
      total_posts: 0
    },
    rankings: [],
    activities: []
  },

  onShow() {
    this.setSystemUI();
    this.loadStats();
    this.loadRankings();
    this.loadActivities();
  },

  setSystemUI() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: { duration: 400, timingFunc: 'easeIn' }
    });
  },

  async loadStats() {
    try {
      const res = await api.request('/api/admin/stats', 'GET');
      if (res && !res.error) {
        this.setData({ stats: res });
      }
    } catch (e) {
      console.error('Failed to load admin stats', e);
    }
  },

  async loadRankings() {
    try {
      const res = await api.request('/api/admin/posts/rank', 'GET');
      if (res && !res.error) {
        this.setData({ rankings: res });
      }
    } catch (e) {
      console.error('Failed to load rankings', e);
    }
  },

  async loadActivities() {
    try {
      const res = await api.request('/api/admin/activities', 'GET');
      if (res && !res.error) {
        this.setData({ activities: res });
      }
    } catch (e) {
      console.error('Failed to load activities', e);
    }
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadStats(), 
      this.loadRankings(),
      this.loadActivities()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
