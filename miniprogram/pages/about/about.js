const tabbar = require('../../utils/tabbar');

Page({
  data: {
    isAdmin: false
  },

  onShow() {
    tabbar.selectTab(this, 3);
    this.checkAdminStatus();
    this.applySettings();
  },

  applySettings() {
    const app = getApp();
    const updateSettings = (settings) => {
      if (settings && settings.site_bio) {
        this.setData({ bio: settings.site_bio });
      }
    };

    if (app.globalData.settings) {
      updateSettings(app.globalData.settings);
    } else {
      app.settingsReadyCallback = updateSettings;
    }
  },

  async checkAdminStatus() {
    const api = require('../../utils/api');
    try {
      const res = await api.request('/api/admin/check', 'GET');
      this.setData({ isAdmin: !!res.isAdmin });
    } catch (e) {
      this.setData({ isAdmin: false });
    }
  },

  copySite() {
    wx.setClipboardData({
      data: 'https://blog.nianshu2022.cn',
      success() {
        wx.showModal({
          title: '链接已复制',
          content: '受微信限制，无法直接跳转。请打开手机浏览器粘贴访问。',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#4f46e5'
        });
      }
    });
  },

  copyWechat() {
    wx.setClipboardData({
      data: '念舒',
      success() {
        wx.showToast({ title: '已复制昵称', icon: 'success' });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: 'Nianshu 的空间',
      path: '/pages/index/index'
    };
  }
});
