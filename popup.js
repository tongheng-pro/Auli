const $ = (id) => document.getElementById(id);
const logEl = $('log');
const getLabel = (status) => {
  const map = {
    created: window.t ? t('lbl_created') : 'Created',
    new: window.t ? t('lbl_new') : 'New',
    exists: window.t ? t('lbl_exists') : 'Already exists',
    error: window.t ? t('lbl_error') : 'Failed'
  };
  return map[status] || status;
};
const plural = (n, word) => (window.tPlural ? tPlural(n, word === 'value' ? 'plural_value' : 'plural_list') : `${n} ${word}${n === 1 ? '' : 's'}`);

// Line in the results list. kind: true / 'err' = error, 'head' = list heading
function msg(text, kind = false) {
  const d = document.createElement('div');
  d.className = 'msg' + (kind === true || kind === 'err' ? ' err' : kind === 'head' ? ' head' : '');
  d.textContent = text;
  logEl.appendChild(d);
}

// Confirm dialog in Auli's own style (instead of the browser's confirm()). Resolves true on OK.
// ask({ title, text, items: [[name, count]], notes: [...], ok: 'Create', danger: false })
function ask({ title, text = '', items = [], notes = [], ok = 'OK', danger = false }) {
  const d = document.createElement('dialog');
  d.className = 'ask';
  d.setAttribute('aria-labelledby', 'ask-title');
  const h = Object.assign(document.createElement('h2'), { id: 'ask-title', textContent: title });
  d.append(h);
  if (text) d.append(Object.assign(document.createElement('p'), { textContent: text }));
  if (items.length) {
    const ul = Object.assign(document.createElement('ul'), { className: 'ask-items' });
    items.forEach(([name, count]) => {
      const li = document.createElement('li');
      li.append(Object.assign(document.createElement('span'), { textContent: name, title: name }));
      if (count !== undefined) li.append(Object.assign(document.createElement('b'), { textContent: count }));
      ul.append(li);
    });
    d.append(ul);
  }
  if (notes.length) {
    const ul = Object.assign(document.createElement('ul'), { className: 'ask-notes' });
    notes.forEach((n) => ul.append(Object.assign(document.createElement('li'), { textContent: n })));
    d.append(ul);
  }
  const row = Object.assign(document.createElement('div'), { className: 'ask-btns' });
  const no = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn-secondary', textContent: window.t ? t('dlg_cancel') : 'Cancel' });
  const okText = ok === 'Create' ? (window.t ? t('dlg_create') : 'Create')
    : ok === 'Create all' ? (window.t ? t('dlg_create_all') : 'Create all')
    : (window.t ? t('dlg_ok') : ok);
  const yes = Object.assign(document.createElement('button'), { type: 'button', className: `btn ${danger ? 'btn-danger' : 'btn-primary'}`, textContent: okText });
  row.append(no, yes);
  d.append(row);
  document.body.append(d);
  return new Promise((resolve) => {
    const close = (v) => { d.close(); d.remove(); resolve(v); };
    no.addEventListener('click', () => close(false));
    yes.addEventListener('click', () => close(true));
    d.addEventListener('cancel', (e) => { e.preventDefault(); close(false); }); // Esc
    d.addEventListener('click', (e) => { if (e.target === d) close(false); }); // click outside
    d.showModal();
    (danger ? no : yes).focus();
  });
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
    return notice('err', t('summarize_err_title', { count: c.error, values: t('plural_values') }),
      t('summarize_err_detail'));
  }
  if (!createMode) {
    return c.new
      ? notice('info', t('summarize_check_new', { count: c.new, values: t('plural_values') }),
          t('summarize_check_detail', { exists: c.exists, existsVerb: c.exists === 1 ? 'exists' : 'exist' }))
      : notice('ok', t('summarize_check_none_title'), t('summarize_check_none_detail'));
  }
  const doneTitle = c.created
    ? t('summarize_done_title', { count: c.created, values: t('plural_values') })
    : t('summarize_done_none_title');
  const doneDetail = c.exists
    ? t('summarize_done_detail', { exists: c.exists, wasWere: c.exists === 1 ? 'was' : 'were' })
    : '';
  notice('ok', doneTitle, doneDetail);
  showDoneToast(doneTitle, doneDetail);
  playDoneSound();
}

// After creating values, show a toast with anime.gif for 2 s
const DONE_GIF = 'assets/anime.gif';
const TOAST_MS = 2000;
let toastTimer = null;
let toastOn = true; // Settings › Creating, both on by default
let soundOn = true;
chrome.storage.local.get(['doneToast', 'doneSound'], (v) => { toastOn = v.doneToast !== false; soundOn = v.doneSound !== false; });
chrome.storage.onChanged.addListener((c) => {
  if (c.doneToast) toastOn = c.doneToast.newValue !== false;
  if (c.doneSound) soundOn = c.doneSound.newValue !== false;
});

// Short two-note chime, made with Web Audio so no sound file is needed
function playDoneSound() {
  if (!soundOn) return;
  try {
    const ctx = new AudioContext();
    [[659.25, 0], [987.77, 0.12]].forEach(([freq, at]) => { // E5, then B5
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + at;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.5);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {} // no audio device: stay silent
}
function showDoneToast(title, detail) {
  if (!toastOn) return;
  document.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);
  const toast = Object.assign(document.createElement('div'), { className: 'toast' });
  toast.setAttribute('role', 'status');
  const close = () => { clearTimeout(toastTimer); toast.remove(); };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // new URL so the gif starts from its first frame
    toast.append(Object.assign(document.createElement('img'), { src: DONE_GIF + '?t=' + Date.now(), alt: '' }));
  }
  const body = Object.assign(document.createElement('div'), { className: 'toast-body' });
  const text = document.createElement('div');
  text.append(Object.assign(document.createElement('b'), { textContent: title }));
  if (detail) text.append(Object.assign(document.createElement('p'), { textContent: detail.trim() }));
  const x = Object.assign(document.createElement('button'), { type: 'button', className: 'toast-close', textContent: '×' });
  x.setAttribute('aria-label', 'Close');
  x.addEventListener('click', close);
  body.append(text, x);
  toast.append(body);
  document.body.append(toast);
  toastTimer = setTimeout(close, TOAST_MS);
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
  badge.textContent = getLabel(x.status);
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
// URL type -> display name, e.g. "medchiefcomplain" -> "MedchiefComplain"
const TYPE_WORDS = ['complain'];
function formatType(type) {
  let s = String(type || '');
  for (const w of TYPE_WORDS) s = s.replace(new RegExp(w + '$', 'i'), w[0].toUpperCase() + w.slice(1));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
  return window.tEstimate ? tEstimate(n, delay) : (Math.ceil(n * (1.5 + delay)) < 60 ? `about ${Math.ceil(n * (1.5 + delay))} s` : `about ${Math.ceil(Math.ceil(n * (1.5 + delay)) / 60)} min`);
}
const seconds = (d) => (window.tSeconds ? tSeconds(d) : `${d} second${d === 1 ? '' : 's'}`);

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

// Error next to the Values box
function valuesError(text) {
  const help = $('values-help');
  $('values').classList.toggle('invalid', !!text);
  help.classList.toggle('err', !!text);
  if (text) help.textContent = text;
  else help.innerHTML = window.t ? t('values_help') : 'Put each value on its own line. To add a description, use <code>Name | Description</code>.';
}

async function start(createMode, btn) {
  const items = parseInput($('values').value);
  clearResults();
  if (!items.length) {
    valuesError(window.t ? t('val_err_empty') : 'Enter at least one value, one per line, or pick an EMR group above.');
    $('values').focus();
    return;
  }

  const tab = await getTab();
  if (!tab || !isValueListUrl(tab.url)) {
    return notice('err', window.t ? t('not_val_page_title') : 'This tab is not a Value List page.',
      ' ' + (window.t ? t('not_val_page_detail') : 'In the hospital system go to Hospital › Value List, open a list, then try again.'));
  }

  const delay = await getDelay();
  if (createMode) {
    const name = await listName(tab.id);
    if (!await ask({
      title: window.t ? t('create_values_ask', { count: items.length, values: t('plural_values') }) : `Create ${plural(items.length, 'value')}?`,
      items: [[name, plural(items.length, 'value')]],
      notes: [
        window.t ? t('note_skip_exist') : 'Values that already exist will be skipped.',
        window.t ? t('note_wait_delay', { delay: seconds(delay), estimate: estimate(items.length, delay) }) : `Waits ${seconds(delay)} between values (${estimate(items.length, delay)} in total).`
      ],
      ok: 'Create',
    })) return;
  }

  setBusy(btn, true);
  const busyTitle = createMode
    ? (window.t ? t('creating_values_busy', { count: items.length, values: t('plural_values') }) : `Creating ${plural(items.length, 'value')}…`)
    : (window.t ? t('checking_values_busy') : 'Checking existing values…');
  const busyDetail = createMode
    ? ' ' + (window.t ? t('waiting_delay_busy', { delay: seconds(delay) }) : `Waiting ${seconds(delay)} between values. Keep this tab open until it finishes.`)
    : '';
  notice('busy', busyTitle, busyDetail);

  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: pageWorker,
      args: [items, createMode, delay],
    });
    const r = res.result;
    if (r.error) return notice('err', window.t ? t('page_not_ready') : 'The page is not ready.', ` ${window.t ? t('page_reload_retry', { error: r.error }) : `${r.error} Reload the page and try again.`}`);
    $('type').textContent = 'Value List · ' + formatType(r.type);
    setStats(r.results);
    r.results.forEach(addItem);
    summarize(r.results, createMode);
  } catch (e) {
    notice('err', window.t ? t('page_could_not_work') : 'Could not work with this page.', ` ${e.message}.`);
  } finally {
    setBusy(btn, false);
  }
}

// live value counter
function updateValueCount() {
  const n = parseInput($('values').value).length;
  $('count').textContent = plural(n, 'value');
  if (n) valuesError('');
}
$('values').addEventListener('input', updateValueCount);

// show current page (side panel stays open, so refresh on tab switch / navigation)
async function showType() {
  const tab = await getTab();
  const tEl = $('type');
  let ok = false;
  try {
    const u = new URL(tab.url);
    ok = isValueListUrl(tab.url);
    if (ok) tEl.textContent = 'Value List · ' + formatType(u.searchParams.get('type') || 'value-list');
  } catch {}
  if (!ok) tEl.textContent = window.t ? t('page_not_valuelist') : 'Not a Value List page';
  $('page-status').classList.toggle('bad', !ok);
  $('page-hint').textContent = ok ? '' : (window.t ? t('page_hint_bad') : 'Go to Hospital › Value List in the hospital system and open a list.');
}
showType();
chrome.tabs.onActivated.addListener(showType);
chrome.tabs.onUpdated.addListener((id, info, tab) => { if (tab.active && info.url) showType(); });
document.addEventListener('lang-changed', () => {
  showType();
  updateValueCount();
});

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
