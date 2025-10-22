// Configuração da API
const API_URL = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

// RapidAPI Configuration
const RAPIDAPI_KEY = '5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67';
const RAPIDAPI_HOST = 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com';

// Elementos
const loginScreen = document.getElementById('loginScreen');
const shareScreen = document.getElementById('shareScreen');
const videoInfoCard = document.getElementById('videoInfo');
const loginForm = document.getElementById('loginForm');
const shareBtn = document.getElementById('shareBtn');
const logoutBtn = document.getElementById('logout');
const reloadInfoBtn = document.getElementById('reloadInfoBtn');
const userEmailEl = document.getElementById('userEmail');
const statusEl = document.getElementById('status');

let currentVideoUrl = null;
let currentVideoData = null; // Armazena dados completos do vídeo
let currentUser = null;

// Inicializar
init();

// Botão de recarregar
if (reloadInfoBtn) {
  reloadInfoBtn.addEventListener('click', () => {
    console.log('🔄 Recarregando...');
    getVideoInfo();
  });
}

async function init() {
  const session = await getSession();
  
  if (session) {
    currentUser = session.user;
    showShareScreen();
  } else {
    showLoginScreen();
  }
  
  getVideoInfo();
}

async function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['session'], (result) => {
      resolve(result.session || null);
    });
  });
}

async function saveSession(session) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ session }, resolve);
  });
}

async function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['session'], resolve);
  });
}

function showLoginScreen() {
  loginScreen.classList.remove('hidden');
  shareScreen.classList.add('hidden');
}

function showShareScreen() {
  loginScreen.classList.add('hidden');
  shareScreen.classList.remove('hidden');
  userEmailEl.textContent = currentUser?.email || 'Usuário';
}

// Buscar informações do Instagram via RapidAPI
async function fetchInstagramData(url) {
  try {
    console.log('📡 Buscando dados do Instagram:', url);
    
    const apiUrl = `https://${RAPIDAPI_HOST}/convert?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      console.warn('⚠️ API retornou erro:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Dados completos da API:', JSON.stringify(data, null, 2));
    console.log('📋 Campos disponíveis:', Object.keys(data));
    
    // Extrair informações
    let title = 'Post do Instagram';
    let thumbnail = null;
    let videoUrl = null;
    
    if (data.media && Array.isArray(data.media) && data.media.length > 0) {
      const firstMedia = data.media[0];
      
      // Pegar thumbnail
      thumbnail = firstMedia.thumbnail || (firstMedia.type === 'image' ? firstMedia.url : null);
      
      // Pegar URL do vídeo
      if (firstMedia.type === 'video' && firstMedia.url) {
        videoUrl = firstMedia.url;
      }
    }
    
    // Pegar título/caption de várias fontes possíveis
    if (data.title && data.title !== 'Instagram') {
      title = data.title;
      console.log('✅ Título do campo title:', title);
    } else if (data.caption && data.caption.length > 5) {
      title = data.caption.substring(0, 150);
      console.log('✅ Título do campo caption:', title);
    } else if (data.description && data.description.length > 5) {
      title = data.description.substring(0, 150);
      console.log('✅ Título do campo description:', title);
    } else if (data.owner && data.owner.username) {
      title = `Post de @${data.owner.username}`;
      console.log('✅ Título do username:', title);
    } else {
      // API não retorna caption - título será gerado pela IA
      title = 'Vídeo do Instagram (título será gerado pela IA)';
      console.log('ℹ️ API não retorna caption. A IA vai gerar título e resumo após processar.');
    }
    
    console.log('📤 Retornando dados:', { title, thumbnail: !!thumbnail, videoUrl: !!videoUrl });
    
    return {
      title,
      thumbnail,
      videoUrl,
      platform: 'Instagram',
      rawData: data // Dados completos para enviar ao backend
    };
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    return null;
  }
}

// Obter informações do vídeo
async function getVideoInfo() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    
    if (!currentTab.url) return;
    
    console.log('🔍 URL da aba:', currentTab.url);
    
    // Instagram
    if (currentTab.url.includes('instagram.com')) {
      try {
        // Executar script para detectar vídeo ativo na página
        const results = await chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: () => {
            // Função para encontrar vídeo ativo
            const findActiveVideo = () => {
              // Tentar encontrar vídeo tocando
              const videos = document.querySelectorAll('video');
              for (const video of videos) {
                if (!video.paused && video.currentTime > 0) {
                  // Vídeo está tocando, tentar pegar URL do post
                  let element = video;
                  while (element && element !== document.body) {
                    // Procurar link do post
                    const link = element.querySelector('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
                    if (link) {
                      return link.href;
                    }
                    element = element.parentElement;
                  }
                }
              }
              
              // Se não encontrou vídeo tocando, tentar pegar da URL
              const currentUrl = window.location.href;
              const match = currentUrl.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/);
              if (match) {
                return match[1];
              }
              
              // Último recurso: pegar primeiro link de post visível
              const firstPostLink = document.querySelector('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
              if (firstPostLink) {
                return firstPostLink.href;
              }
              
              return null;
            };
            
            return findActiveVideo();
          }
        });
        
        const detectedUrl = results[0].result;
        console.log('📱 URL detectada:', detectedUrl);
        
        if (detectedUrl) {
          // Extrair URL limpa
          const match = detectedUrl.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+)/);
          
          if (match) {
            currentVideoUrl = match[1] + '/';
            console.log('✅ URL extraída:', currentVideoUrl);
            
            // Mostrar loading
            displayVideoInfo({
              url: currentVideoUrl,
              title: '⏳ Carregando informações...',
              platform: 'Instagram'
            });
            
            // Buscar dados via RapidAPI
            const instagramData = await fetchInstagramData(currentVideoUrl);
            
            if (instagramData) {
              currentVideoData = instagramData;
              displayVideoInfo({
                url: currentVideoUrl,
                title: instagramData.title,
                thumbnail: instagramData.thumbnail,
                platform: 'Instagram'
              });
            } else {
              displayVideoInfo({
                url: currentVideoUrl,
                title: 'Post do Instagram',
                platform: 'Instagram'
              });
            }
            return;
          }
        }
        
        // Se não detectou nada
        console.warn('⚠️ Nenhum vídeo detectado');
        displayVideoInfo({
          url: currentTab.url,
          title: '⚠️ Nenhum vídeo detectado. Role até um vídeo e tente novamente.',
          platform: 'Instagram'
        });
        currentVideoUrl = null;
      } catch (error) {
        console.error('❌ Erro:', error);
      }
      return;
    }
    
    // YouTube e outras plataformas
    currentVideoUrl = currentTab.url;
    
    chrome.tabs.sendMessage(currentTab.id, { action: 'getVideoInfo' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        displayVideoInfo({
          url: currentVideoUrl,
          title: currentTab.title,
          platform: getPlatformFromUrl(currentTab.url)
        });
        return;
      }
      
      if (response.url) {
        currentVideoUrl = response.url;
        displayVideoInfo(response);
      }
    });
  });
}

function getPlatformFromUrl(url) {
  if (url.includes('youtube.com')) return 'YouTube';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('dailymotion.com')) return 'Dailymotion';
  return 'Desconhecida';
}

function displayVideoInfo(info) {
  const videoTitle = document.getElementById('videoTitle');
  const videoPlatform = document.getElementById('videoPlatform');
  const videoThumbnail = document.getElementById('videoThumbnail');

  videoTitle.textContent = info.title || 'Vídeo detectado';
  videoPlatform.textContent = info.platform || 'Plataforma desconhecida';
  
  if (info.thumbnail) {
    // Usar proxy de imagem para evitar CORS do Instagram
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(info.thumbnail)}&w=120&h=90&fit=cover`;
    videoThumbnail.src = proxyUrl;
    videoThumbnail.style.display = 'block';
    
    // Fallback se o proxy falhar
    videoThumbnail.onerror = () => {
      console.warn('Erro ao carregar thumbnail via proxy');
      videoThumbnail.style.display = 'none';
    };
  } else {
    videoThumbnail.style.display = 'none';
  }

  videoInfoCard.classList.remove('hidden');
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<div class="spinner"></div><span>Entrando...</span>';
  
  try {
    const response = await fetch(`${API_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Email ou senha incorretos');
    }
    
    const data = await response.json();
    currentUser = data.user;
    
    await saveSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    });
    
    showShareScreen();
    showStatus('✅ Login realizado com sucesso!', 'success');
    
  } catch (error) {
    showStatus('❌ ' + error.message, 'error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>🔐 Entrar</span>';
  }
});

// Compartilhar vídeo
shareBtn.addEventListener('click', async () => {
  if (!currentVideoUrl) {
    showStatus('❌ Nenhum vídeo válido detectado', 'error');
    return;
  }
  
  console.log('🎬 Compartilhando:', currentVideoUrl);
  console.log('📦 Dados do vídeo:', currentVideoData);
  
  const session = await getSession();
  if (!session) {
    showStatus('❌ Sessão expirada', 'error');
    showLoginScreen();
    return;
  }
  
  shareBtn.disabled = true;
  shareBtn.innerHTML = '<div class="spinner"></div><span>Compartilhando...</span>';
  
  try {
    // Preparar dados para enviar
    const videoPayload = {
      url: currentVideoUrl,
      user_id: session.user.id,
      status: 'Processando'
    };
    
    // Se tiver dados do Instagram, adicionar
    if (currentVideoData && currentVideoData.platform === 'Instagram') {
      if (currentVideoData.title) {
        videoPayload.title = currentVideoData.title;
      }
      if (currentVideoData.thumbnail) {
        videoPayload.thumbnail_url = currentVideoData.thumbnail;
      }
      if (currentVideoData.videoUrl) {
        videoPayload.video_url = currentVideoData.videoUrl;
      }
    }
    
    console.log('📤 Enviando para Supabase:', videoPayload);
    
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
    
    console.log('✅ Vídeo inserido:', videoId);
    
    if (videoId) {
      // Processar vídeo
      fetch(`${API_URL}/functions/v1/process-video`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ video_id: videoId })
      }).catch(err => console.error('Erro no processamento:', err));
    }
    
    showStatus('✅ Vídeo compartilhado!', 'success');
    setTimeout(() => window.close(), 2000);
    
  } catch (error) {
    showStatus('❌ ' + error.message, 'error');
  } finally {
    shareBtn.disabled = false;
    shareBtn.innerHTML = '<span>📤 Compartilhar Vídeo</span>';
  }
});

// Logout
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  await clearSession();
  currentUser = null;
  showLoginScreen();
  showStatus('Você saiu da conta', 'info');
});

// Mostrar status
function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.classList.remove('hidden');
  
  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 5000);
}
