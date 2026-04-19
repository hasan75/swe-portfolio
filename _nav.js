(function () {
  var LINKS = [
    { num: '01', lbl: 'Opening',   file: 'index.html' },
    { num: '02', lbl: 'About',     file: 'About.html' },
    { num: '03', lbl: 'Work',      file: 'Work.html' },
    { num: '04', lbl: 'Research',  file: 'Research.html' },
    { num: '05', lbl: 'Now',       file: 'Now.html' },
    { num: '06', lbl: 'Notes',     file: 'Notes.html' },
    { num: '07', lbl: 'Commits',   file: 'Commits.html' },
    { num: '08', lbl: 'Education', file: 'Education.html' },
    { num: '09', lbl: 'Colophon',  file: 'Colophon.html' },
  ];

  var current = window.location.pathname.split('/').pop() || 'index.html';

  function active(link) {
    return current === link.file ||
      (link.file === 'Notes.html' && current.indexOf('Notes') === 0);
  }

  function linkHTML(link) {
    return '<a href="' + link.file + '"' + (active(link) ? ' class="active"' : '') + '>'
      + '<span class="num">' + link.num + '</span>'
      + '<span class="lbl">' + link.lbl + '</span>'
      + '</a>';
  }

  // ─── Desktop nav rail ───────────────────────────────────
  var rail = document.querySelector('.nav-rail');
  if (rail) {
    rail.innerHTML = LINKS.map(linkHTML).join('\n  ');
  }

  // ─── Mobile: toggle button + full-screen overlay ────────
  var mastheadRight = document.querySelector('.masthead-right');
  if (!mastheadRight) return;

  // Inject toggle button into masthead-right
  var btn = document.createElement('button');
  btn.className = 'menu-toggle';
  btn.setAttribute('aria-label', 'Open navigation');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Menu';
  mastheadRight.appendChild(btn);

  // Inject overlay into body
  var overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="mobile-nav-inner">' +
      '<nav class="mobile-nav-links" aria-label="Section index">' +
        LINKS.map(linkHTML).join('') +
      '</nav>' +
    '</div>';
  document.body.appendChild(overlay);

  function openMenu() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Close';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Menu';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    overlay.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close on nav link click, Esc, or backdrop tap
  overlay.querySelectorAll('.mobile-nav-links a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMenu();
  });
})();
