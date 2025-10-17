# 🚀 Deploy Imediato na Vercel

## Opção 1: Via Interface Web (MAIS FÁCIL - 2 minutos)

### Passo a passo:

1. **Acesse:** https://vercel.com/new

2. **Conecte ao GitHub:**
   - Se ainda não conectou, autorize o Vercel
   - Selecione o repositório: `sobrinkedos/insightFlow`

3. **Configure o projeto:**
   - **Project Name:** `insightflow` (ou o nome que preferir)
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Build Command:** `npm run build:no-check`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Adicione variáveis de ambiente:**
   Clique em "Environment Variables" e adicione:
   - `VITE_SUPABASE_URL` = `https://enkpfnqsjjnanlqhjnsv.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (sua chave do arquivo .env)

5. **Clique em "Deploy"**

6. **Aguarde ~2-3 minutos**

7. **Pronto!** Você receberá uma URL como:
   - `https://insightflow.vercel.app`
   - ou `https://insightflow-[hash].vercel.app`

---

## Opção 2: Via CLI (Terminal)

### Se o PowerShell estiver bloqueando npm:

1. **Abra o terminal como Administrador**

2. **Execute:**
   ```bash
   vercel --prod
   ```

3. **Responda as perguntas:**
   - Set up and deploy? → **Y**
   - Which scope? → Selecione sua conta
   - Link to existing project? → **N** (primeira vez) ou **Y** (se já existe)
   - What's your project's name? → `insightflow`
   - In which directory is your code located? → `.` (Enter)
   - Want to override settings? → **Y**
   - Build Command: → `npm run build:no-check`
   - Output Directory: → `dist`
   - Development Command: → `npm run dev`

4. **Aguarde o deploy**

5. **URL será exibida no terminal**

---

## Opção 3: Via Git Push (Automático)

Se você já conectou o repositório:

```bash
git add .
git commit -m "ready for deploy"
git push
```

O Vercel detecta automaticamente e faz o deploy!

---

## ⚙️ Após o Deploy

### 1. Obtenha a URL do deploy

Exemplo: `https://insightflow.vercel.app`

### 2. Configure a extensão

Edite `browser-extension/config.js`:

```javascript
const INSIGHTSHARE_URL = 'https://insightflow.vercel.app';
```

### 3. Recarregue a extensão

- Vá em `chrome://extensions/`
- Clique em 🔄 Recarregar

### 4. Teste!

- Abra um vídeo do YouTube
- Clique no botão flutuante 🎬
- Deve abrir seu site em produção

---

## 🔧 Configurações Importantes

### Build Command:
```
npm run build:no-check
```

Isso ignora erros de TypeScript e faz o build mesmo assim.

### Environment Variables:

Na Vercel, adicione:

```
VITE_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Use os valores do seu arquivo `.env`)

---

## 🐛 Troubleshooting

### Build falha:

**Solução:** Use `npm run build:no-check` em vez de `npm run build`

### Variáveis de ambiente não funcionam:

**Solução:** 
1. Vá em Settings > Environment Variables
2. Adicione as variáveis
3. Redeploy

### Site não carrega:

**Solução:**
1. Verifique os logs do deploy
2. Certifique-se de que `dist` está sendo gerado
3. Verifique se as variáveis de ambiente estão corretas

---

## 📊 Status do Deploy

Após o deploy, você pode:

- ✅ Ver logs em: https://vercel.com/dashboard
- ✅ Configurar domínio customizado
- ✅ Ver analytics
- ✅ Fazer rollback se necessário

---

## 🎯 Checklist Final

Após o deploy bem-sucedido:

- [ ] Site acessível na URL da Vercel
- [ ] Login funciona
- [ ] Compartilhar vídeo funciona
- [ ] Favoritos funcionam
- [ ] Extensão configurada com URL de produção
- [ ] Botão flutuante funciona
- [ ] Tudo testado!

---

## 🔗 Links Úteis

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Documentação:** https://vercel.com/docs
- **Suporte:** https://vercel.com/support

---

## 💡 Dica

Para deploys futuros, basta fazer:

```bash
git push
```

O Vercel detecta automaticamente e faz o deploy! 🚀
