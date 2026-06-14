const { getAllPosts } = require('../../utils/api')
const { generateCaseNumber } = require('../../utils/format')

Page({
  data: {
    loading: true,
    posts: [],
    filteredPosts: [],
    tags: [],
    activeTag: '',
    caseNumbers: {}
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
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
      const posts = await getAllPosts()
      
      const tagMap = {}
      posts.forEach(post => {
        (post.tags || []).forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1
        })
      })
      
      const tags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }))

      const caseNumbers = {}
      posts.forEach((post, index) => {
        caseNumbers[post.slug] = generateCaseNumber(post.slug, post.date, index)
      })

      this.setData({
        posts,
        filteredPosts: posts,
        tags,
        caseNumbers,
        loading: false
      })
    } catch (err) {
      console.error('加载失败:', err)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onTagTap(e) {
    const { text } = e.detail
    const activeTag = this.data.activeTag === text ? '' : text
    
    const filteredPosts = activeTag
      ? this.data.posts.filter(p => (p.tags || []).includes(activeTag))
      : this.data.posts

    this.setData({
      activeTag,
      filteredPosts
    })
  },

  onCaseTap(e) {
    const { slug, type } = e.detail
    wx.navigateTo({
      url: `/pages/detail/detail?slug=${slug}&type=${type}`
    })
  },

  onShareAppMessage() {
    return {
      title: '案卷索引 - 念舒档案局',
      path: '/pages/tags/tags'
    }
  }
})
