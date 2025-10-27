# Guia: Migrar Estrutura para Produção

## 📋 Visão Geral

Este guia detalha como migrar toda a estrutura do banco de desenvolvimento para produção, incluindo tabelas, políticas RLS e Edge Functions.

---

## ✅ Passo 1: Aplicar Migração SQL

### Via Supabase Dashboard

1. Acesse o projeto de **Produção**: https://supabase.com/dashboard/project/jropngieefxgnufmkeaj
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New query**
4. Abra o arquivo: `supabase/migrations/20250127140000_migrate_to_production.sql`
5. Copie TODO o conteúdo
6. Cole no SQL Editor
7. Clique em **Run** (ou Ctrl+Enter)
8. Aguarde a execução (pode levar 1-2 minutos)

### Verificar Sucesso

Você deve ver mensagens como:
```
✅ Migração completa para produção concluída!
Tabelas criadas: profiles, videos, themes, theme_videos, video_progress, video_queue
```

### Verificar Tabelas Criadas

1. Vá em **Table Editor**
2. Você deve ver as tabelas:
   - profiles
   - videos
   - themes
   - theme_videos
   - video_progress
   - video_queue
   - migration_history
   - backup_history
   - resource_usage

---

## ✅ Passo 2: Migrar Edge Functions

Você precisa migrar 4 Edge Functions do desenvolvimento para produção.

### 2.1: process-video

1. Acesse desenvolvimento: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv
2. Vá em **Edge Functions**
3. Clique em **process-video**
4. Clique em **Download** ou copie o código
5. Acesse produção: https://supabase.com/dashboard/project/jropngieefxgnufmkeaj
6. Vá em **Edge Functions**
7. Clique em **Create a new function**
8. Nome: `process-video`
9. Cole o código
10. Clique em **Deploy**

### 2.2: consolidate-theme

Repita o processo acima para a função `consolidate-theme`

### 2.3: process-video-queue

Repita o processo acima para a função `process-video-queue`

### 2.4: queue-cron

Repita o processo acima para a função `queue-cron`

---

## ✅ Passo 3: Configurar Secrets

As Edge Functions precisam de secrets configurados.

### 3.1: OPENAI_API_KEY

1. No projeto de produção, vá em **Settings** > **Edge Functions**
2. Role até **Secrets**
3. Clique em **Add secret**
4. Nome: `OPENAI_API_KEY`
5. Valor: Sua chave da OpenAI
6. Clique em **Save**

### 3.2: Outros Secrets (se necessário)

Verifique no código das Edge Functions se há outros secrets necessários e adicione-os.

---

## ✅ Passo 4: Configurar Storage (se necessário)

Se sua aplicação usa Storage:

1. Vá em **Storage**
2. Crie os buckets necessários
3. Configure políticas de acesso

---

## ✅ Passo 5: Testar em Produção

### 5.1: Testar Autenticação

1. Acesse sua aplicação em produção
2. Tente fazer login/cadastro
3. Verifique se o perfil é criado automaticamente

### 5.2: Testar Funcionalidades

1. Adicionar um vídeo
2. Verificar se entra na fila
3. Verificar se é processado
4. Criar um tema
5. Adicionar vídeos ao tema

### 5.3: Verificar Logs

1. Vá em **Logs** no dashboard
2. Verifique se há erros
3. Corrija conforme necessário

---

## 📊 Checklist de Migração

### Banco de Dados
- [ ] Migração SQL aplicada com sucesso
- [ ] Todas as 9 tabelas criadas
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de segurança aplicadas
- [ ] Funções e triggers configurados

### Edge Functions
- [ ] process-video migrada
- [ ] consolidate-theme migrada
- [ ] process-video-queue migrada
- [ ] queue-cron migrada

### Configuração
- [ ] OPENAI_API_KEY configurada
- [ ] Outros secrets configurados
- [ ] Storage configurado (se necessário)

### Testes
- [ ] Autenticação funcionando
- [ ] Criação de perfil automática
- [ ] Adicionar vídeo funcionando
- [ ] Processamento de vídeo funcionando
- [ ] Criação de tema funcionando
- [ ] Sem erros nos logs

---

## 🔍 Troubleshooting

### Erro: "relation already exists"

**Causa:** Tabela já existe

**Solução:** A migração usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar novamente

### Erro: "permission denied"

**Causa:** Falta de permissões

**Solução:** Certifique-se de estar usando o usuário correto (postgres)

### Edge Function não funciona

**Causa:** Secrets não configurados

**Solução:**
1. Verifique se OPENAI_API_KEY está configurada
2. Verifique logs da Edge Function
3. Teste localmente primeiro

### RLS bloqueando acesso

**Causa:** Políticas muito restritivas

**Solução:**
1. Verifique se usuário está autenticado
2. Verifique se auth.uid() retorna valor
3. Revise políticas se necessário

---

## 📝 Estrutura Migrada

### Tabelas

1. **profiles** - Perfis de usuários
2. **videos** - Vídeos salvos
3. **themes** - Temas/coleções
4. **theme_videos** - Relação tema-vídeo
5. **video_progress** - Progresso de visualização
6. **video_queue** - Fila de processamento
7. **migration_history** - Histórico de migrações
8. **backup_history** - Histórico de backups
9. **resource_usage** - Monitoramento de recursos

### Edge Functions

1. **process-video** - Processa vídeos individuais
2. **consolidate-theme** - Consolida temas
3. **process-video-queue** - Processa fila de vídeos
4. **queue-cron** - Cron job para fila

### Funcionalidades

- ✅ RLS habilitado
- ✅ Políticas de segurança
- ✅ Triggers automáticos
- ✅ Funções auxiliares
- ✅ Índices para performance

---

## 🎯 Próximos Passos

Após migrar tudo:

1. **Atualizar variáveis de ambiente no Vercel**
   - Configurar para apontar para produção
   - Ver: `docs/TASK-2-CONFIGURAR-VERCEL.md`

2. **Fazer deploy da aplicação**
   ```bash
   git checkout main
   git push origin main
   ```

3. **Monitorar logs**
   - Acompanhe os primeiros usos
   - Corrija problemas rapidamente

4. **Configurar backup automático**
   - Já está configurado!
   - Roda todo dia às 2h AM

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Supabase Dashboard
2. Consulte a documentação em `docs/`
3. Verifique se todos os secrets estão configurados
4. Teste cada funcionalidade individualmente

---

**Última atualização:** 2025-01-27  
**Versão:** 1.0
