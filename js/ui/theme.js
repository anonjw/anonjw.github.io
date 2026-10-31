/**
 * Palette et couleurs de tracé.
 * Dépendances : aucune (lit les variables CSS de la page).
 */

// Palette principale (régions) puis couleurs supplémentaires pour les types de données.
const P9 = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948', '#898781'];

const PALETTE_EXTRA = ['#12a4b8', '#c47f00', '#a14ba8'];

// Couleurs du texte et de la grille des graphiques, lues dans le thème (clair ou sombre).
const tc = (getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#898781').trim() || '#898781';

const gc = 'rgba(136,135,129,.2)';
