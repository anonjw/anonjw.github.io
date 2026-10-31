/**
 * Graphique principal : sélection de régions et de données, échelle, fourchette, curseur d'intensité, lecture du modèle.
 *   onR / onM   régions et données sélectionnées ; mode  échelle (lin, log, idx) ; smooth  lissage des flux
 *   build()     (re)construit le graphique et le résumé ; paint()  met à jour l'état des boutons
 * Dépendances : lib/utils.js, model/*, data/catalog.js, data/events.js, i18n/core.js, ui/format.js, ui/theme.js.
 */

const onR = new Set(['world', 'af', 'eu']);
const onM = new Set(['pub']);
let mode = 'lin';
let smooth = true;

const evP = {
  id: 'ev',
  afterDatasetsDraw(c) {
    const { ctx, chartArea: a, scales: { x } } = c;
    EVENT_YEARS.forEach((y, i) => {
      if (y < x.min || y > x.max)
        return;
      const px = x.getPixelForValue(y);
      const yy = a.top - 46 + (i % 3) * 17;
      ctx.save();
      ctx.strokeStyle = 'rgba(136,135,129,.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, yy);
      ctx.lineTo(px, a.bottom);
      ctx.stroke();
      ctx.fillStyle = '#888780';
      ctx.beginPath();
      ctx.arc(px, yy, 8, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '500 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i + 1, px, yy + .5);
      ctx.restore();
    });
    const Lb = [];
    c.data.datasets.forEach((d, i) => {
      if (d._band)
        return;
      const m = c.getDatasetMeta(i).data;
      const p = m[m.length - 1];
      if (p && isFinite(p.y))
        Lb.push({
          y: p.y,
          t: d._sh,
          c: d.borderColor
        });
    });
    Lb.sort((p, q) => p.y - q.y);
    for (let i = 1; i < Lb.length; i++)
      if (Lb[i].y - Lb[i - 1].y < 13)
        Lb[i].y = Lb[i - 1].y + 13;
    ctx.save();
    ctx.font = '500 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    Lb.forEach(l => {
      ctx.fillStyle = l.c;
      ctx.fillText(l.t, x.getPixelForValue(2050) + 5, l.y);
    });
    ctx.restore();
  }
};

let ch;

function readout() {
  const S = SIM[0];
  const F = S.F;
  const pi = S.Pi[2050];
  const eu25 = (S.S.we.O[2025] * val('we', 2025, 0) + S.S.ee.O[2025] * val('ee', 2025, 0)) / val('eu', 2025, 0);
  const eu50 = (S.S.we.O[2050] * val('we', 2050, 0) + S.S.ee.O[2050] * val('ee', 2050, 0)) / val('eu', 2050, 0);
  const dr = k => M(k, 2050, 0, 'dth') / (.983 * val(k, 2050, 0)) / (M(k, 2026, 0, 'dth') / (.983 * val(k, 2026, 0)));
  const brake = Math.round(SIG.af * PRES * pi * 100);
  const lab = [tr('l0'), tr('l1'), tr('l2'), tr('l3'), tr('l4')][PRES === 0 ? 0 : PRES < .75 ? 1 : PRES < 1.25 ? 2 : PRES < 1.75 ? 3 : 4];
  $('plab').textContent = dc(PRES.toFixed(1)) + ' · ' + lab;
  const f2 = v => dc(v.toFixed(2));
  $('ro').innerHTML =
    `<div class="sm"><span>${tr('rFin')}</span><span>2025 : 100<br>2035 : ${Math.round(F[2035] * 100)} · 2050 : ${Math.round(F[2050] * 100)}</span></div>` +
      `<div class="sm"><span>${tr('rAge')}</span><span>${tr('usa')} : ${pc(S.S.us.O[2025])} → ${pc(S.S.us.O[2050])}<br>${tr('eur')} : ${pc(eu25)} → ${pc(eu50)}</span></div>` +
      `<div class="sm"><span>${tr('rMort')}</span><span>${tr('usa')} : ×${f2(dr('us'))} · ${tr('eurW')} : ×${f2(dr('we'))}</span></div>` +
      `<div class="sm"><span>${tr('rBrake')}</span><span>${brake ? '−' + brake + tr('pct') : tr('none')}<br>(${tr('support').replace('{x}', Math.round((1 - pi) * 100))})</span></div>`;
}

function pts(x, d, s, b, lg) {
  const raw = [];
  for (let t = s; t <= 2050; t++)
    raw.push(M(x.r.id, t, d, x.m.id) * b);
  const ys = smooth && !['pub', 'mem', 'hrs', 'hpb'].includes(x.m.id) ? raw.map((_, i) => {
    const a = [raw[i - 1], raw[i], raw[i + 1]].filter(v => v !== undefined);
    return a.reduce((p, q) => p + q, 0) / a.length;
  }) : raw;
  return ys.map((v, i) => ({ x: s + i, y: lg && v <= 0 ? null : +v.toFixed(3) }));
}

function build() {
  const AR = REG.filter(x => onR.has(x.id));
  const AM = MET.filter(x => onM.has(x.id));
  const one = AR.length === 1;
  const bands = $('bd').checked;
  const lg = mode !== 'lin';
  const cur = [];
  const ds = [];
  const skipped = [];
  AR.forEach(r => AM.forEach(m => cur.push({
    r,
    m,
    c: one ? m.c : r.c,
    s: m.id === 'pub' ? r.s : 1962,
    n: nm(r) + ' · ' + nm(m),
    sh: AM.length === 1 ? sh(r) : (AR.length === 1 ? sh(m) : sh(r) + ' ' + sh(m))
  })));
  cur.forEach(x => {
    const v25 = M(x.r.id, 2025, 0, x.m.id);
    if (mode === 'idx' && v25 <= 0) {
      skipped.push(x);
      return;
    }
    const b = mode === 'idx' ? 100 / v25 : 1;
    ds.push({
      label: x.n,
      data: pts(x, 0, x.s, b, lg),
      borderColor: x.c,
      backgroundColor: x.c,
      borderWidth: 2,
      tension: .2,
      spanGaps: false,
      pointStyle: x.m.k,
      pointRadius: c => AM.length > 1 && c.raw && c.raw.x % 10 === 0 && c.raw.y !== null ? 4 : 0,
      segment: { borderDash: c => c.p0.parsed.x >= (x.m.id === 'hrs' || x.m.id === 'hpb' ? 2023 : 2025) ? [7, 4] : undefined },
      _sh: x.sh
    });
    if (bands)
      [-.01, .01].forEach((d, j) => ds.push({
        label: x.n + (j ? ' (+)' : ' (−)'),
        data: pts(x, d, x.s, b, lg).filter(p => p.x >= 2025),
        borderColor: x.c,
        borderWidth: 1,
        borderDash: [2, 3],
        pointRadius: 0,
        _band: 1
      }));
  });
  const s = cur.length ? Math.min(...cur.map(x => x.s)) : 1914;
  if (ch)
    ch.destroy();
  ch = new Chart($('c'), {
    type: 'line',
    data: { datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      animation: false,
      layout: { padding: { top: 56, right: AM.length > 1 && AR.length > 1 ? 100 : 66 } },
      interaction: { mode: 'x', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          itemSort: (p, q) => q.parsed.y - p.parsed.y,
          filter: i => !i.dataset._band && i.parsed.y !== null,
          callbacks: {
            title: i => Math.round(i[0].parsed.x),
            label: i => i.dataset.label + ' : ' + (mode === 'idx' ? dc(i.parsed.y.toFixed(1)) : Math.round(i.parsed.y * 1000).toLocaleString(tr('loc')))
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: s,
          max: 2050,
          grid: { display: false },
          ticks: {
            color: tc,
            maxTicksLimit: 8,
            callback: v => v
          }
        },
        y: {
          type: lg ? 'logarithmic' : 'linear',
          min: lg ? (mode === 'idx' ? .01 : .1) : undefined,
          grid: { color: gc },
          title: {
            display: true,
            text: mode === 'idx' ? tr('axI') : tr('axK'),
            color: tc
          },
          ticks: {
            color: tc,
            maxTicksLimit: 7,
            callback: v => {
              if (lg) {
                const l = Math.log10(v);
                if (Math.abs(l - Math.round(l)) > 1e-6)
                  return '';
              }
              return mode === 'idx' ? v : fk(v);
            }
          }
        }
      }
    },
    plugins: [evP]
  });
  $('sum').innerHTML = cur.length ? cur.map(x => {
    const id = x.r.id;
    const mi = x.m.id;
    const sk = skipped.includes(x);
    return `<div class="sm"><span><i style="background:${x.c}"></i>${x.n}</span><span>2025 : ${fk(M(id, 2025, 0, mi))}<br>2050 : ${fk(M(id, 2050, 0, mi))} (${fk(M(id, 2050, -.01, mi))} ${L === 'fr' ? 'à' : L === 'es' ? 'a' : 'to'} ${fk(M(id, 2050, .01, mi))})${sk ? '<br>' + tr('noIdx') : ''}</span></div>`;
  }).join('') : `<p style="font-size:14px;color:var(--text-secondary)">${tr('noSel')}</p>`;
  readout();
}

function paint() {
  const one = onR.size === 1;
  document.querySelectorAll('[data-r]').forEach(b => {
    const x = REG.find(q => q.id === b.dataset.r);
    const a = onR.has(x.id);
    b.style.borderColor = a ? x.c : '';
    b.style.background = a ? x.c + '26' : '';
    b.style.opacity = a ? 1 : .6;
    b.querySelector('i').style.background = a && one ? '#898781' : x.c;
  });
  document.querySelectorAll('[data-d]').forEach(b => {
    const x = MET.find(q => q.id === b.dataset.d);
    const a = onM.has(x.id);
    b.style.borderColor = a ? (one ? x.c : 'var(--text-primary)') : '';
    b.style.background = a ? (one ? x.c + '26' : 'var(--surface-1)') : '';
    b.style.opacity = a ? 1 : .6;
    b.querySelector('u').style.color = one ? x.c : '#898781';
  });
  document.querySelectorAll('[data-md]').forEach(b => {
    const a = b.dataset.md === mode;
    b.style.borderColor = a ? 'var(--text-primary)' : '';
    b.style.background = a ? 'var(--surface-1)' : '';
    b.style.opacity = a ? 1 : .6;
  });
}

function mkButtons() {
  $('gr').innerHTML = '';
  $('gm').innerHTML = '';
  $('md').innerHTML = '';
  REG.forEach(x => {
    const b = document.createElement('button');
    b.dataset.r = x.id;
    b.innerHTML = `<i></i>${nm(x)}`;
    b.onclick = () => {
      onR.has(x.id) ? onR.delete(x.id) : onR.add(x.id);
      paint();
      build();
    };
    $('gr').appendChild(b);
  });
  MET.forEach(x => {
    const b = document.createElement('button');
    b.dataset.d = x.id;
    b.innerHTML = `<u>${x.g}</u>${nm(x)}`;
    b.onclick = () => {
      onM.has(x.id) ? onM.delete(x.id) : onM.add(x.id);
      paint();
      build();
    };
    $('gm').appendChild(b);
  });
  ['lin', 'log', 'idx'].forEach(m => {
    const b = document.createElement('button');
    b.textContent = tr(m);
    b.dataset.md = m;
    b.onclick = () => {
      mode = m;
      paint();
      build();
    };
    $('md').appendChild(b);
  });
}
