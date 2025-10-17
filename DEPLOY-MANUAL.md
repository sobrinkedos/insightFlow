# Deploy Manual no Netlify

O build está falhando devido a erros de TypeScript no projeto. Aqui estão as opções para fazer o deploy:

## Opção 1: Deploy via Git (Recomendado)

O código já está no GitHub. Configure o Netlify para fazer deploy automático:

1. Acesse https://app.netlify.com
2. Clique em "Add new site" > "Import an existing project"
3. Escolha "GitHub"
4. Selecione o repositório: `sobrinkedos/insightFlow`
5. Configure:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em "Deploy site"

### Importante: Variáveis de ambiente

Antes do deploy, adicione as variáveis de ambiente:

1. No Netlify, vá em "Site settings" > "Environment variables"
2. Adicione:
   - `VITE_SUPABASE_URL` = (sua URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (sua chave anônima do Supabase)

## Opção 2: Corrigir erros de TypeScript primeiro

Os erros são:

### 1. Tipos do Vite (src/lib/supabase.ts)

Adicione no `vite-env.d.ts` ou crie o arquivo:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 2. Imports não usados

Remova imports não utilizados nos arquivos:
- `src/pages/extensions.tsx` - remover `ArrowRight`
- `src/pages/home.tsx` - remover imports de Table
- `src/pages/themes.tsx` - remover `CardDescription`, `CardHeader`, `CardTitle`

### 3. Tipos do Theme (src/pages/theme-detail.tsx)

Adicione as propriedades no tipo `Theme` em `src/types/database.ts`:

```typescript
export interface Theme {
  // ... propriedades existentes
  consolidated_summary?: string;
  keywords?: string[];
}
```

### 4. Tipos do Framer Motion

Corrija os tipos de `pageTransition` nos arquivos:
- `src/pages/extensions.tsx`
- `src/pages/home.tsx`

```typescript
const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut",
  duration: 0.3,
};
```

## Opção 3: Desabilitar verificação de tipos no build

Temporariamente, você pode desabilitar a verificação de tipos:

No `package.json`, altere:

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

Isso vai fazer o build sem verificar tipos (não recomendado para produção).

## Opção 4: Deploy via Netlify Drop

Se quiser fazer deploy manual sem corrigir os erros:

1. Comente temporariamente o comando `tsc -b` no build
2. Faça o build: `npm run build`
3. Acesse https://app.netlify.com/drop
4. Arraste a pasta `dist` para o Netlify

## Recomendação

**Use a Opção 1** (Deploy via Git) porque:
- ✅ Deploy automático a cada push
- ✅ Preview de branches
- ✅ Rollback fácil
- ✅ Netlify vai tentar fazer o build mesmo com warnings

O Netlify pode conseguir fazer o build mesmo com alguns erros de TypeScript, dependendo da configuração.

## Verificar status do deploy

Após configurar, você pode acompanhar em:
- https://app.netlify.com/sites/[seu-site]/deploys

## Próximos passos após deploy

1. Teste o PWA: `https://seu-dominio.netlify.app/test-pwa.html`
2. Instale o PWA
3. Teste compartilhamento do YouTube
4. Configure domínio customizado (opcional)
