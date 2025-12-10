#!/usr/bin/env node

/**
 * Script Deployment Otomatis untuk SERVISOO
 * 
 * Script ini membantu proses deployment dengan:
 * 1. Build production
 * 2. Compress file untuk upload
 * 3. Memberikan instruksi deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('🚀 SERVISOO Deployment Script');
console.log('================================\n');

// Step 1: Build Production
console.log('📦 Building production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Verify dist folder
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Dist folder not found');
  process.exit(1);
}

console.log('📁 Verifying dist folder contents...');
const distContents = fs.readdirSync(distPath, { withFileTypes: true });
const fileNames = distContents.map(dirent => dirent.name);
console.log('Files in dist:', fileNames);

// Required files check
const requiredFiles = ['index.html', 'assets', '.htaccess'];
const missingFiles = requiredFiles.filter(file => !fileNames.includes(file));

if (missingFiles.length > 0) {
  console.warn('⚠️  Missing files:', missingFiles);
  if (missingFiles.includes('.htaccess')) {
    console.log('ℹ️  .htaccess file is required for proper SPA routing');
  }
} else {
  console.log('✅ All required files present\n');
}

// Step 3: Create deployment package
console.log('📦 Creating deployment package...');
const outputPath = path.join(__dirname, 'servisoo-deployment.zip');

// Remove existing zip if exists
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', function() {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Deployment package created: ${sizeInMB} MB`);
  console.log(`📁 Location: ${outputPath}\n`);
  
  // Step 4: Deployment Instructions
  console.log('🌐 DEPLOYMENT INSTRUCTIONS');
  console.log('==========================');
  console.log('1. Login to your hosting control panel (cPanel)');
  console.log('2. Navigate to File Manager');
  console.log('3. Go to public_html directory');
  console.log('4. DELETE all existing files in public_html');
  console.log('5. Upload servisoo-deployment.zip');
  console.log('6. Extract the ZIP file');
  console.log('7. Move all files from the extracted folder to public_html root');
  console.log('8. Delete the empty folder and ZIP file');
  console.log('\n📋 IMPORTANT CHECKS:');
  console.log('- Ensure index.html is in public_html root (not in subfolder)');
  console.log('- Ensure assets/ folder is in public_html root');
  console.log('- Ensure .htaccess file is in public_html root');
  console.log('- Test website: https://www.servisoo.com/');
  console.log('\n🔧 TROUBLESHOOTING:');
  console.log('- If 404 errors occur, check .htaccess file is uploaded');
  console.log('- If assets don\'t load, check assets/ folder structure');
  console.log('- If SSL errors, contact hosting provider');
  console.log('\n🚨 CURRENT ISSUE:');
  console.log('- Server (145.223.108.71) is not responding');
  console.log('- Contact hosting provider to resolve server connectivity');
  console.log('- Deploy files only after server is operational');
});

archive.on('error', function(err) {
  console.error('❌ Error creating deployment package:', err);
  process.exit(1);
});

archive.pipe(output);

// Add all files from dist directory
archive.directory(distPath, false);
archive.finalize();