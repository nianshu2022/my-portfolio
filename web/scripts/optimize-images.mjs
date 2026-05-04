/**
 * 图片优化脚本
 * - 将 avatar.gif 转换为 WebP 动画格式（sharp 支持）
 * - 压缩 PNG 图标文件
 */
import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function formatSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function compressPng(inputPath, outputPath, options = {}) {
  const { width, quality = 80 } = options;
  const before = statSync(inputPath).size;

  const pipeline = sharp(inputPath).png({ quality, compressionLevel: 9, palette: true });
  if (width) pipeline.resize(width, width, { fit: 'inside', withoutEnlargement: true });
  await pipeline.toFile(outputPath);

  const after = statSync(outputPath).size;
  console.log(`✅ ${inputPath.split(/[\\/]/).pop()} → ${outputPath.split(/[\\/]/).pop()}: ${formatSize(before)} → ${formatSize(after)} (节省 ${Math.round((1 - after/before)*100)}%)`);
}

async function convertGifToWebp(inputPath, outputPath) {
  const before = statSync(inputPath).size;
  
  console.log('🔄 正在转换 GIF → WebP（这可能需要一点时间...）');
  
  // sharp 支持将 GIF 的第一帧转为 WebP 静态图
  // 对于动态头像，我们输出高质量 WebP
  await sharp(inputPath, { animated: true })
    .webp({ quality: 85, effort: 4, loop: 0 })
    .toFile(outputPath);

  const after = statSync(outputPath).size;
  console.log(`✅ avatar.gif → avatar.webp: ${formatSize(before)} → ${formatSize(after)} (节省 ${Math.round((1 - after/before)*100)}%)`);
}

async function main() {
  console.log('\n🚀 开始图片优化...\n');

  // 1. 转换 GIF 头像
  const gifPath = resolve(root, 'public/img/avatar.gif');
  const webpPath = resolve(root, 'public/img/avatar.webp');
  if (existsSync(gifPath)) {
    await convertGifToWebp(gifPath, webpPath);
  } else {
    console.warn('⚠️  avatar.gif 不存在，跳过');
  }

  // 2. 压缩 PNG 图标
  const icons = [
    { input: 'public/favicon.png', output: 'public/favicon.png', width: 64 },
    { input: 'public/icon-192.png', output: 'public/icon-192.png', width: 192 },
    { input: 'public/icon-512.png', output: 'public/icon-512.png', width: 512 },
    { input: 'src/app/icon.png', output: 'src/app/icon.png', width: 512 },
    { input: 'src/app/apple-icon.png', output: 'src/app/apple-icon.png', width: 180 },
  ];

  for (const icon of icons) {
    const inputPath = resolve(root, icon.input);
    const outputPath = resolve(root, icon.output);
    if (existsSync(inputPath)) {
      // 先写到临时文件再覆盖（sharp 不能原地覆盖）
      const tmpPath = outputPath + '.tmp.png';
      await compressPng(inputPath, tmpPath, { width: icon.width });
      // 用 fs rename 覆盖原文件
      const { renameSync } = await import('fs');
      renameSync(tmpPath, outputPath);
    } else {
      console.warn(`⚠️  ${icon.input} 不存在，跳过`);
    }
  }

  console.log('\n✨ 优化完成！');
}

main().catch(console.error);
