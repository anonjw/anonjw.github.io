/**
 * Point d'entrée : langue, liaison des contrôles, premier rendu.
 * Doit être chargé en dernier (voir l'ordre des scripts dans index.html).
 */

const CHART_ERROR = '<div class="err">Chart.js n’a pas pu être chargé (js/vendor/chart.umd.js) / could not be loaded / no se pudo cargar.</div>';

// Applique la langue courante : textes, drapeaux, méthodologie, événements, puis reconstruit l'onglet affiché.
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
  // Repères numérotés du graphique, puis les autres événements (repliés).
  const ev = tr('events');
  $('evl').innerHTML = KEY_EVENTS.map((ei, n) => `<p class="ev"><b>${n + 1}</b>${EVENT_YEARS[ei]} · ${ev[ei]}</p>`).join('');
  const others = EVENT_YEARS.map((y, i) => i).filter(i => !KEY_EVENTS.includes(i));
  $('evmoreS').textContent = tr('evMore').replace('{n}', others.length);
  $('evmore').innerHTML = others.map(i => `<p class="ev plain">${EVENT_YEARS[i]} · ${ev[i]}</p>`).join('');
  mkButtons();
  paint();
  showTab(tab);
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
  $('pr').oninput = () => setIntensity(+$('pr').value);
  $('shareBtn').onclick = copyLink;
  $('dlBtn').onclick = downloadChart;
  // Navigation par l'adresse (liens #sources, #t=dons…, boutons précédent / suivant).
  window.addEventListener('hashchange', () => {
    readHash();
    paint();
    showTab(tab);
  });
}

function init() {
  if (!window.Chart) {
    document.querySelector('.chartbox').innerHTML = CHART_ERROR;
    return;
  }
  bindControls();
  setP(1);
  readHash();
  $('pr').value = PRES;
  applyLang();
  urlSync = true;
}

init();
