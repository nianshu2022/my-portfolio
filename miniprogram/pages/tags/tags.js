const api = require('../../utils/api');
const tabbar = require('../../utils/tabbar');

Page({
  data: {
    loading: true,
    error: '',
    keyword: '',
    items: [],
    filteredItems: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    tabbar.selectTab(this, 1);
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    this.setData({ loading: true, error: '' });

    try {
      const garden = await api.getGarden();
      const items = garden.map(api.normalizeItem);

      this.setData({
        items,
        filteredItems: this.filterItems(items, this.data.keyword),
        loading: false
      });
    } catch (error) {
      this.setData({
        loading: false,
        error: error.message || '内容加载失败，请稍后再试。'
      });
    }
  },

  filterItems(items, keyword) {
    const query = String(keyword || '').trim().toLowerCase();

    return items.filter((item) => {
      const tags = item.tags || [];
      const haystack = `${item.title} ${item.description} ${tags.join(' ')} ${item.typeLabel}`.toLowerCase();
      const matchedKeyword = !query || haystack.includes(query);
      return matchedKeyword;
    });
  },

  refreshVisible(patch = {}) {
    const keyword = patch.keyword !== undefined ? patch.keyword : this.data.keyword;

    this.setData({
      ...patch,
      filteredItems: this.filterItems(this.data.items, keyword)
    });
  },

  onSearch(event) {
    const keyword = event.detail.value;
    this.setData({ keyword });

    // 防抖处理：避免输入时高频请求
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(async () => {
      this.setData({ loading: true });
      try {
        const results = await api.search(keyword);
        this.setData({
          filteredItems: results.map(api.normalizeItem),
          loading: false
        });
      } catch (err) {
        console.error('Search failed', err);
        this.setData({ loading: false });
      }
    }, 300);
  },

  clearFilters() {
    this.setData({ keyword: '' });
    this.loadData();
  },

  openDetail(event) {
    const { collection, slug } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?collection=${collection}&slug=${slug}`
    });
  }
});
