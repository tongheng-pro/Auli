/* ---------- Tell the background this panel is open, so the page button can toggle it ----------
   The background closes the panel by sending { type: 'close' } on this port. */
(() => {
  let windowId;
  let retry = 0;

  function connect() {
    let port;
    try {
      port = chrome.runtime.connect({ name: 'panel:' + windowId });
    } catch {
      return; // extension was reloaded/removed: this panel is stale, nothing to tell
    }
    port.onMessage.addListener((m) => {
      retry = 0;
      if (m?.type === 'close') window.close();
    });
    // The background service worker may restart or not be ready yet; reconnect so it knows we are open.
    port.onDisconnect.addListener(() => {
      void chrome.runtime.lastError; // read it, so Chrome doesn't log "Unchecked runtime.lastError"
      retry = Math.min(retry + 1, 6);
      setTimeout(connect, 500 * retry); // 0.5s, 1s, … up to 3s
    });
  }

  chrome.windows.getCurrent((w) => {
    if (chrome.runtime.lastError || !w) return;
    windowId = w.id;
    connect();
  });
})();
