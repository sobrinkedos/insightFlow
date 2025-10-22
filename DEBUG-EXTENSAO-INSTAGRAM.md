# 🔍 Debug: Extensão Instagram

## Como Abrir o Console do Popup

1. Clique na extensão para abrir o popup
2. **Clique com botão direito** no popup
3. Selecione **"Inspecionar"** ou **"Inspect"**
4. Vá para a aba **"Console"**

## Logs Esperados (Sucesso)

Quando tudo funciona corretamente, você deve ver:

```
📱 Instagram detectado. URL da aba: https://www.instagram.com/p/CxLWFNksXOE/
✅ URL limpa extraída: https://www.instagram.com/p/CxLWFNksXOE/
🔍 Buscando informações via RapidAPI...
📡 Buscando informações do Instagram via RapidAPI: https://www.instagram.com/p/CxLWFNksXOE/
📡 API Host: instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com
📡 API Key configurada: Sim
📡 URL da API: https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=...
📊 Status da resposta: 200 OK
✅ Dados completos do RapidAPI: {...}
📦 Encontrados X itens de mídia
✅ Thumbnail do campo thumbnail: https://...
✅ Título encontrado: ...
📤 Retornando: {title: "...", thumbnail: "...", platform: "Instagram"}
✅ Informações obtidas da API com sucesso!
```

## Logs de Erro Comuns

### 1. URL Inválida

```
📱 Instagram detectado. URL da aba: https://www.instagram.com/
⚠️ URL do Instagram inválida: https://www.instagram.com/
⚠️ Certifique-se de estar em um post específico (/p/, /reel/ ou /tv/)
```

**Solução**: Abra um post específico, não a página inicial.

### 2. API Retorna Erro

```
📊 Status da resposta: 403 Forbidden
⚠️ RapidAPI retornou erro: 403 ...
```

**Possíveis causas**:
- API Key inválida
- Limite de requisições excedido
- Problema com o serviço RapidAPI

### 3. API Não Retorna Mídia

```
✅ Dados completos do RapidAPI: {error: "..."}
⚠️ Nenhuma mídia encontrada na resposta
⚠️ API não retornou thumbnail, usando fallback
```

**Possíveis causas**:
- Post privado
- Post deletado
- API não conseguiu acessar o conteúdo

## Teste Passo a Passo

### Passo 1: Verificar URL da Aba

No console do popup, execute:

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log('URL da aba:', tabs[0].url);
});
```

**Resultado esperado**: URL completa do post

### Passo 2: Testar Regex

No console do popup, execute:

```javascript
const url = 'https://www.instagram.com/p/CxLWFNksXOE/?igsh=MWc3b3ZkbHoxa2YyOQ==';
const match = url.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/);
console.log('Match:', match ? match[1] : 'NENHUM');
```

**Resultado esperado**: `https://www.instagram.com/p/CxLWFNksXOE`

### Passo 3: Testar API Manualmente

No console do popup, execute:

```javascript
const url = 'https://www.instagram.com/p/CxLWFNksXOE/';
const apiUrl = `https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=${encodeURIComponent(url)}`;

fetch(apiUrl, {
  method: 'GET',
  headers: {
    'x-rapidapi-host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
    'x-rapidapi-key': '5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67'
  }
})
.then(r => r.json())
.then(data => console.log('Resposta da API:', data))
.catch(err => console.error('Erro:', err));
```

**Resultado esperado**: Objeto com `media` array

## Checklist de Troubleshooting

- [ ] Extensão foi recarregada após mudanças
- [ ] Está em um post específico (não página inicial)
- [ ] URL contém `/p/`, `/reel/` ou `/tv/`
- [ ] Console do popup está aberto para ver logs
- [ ] API Key está configurada corretamente
- [ ] Não há erros de CORS no console

## Próximos Passos

Se tudo acima funcionar mas ainda não aparecer thumbnail:

1. Verifique se `data.media` existe na resposta da API
2. Verifique se `data.media[0].thumbnail` existe
3. Verifique se a URL do thumbnail é válida
4. Tente abrir a URL do thumbnail diretamente no navegador
