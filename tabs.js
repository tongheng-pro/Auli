/* ---------- Tabs: Sync all / One by one (remembers the last tab) + gear: EMR data settings ---------- */
(() => {
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.pane');
  const gear = document.getElementById('open-settings');
  const settings = document.getElementById('pane-data');

  function show(name) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    panes.forEach((p) => (p.hidden = p.dataset.pane !== name));
    chrome.storage.local.set({ activeTab: name });
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t.dataset.tab));
    // Left / Right arrows move between tabs
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      show(next.dataset.tab);
    });
  });
  show('sync');
  chrome.storage.local.get('activeTab', (v) => v.activeTab && v.activeTab !== 'data' && show(v.activeTab));

  // Gear opens the EMR data page in place of the main screen; Back / Esc / gear again closes it
  function setSettings(open) {
    document.body.classList.toggle('settings-open', open);
    settings.hidden = !open;
    gear.setAttribute('aria-pressed', open);
    const label = open ? (window.t ? t('settings_btn_close') : 'Close settings') : (window.t ? t('settings_btn_aria') : 'Settings');
    gear.setAttribute('aria-label', label);
    window.scrollTo(0, 0);
    (open ? document.getElementById('close-settings') : gear).focus();
  }
  document.addEventListener('lang-changed', () => {
    if (gear) {
      const open = !settings.hidden;
      gear.setAttribute('aria-label', open ? (window.t ? t('settings_btn_close') : 'Close settings') : (window.t ? t('settings_btn_aria') : 'Settings'));
    }
  });
  gear.addEventListener('click', () => setSettings(settings.hidden));
  document.getElementById('close-settings').addEventListener('click', () => setSettings(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settings.hidden && !e.target.closest('.picker')) setSettings(false);
  });
})();
