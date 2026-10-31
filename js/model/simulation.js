/**
 * Modèle dynamique à rétroaction (2026-2050) et accès unifié aux valeurs.
 * M(région, année, écart de croissance, donnée) : historique si année ≤ 2025, simulation sinon.
 * Dépendances : data/regions.js, model/params.js, model/history.js, lib/utils.js.
 */

const last = k => R[k].a[R[k].a.length - 1][1];

const KD = (() => {
  let a = 0;
  let b = 0;
  BASE.forEach(k => {
    a += avgR(k, 2025);
    b += RD[k] * avgR(k, 2025);
  });
  return a / b;
})();

const CAL = {};

ALLK.forEach(k => {
  const [J, M, O] = AGE0[k];
  const d0 = DR * RD[k] * KD;
  const rb = RB[k] / 100;
  CAL[k] = {
    rb,
    ri: RI[k],
    d0,
    wD0: J * MORT[0] + M * MORT[1] + O * MORT[2],
    eps: Math.max(rb - d0 - R[k].g, EXCR + .002),
    s25: (Mh(k, 2025, 'loss') - Mh(k, 2025, 'dth')) / avgR(k, 2025)
  };
});

function simulate(p, dg) {
  const st = {};
  const S = {};
  ALLK.forEach(k => {
    const [J, M, O] = AGE0[k];
    st[k] = {
      N: .983 * last(k),
      J,
      M,
      O
    };
    S[k] = {
      P: { 2025: last(k) },
      bap: {},
      bin: {},
      bex: {},
      dth: {},
      exc: {},
      aban: {},
      loss: {},
      stu: {},
      O: { 2025: O },
      J: { 2025: J }
    };
  });
  const F = {};
  const Pi = {};
  let C0 = null;
  let S0 = null;
  for (let t = 2025; t <= 2050; t++) {
    const n = t - 2025;
    const pw = Math.pow(1 - p * IOTA_W, n);
    const po = Math.pow(1 - p * IOTA_O, n);
    let C = 0;
    let Sn = 0;
    BASE.forEach(k => {
      const s = st[k];
      C += INC[k] * s.N * ((s.J + s.M) * pw + s.O * KAPPA * po);
    });
    SOUTH.forEach(k => Sn += st[k].N);
    if (t === 2025) {
      C0 = C;
      S0 = Sn;
    }
    const f = C / C0;
    const fs = f / Math.pow(Sn / S0, .5);
    const pi = Math.min(Math.max(1 - fs, 0), .8);
    F[t] = f;
    Pi[t] = pi;
    if (t === 2050)
      break;
    const t1 = t + 1;
    const ramp = Math.min((t1 - 2025) / 3, 1);
    const rec = 1 + .06 / .84 * Math.min((t1 - 2025) / 10, 1);
    ALLK.forEach(k => {
      const s = st[k];
      const c = CAL[k];
      const [J0, M0, O0] = AGE0[k];
      const ca = SIG[k];
      const capI = s.J / J0;
      const capE = (s.J + s.M + .3 * s.O) / (J0 + M0 + .3 * O0);
      const fin = Math.max(.2, 1 - p * ca * pi);
      const Bi = c.rb * c.ri * Math.max(.2, 1 + p * (capI - 1)) * fin * s.N;
      const Be = c.rb * (1 - c.ri) * Math.max(.2, 1 + p * (capE - 1)) * fin * s.N;
      const B = Bi + Be;
      const wD = s.J * MORT[0] + s.M * MORT[1] + s.O * MORT[2];
      const D = c.d0 * Math.max(.5, 1 + p * (wD / c.wD0 - 1)) * s.N;
      const e = (c.s25 + (c.eps - c.s25) * ramp - dg) * (1 + .5 * ca * p * pi);
      const E = Math.max(e, -.01) * s.N;
      const dB = [s.J * MORT[0], s.M * MORT[1], s.O * MORT[2]].map(x => x / wD * D);
      const wE = [s.J * EXW[0], s.M * EXW[1], s.O * EXW[2]];
      const sE = wE[0] + wE[1] + wE[2];
      const eB = wE.map(x => x / sE * E);
      const nJ = Math.max(s.J * s.N - dB[0] - eB[0] + .55 * B - s.J * s.N / 30, 0);
      const nM = Math.max(s.M * s.N - dB[1] - eB[1] + .45 * B + s.J * s.N / 30 - s.M * s.N / 30, 0);
      const nO = Math.max(s.O * s.N - dB[2] - eB[2] + s.M * s.N / 30, 0);
      const Nn = Math.max(nJ + nM + nO, .01);
      S[k].bap[t1] = B;
      S[k].bin[t1] = Bi;
      S[k].bex[t1] = Be;
      S[k].dth[t1] = D;
      S[k].exc[t1] = EXCR * s.N;
      S[k].aban[t1] = E - EXCR * s.N;
      S[k].loss[t1] = D + E;
      S[k].stu[t1] = RS[k] * s.N * rec * Math.max(.4, 1 + .7 * p * (capE - 1));
      s.N = Nn;
      s.J = nJ / Nn;
      s.M = nM / Nn;
      s.O = nO / Nn;
      S[k].P[t1] = Nn / .983;
      S[k].O[t1] = s.O;
      S[k].J[t1] = s.J;
    });
  }
  return {
    S,
    F,
    Pi
  };
}

let SIM = null;
let PRES = 1;

function setP(p) {
  PRES = p;
  SIM = {};
  [-.01, 0, .01].forEach(d => SIM[d] = simulate(p, d));
}

function val(k, t, d) {
  const r = R[k];
  if (t <= 2025 && r.a)
    return interp(r.a, t);
  if (k === 'ot')
    return 225;
  if (r.parts)
    return r.parts.reduce((s, x) => s + val(x, t, d), 0);
  return SIM[d].S[k].P[t];
}

function M(k, t, d, m) {
  if (m === 'pub')
    return val(k, t, d);
  if (m === 'hpb')
    return M(k, t, d, 'hrs') / M(k, t, d, 'bap') / 1000;
  if (t <= 2025)
    return Mh(k, t, m);
  if (k === 'world')
    return BASE.reduce((s, x) => s + M(x, t, d, m), 0) + OT[m];
  if (R[k].parts)
    return R[k].parts.reduce((s, x) => s + M(x, t, d, m), 0);
  if (m === 'mem' || m === 'hrs')
    return val(k, t, d) * Mh(k, 2025, m) / val(k, 2025, d);
  return SIM[d].S[k][m][t];
}
