/* ---------- EMR Standard Lookup: pick a group -> fill the Values box ---------- */
(() => {
  const el = (id) => document.getElementById(id);
  const groupSel = el('emr-group');
  const descSel = el('emr-desc');
  const info = el('emr-info');
  const refreshBtn = el('emr-refresh');
  let data = EMR_DEFAULT;
  enhanceSelect(groupSel, 'Search groups…');

  const store = {
    get: (k) => new Promise((r) => chrome.storage.local.get(k, (v) => r(v[k]))),
    set: (k, v) => new Promise((r) => chrome.storage.local.set({ [k]: v }, r)),
  };

  function renderGroups() {
    document.dispatchEvent(new Event('emr-data')); // let Auto Match re-match
    const keep = groupSel.value;
    groupSel.innerHTML = '<option value="">Choose a group to fill the values below</option>';
    let og = null, last = '';
    data.groups.forEach((g, i) => {
      const label = g.page === g.section ? g.page : `${g.page} › ${g.section}`;
      if (label !== last) {
        og = document.createElement('optgroup');
        og.label = last = label;
        groupSel.appendChild(og);
      }
      const o = document.createElement('option');
      o.value = i;
      o.textContent = `${g.title} · ${g.items.length}`;
      og.appendChild(o);
    });
    groupSel.value = keep;
    info.classList.remove('err');
    info.textContent = summary();
  }

  // "35 groups, 170 values. Imported from my-emr.csv on 2026-10-08."
  function summary() {
    const values = data.groups.reduce((n, g) => n + g.items.length, 0);
    const from = data.source === 'import' ? `Imported from ${data.file || 'a file'} on ${data.scannedAt}`
      : data.source === 'website' || (data !== EMR_DEFAULT && !data.source) ? `Downloaded from emr-doc.pmrs2.org on ${data.scannedAt}`
      : `Built-in values from ${data.scannedAt}`;
    return `${data.groups.length} groups, ${values} values. ${from}.`;
  }

  // Replace all EMR data (import / website) and save it in the extension
  async function setData(groups, extra = {}) {
    data = { v: 2, scannedAt: new Date().toISOString().slice(0, 10), groups, ...extra };
    await store.set('emrData', data);
    renderGroups();
  }

  // Back to the values that ship with the extension
  async function resetData() {
    data = EMR_DEFAULT;
    await new Promise((r) => chrome.storage.local.remove('emrData', r));
    renderGroups();
  }

  function describe(it) {
    switch (descSel.value) {
      case 'khmer': return it.khmer;
      case 'en': return it.description;
      case 'khmer-en': return [it.khmer, it.description].filter(Boolean).join(' - ');
      case 'code': return it.code;
      default: return '';
    }
  }

  function fill() {
    const g = data.groups[groupSel.value];
    if (!g) return;
    const lines = g.items.map((it) => {
      const d = describe(it).replace(/\|/g, '/');
      return d ? `${it.value} | ${d}` : it.value;
    });
    const ta = el('values');
    ta.value = lines.join('\n');
    ta.dispatchEvent(new Event('input')); // update the value counter
  }

  // Scan every page of the EMR docs site and save the result into the extension
  async function refresh() {
    refreshBtn.disabled = true;
    info.classList.remove('err');
    info.textContent = 'Downloading the latest values from emr-doc.pmrs2.org…';
    try {
      const groups = await emrScanSite(EMR_SOURCE_URL);
      if (!groups.length) throw new Error('No value tables found');
      await setData(groups, { source: 'website' });
    } catch (e) {
      info.classList.add('err');
      info.textContent = `Could not update EMR data (${e.message}). Check your internet connection and try again. The saved values are still used.`;
      throw e;
    } finally {
      refreshBtn.disabled = false;
    }
  }

  // used by automatch.js and emr-io.js
  window.EMR = {
    get data() { return data; },
    describe,
    summary,
    setData,
    resetData,
    refresh,
    select(i) { groupSel.value = i; groupSel.dispatchEvent(new Event('sync')); store.set('emrGroup', String(i)); fill(); },
  };

  groupSel.addEventListener('change', () => { store.set('emrGroup', groupSel.value); fill(); });
  descSel.addEventListener('change', () => { store.set('emrDescMode', descSel.value); fill(); });
  refreshBtn.addEventListener('click', () => refresh().catch(() => {}));

  (async () => {
    const saved = await store.get('emrData');
    if (saved && saved.v === 2 && saved.groups && saved.groups.length) data = saved; // ignore older single-page scans
    descSel.value = (await store.get('emrDescMode')) || 'none';
    renderGroups();
  })();
})();
