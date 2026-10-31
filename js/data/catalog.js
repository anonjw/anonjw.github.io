/**
 * Catalogue des régions (REG) et des types de données (MET) sélectionnables dans le graphique principal.
 * Les noms affichés sont dans i18n/<langue>.js (clé `names`).
 *   MET.k  style de point Chart.js ; MET.g  glyphe du bouton
 * Dépendances : data/regions.js, ui/theme.js.
 */
const REG = ['world', 'af', 'sa', 'eu', 'na', 'us', 'ca', 'we', 'ee', 'as', 'oc', 'cc', 'moz', 'mol'].map((id, i) => ({ id, s: R[id].s || 1935, c: P9[i % 9] }));

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
].map(([id, k, g], i) => ({ id, k, g, c: i < 9 ? P9[i] : PALETTE_EXTRA[i - 9] }));
