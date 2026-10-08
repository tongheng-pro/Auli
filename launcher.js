/* ---------- Floating "chat" button on Value List pages -> opens the side panel ----------
   Runs on backend pages of any host (local and production, any install path). The button only
   shows on …/value-list pages, and follows in-page navigation. */
(() => {
  // After the extension is reloaded/updated, this old copy stays in already-open tabs but can no
  // longer talk to the extension ("Extension context invalidated"). Check before every chrome.* call.
  const alive = () => { try { return !!chrome.runtime?.id; } catch { return false; } };

  // Run once per page; a copy from a reloaded extension (no longer alive) is replaced
  if (window.__vlaLauncherAlive?.()) return;
  window.__vlaLauncherAlive = alive;

  // A newer copy (after an extension reload) replaces any older button on the page,
  // including buttons from early versions that had no data-vla-launcher marker
  document.querySelectorAll('[data-vla-launcher], html > div[style*="2147483647"]').forEach((n) => {
    if (n.hasAttribute('data-vla-launcher') || (n.style.position === 'fixed' && n.style.right === '20px' && n.style.bottom === '20px')) n.remove();
  });

  if (!alive()) return;
  let icon = '';
  try { icon = chrome.runtime.getURL('icons/icon128.png'); } catch { return; }

  const host = document.createElement('div');
  host.dataset.vlaLauncher = '';
  host.style.cssText = 'all: initial; position: fixed; right: 20px; bottom: 20px; z-index: 2147483647;';
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `
    <style>
      .wrap { position: relative; display: flex; align-items: center; justify-content: flex-end; }
      button { all: unset; box-sizing: border-box; flex: none; width: 56px; height: 56px; border-radius: 50%; cursor: pointer;
        display: grid; place-items: center; background: #fff; border: 2px solid #0B63B0; overflow: hidden;
        box-shadow: 0 4px 14px rgba(0,0,0,.22); transition: transform .15s, box-shadow .15s; }
      button:hover { transform: scale(1.06); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
      button:active { transform: scale(.96); }
      button:focus-visible { outline: 3px solid #9CC3EA; outline-offset: 3px; }
      img { width: 46px; height: 46px; display: block; }
      .label { position: absolute; right: 66px; padding: 6px 10px; border-radius: 6px; background: #16191F; color: #fff;
        font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; white-space: nowrap; pointer-events: none;
        opacity: 0; transform: translateX(6px); transition: opacity .15s, transform .15s; }
      .wrap:hover .label, button:focus-visible + .label { opacity: 1; transform: none; }
      .tip { position: absolute; right: 0; bottom: 66px; width: 230px; padding: 8px 10px; border-radius: 8px; background: #16191F; color: #fff;
        font: 13px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; box-shadow: 0 4px 14px rgba(0,0,0,.25); }
      .tip[hidden] { display: none; }
      .x { position: absolute; top: -4px; right: -4px; width: 22px; height: 22px; border-radius: 50%; background: #16191F; color: #fff;
        border: 2px solid #fff; display: grid; place-items: center; font: 700 12px/1 system-ui, sans-serif; pointer-events: none;
        transform: scale(0); transition: transform .15s; }
      .wrap.open .x { transform: scale(1); }
      @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
    </style>
    <div class="tip" role="alert" hidden></div>
    <div class="wrap">
      <button type="button" aria-label="Open Auli">
        <img alt="" src="${icon}">
      </button>
      <span class="label" aria-hidden="true">Auli</span>
      <span class="x" aria-hidden="true">✕</span>
    </div>`;

  const btn = root.querySelector('button');
  const tip = root.querySelector('.tip');
  const wrap = root.querySelector('.wrap');
  const label = root.querySelector('.label');

  // Button shows whether the panel is open: ✕ badge + "Close …" label
  function setOpen(open) {
    wrap.classList.toggle('open', open);
    const text = (open ? 'Close' : 'Open') + ' Auli';
    label.textContent = open ? text : 'Auli';
    btn.setAttribute('aria-label', text);
    btn.setAttribute('aria-pressed', open);
  }

  function showTip(text, ms = 5000) {
    tip.textContent = text;
    tip.hidden = false;
    clearTimeout(showTip.t);
    if (ms) showTip.t = setTimeout(() => (tip.hidden = true), ms);
  }

  // Safe sendMessage: never throws, reports a stale (reloaded) extension as { stale: true }
  function send(msg, cb) {
    if (!alive()) return cb({ stale: true });
    try {
      chrome.runtime.sendMessage(msg, (res) => {
        if (chrome.runtime.lastError) return cb({ error: chrome.runtime.lastError.message });
        cb(res || {});
      });
    } catch (e) {
      cb(alive() ? { error: e.message } : { stale: true });
    }
  }

  btn.addEventListener('click', () => {
    send({ type: 'toggle-panel' }, (res) => {
      if (res.stale) return showTip('The extension was updated. Reload this page (F5) to use this button again.', 0);
      if (!res.ok) return showTip('Could not open the panel here. Click the extension icon in the toolbar instead.');
      setOpen(res.open);
    });
  });

  if (alive()) {
    chrome.runtime.onMessage.addListener((m) => { if (m?.type === 'panel-state') setOpen(m.open); });
    send({ type: 'panel-state?' }, (res) => { if ('open' in res) setOpen(res.open); });
  }

  const isValueList = () => /\/value-list\/?$/.test(location.pathname);
  function update() {
    if (isValueList()) { if (!host.isConnected) document.documentElement.appendChild(host); }
    else host.remove();
  }
  update();
  // The page may change its URL without reloading (pjax / history).
  // Once the extension is reloaded, this old copy goes quiet (the new copy takes over after F5).
  let last = location.href;
  const timer = setInterval(() => {
    if (!alive()) { clearInterval(timer); return; }
    if (location.href !== last) { last = location.href; update(); }
  }, 800);
})();
