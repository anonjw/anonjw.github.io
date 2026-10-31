/**
 * Export des données en CSV et JSON : vue en cours (onglet affiché) ou totalité des données présentées.
 *
 * Format tabulaire commun (CSV) : dataset, region_id, region, indicator_id, indicator, unit, year, value, status, low, high, smoothed.
 *   status  official | derived | estimate | observed | interpolated | projection  (voir l'onglet Export)
 *   low / high  fourchette (± 1 point de croissance annuelle) des années projetées
 * Les identifiants et unités sont stables (anglais) ; region et indicator suivent la langue de la page.
 *
 * Dépendances : lib/utils.js, model/*, data/catalog.js, i18n/core.js, ui/main-chart.js (pts, onR, onM, mode, smooth),
 *               ui/section-*.js (cgSeries, RXA, rxYears, dnD, dnY).
 */

const EXPORT_COLUMNS = ['dataset', 'region_id', 'region', 'indicator_id', 'indicator', 'unit', 'year', 'value', 'status', 'low', 'high', 'smoothed'];

const EXPORT_UNITS = {
  pub: 'people_peak', bap: 'people_per_year', bin: 'people_per_year', bex: 'people_per_year',
  dth: 'people_per_year', exc: 'people_per_year', aban: 'people_per_year', loss: 'people_per_year',
  stu: 'studies_monthly_average', mem: 'people', hrs: 'hours_per_year', hpb: 'hours_per_baptism'
};

const EXPORT_STATUSES = {
  official: 'figure from an official annual report',
  derived: 'computed exactly from official figures',
  estimate: 'estimate, or regional split produced by the model',
  observed: 'dated public reading',
  interpolated: 'interpolation between readings',
  projection: 'model projection, 2026-2050'
};

// Statut d'une valeur de la série « évolution » (région, donnée, année).
function evStatus(rid, mid, t) {
  if (t > 2025)
    return 'projection';
  if (mid === 'dth' || mid === 'exc' || mid === 'aban' || mid === 'bin' || mid === 'bex')
    return 'estimate';
  if (mid === 'loss')
    return rid === 'world' ? 'derived' : 'estimate';
  if ((mid === 'hrs' || mid === 'hpb') && t > 2023)
    return 'estimate';
  if (rid === 'world')
    return mid === 'hpb' ? 'derived' : 'official';
  if (mid === 'hrs' || mid === 'hpb' || mid === 'mem')
    return 'estimate';
  return t === 2025 && (mid === 'pub' || mid === 'bap' || mid === 'stu') ? 'official' : 'estimate';
}

// Lignes de la série « évolution » pour une liste de couples {r, m}, en unités naturelles (personnes, heures…).
// Les valeurs reprennent le calcul du graphique (lissage inclus si `smoothing`), sans transformation d'échelle.
function evoRows(pairs, smoothing) {
  const keep = smooth;
  smooth = smoothing;
  const rows = [];
  pairs.forEach(({ r, m }) => {
    const s = m.id === 'pub' ? r.s : 1962;
    const x = { r, m };
    const v = pts(x, 0, s, 1000, false);
    const lo = pts(x, -.01, s, 1000, false);
    const hi = pts(x, .01, s, 1000, false);
    const smoothed = smoothing && !['pub', 'mem', 'hrs', 'hpb'].includes(m.id) ? 1 : 0;
    v.forEach((p, i) => {
      if (p.y === null || !isFinite(p.y))
        return;
      rows.push({
        dataset: 'evolution', region_id: r.id, region: nm(r), indicator_id: m.id, indicator: nm(m), unit: EXPORT_UNITS[m.id],
        year: p.x, value: Math.round(p.y), status: evStatus(r.id, m.id, p.x),
        low: p.x > 2025 ? Math.round(lo[i].y) : '', high: p.x > 2025 ? Math.round(hi[i].y) : '', smoothed
      });
    });
  });
  smooth = keep;
  return rows;
}

function cgRows() {
  const rows = [];
  cgSeries().forEach(s => {
    const base = { dataset: 'congregations', region_id: 'world', region: nm(REG[0]), year: s.y, status: 'official', low: '', high: '', smoothed: '' };
    rows.push({ ...base, indicator_id: 'congregations', indicator: tr('cgN'), unit: 'congregations', value: s.v });
    rows.push({ ...base, indicator_id: 'publishers_per_congregation', indicator: tr('cgPpc'), unit: 'people', value: +s.p.toFixed(1) });
  });
  return rows;
}

function rxRows() {
  const base = { dataset: 'reddit', region_id: '', region: 'r/exjw', unit: 'people', low: '', high: '', smoothed: '' };
  const rows = [];
  RXA.forEach((a, i) => rows.push({
    ...base, indicator_id: 'subscribers_milestones', indicator: tr('rxMilestones')[i], year: a.t, value: a.v, status: a.derived ? 'derived' : 'observed'
  }));
  rxYears().forEach(y => rows.push({
    ...base, indicator_id: 'subscribers_year_end', indicator: tr('rxTh')[1], year: y.y, value: Math.round(y.v / 100) * 100, status: y.y === 2026 ? 'observed' : 'interpolated'
  }));
  return rows;
}

function dnRows() {
  const rows = [];
  [2025, 2035, 2050].forEach(y => {
    const D = dnD(y);
    const tot = D.reduce((s, x) => s + x.v, 0);
    D.forEach(x => {
      const r = REG.find(q => q.id === x.k);
      const base = { dataset: 'donations', region_id: x.k, region: nm(r), year: y, status: 'estimate', low: '', high: '', smoothed: '' };
      rows.push({ ...base, indicator_id: 'donations_share', indicator: tr('dnPie'), unit: 'percent', value: +(x.v / tot * 100).toFixed(1) });
      rows.push({ ...base, indicator_id: 'donations_amount', indicator: tr('hDn'), unit: 'usd_millions_2025', value: +x.v.toFixed(1) });
    });
  });
  return rows;
}

// Toutes les données présentées sur le site (évolution sans lissage, dans le scénario courant).
let allRowsCache = { key: '', rows: null };
function allRows() {
  const key = L + '|' + PRES;
  if (allRowsCache.key !== key) {
    const pairs = [];
    REG.forEach(r => MET.forEach(m => pairs.push({ r, m })));
    allRowsCache = { key, rows: [...evoRows(pairs, false), ...cgRows(), ...rxRows(), ...dnRows()] };
  }
  return allRowsCache.rows;
}

// Lignes de la vue en cours (onglet affiché).
function viewRows() {
  if (tab === 'evolution') {
    const pairs = [];
    REG.filter(r => onR.has(r.id)).forEach(r => MET.filter(m => onM.has(m.id)).forEach(m => pairs.push({ r, m })));
    return evoRows(pairs, smooth);
  }
  if (tab === 'congregations')
    return cgRows();
  if (tab === 'reddit')
    return rxRows();
  if (tab === 'dons')
    return dnRows().filter(x => x.year === dnY);
  return [];
}

function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function toCsv(rows) {
  return '\ufeff' + EXPORT_COLUMNS.join(',') + '\r\n' + rows.map(r => EXPORT_COLUMNS.map(c => csvCell(r[c])).join(',')).join('\r\n') + '\r\n';
}

// JSON : métadonnées + séries (une par dataset, région et indicateur).
function toJson(rows, scope) {
  const groups = new Map();
  rows.forEach(r => {
    const k = [r.dataset, r.region_id, r.indicator_id].join('|');
    if (!groups.has(k))
      groups.set(k, { dataset: r.dataset, region_id: r.region_id, region: r.region, indicator_id: r.indicator_id, indicator: r.indicator, unit: r.unit, points: [] });
    const pt = { year: r.year, value: r.value, status: r.status };
    if (r.low !== '')
      Object.assign(pt, { low: r.low, high: r.high });
    if (r.smoothed !== '' && r.smoothed === 1)
      pt.smoothed = true;
    groups.get(k).points.push(pt);
  });
  const meta = {
    title: document.title,
    generated: new Date().toISOString().slice(0, 10),
    language: L,
    scope: scope === 'all' ? 'all data' : 'current view: ' + tab,
    parameters: {
      projection_intensity: PRES,
      note: 'Projection range (low/high) = +/- 1 point of annual growth; 2026-2050 values are model projections, not official figures.'
    },
    columns: EXPORT_COLUMNS,
    statuses: EXPORT_STATUSES
  };
  if (scope !== 'all' && tab === 'evolution')
    Object.assign(meta.parameters, { regions: [...onR], indicators: [...onM], smoothing: smooth, scale_displayed: mode });
  if (scope !== 'all' && tab === 'dons')
    meta.parameters.donations_year = dnY;
  return JSON.stringify({ meta, series: [...groups.values()] }, null, 1);
}

function saveFile(name, mime, text) {
  const url = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportData(scope, fmt) {
  const rows = scope === 'all' ? allRows() : viewRows();
  if (!rows.length)
    return;
  const name = 'temoins-jehovah-' + (scope === 'all' ? 'donnees-completes' : tab);
  if (fmt === 'csv')
    saveFile(name + '.csv', 'text/csv', toCsv(rows));
  else
    saveFile(name + '.json', 'application/json', toJson(rows, scope));
}

// Menu déroulant « Exporter » : les entrées dépendent de l'onglet affiché.
function updateExportMenu() {
  const hasView = !!TAB_CANVAS[tab];
  document.querySelectorAll('#expMenu [data-view]').forEach(b => { b.hidden = !hasView; });
  $('expMenu').open = false;
}

// Contenu de l'onglet Export : composition du fichier complet.
function buildExport() {
  const rows = allRows();
  const count = ds => rows.filter(r => r.dataset === ds).length;
  const lab = [tr('l0'), tr('l1'), tr('l2'), tr('l3'), tr('l4')][PRES === 0 ? 0 : PRES < .75 ? 1 : PRES < 1.25 ? 2 : PRES < 1.75 ? 3 : 4];
  $('expIntro').innerHTML = tr('expIntro').replace('{s}', lab);
  $('expInfo').innerHTML = [['expDsEvo', 'evolution'], ['expDsCg', 'congregations'], ['expDsRx', 'reddit'], ['expDsDn', 'donations']]
    .map(([k, ds]) => `<div class="sm"><span>${tr(k)}</span><span>${tr('expRows').replace('{n}', n0(count(ds)))}</span></div>`).join('') +
    `<div class="sm"><span><b>Total</b></span><span><b>${tr('expRows').replace('{n}', n0(rows.length))}</b></span></div>`;
  writeHash();
}
