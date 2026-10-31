/**
 * Onglets, état partageable dans l'adresse de la page (hash) et barre d'outils (copier le lien, télécharger l'image).
 * Adresse type : #t=evolution&r=world,af&d=pub&m=lin&p=1  (t onglet, r régions, d données, m échelle, p intensité,
 * s=0 sans lissage, b=1 fourchette, y année des dons, x échelle r/exjw). Les anciens liens #methode et #sources ouvrent l'onglet Sources.
 * Dépendances : ui/main-chart.js, ui/section-*.js, i18n/core.js, data/catalog.js, ui/widgets.js.
 */

const TABS = [['evolution', 'tabEvo'], ['congregations', 'tabCg'], ['reddit', 'tabRx'], ['dons', 'tabDn'], ['sources', 'tabSrc']];

// Reconstruction du contenu d'un onglet à son affichage (les graphiques masqués ne sont pas construits).
const TAB_BUILD = {
  evolution: () => build(),
  congregations: () => buildCg(),
  reddit: () => buildRx(),
  dons: () => buildDn(),
  sources: () => {}
};
const TAB_CANVAS = { evolution: 'c', congregations: 'cgc', reddit: 'rxc', dons: 'dnc' };
const TAB_ALIAS = { methode: 'sources', sources: 'sources', evolution: 'evolution', congregations: 'congregations', reddit: 'reddit', dons: 'dons' };

let tab = 'evolution';
let urlSync = false;  // l'adresse n'est modifiée qu'après le premier affichage

function mkTabs() {
  const nav = $('tabs');
  nav.innerHTML = '';
  TABS.forEach(([id, key]) => {
    const b = document.createElement('button');
    b.id = 'tabbtn-' + id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', id === tab);
    b.setAttribute('aria-controls', 'tab-' + id);
    b.textContent = tr(key);
    b.onclick = () => showTab(id);
    nav.appendChild(b);
  });
}

function showTab(id) {
  tab = TAB_BUILD[id] ? id : 'evolution';
  document.querySelectorAll('.tabpanel').forEach(p => {
    p.hidden = p.dataset.tab !== tab;
  });
  mkTabs();
  $('dlBtn').hidden = !TAB_CANVAS[tab];
  TAB_BUILD[tab]();
  writeHash();
}

// Écrit l'état courant dans l'adresse (sans recharger ni ajouter d'entrée d'historique).
function writeHash() {
  if (!urlSync)
    return;
  const p = ['t=' + tab];
  if (tab === 'evolution') {
    p.push('r=' + [...onR].join(','), 'd=' + [...onM].join(','), 'm=' + mode, 'p=' + PRES);
    if (!smooth)
      p.push('s=0');
    if ($('bd').checked)
      p.push('b=1');
  }
  if (tab === 'dons')
    p.push('y=' + dnY, 'p=' + PRES);
  if (tab === 'reddit' && rxMode !== 'lin')
    p.push('x=' + rxMode);
  try {
    history.replaceState(null, '', '#' + p.join('&'));
  } catch (e) {}
}

// Lit l'adresse et applique l'état qu'elle décrit (valeurs invalides ignorées).
function readHash() {
  const h = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!h)
    return;
  if (!h.includes('=')) {
    if (TAB_ALIAS[h])
      tab = TAB_ALIAS[h];
    return;
  }
  const q = Object.fromEntries(h.split('&').map(kv => kv.split('=')));
  if (TAB_BUILD[q.t])
    tab = q.t;
  const ids = (s, list) => (s || '').split(',').filter(id => list.some(x => x.id === id));
  const r = ids(q.r, REG);
  const d = ids(q.d, MET);
  if (r.length) {
    onR.clear();
    r.forEach(id => onR.add(id));
  }
  if (d.length) {
    onM.clear();
    d.forEach(id => onM.add(id));
  }
  if (['lin', 'log', 'idx'].includes(q.m))
    mode = q.m;
  if (q.p !== undefined && q.p !== '' && isFinite(+q.p) && +q.p >= 0 && +q.p <= 2) {
    setP(+q.p);
    $('pr').value = PRES;
  }
  smooth = q.s !== '0';
  $('sm').checked = smooth;
  $('bd').checked = q.b === '1';
  if ([2025, 2035, 2050].includes(+q.y))
    dnY = +q.y;
  if (['lin', 'lg'].includes(q.x))
    rxMode = q.x;
}

// Copie l'adresse de la vue courante.
async function copyLink() {
  writeHash();
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch (e) {
    const t = document.createElement('textarea');
    t.value = url;
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand('copy');
    } catch (e2) {}
    t.remove();
  }
  const b = $('shareBtn');
  b.textContent = tr('copied');
  setTimeout(() => { b.textContent = tr('shareBtn'); }, 1600);
}

// Télécharge le graphique de l'onglet courant en PNG, avec un fond et un titre.
function downloadChart() {
  const cv = $(TAB_CANVAS[tab]);
  if (!cv)
    return;
  const sc = cv.width / (cv.clientWidth || cv.width);
  const head = Math.round(44 * sc);
  const out = document.createElement('canvas');
  out.width = cv.width;
  out.height = cv.height + head;
  const g = out.getContext('2d');
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  g.fillStyle = css('--page') || '#fff';
  g.fillRect(0, 0, out.width, out.height);
  g.fillStyle = css('--text-primary') || '#000';
  g.textBaseline = 'middle';
  let fs = Math.round(15 * sc);
  g.font = `600 ${fs}px sans-serif`;
  while (g.measureText(document.title).width > out.width - 2 * 12 * sc && fs > 8 * sc) {
    fs--;
    g.font = `600 ${fs}px sans-serif`;
  }
  g.fillText(document.title, 12 * sc, head / 2);
  g.drawImage(cv, 0, head);
  const a = document.createElement('a');
  a.download = 'temoins-jehovah-' + tab + '.png';
  a.href = out.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  a.remove();
}
