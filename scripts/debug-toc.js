const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filePath = path.join(process.cwd(), 'src/content/posts/2022/securecrt-connect-centos.md');
const fileContents = fs.readFileSync(filePath, 'utf8');
const { content } = matter(fileContents);

console.log('Content length:', content.length);
console.log('First 50 chars:', JSON.stringify(content.substring(0, 50)));

const regex = /^#{2,3}\s+.+$/gm;
const matches = content.match(regex);

console.log('Regex:', regex);
console.log('Matches:', matches);

if (!matches) {
    console.log('Testing without $ anchor...');
    const regex2 = /^#{2,3}\s+.+/gm;
    console.log('Matches 2:', content.match(regex2));
}
