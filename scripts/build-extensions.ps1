# Script para criar pacotes ZIP das extensões

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " InsightShare - Build de Extensoes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$extensionDir = Join-Path $PSScriptRoot ".." "browser-extension"
$outputDir = Join-Path $PSScriptRoot ".." "public" "downloads"

# Criar diretório de saída
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Função para criar ZIP
function Create-ExtensionZip {
    param(
        [string]$Name,
        [string[]]$Files,
        [string]$ManifestFile = "manifest.json"
    )
    
    Write-Host "Criando $Name.zip..." -ForegroundColor Yellow
    
    $tempDir = Join-Path $env:TEMP "insightshare-$Name"
    
    # Limpar diretório temporário se existir
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir
    }
    
    # Criar diretório temporário
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Copiar arquivos
    foreach ($file in $Files) {
        $sourcePath = Join-Path $extensionDir $file
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath $tempDir
        }
    }
    
    # Copiar manifest específico
    $manifestSource = Join-Path $extensionDir $ManifestFile
    $manifestDest = Join-Path $tempDir "manifest.json"
    Copy-Item $manifestSource $manifestDest
    
    # Copiar ícones
    $iconsSource = Join-Path $extensionDir "icons"
    $iconsDest = Join-Path $tempDir "icons"
    if (Test-Path $iconsSource) {
        Copy-Item -Recurse $iconsSource $iconsDest
    }
    
    # Criar ZIP
    $zipPath = Join-Path $outputDir "$Name.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath
    }
    
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath
    
    # Limpar
    Remove-Item -Recurse -Force $tempDir
    
    $size = (Get-Item $zipPath).Length / 1KB
    $sizeRounded = [math]::Round($size, 2)
    Write-Host "[OK] $Name.zip criado ($sizeRounded KB)" -ForegroundColor Green
}

# Arquivos comuns
$commonFiles = @(
    "popup.html",
    "popup.js",
    "content.js",
    "content.css",
    "background.js"
)

# Build Chrome
Create-ExtensionZip -Name "insightshare-chrome" -Files $commonFiles -ManifestFile "manifest.json"

# Build Edge
Create-ExtensionZip -Name "insightshare-edge" -Files $commonFiles -ManifestFile "manifest-edge.json"

# Build Firefox
$firefoxFiles = @(
    "popup-firefox.html",
    "popup-firefox.js",
    "content.js",
    "content.css",
    "background-firefox.js"
)
Create-ExtensionZip -Name "insightshare-firefox" -Files $firefoxFiles -ManifestFile "manifest-firefox.json"

Write-Host ""
Write-Host "[OK] Todas as extensoes foram criadas com sucesso!" -ForegroundColor Green
Write-Host "Diretorio de saida: $outputDir" -ForegroundColor Cyan
Write-Host ""
