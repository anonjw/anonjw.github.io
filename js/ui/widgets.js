/**
 * Petits composants d'interface.
 * Dépendances : aucune.
 */

// Boutons « à choix unique » : items = [[id, libellé], ...] ; onPick(id) est appelé au clic.
function segmented(container, items, current, onPick) {
  container.innerHTML = '';
  items.forEach(([id, label]) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.borderColor = current === id ? 'var(--text-primary)' : '';
    b.style.background = current === id ? 'var(--surface-1)' : '';
    b.style.opacity = current === id ? 1 : .6;
    b.onclick = () => onPick(id);
    container.appendChild(b);
  });
}
