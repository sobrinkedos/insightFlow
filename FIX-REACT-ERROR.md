# Fix React Error #31

## Erro identificado:

```
Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
Minified React error #31
```

## Causa provável:

O erro React #31 significa que você está tentando renderizar um **objeto** diretamente no JSX em vez de uma string/número.

## Possíveis causas no código:

### 1. `formatDistanceToNow` com locale

O problema pode estar no uso do `locale: ptBR` com `date-fns` v3.

**Solução:**

```typescript
// ERRADO (pode retornar objeto)
{formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ptBR })}

// CORRETO (garantir string)
{String(formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ptBR }))}
```

### 2. Verificar se `video.created_at` é válido

```typescript
// Adicionar verificação
{video.created_at ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: ptBR }) : 'Data desconhecida'}
```

## Como debugar:

### 1. Rodar em modo desenvolvimento:

```bash
npm run dev
```

Isso vai mostrar o erro completo sem minificação.

### 2. Verificar console do navegador:

Abra DevTools > Console e veja qual componente está causando o erro.

### 3. Verificar Network:

Se o erro aparece ao carregar dados, pode ser que a API esteja retornando dados em formato incorreto.

## Solução rápida:

Vou criar um helper para garantir que sempre retorne string:

```typescript
// src/lib/utils.ts
export function formatDate(date: string | Date) {
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    });
  } catch (error) {
    return 'Data inválida';
  }
}
```

Depois usar:

```typescript
{formatDate(video.created_at)}
```

## Verificar se o problema é da extensão:

O erro "Could not establish connection" é da **extensão**, não do site.

Para testar se o site funciona sem a extensão:

1. Desabilite a extensão temporariamente
2. Recarregue o site
3. Veja se o erro persiste

Se o erro sumir, o problema é da extensão interferindo no site.

## Próximos passos:

1. [ ] Rodar `npm run dev` para ver erro completo
2. [ ] Verificar qual componente está causando o erro
3. [ ] Adicionar verificações de tipo
4. [ ] Testar sem a extensão
