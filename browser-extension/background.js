// Background service worker

console.log('[InsightShare] Background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    try {
      chrome.action.openPopup();
    } catch (error) {
      console.error('[InsightShare] Error opening popup:', error);
    }
  }
});

// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.contextMenus.create({
      id: 'shareWithInsightShare',
      title: 'Compartilhar com InsightShare',
      contexts: ['page', 'link', 'video']
    });
    console.log('[InsightShare] Context menu created');
  } catch (error) {
    console.error('[InsightShare] Error creating context menu:', error);
  }
});

// Handle context menu clicks
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'shareWithInsightShare') {
      try {
        chrome.action.openPopup();
      } catch (error) {
        console.error('[InsightShare] Error opening popup from context menu:', error);
      }
    }
  });
}
