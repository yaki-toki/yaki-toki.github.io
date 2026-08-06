/* Jiha Kim — CV site
   Three small behaviours: language, theme, scroll reveal.
   All of them degrade to a working page when JS is unavailable. */

(function () {
  'use strict';

  var root = document.documentElement;
  var STORE_LANG = 'jk.lang';
  var STORE_THEME = 'jk.theme';

  /* ---- Scrollbar width, for the full-bleed bands ---------------------- */

  function measureChrome() {
    root.style.setProperty('--sbw', (window.innerWidth - root.clientWidth) + 'px');
    var masthead = document.querySelector('.masthead');
    if (masthead) root.style.setProperty('--mh', masthead.offsetHeight + 'px');
  }
  measureChrome();
  window.addEventListener('resize', measureChrome);

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

  /* ---- Topic selector -------------------------------------------------
     Drives both the intro copy and the diagram. The markup ships with every
     topic visible; this only narrows it once JS is confirmed running. */

  var topicBtns = Array.prototype.slice.call(document.querySelectorAll('.tsel__btn'));

  if (topicBtns.length) {
    var copies = Array.prototype.slice.call(document.querySelectorAll('.tcopy'));
    var figures = Array.prototype.slice.call(document.querySelectorAll('.tfig'));

    function showTopic(id) {
      topicBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.topic === id));
      });
      copies.concat(figures).forEach(function (el) {
        el.hidden = el.dataset.topic !== id;
      });
    }

    showTopic(topicBtns[0].dataset.topic);

    topicBtns.forEach(function (b) {
      b.addEventListener('click', function () { showTopic(b.dataset.topic); });
    });

    /* Left/right arrows move between topics, as in a radio group. */
    document.querySelector('.tsel__row').addEventListener('keydown', function (ev) {
      var i = topicBtns.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (i + 1) % topicBtns.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (i - 1 + topicBtns.length) % topicBtns.length;
      if (next === null) return;
      ev.preventDefault();
      topicBtns[next].focus();
      showTopic(topicBtns[next].dataset.topic);
    });
  }

  /* ---- Tabs ----------------------------------------------------------- */

  var tabBar = document.getElementById('tabs');

  if (tabBar) {
    var tabs = Array.prototype.slice.call(tabBar.querySelectorAll('.tab'));
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute('href').slice(1));
    });

    tabBar.setAttribute('role', 'tablist');
    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', panels[i] ? panels[i].id : '');
    });

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        if (panels[i]) panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
      // Keep the active tab in view when the bar scrolls horizontally.
      if (tabs[index].scrollIntoView) {
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }

    /* Open whichever panel the URL names, else the first. */
    function indexForHash() {
      var id = (location.hash || '').slice(1);
      if (!id) return 0;
      for (var i = 0; i < tabs.length; i++) {
        if (panels[i] && (panels[i].id === id || tabs[i].id === 'tab-' + id)) return i;
        // A deep link to something inside a panel should open that panel.
        if (panels[i] && document.getElementById(id) &&
            panels[i].contains(document.getElementById(id))) return i;
      }
      return 0;
    }

    select(indexForHash(), false);

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function (ev) {
        ev.preventDefault();
        select(i, false);
        history.replaceState(null, '', t.getAttribute('href'));
        /* If the reader has scrolled past the tab bar, bring it back to its
           pinned position (just under the masthead) instead of jumping. */
        var mh = parseFloat(getComputedStyle(root).getPropertyValue('--mh')) || 44;
        var target = tabBar.getBoundingClientRect().top + window.scrollY - mh;
        if (window.scrollY > target) window.scrollTo({ top: target, behavior: 'smooth' });
      });
    });

    tabBar.addEventListener('keydown', function (ev) {
      var current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      var next = null;
      if (ev.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (ev.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (ev.key === 'Home') next = 0;
      else if (ev.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      ev.preventDefault();
      select(next, true);
      history.replaceState(null, '', tabs[next].getAttribute('href'));
    });

    window.addEventListener('hashchange', function () { select(indexForHash(), false); });
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
