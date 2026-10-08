// Crawl every page of the EMR docs site and collect all value/lookup tables.
async function emrScanSite(startUrl) {
  const origin = new URL(startUrl).origin;
  const clean = (s) => String(s || '').replace(/[​…]/g, '').replace(/\s+/g, ' ').trim();
  const getDoc = async (u) => new DOMParser().parseFromString(await (await fetch(u, { cache: 'no-store' })).text(), 'text/html');
  const SKIP_PAGE = /\/overview\/|changelog/i;
  const SKIP_HEAD = /^(field\|type\|required\|description|field\|type\|description|field\|value|parameter\|.*|header\|.*|status code\|.*|rule\|.*)$/i;

  // table -> grid of cell texts (rowspan/colspan aware)
  const grid = (t) => {
    const rows = [...t.rows], g = [];
    rows.forEach((r, ri) => {
      g[ri] = g[ri] || [];
      let ci = 0;
      for (const c of r.cells) {
        while (g[ri][ci] !== undefined) ci++;
        const rs = c.rowSpan || 1, cs = c.colSpan || 1, v = clean(c.textContent);
        for (let a = 0; a < rs; a++) for (let b = 0; b < cs; b++) { g[ri + a] = g[ri + a] || []; g[ri + a][ci + b] = v; }
        ci += cs;
      }
    });
    return g;
  };
  // "Birth Control Typeវិធីពន្យារកំណើត" -> "Birth Control Type (វិធីពន្យារកំណើត)"
  const kmTitle = (t) => { const m = t.match(/^([^\u1780-\u17FF]+?)\s*([\u1780-\u17FF].*)$/); return m ? `${m[1]} (${m[2]})` : t; };
  const pick = (head, res) => { for (const re of res) { const i = head.findIndex((h) => re.test(h)); if (i >= 0) return i; } return -1; };

  // discover pages from the sidebar of the start page
  const first = await getDoc(startUrl);
  const pages = [...new Set([startUrl, new URL('form_values.html', startUrl).href, ...[...first.querySelectorAll('a[href]')]
    .map((a) => new URL(a.getAttribute('href'), startUrl).href.split('#')[0])
    .filter((h) => h.startsWith(origin) && /\.html$/.test(h))])];

  const groups = [];
  for (const url of pages) {
    if (SKIP_PAGE.test(url)) continue;
    const doc = url === startUrl ? first : await getDoc(url);
    const main = doc.querySelector('main') || doc.body;
    const page = clean(main.querySelector('h1')?.textContent) || url.split('/').pop();
    let h2 = '', h3 = '';
    for (const n of main.querySelectorAll('h2, h3, h4, table')) {
      if (n.tagName === 'H2') { h2 = clean(n.textContent); h3 = ''; continue; }
      if (n.tagName === 'H3' || n.tagName === 'H4') { h3 = clean(n.textContent); continue; }
      const g = grid(n);
      if (g.length < 2) continue;
      const head = g[0].map((h) => h.toLowerCase());
      if (SKIP_HEAD.test(head.join('|'))) continue;
      const iField = pick(head, [/^field \(/]);
      const iVal = pick(head, [/^value name$/, /^english value$/, /^value$/, /^category$/, /^body system$/, /^vital sign$/, /^form name$/, /^type$/, /^field$/]);
      if (iVal < 0) continue;
      const iCode = pick(head, [/^value code$/, /^code$/, /^form code$/, /code/]);
      const iKh = pick(head, [/^khmer value$/, /^khmer term$/, /^translate$/, /khmer/]);
      const iDesc = pick(head, [/^description$/, /^details/, /^what/, /^when/, /^clinical scope$/, /^concept name$/, /^normal range$/]);
      const title = h3 || h2 || page;
      const byKey = new Map();
      let lastSub = '';
      for (const row of g.slice(1)) {
        const value = row[iVal];
        if (!value) continue;
        if (iField >= 0 && row[iField]) lastSub = kmTitle(row[iField]);
        const sub = iField >= 0 ? lastSub : '';
        const key = sub || '';
        if (!byKey.has(key)) {
          const grp = { page, section: sub ? title : (h2 || page), title: sub || title, items: [] };
          byKey.set(key, grp); groups.push(grp);
        }
        byKey.get(key).items.push({
          code: iCode >= 0 ? row[iCode] || '' : '',
          value,
          khmer: iKh >= 0 ? row[iKh] || '' : '',
          description: iDesc >= 0 ? row[iDesc] || '' : '',
        });
      }
    }
  }
  return groups.filter((x) => x.items.length);
}
