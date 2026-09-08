/* 念舒档案局 - Markdown 解析器 */

/**
 * 将 Markdown 转换为小程序 rich-text 支持的 HTML
 */
function parseMarkdown(md) {
  if (!md) return ''
  
  let html = md
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="code-block"><code>${escapeHtml(code.trim())}</code></pre>`
    })
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 删除线
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;"/>')
    // 引用
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // 无序列表
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // 有序列表
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // 水平线
    .replace(/^[-*_]{3,}$/gm, '<hr/>')
    // 段落（连续两个换行）
    .replace(/\n\n/g, '</p><p>')
    // 单个换行
    .replace(/\n/g, '<br/>')
  
  // 包裹段落
  html = '<p>' + html + '</p>'
  
  // 清理空段落
  html = html.replace(/<p><\/p>/g, '')
  
  // 处理列表
  html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => {
    return '<ul>' + match + '</ul>'
  })
  
  return html
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 提取目录
 */
function extractToc(md) {
  if (!md) return []
  
  const headings = md.match(/^#{2,3}\s+.+$/gm) || []
  return headings.map((heading, index) => {
    const level = heading.match(/^#+/)?.[0].length || 2
    const title = heading.replace(/^#+\s+/, '')
    const id = 'heading-' + index
    return { id, title, level, index }
  })
}

module.exports = {
  parseMarkdown,
  extractToc
}
