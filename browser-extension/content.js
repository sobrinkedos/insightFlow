// Content script to detect and extract video information

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
  
  // Instagram
  else if (url.includes('instagram.com')) {
    videoInfo.platform = 'Instagram';
    videoInfo.title = document.querySelector('h1')?.textContent || 
                      document.querySelector('meta[property="og:title"]')?.content || 
                      'Vídeo do Instagram';
    videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content;
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

// Add floating button to share video
function addShareButton() {
  // Check if button already exists
  if (document.getElementById('insightshare-btn')) return;

  const button = document.createElement('button');
  button.id = 'insightshare-btn';
  button.className = 'insightshare-floating-btn';
  button.innerHTML = '🎬';
  button.title = 'Compartilhar com InsightShare';
  
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
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
