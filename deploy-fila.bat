@echo off
echo ========================================
echo Deploy da Fila de Processamento
echo ========================================
echo.
echo Fazendo deploy da edge function...
echo.

supabase functions deploy process-video-queue

echo.
echo ========================================
echo Deploy concluido!
echo ========================================
echo.
echo Agora teste compartilhando um video.
echo.
pause
