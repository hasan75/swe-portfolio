(function () {
  var LINKS = [
    { num: '01', lbl: 'Opening',   slug: 'index'     },
    { num: '02', lbl: 'About',     slug: 'about'     },
    { num: '03', lbl: 'Work',      slug: 'work'      },
    { num: '04', lbl: 'Research',  slug: 'research'  },
    { num: '05', lbl: 'Now',       slug: 'now'       },
    { num: '06', lbl: 'Notes',     slug: 'notes'     },
    { num: '07', lbl: 'Commits',   slug: 'commits'   },
    { num: '08', lbl: 'Education', slug: 'education' },
    { num: '09', lbl: 'Colophon',  slug: 'colophon'  },
  ];

  // Parse pathname into meaningful segments (skip empty and 'index.html')
  var parts = window.location.pathname.split('/').filter(function (p) {
    return p && p !== 'index.html';
  });
  // Strip .html in case server preserves extensions (local dev)
  var current = parts.length > 0 ? parts[parts.length - 1].replace(/\.html$/, '') : 'index';

  // Depth = number of non-html segments (each adds one '../' to get back to root)
  var depth = parts.filter(function (p) { return !p.endsWith('.html'); }).length;
  var prefix = depth > 0 ? new Array(depth + 1).join('../') : '';

  function active(link) {
    if (link.slug === 'notes') {
      return parts.indexOf('notes') !== -1;
    }
    return current === link.slug;
  }

  function linkHref(link) {
    return link.slug === 'index' ? (prefix || './') : prefix + link.slug + '/';
  }

  function linkHTML(link) {
    return '<a href="' + linkHref(link) + '"' + (active(link) ? ' class="active"' : '') + '>'
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
