const { getHistory, clearHistory, getFavorites, removeFavorite } = require('../../utils/storage')
const { formatDate } = require('../../utils/format')

Page({
  data: {
    activeTab: 'history',
    history: [],
    favorites: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const history = getHistory().map(item => ({
      ...item,
      dateFormatted: formatDate(item.timestamp)
    }))
    
    const favorites = getFavorites().map(item => ({
      ...item,
      dateFormatted: formatDate(item.timestamp)
    }))

    this.setData({ history, favorites })
  },

  switchTab(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ activeTab: tab })
  },

  onItemTap(e) {
    const { slug, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?slug=${slug}&type=${type}`
    })
  },

  onRemoveFavorite(e) {
    const { slug } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定取消收藏？',
      success: (res) => {
        if (res.confirm) {
          removeFavorite(slug)
          this.loadData()
          wx.showToast({ title: '已取消收藏', icon: 'none' })
        }
      }
    })
  },

  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空阅读历史？',
      success: (res) => {
        if (res.confirm) {
          clearHistory()
          this.loadData()
          wx.showToast({ title: '已清空', icon: 'none' })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '阅读历史 - 念舒档案局',
      path: '/pages/history/history'
    }
  }
})
