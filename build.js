const fs = require('fs');
const path = require('path');

// 소스 폴더와 출력 폴더 설정
const srcDir = './src';
const distDir = './dist';

// dist 폴더가 없으면 생성
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// src 폴더의 모든 .js 파일 읽기
if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.js'));
  
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);
    
    // 파일 복사
    fs.copyFileSync(srcPath, distPath);
    console.log(`✓ Built: ${file}`);
  });
  
  console.log('\n✓ Build completed successfully!');
} else {
  console.log('Creating src folder...');
  fs.mkdirSync(srcDir, { recursive: true });
  console.log('✓ Please add your Roll20 scripts to the src folder');
}