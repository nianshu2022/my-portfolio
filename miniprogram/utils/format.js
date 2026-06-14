/* 念舒档案局 - 格式化工具 */

/**
 * 格式化日期
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 生成案卷编号
 */
function generateCaseNumber(slug, date, index) {
  if (!date) return 'NS-0000-000'
  const year = date.slice(0, 4)
  const num = String(index + 1).padStart(3, '0')
  return `NS-${year}-${num}`
}

/**
 * 计算阅读时间
 */
function calculateReadingTime(content) {
  if (!content) return '1 分钟'
  const charCount = content.replace(/\s+/g, '').length
  const minutes = Math.ceil(charCount / 500)
  return `${minutes} 分钟`
}

/**
 * 截取摘要
 */
function getExcerpt(content, length = 100) {
  if (!content) return ''
  const text = content.replace(/[#*`\[\]]/g, '').replace(/\n+/g, ' ')
  return text.length > length ? text.slice(0, length) + '...' : text
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 */
function throttle(fn, delay = 100) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

module.exports = {
  formatDate,
  generateCaseNumber,
  calculateReadingTime,
  getExcerpt,
  debounce,
  throttle
}
