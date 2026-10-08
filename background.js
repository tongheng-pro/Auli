// Clicking the toolbar icon opens the side panel instead of a popup
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

// Right-click menu on the hospital site -> open the side panel
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-panel',
    title: 'Value List Auto Create',
    contexts: ['all'],
    documentUrlPatterns: ['http://hospitals.test/*', 'https://hospitals.test/*'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // must be called right away (no await before it) to keep the user gesture
  if (info.menuItemId === 'open-panel') chrome.sidePanel.open({ windowId: tab.windowId });
});
