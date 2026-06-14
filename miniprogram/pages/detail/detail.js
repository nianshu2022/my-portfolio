const { getPostBySlug, getEssayBySlug } = require('../../utils/api')
const { formatDate, calculateReadingTime } = require('../../utils/format')
const { addFavorite, removeFavorite, isFavorite, addHistory } = require('../../utils/storage')

Page({
  data: {
    loading: true,
    post: null,
    type: 'post',
    isFavorite: false,
    toc: [],
    showToc: false
  },

  onLoad(options) {
    const { slug, type = 'post' } = options
    this.setData({ type })
    this.loadDetail(slug, type)
  },

  async loadDetail(slug, type) {
    this.setData({ loading: true })
    
    try {
      const post = type === 'essay' 
        ? await getEssayBySlug(slug)
        : await getPostBySlug(slug)

      const isFav = isFavorite(slug)
      
      // 提取目录
      const toc = this.extractToc(post.content)
      
      // 添加阅读历史
      addHistory({
        slug: post.slug,
        title: post.title,
        type,
        date: post.date
      })

      this.setData({
        post,
        toc,
        isFavorite: isFav,
        loading: false
      })

      wx.setNavigationBarTitle({
        title: post.title || '案卷详情'
      })
    } catch (err) {
      console.error('加载失败:', err)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  extractToc(content) {
    if (!content) return []
    const headings = content.match(/^#{2,3}\s+.+$/gm) || []
    return headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 2
      const title = heading.replace(/^#+\s+/, '')
      const id = title.toLowerCase().replace(/\s+/g, '-')
      return { id, title, level, index }
    })
  },

  toggleFavorite() {
    const { post, type, isFavorite: isFav } = this.data
    
    if (isFav) {
      removeFavorite(post.slug)
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      addFavorite({
        slug: post.slug,
        title: post.title,
        type,
        date: post.date
      })
      wx.showToast({ title: '已收藏', icon: 'success' })
    }
    
    this.setData({ isFavorite: !isFav })
  },

  toggleToc() {
    this.setData({ showToc: !this.data.showToc })
  },

  onTocTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ showToc: false })
    // 滚动到对应位置需要使用 scroll-view 或 page-scroll-to
  },

  copyLink() {
    const { post, type } = this.data
    const url = `https://blog.nianshu2022.cn/${type === 'essay' ? 'essays' : 'blog'}/${post.slug}`
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  },

  share() {
    // 触发分享
  },

  onShareAppMessage() {
    const { post, type } = this.data
    return {
      title: post?.title || '念舒档案局',
      path: `/pages/detail/detail?slug=${post?.slug}&type=${type}`
    }
  }
})
