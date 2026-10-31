/**
 * Section « Dons en dollars par région » : camembert (2025, 2035, 2050), total estimé, recoupements publiés.
 * Dépendances : model/donations.js, data/catalog.js, i18n/core.js, ui/format.js, ui/theme.js, ui/widgets.js.
 */

let dnCh;
let dnY = 2025;

function buildDn() {
  const t = dnY;
  const D = dnD(t).sort((a, b) => b.v - a.v);
  const tot = D.reduce((s, x) => s + x.v, 0);
  const rg = k => REG.find(x => x.id === k);
  const pg = getComputedStyle(document.documentElement).getPropertyValue('--page').trim() || '#fcfcfb';
  if (dnCh)
    dnCh.destroy();
  dnCh = new Chart($('dnc'), {
    type: 'pie',
    data: {
      labels: D.map(x => nm(rg(x.k))),
      datasets: [{
          data: D.map(x => +x.v.toFixed(1)),
          backgroundColor: D.map(x => rg(x.k).c),
          borderColor: pg,
          borderWidth: 2
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: 4 },
      plugins: {
        legend: {
          position: 'bottom', labels: {
            color: tc,
            boxWidth: 12,
            font: { size: 12 }
          }
        },
        tooltip: { callbacks: { label: i => ' ' + i.label + ' : ' + usd(i.parsed) + ' (' + dc((i.parsed / tot * 100).toFixed(1)) + tr('pct') + ')' } }
      }
    }
  });
  segmented($('dny'), [2025, 2035, 2050].map(y => [y, y]), dnY, y => {
    dnY = y;
    buildDn();
  });
  $('dnsum').innerHTML = D.map(x => {
    const r = rg(x.k);
    return `<div class="sm"><span><i style="background:${r.c}"></i>${nm(r)}</span><span>${usd(x.v)}<br>${dc((x.v / tot * 100).toFixed(1))}${tr('pct')}</span></div>`;
  }).join('') +
    `<p class="hint">${tr('dnTot').replace('{t}', usd(tot)).replace('{a}', usd(tot * .65)).replace('{b}', usd(tot * 1.35))}</p>`;
  const B = Object.fromEntries(dnD(2025).map(x => [x.k, x.v]));
  $('dnck').innerHTML = [['ca', tr('dnCa'), 'dnCaT'], ['we', tr('dnUk'), 'dnUkT'], ['oc', tr('dnAu'), 'dnAuT'], ['us', tr('dnUs'), 'dnUsT']].map(([k, n, tx]) => `<div class="sm"><span><b>${n}</b><br><span style="font-size:12px;color:var(--text-secondary)">${tr(tx)}</span></span><span>${tr('model')} :<br>${usd(B[k])}</span></div>`).join('');
}
