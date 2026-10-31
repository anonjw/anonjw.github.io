/**
 * Heures de prédication : totaux officiels jusqu'en 2023, estimation ensuite (les proclamateurs ne déclarent plus leurs heures).
 * Heures annuelles = 12 × (66,3 h × pionniers permanents + 38,6 h × pionniers auxiliaires + 10,7 h × autres) × K,
 * K étant calé sur le total publié de 2023.
 * Dépendances : lib/utils.js, data/series.js, model/params.js.
 */

// Pionniers moyens publiés [permanents, auxiliaires] en milliers ; taux mensuels ajustés sur 2005-2019 ; part des autres pays.
const PIO = {
  2023: [1570.906, 738.457],
  2024: [1679.026, 867.502],
  2025: [1743.567, 864.870]
};

const HR_A = 66.3;
const HR_B = 38.6;
const HR_C = 10.7;
const OTSH_H = 225 / 9205;

const hrFit = y => {
  const [g, a] = PIO[y];
  const o = AVG(y) - g - a;
  return 12 * (HR_A * g + HR_B * a + HR_C * o);
};

const HR_K = HRK[HRK.length - 1] / hrFit(2023);
const hrsW = t => t <= 2023 ? at(HRK, 1962, t) : HR_K * hrFit(Math.min(t, 2025));

// Part « autres pays » des heures, et répartition régionale au prorata des proclamateurs.
OT.hrs = hrsW(2025) * OTSH_H;

const RH = Object.fromEntries(ALLK.map(k => [k, 1]));
