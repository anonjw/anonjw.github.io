/**
 * Utilitaires partagés.
 * Dépendances : aucune.
 */

// Interpolation entre points [[t, v], ...] : géométrique si les deux valeurs sont > 0, sinon linéaire.
function interp(a, t) {
  if (t <= a[0][0])
    return a[0][1];
  for (let i = 1; i < a.length; i++) {
    if (t <= a[i][0]) {
      const [t0, v0] = a[i - 1];
      const [t1, v1] = a[i];
      const f = (t - t0) / (t1 - t0);
      return v0 > 0 && v1 > 0 ? v0 * Math.pow(v1 / v0, f) : v0 + (v1 - v0) * f;
    }
  }
  return a[a.length - 1][1];
}

// Valeur d'une série annuelle `a` commençant en `y0`, à l'année t (bornée aux extrémités).
const at = (a, y0, t) => a[Math.min(Math.max(Math.round(t) - y0, 0), a.length - 1)];

// Raccourci DOM.
const $ = id => document.getElementById(id);
