App({
  globalData: {
    siteName: '念舒档案局',
    siteDesc: '00 后技术折腾者的成长样本库',
    baseUrl: 'https://blog.nianshu2022.cn'
  },

  onLaunch() {
    this.checkUpdate()
  },

  checkUpdate() {
    if (!wx.canIUse('getUpdateManager')) return
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(() => {})
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) updateManager.applyUpdate()
        }
      })
    })
  }
})
