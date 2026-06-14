/* 念舒档案局 - 本地存储工具 */

const STORAGE_KEYS = {
  FAVORITES: 'nianshu_favorites',
  HISTORY: 'nianshu_history',
  SETTINGS: 'nianshu_settings'
}

/**
 * 获取收藏列表
 */
function getFavorites() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.FAVORITES) || []
  } catch (e) {
    return []
  }
}

/**
 * 添加收藏
 */
function addFavorite(item) {
  const favorites = getFavorites()
  const exists = favorites.some(f => f.slug === item.slug)
  if (exists) return false
  
  favorites.unshift({
    slug: item.slug,
    title: item.title,
    type: item.type || 'post',
    date: item.date,
    timestamp: Date.now()
  })
  
  wx.setStorageSync(STORAGE_KEYS.FAVORITES, favorites)
  return true
}

/**
 * 移除收藏
 */
function removeFavorite(slug) {
  const favorites = getFavorites()
  const filtered = favorites.filter(f => f.slug !== slug)
  wx.setStorageSync(STORAGE_KEYS.FAVORITES, filtered)
  return true
}

/**
 * 检查是否已收藏
 */
function isFavorite(slug) {
  const favorites = getFavorites()
  return favorites.some(f => f.slug === slug)
}

/**
 * 获取阅读历史
 */
function getHistory() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.HISTORY) || []
  } catch (e) {
    return []
  }
}

/**
 * 添加阅读历史
 */
function addHistory(item) {
  const history = getHistory()
  const filtered = history.filter(h => h.slug !== item.slug)
  
  filtered.unshift({
    slug: item.slug,
    title: item.title,
    type: item.type || 'post',
    date: item.date,
    timestamp: Date.now()
  })
  
  // 最多保留 50 条
  if (filtered.length > 50) {
    filtered.pop()
  }
  
  wx.setStorageSync(STORAGE_KEYS.HISTORY, filtered)
}

/**
 * 清空阅读历史
 */
function clearHistory() {
  wx.setStorageSync(STORAGE_KEYS.HISTORY, [])
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getHistory,
  addHistory,
  clearHistory
}
