const $ = (id) => document.getElementById(id);
const logEl = $('log');
const LABELS = { created: 'Created', new: 'New', exists: 'Already exists', error: 'Failed' };
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Line in the results list. kind: true / 'err' = error, 'head' = list heading
function msg(text, kind = false) {
  const d = document.createElement('div');
  d.className = 'msg' + (kind === true || kind === 'err' ? ' err' : kind === 'head' ? ' head' : '');
  d.textContent = text;
  logEl.appendChild(d);
}

// Status box above the results. kind: 'info' | 'busy' | 'ok' | 'err'
function notice(kind, title, detail = '') {
  const n = $('notice');
  n.className = 'notice ' + kind;
  n.setAttribute('role', kind === 'err' ? 'alert' : 'status');
  n.innerHTML = '';
  const box = document.createElement('div');
  const b = document.createElement('b');
  b.textContent = title;
  box.appendChild(b);
  if (detail) box.append(detail);
  n.appendChild(box);
  n.hidden = false;
  $('results-head').hidden = false;
}
function clearResults() {
  $('results-head').hidden = true;
  $('notice').hidden = true;
  logEl.innerHTML = '';
  $('stats').classList.remove('show');
}

// Plain-language summary of a run
function summarize(results, createMode) {
  const c = { created: 0, new: 0, exists: 0, error: 0 };
  results.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
  if (c.error) {
    return notice('err', `${plural(c.error, 'value')} could not be created.`,
      'The reason is shown under each failed value below. Fix it on the page or try again.');
  }
  if (!createMode) {
    return c.new
      ? notice('info', `${plural(c.new, 'value')} will be created.`, ` ${c.exists} already ${c.exists === 1 ? 'exists' : 'exist'} and will be skipped. Click "Create values" to add them.`)
      : notice('ok', 'Nothing to create.', ' All values already exist in this list.');
  }
  notice('ok', c.created ? `Done. ${plural(c.created, 'value')} created.` : 'Done. Nothing new to create.',
    c.exists ? ` ${c.exists} already existed and ${c.exists === 1 ? 'was' : 'were'} skipped.` : '');
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
  $('run').disabled = $('scan').disabled = $('clear').disabled = busy;
  btn.classList.toggle('busy', busy);
}

// Value List page on any host / install path, e.g. http://hospitals.test/backend/value-list?type=hospital
// or https://my-hospital.org/hms/backend/value-list?type=… (not …/value-list/create)
function isValueListUrl(url) {
  try { return /\/value-list\/?$/.test(new URL(url).pathname); } catch { return false; }
}

// Seconds to wait after each created value (Settings › Creating), to stay under the server's rate limit.
// Assumes Laravel's usual 60 requests/minute: one value ≈ 3 requests (open form, save, reload table)
// ≈ 1.5 s of work, so at least ~1.5 s extra wait keeps it under 1 request/second. 2 s leaves a margin.
const MIN_DELAY = 2;
const MAX_DELAY = 60;
function getDelay() {
  return new Promise((r) => chrome.storage.local.get('createDelay', (v) => {
    const n = Number(v.createDelay);
    // Older saved values below the minimum are raised to it
    r(Number.isFinite(n) ? Math.min(MAX_DELAY, Math.max(MIN_DELAY, n)) : MIN_DELAY);
  }));
}
// "about 2 min" for n values (≈1.5 s per save + the wait)
function estimate(n, delay) {
  const sec = Math.ceil(n * (1.5 + delay));
  return sec < 60 ? `about ${sec} s` : `about ${Math.ceil(sec / 60)} min`;
}
const seconds = (d) => `${d} second${d === 1 ? '' : 's'}`;

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

const NOT_VALUE_LIST = ['This tab is not a Value List page.',
  ' In the hospital system go to Hospital › Value List, open a list, then try again.'];

// Error next to the Values box
function valuesError(text) {
  const help = $('values-help');
  $('values').classList.toggle('invalid', !!text);
  help.classList.toggle('err', !!text);
  if (text) help.textContent = text;
  else help.innerHTML = 'Put each value on its own line. To add a description, use <code>Name | Description</code>.';
}

async function start(createMode, btn) {
  const items = parseInput($('values').value);
  clearResults();
  if (!items.length) {
    valuesError('Enter at least one value, one per line, or pick an EMR group above.');
    $('values').focus();
    return;
  }

  const tab = await getTab();
  if (!tab || !isValueListUrl(tab.url)) return notice('err', ...NOT_VALUE_LIST);

  const delay = await getDelay();
  if (createMode) {
    const name = await listName(tab.id);
    if (!confirm(`Are you sure you want to create ${plural(items.length, 'value')} in "${name}"?\n\n` +
      `Values that already exist will be skipped.\nWaits ${seconds(delay)} between values (up to ${estimate(items.length, delay)}).`)) return;
  }

  setBusy(btn, true);
  notice('busy', createMode ? `Creating ${plural(items.length, 'value')}…` : 'Checking existing values…',
    createMode ? ` Waiting ${seconds(delay)} between values. Keep this tab open until it finishes.` : '');

  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: pageWorker,
      args: [items, createMode, delay],
    });
    const r = res.result;
    if (r.error) return notice('err', 'The page is not ready.', ` ${r.error} Reload the page and try again.`);
    $('type').textContent = 'Value List · ' + r.type;
    setStats(r.results);
    r.results.forEach(addItem);
    summarize(r.results, createMode);
  } catch (e) {
    notice('err', 'Could not work with this page.', ` ${e.message}. Reload the page and try again.`);
  } finally {
    setBusy(btn, false);
  }
}

// live value counter
$('values').addEventListener('input', () => {
  const n = parseInput($('values').value).length;
  $('count').textContent = plural(n, 'value');
  if (n) valuesError('');
});

// show current page (side panel stays open, so refresh on tab switch / navigation)
async function showType() {
  const tab = await getTab();
  const t = $('type');
  let ok = false;
  try {
    const u = new URL(tab.url);
    ok = isValueListUrl(tab.url);
    if (ok) t.textContent = 'Value List · ' + (u.searchParams.get('type') || 'value-list');
  } catch {}
  if (!ok) t.textContent = 'Not a Value List page';
  $('page-status').classList.toggle('bad', !ok);
  $('page-hint').textContent = ok ? '' : 'Go to Hospital › Value List in the hospital system and open a list.';
}
showType();
chrome.tabs.onActivated.addListener(showType);
chrome.tabs.onUpdated.addListener((id, info, tab) => { if (tab.active && info.url) showType(); });

$('scan').addEventListener('click', (e) => start(false, e.currentTarget));
$('run').addEventListener('click', (e) => start(true, e.currentTarget));
// Clear: results + the One by one form, ready for the next list
$('clear').addEventListener('click', () => {
  clearResults();
  $('values').value = '';
  $('values').dispatchEvent(new Event('input')); // reset the value counter
  valuesError('');
  const group = $('emr-group');
  group.value = '';
  group.dispatchEvent(new Event('sync')); // update the group picker label
  chrome.storage.local.set({ emrGroup: '' });
  (document.querySelector('.tab.active') || $('values')).focus();
});
$('version').textContent = 'v' + chrome.runtime.getManifest().version;

/* ---------- Runs inside the page (MAIN world, has jQuery/DataTables) ---------- */
async function pageWorker(items, createMode, delaySec = 0) {
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
  // Add button: by its create URL first, so it also works when the page is in Khmer
  const clickables = [...document.querySelectorAll('a,button')];
  const addBtn = clickables.find((a) => /value-list\/create/.test((a.getAttribute('onclick') || '') + (a.getAttribute('href') || ''))) ||
    clickables.find((a) => ['add', 'បន្ថែម'].includes(a.textContent.trim().toLowerCase())) ||
    document.querySelector('h4 .fa-plus')?.closest('a,button');
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
      await sleep(Math.max(700, delaySec * 1000)); // let the table reload + wait to avoid the rate limit
    } else {
      const msg = [...modal.querySelectorAll('.help-block,.error,.invalid-feedback,.text-danger')]
        .map((e) => e.textContent.trim()).filter(Boolean).join('; ');
      results.push({ name: item.name, status: 'error', note: msg || 'form did not close (not saved?)' });
      $(modal).modal('hide');
      await sleep(Math.max(500, delaySec * 1000));
    }
  }

  if (createMode) dt.draw(false);
  return { type, existingCount: existing.size - results.filter((r) => r.status === 'created').length, results };
}
