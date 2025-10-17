# 🌐 Instalação no Microsoft Edge

## Pré-requisitos

- Microsoft Edge versão 88 ou superior
- Ícones criados (veja `create-icons.html`)

## Passo 1: Preparar a Extensão

1. Certifique-se de que todos os ícones estão na pasta `icons/`
2. Renomeie `manifest-edge.json` para `manifest.json`:
   ```cmd
   cd browser-extension
   copy manifest-edge.json manifest.json
   ```

## Passo 2: Instalar no Edge

1. Abra o Microsoft Edge
2. Digite na barra de endereços: `edge://extensions/`
3. Ative o **"Modo de desenvolvedor"** no canto inferior esquerdo
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta `browser-extension`
6. A extensão será instalada!

## Passo 3: Fixar na Barra de Ferramentas

1. Clique no ícone de extensões (🧩) na barra de ferramentas
2. Encontre "InsightShare - Compartilhar Vídeos"
3. Clique no ícone de alfinete para fixar

## Passo 4: Configurar

1. Clique no ícone da extensão InsightShare
2. Configure:
   - **URL da API**: `https://enkpfnqsjjnanlqhjnsv.supabase.co`
   - **Chave de API**: Cole sua chave anon do Supabase
3. As configurações são salvas automaticamente

## Passo 5: Testar

1. Vá para um vídeo no YouTube: https://youtube.com
2. Você verá um botão flutuante 🎬 no canto inferior direito
3. Clique no botão ou no ícone da extensão
4. Clique em "Compartilhar Vídeo"
5. Pronto! O vídeo será processado pelo InsightShare

## 🎉 Recursos Exclusivos do Edge

- Sincronização de configurações entre dispositivos
- Integração com Microsoft Account
- Melhor desempenho em Windows 11

## 🔧 Solução de Problemas

### Extensão não aparece
- Verifique se o modo de desenvolvedor está ativado
- Recarregue a extensão em `edge://extensions/`

### Botão flutuante não aparece
- Atualize a página do vídeo
- Verifique se a URL está nas plataformas suportadas

### Erro ao compartilhar
- Verifique se a chave de API está correta
- Certifique-se de estar logado no InsightShare

## 📝 Notas

- A extensão funciona offline para configurações
- Requer conexão para compartilhar vídeos
- Compatível com Edge no Windows, Mac e Linux
