// Content script to detect and extract video information

// Detecta se a extensão foi recarregada
let extensionValid = true;

// Monitora se o contexto da extensão ainda é válido
if (chrome.runtime?.id) {
  chrome.runtime.connect({ name: 'content-script' }).onDisconnect.addListener(() => {
    extensionValid = false;
    console.log('⚠️ [Extension] Contexto invalidado - recarregue a página');
  });
}

function getVideoInfo() {
  const url = window.location.href;
  let videoInfo = {
    url: url,
    title: document.title,
    platform: 'Desconhecido',
    thumbnail: null
  };

  // YouTube
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    
    videoInfo.platform = 'YouTube';
    videoInfo.url = `https://www.youtube.com/watch?v=${videoId}`;
    videoInfo.title = document.querySelector('h1.ytd-watch-metadata yt-formatted-string')?.textContent || 
                      document.querySelector('h1.title')?.textContent || 
                      document.title;
    videoInfo.thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  
  // Instagram (Reels, Posts, TV)
  else if (url.includes('instagram.com')) {
    videoInfo.platform = 'Instagram';
    
    // Extrair URL limpa (remover parâmetros desnecessários)
    const match = url.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[^\/\?]+)/);
    if (match) {
      videoInfo.url = match[1] + '/';
    }
    
    // Tentar pegar título de várias fontes
    videoInfo.title = document.querySelector('h1')?.textContent?.trim() || 
                      document.querySelector('meta[property="og:title"]')?.content || 
                      document.querySelector('meta[name="description"]')?.content?.substring(0, 100) ||
                      'Post do Instagram';
    
    // Thumbnail
    videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content ||
                         document.querySelector('meta[property="og:image:secure_url"]')?.content;
  }
  
  // TikTok
  else if (url.includes('tiktok.com')) {
    videoInfo.platform = 'TikTok';
    videoInfo.title = document.querySelector('h1')?.textContent || 
                      document.querySelector('meta[property="og:title"]')?.content || 
                      'Vídeo do TikTok';
    videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content;
  }
  
  // Vimeo
  else if (url.includes('vimeo.com')) {
    videoInfo.platform = 'Vimeo';
    videoInfo.title = document.querySelector('h1')?.textContent || 
                      document.querySelector('meta[property="og:title"]')?.content || 
                      'Vídeo do Vimeo';
    videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content;
  }
  
  // Dailymotion
  else if (url.includes('dailymotion.com')) {
    videoInfo.platform = 'Dailymotion';
    videoInfo.title = document.querySelector('h1')?.textContent || 
                      document.querySelector('meta[property="og:title"]')?.content || 
                      'Vídeo do Dailymotion';
    videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content;
  }

  return videoInfo;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoInfo') {
    const videoInfo = getVideoInfo();
    sendResponse(videoInfo);
  }
  return true;
});

// Configuração da API
const API_URL = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

// RapidAPI Configuration
const RAPIDAPI_KEY = '5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67';
const RAPIDAPI_HOST = 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com';

// Buscar informações do Instagram via RapidAPI
async function fetchInstagramData(url) {
  try {
    console.log('📡 [Floating] Buscando dados do Instagram:', url);
    
    const apiUrl = `https://${RAPIDAPI_HOST}/convert?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      console.warn('⚠️ [Floating] API retornou erro:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ [Floating] Dados da API recebidos');
    
    // Extrair informações
    let title = 'Post do Instagram';
    let thumbnail = null;
    let videoUrl = null;
    
    if (data.media && Array.isArray(data.media) && data.media.length > 0) {
      const firstMedia = data.media[0];
      thumbnail = firstMedia.thumbnail || (firstMedia.type === 'image' ? firstMedia.url : null);
      if (firstMedia.type === 'video' && firstMedia.url) {
        videoUrl = firstMedia.url;
      }
    }
    
    // Pegar título/caption
    if (data.title && data.title !== 'Instagram') {
      title = data.title;
    } else if (data.caption && data.caption.length > 5) {
      title = data.caption.substring(0, 150);
    } else if (data.description && data.description.length > 5) {
      title = data.description.substring(0, 150);
    } else if (data.owner && data.owner.username) {
      title = `Post de @${data.owner.username}`;
    } else {
      title = 'Vídeo do Instagram (título será gerado pela IA)';
    }
    
    return { title, thumbnail, videoUrl, platform: 'Instagram' };
  } catch (error) {
    console.error('❌ [Floating] Erro ao buscar dados:', error);
    return null;
  }
}

// Obter sessão do usuário
async function getSession() {
  return new Promise((resolve, reject) => {
    try {
      // Verifica se o contexto da extensão ainda é válido
      if (!extensionValid || !chrome.runtime?.id) {
        reject(new Error('Extension context invalidated. Please reload the page.'));
        return;
      }
      
      chrome.storage.local.get(['session'], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(result.session || null);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Compartilhar vídeo diretamente
async function shareVideo(videoUrl, videoData) {
  try {
    // Verifica se o contexto da extensão ainda é válido
    if (!extensionValid || !chrome.runtime?.id) {
      console.log('❌ [Floating] Contexto da extensão invalidado');
      showFloatingNotification('⚠️ Recarregue a página para usar a extensão', 'error');
      return;
    }
    
    const session = await getSession();
    
    if (!session || !session.access_token) {
      console.log('❌ [Floating] Usuário não está logado');
      showFloatingNotification('❌ Faça login na extensão primeiro', 'error');
      // Abrir popup da extensão
      try {
        chrome.runtime.sendMessage({ action: 'openPopup' });
      } catch (e) {
        console.log('Não foi possível abrir popup:', e);
      }
      return;
    }
    
    console.log('🎬 [Floating] Compartilhando vídeo:', videoUrl);
    
    // Preparar dados para enviar
    const videoPayload = {
      url: videoUrl,
      user_id: session.user.id,
      status: 'Processando'
    };
    
    // Se tiver dados do Instagram, adicionar
    if (videoData) {
      if (videoData.title) videoPayload.title = videoData.title;
      if (videoData.thumbnail) videoPayload.thumbnail_url = videoData.thumbnail;
      if (videoData.videoUrl) videoPayload.video_url = videoData.videoUrl;
    }
    
    console.log('📤 [Floating] Enviando para Supabase');
    
    // Inserir vídeo
    const response = await fetch(`${API_URL}/rest/v1/videos`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(videoPayload)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao compartilhar');
    }
    
    const data = await response.json();
    const videoId = data[0]?.id;
    
    console.log('✅ [Floating] Vídeo inserido:', videoId);
    
    if (videoId) {
      // Processar vídeo em background
      fetch(`${API_URL}/functions/v1/process-video`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ video_id: videoId })
      }).catch(err => console.error('[Floating] Erro no processamento:', err));
    }
    
    showFloatingNotification('✅ Vídeo compartilhado com sucesso!', 'success');
    
  } catch (error) {
    console.error('❌ [Floating] Erro:', error);
    showFloatingNotification('❌ Erro ao compartilhar: ' + error.message, 'error');
  }
}

// Mostrar notificação flutuante
function showFloatingNotification(message, type) {
  // Remover notificação anterior se existir
  const existing = document.getElementById('insightshare-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'insightshare-notification';
  notification.className = `insightshare-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remover após 4 segundos
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add floating button to share video
function addShareButton() {
  // Check if button already exists
  if (document.getElementById('insightshare-btn')) return;

  const button = document.createElement('button');
  button.id = 'insightshare-btn';
  button.className = 'insightshare-floating-btn';
  button.innerHTML = '🎬';
  button.title = 'Compartilhar com InsightShare';
  
  button.addEventListener('click', async () => {
    // Desabilitar botão temporariamente
    button.disabled = true;
    button.innerHTML = '⏳';
    
    try {
      const videoInfo = getVideoInfo();
      const url = window.location.href;
      
      console.log('🎯 [Floating] Clique no botão flutuante');
      console.log('📍 [Floating] URL:', url);
      console.log('📋 [Floating] Info:', videoInfo);
      
      let videoData = null;
      let videoUrl = videoInfo.url;
      
      // Se for Instagram, buscar dados via API
      if (url.includes('instagram.com')) {
        // Detectar vídeo ativo
        const findActiveVideo = () => {
          const videos = document.querySelectorAll('video');
          for (const video of videos) {
            if (!video.paused && video.currentTime > 0) {
              let element = video;
              while (element && element !== document.body) {
                const link = element.querySelector('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
                if (link) return link.href;
                element = element.parentElement;
              }
            }
          }
          
          const currentUrl = window.location.href;
          const match = currentUrl.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/);
          if (match) return match[1];
          
          const firstPostLink = document.querySelector('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
          if (firstPostLink) return firstPostLink.href;
          
          return null;
        };
        
        const detectedUrl = findActiveVideo();
        
        if (detectedUrl) {
          const match = detectedUrl.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/);
          if (match) {
            videoUrl = match[1] + '/';
            console.log('✅ [Floating] URL Instagram detectada:', videoUrl);
            
            // Buscar dados via RapidAPI
            videoData = await fetchInstagramData(videoUrl);
          }
        } else {
          showFloatingNotification('⚠️ Nenhum vídeo detectado. Role até um vídeo e tente novamente.', 'warning');
          button.disabled = false;
          button.innerHTML = '🎬';
          return;
        }
      }
      
      // Compartilhar vídeo
      await shareVideo(videoUrl, videoData);
      
    } catch (error) {
      console.error('❌ [Floating] Erro:', error);
      showFloatingNotification('❌ Erro ao processar vídeo', 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = '🎬';
    }
  });

  document.body.appendChild(button);
}

// Add button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addShareButton);
} else {
  addShareButton();
}

// Re-add button on navigation (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(addShareButton, 1000);
  }
}).observe(document, { subtree: true, childList: true });
