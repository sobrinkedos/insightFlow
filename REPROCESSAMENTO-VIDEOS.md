# Sistema de Detecção e Reprocessamento de Vídeos

## 📋 Visão Geral

Sistema implementado para detectar quando o processamento de um vídeo falhou e gerou um resumo genérico, oferecendo ao usuário a opção de reprocessar o vídeo.

## 🎯 Problema Resolvido

Às vezes o processamento de dados do vídeo não é realizado corretamente pela IA devido a:
- Falhas na captação do vídeo
- Problemas na transcrição
- Timeouts ou erros na API
- Conteúdo do vídeo inacessível

Isso resulta em resumos genéricos que não refletem o conteúdo real do vídeo.

## ✨ Funcionalidades

### 1. Detecção Automática de Resumos Genéricos

O sistema analisa automaticamente:
- **Padrões de texto genérico**: Frases típicas de falha de processamento
- **Tamanho do resumo**: Resumos muito curtos (< 150 caracteres)
- **Densidade de palavras genéricas**: Alta concentração de termos vagos
- **Qualidade da transcrição**: Transcrição ausente ou muito curta
- **Similaridade entre resumos**: Resumo curto e expandido muito similares

### 2. Alerta Visual ao Usuário

Quando um resumo genérico é detectado:
- ⚠️ **Alerta destacado** na aba "Resumo IA"
- **Explicação clara** do problema
- **Lista de motivos** que levaram à detecção
- **Botão de ação** para reprocessamento

### 3. Reprocessamento com Um Clique

O usuário pode:
- Clicar no botão "Reprocessar Vídeo"
- O sistema limpa os dados antigos
- Coloca o vídeo na fila de processamento
- Atualiza automaticamente a página após conclusão

## 📁 Arquivos Criados

### 1. `src/lib/generic-summary-detector.ts`
Utilitário de detecção com:
- Padrões de texto genérico
- Algoritmo de análise de confiança
- Cálculo de similaridade entre textos

### 2. `src/hooks/use-video-reprocess.ts`
Hook React para:
- Gerenciar estado de reprocessamento
- Limpar dados antigos do vídeo
- Disparar fila de processamento
- Feedback ao usuário

### 3. `src/components/ui/alert.tsx`
Componente de alerta para:
- Exibir avisos ao usuário
- Suporte a variantes (default, destructive)
- Acessibilidade (role="alert")

### 4. Atualização em `src/pages/video-detail.tsx`
- Integração da detecção automática
- Exibição do alerta quando necessário
- Botão de reprocessamento

## 🔍 Como Funciona

### Fluxo de Detecção

```
1. Usuário acessa página do vídeo
   ↓
2. Sistema analisa resumo e transcrição
   ↓
3. Calcula score de confiança (0-1)
   ↓
4. Se score > 0.6 → Resumo genérico detectado
   ↓
5. Exibe alerta com opção de reprocessamento
```

### Fluxo de Reprocessamento

```
1. Usuário clica em "Reprocessar Vídeo"
   ↓
2. Sistema limpa dados antigos (resumos, transcrição, etc)
   ↓
3. Atualiza status para "Pendente"
   ↓
4. Dispara edge function de fila
   ↓
5. Aguarda 2 segundos e recarrega página
   ↓
6. Vídeo será reprocessado pelo cron job
```

## 🎨 Interface do Usuário

### Alerta de Resumo Genérico

```
┌─────────────────────────────────────────────┐
│ ⚠️ Resumo Genérico Detectado                │
│                                             │
│ As informações deste vídeo não foram        │
│ analisadas corretamente pela IA.            │
│                                             │
│ Motivos:                                    │
│ • Contém frases genéricas típicas           │
│ • Resumo muito curto                        │
│ • Transcrição ausente ou muito curta        │
│                                             │
│ [🔄 Reprocessar Vídeo]                      │
└─────────────────────────────────────────────┘
```

## 🔧 Configuração

### Padrões de Detecção

Os padrões podem ser ajustados em `generic-summary-detector.ts`:

```typescript
const GENERIC_PATTERNS = [
  /oferece dicas valiosas para otimizar seu perfil/i,
  /dicas para melhorar a presença no instagram/i,
  // Adicione mais padrões conforme necessário
];
```

### Threshold de Confiança

Ajuste o limite de detecção:

```typescript
const isGeneric = confidence > 0.6; // Padrão: 60%
```

## 📊 Métricas de Detecção

| Critério | Peso | Descrição |
|----------|------|-----------|
| Padrões genéricos | 0.3 | Frases típicas de falha |
| Tamanho do resumo | 0.2 | Menos de 150 caracteres |
| Densidade de palavras | 0.3 | > 15% de palavras genéricas |
| Transcrição | 0.4 | Ausente ou < 100 caracteres |
| Similaridade | 0.2 | Resumos muito similares |

**Score máximo**: 1.0  
**Threshold**: 0.6 (60%)

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Detecção mais sofisticada**
   - Usar ML para classificação
   - Análise de sentimento
   - Comparação com banco de resumos conhecidos

2. **Feedback do usuário**
   - Permitir marcar manualmente como genérico
   - Coletar feedback sobre qualidade
   - Treinar modelo com dados reais

3. **Reprocessamento inteligente**
   - Tentar APIs alternativas
   - Ajustar parâmetros de processamento
   - Notificar quando concluído

4. **Dashboard de qualidade**
   - Estatísticas de resumos genéricos
   - Taxa de sucesso de reprocessamento
   - Identificar padrões de falha

## 🧪 Testes

### Testar Detecção

1. Acesse um vídeo com resumo genérico
2. Verifique se o alerta aparece
3. Confirme que os motivos são listados

### Testar Reprocessamento

1. Clique em "Reprocessar Vídeo"
2. Verifique toast de sucesso
3. Aguarde reload automático
4. Confirme que status mudou para "Pendente"

## 📝 Notas Técnicas

- **Performance**: Detecção é instantânea (< 1ms)
- **Compatibilidade**: Funciona com todos os tipos de vídeo
- **Segurança**: Apenas o dono do vídeo pode reprocessar
- **Rate limiting**: Considere adicionar limite de reprocessamentos

## 🐛 Troubleshooting

### Alerta não aparece
- Verifique se o resumo realmente é genérico
- Ajuste o threshold de confiança
- Adicione mais padrões de detecção

### Reprocessamento não funciona
- Verifique logs da edge function
- Confirme que o cron job está ativo
- Verifique permissões do usuário

### Página não recarrega
- Verifique console do navegador
- Confirme que não há erros de rede
- Teste manualmente o reload
