import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// dist에서 루트로 파일 복사
const distPath = path.join(__dirname, 'dist');
const rootPath = __dirname;

console.log('📦 Copying build files to root...');

// index.html 복사
const indexSrc = path.join(distPath, 'index.html');
const indexDest = path.join(rootPath, 'index.html');
fs.copyFileSync(indexSrc, indexDest);
console.log('✓ index.html copied');

// assets 폴더 복사
const assetsSrc = path.join(distPath, 'assets');
const assetsDest = path.join(rootPath, 'assets');

if (fs.existsSync(assetsSrc)) {
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      
      if (fs.statSync(srcFile).isDirectory()) {
        copyDir(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }

  copyDir(assetsSrc, assetsDest);
  console.log('✓ assets/ copied');
} else {
  console.log('⚠ assets/ folder not found, skipping...');
}

console.log('✅ Build files ready for deployment!');
