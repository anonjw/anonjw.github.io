/**
 * Cœur de l'internationalisation.
 *   L      langue courante (mémorisée dans localStorage sous la clé « jwlang »)
 *   TX     textes de l'interface par langue (remplis par fr.js, en.js, es.js)
 *   DOCS   méthodologie par langue (remplie par docs.<langue>.js)
 *   tr(k)  texte courant ; nm(x) / sh(x) nom long / court d'une région ou d'une donnée
 */

let L = 'fr';

try {
  const sv = localStorage.getItem('jwlang');
  if (sv in {
    fr: 1,
    en: 1,
    es: 1
  })
    L = sv;
}
catch (e) { }

const TX = {
  fr: {},
  en: {},
  es: {}
};

const DOCS = {};
const tr = k => TX[L][k];
const nm = x => TX[L].names[x.id][0];
const sh = x => TX[L].names[x.id][1];
