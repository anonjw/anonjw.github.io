/**
 * Historique (≤ 2025) : séries mondiales réelles réparties sur les régions.
 * Mh(région, année, donnée) renvoie la valeur historique (en milliers).
 * Dépendances : lib/utils.js, data/*, model/params.js, model/hours.js.
 */

/* --- historique (<= 2025) : séries annuelles réelles pour le monde, réparties sur les régions --- */
const avgR = (k, t) => .983 * interp(R[k].a, t);

const bapW = t => BAP(t);
const dthW = t => DR * AVG(t);
const lossW = t => BAP(t) - (AVG(t) - AVG(t - 1));
const excW = t => dfR(t) * (1 - REINST) * AVG(t);
const stuW = t => STU(t);

const alloc = (k, t, T) => {
  const w = x => T[x] * avgR(x, t);
  return w(k) / BASE.reduce((s, x) => s + w(x), 0);
};

const wL = (k, t) => Math.max(bapW(t) * alloc(k, t, RB) - (avgR(k, t) - avgR(k, t - 1)), .02 * avgR(k, t));

const Mh = (k, t, m) => {
  if (k === 'world') {
    if (m === 'bap')
      return bapW(t);
    if (m === 'dth')
      return dthW(t);
    if (m === 'stu')
      return stuW(t);
    if (m === 'mem')
      return MEM(t);
    if (m === 'hrs')
      return hrsW(t);
    if (m === 'loss')
      return lossW(t);
    if (m === 'exc')
      return excW(t);
    if (m === 'aban')
      return lossW(t) - dthW(t) - excW(t);
    const bi = BASE.reduce((s, x) => s + Mh(x, t, 'bin'), 0);
    return m === 'bin' ? bi : bapW(t) - bi;
  }
  if (R[k].parts)
    return R[k].parts.reduce((s, p) => s + Mh(p, t, m), 0);
  const bap = bapW(t) * alloc(k, t, RB);
  const sh = RI[k];
  if (m === 'bap')
    return bap;
  if (m === 'bin')
    return sh * bap;
  if (m === 'bex')
    return (1 - sh) * bap;
  if (m === 'stu')
    return stuW(t) * alloc(k, t, RS);
  if (m === 'mem')
    return MEM(t) * (1 - OTSH) * alloc(k, t, RM);
  if (m === 'hrs')
    return hrsW(t) * (1 - OTSH_H) * alloc(k, t, RH);
  const dth = dthW(t) * alloc(k, t, RD);
  if (m === 'dth')
    return dth;
  const exc = excW(t) * avgR(k, t) / BASE.reduce((s, x) => s + avgR(x, t), 0);
  if (m === 'exc')
    return exc;
  const loss = lossW(t) * wL(k, t) / BASE.reduce((s, x) => s + wL(x, t), 0);
  if (m === 'loss')
    return loss;
  return loss - dth - exc;
};
