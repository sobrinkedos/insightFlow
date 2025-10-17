# Script para criar pacote Edge pronto para instalação

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " InsightShare - Pacote Edge" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$extensionDir = Join-Path $PSScriptRoot ".." "browser-extension"
$outputDir = Join-Path $PSScriptRoot ".." "public" "downloads"
$packageDir = Join-Path $PSScriptRoot ".." "edge-package"

# Limpar diretório de pacote se existir
if (Test-Path $packageDir) {
    Remove-Item -Recurse -Force $packageDir
}

# Criar estrutura
Write-Host "Criando estrutura de pacote..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $packageDir | Out-Null
New-Item -ItemType Directory -Path "$packageDir/Extension" | Out-Null

# Copiar arquivos da extensão
Write-Host "Copiando arquivos..." -ForegroundColor Yellow

$files = @(
    "manifest-edge.json",
    "popup.html",
    "popup.js",
    "content.js",
    "content.css",
    "background.js"
)

foreach ($file in $files) {
    $source = Join-Path $extensionDir $file
    if (Test-Path $source) {
        if ($file -eq "manifest-edge.json") {
            Copy-Item $source "$packageDir/Extension/manifest.json"
        } else {
            Copy-Item $source "$packageDir/Extension/"
        }
    }
}

# Copiar ícones
$iconsSource = Join-Path $extensionDir "icons"
$iconsDest = "$packageDir/Extension/icons"
if (Test-Path $iconsSource) {
    Copy-Item -Recurse $iconsSource $iconsDest
}

# Copiar AppxManifest
$appxManifest = Join-Path $extensionDir "AppxManifest.xml"
if (Test-Path $appxManifest) {
    Copy-Item $appxManifest $packageDir
}

Write-Host "[OK] Estrutura criada em: $packageDir" -ForegroundColor Green
Write-Host ""

# Criar ZIP do pacote
Write-Host "Criando ZIP do pacote..." -ForegroundColor Yellow
$zipPath = Join-Path $outputDir "insightshare-edge-package.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

Compress-Archive -Path "$packageDir/*" -DestinationPath $zipPath

$size = (Get-Item $zipPath).Length / 1KB
$sizeRounded = [math]::Round($size, 2)
Write-Host "[OK] Pacote criado: insightshare-edge-package.zip ($sizeRounded KB)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Proximos Passos:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra edge://extensions/" -ForegroundColor White
Write-Host "2. Ative 'Modo de desenvolvedor'" -ForegroundColor White
Write-Host "3. Clique 'Carregar sem compactacao'" -ForegroundColor White
Write-Host "4. Selecione a pasta: $packageDir\Extension" -ForegroundColor White
Write-Host ""
Write-Host "Ou extraia o ZIP e carregue a pasta Extension" -ForegroundColor Gray
Write-Host ""
