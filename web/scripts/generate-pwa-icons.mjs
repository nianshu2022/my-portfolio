import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const publicDir = path.join(process.cwd(), 'public');
const sourceIcon = path.join(publicDir, 'icon.png');

async function generateIcons() {
    if (!fs.existsSync(sourceIcon)) {
        console.error('Source icon not found:', sourceIcon);
        process.exit(1);
    }

    const sizes = [192, 512];

    for (const size of sizes) {
        const destPath = path.join(publicDir, `icon-${size}.png`);
        try {
            await sharp(sourceIcon)
                .resize(size, size)
                .toFile(destPath);
            console.log(`Generated ${size}x${size} icon: ${destPath}`);
        } catch (err) {
            console.error(`Error generating ${size}x${size} icon:`, err);
        }
    }
}

generateIcons();
