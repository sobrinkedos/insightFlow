# Teste de Login - Extensão

## Erro 401 - Possíveis causas:

### 1. Email Providers não habilitado no Supabase

O Supabase precisa ter o "Email Provider" habilitado para login com senha.

**Verificar:**
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv
2. Vá em "Authentication" > "Providers"
3. Certifique-se de que "Email" está **ENABLED**

### 2. Usuário não existe

Você precisa ter uma conta criada no InsightShare.

**Criar conta:**
1. Acesse: https://seu-site.vercel.app/signup
2. Crie uma conta com email e senha
3. Confirme o email (se necessário)

### 3. Formato da requisição

Vou testar a requisição diretamente:

```bash
curl -X POST 'https://enkpfnqsjjnanlqhjnsv.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE' \
  -H 'Content-Type: application/json' \
  -d '{"email":"seu@email.com","password":"suasenha"}'
```

## Solução alternativa: Usar o site

Enquanto corrigimos o login na extensão, você pode:

1. **Abrir o site:** https://seu-site.vercel.app
2. **Fazer login** no site
3. **Usar o botão "Compartilhar Vídeo"** no site
4. **Colar a URL** do vídeo

## Correção aplicada:

✅ API Key atualizada para a correta
✅ Erro de "Could not establish connection" corrigido
✅ Fallback para usar URL da aba se content script falhar

## Próximos passos:

1. Recarregue a extensão
2. Tente fazer login novamente
3. Se ainda der erro 401, verifique:
   - Email Provider está habilitado no Supabase
   - Você tem uma conta criada
   - Email e senha estão corretos
