const api = require('../../utils/api');

Page({
  data: {
    posts: []
  },

  onShow() {
    this.loadPosts();
  },

  async loadPosts() {
    try {
      const res = await api.request('/api/admin/posts', 'GET');
      if (res && !res.error) {
        this.setData({ posts: res });
      }
    } catch (e) {
      wx.showToast({ title: '加载文章失败', icon: 'none' });
    }
  },

  async togglePublish(e) {
    const { slug } = e.currentTarget.dataset;
    const published = e.detail.value;
    
    try {
      await api.request('/api/admin/posts/toggle', 'POST', { slug, published });
      wx.showToast({ 
        title: published ? '已发布' : '已转为草稿', 
        icon: 'success' 
      });
      // 延迟刷新列表以保证状态一致
      setTimeout(() => this.loadPosts(), 500);
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
      this.loadPosts(); // 恢复状态
    }
  },

  onPullDownRefresh() {
    this.loadPosts().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
