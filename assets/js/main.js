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

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#tabs a[href^="#"]'));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  function markCurrent(id) {
    navLinks.forEach(function (link) {
      var current = link.getAttribute('href') === '#' + id;
      if (current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (section) {
      if (section) observer.observe(section);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      markCurrent(link.getAttribute('href').slice(1));
    });
  });
}());
