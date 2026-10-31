/**
 * Section « Nombre de congrégations » : courbe, variation annuelle, tableau complet.
 * Dépendances : data/series.js (CGK, AVG), i18n/core.js, ui/format.js, ui/theme.js.
 */

let cgCh;

function cgSeries() {
  return CGK.map((v, i) => ({
    y: 1962 + i,
    v,
    e: false,
    p: AVG(1962 + i) * 1000 / v
  }));
}

function buildCg() {
  const S = cgSeries();
  const yo = S.map((s, i) => i ? (s.v / S[i - 1].v - 1) * 100 : null);
  if (cgCh)
    cgCh.destroy();
  cgCh = new Chart($('cgc'), {
    type: 'bar',
    data: {
      labels: S.map(s => s.y),
      datasets: [
        {
          type: 'bar',
          label: tr('cgPct'),
          data: yo,
          yAxisID: 'y2',
          backgroundColor: yo.map(v => v === null ? 'rgba(0,0,0,0)' : v < 0 ? 'rgba(227,73,72,.8)' : 'rgba(136,135,129,.4)'),
          order: 2
        },
        {
          type: 'line',
          label: tr('cgN'),
          data: S.map(s => s.v),
          yAxisID: 'y',
          borderColor: P9[0],
          backgroundColor: P9[0],
          borderWidth: 2,
          tension: .15,
          pointRadius: S.map(s => s.e ? 4 : 0),
          pointBackgroundColor: S.map(s => s.e ? 'rgba(0,0,0,0)' : P9[0]),
          pointBorderColor: P9[0],
          pointBorderWidth: 1.5,
          segment: { borderDash: c => (S[c.p0DataIndex].e || S[c.p1DataIndex].e) ? [5, 3] : undefined },
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true, labels: {
            color: tc,
            boxWidth: 12,
            font: { size: 12 }
          }
        },
        tooltip: {
          filter: i => i.parsed.y !== null,
          callbacks: { label: i => i.dataset.yAxisID === 'y2' ? i.dataset.label + ' : ' + sgn(i.parsed.y) : i.dataset.label + ' : ' + n0(i.parsed.y) + (S[i.dataIndex].e ? ' (' + tr('est') + ')' : '') }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: tc, maxTicksLimit: 9 } },
        y: {
          position: 'left',
          grid: { color: gc },
          ticks: {
            color: tc,
            maxTicksLimit: 7,
            callback: v => n0(v / 1000) + ' k'
          }
        },
        y2: {
          position: 'right',
          grid: { display: false },
          ticks: {
            color: tc,
            maxTicksLimit: 6,
            callback: v => v + '%'
          }
        }
      }
    }
  });
  const L0 = S[S.length - 1];
  const pk = S.reduce((a, b) => b.v >= a.v ? b : a);
  const post = S.filter(s => s.y > pk.y);
  const lo = post.length ? post.reduce((a, b) => b.v < a.v ? b : a) : null;
  const p19 = S.find(s => s.y === 2019);
  const p90 = S.find(s => s.y === 1990);
  const p70 = S.find(s => s.y === 1970);
  $('cgsum').innerHTML =
    `<div class="sm"><span>${tr('cgLast')} (${L0.y})</span><span>${n0(L0.v)}<br>${tr('cgYoy').replace('{p}', sgn((L0.v / S[S.length - 2].v - 1) * 100))}</span></div>` +
      `<div class="sm"><span>${tr('cgMax')}</span><span>${n0(pk.v)} (${pk.y})</span></div>` +
      (lo && lo.v < pk.v ? `<div class="sm"><span>${tr('cgDip')}</span><span>${n0(lo.v)} (${lo.y})<br>${tr('cgSince').replace('{p}', sgn((lo.v / pk.v - 1) * 100))}</span></div>` : '') +
      `<div class="sm"><span>${tr('cgPpc')}</span><span>1970 : ${dc(p70.p.toFixed(1))} · 1990 : ${dc(p90.p.toFixed(1))} · 2019 : ${dc(p19.p.toFixed(1))} · ${L0.y} : ${dc(L0.p.toFixed(1))}</span></div>`;
  const th = tr('cgTh');
  $('cgtab').innerHTML = '<table><tr>' + th.map(h => `<th>${h}</th>`).join('') + '</tr>' + S.map((s, i) => `<tr><td>${s.y}</td><td>${n0(s.v)}${s.e ? ' (' + tr('est') + ')' : ''}</td><td>${i ? (s.v - S[i - 1].v > 0 ? '+' : s.v - S[i - 1].v < 0 ? '−' : '') + n0(Math.abs(s.v - S[i - 1].v)) : '—'}</td><td>${i ? sgn(yo[i]) : '—'}</td><td>${dc(s.p.toFixed(1))}</td></tr>`).join('') + '</table>';
}
