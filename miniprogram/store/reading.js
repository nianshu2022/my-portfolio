const FAVORITES_KEY = 'garden:favorites:v1';
const HISTORY_KEY = 'garden:history:v1';
const LIKES_KEY = 'garden:likes:v1';
const MAX_HISTORY = 60;

function getStorage(key, fallback) {
  try {
    const value = wx.getStorageSync(key);
    return Array.isArray(value) ? value : fallback;
  } catch (error) {
    console.warn('[Garden Store] read failed', key, error);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    console.warn('[Garden Store] write failed', key, error);
  }
}

function itemKey(item) {
  if (!item) return '';
  return `${item.detailCollection || item.collection || 'posts'}:${item.slug || ''}`;
}

function compactItem(item) {
  return {
    id: item.id || item.slug,
    slug: item.slug,
    title: item.title,
    description: item.description,
    tags: item.tags || [],
    type: item.type,
    typeLabel: item.typeLabel,
    detailCollection: item.detailCollection || item.collection,
    displayDate: item.displayDate,
    readingTime: item.readingTime,
    cover: item.cover || item.award || '',
    savedAt: Date.now()
  };
}

function getFavorites() {
  return getStorage(FAVORITES_KEY, []);
}

function isFavorite(item) {
  const key = itemKey(item);
  return !!key && getFavorites().some((favorite) => itemKey(favorite) === key);
}

function toggleFavorite(item) {
  const key = itemKey(item);
  if (!key) return { favorited: false, favorites: getFavorites() };

  const favorites = getFavorites();
  const existed = favorites.some((favorite) => itemKey(favorite) === key);
  const next = existed
    ? favorites.filter((favorite) => itemKey(favorite) !== key)
    : [compactItem(item), ...favorites];

  setStorage(FAVORITES_KEY, next);
  return { favorited: !existed, favorites: next };
}

function getHistory() {
  return getStorage(HISTORY_KEY, []);
}

function addHistory(item) {
  const key = itemKey(item);
  if (!key) return getHistory();

  const next = [
    { ...compactItem(item), viewedAt: Date.now() },
    ...getHistory().filter((historyItem) => itemKey(historyItem) !== key)
  ].slice(0, MAX_HISTORY);

  setStorage(HISTORY_KEY, next);
  return next;
}

function clearHistory() {
  setStorage(HISTORY_KEY, []);
}

function getLikes() {
  return getStorage(LIKES_KEY, []);
}

function isLiked(item) {
  const key = itemKey(item);
  return !!key && getLikes().some((likedItem) => itemKey(likedItem) === key);
}

function toggleLike(item) {
  const key = itemKey(item);
  if (!key) return { liked: false, likes: getLikes() };

  const likes = getLikes();
  const existed = likes.some((likedItem) => itemKey(likedItem) === key);
  const next = existed
    ? likes.filter((likedItem) => itemKey(likedItem) !== key)
    : [compactItem(item), ...likes];

  setStorage(LIKES_KEY, next);
  return { liked: !existed, likes: next };
}

function getTodayHistory() {
  const today = new Date().toDateString();
  return getHistory().filter((item) => new Date(item.viewedAt || item.savedAt || 0).toDateString() === today);
}

function getReadingStats() {
  return {
    history: getHistory().length,
    favorites: getFavorites().length,
    likes: getLikes().length,
    today: getTodayHistory().length
  };
}

module.exports = {
  getFavorites,
  toggleFavorite,
  isFavorite,
  getHistory,
  addHistory,
  clearHistory,
  getLikes,
  toggleLike,
  isLiked,
  getTodayHistory,
  getReadingStats,
  itemKey
};
