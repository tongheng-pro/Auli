/* ---------- Settings › Creating: seconds to wait between created values ---------- */
(() => {
  const input = document.getElementById('create-delay');
  const help = document.getElementById('delay-help');
  const HELP = help.textContent;

  input.min = MIN_DELAY;
  input.max = MAX_DELAY;
  getDelay().then((d) => {
    input.value = d;
    chrome.storage.local.set({ createDelay: d }); // store the raised value if an old one was too low
  });

  // Block typing a minus sign / exponent; the arrows already stop at min/max
  input.addEventListener('keydown', (e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); });

  function save() {
    const v = input.value.trim();
    const n = Number(v);
    const ok = v !== '' && Number.isFinite(n) && n >= MIN_DELAY && n <= MAX_DELAY;
    input.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', !ok);
    help.classList.toggle('err', !ok);
    if (!ok) {
      help.textContent = n < MIN_DELAY
        ? (window.t ? t('delay_err_min', { min: MIN_DELAY }) : `The minimum is ${MIN_DELAY} seconds. Less than that can go over the hospital system's rate limit.`)
        : (window.t ? t('delay_err_range', { min: MIN_DELAY, max: MAX_DELAY }) : `Enter a number of seconds from ${MIN_DELAY} to ${MAX_DELAY}.`);
      return;
    }
    help.textContent = window.t ? t('delay_help') : HELP;
    chrome.storage.local.set({ createDelay: n });
  }
  input.addEventListener('input', save);
  document.addEventListener('lang-changed', () => {
    if (!input.classList.contains('invalid')) {
      help.textContent = window.t ? t('delay_help') : HELP;
    } else {
      save();
    }
  });
  // Leaving the box with an invalid number puts back the nearest allowed value
  input.addEventListener('blur', () => {
    if (!input.classList.contains('invalid')) return;
    const n = Number(input.value);
    input.value = Number.isFinite(n) && input.value.trim() !== '' ? Math.min(MAX_DELAY, Math.max(MIN_DELAY, n)) : MIN_DELAY;
    save();
  });
})();
