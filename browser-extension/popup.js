// Configuração da API (hardcoded para simplificar)
const API_URL = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjI4NzcsImV4cCI6MjA1MjUzODg3N30.Yz-Yz0Yz0Yz0Yz0Yz0Yz0Yz0Yz0Yz0Yz0Yz0Yz0';

// Elementos
const loginScreen = document.getElementById('loginScreen');
const shareScreen = document.getElementById('shareScreen');
const videoInfoCard = document.getElementById('videoInfo');
const loginForm = document.getElementById('loginForm');
const shareBtn = document.getElementById('shareBtn');
const logoutBtn = document.getElementById('logout');
const userEmailEl = document.getElementById('userEmail');
const statusEl = document.getElementById('status');

let currentVideoUrl = null;
let currentUser = null;

// Inicializar
init();

async function init() {
  // Verificar se há sessão salva
  const session = await getSession();
  
  if (session) {
    currentUser = session.user;
    showShareScreen();
  } else {
    showLoginScreen();
  }
  
  // Obter informações do vídeo
  getVideoInfo();
}

// Obter sessão salva
async function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['session'], (result) => {
      resolve(result.session || null);
    });
  });
}

// Salvar sessão
async function saveSession(session) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ session }, resolve);
  });
}

// Limpar sessão
async function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['session'], resolve);
  });
}

// Mostrar tela de login
function showLoginScreen() {
  loginScreen.classList.remove('hidden');
  shareScreen.classList.add('hidden');
}

// Mostrar tela de compartilhamento
function showShareScreen() {
  loginScreen.classList.add('hidden');
  shareScreen.classList.remove('hidden');
  userEmailEl.textContent = currentUser?.email || 'Usuário';
}

// Obter informações do vídeo
function getVideoInfo() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    chrome.tabs.sendMessage(currentTab.id, { action: 'getVideoInfo' }, (response) => {
      if (response && response.url) {
        currentVideoUrl = response.url;
        displayVideoInfo(response);
      }
    });
  });
}

// Exibir informações do vídeo
function displayVideoInfo(info) {
  const videoTitle = document.getElementById('videoTitle');
  const videoPlatform = document.getElementById('videoPlatform');
  const videoThumbnail = document.getElementById('videoThumbnail');

  videoTitle.textContent = info.title || 'Vídeo detectado';
  videoPlatform.textContent = info.platform || 'Plataforma desconhecida';
  
  if (info.thumbnail) {
    videoThumbnail.src = info.thumbnail;
    videoThumbnail.style.display = 'block';
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
    
    // Salvar sessão
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
    showStatus('❌ Nenhum vídeo detectado nesta página', 'error');
    return;
  }
  
  const session = await getSession();
  if (!session) {
    showStatus('❌ Sessão expirada. Faça login novamente.', 'error');
    showLoginScreen();
    return;
  }
  
  shareBtn.disabled = true;
  shareBtn.innerHTML = '<div class="spinner"></div><span>Compartilhando...</span>';
  
  try {
    // Inserir vídeo
    const response = await fetch(`${API_URL}/rest/v1/videos`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        url: currentVideoUrl,
        user_id: session.user.id,
        status: 'Processando'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao compartilhar vídeo');
    }
    
    const data = await response.json();
    const videoId = data[0]?.id;
    
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
      }).catch(console.error);
    }
    
    showStatus('✅ Vídeo compartilhado com sucesso!', 'success');
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
