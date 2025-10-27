# Resumo Visual - Ambientes e Credenciais

## 🎯 Visão Geral Rápida

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE DESENVOLVIMENTO                     │
└─────────────────────────────────────────────────────────────────┘

   LOCAL                    GITHUB                    VERCEL
    ↓                         ↓                         ↓
.env.local  ──────────→  development  ──────────→  Development
(insightDev)              branch                    (Auto Deploy)
                                                         ↓
                                                    insightDev DB
                                                         
                                                         
   LOCAL                    GITHUB                    VERCEL
    ↓                         ↓                         ↓
.env.local  ──────────→    staging    ──────────→    Preview
(insightTest)             branch                    (Auto Deploy)
                                                         ↓
                                                    insightTest DB


   LOCAL                    GITHUB                    VERCEL
    ↓                         ↓                         ↓
.env.local  ──────────→      main     ──────────→   Production
(insightProd)             branch                   (Manual Approval)
                                                         ↓
                                                    insightProd DB
                                                         ↓
                                                    Backup Automático
                                                         ↓
                                                    insightProd-bk DB
```

## 📋 Tabela de Referência Rápida

| Ambiente | Branch | Arquivo Local | Arquivo Vercel | Projeto Supabase | Deploy |
|----------|--------|---------------|----------------|------------------|--------|
| **Development** | `development` | `.env.local` | `.env.vercel.development` | insightDev | Automático |
| **Staging** | `staging` | `.env.local` | `.env.vercel.preview` | insightTest | Automático |
| **Production** | `main` | `.env.local` | `.env.vercel.production` | insightProd | Manual |
| **Backup** | - | - | - | insightProd-bk | Automático |

## 🔑 Credenciais por Ambiente

### 🟢 Development (Conta A)
```
Projeto: insightDev
URL: https://enkpfnqsjjnanlqhjnsv.supabase.co
Project ID: enkpfnqsjjnanlqhjnsv
Branch: development
```

### 🟡 Staging (Conta A)
```
Projeto: insightTest
URL: https://bosxuteortfshfysoqrd.supabase.co
Project ID: bosxuteortfshfysoqrd
Branch: staging
```

### 🔴 Production (Conta B)
```
Projeto: insightProd
URL: https://jropngieefxgnufmkeaj.supabase.co
Project ID: jropngieefxgnufmkeaj
Branch: main
```

### 💾 Backup (Conta B)
```
Projeto: insightProd-bk
URL: https://vewrtrnqubvmipfgnxlv.supabase.co
Project ID: vewrtrnqubvmipfgnxlv
Uso: Backups automáticos
```

## 📁 Arquivos de Configuração

### Para Desenvolvimento Local
```bash
# 1. Copiar template
cp .env.example .env.local

# 2. Editar com credenciais de desenvolvimento
# Use as credenciais do insightDev

# 3. Executar
npm run dev
```

### Para Vercel (Administrador)
```bash
# Arquivos criados (NÃO commitados):
.env.vercel.development  → Importar no Vercel Development
.env.vercel.preview      → Importar no Vercel Preview
.env.vercel.production   → Importar no Vercel Production
```

## 🚀 Comandos Git por Ambiente

### Development
```bash
git checkout development
git pull origin development
# fazer alterações
git add .
git commit -m "feat: sua alteração"
git push origin development
# ✅ Deploy automático no Vercel
```

### Staging
```bash
git checkout staging
git merge development
git push origin staging
# ✅ Deploy automático no Vercel
```

### Production
```bash
git checkout main
git merge staging
git push origin main
# ⏳ Aguardar aprovação manual
# ✅ Deploy após aprovação
# 💾 Backup automático acionado
```

## 🔐 Níveis de Acesso

| Ambiente | Desenvolvedores | Administradores | Usuários |
|----------|----------------|-----------------|----------|
| Development | ✅ R/W | ✅ R/W | ❌ |
| Staging | ✅ R/W | ✅ R/W | ❌ |
| Production | ❌ | ✅ R/W | ✅ R/W |
| Backup | ❌ | ✅ R | ❌ |

**Legenda:** R/W = Leitura/Escrita, R = Somente Leitura

## 📊 Limites do Tier Gratuito

| Recurso | Por Projeto | Total (4 projetos) |
|---------|-------------|-------------------|
| Storage | 500 MB | 2 GB |
| Bandwidth | 2 GB/mês | 8 GB/mês |
| Database | 500 MB | 2 GB |
| Connections | 60 | 240 |

## ⚠️ Regras Importantes

### ✅ PERMITIDO
- Push direto para `development`
- Merge de `development` → `staging`
- Testar livremente em dev/staging
- Resetar dados em development

### ❌ PROIBIDO
- Push direto para `main`
- Acesso direto ao DB de produção
- Copiar dados de produção para dev
- Commitar arquivos `.env.vercel.*`

## 🆘 Links Rápidos

### Dashboards Supabase
- [Development](https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv)
- [Staging](https://supabase.com/dashboard/project/bosxuteortfshfysoqrd)
- [Production](https://supabase.com/dashboard/project/jropngieefxgnufmkeaj)
- [Backup](https://supabase.com/dashboard/project/vewrtrnqubvmipfgnxlv)

### Documentação
- [Infraestrutura Completa](./INFRAESTRUTURA.md)
- [Guia Rápido](./GUIA-RAPIDO-AMBIENTES.md)
- [Configurar Vercel](./CONFIGURAR-VERCEL.md)
- [Importar Variáveis](./IMPORTAR-ENV-VERCEL.md)

### Repositório
- [GitHub](https://github.com/sobrinkedos/insightFlow)

## 📝 Checklist de Setup

### Para Desenvolvedores
- [ ] Clonar repositório
- [ ] `npm install`
- [ ] Copiar `.env.example` → `.env.local`
- [ ] Adicionar credenciais de development
- [ ] `npm run dev`
- [ ] Verificar acesso ao Supabase

### Para Administradores
- [ ] Conectar Vercel ao GitHub
- [ ] Importar `.env.vercel.development`
- [ ] Importar `.env.vercel.preview`
- [ ] Importar `.env.vercel.production`
- [ ] Testar deploys em cada ambiente
- [ ] Configurar GitHub Actions (backup)

---

**💡 Dica:** Imprima ou salve este documento para referência rápida!

**Última atualização:** 2025-01-27
