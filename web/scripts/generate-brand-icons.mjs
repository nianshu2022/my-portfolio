import fs from "fs";
import path from "path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const appDir = path.join(rootDir, "src", "app");
const sourceIcon = path.join(publicDir, "brand-mark.png");

async function writeIcon(filePath, size) {
  const padding = Math.max(3, Math.round(size * 0.08));
  const innerSize = size - padding * 2;

  await sharp(sourceIcon)
    .trim({ threshold: 18 })
    .resize(innerSize, innerSize, { fit: "contain" })
    .extend({
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
      background: "#f7f4ec",
    })
    .sharpen({ sigma: 0.55 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(filePath);
}

async function main() {
  if (!fs.existsSync(sourceIcon)) {
    console.error("Brand mark source not found:", sourceIcon);
    process.exit(1);
  }

  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(appDir, { recursive: true });

  await writeIcon(path.join(publicDir, "favicon.png"), 48);
  await writeIcon(path.join(publicDir, "icon.png"), 512);
  await writeIcon(path.join(publicDir, "icon-192.png"), 192);
  await writeIcon(path.join(publicDir, "icon-512.png"), 512);
  await writeIcon(path.join(appDir, "icon.png"), 512);
  await writeIcon(path.join(appDir, "apple-icon.png"), 180);

  console.log("Generated Nianshu brand icons from public/brand-mark.png.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
