# Documentação do Projeto InsightFlow

## Índice de Documentação

### 📋 Infraestrutura e Configuração
- **[INFRAESTRUTURA.md](./INFRAESTRUTURA.md)** - Documentação completa da infraestrutura multi-ambiente
- **[GUIA-RAPIDO-AMBIENTES.md](./GUIA-RAPIDO-AMBIENTES.md)** - Guia rápido de referência dos ambientes
- **[CONFIGURAR-VERCEL.md](./CONFIGURAR-VERCEL.md)** - Guia de configuração do Vercel
- **[IMPORTAR-ENV-VERCEL.md](./IMPORTAR-ENV-VERCEL.md)** - Como importar variáveis de ambiente no Vercel

### 🚀 Próximas Documentações (A serem criadas)
- **SETUP.md** - Guia de setup inicial para desenvolvedores
- **DEPLOYMENT.md** - Processo de deploy detalhado
- **MIGRATION.md** - Guia de migrações de banco de dados
- **BACKUP.md** - Estratégia e procedimentos de backup
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
