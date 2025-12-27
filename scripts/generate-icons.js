/**
 * Generate PWA icons from SVG source
 * Run: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = join(__dirname, '../public/icons/icon.svg');
const outputDir = join(__dirname, '../public/icons');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Read SVG file
const svgBuffer = readFileSync(inputSvg);

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created: icon-${size}x${size}.png`);
  }

  // Also create apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(outputDir, 'apple-touch-icon.png'));
  console.log('  Created: apple-touch-icon.png');

  // Create favicon.ico equivalent (32x32 PNG)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(outputDir, 'favicon-32x32.png'));
  console.log('  Created: favicon-32x32.png');

  // Create 16x16 favicon
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(join(outputDir, 'favicon-16x16.png'));
  console.log('  Created: favicon-16x16.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
