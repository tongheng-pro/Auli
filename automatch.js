/* ---------- Auto Match: page lists <-> EMR groups, create all in one click ---------- */
(() => {
  const el = (id) => document.getElementById(id);
  const listEl = el('am-list');
  const info = el('am-info');
  const runBtn = el('am-run');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let matches = [];
  let running = false;
  let lastAuto = null; // Values text we filled ourselves (safe to replace)

  // "Birth Control Type (វិធីពន្យារកំណើត)" / "birth_control_type" -> "birth control type"
  const key = (s) => String(s || '')
    .replace(/\([^)]*[ក-៿][^)]*\)/g, '') // drop Khmer in brackets
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    .replace(/s\b/g, ''); // Types == Type

  // Runs in the page: every value-list link (left list + tabs)
  function readValueListLinks() {
    const seen = new Map();
    document.querySelectorAll('a[href*="value-list?type="]').forEach((a) => {
      const type = new URL(a.href).searchParams.get('type');
      const label = a.textContent.replace(/\s+/g, ' ').trim();
      if (type && label && !seen.has(type)) seen.set(type, { type, label, url: a.href });
    });
    const type = new URLSearchParams(location.search).get('type');
    return { links: [...seen.values()], type };
  }

  // Best EMR group for each key (duplicates: keep the one with most values)
  function groupIndex() {
    const map = new Map();
    EMR.data.groups.forEach((g, i) => {
      const k = key(g.title);
      const cur = map.get(k);
      if (!cur || g.items.length > EMR.data.groups[cur].items.length) map.set(k, i);
    });
    return map;
  }

  // What the user unticked / opened, kept while the panel is open (survives re-matching)
  const unchecked = new Map(); // type -> Set of value names
  const expanded = new Set(); // types
  const off = (m) => unchecked.get(m.type) || unchecked.set(m.type, new Set()).get(m.type);
  const picked = (m) => m.items.filter((it) => !off(m).has(it.name));

  // EMR group -> values to create (duplicates inside the group removed)
  function valuesOf(g) {
    const seen = new Set();
    return g.items
      .map((it) => ({ name: it.value.replace(/\s+/g, ' ').trim(), it }))
      .filter((v) => v.name && !seen.has(v.name.toLowerCase()) && seen.add(v.name.toLowerCase()));
  }

  function checkbox(checked, onChange) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = checked;
    cb.addEventListener('change', () => onChange(cb.checked));
    return cb;
  }

  function render(currentType) {
    const top = listEl.scrollTop; // keep scroll position when re-drawing after a click
    listEl.innerHTML = '';
    matches.forEach((m) => {
      const g = EMR.data.groups[m.group];
      const n = picked(m).length;
      const open = expanded.has(m.type);

      const row = document.createElement('div');
      row.className = 'am-row' + (m.type === currentType ? ' current' : '');
      const cb = checkbox(n > 0, (on) => {
        if (on) off(m).clear(); else m.items.forEach((it) => off(m).add(it.name));
        render(currentType);
      });
      cb.indeterminate = n > 0 && n < m.items.length;
      const txt = document.createElement('div');
      const b = document.createElement('b');
      b.textContent = m.label;
      const sm = document.createElement('small');
      sm.textContent = `${g.title} · ${n} / ${m.items.length} values`;
      txt.append(b, sm);
      txt.addEventListener('click', () => cb.click());
      const tog = document.createElement('button');
      tog.type = 'button';
      tog.className = 'am-toggle' + (open ? ' open' : '');
      tog.title = open ? 'Hide values' : 'Choose values';
      tog.setAttribute('aria-expanded', open);
      tog.addEventListener('click', () => {
        if (open) expanded.delete(m.type); else expanded.add(m.type);
        render(currentType);
      });
      row.append(cb, txt, tog);
      listEl.appendChild(row);

      if (!open) return;
      const box = document.createElement('div');
      box.className = 'am-values';
      m.items.forEach((it) => {
        const v = document.createElement('label');
        v.className = 'am-value';
        const vcb = checkbox(!off(m).has(it.name), (on) => {
          if (on) off(m).delete(it.name); else off(m).add(it.name);
          render(currentType);
        });
        const span = document.createElement('span');
        span.textContent = it.name;
        span.title = it.name;
        v.append(vcb, span);
        box.appendChild(v);
      });
      listEl.appendChild(box);
    });
    listEl.scrollTop = top;
    updateCount();
  }

  function updateCount() {
    const lists = matches.filter((m) => picked(m).length).length;
    const vals = matches.reduce((n, m) => n + picked(m).length, 0);
    el('am-count').textContent = matches.length ? `${lists} lists · ${vals} values` : '';
    runBtn.disabled = running || !vals;
  }

  async function detect() {
    if (running || !window.EMR) return;
    const tab = await getTab();
    matches = [];
    let page = null;
    try {
      if (!/\/backend\/value-list/.test(tab.url || '')) throw 0;
      [{ result: page }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readValueListLinks });
    } catch {
      render();
      info.textContent = 'Open a Value List page to match its lists with the EMR groups.';
      return;
    }

    const idx = groupIndex();
    page.links.forEach((l) => {
      const g = idx.get(key(l.label)) ?? idx.get(key(l.type));
      if (g !== undefined) matches.push({ ...l, group: g, items: valuesOf(EMR.data.groups[g]) });
    });
    render(page.type);
    info.textContent = matches.length
      ? `${matches.length} of ${page.links.length} lists on this page match an EMR group.`
      : 'No list on this page matches an EMR group.';

    // Current list matches -> pre-fill Values (unless the user typed their own)
    const cur = matches.find((m) => m.type === page.type);
    const ta = el('values');
    if (cur && (!ta.value.trim() || ta.value === lastAuto)) {
      EMR.select(cur.group);
      lastAuto = ta.value;
    }
  }

  function navigate(tabId, url) {
    return new Promise((resolve) => {
      const done = () => { chrome.tabs.onUpdated.removeListener(on); clearTimeout(t); resolve(); };
      const on = (id, ch) => { if (id === tabId && ch.status === 'complete') done(); };
      const t = setTimeout(done, 30000);
      chrome.tabs.onUpdated.addListener(on);
      chrome.tabs.update(tabId, { url });
    });
  }

  // Runs in the page: wait until the DataTable is initialised
  async function waitForTable() {
    for (let i = 0; i < 100; i++) {
      const t = document.querySelector('#dataTableBuilder') || document.querySelector('table.dataTable');
      if (window.jQuery && jQuery.fn.dataTable && t && jQuery.fn.dataTable.isDataTable(t)) return true;
      await new Promise((r) => setTimeout(r, 150));
    }
    return false;
  }

  async function runAll() {
    const todo = matches.map((m) => ({ ...m, items: picked(m) })).filter((m) => m.items.length);
    if (!todo.length) return;
    const total = todo.reduce((n, m) => n + m.items.length, 0);
    const names = todo.map((m) => `• ${m.label} (${m.items.length})`).join('\n');
    if (!confirm(`Are you sure you want to create all?\n\n${todo.length} lists · up to ${total} values:\n${names}\n\nValues that already exist will be skipped.`)) return;
    const tab = await getTab();
    const startUrl = tab.url;
    running = true;
    runBtn.disabled = true;
    setBusy(runBtn, true);
    logEl.innerHTML = '';
    $('stats').classList.remove('show');
    const all = [];

    try {
      for (let i = 0; i < todo.length; i++) {
        const m = todo[i];
        info.textContent = `Creating ${i + 1} / ${todo.length}: ${m.label}…`;
        await navigate(tab.id, m.url);
        const [{ result: ready }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func: waitForTable });
        msg(`${m.label}`);
        if (!ready) { addItem({ name: m.label, status: 'error', note: 'table did not load' }); continue; }

        const items = m.items.map((v) => ({ name: v.name, description: EMR.describe(v.it).replace(/\|/g, '/') }));
        await sleep(300);
        const [res] = await chrome.scripting.executeScript({
          target: { tabId: tab.id }, world: 'MAIN', func: pageWorker, args: [items, true],
        });
        const r = res.result;
        if (r.error) { addItem({ name: m.label, status: 'error', note: r.error }); continue; }
        r.results.forEach(addItem);
        all.push(...r.results);
        setStats(all);
      }
      info.textContent = `Done: ${todo.length} lists processed.`;
    } catch (e) {
      msg('Error: ' + e.message, true);
    } finally {
      running = false;
      setBusy(runBtn, false);
      await navigate(tab.id, startUrl);
      updateCount();
    }
  }

  runBtn.addEventListener('click', runAll);
  document.addEventListener('emr-data', detect);
  chrome.tabs.onActivated.addListener(detect);
  chrome.tabs.onUpdated.addListener((id, ch, tab) => { if (tab.active && ch.status === 'complete') detect(); });
})();
