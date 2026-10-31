/**
 * Années des événements marquants affichés sur le graphique principal.
 * Les textes se trouvent dans i18n/<langue>.js (clé `events`, même ordre).
 */
const EVENT_YEARS = [1914, 1918, 1925, 1931, 1933, 1935, 1975, 1991, 1995, 2000, 2012, 2017, 2020, 2022, 2023, 2024];

// Années des événements représentés par un repère numéroté sur le graphique (les autres sont listés à part).
const EVENT_KEYS = [1914, 1975, 1991, 2017, 2020, 2023];

// Indices (dans EVENT_YEARS) des repères du graphique, dans l'ordre chronologique.
const KEY_EVENTS = EVENT_YEARS.map((y, i) => i).filter(i => EVENT_KEYS.includes(EVENT_YEARS[i]));
