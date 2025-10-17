// Firefox-compatible popup script (uses browser API instead of chrome)

// Load saved settings
browser.storage.sync.get(['apiUrl', 'apiKey']).then((result) => {
  if (result.apiUrl) {
    document.getElementById('apiUrl').value = result.apiUrl;
  }
  if (result.apiKey) {
    document.getElementById('apiKey').value = result.apiKey;
  }
});

// Get current video info
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const currentTab = tabs[0];
  
  browser.tabs.sendMessage(currentTab.id, { action: 'getVideoInfo' }).then((response) => {
    if (response && response.url) {
      displayVideoInfo(response);
    }
  }).catch(() => {
    // Ignore errors if content script not loaded
  });
});

function displayVideoInfo(info) {
  const videoInfoCard = document.getElementById('videoInfo');
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

// Handle form submission
document.getElementById('shareForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiUrl = document.getElementById('apiUrl').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  const shareBtn = document.getElementById('shareBtn');
  const status = document.getElementById('status');

  // Save settings
  browser.storage.sync.set({ apiUrl, apiKey });

  // Get current tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  // Get video info
  try {
    const response = await browser.tabs.sendMessage(tab.id, { action: 'getVideoInfo' });
    
    if (!response || !response.url) {
      showStatus('Nenhum vídeo detectado nesta página', 'error');
      return;
    }

    // Show loading
    shareBtn.disabled = true;
    shareBtn.innerHTML = '<div class="spinner"></div><span>Compartilhando...</span>';

    try {
      // Share video with InsightShare
      const result = await shareVideo(apiUrl, apiKey, response.url);

      if (result.success) {
        showStatus('✅ Vídeo compartilhado com sucesso!', 'success');
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        showStatus('❌ Erro ao compartilhar: ' + (result.error || 'Erro desconhecido'), 'error');
      }
    } catch (error) {
      showStatus('❌ Erro: ' + error.message, 'error');
    } finally {
      shareBtn.disabled = false;
      shareBtn.innerHTML = '<span>📤 Compartilhar Vídeo</span>';
    }
  } catch (error) {
    showStatus('❌ Erro ao detectar vídeo: ' + error.message, 'error');
    shareBtn.disabled = false;
    shareBtn.innerHTML = '<span>📤 Compartilhar Vídeo</span>';
  }
});

async function shareVideo(apiUrl, apiKey, videoUrl) {
  try {
    // First, authenticate or get user
    const authResponse = await fetch(`${apiUrl}/auth/v1/user`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!authResponse.ok) {
      throw new Error('Erro de autenticação. Verifique sua chave de API.');
    }

    const user = await authResponse.json();

    // Insert video
    const response = await fetch(`${apiUrl}/rest/v1/videos`, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        url: videoUrl,
        user_id: user.id,
        status: 'Processando'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao compartilhar vídeo');
    }

    const data = await response.json();
    const videoId = data[0]?.id;

    if (!videoId) {
      throw new Error('Erro ao obter ID do vídeo');
    }

    // Trigger processing
    await fetch(`${apiUrl}/functions/v1/process-video`, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ video_id: videoId })
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.classList.remove('hidden');
}

// Clear settings
document.getElementById('clearSettings').addEventListener('click', (e) => {
  e.preventDefault();
  browser.storage.sync.clear().then(() => {
    document.getElementById('apiUrl').value = '';
    document.getElementById('apiKey').value = '';
    showStatus('Configurações limpas', 'info');
  });
});
