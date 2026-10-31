/**
 * Effectifs de proclamateurs (en milliers) par région : points d'ancrage observés, interpolés par `interp`.
 *   a      points [année, valeur] (le dernier est 2025) ; parts : région composée d'autres régions
 *   g      croissance annuelle de long terme utilisée par le modèle dynamique
 *   s      première année de la série (1935 par défaut)
 * Dépendances : lib/utils.js.
 */

const ANCHOR_YEARS = [1935, 1950, 1970, 1990, 2000, 2010, 2019, 2025];
const anchored = v => ANCHOR_YEARS.map((y, i) => [y, v[i]]);

const R = {
  world: {
    s: 1914,
    a: [[1914, 5], [1918, 4], [1928, 24], [1935, 56], [1942, 106], [1945, 156], [1950, 329], [1955, 642], [1960, 917], [1965, 1310], [1970, 1483], [1975, 2179], [1980, 2272], [1985, 3024], [1990, 4017], [1995, 5200], [2000, 6035], [2005, 6614], [2010, 7508], [2015, 8220], [2019, 8683], [2020, 8696], [2022, 8699], [2023, 8817], [2024, 9043], [2025, 9205]],
    parts: ['us', 'ca', 'we', 'ee', 'cc', 'sa', 'as', 'af', 'oc', 'ot']
  },
  na: { parts: ['us', 'ca'] },
  us: { a: anchored([21, 74, 400, 912, 1040, 1165, 1295, 1257]), g: -.004 },
  ca: { a: anchored([2, 17, 55, 100, 110, 113, 119, 125]), g: 0 },
  eu: { parts: ['we', 'ee'] },
  we: { a: anchored([14, 120, 330, 720, 900, 1010, 1120, 1107]), g: -.003 },
  ee: { a: anchored([3, 15, 50, 150, 270, 400, 410, 350]), g: -.01 },
  as: { a: anchored([1, 4, 40, 360, 540, 680, 770, 802]), g: .015 },
  af: { a: anchored([5, 65, 190, 500, 800, 1150, 1650, 2125]), g: .03 },
  oc: { a: anchored([2, 8, 35, 60, 75, 90, 100, 108]), g: .003 },
  sa: { a: anchored([1, 14, 150, 730, 1350, 1650, 1780, 1825]), g: .01 },
  cc: { a: anchored([.5, 8, 80, 420, 800, 1050, 1240, 1281]), g: .005 },
  moz: {
    s: 1970,
    a: anchored([.05, .3, 2, 9, 26, 45, 70, 109.5]),
    g: .04
  },
  mol: {
    s: 1970,
    a: anchored([.01, .05, .2, 1, 15, 20, 19, 15.5]),
    g: -.02
  },
  ot: { a: [[2025, 225]], g: 0 }
};
