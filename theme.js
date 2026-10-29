(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('#theme-toggle');
  const browserColor = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme) {
    const dark = theme !== 'light';
    root.dataset.theme = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
    toggle.querySelector('.theme-label').textContent = dark ? 'Light' : 'Dark';
    browserColor.content = dark ? '#081a24' : '#edf7f5';
  }
  applyTheme(root.dataset.theme);
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('kt-theme', theme); } catch {}
  });
  window.addEventListener('storage', event => {
    if (event.key === 'kt-theme') applyTheme(event.newValue);
  });
})();
