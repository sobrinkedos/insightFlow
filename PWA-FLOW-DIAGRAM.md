# Diagrama de Fluxo - Web Share Target

## Fluxo completo do compartilhamento

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSTALAÇÃO DO PWA                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Usuário acessa   │
                    │ InsightShare     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Navegador oferece│
                    │ "Instalar App"   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ PWA instalado    │
                    │ no dispositivo   │
                    └────────┬─────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                                                          │
│              COMPARTILHAMENTO DE VÍDEO                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Usuário abre     │
                    │ YouTube          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Clica em         │
                    │ "Compartilhar"   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Lista de apps    │
                    │ aparece          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Seleciona        │
                    │ "InsightShare"   │
                    └────────┬─────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                                                          │
│              PROCESSAMENTO NO APP                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ GET /share       │
                    │ ?url=...         │
                    │ &title=...       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ SharePage        │
                    │ (React)          │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
          ┌──────────────┐   ┌──────────────┐
          │ Usuário      │   │ Usuário não  │
          │ logado       │   │ logado       │
          └──────┬───────┘   └──────┬───────┘
                 │                  │
                 │                  ▼
                 │         ┌──────────────────┐
                 │         │ Salva returnUrl  │
                 │         │ no query params  │
                 │         └────────┬─────────┘
                 │                  │
                 │                  ▼
                 │         ┌──────────────────┐
                 │         │ Redireciona para │
                 │         │ /login           │
                 │         └────────┬─────────┘
                 │                  │
                 │                  ▼
                 │         ┌──────────────────┐
                 │         │ Usuário faz      │
                 │         │ login            │
                 │         └────────┬─────────┘
                 │                  │
                 └──────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Salva URL no     │
                    │ localStorage     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Redireciona para │
                    │ /videos          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ VideosPage       │
                    │ carrega          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ ShareVideoDialog │
                    │ detecta URL      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Dialog abre      │
                    │ automaticamente  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Campo URL        │
                    │ preenchido       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Usuário confirma │
                    │ ou edita         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Vídeo adicionado │
                    │ à fila           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ IA processa      │
                    │ vídeo            │
                    └──────────────────┘
```

## Componentes envolvidos

### Frontend

```
src/
├── pages/
│   ├── share.tsx              ← Recebe compartilhamento
│   └── videos.tsx             ← Exibe vídeos
├── components/
│   └── share-video-dialog.tsx ← Dialog com URL preenchida
└── App.tsx                    ← Roteamento
```

### Configuração

```
public/
├── manifest.webmanifest       ← Configuração do PWA
└── test-pwa.html              ← Ferramenta de teste

vite.config.ts                 ← Plugin PWA
netlify.toml                   ← Headers e redirects
```

## Tecnologias utilizadas

- **Web Share Target API** - Recebe compartilhamentos
- **Service Worker** - Cache e offline support
- **PWA Manifest** - Configuração do app
- **React Router** - Roteamento
- **localStorage** - Armazenamento temporário da URL
- **Vite PWA Plugin** - Geração automática do SW

## Estados do fluxo

### 1. Instalação
- ✅ PWA instalado
- ❌ PWA não instalado (não aparece no compartilhamento)

### 2. Autenticação
- ✅ Usuário logado → Direto para /videos
- ❌ Não logado → /login → /videos

### 3. Compartilhamento
- ✅ URL válida → Dialog abre com URL
- ❌ URL inválida → Erro de validação
- ⚠️ Sem URL → Dialog abre vazio

## Exemplo de URL gerada

Quando o YouTube compartilha para o InsightShare:

```
https://alpha.dualite.dev/share?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&title=Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up&text=Check%20out%20this%20video
```

Parâmetros:
- `url` - URL do vídeo (obrigatório)
- `title` - Título do vídeo (opcional)
- `text` - Descrição (opcional)

## Compatibilidade

| Plataforma | Instalação | Compartilhamento | Notas |
|------------|------------|------------------|-------|
| Chrome Android | ✅ | ✅ | Perfeito |
| Chrome Desktop | ✅ | ✅ | Perfeito |
| Edge Android | ✅ | ✅ | Perfeito |
| Edge Desktop | ✅ | ✅ | Perfeito |
| Safari iOS | ⚠️ | ⚠️ | Limitado |
| Firefox | ⚠️ | ❌ | Sem Web Share Target |

## Performance

- **Tempo de instalação**: ~2 segundos
- **Tempo de compartilhamento**: ~1 segundo
- **Cache**: Offline-first com Workbox
- **Bundle size**: +~50KB (vite-plugin-pwa)

## Segurança

- ✅ HTTPS obrigatório
- ✅ Validação de URL no frontend
- ✅ Autenticação necessária
- ✅ Headers de segurança configurados
- ✅ XSS protection

## Monitoramento

Métricas importantes:
- Taxa de instalação do PWA
- Taxa de uso do compartilhamento
- Erros de validação de URL
- Tempo de processamento

## Melhorias futuras

- [ ] Notificação quando processamento terminar
- [ ] Suporte a múltiplas URLs de uma vez
- [ ] Preview do vídeo antes de adicionar
- [ ] Histórico de compartilhamentos
- [ ] Compartilhamento offline (queue)
