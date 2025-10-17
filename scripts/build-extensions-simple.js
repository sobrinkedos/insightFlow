const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================');
console.log(' InsightShare - Build de Extensoes');
console.log('========================================\n');

const extensionDir = path.join(__dirname, '..', 'browser-extension');
const outputDir = path.join(__dirname, '..', 'public', 'downloads');

// Criar diretório de saída
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function buildExtension(name, files, manifestFile) {
  console.log(`Criando ${name}.zip...`);
  
  const tempDir = path.join(__dirname, '..', `temp-${name}`);
  
  // Criar diretório temporário
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir);
  
  // Copiar arquivos
  files.forEach(file => {
    const src = path.join(extensionDir, file);
    const dest = path.join(tempDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  });
  
  // Copiar manifest
  const manifestSrc = path.join(extensionDir, manifestFile);
  const manifestDest = path.join(tempDir, 'manifest.json');
  fs.copyFileSync(manifestSrc, manifestDest);
  
  // Copiar ícones
  const iconsDir = path.join(extensionDir, 'icons');
  const iconsDestDir = path.join(tempDir, 'icons');
  if (fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDestDir);
    fs.readdirSync(iconsDir).forEach(file => {
      fs.copyFileSync(
        path.join(iconsDir, file),
        path.join(iconsDestDir, file)
      );
    });
  }
  
  // Criar ZIP usando PowerShell
  const zipPath = path.join(outputDir, `${name}.zip`);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  
  try {
    execSync(
      `powershell Compress-Archive -Path "${tempDir}/*" -DestinationPath "${zipPath}"`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error(`Erro ao criar ${name}.zip:`, error.message);
  }
  
  // Limpar
  fs.rmSync(tempDir, { recursive: true });
  
  if (fs.existsSync(zipPath)) {
    const stats = fs.statSync(zipPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`[OK] ${name}.zip criado (${sizeKB} KB)\n`);
  }
}

// Arquivos comuns
const commonFiles = [
  'popup.html',
  'popup.js',
  'content.js',
  'content.css',
  'background.js'
];

// Build Chrome
buildExtension('insightshare-chrome', commonFiles, 'manifest.json');

// Build Edge
buildExtension('insightshare-edge', commonFiles, 'manifest-edge.json');

// Build Firefox
const firefoxFiles = [
  'popup-firefox.html',
  'popup-firefox.js',
  'content.js',
  'content.css',
  'background-firefox.js'
];
buildExtension('insightshare-firefox', firefoxFiles, 'manifest-firefox.json');

console.log('[OK] Todas as extensoes foram criadas com sucesso!');
console.log(`Diretorio de saida: ${outputDir}\n`);
