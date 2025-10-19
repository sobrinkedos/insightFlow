# Log de Deploy - Suporte ao Instagram

**Data**: 18/10/2025
**Projeto**: insightFlow (enkpfnqsjjnanlqhjnsv)

## ✅ Deploy Realizado

### Edge Function: process-video
- **Versão anterior**: 16
- **Versão nova**: 17
- **Status**: ✅ ATIVO

### Mudanças Principais

1. **Função `extractVideoId`**
   - Agora retorna `{ id: string, platform: string }`
   - Suporta YouTube e Instagram
   - Detecta formatos: `/p/`, `/reel/`, `/tv/`

2. **Função `getVideoInfo`**
   - Aceita parâmetro `platform`
   - YouTube: usa YouTube Data API v3
   - Instagram: usa Facebook Graph API oEmbed
   - Fallback genérico para ambos

3. **Processamento Principal**
   - Identifica plataforma automaticamente
   - Mensagens de erro mais descritivas
   - Suporte completo ao Instagram

## 🧪 Como Testar

1. Acesse o app InsightFlow
2. Clique em "Compartilhar Vídeo"
3. Cole uma URL do Instagram:
   - `https://www.instagram.com/p/ABC123/`
   - `https://www.instagram.com/reel/XYZ789/`
4. Clique em "Adicionar à Fila"
5. O vídeo deve ser processado com sucesso

## 📝 Próximos Passos

- [ ] Configurar `INSTAGRAM_ACCESS_TOKEN` para melhor qualidade
- [ ] Adicionar suporte a TikTok
- [ ] Implementar transcrição de áudio real
- [ ] Adicionar suporte a Vimeo e Dailymotion

## 🔗 Documentação

Ver `INSTAGRAM-SUPPORT.md` para detalhes completos.
