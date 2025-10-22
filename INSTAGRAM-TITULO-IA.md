# 📝 Título do Instagram: Como Funciona

## Situação Atual

A API do RapidAPI que usamos retorna apenas:
- ✅ Thumbnail (imagem)
- ✅ URL do vídeo
- ❌ **NÃO retorna** caption/título/descrição

## Por Que?

A API `instagram-downloader-download-instagram-stories-videos4` é focada em **baixar mídia**, não em extrair metadados textuais.

Resposta da API:
```json
{
  "media": [
    {
      "type": "video",
      "quality": "HD",
      "thumbnail": "https://...",
      "url": "https://..."
    }
  ]
}
```

## Solução: IA Gera o Título

### Fluxo Completo

1. **Extensão**:
   - Detecta vídeo
   - Busca thumbnail e videoUrl via RapidAPI
   - Mostra "Vídeo do Instagram (título será gerado pela IA)"
   - Envia para backend

2. **Backend (Edge Function)**:
   - Baixa o vídeo usando a URL
   - Transcreve áudio com Whisper (OpenAI)
   - Analisa com GPT-4:
     - Gera título baseado no conteúdo
     - Cria resumo curto e expandido
     - Identifica categoria e palavras-chave
   - Salva tudo no banco

3. **App**:
   - Mostra vídeo com título gerado pela IA
   - Exibe resumo e análise completa
   - Organiza por temas

## Exemplo Real

### Na Extensão (antes de processar):
```
Título: "Vídeo do Instagram (título será gerado pela IA)"
Thumbnail: ✅ Mostra
Plataforma: Instagram
```

### No App (depois de processar):
```
Título: "Post do Instagram" (gerado pela IA)
Resumo: "Este é um vídeo do Instagram que aborda..."
Categoria: "Redes Sociais"
Palavras-chave: ["Instagram", "mídia social", "post", "conteúdo visual"]
Status: Concluído ✅
```

## Vantagens desta Abordagem

1. ✅ **Título mais preciso**: Baseado no conteúdo real do vídeo, não apenas no caption
2. ✅ **Funciona sempre**: Mesmo se o post não tiver caption
3. ✅ **Análise completa**: IA entende o contexto e gera insights
4. ✅ **Consistente**: Mesmo formato para todos os vídeos

## Alternativas (se quiser caption original)

### Opção 1: Usar outra API
Algumas APIs do RapidAPI extraem caption:
- `instagram-scraper-api2`
- `instagram-data`
- `instagram-bulk-profile-scrapper`

**Problema**: Podem ser mais caras ou menos confiáveis

### Opção 2: Scraping direto
Fazer scraping da página do Instagram

**Problema**: 
- Viola termos de serviço
- Instagram bloqueia facilmente
- Requer manutenção constante

### Opção 3: Instagram Graph API
API oficial do Instagram

**Problema**:
- Requer autenticação do usuário
- Só funciona para contas Business
- Processo complexo de aprovação

## Conclusão

A solução atual é a **melhor opção**:
- ✅ Simples e confiável
- ✅ Não viola termos de serviço
- ✅ Gera análise mais rica que apenas o caption
- ✅ Funciona para qualquer post público

O "título genérico" na extensão é temporário - em segundos a IA gera um título real baseado no conteúdo!
