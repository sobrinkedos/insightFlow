# Checklist de Teste da Extensao

## Pre-requisitos
- [ ] Extensao instalada no Chrome
- [ ] App rodando em http://localhost:5174
- [ ] Usuario logado no app

## Teste 1: Recarregar Extensao
- [ ] Abrir chrome://extensions/
- [ ] Ativar "Modo do desenvolvedor"
- [ ] Localizar "InsightShare - Compartilhar Vídeos"
- [ ] Clicar em "Recarregar"
- [ ] Verificar se nao ha erros

## Teste 2: YouTube (Controle)
- [ ] Abrir um video do YouTube
- [ ] Clicar na extensao
- [ ] Verificar se mostra thumbnail
- [ ] Verificar se mostra titulo
- [ ] Compartilhar video
- [ ] Verificar se aparece no app
- [ ] Verificar se processa corretamente

## Teste 3: Instagram - Extensao
- [ ] Abrir um reel do Instagram
- [ ] Aguardar pagina carregar completamente
- [ ] Verificar URL completa na barra
- [ ] Clicar na extensao
- [ ] Verificar se mostra dados do video
- [ ] Se nao, clicar em "Recarregar Informacoes"
- [ ] Compartilhar video
- [ ] Verificar no app

## Teste 4: Instagram - Modal do App
- [ ] Abrir um reel do Instagram
- [ ] Copiar URL (Ctrl+C)
- [ ] Abrir app
- [ ] Clicar em "+ Compartilhar Video"
- [ ] Colar URL
- [ ] Clicar em "Compartilhar"
- [ ] Verificar se aparece na lista
- [ ] Verificar se processa

## Teste 5: Verificar Logs
- [ ] Clicar com botao direito no icone da extensao
- [ ] Selecionar "Inspecionar popup"
- [ ] Ir para aba Console
- [ ] Compartilhar um video
- [ ] Verificar logs:
  - [ ] "Instagram info capturada"
  - [ ] "Compartilhando video"
  - [ ] "Video inserido"
  - [ ] "Processamento iniciado"

## Teste 6: Verificar Banco
- [ ] Abrir Supabase SQL Editor
- [ ] Executar query:
```sql
SELECT id, url, title, status, created_at 
FROM videos 
WHERE url LIKE '%instagram%'
ORDER BY created_at DESC 
LIMIT 5;
```
- [ ] Verificar se URLs estao completas
- [ ] Verificar se titulos foram capturados
- [ ] Verificar status (Processando -> Concluido)

## Teste 7: Diferentes Tipos de Conteudo
- [ ] Reel do Instagram
- [ ] Post com video do Instagram
- [ ] IGTV
- [ ] Video do TikTok
- [ ] Video do Vimeo

## Resultados Esperados

### YouTube
- Thumbnail: Sim
- Titulo: Sim
- Processamento: Rapido (5-10s)
- Taxa de sucesso: 95%+

### Instagram (Extensao)
- Thumbnail: Talvez
- Titulo: Talvez
- Processamento: Normal (10-30s)
- Taxa de sucesso: 60-70%

### Instagram (Modal)
- Thumbnail: Sim (via API)
- Titulo: Sim (via API)
- Processamento: Normal (10-30s)
- Taxa de sucesso: 95%+

## Problemas Conhecidos

### Extensao nao mostra dados do Instagram
**Normal:** Instagram dificulta scraping
**Solucao:** Usar modal do app

### Video fica "Processando"
**Causa:** Edge Function pode ter falhado
**Solucao:** Marcar como Pendente e reprocessar

### URL incompleta
**Causa:** Nao esta em post/reel especifico
**Solucao:** Navegar para URL completa

## Conclusao

- [ ] Extensao funciona com YouTube
- [ ] Extensao funciona com Instagram (parcialmente)
- [ ] Modal do app funciona com Instagram
- [ ] Logs estao aparecendo
- [ ] Videos processam corretamente
- [ ] Pronto para uso!

## Notas

Data do teste: ___________
Problemas encontrados: ___________
Observacoes: ___________
