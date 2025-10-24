@echo off
echo ========================================
echo   DEPLOY OTIMIZACOES - INSTAGRAM 2X
echo ========================================
echo.
echo Alteracoes:
echo - MAX_INSTAGRAM: 1 -^> 2 (2 simultaneos)
echo - Whisper limite: 25MB -^> 10MB (mais rapido)
echo.
echo ========================================
echo.

echo [1/2] Fazendo deploy de process-video-queue...
call supabase functions deploy process-video-queue
if errorlevel 1 (
    echo.
    echo ❌ ERRO no deploy de process-video-queue
    echo.
    echo Tente via Dashboard:
    echo https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
    pause
    exit /b 1
)

echo.
echo ✅ process-video-queue deployed!
echo.

echo [2/2] Fazendo deploy de process-video...
call supabase functions deploy process-video
if errorlevel 1 (
    echo.
    echo ❌ ERRO no deploy de process-video
    echo.
    echo Tente via Dashboard:
    echo https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Melhorias implementadas:
echo - 2 Instagrams processando simultaneamente
echo - Videos grandes (^>10MB) pulam Whisper
echo - Processamento 2-4x mais rapido
echo.
echo Teste agora:
echo 1. Compartilhe 2 Instagrams ao mesmo tempo
echo 2. Verifique que ambos processam juntos
echo 3. Videos grandes devem processar em 30-60s
echo.
echo ========================================
pause
