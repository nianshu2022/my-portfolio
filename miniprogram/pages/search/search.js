const { searchContent } = require('../../utils/api')
const { debounce } = require('../../utils/format')

Page({
  data: {
    keyword: '',
    results: [],
    loading: false,
    searched: false,
    hotTags: ['Next.js', 'React', 'Cloudflare', 'Docker', 'AI', 'Vue3']
  },

  onLoad() {
    this.search = debounce(this.doSearch.bind(this), 500)
  },

  onInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ keyword })
    
    if (keyword.length >= 2) {
      this.search()
    } else {
      this.setData({ results: [], searched: false })
    }
  },

  async doSearch() {
    const { keyword } = this.data
    if (!keyword) return
    
    this.setData({ loading: true })
    
    try {
      const results = await searchContent(keyword)
      this.setData({
        results,
        searched: true,
        loading: false
      })
    } catch (err) {
      console.error('搜索失败:', err)
      this.setData({ loading: false })
      wx.showToast({ title: '搜索失败', icon: 'none' })
    }
  },

  onTagTap(e) {
    const { text } = e.currentTarget.dataset
    this.setData({ keyword: text })
    this.doSearch()
  },

  onClear() {
    this.setData({ 
      keyword: '', 
      results: [], 
      searched: false 
    })
  },

  onResultTap(e) {
    const { slug, type } = e.detail
    wx.navigateTo({
      url: `/pages/detail/detail?slug=${slug}&type=${type || 'post'}`
    })
  },

  onShareAppMessage() {
    return {
      title: '搜索 - 念舒档案局',
      path: '/pages/search/search'
    }
  }
})
