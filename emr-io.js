/* ---------- EMR data tab: export / import (CSV or JSON), update from website, reset ----------
   CSV has one row per value:  group, code, english, khmer, description, page, section
   ("english" is the value's name; older files with a "value" column still import)
   Rows with the same page + section + group become one group. */
(() => {
  const el = (id) => document.getElementById(id);
  const status = el('io-status');
  const COLS = ['group', 'code', 'english', 'khmer', 'description', 'page', 'section'];
  const ALIAS = { value: 'english', 'english name': 'english', 'khmer name': 'khmer' };
  const today = () => new Date().toISOString().slice(0, 10);

  function say(kind, title, detail = '') {
    status.className = 'notice ' + kind;
    status.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    status.innerHTML = '';
    const box = document.createElement('div');
    const b = document.createElement('b');
    b.textContent = title;
    box.append(b);
    if (Array.isArray(detail)) {
      const ul = document.createElement('ul');
      detail.forEach((d) => { const li = document.createElement('li'); li.textContent = d; ul.append(li); });
      box.append(ul);
    } else if (detail) box.append(detail);
    status.append(box);
    status.hidden = false;
  }

  function showSummary() {
    if (!window.EMR) return;
    el('io-summary').textContent = EMR.summary();
  }

  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---- CSV ---- */
  const csvCell = (v) => {
    const s = String(v ?? '');
    return /[",\r\n]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  function toCsv(groups) {
    const rows = [COLS];
    groups.forEach((g) => g.items.forEach((it) =>
      rows.push([g.title, it.code, it.value, it.khmer, it.description, g.page, g.section])));
    // BOM so Excel opens Khmer text correctly
    return '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
  }

  // RFC 4180 parser: quotes, "" escapes, new lines inside quotes; "," or ";" (Excel in some regions)
  function parseCsv(text) {
    text = text.replace(/^﻿/, '');
    const firstLine = text.slice(0, text.search(/\r?\n|$/));
    const sep = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === sep) { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  // CSV rows -> groups, with row-numbered problems
  function groupsFromCsv(text) {
    const rows = parseCsv(text);
    const errors = [];
    if (!rows.length) return { errors: ['The file is empty.'] };
    const head = rows[0].map((h) => { const k = h.trim().toLowerCase().replace(/\s+/g, ' '); return ALIAS[k] || k; });
    const col = Object.fromEntries(COLS.map((c) => [c, head.indexOf(c)]));
    if (col.group < 0 || col.english < 0) {
      return { errors: [`The first row must be the column names, including "group" and "english". Found: ${rows[0].join(', ') || '(nothing)'}.`] };
    }
    const map = new Map();
    let dupes = 0;
    rows.slice(1).forEach((r, i) => {
      const line = i + 2; // row number as shown in Excel
      const get = (c) => (col[c] >= 0 ? String(r[col[c]] ?? '').replace(/\s+/g, ' ').trim() : '');
      if (r.every((c) => !String(c).trim())) return; // blank row
      const title = get('group'), value = get('english');
      if (!title) return errors.push(`Row ${line}: "group" is empty.`);
      if (!value) return errors.push(`Row ${line}: "english" is empty (group "${title}").`);
      const page = get('page') || 'Custom', section = get('section') || page;
      const key = `${page}\u0000${section}\u0000${title}`;
      if (!map.has(key)) map.set(key, { page, section, title, items: [] });
      const g = map.get(key);
      if (g.items.some((it) => it.value.toLowerCase() === value.toLowerCase())) { dupes++; return; }
      g.items.push({ code: get('code') || value, value, khmer: get('khmer'), description: get('description') });
    });
    return { groups: [...map.values()], errors, dupes };
  }

  // JSON: a previous export ({ groups: [...] }) or just the groups array
  function groupsFromJson(text) {
    let j;
    try { j = JSON.parse(text.replace(/^﻿/, '')); }
    catch (e) { return { errors: [`This is not valid JSON: ${e.message}`] }; }
    const list = Array.isArray(j) ? j : j?.groups;
    if (!Array.isArray(list)) return { errors: ['The JSON must contain a "groups" list (export a file first to see the format).'] };
    const errors = [];
    const groups = [];
    list.forEach((g, i) => {
      const n = i + 1;
      const title = String(g?.title ?? '').trim();
      if (!title) return errors.push(`Group ${n}: "title" is empty.`);
      if (!Array.isArray(g.items)) return errors.push(`Group ${n} ("${title}"): "items" must be a list.`);
      const items = [];
      g.items.forEach((it, k) => {
        const value = String(it?.value ?? '').trim();
        if (!value) return errors.push(`Group ${n} ("${title}"), item ${k + 1}: "value" is empty.`);
        items.push({ code: String(it.code ?? value), value, khmer: String(it.khmer ?? ''), description: String(it.description ?? '') });
      });
      const page = String(g.page ?? '').trim() || 'Custom';
      groups.push({ page, section: String(g.section ?? '').trim() || page, title, items });
    });
    return { groups, errors, dupes: 0 };
  }

  window.EMRIO = { groupsFromCsv }; // used by sheet-sync.js

  /* ---- Actions ---- */
  el('io-export-csv').addEventListener('click', () => {
    download(`emr-data-${today()}.csv`, toCsv(EMR.data.groups), 'text/csv;charset=utf-8');
    say('ok', 'Exported to a CSV file.', ' Open it in Excel or Google Sheets, edit it, then import it here.');
  });

  el('io-export-json').addEventListener('click', () => {
    const { groups, scannedAt } = EMR.data;
    download(`emr-data-${today()}.json`, JSON.stringify({ v: 2, scannedAt, groups }, null, 2), 'application/json');
    say('ok', 'Exported to a JSON file.');
  });

  el('io-import').addEventListener('click', () => el('io-file').click());

  el('io-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow choosing the same file again
    if (!file) return;
    let text;
    try { text = await file.text(); }
    catch { return say('err', 'Could not read this file.', ' Choose the file again.'); }

    const isJson = /\.json$/i.test(file.name) || /^\s*[[{]/.test(text.replace(/^﻿/, ''));
    const r = isJson ? groupsFromJson(text) : groupsFromCsv(text);

    if (r.errors.length) {
      const shown = r.errors.slice(0, 8);
      if (r.errors.length > shown.length) shown.push(`…and ${r.errors.length - shown.length} more.`);
      return say('err', `Nothing was imported. Fix ${r.errors.length === 1 ? 'this problem' : 'these problems'} in ${file.name} and import it again:`, shown);
    }
    if (!r.groups.length) return say('err', 'Nothing was imported.', ` ${file.name} has no values. Add at least one row with a group and an english name.`);

    const values = r.groups.reduce((n, g) => n + g.items.length, 0);
    const ok = await ask({
      title: 'Import this file?',
      items: [[file.name, `${r.groups.length} groups · ${values} values`]],
      notes: ['This replaces the current EMR data in Auli. Export first if you want a backup.',
        ...(r.dupes ? [`${r.dupes} duplicate rows will be skipped.`] : [])],
      ok: 'Import',
    });
    if (!ok) return;
    const paused = await SheetSync.pause();
    await EMR.setData(r.groups, { source: 'import', file: file.name });
    say('ok', `Imported ${r.groups.length} groups, ${values} values.`,
      (r.dupes ? ` ${r.dupes} duplicate rows were skipped.` : '') + ' The new values are ready in "Sync all" and "One by one".' + paused);
  });

  el('io-update').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (!await ask({
      title: 'Update from the emr-doc website?',
      text: 'Downloads the latest values from emr-doc.pmrs2.org.',
      notes: ['This replaces the current EMR data, including imported or Google Sheet changes.'],
      ok: 'Update',
    })) return;
    btn.disabled = true;
    btn.classList.add('busy');
    say('busy', 'Downloading from emr-doc.pmrs2.org…');
    try {
      await EMR.refresh();
      say('ok', 'EMR data updated from the website.', await SheetSync.pause());
    } catch (err) {
      say('err', 'Could not download the EMR data.', ` ${err.message}. Check your internet connection and try again. Your current data was not changed.`);
    } finally {
      btn.disabled = false;
      btn.classList.remove('busy');
    }
  });

  el('io-reset').addEventListener('click', async () => {
    if (!await ask({
      title: 'Reset to built-in data?',
      text: 'EMR data goes back to the values built into Auli.',
      notes: ['Imported, downloaded and Google Sheet changes are removed. Export first if you want to keep them.'],
      ok: 'Reset', danger: true,
    })) return;
    const paused = await SheetSync.pause();
    await EMR.resetData();
    say('ok', 'EMR data reset to the built-in values.', paused);
  });

  document.addEventListener('emr-data', () => setTimeout(showSummary));
  document.addEventListener('lang-changed', () => setTimeout(showSummary));
  showSummary();
})();
