const { getAllPosts, getAllEssays } = require('../../utils/api')
const { formatDate, generateCaseNumber, getExcerpt } = require('../../utils/format')

Page({
  data: {
    loading: true,
    posts: [],
    essays: [],
    latestCases: [],
    caseNumbers: {},
    stats: {
      postCount: 0,
      essayCount: 0,
      tagCount: 0
    }
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
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
      const [posts, essays] = await Promise.all([
        getAllPosts(),
        getAllEssays()
      ])

      const caseNumbers = {}
      posts.forEach((post, index) => {
        caseNumbers[post.slug] = generateCaseNumber(post.slug, post.date, index)
      })

      this.setData({
        posts,
        essays,
        latestCases: posts.slice(0, 5),
        caseNumbers,
        stats: {
          postCount: posts.length,
          essayCount: essays.length,
          tagCount: [...new Set(posts.flatMap(p => p.tags || []).concat(essays.flatMap(e => e.tags || [])))].length
        },
        loading: false
      })
    } catch (err) {
      console.error('加载失败:', err)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onCaseTap(e) {
    const { slug, type } = e.detail
    wx.navigateTo({
      url: `/pages/detail/detail?slug=${slug}&type=${type}`
    })
  },

  goBlog() {
    wx.switchTab({ url: '/pages/tags/tags' })
  },

  goEssays() {
    wx.switchTab({ url: '/pages/essays/essays' })
  },

  goAbout() {
    wx.switchTab({ url: '/pages/about/about' })
  },

  onShareAppMessage() {
    return {
      title: '念舒档案局 - 00后技术折腾者的成长样本库',
      path: '/pages/index/index'
    }
  }
})
