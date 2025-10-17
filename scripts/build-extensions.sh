#!/bin/bash

echo "========================================"
echo " InsightShare - Build de Extensoes"
echo "========================================"
echo ""

EXTENSION_DIR="browser-extension"
OUTPUT_DIR="public/downloads"

# Criar diretório de saída
mkdir -p "$OUTPUT_DIR"

# Função para criar ZIP
create_extension_zip() {
    local name=$1
    local manifest=$2
    shift 2
    local files=("$@")
    
    echo "Criando $name.zip..."
    
    local temp_dir="/tmp/insightshare-$name"
    
    # Limpar e criar diretório temporário
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    
    # Copiar arquivos
    for file in "${files[@]}"; do
        if [ -f "$EXTENSION_DIR/$file" ]; then
            cp "$EXTENSION_DIR/$file" "$temp_dir/"
        fi
    done
    
    # Copiar manifest específico
    cp "$EXTENSION_DIR/$manifest" "$temp_dir/manifest.json"
    
    # Copiar ícones
    if [ -d "$EXTENSION_DIR/icons" ]; then
        cp -r "$EXTENSION_DIR/icons" "$temp_dir/"
    fi
    
    # Criar ZIP
    cd "$temp_dir"
    zip -r -q "$name.zip" ./*
    mv "$name.zip" "../../../$OUTPUT_DIR/"
    cd - > /dev/null
    
    # Limpar
    rm -rf "$temp_dir"
    
    local size=$(du -h "$OUTPUT_DIR/$name.zip" | cut -f1)
    echo "[OK] $name.zip criado ($size)"
}

# Arquivos comuns
common_files=(
    "popup.html"
    "popup.js"
    "content.js"
    "content.css"
    "background.js"
)

# Build Chrome
create_extension_zip "insightshare-chrome" "manifest.json" "${common_files[@]}"

# Build Edge
create_extension_zip "insightshare-edge" "manifest-edge.json" "${common_files[@]}"

# Build Firefox
firefox_files=(
    "popup-firefox.html"
    "popup-firefox.js"
    "content.js"
    "content.css"
    "background-firefox.js"
)
create_extension_zip "insightshare-firefox" "manifest-firefox.json" "${firefox_files[@]}"

echo ""
echo "[OK] Todas as extensoes foram criadas com sucesso!"
echo "Diretorio de saida: $OUTPUT_DIR"
echo ""
