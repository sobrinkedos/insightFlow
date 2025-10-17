// Background service worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
  }
});

// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'shareWithInsightShare',
    title: 'Compartilhar com InsightShare',
    contexts: ['page', 'link', 'video']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'shareWithInsightShare') {
    chrome.action.openPopup();
  }
});
