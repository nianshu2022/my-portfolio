import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirs = [
    path.join(process.cwd(), 'src/content/posts'),
    path.join(process.cwd(), 'src/content/essays'),
];

const outputFile = path.join(process.cwd(), 'public/knowledge.json');

function getAllFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.md')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function stripMarkdown(text) {
    // Simple regex to basic markdown stripping
    return text
        .replace(/^#+\s+/gm, '') // headings
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // images
        .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks (remove entirely or keep content? let's remove code mostly to save tokens, or just strip fences)
        // Actually, preserving code concepts is good. Let's just strip fences.
        // .replace(/`{3}.*?\n/g, '').replace(/`{3}/g, '') 
        .replace(/[*_~`]/g, '') // formatting chars
        .replace(/\n+/g, ' ') // merge newlines
        .trim();
}

function chunkText(text, maxLength = 800) {
    const chunks = [];
    let currentChunk = '';

    const sentences = text.split(/([.?!。？！]\s*)/);

    for (const part of sentences) {
        if ((currentChunk + part).length > maxLength) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = part;
        } else {
            currentChunk += part;
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

const knowledge = [];

contentDirs.forEach(dir => {
    const files = getAllFiles(dir);
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const { data, content: markdownBody } = matter(content);

        // Skip drafts
        if (data.draft) return;

        // Simple stripping
        const plainText = stripMarkdown(markdownBody);

        // Chunking
        const chunks = chunkText(plainText);

        chunks.forEach(chunk => {
            if (chunk.length < 50) return; // Skip too short
            knowledge.push({
                source: data.title,
                url: file.includes('posts') ? `/blog/${path.basename(file, '.md')}` : `/essays/${path.basename(file, '.md')}`,
                content: chunk
            });
        });
    });
});

fs.writeFileSync(outputFile, JSON.stringify(knowledge, null, 2));
console.log(`Generated knowledge base with ${knowledge.length} chunks.`);
