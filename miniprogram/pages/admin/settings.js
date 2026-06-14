const api = require('../../utils/api');

Page({
  data: {
    config: {
      site_name: '',
      site_bio: '',
      site_notice: ''
    },
    changed: false
  },

  onLoad() {
    this.loadSettings();
  },

  async loadSettings() {
    try {
      const res = await api.request('/api/settings', 'GET');
      if (res && !res.error) {
        this.setData({ config: res, changed: false });
      }
    } catch (e) {
      wx.showToast({ title: '加载配置失败', icon: 'none' });
    }
  },

  onInput(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`config.${key}`]: value,
      changed: true
    });
  },

  async saveSettings() {
    if (!this.data.changed) return;
    
    const { config } = this.data;
    wx.showLoading({ title: '正在应用...' });

    try {
      // 逐个更新配置（也可以后端支持批量，这里简单处理）
      for (const key in config) {
        await api.request('/api/admin/settings/update', 'POST', {
          key,
          value: config[key]
        });
      }
      
      wx.hideLoading();
      wx.showToast({ title: '配置已生效', icon: 'success' });
      this.setData({ changed: false });
      
      // 更新全局变量 (可选，视页面实现而定)
      const app = getApp();
      app.globalData.siteName = config.site_name;
      
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});
