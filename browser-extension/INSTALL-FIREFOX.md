# 🦊 Instalação no Mozilla Firefox

## Pré-requisitos

- Mozilla Firefox versão 109 ou superior
- Ícones criados (veja `create-icons.html`)

## Passo 1: Preparar a Extensão

1. Certifique-se de que todos os ícones estão na pasta `icons/`
2. Renomeie os arquivos para Firefox:
   ```bash
   cd browser-extension
   copy manifest-firefox.json manifest.json
   copy popup-firefox.html popup.html
   copy popup-firefox.js popup.js
   ```

## Passo 2: Instalar no Firefox (Temporário)

### Método 1: Instalação Temporária (Desenvolvimento)

1. Abra o Firefox
2. Digite na barra de endereços: `about:debugging#/runtime/this-firefox`
3. Clique em **"Carregar extensão temporária..."**
4. Navegue até a pasta `browser-extension`
5. Selecione o arquivo `manifest.json`
6. A extensão será instalada!

**Nota**: Extensões temporárias são removidas quando o Firefox é fechado.

### Método 2: Instalação Permanente (Produção)

Para uso permanente, você precisa assinar a extensão:

1. Crie uma conta em: https://addons.mozilla.org/developers/
2. Empacote a extensão:
   ```bash
   cd browser-extension
   zip -r insightshare-firefox.zip *
   ```
3. Envie o arquivo ZIP para revisão no Firefox Add-ons
4. Após aprovação, instale da loja oficial

## Passo 3: Fixar na Barra de Ferramentas

1. Clique com botão direito na barra de ferramentas
2. Selecione "Personalizar barra de ferramentas"
3. Arraste o ícone do InsightShare para a barra
4. Clique em "Concluído"

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

## 🎉 Recursos do Firefox

- Proteção de privacidade aprimorada
- Sincronização com Firefox Account
- Suporte a containers (isolar extensão por contexto)

## 🔧 Solução de Problemas

### Extensão desaparece ao reiniciar
- Isso é normal para instalações temporárias
- Use o método de instalação permanente

### Erro "browser is not defined"
- Certifique-se de usar os arquivos `-firefox` renomeados
- Verifique se o manifest.json é a versão do Firefox

### Botão flutuante não aparece
- Atualize a página do vídeo
- Verifique as permissões da extensão

### Erro ao compartilhar
- Verifique se a chave de API está correta
- Desative o Enhanced Tracking Protection para o site

## 📝 Diferenças do Firefox

- Usa API `browser` ao invés de `chrome`
- Manifest V2 (mais estável no Firefox)
- Requer ID único para sincronização

## 🔒 Permissões

A extensão solicita:
- `activeTab`: Para detectar vídeos na aba atual
- `storage`: Para salvar configurações
- `contextMenus`: Para menu de clique direito
- Acesso a sites de vídeo (YouTube, Instagram, etc.)
