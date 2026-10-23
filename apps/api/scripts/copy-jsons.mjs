import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, '..');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source, { withFileTypes: true });
  for (const file of files) {
    const curSource = path.join(source, file.name);
    const curTarget = path.join(target, file.name);
    if (file.isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else if (file.name.endsWith('.json') || file.name.endsWith('.js')) {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

// Ensure dist exists
const distDir = path.join(apiRoot, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy schemas from src/api to dist/src/api
copyFolderRecursiveSync(path.join(apiRoot, 'src', 'api'), path.join(distDir, 'src', 'api'));
// Copy extensions from src/extensions to dist/src/extensions
copyFolderRecursiveSync(path.join(apiRoot, 'src', 'extensions'), path.join(distDir, 'src', 'extensions'));
// Copy config from config to dist/config
copyFolderRecursiveSync(path.join(apiRoot, 'config'), path.join(distDir, 'config'));

console.log('✓ Copied JSON schemas and configs to dist');
