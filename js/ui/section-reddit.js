/**
 * Section « Croissance du subreddit r/exjw » : jalons relevés, interpolation géométrique, valeurs de fin d'année.
 * Dépendances : lib/utils.js, data/reddit.js, i18n/core.js, ui/format.js, ui/theme.js, ui/widgets.js.
 */

// Libellé du jalon i dans la langue courante.
const rxl = i => tr('rxMilestones')[i];

let rxCh;
let rxMode = 'lin';
const rxI = t => interp(RXA.map(a => [a.t, a.v]), t);

function rxYears() {
  const o = [];
  for (let y = 2012; y <= 2026; y++) {
    const v = y === 2026 ? 130000 : rxI(y + .99);
    o.push({
      y,
      v,
      b: y === 2024 ? 'rxB1' : y === 2025 ? 'rxB2' : y === 2026 ? 'rxB3' : 'rxB0'
    });
  }
  return o;
}

function buildRx() {
  const lg = rxMode === 'lg';
  const Y = rxYears();
  const curve = [];
  for (let t = 2012.83; t <= 2026.8; t += 1 / 12)
    curve.push({ x: +t.toFixed(3), y: Math.round(rxI(t)) });
  curve.push({ x: 2026.8, y: 130000 });
  const pt = (a, i) => ({
    x: a.t,
    y: a.v,
    n: rxl(i)
  });
  const ob = RXA.map(pt).filter((_, i) => !RXA[i].derived);
  const dv = RXA.map(pt).filter((_, i) => RXA[i].derived);
  if (rxCh)
    rxCh.destroy();
  rxCh = new Chart($('rxc'), {
    type: 'line',
    data: { datasets: [
        {
          label: tr('rxCurve'),
          data: curve,
          borderColor: P9[1],
          borderWidth: 2,
          borderDash: [6, 3],
          pointRadius: 0,
          tension: 0,
          order: 2
        },
        {
          label: tr('rxObs'),
          data: ob,
          showLine: false,
          borderColor: P9[1],
          backgroundColor: P9[1],
          pointRadius: 5,
          pointHoverRadius: 7,
          order: 1
        },
        {
          label: tr('rxDer'),
          data: dv,
          showLine: false,
          borderColor: P9[1],
          backgroundColor: 'rgba(0,0,0,0)',
          pointStyle: 'rectRot',
          pointRadius: 7,
          pointBorderWidth: 2,
          order: 1
        }
      ] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      animation: false,
      interaction: { mode: 'nearest', intersect: true },
      plugins: {
        legend: {
          display: true, labels: {
            color: tc,
            boxWidth: 12,
            font: { size: 12 }
          }
        },
        tooltip: { callbacks: {
            title: i => i[0].raw.n || Math.floor(i[0].parsed.x),
            label: i => n0(i.parsed.y) + ' ' + tr('rxUnit')
          } }
      },
      scales: {
        x: {
          type: 'linear',
          min: 2012,
          max: 2027,
          grid: { display: false },
          ticks: {
            color: tc,
            stepSize: 2,
            callback: v => v
          }
        },
        y: {
          type: lg ? 'logarithmic' : 'linear',
          min: lg ? 500 : 0,
          grid: { color: gc },
          ticks: {
            color: tc,
            maxTicksLimit: 7,
            callback: v => {
              if (lg) {
                const l = Math.log10(v);
                if (Math.abs(l - Math.round(l)) > 1e-6 && Math.abs(l * 2 - Math.round(l * 2)) > 1e-6)
                  return '';
              }
              return v >= 1000 ? n0(v / 1000) + ' k' : v;
            }
          }
        }
      }
    }
  });
  segmented($('rxmd'), [['lin', tr('lin')], ['lg', tr('log')]], rxMode, id => {
    rxMode = id;
    buildRx();
  });
  const th = tr('rxTh');
  $('rxsum').innerHTML = `<div class="cap" style="margin-top:0">${tr('rxMile')}</div>` + RXA.map((a, i) => `<div class="sm"><span>${rxl(i)}</span><span>${n0(a.v)}</span></div>`).join('') +
    `<p class="hint">${tr('rxRatio').replace('{x}', dc((130000 / 9205326 * 1000).toFixed(0))).replace('{y}', dc((130000 / 9205326 * 100).toFixed(1)))}</p>`;
  $('rxtab').innerHTML = '<table><tr>' + th.map(h => `<th>${h}</th>`).join('') + '</tr>' + Y.map((s, i) => {
    const d = i ? (s.v / Y[i - 1].v - 1) * 100 : null;
    return `<tr><td>${s.y}${s.y === 2026 ? ' *' : ''}</td><td>${n0(Math.round(s.v / 100) * 100)}</td><td>${i ? (s.v - Y[i - 1].v > 0 ? '+' : s.v - Y[i - 1].v < 0 ? '−' : '') + n0(Math.abs(Math.round((s.v - Y[i - 1].v) / 100) * 100)) : '—'}</td><td>${i ? sgn(d) : '—'}</td><td>${tr(s.b)}</td></tr>`;
  }).join('') + '</table>';
}
