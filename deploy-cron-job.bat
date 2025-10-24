@echo off
echo ========================================
echo   DEPLOY CRON JOB - FILA AUTOMATICA
echo ========================================
echo.
echo Este script vai:
echo 1. Fazer deploy da funcao queue-cron
echo 2. Configurar cron job no Supabase
echo.
echo ========================================
echo.

echo [1/2] Fazendo deploy de queue-cron...
call supabase functions deploy queue-cron
if errorlevel 1 (
    echo.
    echo ❌ ERRO no deploy de queue-cron
    echo.
    echo Tente via Dashboard:
    echo https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
    pause
    exit /b 1
)

echo.
echo ✅ queue-cron deployed!
echo.

echo [2/2] Configurando cron job...
echo.
echo ⚠️ IMPORTANTE: Configure manualmente no Supabase Dashboard
echo.
echo Passos:
echo 1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/database/cron-jobs
echo 2. Clique em "Create a new cron job"
echo 3. Configure:
echo    - Name: queue-processor
echo    - Schedule: */30 * * * * (a cada 30 segundos)
echo    - Command: SELECT net.http_post(
echo                 url:='https://enkpfnqsjjnanlqhjnsv.supabase.co/functions/v1/queue-cron',
echo                 headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' ^|^| current_setting('app.settings.service_role_key') ^|^| '"}'::jsonb,
echo                 body:='{}'::jsonb
echo               ) as request_id;
echo.
echo ========================================
echo   ✅ DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Configure o cron job manualmente (veja acima)
echo 2. Teste compartilhando um Instagram
echo 3. Verifique que processa automaticamente
echo.
echo ========================================
pause
