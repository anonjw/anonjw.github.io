/**
 * Point d'entrée : langue, liaison des contrôles, premier rendu.
 * Doit être chargé en dernier (voir l'ordre des scripts dans index.html).
 */

const CHART_ERROR = '<div class="err">Chart.js n’a pas pu être chargé (js/vendor/chart.umd.js) / could not be loaded / no se pudo cargar.</div>';

// Applique la langue courante : textes, drapeaux, méthodologie, événements, puis reconstruit tous les graphiques.
function applyLang() {
  document.documentElement.lang = L;
  document.documentElement.dataset.lang = L;
  document.title = tr('title');
  document.querySelectorAll('[data-t]').forEach(e => { e.innerHTML = tr(e.dataset.t); });
  document.querySelectorAll('[data-flag]').forEach(b => {
    const a = b.dataset.flag === L;
    b.setAttribute('aria-pressed', a);
    b.style.borderColor = a ? 'var(--text-primary)' : '';
    b.style.opacity = a ? 1 : .55;
  });
  $('methode').innerHTML = DOCS[L];
  $('evl').innerHTML = EVENT_YEARS.map((y, i) => `<p class="ev"><b>${i + 1}</b>${y} · ${tr('events')[i]}</p>`).join('');
  mkButtons();
  paint();
  build();
  buildCg();
  buildRx();
  buildDn();
}

function setLang(l) {
  L = l;
  try { localStorage.setItem('jwlang', l); } catch (e) {}
  applyLang();
}

// Branche les contrôles de la page.
function bindControls() {
  document.querySelectorAll('[data-flag]').forEach(b => b.onclick = () => setLang(b.dataset.flag));
  $('bd').onchange = build;
  $('sm').onchange = () => { smooth = $('sm').checked; build(); };
  $('clr').onclick = () => { onR.clear(); paint(); build(); };
  const sl = $('pr');
  sl.oninput = () => { setP(+sl.value); build(); buildDn(); };
}

function init() {
  if (!window.Chart) {
    document.querySelector('.chartbox').innerHTML = CHART_ERROR;
    return;
  }
  bindControls();
  setP(1);
  applyLang();
}

init();
