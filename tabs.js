/* ---------- Tabs: Sync all from EMR / One by one (remembers the last tab) ---------- */
(() => {
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.pane');

  function show(name) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
    });
    panes.forEach((p) => (p.hidden = p.dataset.pane !== name));
    chrome.storage.local.set({ activeTab: name });
  }

  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.tab)));
  show('sync');
  chrome.storage.local.get('activeTab', (v) => v.activeTab && show(v.activeTab));
})();
