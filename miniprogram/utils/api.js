/* 念舒档案局 - API 工具 */

const BASE_URL = 'https://blog.nianshu2022.cn'

/**
 * 获取所有文章
 */
function getAllPosts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/posts.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取文章详情
 */
function getPostBySlug(slug) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/posts/${slug}.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取所有随笔
 */
function getAllEssays() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/essays.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取随笔详情
 */
function getEssayBySlug(slug) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/essays/${slug}.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取标签列表
 */
function getAllTags() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/tags.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 搜索内容
 */
function searchContent(keyword) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/garden.json`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const items = res.data || []
          const filtered = items.filter(item => 
            item.title?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.description?.toLowerCase().includes(keyword.toLowerCase()) ||
            (item.tags || []).some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
          )
          resolve(filtered)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  getAllPosts,
  getPostBySlug,
  getAllEssays,
  getEssayBySlug,
  getAllTags,
  searchContent
}
