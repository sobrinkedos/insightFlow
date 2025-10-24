# ⏰ Configurar Cron Job - Fila Automática

## 🎯 Objetivo

Fazer com que a fila de vídeos seja verificada **automaticamente a cada 30 segundos**, garantindo que nenhum vídeo fique parado esperando processamento.

---

## 🚀 Passo a Passo

### Passo 1: Deploy da Função queue-cron

#### Opção A: Script Automático (Recomendado)
```bash
deploy-cron-job.bat
```

#### Opção B: Via CLI
```bash
supabase functions deploy queue-cron
```

#### Opção C: Via Dashboard
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
2. Clique em **"New function"**
3. Nome: `queue-cron`
4. Cole o código de: `supabase/functions/queue-cron/index.ts`
5. Clique em **"Deploy"**

---

### Passo 2: Configurar Cron Job no Supabase

#### 2.1 Acessar Cron Jobs
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/database/cron-jobs
2. Clique em **"Create a new cron job"**

#### 2.2 Configurar o Job

**Name**: `queue-processor`

**Schedule**: `*/30 * * * *`
- Isso significa: "A cada 30 segundos"
- Formato: `segundo minuto hora dia mês dia-da-semana`

**Command**:
```sql
SELECT
  net.http_post(
    url := 'https://enkpfnqsjjnanlqhjnsv.supabase.co/functions/v1/queue-cron',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
```

#### 2.3 Salvar
Clique em **"Create cron job"**

---

## 🧪 Testar

### Teste 1: Verificar se o Cron Job está Ativo

```sql
-- Ver cron jobs ativos
SELECT * FROM cron.job;
```

**Resultado esperado**: Deve mostrar o job `queue-processor`

### Teste 2: Ver Execuções do Cron Job

```sql
-- Ver últimas execuções
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'queue-processor')
ORDER BY start_time DESC 
LIMIT 10;
```

**Resultado esperado**: Deve mostrar execuções a cada 30 segundos

### Teste 3: Compartilhar Instagram e Aguardar

1. Compartilhe um Instagram
2. **NÃO** dispare a fila manualmente
3. Aguarde até 30 segundos
4. Verifique que o vídeo começou a processar automaticamente

```sql
-- Ver status do vídeo
SELECT platform, status, created_at, started_at
FROM video_queue
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;
```

**Resultado esperado**: 
- `status = 'processing'` ou `'completed'` em até 30 segundos

---

## 📊 Monitoramento

### Ver Logs do Cron Job

```sql
-- Ver logs das últimas execuções
SELECT 
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'queue-processor')
ORDER BY start_time DESC 
LIMIT 20;
```

### Ver Logs da Função queue-cron

Dashboard > Functions > queue-cron > Logs

**Procure por**:
- `⏰ Cron: Checking queue for pending videos...`
- `📬 Found X pending videos, triggering processor...`
- `✅ Queue processor triggered successfully`

---

## 🎯 Como Funciona

### Fluxo Automático

```
A cada 30 segundos:
    ↓
Cron Job executa
    ↓
Chama queue-cron function
    ↓
Verifica se há vídeos pendentes
    ↓
Se SIM: Dispara process-video-queue
    ↓
Vídeos processam automaticamente
    ↓
✅ Nenhum vídeo fica parado!
```

### Diagrama Visual

```
┌─────────────────────────────────────────┐
│         CRON JOB (a cada 30s)           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      queue-cron function                │
│  "Há vídeos pendentes?"                 │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    ┌───────┐         ┌───────────┐
    │  NÃO  │         │    SIM    │
    └───────┘         └───────────┘
        │                   │
        ▼                   ▼
    ┌───────┐    ┌──────────────────────┐
    │ Nada  │    │ Dispara              │
    │       │    │ process-video-queue  │
    └───────┘    └──────────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Vídeos processam│
                 └─────────────────┘
```

---

## 🔧 Troubleshooting

### Problema 1: Cron Job não está executando

**Diagnóstico**:
```sql
SELECT * FROM cron.job WHERE jobname = 'queue-processor';
```

**Se não aparecer**: Cron job não foi criado
**Solução**: Repetir Passo 2

### Problema 2: Cron Job executando mas com erro

**Diagnóstico**:
```sql
SELECT status, return_message 
FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'queue-processor')
ORDER BY start_time DESC 
LIMIT 5;
```

**Se status = 'failed'**: Ver `return_message` para detalhes
**Soluções comuns**:
- Verificar se função `queue-cron` foi deployada
- Verificar URL da função
- Verificar permissões

### Problema 3: Vídeos ainda ficam pendentes

**Diagnóstico**:
```sql
-- Ver vídeos pendentes há mais de 1 minuto
SELECT id, platform, created_at, 
       EXTRACT(EPOCH FROM (NOW() - created_at)) as segundos_pendente
FROM video_queue
WHERE status = 'pending'
AND created_at < NOW() - INTERVAL '1 minute';
```

**Se aparecer vídeos**: Cron job não está funcionando
**Solução**: Verificar logs do cron job e da função

---

## ⚙️ Configurações Avançadas

### Alterar Frequência do Cron Job

#### A cada 15 segundos (mais agressivo)
```
Schedule: */15 * * * *
```

#### A cada 1 minuto (mais econômico)
```
Schedule: * * * * *
```

#### A cada 2 minutos (muito econômico)
```
Schedule: */2 * * * *
```

**Recomendação**: Manter em 30 segundos (bom equilíbrio)

---

## 📊 Métricas de Sucesso

### Antes do Cron Job
- ❌ Vídeos ficam pendentes indefinidamente
- ❌ Precisa disparar manualmente
- ❌ Usuário precisa compartilhar outro vídeo

### Depois do Cron Job
- ✅ Vídeos processam em até 30 segundos
- ✅ Totalmente automático
- ✅ Nenhuma intervenção necessária

---

## 🎉 Resultado Final

Com o cron job configurado:

1. ✅ **Fila sempre ativa**: Verifica a cada 30 segundos
2. ✅ **Processamento automático**: Nenhum vídeo fica parado
3. ✅ **Zero intervenção**: Funciona sozinho
4. ✅ **Confiável**: Garante que tudo processa

---

## 📞 Links Úteis

- **Cron Jobs**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/database/cron-jobs
- **Functions**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
- **Logs**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/logs

---

## ✅ Checklist

- [ ] Deploy da função `queue-cron`
- [ ] Criar cron job no Supabase
- [ ] Configurar schedule (*/30 * * * *)
- [ ] Configurar command (SQL acima)
- [ ] Salvar cron job
- [ ] Testar compartilhando Instagram
- [ ] Verificar que processa automaticamente
- [ ] Monitorar logs
- [ ] Pronto! 🎉

---

**Pronto! Agora a fila nunca mais ficará parada!** ⏰
