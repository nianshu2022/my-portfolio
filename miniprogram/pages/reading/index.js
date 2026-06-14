const readingStore = require('../../store/reading');
const tabbar = require('../../utils/tabbar');

Page({
  data: {
    tab: 'history',
    history: [],
    favorites: [],
    likes: [],
    stats: {
      history: 0,
      favorites: 0,
      likes: 0,
      today: 0
    },
    items: []
  },

  onShow() {
    tabbar.selectTab(this, 2);
    this.refresh();
  },

  refresh() {
    const history = readingStore.getHistory();
    const favorites = readingStore.getFavorites();
    const likes = readingStore.getLikes();
    const stats = readingStore.getReadingStats();
    const tab = this.data.tab;
    this.setData({
      history,
      favorites,
      likes,
      stats,
      items: this.getItemsByTab(tab, { history, favorites, likes })
    });
  },

  getItemsByTab(tab, source = this.data) {
    if (tab === 'favorites') return source.favorites || [];
    if (tab === 'likes') return source.likes || [];
    return source.history || [];
  },

  switchTab(event) {
    const tab = event.currentTarget.dataset.tab || 'history';
    this.setData({
      tab,
      items: this.getItemsByTab(tab)
    });
  },

  clearHistory() {
    readingStore.clearHistory();
    this.refresh();
    wx.showToast({ title: '阅读历史已清空', icon: 'none' });
  },

  openDetail(event) {
    const { collection, slug } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?collection=${collection}&slug=${slug}`
    });
  }
});
