/* Jiha Kim — CV site
   Three small behaviours: language, theme, scroll reveal.
   All of them degrade to a working page when JS is unavailable. */

(function () {
  'use strict';

  var root = document.documentElement;
  var STORE_LANG = 'jk.lang';
  var STORE_THEME = 'jk.theme';

  /* ---- Scrollbar width, for the full-bleed bands ---------------------- */

  function measureScrollbar() {
    root.style.setProperty('--sbw', (window.innerWidth - root.clientWidth) + 'px');
  }
  measureScrollbar();
  window.addEventListener('resize', measureScrollbar);

  /* Storage can throw in private mode — never let that break the page. */
  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* non-fatal */ }
  }

  /* ---- Language ------------------------------------------------------ */

  function applyLang(lang) {
    root.setAttribute('lang', lang);
    var button = document.getElementById('lang-toggle');
    if (button) button.setAttribute('aria-pressed', String(lang === 'ko'));
  }

  var storedLang = read(STORE_LANG);
  if (storedLang !== 'ko' && storedLang !== 'en') {
    // No stored choice: follow the browser, defaulting to English.
    storedLang = (navigator.language || '').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  }
  applyLang(storedLang);

  var langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = root.getAttribute('lang') === 'ko' ? 'en' : 'ko';
      applyLang(next);
      write(STORE_LANG, next);
    });
  }

  /* ---- Theme --------------------------------------------------------- */

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var storedTheme = read(STORE_THEME);
  root.setAttribute('data-theme', storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme
    : systemTheme());

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      write(STORE_THEME, next);
    });
  }

  /* ---- Scroll reveal -------------------------------------------------- */

  var targets = document.querySelectorAll('.reveal');

  /* Respect reduced motion, and show everything if the API is missing. */
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

  Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
}());
