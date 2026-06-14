Page({
  copySite() {
    wx.setClipboardData({
      data: 'https://blog.nianshu2022.cn',
      success() {
        wx.showToast({ title: '已复制网站', icon: 'success' });
      }
    });
  },

  copyName() {
    wx.setClipboardData({
      data: '念舒',
      success() {
        wx.showToast({ title: '已复制昵称', icon: 'success' });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '念舒的数字货架',
      path: '/pages/products/products'
    };
  }
});
