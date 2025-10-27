# Diretório de Configuração

Este diretório contém as configurações de ambiente para o projeto.

## Arquivos

### Arquivos de Configuração (NÃO commitados)
- `.env.development` - Configurações para desenvolvimento
- `.env.test` - Configurações para teste/staging
- `.env.production` - Configurações para produção

⚠️ **Estes arquivos contêm credenciais reais e estão protegidos pelo .gitignore**

### Arquivos de Template (Commitados)
- `.env.example` - Template de exemplo para criar configurações locais
- `environment.config.ts` - Gerenciador de configuração com validação

## Como Usar

### Para Desenvolvimento Local

1. Copie o arquivo de exemplo:
```bash
cp config/.env.example ../.env.local
```

2. Edite `.env.local` com as credenciais de desenvolvimento

3. O gerenciador de configuração carregará automaticamente

### Gerenciador de Configuração

O arquivo `environment.config.ts` fornece:

- **Validação automática** de variáveis obrigatórias
- **Validação de formato** de URLs e chaves do Supabase
- **Detecção automática** do ambiente atual
- **Type-safety** com TypeScript
- **Singleton pattern** para configuração global

#### Exemplo de Uso

```typescript
import { loadEnvironmentConfig, isDevelopment } from '@/config/environment.config';

// Carregar e validar configuração
const config = loadEnvironmentConfig();

// Usar configuração
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.anonKey;

// Verificar ambiente
if (isDevelopment()) {
  console.log('Rodando em desenvolvimento');
}
```

## Estrutura de Configuração

```typescript
interface EnvironmentConfig {
  environment: 'development' | 'test' | 'production';
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  backupConfig?: {
    backupUrl: string;
    backupServiceKey: string;
    retentionDays: number;
  };
  isDevelopment: boolean;
  isTest: boolean;
  isProduction: boolean;
}
```

## Variáveis de Ambiente

### Obrigatórias
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `VITE_ENVIRONMENT` - Ambiente atual (development/test/production)

### Opcionais
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (apenas server-side)
- `BACKUP_SUPABASE_URL` - URL do projeto de backup
- `BACKUP_SUPABASE_SERVICE_KEY` - Chave de serviço do backup

## Validações

O gerenciador valida automaticamente:

✅ Presença de todas as variáveis obrigatórias  
✅ Formato correto das URLs do Supabase  
✅ Formato correto das chaves JWT  
✅ Comprimento mínimo das chaves  

Se alguma validação falhar, uma mensagem de erro clara será exibida.

## Segurança

### ✅ Boas Práticas
- Arquivos de configuração estão no `.gitignore`
- Service Role Keys nunca são expostas no frontend
- Validação de formato previne erros de configuração
- Ambiente de produção não imprime informações de debug

### ❌ Nunca Faça
- Commitar arquivos `.env.*` com credenciais reais
- Expor Service Role Keys no código frontend
- Usar credenciais de produção em desenvolvimento
- Compartilhar credenciais publicamente

## Troubleshooting

### Erro: "Variáveis de ambiente obrigatórias não encontradas"
- Verifique se criou o arquivo `.env.local`
- Confirme que todas as variáveis obrigatórias estão presentes
- Verifique se não há erros de digitação nos nomes das variáveis

### Erro: "URL do Supabase inválida"
- A URL deve seguir o formato: `https://[project-id].supabase.co`
- Verifique se copiou a URL completa do dashboard do Supabase

### Erro: "Chave inválida"
- Chaves do Supabase são tokens JWT que começam com "eyJ"
- Verifique se copiou a chave completa (são muito longas)
- Não deve haver espaços no início ou fim da chave

## Referências

- [Documentação Completa](../docs/INFRAESTRUTURA.md)
- [Guia de Ambientes](../docs/GUIA-RAPIDO-AMBIENTES.md)
- [Supabase Documentation](https://supabase.com/docs)
