Page({
  data: {
    profile: {
      name: '念舒',
      title: '00 后技术折腾者 / 产品实践者',
      location: '中国 / 兰州',
      bio: '一个在技术路上不断折腾的 00 后，记录真实的踩坑经历和成长过程。',
      links: [
        { name: 'GitHub', url: 'https://github.com/nianshu2022' },
        { name: '博客', url: 'https://blog.nianshu2022.cn' }
      ]
    },
    timeline: [
      { year: '2024', title: '毕业', desc: '大学生活结束，开始新的征程' },
      { year: '2023', title: 'ICT 大赛', desc: '参加全国大学生 ICT 大赛' },
      { year: '2022', title: '独立开发', desc: '开始独立开发之路' },
      { year: '2021', title: '技术探索', desc: '深入学习前端开发' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  onShareAppMessage() {
    return {
      title: '认识念舒 - 念舒档案局',
      path: '/pages/about/about'
    }
  },

  copyLink(e) {
    const { url } = e.currentTarget.dataset
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  },

  goGithub() {
    wx.setClipboardData({
      data: 'https://github.com/nianshu2022',
      success: () => {
        wx.showToast({ title: 'GitHub 链接已复制', icon: 'success' })
      }
    })
  },

  goBlog() {
    wx.setClipboardData({
      data: 'https://blog.nianshu2022.cn',
      success: () => {
        wx.showToast({ title: '博客链接已复制', icon: 'success' })
      }
    })
  }
})
