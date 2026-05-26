(function () {
  var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SYS_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
  var SUN_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>';

  var currentMode     = 'dark';
  var toggleInstances = []; // each: { btns: {mode: el}, indicator: el }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function getSystemTheme() { return mq && mq.matches ? 'dark' : 'light'; }
  function resolveTheme(mode) { return mode === 'system' ? getSystemTheme() : (mode || 'dark'); }

  function onSystemChange() {
    if (currentMode === 'system') document.documentElement.dataset.theme = getSystemTheme();
  }

  function setIndicatorPos(el, mode) {
    if (!el) return;
    var idx = { dark: 0, system: 1, light: 2 }[mode];
    el.style.transform = (idx || 0) === 0 ? '' : 'translateX(' + (idx * 100) + '%)';
  }

  function applyMode(mode) {
    if (mq) {
      try { mq.removeEventListener('change', onSystemChange); } catch (_) {
        try { mq.removeListener(onSystemChange); } catch (_) {}
      }
    }
    currentMode = mode;
    document.documentElement.dataset.theme = resolveTheme(mode);
    if (mode === 'system' && mq) {
      try { mq.addEventListener('change', onSystemChange); } catch (_) {
        try { mq.addListener(onSystemChange); } catch (_) {}
      }
    }
    // Sync every toggle instance (masthead + mobile overlay)
    toggleInstances.forEach(function (inst) {
      Object.keys(inst.btns).forEach(function (k) {
        inst.btns[k].setAttribute('aria-pressed', k === mode ? 'true' : 'false');
      });
      setIndicatorPos(inst.indicator, mode);
    });
    try { localStorage.setItem('fm.theme', mode); } catch (_) {}
  }

  function buildToggle(extraClass) {
    var wrap = document.createElement('div');
    wrap.className = 'theme-toggle' + (extraClass ? ' ' + extraClass : '');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Colour mode');

    var MODES = [
      { mode: 'dark',   svg: MOON_SVG, label: 'Dark mode'   },
      { mode: 'system', svg: SYS_SVG,  label: 'System mode' },
      { mode: 'light',  svg: SUN_SVG,  label: 'Light mode'  },
    ];

    var inst = { btns: {}, indicator: null };
    MODES.forEach(function (m) {
      var btn = document.createElement('button');
      btn.className = 'tt-btn';
      btn.type = 'button';
      btn.dataset.mode = m.mode;
      btn.innerHTML = m.svg;
      btn.setAttribute('aria-label', m.label);
      btn.setAttribute('aria-pressed', currentMode === m.mode ? 'true' : 'false');
      btn.addEventListener('click', function () { applyMode(m.mode); });
      inst.btns[m.mode] = btn;
      wrap.appendChild(btn);
    });

    var indicator = document.createElement('span');
    indicator.className = 'tt-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    inst.indicator = indicator;
    wrap.appendChild(indicator);
    toggleInstances.push(inst);
    return { wrap: wrap, indicator: indicator };
  }

  // Apply saved preference before first paint (script is at end of body;
  // the inline <head> anti-flash script handles the true first-paint case).
  try {
    var saved = localStorage.getItem('fm.theme') || 'dark';
    currentMode = saved;
    document.documentElement.dataset.theme = resolveTheme(saved);
  } catch (_) {}

  function injectToggles() {
    // ── Masthead toggle (visible on desktop, hidden on mobile via CSS) ──
    var right = document.querySelector('.masthead-right');
    if (right) {
      var mh = buildToggle();
      var menu = right.querySelector('.menu-toggle');
      right.insertBefore(mh.wrap, menu || null);
      // Suppress transition on first placement so it doesn't animate from pos 0
      mh.indicator.style.transition = 'none';
      setIndicatorPos(mh.indicator, currentMode);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { if (mh.indicator) mh.indicator.style.transition = ''; });
      });
    }

    // ── Mobile nav overlay toggle (deferred so _nav.js builds the overlay first) ──
    setTimeout(function () {
      var inner = document.querySelector('.mobile-nav-inner');
      if (!inner) return;
      var mob = buildToggle('theme-toggle--mobile');
      var header = document.createElement('div');
      header.className = 'mobile-nav-header';
      header.appendChild(mob.wrap);
      inner.insertBefore(header, inner.firstChild);
      setIndicatorPos(mob.indicator, currentMode);
    }, 0);

    // Attach OS watcher if starting in system mode
    if (currentMode === 'system' && mq) {
      try { mq.addEventListener('change', onSystemChange); } catch (_) {
        try { mq.addListener(onSystemChange); } catch (_) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggles);
  } else {
    injectToggles();
  }
})();
