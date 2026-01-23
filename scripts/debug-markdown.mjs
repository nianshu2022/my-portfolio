import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const markdown = `
## 1. 安装 SecureCRT
Test content.
`;

const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'span', 'div'
    ],
    attributes: {
        ...defaultSchema.attributes,
        'img': ['src', 'alt', 'title', 'width', 'height', 'style', 'className'],
        '*': ['className', 'id', 'style']
    }
};

async function processMarkdown() {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        //.use(rehypeSanitize, sanitizeSchema) // Uncomment to test with sanitize
        .use(rehypeStringify)
        .process(markdown);

    console.log('--- Without Sanitize ---');
    console.log(String(file));

    const fileSanitized = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeSanitize, sanitizeSchema)
        .use(rehypeStringify)
        .process(markdown);

    console.log('\n--- With Sanitize ---');
    console.log(String(fileSanitized));
}

processMarkdown();
