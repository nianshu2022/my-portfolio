const api = require('../../utils/api');

function dateValue(item) {
  const raw = String(item.date || '').replace(' ', 'T');
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function byCreatedDesc(a, b) {
  const diff = dateValue(b) - dateValue(a);
  if (diff !== 0) return diff;
  return String(a.slug || '').localeCompare(String(b.slug || ''), 'zh-CN');
}

Page({
  data: {
    loading: true,
    error: '',
    items: []
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    this.setData({ loading: true, error: '' });

    try {
      const posts = await api.getPosts();
      const items = posts.map(api.normalizeItem).sort(byCreatedDesc);

      this.setData({
        items,
        loading: false
      });
    } catch (error) {
      this.setData({
        loading: false,
        error: error.message || '文章加载失败，请稍后再试。'
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
