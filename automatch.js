/* ---------- Auto Match: page lists <-> EMR groups, create all in one click ---------- */
(() => {
  const el = (id) => document.getElementById(id);
  const listEl = el('am-list');
  const info = el('am-info');
  const runBtn = el('am-run');
  const allBtn = el('am-all');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let matches = [];
  let running = false;

  // "Birth Control Type (វិធីពន្យារកំណើត)" / "birth_control_type" -> "birth control type"
  const key = (s) => String(s || '')
    .replace(/\([^)]*[ក-៿][^)]*\)/g, '') // drop Khmer in brackets
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    .replace(/s\b/g, ''); // Types == Type

  // Runs in the page: the value-list links in the left list of the open tab. The top tabs (.nav-tabs)
  // are skipped: each links to the first list of another category (e.g. "Patient" -> type=contact-relation),
  // which is not on this page.
  function readValueListLinks() {
    const seen = new Map();
    document.querySelectorAll('a[href*="value-list"]').forEach((a) => {
      if (a.closest('.nav-tabs, [role="tablist"]')) return;
      const u = new URL(a.href, location.href);
      if (!/\/value-list\/?$/.test(u.pathname)) return; // skip …/value-list/create etc.
      const type = u.searchParams.get('type');
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
      .map((it) => ({ name: EMR.nameOf(it).replace(/\s+/g, ' ').trim(), it }))
      .filter((v) => v.name && !seen.has(v.name.toLowerCase()) && seen.add(v.name.toLowerCase()));
  }

  function checkbox(checked, onChange) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = checked;
    cb.addEventListener('change', () => onChange(cb.checked));
    return cb;
  }

  let shownType = null; // list open in the tab, for re-drawing after a click

  function render(currentType = shownType) {
    shownType = currentType;
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
      cb.setAttribute('aria-label', `Create values in ${m.label}`);
      cb.indeterminate = n > 0 && n < m.items.length;
      const txt = document.createElement('div');
      const b = document.createElement('b');
      b.textContent = m.label;
      const sm = document.createElement('small');
      sm.textContent = window.t ? t('sync_row_values', { n, total: m.items.length, group: g.title }) : `${n} / ${m.items.length} values · ${g.title}`;
      txt.append(b, sm);
      txt.addEventListener('click', () => cb.click());
      const tog = document.createElement('button');
      tog.type = 'button';
      tog.className = 'am-toggle' + (open ? ' open' : '');
      tog.title = open ? (window.t ? t('sync_hide_values') : 'Hide values') : (window.t ? t('sync_choose_values') : 'Choose which values to create');
      tog.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} values of ${m.label}`);
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
    el('am-count').textContent = matches.length
      ? (window.t ? `${lists} ${tPluralWord(lists, 'plural_list')} · ${vals} ${tPluralWord(vals, 'plural_value')}` : `${lists} lists · ${vals} values`)
      : '';
    const all = matches.length > 0 && matches.every((m) => picked(m).length === m.items.length);
    allBtn.hidden = !matches.length;
    allBtn.disabled = running;
    allBtn.textContent = all ? (window.t ? t('uncheck_all') : 'Uncheck all') : (window.t ? t('check_all') : 'Check all');
    runBtn.disabled = running || !vals;
  }

  async function detect() {
    if (running || !window.EMR) return;
    const tab = await getTab();
    if (!matches.length) info.textContent = window.t ? t('sync_looking') : 'Looking for matching lists…';
    matches = [];
    let page = null;
    try {
      if (!isValueListUrl(tab.url)) throw 0;
      [{ result: page }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readValueListLinks });
    } catch {
      render();
      info.textContent = window.t ? t('sync_open_page_hint') : 'Open a Value List page in this tab. Lists that match an EMR group will appear here.';
      return;
    }

    const idx = groupIndex();
    page.links.forEach((l) => {
      const g = idx.get(key(l.label)) ?? idx.get(key(l.type));
      if (g !== undefined) matches.push({ ...l, group: g, items: valuesOf(EMR.data.groups[g]) });
    });
    render(page.type);
    info.textContent = matches.length
      ? (window.t ? t('sync_matched_count', { matches: matches.length, total: page.links.length }) : `${matches.length} of ${page.links.length} lists on this page match an EMR group.`)
      : (window.t ? t('sync_none_matched', { total: page.links.length }) : `None of the ${page.links.length} lists on this page match an EMR group. Try another tab (Medical Record, Examination…), or use "One by one".`);
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
    const delay = await getDelay();
    if (!await ask({
      title: window.t ? t('sync_create_in_lists_ask', { count: todo.length, lists: tPluralWord(todo.length, 'plural_list') }) : `Create values in ${plural(todo.length, 'list')}?`,
      text: window.t ? t('sync_up_to_values', { count: total, values: tPluralWord(total, 'plural_value') }) : `Up to ${plural(total, 'value')}:`,
      items: todo.map((m) => [m.label, m.items.length]),
      notes: [
        window.t ? t('note_skip_exist') : 'Values that already exist will be skipped.',
        window.t ? t('note_wait_delay', { delay: seconds(delay), estimate: estimate(total, delay) }) : `Waits ${seconds(delay)} between values (${estimate(total, delay)} in total).`
      ],
      ok: 'Create all',
    })) return;
    const tab = await getTab();
    const startUrl = tab.url;
    running = true;
    runBtn.disabled = allBtn.disabled = true;
    setBusy(runBtn, true);
    clearResults();
    const all = [];
    const fail = (m, note) => { const x = { name: m.label, status: 'error', note }; addItem(x); all.push(x); setStats(all); };

    try {
      for (let i = 0; i < todo.length; i++) {
        const m = todo[i];
        if (i > 0 && delay) await sleep(delay * 1000); // pause between lists too
        const busyTitle = window.t ? t('sync_creating_list_n', { current: i + 1, total: todo.length, label: m.label }) : `Creating list ${i + 1} of ${todo.length}: ${m.label}…`;
        const busyDetail = ' ' + (window.t ? t('waiting_delay_busy', { delay: seconds(delay) }) : `Waiting ${seconds(delay)} between values. Keep this tab open until it finishes.`);
        notice('busy', busyTitle, busyDetail);
        await navigate(tab.id, m.url);
        const [{ result: ready }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func: waitForTable });
        msg(m.label, 'head');
        if (!ready) { fail(m, window.t ? t('sync_page_timeout') : 'The list page did not load in time. Run again to retry; existing values are skipped.'); continue; }

        const items = m.items.map((v) => ({ name: v.name, description: EMR.describe(v.it).replace(/\|/g, '/') }));
        await sleep(300);
        const [res] = await chrome.scripting.executeScript({
          target: { tabId: tab.id }, world: 'MAIN', func: pageWorker, args: [items, true, delay],
        });
        const r = res.result;
        if (r.error) { fail(m, r.error); continue; }
        r.results.forEach(addItem);
        all.push(...r.results);
        setStats(all);
      }
      summarize(all, true);
    } catch (e) {
      notice('err', window.t ? t('sync_stopped') : 'Stopped before finishing.', ` ${window.t ? t('sync_stopped_detail', { error: e.message }) : `${e.message}. Values created so far are kept. Run again to finish; existing values are skipped.`}`);
    } finally {
      running = false;
      setBusy(runBtn, false);
      await navigate(tab.id, startUrl);
      updateCount();
    }
  }

  // Every value of every list ticked -> untick all; otherwise tick all
  allBtn.addEventListener('click', () => {
    const all = matches.every((m) => picked(m).length === m.items.length);
    matches.forEach((m) => { if (all) m.items.forEach((it) => off(m).add(it.name)); else off(m).clear(); });
    render();
  });
  runBtn.addEventListener('click', runAll);
  document.addEventListener('emr-data', detect);
  document.addEventListener('lang-changed', () => { render(); updateCount(); detect(); });
  chrome.tabs.onActivated.addListener(detect);
  chrome.tabs.onUpdated.addListener((id, ch, tab) => { if (tab.active && ch.status === 'complete') detect(); });
  detect(); // EMR data may already be loaded before this script ran
})();
