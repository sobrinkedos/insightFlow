# Script para criar pacotes de extensao atualizados
# Gera arquivos ZIP para Chrome, Edge e Firefox

Write-Host "Construindo pacotes de extensao..." -ForegroundColor Cyan
Write-Host ""

# Cria pasta de saida se nao existir
$outputDir = "public/downloads"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Remove arquivos antigos
Write-Host "Removendo pacotes antigos..." -ForegroundColor Yellow
Remove-Item "$outputDir/*.zip" -ErrorAction SilentlyContinue

# Arquivos comuns para todas as extensoes
$commonFiles = @(
    "background.js",
    "content.js",
    "content.css",
    "popup.html",
    "popup.js",
    "config.js",
    "icon16.png",
    "icon32.png",
    "icon48.png",
    "icon128.png"
)

# Funcao para criar ZIP
function Create-ExtensionZip {
    param(
        [string]$Browser,
        [string]$ManifestFile,
        [string[]]$AdditionalFiles = @()
    )
    
    Write-Host "Criando pacote para $Browser..." -ForegroundColor Green
    
    $zipName = "insightshare-$($Browser.ToLower()).zip"
    $zipPath = Join-Path $outputDir $zipName
    $tempDir = "temp_$Browser"
    
    # Cria diretorio temporario
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Cria pasta icons
    $iconsDir = Join-Path $tempDir "icons"
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
    
    # Copia arquivos comuns
    foreach ($file in $commonFiles) {
        $sourcePath = Join-Path "browser-extension" $file
        if (Test-Path $sourcePath) {
            # Se for icone, copia para pasta icons/
            if ($file -like "icon*.png") {
                Copy-Item $sourcePath -Destination $iconsDir
            } else {
                Copy-Item $sourcePath -Destination $tempDir
            }
        } else {
            Write-Host "  Aviso: Arquivo nao encontrado: $file" -ForegroundColor Yellow
        }
    }
    
    # Copia manifest especifico
    $manifestSource = Join-Path "browser-extension" $ManifestFile
    if (Test-Path $manifestSource) {
        Copy-Item $manifestSource -Destination (Join-Path $tempDir "manifest.json")
    } else {
        Write-Host "  Erro: Manifest nao encontrado: $ManifestFile" -ForegroundColor Red
        return
    }
    
    # Copia arquivos adicionais especificos do browser
    foreach ($file in $AdditionalFiles) {
        $sourcePath = Join-Path "browser-extension" $file
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath -Destination $tempDir
        }
    }
    
    # Cria ZIP
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
    
    # Remove diretorio temporario
    Remove-Item $tempDir -Recurse -Force
    
    # Mostra tamanho do arquivo
    $fileSize = (Get-Item $zipPath).Length / 1KB
    Write-Host "  OK: $zipName criado ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
}

# Cria pacote para Chrome
Create-ExtensionZip -Browser "chrome" -ManifestFile "manifest.json"

# Cria pacote para Edge
Create-ExtensionZip -Browser "edge" -ManifestFile "manifest-edge.json"

# Cria pacote para Firefox
Create-ExtensionZip -Browser "firefox" -ManifestFile "manifest-firefox.json" -AdditionalFiles @(
    "background-firefox.js",
    "popup-firefox.html",
    "popup-firefox.js"
)

Write-Host ""
Write-Host "Todos os pacotes foram criados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos gerados em: $outputDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Commit e push dos arquivos atualizados" -ForegroundColor White
Write-Host "2. Deploy no Vercel para disponibilizar os downloads" -ForegroundColor White
Write-Host ""
