// Simple test to verify the application setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying URL Shortener Setup...\n');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  '.env.example',
  'app/page.tsx',
  'app/layout.tsx',
  'app/api/healthz/route.ts',
  'app/api/links/route.ts',
  'app/api/links/[code]/route.ts',
  'app/[code]/route.ts',
  'lib/db.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log('✅', file);
  } else {
    console.log('❌', file);
    allFilesExist = false;
  }
});

console.log('\n📋 Project Structure:');
console.log('├── app/');
console.log('│   ├── api/');
console.log('│   │   ├── healthz/');
console.log('│   │   └── links/');
console.log('│   ├── stats/');
console.log('│   └── [code]/');
console.log('├── lib/');
console.log('└── Configuration files');

console.log('\n🚀 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Set up your .env.local with DATABASE_URL');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');

if (allFilesExist) {
  console.log('\n✅ All required files are present!');
} else {
  console.log('\n❌ Some files are missing. Please check the setup.');
}