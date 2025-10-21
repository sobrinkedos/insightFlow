# Como Atualizar a Extensão InsightShare

## 🔄 Após Fazer Mudanças no Código

Sempre que você modificar arquivos da extensão (`content.js`, `popup.js`, `manifest.json`, etc.), é necessário recarregar a extensão no navegador.

## 📋 Passo a Passo

### Google Chrome / Microsoft Edge

1. **Abrir Gerenciador de Extensões**
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Ou: Menu (⋮) → Extensões → Gerenciar extensões

2. **Ativar Modo Desenvolvedor**
   - Toggle no canto superior direito: "Modo do desenvolvedor"

3. **Recarregar a Extensão**
   - Clique no botão 🔄 "Recarregar" na card da extensão InsightShare
   - Ou: Remova e adicione novamente a pasta

4. **Verificar Atualização**
   - Abra uma nova aba do Instagram
   - Pressione F5 para recarregar a página
   - O botão 🎬 deve aparecer

### Mozilla Firefox

1. **Abrir Depuração de Extensões**
   - Digite: `about:debugging#/runtime/this-firefox`

2. **Recarregar Extensão**
   - Encontre "InsightShare" na lista
   - Clique em "Recarregar"

3. **Verificar Atualização**
   - Abra uma nova aba do Instagram
   - Pressione F5 para recarregar a página
   - O botão 🎬 deve aparecer

## 🐛 Troubleshooting

### Problema: Mudanças não aparecem

**Solução 1: Hard Reload**
```
1. Recarregue a extensão (passo acima)
2. Feche TODAS as abas do Instagram
3. Abra uma nova aba do Instagram
4. Pressione Ctrl+Shift+R (hard reload)
```

**Solução 2: Limpar Cache**
```
1. Abra DevTools (F12)
2. Clique com botão direito no ícone de reload
3. Selecione "Limpar cache e recarregar"
```

**Solução 3: Reinstalar Extensão**
```
1. Remova a extensão completamente
2. Feche o navegador
3. Abra o navegador novamente
4. Instale a extensão novamente
```

### Problema: Botão não aparece no Instagram

**Verificações:**
1. ✅ Extensão está ativada?
2. ✅ Extensão foi recarregada?
3. ✅ Página do Instagram foi recarregada?
4. ✅ Está em um Reel/Post (não no feed)?

**Console de Debug:**
```javascript
// Abra DevTools (F12) e cole no Console:
console.log('Botão existe?', !!document.getElementById('insightshare-btn'));
console.log('URL atual:', window.location.href);
```

### Problema: Erro ao compartilhar

**Verificar Configuração:**
1. Clique no ícone da extensão
2. Verifique se a URL da API está correta
3. Verifique se a chave de API está configurada

**Testar Manualmente:**
```javascript
// No Console do DevTools:
chrome.runtime.sendMessage({action: 'getVideoInfo'}, (response) => {
  console.log('Video Info:', response);
});
```

## 📝 Checklist de Atualização

Após fazer mudanças, siga esta checklist:

- [ ] Salvar todos os arquivos modificados
- [ ] Recarregar extensão no navegador
- [ ] Fechar todas as abas do Instagram
- [ ] Abrir nova aba do Instagram
- [ ] Recarregar página (F5 ou Ctrl+Shift+R)
- [ ] Verificar se botão 🎬 aparece
- [ ] Testar compartilhamento de um vídeo
- [ ] Verificar se vídeo aparece no InsightShare

## 🔍 Debug Avançado

### Ver Logs da Extensão

**Background Script:**
```
1. Vá para chrome://extensions/
2. Clique em "Inspecionar visualizações" → "service worker"
3. Veja logs no Console
```

**Content Script:**
```
1. Abra a página do Instagram
2. Pressione F12 (DevTools)
3. Vá para aba "Console"
4. Veja logs do content.js
```

### Verificar Permissões

No `manifest.json`, certifique-se que tem:
```json
{
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://www.instagram.com/*",
    "https://instagram.com/*"
  ]
}
```

## 🚀 Dicas de Desenvolvimento

### 1. Auto-reload (Opcional)
Instale uma extensão de auto-reload para desenvolvimento:
- Chrome: "Extensions Reloader"
- Firefox: "web-ext" CLI tool

### 2. Logs Úteis
Adicione logs no código para debug:
```javascript
console.log('[InsightShare] Botão adicionado');
console.log('[InsightShare] Video Info:', videoInfo);
```

### 3. Teste em Modo Anônimo
Teste a extensão em modo anônimo para garantir que funciona sem cache.

## 📞 Ainda com Problemas?

Se após seguir todos os passos a extensão ainda não funcionar:

1. **Verifique o Console** (F12) por erros JavaScript
2. **Verifique as Permissões** no manifest.json
3. **Teste em outro navegador** para isolar o problema
4. **Reinstale do zero** removendo completamente a extensão

## 🎯 Teste Rápido

Execute este teste para verificar se tudo está funcionando:

1. Abra: https://www.instagram.com/reel/DPwSPPPEVxw/
2. Aguarde carregar completamente
3. Procure o botão 🎬 no canto inferior direito
4. Clique no botão
5. Deve abrir o InsightShare com o vídeo

Se funcionar, a extensão está atualizada corretamente! ✅
