/**
 * Constantes de calibrage du modèle (mesurées, estimées ou supposées : voir la méthodologie).
 * Dépendances : lib/utils.js (interp), data/series.js.
 */

// Taux de décès, réintégrations et exclusions (voir « Sources et méthodologie »).
const DR = .0085;

const REINST = .31;
const DFA = [[1959, .009], [1968, .010], [1985, .0128], [1986, .0122], [1992, .010], [2025, .010]];
const dfR = t => interp(DFA, t);
const EXCR = .010 * (1 - REINST);

// Régions de base (somme = monde moins « autres pays ») et sous-régions affichées à part.
const BASE = ['us', 'ca', 'we', 'ee', 'cc', 'sa', 'as', 'af', 'oc'];

const SUB = ['moz', 'mol'];
const ALLK = BASE.concat(SUB);

// Par région : baptêmes pour 100 proclamateurs (RB), études par proclamateur (RS), mortalité relative (RD), part de baptêmes internes (RI).
const RB = {
  us: 1.91,
  ca: 1.59,
  we: 1.61,
  ee: 1.57,
  sa: 2.94,
  cc: 2.8,
  as: 2.75,
  af: 6.83,
  oc: 2.49,
  moz: 10.04,
  mol: 2.64
};

const RS = {
  us: .36,
  ca: .32,
  we: .29,
  ee: .25,
  sa: .65,
  cc: .71,
  as: .67,
  af: 1.97,
  oc: .44,
  moz: 1.72,
  mol: .33
};

const RD = {
  us: 1.25,
  ca: 1.2,
  we: 1.35,
  ee: 1.3,
  sa: .85,
  cc: .95,
  as: 1,
  af: .65,
  oc: 1.2,
  moz: .6,
  mol: 1.3
};

const RI = {
  us: .6,
  ca: .6,
  we: .62,
  ee: .5,
  sa: .4,
  cc: .4,
  as: .45,
  af: .25,
  oc: .6,
  moz: .25,
  mol: .5
};

// Part du monde non détaillée par région (milliers) : « autres pays ».
const OT = {
  bap: 4.3,
  bin: 1.7,
  bex: 2.6,
  dth: 1.9,
  exc: 1.5,
  aban: .9,
  loss: 4.3,
  stu: 92,
  mem: 453.97
};

// Part des « autres pays » dans le total mondial du Mémorial.
const OTSH = .022;

// Rapport relatif assistance au Mémorial / proclamateurs, par région (hypothèse, voir méthodologie).
const RM = {
  us: 2.4,
  ca: 1.8,
  we: 1.9,
  ee: 2,
  sa: 3.2,
  cc: 3.6,
  as: 2.5,
  af: 3.3,
  oc: 1.9,
  moz: 3.6,
  mol: 2.2
};

// Modèle dynamique : pyramide des âges 2025 [≤34, 35-64, 65+], sensibilité au Sud, pondération des revenus, etc.
const AGE0 = {
  us: [.20, .50, .30],
  ca: [.21, .50, .29],
  we: [.17, .50, .33],
  ee: [.19, .51, .30],
  oc: [.20, .52, .28],
  sa: [.27, .55, .18],
  cc: [.26, .55, .19],
  as: [.27, .53, .20],
  af: [.38, .56, .06],
  moz: [.42, .53, .05],
  mol: [.15, .50, .35]
};

const SIG = {
  us: 0,
  ca: 0,
  we: 0,
  ee: .1,
  oc: 0,
  sa: .4,
  cc: .35,
  as: .3,
  af: .5,
  moz: .6,
  mol: 0
};

const INC = {
  us: 1,
  ca: .85,
  we: .8,
  oc: .9,
  ee: .25,
  as: .25,
  sa: .1,
  cc: .1,
  af: .03
};

const MORT = [.1, .5, 4];
const EXW = [1.5, 1, .3];
const KAPPA = .7;
const IOTA_W = .005;
const IOTA_O = .009;
const SOUTH = ['af', 'sa', 'cc', 'as'];
