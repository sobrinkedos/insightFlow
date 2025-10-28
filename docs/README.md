# Documentação do Projeto InsightFlow

## Índice de Documentação

### 📋 Infraestrutura e Configuração
- **[RESUMO-VISUAL-AMBIENTES.md](./RESUMO-VISUAL-AMBIENTES.md)** - 🌟 Resumo visual e referência rápida (COMECE AQUI!)
- **[INFRAESTRUTURA.md](./INFRAESTRUTURA.md)** - Documentação completa da infraestrutura multi-ambiente
- **[GUIA-RAPIDO-AMBIENTES.md](./GUIA-RAPIDO-AMBIENTES.md)** - Guia rápido de referência dos ambientes

### 🚀 Deploy e Vercel
- **[SETUP-VERCEL-RAPIDO.md](./SETUP-VERCEL-RAPIDO.md)** - ⚡ Setup rápido do Vercel (5 minutos)
- **[VERCEL-ONDE-ENCONTRAR-IDS.md](./VERCEL-ONDE-ENCONTRAR-IDS.md)** - 🔍 Guia visual para encontrar IDs da Vercel
- **[CONFIGURAR-VERCEL.md](./CONFIGURAR-VERCEL.md)** - Guia de configuração completo do Vercel
- **[IMPORTAR-ENV-VERCEL.md](./IMPORTAR-ENV-VERCEL.md)** - Como importar variáveis de ambiente no Vercel

### 🚀 Deploy e CI/CD
- **[SETUP-VERCEL-RAPIDO.md](./SETUP-VERCEL-RAPIDO.md)** - ⚡ Setup rápido do Vercel (5 minutos)
- **[DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)** - Guia completo de deploy no Vercel
- **[CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)** - Checklist de configuração de deploy
- **[GUIA-MIGRACOES.md](./GUIA-MIGRACOES.md)** - Guia completo de migrações
- **[SISTEMA-BACKUP.md](./SISTEMA-BACKUP.md)** - Sistema de backup automatizado

### 🔧 Configuração
- **[CONFIGURAR-GITHUB-SECRETS.md](./CONFIGURAR-GITHUB-SECRETS.md)** - Configurar secrets do GitHub
- **[CONFIGURAR-VERCEL.md](./CONFIGURAR-VERCEL.md)** - Configurar Vercel detalhadamente

### 🚀 Próximas Documentações (A serem criadas)
- **TROUBLESHOOTING.md** - Problemas comuns e soluções

## Estrutura de Ambientes

O projeto utiliza uma arquitetura multi-ambiente com 4 projetos Supabase distribuídos em 2 contas:

```
Conta A (Desenvolvimento)
├── insightDev (development branch)
└── insightTest (staging branch)

Conta B (Produção)
├── insightProd (main branch)
└── insightProd-bk (backups)
```

## Links Rápidos

### Dashboards Supabase
- [Desenvolvimento](https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv)
- [Teste](https://supabase.com/dashboard/project/bosxuteortfshfysoqrd)
- [Produção](https://supabase.com/dashboard/project/jropngieefxgnufmkeaj)
- [Backup](https://supabase.com/dashboard/project/vewrtrnqubvmipfgnxlv)

### Repositório
- [GitHub](https://github.com/sobrinkedos/insightFlow)

### Vercel
- [Dashboard Vercel](https://vercel.com) (A ser configurado)

## Início Rápido

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o ambiente local (ver [GUIA-RAPIDO-AMBIENTES.md](./GUIA-RAPIDO-AMBIENTES.md))
4. Execute: `npm run dev`

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação relevante acima
2. Verifique o [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (quando disponível)
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** 2025-01-27
