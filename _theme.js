(function () {
  var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SYS_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
  var SUN_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>';

  var currentMode = 'dark';
  var indicatorEl = null;
  var btns        = {};
  var mq          = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function getSystemTheme() {
    return mq && mq.matches ? 'dark' : 'light';
  }

  function resolveTheme(mode) {
    return mode === 'system' ? getSystemTheme() : (mode || 'dark');
  }

  function onSystemChange() {
    if (currentMode === 'system') {
      document.documentElement.dataset.theme = getSystemTheme();
    }
  }

  function setIndicatorPosition(mode) {
    if (!indicatorEl) return;
    var idx = { dark: 0, system: 1, light: 2 }[mode];
    if (idx === undefined) idx = 0;
    indicatorEl.style.transform = idx === 0 ? '' : 'translateX(' + (idx * 100) + '%)';
  }

  function applyMode(mode) {
    // Detach existing OS watcher before switching
    if (mq) {
      try { mq.removeEventListener('change', onSystemChange); } catch (_) {
        try { mq.removeListener(onSystemChange); } catch (_) {}
      }
    }

    currentMode = mode;
    document.documentElement.dataset.theme = resolveTheme(mode);

    // Reattach OS watcher only when in system mode
    if (mode === 'system' && mq) {
      try { mq.addEventListener('change', onSystemChange); } catch (_) {
        try { mq.addListener(onSystemChange); } catch (_) {}
      }
    }

    Object.keys(btns).forEach(function (k) {
      btns[k].setAttribute('aria-pressed', k === mode ? 'true' : 'false');
    });

    setIndicatorPosition(mode);
    try { localStorage.setItem('fm.theme', mode); } catch (_) {}
  }

  // Apply saved/system preference as early as possible (script is at end of body,
  // so the inline <head> anti-flash script already handled the first paint —
  // this keeps currentMode in sync for the toggle logic below).
  try {
    var saved = localStorage.getItem('fm.theme') || 'dark';
    currentMode = saved;
    document.documentElement.dataset.theme = resolveTheme(saved);
  } catch (_) {}

  function injectToggle() {
    var right = document.querySelector('.masthead-right');
    if (!right) return;

    var wrap = document.createElement('div');
    wrap.className = 'theme-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Colour mode');

    var modes = [
      { mode: 'dark',   svg: MOON_SVG, label: 'Dark mode'   },
      { mode: 'system', svg: SYS_SVG,  label: 'System mode' },
      { mode: 'light',  svg: SUN_SVG,  label: 'Light mode'  },
    ];

    modes.forEach(function (m) {
      var btn = document.createElement('button');
      btn.className = 'tt-btn';
      btn.type = 'button';
      btn.dataset.mode = m.mode;
      btn.innerHTML = m.svg;
      btn.setAttribute('aria-label', m.label);
      btn.setAttribute('aria-pressed', currentMode === m.mode ? 'true' : 'false');
      btn.addEventListener('click', function () { applyMode(m.mode); });
      btns[m.mode] = btn;
      wrap.appendChild(btn);
    });

    indicatorEl = document.createElement('span');
    indicatorEl.className = 'tt-indicator';
    indicatorEl.setAttribute('aria-hidden', 'true');
    wrap.appendChild(indicatorEl);

    var menu = right.querySelector('.menu-toggle');
    right.insertBefore(wrap, menu || null);

    // Place indicator instantly on first render — suppress the transition
    // so it doesn't slide in from position 0 on page load.
    indicatorEl.style.transition = 'none';
    setIndicatorPosition(currentMode);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (indicatorEl) indicatorEl.style.transition = '';
      });
    });

    // Attach OS watcher if starting in system mode
    if (currentMode === 'system' && mq) {
      try { mq.addEventListener('change', onSystemChange); } catch (_) {
        try { mq.addListener(onSystemChange); } catch (_) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }
})();
