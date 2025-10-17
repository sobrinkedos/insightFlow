const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const extensionDir = path.join(__dirname, '..', 'browser-extension');
const outputDir = path.join(__dirname, '..', 'public', 'downloads');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createZip(name, files, manifestFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(outputDir, `${name}.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✓ ${name}.zip created (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Add common files
    files.forEach(file => {
      const filePath = path.join(extensionDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    // Add specific manifest
    if (manifestFile) {
      archive.file(path.join(extensionDir, manifestFile), { name: 'manifest.json' });
    }

    // Add icons directory
    const iconsDir = path.join(extensionDir, 'icons');
    if (fs.existsSync(iconsDir)) {
      archive.directory(iconsDir, 'icons');
    }

    archive.finalize();
  });
}

async function buildAll() {
  console.log('Building browser extensions...\n');

  const commonFiles = [
    'popup.html',
    'popup.js',
    'content.js',
    'content.css',
    'background.js'
  ];

  try {
    // Chrome
    await createZip('insightshare-chrome', [
      ...commonFiles,
      'manifest.json'
    ]);

    // Edge
    await createZip('insightshare-edge', [
      ...commonFiles
    ], 'manifest-edge.json');

    // Firefox
    await createZip('insightshare-firefox', [
      'popup-firefox.html',
      'popup-firefox.js',
      'content.js',
      'content.css',
      'background-firefox.js'
    ], 'manifest-firefox.json');

    console.log('\n✓ All extensions built successfully!');
    console.log(`Output directory: ${outputDir}`);
  } catch (error) {
    console.error('Error building extensions:', error);
    process.exit(1);
  }
}

buildAll();
