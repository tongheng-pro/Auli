/* ---------- Picker: in-panel searchable dropdown for a <select> ----------
   The native dropdown is drawn by the OS and spills outside the side panel,
   so the <select> stays hidden as the data model and this list is drawn inline.
   Dispatch a 'sync' event on the select after changing its value/options in code. */
function enhanceSelect(select, placeholder = 'Search…') {
  const wrap = document.createElement('div');
  wrap.className = 'picker';
  wrap.innerHTML = `
    <button type="button" class="picker-btn" aria-haspopup="listbox" aria-expanded="false">
      <span class="picker-label"></span><i class="picker-chev"></i>
    </button>
    <div class="picker-pop" hidden>
      <input class="picker-search" type="search" spellcheck="false">
      <div class="picker-list" role="listbox"></div>
      <div class="picker-empty" hidden>No match</div>
    </div>`;
  select.hidden = true;
  select.after(wrap);

  const btn = wrap.querySelector('.picker-btn');
  const label = wrap.querySelector('.picker-label');
  const pop = wrap.querySelector('.picker-pop');
  const search = wrap.querySelector('.picker-search');
  const list = wrap.querySelector('.picker-list');
  const empty = wrap.querySelector('.picker-empty');
  search.placeholder = placeholder;
  let active = -1;

  const items = () => [...list.querySelectorAll('.picker-item:not([hidden])')];

  function syncLabel() {
    const o = select.selectedOptions[0];
    label.textContent = o ? o.textContent : '';
    label.classList.toggle('placeholder', !o || !o.value);
  }

  function build() {
    list.innerHTML = '';
    const add = (o, groupLabel) => {
      if (!o.value) return; // placeholder option is only shown on the button
      const d = document.createElement('div');
      d.className = 'picker-item';
      d.role = 'option';
      d.dataset.value = o.value;
      d.dataset.search = (o.textContent + ' ' + (groupLabel || '')).toLowerCase();
      d.textContent = o.textContent;
      list.appendChild(d);
    };
    [...select.children].forEach((c) => {
      if (c.tagName === 'OPTGROUP') {
        const h = document.createElement('div');
        h.className = 'picker-head';
        h.textContent = c.label;
        list.appendChild(h);
        [...c.children].forEach((o) => add(o, c.label));
      } else add(c);
    });
    syncLabel();
  }

  function filter() {
    const q = search.value.trim().toLowerCase();
    let head = null, headHas = false, any = false;
    const close = () => { if (head) head.hidden = !headHas; };
    [...list.children].forEach((n) => {
      if (n.classList.contains('picker-head')) { close(); head = n; headHas = false; return; }
      n.hidden = q && !n.dataset.search.includes(q);
      if (!n.hidden) headHas = any = true;
    });
    close();
    empty.hidden = any;
    setActive(items().findIndex((n) => n.dataset.value === select.value));
  }

  function setActive(i) {
    const all = items();
    all.forEach((n) => n.classList.remove('active'));
    active = Math.max(-1, Math.min(i, all.length - 1));
    if (all[active]) { all[active].classList.add('active'); all[active].scrollIntoView({ block: 'nearest' }); }
  }

  function open() {
    pop.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    search.value = '';
    filter();
    list.querySelectorAll('.picker-item').forEach((n) => n.classList.toggle('selected', n.dataset.value === select.value));
    search.focus();
  }

  function close() {
    pop.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function pick(value) {
    select.value = value;
    syncLabel();
    close();
    btn.focus();
    select.dispatchEvent(new Event('change'));
  }

  btn.addEventListener('click', () => (pop.hidden ? open() : close()));
  search.addEventListener('input', () => { filter(); if (active < 0) setActive(0); });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); const n = items()[active]; if (n) pick(n.dataset.value); }
    else if (e.key === 'Escape') { close(); btn.focus(); }
  });
  list.addEventListener('click', (e) => {
    const n = e.target.closest('.picker-item');
    if (n) pick(n.dataset.value);
  });
  list.addEventListener('mousemove', (e) => {
    const n = e.target.closest('.picker-item');
    if (n && !n.classList.contains('active')) setActive(items().indexOf(n));
  });
  document.addEventListener('mousedown', (e) => { if (!wrap.contains(e.target)) close(); });

  new MutationObserver(build).observe(select, { childList: true, subtree: true });
  select.addEventListener('sync', syncLabel);
  select.addEventListener('change', syncLabel);
  build();
}
