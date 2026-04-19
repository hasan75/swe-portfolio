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

  var nav = document.querySelector('.nav-rail');
  if (!nav) return;

  var current = window.location.pathname.split('/').pop() || 'index.html';

  nav.innerHTML = LINKS.map(function (link) {
    var isActive =
      current === link.file ||
      (link.file === 'Notes.html' && current.indexOf('Notes') === 0);
    return '<a href="' + link.file + '"' + (isActive ? ' class="active"' : '') + '>'
      + '<span class="num">' + link.num + '</span>'
      + '<span class="lbl">' + link.lbl + '</span>'
      + '</a>';
  }).join('\n  ');
})();
