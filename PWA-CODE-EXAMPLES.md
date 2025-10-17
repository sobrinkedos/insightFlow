# Exemplos de Código - Web Share Target

## Manifest (public/manifest.webmanifest)

```json
{
  "name": "InsightShare - Seus Vídeos, Organizados por IA",
  "short_name": "InsightShare",
  "description": "Organize e analise seus vídeos com IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "share_target": {
    "action": "/share",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## Vite Config (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      manifest: false, // Usamos manifest customizado
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ]
});
```

## Share Page (src/pages/share.tsx)

```typescript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const url = searchParams.get('url');
    const title = searchParams.get('title');

    if (!user) {
      // Redireciona para login mantendo a URL
      const returnUrl = `/share?url=${encodeURIComponent(url || '')}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (url) {
      // Salva no localStorage para o dialog pegar
      localStorage.setItem('sharedVideoUrl', url);
      if (title) {
        localStorage.setItem('sharedVideoTitle', title);
      }
      navigate('/videos');
    } else {
      navigate('/videos');
    }
  }, [searchParams, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="text-muted-foreground">Processando compartilhamento...</p>
      </div>
    </div>
  );
}
```

## Share Dialog (src/components/share-video-dialog.tsx)

```typescript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ShareVideoDialog() {
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      url: "",
    },
  });

  // Detecta URL compartilhada
  useEffect(() => {
    const sharedUrl = localStorage.getItem('sharedVideoUrl');
    if (sharedUrl) {
      form.setValue('url', sharedUrl);
      setOpen(true);
      
      // Limpa o localStorage
      localStorage.removeItem('sharedVideoUrl');
      localStorage.removeItem('sharedVideoTitle');
      
      toast.info('URL do vídeo compartilhado carregada!');
    }
  }, [form]);

  // ... resto do componente
}
```

## Netlify Config (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Headers para PWA
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Content-Type = "application/javascript"
    Cache-Control = "public, max-age=0, must-revalidate"

# Redirects para SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## HTML (index.html)

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InsightShare</title>
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#0a0a0a" />
    
    <!-- Ícones -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Detectar instalação do PWA

```typescript
// Verificar se está instalado
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

// Ou
const isInstalled = window.navigator.standalone === true; // iOS

// Ou
const isInstalled = document.referrer.includes('android-app://');
```

## Prompt de instalação

```typescript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Previne o prompt automático
  e.preventDefault();
  
  // Salva o evento para usar depois
  deferredPrompt = e;
  
  // Mostra seu próprio botão de instalação
  showInstallButton();
});

async function installPWA() {
  if (!deferredPrompt) return;
  
  // Mostra o prompt
  deferredPrompt.prompt();
  
  // Aguarda a escolha do usuário
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response: ${outcome}`);
  
  // Limpa o prompt
  deferredPrompt = null;
}
```

## Detectar quando foi instalado

```typescript
window.addEventListener('appinstalled', () => {
  console.log('PWA foi instalado!');
  
  // Analytics
  gtag('event', 'pwa_installed');
  
  // Esconde botão de instalação
  hideInstallButton();
});
```

## Web Share API (compartilhar do seu app)

```typescript
async function shareVideo(url: string, title: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: 'Confira este vídeo!',
        url: url,
      });
      console.log('Compartilhado com sucesso');
    } catch (err) {
      console.log('Erro ao compartilhar:', err);
    }
  } else {
    // Fallback: copiar para clipboard
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  }
}
```

## Service Worker customizado

Se precisar customizar o service worker:

```typescript
// vite.config.ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
})

// src/sw.ts
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// Precache de arquivos
precacheAndRoute(self.__WB_MANIFEST);

// Cache de API
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

## Notificações Push

```typescript
// Pedir permissão
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notificações permitidas');
  }
}

// Enviar notificação
function showNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
    });
  }
}

// No service worker
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
    })
  );
});
```

## Offline detection

```typescript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      toast.success('Você está online!');
    }

    function handleOffline() {
      setIsOnline(false);
      toast.error('Você está offline');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

## Update do PWA

```typescript
// Detectar nova versão
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            toast.info('Nova versão disponível!', {
              action: {
                label: 'Atualizar',
                onClick: () => window.location.reload()
              }
            });
          }
        });
      });
    });
  }
}, []);
```

## Analytics de PWA

```typescript
// Rastrear instalação
window.addEventListener('appinstalled', () => {
  gtag('event', 'pwa_installed', {
    event_category: 'PWA',
    event_label: 'Installation'
  });
});

// Rastrear compartilhamento
function trackShare(url: string) {
  gtag('event', 'share', {
    event_category: 'PWA',
    event_label: 'Video Share',
    value: url
  });
}

// Rastrear uso standalone
if (window.matchMedia('(display-mode: standalone)').matches) {
  gtag('event', 'pwa_usage', {
    event_category: 'PWA',
    event_label: 'Standalone Mode'
  });
}
```

## Testes

```typescript
// Testar manifest
describe('PWA Manifest', () => {
  it('should have share_target configured', async () => {
    const response = await fetch('/manifest.webmanifest');
    const manifest = await response.json();
    
    expect(manifest.share_target).toBeDefined();
    expect(manifest.share_target.action).toBe('/share');
    expect(manifest.share_target.params.url).toBe('url');
  });
});

// Testar service worker
describe('Service Worker', () => {
  it('should register successfully', async () => {
    const registration = await navigator.serviceWorker.register('/sw.js');
    expect(registration).toBeDefined();
  });
});
```

## Debugging

```typescript
// Log de service worker
navigator.serviceWorker.ready.then((registration) => {
  console.log('Service Worker registrado:', registration);
  console.log('Scope:', registration.scope);
  console.log('Active:', registration.active);
});

// Log de manifest
fetch('/manifest.webmanifest')
  .then(res => res.json())
  .then(manifest => console.log('Manifest:', manifest));

// Log de cache
caches.keys().then(keys => {
  console.log('Caches disponíveis:', keys);
  
  keys.forEach(key => {
    caches.open(key).then(cache => {
      cache.keys().then(requests => {
        console.log(`Cache ${key}:`, requests.map(r => r.url));
      });
    });
  });
});
```
