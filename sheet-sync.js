/* ---------- EMR data from a team Google Sheet: paste the link, sync now, or keep it synced ----------
   The sheet uses the same columns as the CSV export (group, code, english, khmer, description, page, section).
   It must be shared as "Anyone with the link: Viewer" (or File › Share › Publish to web).
   While auto-sync is on, the sheet is read every 30 seconds while this panel is open, and when it opens. */
(() => {
  const el = (id) => document.getElementById(id);
  const urlInput = el('sheet-url');
  const syncBtn = el('sheet-sync');
  const autoBox = el('sheet-auto');
  const status = el('sheet-status');
  const EVERY = 30 * 1000;
  let timer = null;
  let busy = false;
  let gen = 0; // bumped by pause(): a sync that started before it must not overwrite the new data

  const store = {
    get: (k) => new Promise((r) => chrome.storage.local.get(k, (v) => r(v[k]))),
    set: (o) => new Promise((r) => chrome.storage.local.set(o, r)),
  };
  const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  function show(text, err = false) {
    status.textContent = text;
    status.classList.toggle('err', err);
  }

  // Any Google Sheets link -> its CSV download URL (keeps the tab from #gid= / ?gid=)
  function csvUrl(link) {
    let u;
    try { u = new URL(link.trim()); } catch { return null; }
    if (u.hostname !== 'docs.google.com') return null;
    const gid = (u.hash.match(/gid=(\d+)/) || u.search.match(/gid=(\d+)/) || [])[1];
    const pub = u.pathname.match(/\/spreadsheets\/d\/e\/([\w-]+)/); // "Publish to web" link
    if (pub) return `https://docs.google.com/spreadsheets/d/e/${pub[1]}/pub?output=csv${gid ? `&gid=${gid}` : ''}`;
    const id = u.pathname.match(/\/spreadsheets\/d\/([\w-]+)/);
    return id ? `https://docs.google.com/spreadsheets/d/${id[1]}/export?format=csv${gid ? `&gid=${gid}` : ''}` : null;
  }

  // A creation run reads EMR.data; don't swap it underneath
  const creating = () => !!document.querySelector('#run.busy, #am-run.busy');

  async function sync({ manual = false } = {}) {
    if (busy) return;
    const src = csvUrl(urlInput.value);
    if (!src) return show('Paste a Google Sheets link (https://docs.google.com/spreadsheets/…).', true);
    if (!manual && creating()) return;
    busy = true;
    const myGen = gen;
    syncBtn.disabled = true;
    syncBtn.classList.add('busy');
    if (manual) show('Reading the Google Sheet…');
    try {
      let res;
      try { res = await fetch(src, { cache: 'no-store', credentials: 'omit' }); }
      catch { throw new Error('Could not reach Google Sheets. Check your internet connection.'); }
      const text = await res.text();
      // Not shared -> Google answers with a sign-in page instead of CSV
      if (!res.ok || /^\s*</.test(text)) {
        throw new Error('Google did not share this sheet. In the sheet, click Share › General access › "Anyone with the link" (Viewer), then sync again.');
      }
      const r = EMRIO.groupsFromCsv(text);
      if (r.errors?.length) {
        const more = r.errors.length > 3 ? ` …and ${r.errors.length - 3} more.` : '';
        throw new Error(`The sheet has problems, so your current data was kept: ${r.errors.slice(0, 3).join(' ')}${more}`);
      }
      if (!r.groups.length) throw new Error('The sheet has no values. Add rows with a group and an english name.');
      if (myGen !== gen) return; // paused while reading

      const values = r.groups.reduce((n, g) => n + g.items.length, 0);
      const same = EMR.data.source === 'sheet' && JSON.stringify(EMR.data.groups) === JSON.stringify(r.groups);
      if (!same) {
        const now = new Date();
        await EMR.setData(r.groups, { source: 'sheet', file: urlInput.value.trim(),
          syncedAt: `${now.toISOString().slice(0, 10)} ${time()}` });
      }
      show(`${same ? 'Up to date' : 'Updated'} · ${r.groups.length} groups, ${values} values · checked ${time()}` +
        (r.dupes ? ` · ${r.dupes} duplicate rows skipped` : '') + (autoBox.checked ? ' · auto-sync on' : ''));
    } catch (e) {
      show(`${e.message}${autoBox.checked ? ` (tried ${time()}, will try again)` : ''}`, true);
    } finally {
      busy = false;
      syncBtn.disabled = false;
      syncBtn.classList.remove('busy');
    }
  }

  function setAuto(on) {
    autoBox.checked = on;
    clearInterval(timer);
    timer = on ? setInterval(() => !document.hidden && sync(), EVERY) : null;
  }

  syncBtn.addEventListener('click', async () => {
    await store.set({ sheetUrl: urlInput.value.trim() });
    sync({ manual: true });
  });
  // Save the link in the browser as it's typed / pasted, and say right away if it isn't a sheet link
  const HINT = status.innerHTML;
  urlInput.addEventListener('input', () => {
    const v = urlInput.value.trim();
    store.set({ sheetUrl: v });
    const ok = !v || !!csvUrl(v);
    urlInput.classList.toggle('invalid', !ok);
    urlInput.setAttribute('aria-invalid', !ok);
    if (!ok) show('This is not a Google Sheets link. Copy it from the browser address bar while the sheet is open (https://docs.google.com/spreadsheets/d/…).', true);
    else if (status.classList.contains('err') || !v) { status.innerHTML = HINT; status.classList.remove('err'); }
    else show('Link saved. Click "Sync now" to read the sheet.');
  });
  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') syncBtn.click(); });
  autoBox.addEventListener('change', async () => {
    await store.set({ sheetUrl: urlInput.value.trim(), sheetAuto: autoBox.checked });
    setAuto(autoBox.checked);
    if (autoBox.checked) sync({ manual: true });
    else show('Auto-sync is off. Click "Sync now" to get the latest sheet.');
  });
  // Panel shown again after being hidden -> catch up right away
  document.addEventListener('visibilitychange', () => { if (!document.hidden && autoBox.checked) sync(); });

  // Import / website update / reset replace the data on purpose: stop auto-sync so it isn't overwritten
  window.SheetSync = {
    async pause() {
      gen++;
      if (!autoBox.checked) return '';
      setAuto(false);
      await store.set({ sheetAuto: false });
      show('Auto-sync is off because the data was replaced. Turn it on again to use the Google Sheet.');
      return ' Auto-sync from the Google Sheet was turned off.';
    },
  };

  (async () => {
    urlInput.value = (await store.get('sheetUrl')) || '';
    const on = !!(await store.get('sheetAuto')) && !!urlInput.value;
    setAuto(on);
    if (on) sync();
  })();
})();
