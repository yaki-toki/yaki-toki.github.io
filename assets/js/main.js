/* Jiha Kim — academic homepage */

(function () {
  'use strict';

  var root = document.documentElement;
  var STORE_LANG = 'jk.lang';

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* optional */ }
  }

  function applyLang(lang) {
    root.setAttribute('lang', lang);
    var button = document.getElementById('lang-toggle');
    if (button) button.setAttribute('aria-pressed', String(lang === 'ko'));
  }

  var storedLang = read(STORE_LANG);
  if (storedLang !== 'ko' && storedLang !== 'en') {
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

  var printButton = document.getElementById('print-btn');
  if (printButton) printButton.addEventListener('click', function () { window.print(); });

  var tabList = document.getElementById('tabs');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#tabs [role="tab"]'));
  var panels = navLinks.map(function (link) {
    return document.getElementById(link.getAttribute('aria-controls'));
  }).filter(Boolean);
  var aliases = { patents: 'work', projects: 'work', about: 'education' };
  var activePanelId = '';

  function panelFromLocation() {
    var requested = window.location.hash.slice(1);
    requested = aliases[requested] || requested;
    return panels.some(function (panel) { return panel.id === requested; }) ? requested : 'research';
  }

  function scrollToTabs(behavior) {
    if (!tabList) return;
    var top = tabList.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top, behavior: behavior || 'auto' });
  }

  function activatePanel(id, moveViewport) {
    if (id === activePanelId) return;
    activePanelId = id;

    panels.forEach(function (panel) {
      panel.hidden = panel.id !== id;
    });

    navLinks.forEach(function (link) {
      var current = link.getAttribute('aria-controls') === id;
      link.setAttribute('aria-selected', String(current));
      link.setAttribute('tabindex', current ? '0' : '-1');
    });

    if (moveViewport) {
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.requestAnimationFrame(function () {
        scrollToTabs(reduceMotion ? 'auto' : 'smooth');
      });
    }
  }

  navLinks.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var id = link.getAttribute('aria-controls');
      window.history.pushState(null, '', '#' + id);
      activatePanel(id, true);
    });

    link.addEventListener('keydown', function (event) {
      var nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % navLinks.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + navLinks.length) % navLinks.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = navLinks.length - 1;
      if (nextIndex !== null) {
        event.preventDefault();
        navLinks[nextIndex].focus();
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        link.click();
      }
    });
  });

  window.addEventListener('popstate', function () {
    activatePanel(panelFromLocation(), true);
  });

  activatePanel(panelFromLocation(), Boolean(window.location.hash));
}());
