const $ = (id) => document.getElementById(id);
const logEl = $('log');
const LABELS = { created: 'Created', new: 'New', exists: 'Skipped', error: 'Error' };

function msg(text, isErr = false) {
  const d = document.createElement('div');
  d.className = 'msg' + (isErr ? ' err' : '');
  d.textContent = text;
  logEl.appendChild(d);
}

function addItem(x) {
  const row = document.createElement('div');
  row.className = 'item';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = x.name;
  name.title = x.name;
  if (x.note && x.status === 'error') {
    const n = document.createElement('span');
    n.className = 'note';
    n.textContent = x.note;
    name.appendChild(n);
  }
  const badge = document.createElement('span');
  badge.className = 'badge ' + x.status;
  badge.textContent = LABELS[x.status] || x.status;
  row.append(name, badge);
  logEl.appendChild(row);
}

function setStats(results) {
  const c = { created: 0, new: 0, exists: 0, error: 0 };
  results.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
  Object.keys(c).forEach((k) => ($('s-' + k).textContent = c[k]));
  $('stats').classList.add('show');
}

function parseInput(text) {
  const seen = new Set();
  const items = [];
  for (const raw of text.split(/\r?\n/)) {
    const [name, ...rest] = raw.split('|');
    const n = name.replace(/\s+/g, ' ').trim();
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue; // duplicate inside the pasted list
    seen.add(key);
    items.push({ name: n, description: rest.join('|').trim() });
  }
  return items;
}

function setBusy(btn, busy) {
  $('run').disabled = $('scan').disabled = busy;
  btn.classList.toggle('busy', busy);
}

async function getTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Name of the open list as shown on the page ("Chief Complain"), falls back to the type
async function listName(tabId) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const h = document.querySelector('.col-sm-9 h4') || document.querySelector('h4');
        const text = h ? [...h.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ') : '';
        return text.replace(/\s+/g, ' ').trim() || new URLSearchParams(location.search).get('type');
      },
    });
    return result || $('type').textContent;
  } catch {
    return $('type').textContent;
  }
}

async function start(createMode, btn) {
  const items = parseInput($('values').value);
  logEl.innerHTML = '';
  $('stats').classList.remove('show');
  if (!items.length) return msg('Please enter at least one value.', true);

  const tab = await getTab();
  if (!tab || !/\/backend\/value-list/.test(tab.url || '')) {
    return msg('Open a Value List page first (…/backend/value-list?type=…).', true);
  }

  if (createMode) {
    const name = await listName(tab.id);
    const n = items.length + (items.length === 1 ? ' value' : ' values');
    if (!confirm(`Are you sure you want to create ${n} in "${name}"?\n\nValues that already exist will be skipped.`)) return;
  }

  setBusy(btn, true);
  msg(createMode ? 'Scanning & creating… keep this tab open.' : 'Scanning existing values…');

  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: pageWorker,
      args: [items, createMode],
    });
    const r = res.result;
    logEl.innerHTML = '';
    if (r.error) return msg('Error: ' + r.error, true);
    $('type').textContent = r.type;
    setStats(r.results);
    r.results.forEach(addItem);
  } catch (e) {
    logEl.innerHTML = '';
    msg('Error: ' + e.message, true);
  } finally {
    setBusy(btn, false);
  }
}

// live value counter
$('values').addEventListener('input', () => {
  const n = parseInput($('values').value).length;
  $('count').textContent = n + (n === 1 ? ' value' : ' values');
});

// show current list type (side panel stays open, so refresh on tab switch / navigation)
async function showType() {
  const tab = await getTab();
  const t = $('type');
  try {
    const u = new URL(tab.url);
    if (!u.pathname.includes('/backend/value-list')) throw 0;
    t.textContent = u.searchParams.get('type') || 'value-list';
    t.classList.remove('bad');
  } catch {
    t.textContent = 'Not a Value List page';
    t.classList.add('bad');
  }
}
showType();
chrome.tabs.onActivated.addListener(showType);
chrome.tabs.onUpdated.addListener((id, info, tab) => { if (tab.active && info.url) showType(); });

$('scan').addEventListener('click', (e) => start(false, e.currentTarget));
$('run').addEventListener('click', (e) => start(true, e.currentTarget));

/* ---------- Runs inside the page (MAIN world, has jQuery/DataTables) ---------- */
async function pageWorker(items, createMode) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const norm = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const $ = window.jQuery;
  if (!$ || !$.fn.dataTable) return { error: 'jQuery/DataTables not found on this page.' };

  const tableEl = document.querySelector('#dataTableBuilder') || document.querySelector('table.dataTable');
  if (!tableEl) return { error: 'Value list table not found.' };
  const dt = $(tableEl).DataTable();
  const modal = document.getElementById('model-popup');
  const type = new URLSearchParams(location.search).get('type') ||
    modal?.querySelector('[name=listable_type]')?.value || '(unknown)';

  // Wait for the next DataTable draw after calling fn()
  const drawAfter = (fn, timeout = 15000) => new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    $(tableEl).one('draw.dt', finish);
    setTimeout(finish, timeout);
    fn();
  });

  // ---- 1. Scan all existing values (server-side table: load all pages) ----
  async function scanExisting() {
    const names = new Set();
    const oldLen = dt.page.len();
    await drawAfter(() => dt.search('').page.len(100).page(0).draw(false));
    let pages = dt.page.info().pages || 1;
    for (let p = 0; p < pages; p++) {
      if (p > 0) await drawAfter(() => dt.page(p).draw(false));
      dt.rows({ page: 'current' }).data().toArray().forEach((r) => names.add(norm(r.name)));
      pages = dt.page.info().pages || pages;
    }
    await drawAfter(() => dt.page.len(oldLen).page(0).draw(false));
    return names;
  }

  const existing = await scanExisting();
  const results = [];

  // ---- 2. Create the missing ones through the page's own Add form ----
  const addBtn = [...document.querySelectorAll('a,button')].find((a) => a.textContent.trim() === 'Add');
  const isOpen = () => modal && $(modal).hasClass('in') && getComputedStyle(modal).display !== 'none';

  if (isOpen()) { $(modal).modal('hide'); await sleep(500); }

  for (const item of items) {
    if (existing.has(norm(item.name))) { results.push({ name: item.name, status: 'exists', note: 'skipped' }); continue; }
    if (!createMode) { results.push({ name: item.name, status: 'new', note: 'will be created' }); continue; }
    if (!addBtn || !modal) { results.push({ name: item.name, status: 'error', note: 'Add button/form not found' }); continue; }

    addBtn.click();
    for (let i = 0; i < 40 && !isOpen(); i++) await sleep(100);
    await sleep(300);

    const nameInput = modal.querySelector('[name=name]');
    const descInput = modal.querySelector('[name=description]');
    const idInput = modal.querySelector('[name=id]');
    if (idInput) idInput.value = '';
    nameInput.value = item.name;
    if (descInput) descInput.value = item.description || '';
    [nameInput, descInput].forEach((el) => el && el.dispatchEvent(new Event('input', { bubbles: true })));

    modal.querySelector('.saveButton').click();

    // wait for modal to close (= saved)
    let closed = false;
    for (let i = 0; i < 100; i++) { await sleep(150); if (!isOpen()) { closed = true; break; } }

    if (closed) {
      existing.add(norm(item.name));
      results.push({ name: item.name, status: 'created' });
      await sleep(700); // let the table reload
    } else {
      const msg = [...modal.querySelectorAll('.help-block,.error,.invalid-feedback,.text-danger')]
        .map((e) => e.textContent.trim()).filter(Boolean).join('; ');
      results.push({ name: item.name, status: 'error', note: msg || 'form did not close (not saved?)' });
      $(modal).modal('hide');
      await sleep(500);
    }
  }

  if (createMode) dt.draw(false);
  return { type, existingCount: existing.size - results.filter((r) => r.status === 'created').length, results };
}
