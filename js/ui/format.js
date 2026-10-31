/**
 * Formatage des nombres selon la langue courante.
 * Dépendances : i18n/core.js (L, tr).
 */

// Séparateur décimal selon la langue ; milliers → « 1,23 M » / « 4,5 k » ; pourcentage ; entier localisé ; variation signée ; dollars.
const dc = s => L !== 'en' ? s.replace('.', ',') : s;

const fk = v => v >= 1e6 ? dc((v / 1e6).toFixed(2)) + ' ' + tr('bn') : v >= 1000 ? dc((v / 1000).toFixed(2)) + ' M' : (Math.abs(v) < 10 ? dc(v.toFixed(1)) : Math.round(v)) + ' k';
const pc = v => Math.round(v * 100) + tr('pct');
const n0 = v => Math.round(v).toLocaleString(tr('loc'));
const sgn = v => (v > 0 ? '+' : v < 0 ? '−' : '') + dc(Math.abs(v).toFixed(1)) + tr('pct');
const usd = v => 'US$ ' + (v >= 1000 ? dc((v / 1000).toFixed(2)) + ' ' + tr('bn') : Math.round(v) + ' M');
