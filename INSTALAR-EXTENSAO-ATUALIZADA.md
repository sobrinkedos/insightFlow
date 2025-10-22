# Como Instalar/Atualizar a Extensao

## Opcao 1: Atualizar Extensao Existente

Se voce ja tem a extensao instalada:

1. Abra `chrome://extensions/`
2. Localize "InsightShare - Compartilhar Videos"
3. Clique no botao **"Recarregar"** (icone de seta circular)
4. Pronto! As alteracoes foram aplicadas

## Opcao 2: Instalar do Zero

Se ainda nao tem a extensao:

### Passo 1: Preparar Arquivos

1. Certifique-se que a pasta `browser-extension` existe
2. Verifique se contem os arquivos:
   - manifest.json
   - popup.html
   - popup.js
   - content.js
   - content.css
   - config.js
   - background.js
   - icon16.png, icon32.png, icon48.png, icon128.png

### Passo 2: Instalar no Chrome

1. Abra o Chrome
2. Digite na barra: `chrome://extensions/`
3. Ative o **"Modo do desenvolvedor"** (canto superior direito)
4. Clique em **"Carregar sem compactacao"**
5. Selecione a pasta `browser-extension`
6. Clique em "Selecionar pasta"

### Passo 3: Verificar Instalacao

1. Verifique se aparece "InsightShare - Compartilhar Videos"
2. Status deve ser "Ativada"
3. Icone deve aparecer na barra do navegador

### Passo 4: Fixar na Barra

1. Clique no icone de quebra-cabeca (extensoes)
2. Localize "InsightShare"
3. Clique no icone de alfinete para fixar

## Verificar se Atualizou

### Metodo 1: Verificar Botao

1. Abra um video do Instagram
2. Clique na extensao
3. Deve aparecer botao "Recarregar Informacoes"
4. Se aparecer, esta atualizada!

### Metodo 2: Verificar Logs

1. Clique com botao direito no icone da extensao
2. Selecione "Inspecionar popup"
3. Va para aba Console
4. Compartilhe um video
5. Deve aparecer logs detalhados:
   - "Instagram info capturada"
   - "Compartilhando video"
   - "Video inserido"

### Metodo 3: Verificar Codigo

1. Abra `browser-extension/content.js`
2. Procure por: "Instagram info capturada"
3. Se encontrar, esta atualizada!

## Solucao de Problemas

### Extensao nao aparece

- Verifique se "Modo do desenvolvedor" esta ativo
- Recarregue a pagina de extensoes (F5)
- Tente desinstalar e reinstalar

### Erro ao carregar

- Verifique se todos os arquivos existem
- Verifique se manifest.json esta correto
- Veja erros na pagina de extensoes

### Nao funciona no Instagram

- Normal, Instagram dificulta scraping
- Use o modal do app como alternativa
- Veja GUIA-EXTENSAO-INSTAGRAM.md

### Logs nao aparecem

- Certifique-se de estar no DevTools da extensao
- Nao no DevTools da pagina
- Clique com botao direito no icone > Inspecionar popup

## Testar Instalacao

Execute o checklist:

1. Abra CHECKLIST-TESTE-EXTENSAO.md
2. Siga todos os passos
3. Marque os itens concluidos
4. Verifique resultados

## Proximos Passos

Apos instalar/atualizar:

1. Teste com YouTube (deve funcionar perfeitamente)
2. Teste com Instagram (pode precisar do modal)
3. Verifique logs para debug
4. Use o app para melhor experiencia

## Arquivos de Ajuda

- GUIA-EXTENSAO-INSTAGRAM.md - Como usar com Instagram
- CHECKLIST-TESTE-EXTENSAO.md - Checklist de testes
- RESUMO-CORRECOES-EXTENSAO.md - O que foi corrigido
- test-extension-instagram.html - Pagina de teste

## Suporte

Se tiver problemas:

1. Verifique os logs
2. Consulte os guias
3. Use o modal do app como alternativa
4. Reporte com logs e screenshots
