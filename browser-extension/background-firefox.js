// Background script for Firefox (Manifest V2)

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    browser.browserAction.openPopup();
  }
});

// Set up context menu
browser.contextMenus.create({
  id: 'shareWithInsightShare',
  title: 'Compartilhar com InsightShare',
  contexts: ['page', 'link', 'video']
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'shareWithInsightShare') {
    browser.browserAction.openPopup();
  }
});
