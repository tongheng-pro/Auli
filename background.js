// Clicking the toolbar icon opens the side panel instead of a popup
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

// Right-click menu on the hospital backend (any host and install path: local or production) -> open the side panel
chrome.runtime.onInstalled.addListener(() => {
  // Put the new floating button into hospital tabs that were already open; it replaces the old
  // copy, which lost its connection when the extension was reloaded/updated. No F5 needed.
  const patterns = chrome.runtime.getManifest().content_scripts[0].matches;
  chrome.tabs.query({ url: patterns }, (tabs) => tabs.forEach((t) =>
    chrome.scripting.executeScript({ target: { tabId: t.id }, files: ['launcher.js'] }).catch(() => {})));

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'open-panel',
      title: 'Auli',
      contexts: ['all'],
      documentUrlPatterns: ['*://*/*backend*', '*://*/*value-list*'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // must be called right away (no await before it) to keep the user gesture
  if (info.menuItemId === 'open-panel') chrome.sidePanel.open({ windowId: tab.windowId });
});

// ---- Which windows have the panel open (the panel connects a port while it is open) ----
const panels = new Map(); // windowId -> Port

function broadcast(windowId, open) {
  chrome.tabs.query({ windowId }, (tabs) => tabs.forEach((t) =>
    chrome.tabs.sendMessage(t.id, { type: 'panel-state', open }, () => void chrome.runtime.lastError)));
}

chrome.runtime.onConnect.addListener((port) => {
  if (!port.name.startsWith('panel:')) return;
  const windowId = Number(port.name.slice(6));
  panels.set(windowId, port);
  broadcast(windowId, true);
  port.onDisconnect.addListener(() => {
    if (panels.get(windowId) === port) panels.delete(windowId);
    broadcast(windowId, false);
  });
});

// Floating button on Value List pages (launcher.js) -> open or close the side panel
chrome.runtime.onMessage.addListener((m, sender, reply) => {
  if (!sender.tab) return;
  const windowId = sender.tab.windowId;

  if (m?.type === 'panel-state?') return reply({ open: panels.has(windowId) });
  if (m?.type !== 'toggle-panel') return;

  const port = panels.get(windowId);
  if (port) { // open -> ask the panel to close itself
    port.postMessage({ type: 'close' });
    return reply({ ok: true, open: false });
  }
  // closed -> open; must be called right away (no await before it) to keep the user gesture
  chrome.sidePanel.open({ windowId })
    .then(() => reply({ ok: true, open: true }))
    .catch((e) => reply({ ok: false, error: e.message }));
  return true; // reply asynchronously
});
