const BASE_URL = 'https://garden-api.nianshu2022.cn';
const REQUEST_TIMEOUT = 20000;

function formatError(path, detail) {
  const message = detail?.errMsg || detail?.message || String(detail || '未知错误');
  return new Error(`请求 ${path} 失败：${message}`);
}

function requestOnce(path, method = 'GET', data = null) {
  const app = getApp();
  const openid = app?.globalData?.openid || '';

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method,
      data,
      header: {
        'x-openid': openid
      },
      timeout: REQUEST_TIMEOUT,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }

        reject(new Error(`请求 ${path} 失败：HTTP ${res.statusCode}`));
      },
      fail(error) {
        reject(formatError(path, error));
      }
    });
  });
}

async function request(path, method = 'GET', data = null) {
  try {
    return await requestOnce(path, method, data);
  } catch (firstError) {
    console.warn('[Garden API] request retry', {
      path,
      method,
      message: firstError.message
    });

    try {
      return await requestOnce(path, method, data);
    } catch (secondError) {
      console.error('[Garden API] request failed', {
        path,
        method,
        first: firstError.message,
        second: secondError.message
      });
      throw secondError;
    }
  }
}

function getGarden() {
  return request('/api/garden');
}

function getPosts() {
  return request('/api/garden').then(items => items.filter(i => i.type === 'post'));
}

function getEssays() {
  return request('/api/garden').then(items => items.filter(i => i.type === 'essay'));
}

function getTags() {
  return request('/api/tags');
}

function getDetail(collection, slug) {
  return request(`/api/posts/${slug}`);
}

function search(keyword) {
  return request(`/api/search?q=${encodeURIComponent(keyword || '')}`);
}

function getComments(slug) {
  return request(`/api/posts/${slug}/comments`);
}

function postComment(slug, data) {
  return request(`/api/posts/${slug}/comments`, 'POST', data);
}

function normalizeItem(item) {
  const typeLabel = item.type === 'essay' ? '日志' : '笔记';
  const tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []);
  const readingTime = item.reading_time || item.readingTime || '';

  return {
    ...item,
    tags,
    readingTime,
    typeLabel,
    detailCollection: item.category || item.collection || (item.type === 'essay' ? 'essays' : 'posts'),
    displayDate: String(item.date || '').slice(0, 10),
    displayMeta: `${typeLabel} · ${String(item.date || '').slice(0, 10)} · ${readingTime}`
  };
}

module.exports = {
  BASE_URL,
  request,
  getGarden,
  getPosts,
  getEssays,
  getTags,
  getDetail,
  search,
  getComments,
  postComment,
  normalizeItem
};
