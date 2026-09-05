const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'images');
const outputFile = path.join(rootDir, 'images.json');
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp', '.svg']);

function getImageFiles(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((fileName) => `images/${encodeURIComponent(fileName).replace(/%2F/g, '/')}`);
}

const images = getImageFiles(imagesDir);
fs.writeFileSync(outputFile, `${JSON.stringify(images, null, 2)}\n`, 'utf8');

console.log(`Generated images.json with ${images.length} image${images.length === 1 ? '' : 's'}.`);
