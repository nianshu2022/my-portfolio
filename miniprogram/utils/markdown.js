function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarkdown(value) {
  let text = escapeHtml(value);

  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1（$2）');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return text;
}

function extractImage(line) {
  const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!match) return null;

  return {
    alt: match[1],
    src: match[2]
  };
}

function pushParagraph(nodes, paragraph) {
  const content = paragraph.join('<br/>').trim();
  if (!content) return;

  nodes.push(`<p class="md-p">${inlineMarkdown(content)}</p>`);
}

function parseMarkdown(markdown) {
  const nodes = [];
  const images = [];
  const links = [];
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  let paragraph = [];
  let inCode = false;
  let codeLines = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith('```')) {
      if (inCode) {
        nodes.push(`<pre class="md-code">${escapeHtml(codeLines.join('\n'))}</pre>`);
        codeLines = [];
        inCode = false;
      } else {
        pushParagraph(nodes, paragraph);
        paragraph = [];
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    for (const match of line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }

    if (!line.trim()) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      nodes.push('<hr class="md-hr"/>');
      continue;
    }

    const image = extractImage(line.trim());
    if (image) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      images.push(image.src);
      nodes.push(`<img class="md-img" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || '文章图片')}"/>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      const level = Math.min(heading[1].length, 4);
      nodes.push(`<h${level} class="md-h md-h${level}">${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (line.trim().startsWith('>')) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      nodes.push(`<blockquote class="md-quote">${inlineMarkdown(line.trim().replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }

    const listItem = line.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (listItem) {
      pushParagraph(nodes, paragraph);
      paragraph = [];
      nodes.push(`<p class="md-li">• ${inlineMarkdown(listItem[2])}</p>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  if (inCode && codeLines.length) {
    nodes.push(`<pre class="md-code">${escapeHtml(codeLines.join('\n'))}</pre>`);
  }

  pushParagraph(nodes, paragraph);

  return { nodes: nodes.join(''), images, links };
}

module.exports = {
  parseMarkdown
};
