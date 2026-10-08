/* ---------- Theme: follows the system until the user clicks the sun / moon button ----------
   Loaded in <head> so the saved theme applies before the page paints. */
(() => {
  const KEY = 'theme';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const saved = () => { // 'light' | 'dark' | null (null = follow the system; old 'auto' counts as null)
    try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; }
  };
  const isDark = () => (saved() || (media.matches ? 'dark' : 'light')) === 'dark';

  function apply() {
    const s = saved();
    if (s) document.documentElement.setAttribute('data-theme', s);
    else document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.toggle('is-dark', isDark()); // picks the sun / moon icon
    const btn = document.getElementById('theme');
    if (btn) {
      const label = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
  }
  apply();
  media.addEventListener('change', apply); // system changed (only matters while not chosen)

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme')?.addEventListener('click', () => {
      try { localStorage.setItem(KEY, isDark() ? 'light' : 'dark'); } catch {}
      apply();
    });
  });
})();
