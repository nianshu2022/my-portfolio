App({
  globalData: {
    siteName: 'Nianshu 的空间',
    openid: '',
    settings: null
  },

  onLaunch() {
    this.login();
    this.fetchSettings();
    
    // 监听并初始化暗黑模式
    wx.onThemeChange(({ theme }) => this.updateNavBar(theme));
    let theme = 'light';
    if (wx.getWindowInfo) {
      theme = wx.getWindowInfo().theme;
    } else if (wx.getSystemInfoSync) {
      theme = wx.getSystemInfoSync().theme;
    }
    this.updateNavBar(theme);
  },

  async fetchSettings() {
    const api = require('./utils/api');
    try {
      const res = await api.request('/api/settings', 'GET');
      if (res && !res.error) {
        this.globalData.settings = res;
        if (this.settingsReadyCallback) {
          this.settingsReadyCallback(res);
        }
      }
    } catch (e) {
      console.error('[Settings] Fetch failed', e);
    }
  },

  updateNavBar(theme) {
    const isDark = theme === 'dark';
    wx.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#0b0f1a' : '#ffffff',
      animation: { duration: 300, timingFunc: 'easeIn' }
    });
  },

  async login() {
    const api = require('./utils/api');
    const readingStore = require('./store/reading');

    try {
      // 1. 获取微信 Code
      const { code } = await wx.login();
      
      // 2. 换取 OpenID
      const res = await api.request('/api/auth/login', 'POST', { code });
      
      if (res.openid) {
        this.globalData.openid = res.openid;
        console.log('[Auth] Login success', res.openid);

        // 3. 登录成功后，同步一次本地收藏到云端 (去重同步)
        const localFavorites = readingStore.getFavorites().map(f => f.slug);
        if (localFavorites.length > 0) {
          await api.request('/api/favorites/sync', 'POST', { slugs: localFavorites });
        }
      }
    } catch (err) {
      console.error('[Auth] Login failed', err);
    }
  }
});
