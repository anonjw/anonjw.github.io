/**
 * Catalogue des régions (REG) et des types de données (MET) sélectionnables dans le graphique principal.
 * Les noms affichés sont dans i18n/<langue>.js (clé `names`).
 *   MET.k  style de point Chart.js ; MET.g  glyphe du bouton ; grp  groupe d'affichage dans « Personnaliser »
 * Dépendances : data/regions.js, ui/theme.js.
 */
// Groupes d'affichage des boutons.
const REG_GROUP = {
  world: 'world', af: 'cont', sa: 'cont', eu: 'cont', na: 'cont', as: 'cont', oc: 'cont', cc: 'cont',
  us: 'detail', ca: 'detail', we: 'detail', ee: 'detail', moz: 'adv', mol: 'adv'
};
const MET_GROUP = {
  pub: 'people', mem: 'people', bap: 'bap', bin: 'bap', bex: 'bap',
  dth: 'out', exc: 'out', aban: 'out', loss: 'out', stu: 'act', hrs: 'act', hpb: 'act'
};

// 14 couleurs distinctes pour les régions (palette principale, puis couleurs supplémentaires).
const REG_COLORS = [...P9, ...PALETTE_EXTRA, '#8c564b', '#5b7c99'];

const REG = ['world', 'af', 'sa', 'eu', 'na', 'us', 'ca', 'we', 'ee', 'as', 'oc', 'cc', 'moz', 'mol'].map((id, i) => ({ id, s: R[id].s || 1935, c: REG_COLORS[i], grp: REG_GROUP[id] }));

const MET = [
  ['pub', 'circle', '●'],
  ['bap', 'triangle', '▲'],
  ['bin', 'rect', '■'],
  ['bex', 'rectRot', '◆'],
  ['dth', 'cross', '+'],
  ['exc', 'star', '★'],
  ['aban', 'crossRot', '×'],
  ['loss', 'rectRounded', '▢'],
  ['stu', 'dash', '▬'],
  ['mem', 'line', '┃'],
  ['hrs', 'rectRot', '◇'],
  ['hpb', 'triangle', '△']
].map(([id, k, g], i) => ({ id, k, g, c: i < 9 ? P9[i] : PALETTE_EXTRA[i - 9], grp: MET_GROUP[id] }));
