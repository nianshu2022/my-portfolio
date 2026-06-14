const { getAllEssays } = require('../../utils/api')

Page({
  data: {
    loading: true,
    essays: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    this.setData({ loading: true })
    
    try {
      const essays = await getAllEssays()
      this.setData({
        essays,
        loading: false
      })
    } catch (err) {
      console.error('加载失败:', err)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onEssayTap(e) {
    const { slug } = e.detail
    wx.navigateTo({
      url: `/pages/detail/detail?slug=${slug}&type=essay`
    })
  },

  onShareAppMessage() {
    return {
      title: '成长样本 - 念舒档案局',
      path: '/pages/essays/essays'
    }
  }
})
