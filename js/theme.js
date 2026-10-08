/* Theme preference: apply before paint, then keep the toggle in sync. */
(function () {
  const STORAGE_KEY = 'souq-aldeir-theme';
  const root = document.documentElement;

  function setTheme(theme, persist = true) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    if (persist) localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');

    const button = document.getElementById('themeToggle');
    if (button) {
      button.textContent = dark ? '☀️' : '🌙';
      button.title = dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن';
      button.setAttribute('aria-label', button.title);
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#111827' : '#1565c0');
  }

  window.toggleTheme = function () {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  };

  setTheme(localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light', false);
  document.addEventListener('DOMContentLoaded', function () { setTheme(root.dataset.theme, false); });
})();
