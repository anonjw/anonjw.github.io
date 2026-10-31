/**
 * Dons en dollars par région : capacité de don du modèle, calée sur les comptes publics du Canada.
 * DW = pondération de don par région ; DK = millions de dollars par unité de capacité.
 * Dépendances : model/params.js, model/simulation.js.
 */

const DW = {
  us: 1,
  ca: .85,
  we: .8,
  oc: .55,
  ee: .25,
  as: .25,
  sa: .1,
  cc: .1,
  af: .03
};

const DK = .964;

function dcap(k, t) {
  const S = SIM[0].S[k];
  const n = t - 2025;
  const pw = Math.pow(1 - PRES * IOTA_W, n);
  const po = Math.pow(1 - PRES * IOTA_O, n);
  const N = .983 * S.P[t];
  const J = S.J[t];
  const O = S.O[t];
  const Mi = 1 - J - O;
  return DW[k] * N * ((J + Mi) * pw + O * KAPPA * po);
}

const dnD = t => Object.keys(DW).map(k => ({ k, v: dcap(k, t) * DK }));
