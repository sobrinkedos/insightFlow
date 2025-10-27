# Arquivos de Variáveis de Ambiente

## 📁 Arquivos Disponíveis

### Para Desenvolvimento Local
- **`.env.example`** - Template com exemplos de variáveis (commitado no Git)
- **`.env.local`** - Suas variáveis locais (NÃO commitado, criar manualmente)

### Para Importação no Vercel
- **`.env.vercel.development`** - Variáveis para ambiente Development
- **`.env.vercel.preview`** - Variáveis para ambiente Preview (Staging)
- **`.env.vercel.production`** - Variáveis para ambiente Production

⚠️ **Os arquivos `.env.vercel.*` contêm credenciais reais e NÃO devem ser commitados no Git!**

## 🚀 Como Usar

### Setup Local (Desenvolvedor)

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` com as credenciais de desenvolvimento:
```env
NEXT_PUBLIC_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=development
```

3. Execute a aplicação:
```bash
npm run dev
```

### Importar no Vercel (Administrador)

Siga o guia completo em: **[docs/IMPORTAR-ENV-VERCEL.md](docs/IMPORTAR-ENV-VERCEL.md)**

Resumo rápido:
1. Acesse Vercel Dashboard > Settings > Environment Variables
2. Copie o conteúdo de `.env.vercel.development` e importe para Development
3. Copie o conteúdo de `.env.vercel.preview` e importe para Preview
4. Copie o conteúdo de `.env.vercel.production` e importe para Production

## 🔐 Segurança

### ✅ Arquivos Seguros (podem ser commitados)
- `.env.example` - Apenas template, sem credenciais reais

### ❌ Arquivos Sensíveis (NÃO commitar)
- `.env.local`
- `.env.development`
- `.env.test`
- `.env.production`
- `.env.vercel.*`

Todos estes arquivos estão protegidos pelo `.gitignore`.

## 📊 Mapeamento de Ambientes

| Arquivo | Ambiente Vercel | Branch Git | Projeto Supabase |
|---------|----------------|------------|------------------|
| `.env.vercel.development` | Development | `development` | insightDev |
| `.env.vercel.preview` | Preview | `staging` | insightTest |
| `.env.vercel.production` | Production | `main` | insightProd |

## 🆘 Troubleshooting

### Não consigo acessar o Supabase localmente
- Verifique se criou o arquivo `.env.local`
- Confirme que copiou as credenciais corretas
- Verifique se não há espaços extras nas chaves

### Variáveis não carregam no Vercel
- Certifique-se de importar para o ambiente correto
- Faça um novo deploy após adicionar variáveis
- Verifique os logs de build no Vercel

### Erro "Invalid API key"
- Confirme que está usando a chave do ambiente correto
- Verifique se a chave foi copiada completamente (são muito longas)
- Tente regenerar as chaves no Supabase Dashboard

## 📚 Documentação Adicional

- [Infraestrutura Completa](docs/INFRAESTRUTURA.md)
- [Guia Rápido de Ambientes](docs/GUIA-RAPIDO-AMBIENTES.md)
- [Configurar Vercel](docs/CONFIGURAR-VERCEL.md)
- [Importar Variáveis no Vercel](docs/IMPORTAR-ENV-VERCEL.md)

## 🔄 Rotação de Credenciais

As credenciais devem ser rotacionadas periodicamente:
- **Desenvolvimento/Teste:** A cada 90 dias
- **Produção:** A cada 30 dias

Quando rotacionar:
1. Gerar novas chaves no Supabase Dashboard
2. Atualizar arquivos `.env.vercel.*`
3. Reimportar no Vercel
4. Notificar equipe para atualizar `.env.local`

---

**Última atualização:** 2025-01-27
