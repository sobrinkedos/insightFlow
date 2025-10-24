# 🎯 Deploy: Melhoria de Títulos do Instagram

## 📋 O que foi alterado

Melhoramos a geração de títulos para vídeos do Instagram para evitar títulos genéricos como "Post do Instagram".

### Alterações nos arquivos:

1. **ai-prompts.ts** - Adicionadas regras críticas para geração de títulos
2. **index.ts** - Lógica para melhorar títulos genéricos automaticamente

## 🚀 Como fazer o deploy via Dashboard

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions

2. Clique em **process-video**

3. Clique em **Edit function**

4. **Arquivo 1: ai-prompts.ts**
   - Clique em "Add file" ou edite o arquivo existente
   - Cole o conteúdo de `supabase/functions/process-video/ai-prompts.ts`

5. **Arquivo 2: index.ts**
   - Edite o arquivo principal
   - Cole o conteúdo de `supabase/functions/process-video/index.ts`

6. **Arquivo 3: instagram-api.ts**
   - Mantenha como está (não foi alterado)

7. Clique em **Deploy**

### Opção 2: Via CLI do Supabase

```bash
# Se tiver Supabase CLI instalado
supabase functions deploy process-video
```

## ✨ Melhorias Implementadas

### 1. Prompt do GPT Melhorado

**Antes:**
```
2. **title**: Título descritivo do vídeo
```

**Depois:**
```
2. **title**: Título descritivo e atraente do vídeo (NUNCA use "Post do Instagram" ou títulos genéricos)

**REGRAS CRÍTICAS PARA O TÍTULO:**
- NUNCA use "Post do Instagram", "Vídeo do Instagram" ou títulos genéricos
- SEMPRE crie um título específico baseado no conteúdo
- Se a transcrição for curta, use as palavras-chave disponíveis
- O título deve ter entre 5 e 15 palavras
- Exemplos BONS: "Receita de Bolo de Chocolate Fofinho", "Como Configurar WhatsApp Business"
- Exemplos RUINS: "Post do Instagram", "Vídeo", "Conteúdo do Instagram"
```

### 2. Contexto Melhorado para Instagram

Quando o vídeo tem pouca informação, enviamos instruções especiais ao GPT:

```typescript
INSTRUÇÕES ESPECIAIS PARA O TÍTULO:
- NUNCA use "Post do Instagram" ou títulos genéricos
- Analise as palavras disponíveis e crie um título específico
- Se houver palavras-chave identificáveis, use-as no título
- Seja criativo mas honesto sobre o conteúdo
- Exemplo: se menciona "receita" ou "comida", use "Receita de [ingrediente]"
- Exemplo: se menciona "dica" ou "tutorial", use "Como [ação]"
```

### 3. Fallback Inteligente

Se o GPT ainda retornar um título genérico, o código automaticamente melhora usando keywords:

```typescript
// Check if title is generic and try to improve it
const genericTitles = ['Post do Instagram', 'Vídeo do Instagram', 'Conteúdo do Instagram', 'Instagram', 'Vídeo'];
const isGenericTitle = genericTitles.some(generic => 
  finalTitle.toLowerCase().includes(generic.toLowerCase())
);

if (isGenericTitle && analysis.keywords && analysis.keywords.length > 0) {
  // Create title from keywords and category
  const mainKeywords = analysis.keywords.slice(0, 3).join(', ');
  if (analysis.category) {
    finalTitle = `${analysis.category}: ${mainKeywords}`;
  } else {
    finalTitle = mainKeywords;
  }
  console.log(`📝 Improved generic title to: ${finalTitle}`);
}
```

## 📊 Exemplos de Melhoria

### Antes:
- ❌ "Post do Instagram"
- ❌ "Vídeo do Instagram"
- ❌ "Conteúdo do Instagram"

### Depois:
- ✅ "Receita de Bolo de Chocolate Fofinho"
- ✅ "Como Configurar WhatsApp Business"
- ✅ "Dicas para Aumentar Vendas Online"
- ✅ "Culinária: frango, tempero, receita" (quando há poucas informações)

## 🧪 Como Testar

1. Compartilhe um vídeo do Instagram
2. Aguarde o processamento
3. Verifique se o título é específico e descritivo
4. Se ainda aparecer título genérico, verifique os logs:
   - Dashboard > Edge Functions > process-video > Logs
   - Procure por "📝 Improved generic title to:"

## 🔍 Troubleshooting

### Título ainda genérico?

**Verificar:**
1. O vídeo tem transcrição ou descrição?
2. O GPT conseguiu extrair keywords?
3. Logs mostram algum erro?

**Query para verificar:**
```sql
SELECT 
  id,
  title,
  keywords,
  transcription,
  LENGTH(transcription) as transcription_length
FROM videos
WHERE url LIKE '%instagram.com%'
AND title LIKE '%Post do Instagram%'
ORDER BY created_at DESC
LIMIT 10;
```

### Forçar reprocessamento

Se um vídeo já foi processado com título genérico:

```sql
-- Resetar status para reprocessar
UPDATE videos 
SET status = 'Processando', 
    processed_at = NULL
WHERE id = 'video-id-aqui';

-- Adicionar à fila
INSERT INTO video_queue (video_id, user_id, status)
SELECT id, user_id, 'pending'
FROM videos
WHERE id = 'video-id-aqui';
```

## ✅ Checklist de Deploy

- [ ] Arquivo ai-prompts.ts atualizado
- [ ] Arquivo index.ts atualizado
- [ ] Deploy realizado com sucesso
- [ ] Versão da função incrementada
- [ ] Teste com novo vídeo do Instagram
- [ ] Título específico gerado
- [ ] Logs verificados

## 📈 Impacto Esperado

- **Antes**: ~30% dos vídeos do Instagram com títulos genéricos
- **Depois**: <5% com títulos genéricos (apenas quando realmente não há informação)

## 🎉 Resultado

Agora os vídeos do Instagram terão títulos muito mais descritivos e úteis, melhorando a experiência do usuário e facilitando a busca e organização dos conteúdos!
