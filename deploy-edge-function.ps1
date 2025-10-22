# Script para fazer deploy da Edge Function via Dashboard do Supabase

Write-Host "🚀 Deploy da Edge Function - process-video" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Instruções:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse o Dashboard do Supabase" -ForegroundColor White
Write-Host ""
Write-Host "2. Clique em 'Edit function' ou 'Deploy new version'" -ForegroundColor White
Write-Host ""
Write-Host "3. Cole o conteúdo dos arquivos:" -ForegroundColor White
Write-Host "   - supabase/functions/process-video/index.ts" -ForegroundColor Gray
Write-Host "   - supabase/functions/process-video/ai-prompts.ts" -ForegroundColor Gray
Write-Host "   - supabase/functions/process-video/instagram-api.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Clique em 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "📂 Abrindo arquivos para copiar..." -ForegroundColor Cyan

# Abrir arquivos no editor padrão
Start-Process "supabase\functions\process-video\index.ts"
Start-Sleep -Seconds 1
Start-Process "supabase\functions\process-video\ai-prompts.ts"
Start-Sleep -Seconds 1
Start-Process "supabase\functions\process-video\instagram-api.ts"

Write-Host ""
Write-Host "✅ Arquivos abertos! Copie o conteúdo e cole no Dashboard." -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Abrindo Dashboard do Supabase..." -ForegroundColor Cyan
Write-Host ""

# Abrir navegador
Start-Process "https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video"
