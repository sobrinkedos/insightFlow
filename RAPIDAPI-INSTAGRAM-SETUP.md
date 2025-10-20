# Configuração da RapidAPI para Instagram

## ✅ Configuração Concluída

A integração com a RapidAPI para processar vídeos do Instagram foi configurada com sucesso!

## 📋 O que foi feito

### 1. Variáveis de Ambiente (.env)
Adicionadas as credenciais da RapidAPI:
```env
RAPIDAPI_KEY="5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67"
RAPIDAPI_HOST="instagram120.p.rapidapi.com"
```

### 2. Módulo Instagram API
Criado o arquivo `supabase/functions/process-video/instagram-api.ts` com:
- Classe `InstagramAPI` para gerenciar chamadas à API
- Método `getUserPosts()` para buscar posts de um usuário
- Método `getPostInfo()` para obter informações de um post específico
- Fallback para oEmbed API quando necessário
- Tratamento de erros robusto

### 3. Integração na Função Principal
Atualizado `supabase/functions/process-video/index.ts` para:
- Importar e usar o módulo `instagram-api.ts`
- Processar URLs do Instagram usando a RapidAPI
- Manter fallback para casos onde a API não retorna dados

## 🚀 Como Usar

### URLs Suportadas
A função agora processa automaticamente URLs do Instagram nos formatos:
- `https://www.instagram.com/p/POST_ID/`
- `https://www.instagram.com/reel/POST_ID/`
- `https://www.instagram.com/tv/POST_ID/`

### Fluxo de Processamento
1. Usuário adiciona URL do Instagram no app
2. Sistema extrai o ID do post
3. RapidAPI busca informações do post
4. OpenAI analisa o conteúdo
5. Vídeo é categorizado e adicionado aos temas

## 🔧 Configuração no Supabase

Para que a função funcione em produção, você precisa adicionar as variáveis de ambiente no Supabase:

### Via Dashboard:
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/settings/functions
2. Vá em "Edge Functions" > "Secrets"
3. Adicione:
   - `RAPIDAPI_KEY` = `5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67`
   - `RAPIDAPI_HOST` = `instagram120.p.rapidapi.com`

### Via CLI:
```bash
# Configurar RAPIDAPI_KEY
supabase secrets set RAPIDAPI_KEY=5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67

# Configurar RAPIDAPI_HOST
supabase secrets set RAPIDAPI_HOST=instagram120.p.rapidapi.com
```

## 📊 Exemplo de Uso da API

### Buscar Posts de um Usuário
```bash
curl --request POST \
  --url https://instagram120.p.rapidapi.com/api/instagram/posts \
  --header 'Content-Type: application/json' \
  --header 'x-rapidapi-host: instagram120.p.rapidapi.com' \
  --header 'x-rapidapi-key: 5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67' \
  --data '{"username":"keke","maxId":""}'
```

### Resposta Esperada
```json
{
  "data": {
    "items": [
      {
        "id": "...",
        "code": "...",
        "caption": "...",
        "media_type": "video",
        "video_url": "...",
        "thumbnail_url": "...",
        "like_count": 123,
        "comments_count": 45
      }
    ]
  }
}
```

## 🔍 Limitações e Fallbacks

### Limitações da API
- A API pode ter rate limits dependendo do plano RapidAPI
- Alguns posts privados podem não ser acessíveis
- A API pode não retornar URLs diretas de vídeo

### Sistema de Fallback
Se a RapidAPI falhar, o sistema usa:
1. **oEmbed API** do Facebook (pública, sem autenticação)
2. **Informações genéricas** com o ID do post

Isso garante que o processamento nunca falhe completamente.

## 📝 Próximos Passos

### Melhorias Futuras
1. **Cache de Respostas**: Implementar cache para reduzir chamadas à API
2. **Download de Vídeo**: Adicionar suporte para baixar e transcrever vídeos do Instagram
3. **Análise de Imagens**: Usar GPT-4 Vision para analisar posts com imagens
4. **Métricas**: Salvar likes, comentários e outras métricas do post

### Monitoramento
- Verificar logs da função: `supabase functions logs process-video`
- Monitorar uso da RapidAPI no dashboard: https://rapidapi.com/developer/billing
- Acompanhar rate limits e quotas

## 🆘 Troubleshooting

### Erro: "RAPIDAPI_KEY not configured"
- Verifique se as variáveis estão no `.env` local
- Confirme que os secrets estão configurados no Supabase

### Erro: "Instagram API returned 401"
- Verifique se a chave da API está correta
- Confirme que a assinatura da RapidAPI está ativa

### Erro: "Could not parse Instagram URL"
- Verifique se a URL está no formato correto
- Teste com: `https://www.instagram.com/p/POST_ID/`

## 📚 Recursos

- [RapidAPI Instagram120 Docs](https://rapidapi.com/maatootz/api/instagram120)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Instagram oEmbed API](https://developers.facebook.com/docs/instagram/oembed)

---

**Status**: ✅ Configuração completa e pronta para uso!
