#!/usr/bin/env node
/* Kartensätze aus den mehrsprachigen HTML-Fassungen in randfüllende A4-Karten umsetzen:
   Karten bis zum Blattrand, gestrichelte Schnittlinien, Übersetzung TR / AR / VI.
   Aufruf:  node tools/kaertchen/standalone/html2cards.js [rezept|minute1|minute2]   (ohne Argument: alle)
   Seite 1 des bisherigen PDFs (Anleitung / Rechen-Liste) bleibt erhalten (tools/kaertchen/standalone/orig/…_S1.pdf). */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const TMP = process.env.KTMP || fs.mkdtempSync(path.join(require('os').tmpdir(), 'kt-'));
const L = { tr: ['TR', 'ltr', '#c0392b'], ar: ['AR', 'rtl', '#1f8a80'], vi: ['VI', 'ltr', '#7d4fb0'] };
const SETS = {
  rezept: { src: 'LF3_Rezeptkarten_Rechnen_mehrsprachig.html', sel: 'article.card.rz', mode: 'block', cols: 2, rows: 2,
    out: 'LF3_Rezeptkarten_Rechnen.pdf', s1: 'LF3_Rezeptkarten_Rechnen_S1.pdf', foot: 'LF 3 · Rezeptkarten Rechnen', maxfs: 18, german: true },
  minute1: { src: 'LF3_Rechen-Minute_-_Karten_1-20_mehrsprachig.html', sel: 'article.card', mode: 'inline', cols: 2, rows: 2, duplex: true,
    out: 'LF3_Rechen-Minute_-_Karten_1-20.pdf', s1: 'LF3_Rechen-Minute_-_Karten_1-20_S1.pdf', foot: 'LF 3 · Rechen-Minute', maxfs: 15 },
  minute2: { src: 'LF3_Rechen-Minute_-_Karten_21-40_mehrsprachig.html', sel: 'article.card', mode: 'inline', cols: 2, rows: 2, duplex: true,
    out: 'LF3_Rechen-Minute_-_Karten_21-40.pdf', s1: 'LF3_Rechen-Minute_-_Karten_21-40_S1.pdf', foot: 'LF 3 · Rechen-Minute', maxfs: 15 },
};
const fontB64 = f => fs.readFileSync(path.join(ROOT, 'i18n', 'fonts', f)).toString('base64');
const CSS = `
@font-face{font-family:'NArab';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NArab';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-700-normal.woff2')}) format('woff2')}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733}
.page{width:210mm;height:297mm;display:grid;page-break-after:always;overflow:hidden}
.card{position:relative;overflow:hidden;border-top:3pt solid #2f6db5}
.in{position:absolute;left:6mm;right:6mm;top:4mm;bottom:8mm;display:flex;flex-direction:column;font-size:calc(var(--fs,11)*1pt);line-height:1.25}
.in>:first-child{margin-top:auto}.in>:last-child{margin-bottom:auto}
.in h3{font-size:1.25em;margin-bottom:.35em;color:#1f4e79}
.lab{font-weight:700;color:#2f6db5;font-size:.85em;margin-top:.5em}
.in ul{padding-left:1.1em;margin:.15em 0}.in ol{list-style:none}.in li{margin:.12em 0}
.falle{color:#b02a2a;margin-top:.45em}.falle:before{content:'⚠ '}
.in div{margin:.1em 0}
.blk{margin-top:.55em;padding-top:.45em;border-top:.5pt solid #bbb;font-size:.78em;line-height:1.22;display:grid;grid-template-columns:2.4em 1fr;column-gap:.5em}
.blk>i{font-style:normal;color:#fff;font-weight:700;font-size:.7em;border-radius:.3em;height:1.6em;line-height:1.6em;text-align:center;margin-top:.1em}
.blk[dir=rtl]{font-family:'NArab','Liberation Sans',sans-serif;line-height:1.35}
.ft{position:absolute;left:6mm;right:6mm;bottom:2.2mm;display:flex;justify-content:space-between;font-size:6pt;color:#6b7785}
/* Rechen-Minute */
.rm ol li{display:flex;gap:.6em;align-items:flex-start;margin:.7em 0}.rm ol li>b{min-width:1.1em;color:#2f6db5;font-size:1.1em}
.rm ol li>span{flex:1;font-size:1.05em}
.rm .line{display:block;border-bottom:.7pt solid #777;height:1.9em;margin-top:.1em}
.rm .stufe{font-size:.85em;color:#555;margin-bottom:.5em}
.tx{display:block;font-size:.66em;line-height:1.25;color:#33414f;margin:.1em 0 0}.tx i{font-style:normal;font-weight:700;color:#fff;border-radius:.25em;padding:0 .3em;margin-right:.35em;font-size:.85em}
.tx b.ar{font-family:'NArab','Liberation Sans',sans-serif;font-weight:400}
.rm.sol ol li{margin:.9em 0;font-size:1.3em}.rm.sol ol li>b{color:#3a8a3a}
.rm.sol .card,.card.back{border-top-color:#3a8a3a}
`;

async function extract(page, cfg) {
  await page.goto('file://' + path.join(ROOT, cfg.src));
  return page.evaluate(({ sel, mode, L }) => {
    const T = window.UB_I18N || {};
    const arts = [...document.querySelectorAll(sel)];
    const tx = (s, l) => (T[s.trim()] || {})[l];
    return arts.map(a => {
      const c = a.cloneNode(true); c.querySelectorAll('details').forEach(d => d.remove());
      const sol = a.querySelector('details ol.sol');
      const out = { title: (a.querySelector('h3') || {}).textContent, sol: sol ? sol.outerHTML : '' };
      if (mode === 'block') {
        out.de = c.innerHTML;
        out.t = Object.keys(L).map(l => {
          const d = c.cloneNode(true); d.querySelector('h3') && 0;
          d.querySelectorAll('span.tr').forEach(sp => { const t = tx(sp.textContent, l); if (t) sp.textContent = t; });
          return [l, d.innerHTML];
        });
      } else {
        c.querySelectorAll('span.tr').forEach(sp => {
          const lines = Object.keys(L).map(l => { const t = tx(sp.textContent, l); return t ? `<i style="background:${L[l][2]}">${L[l][0]}</i><b class="${l}" dir="${L[l][1]}">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</b>` : ''; }).filter(Boolean);
          if (lines.length) { const x = document.createElement('small'); x.className = 'tx'; x.innerHTML = lines.join('<br>'); sp.after(x); }
        });
        out.de = c.innerHTML;
      }
      return out;
    });
  }, { sel: cfg.sel, mode: cfg.mode, L });
}

function pageHtml(cards, cfg, kind) {
  const per = cfg.cols * cfg.rows; const pages = [];
  for (let o = 0; o < cards.length; o += per) {
    let chunk = cards.slice(o, o + per).map((c, k) => ({ c, k }));
    if (kind === 'back') { /* Wenden an der langen Kante: Spalten spiegeln */
      chunk = chunk.map(({ c, k }) => ({ c, k: Math.floor(k / cfg.cols) * cfg.cols + (cfg.cols - 1 - (k % cfg.cols)) })).sort((x, y) => x.k - y.k);
    }
    const html = chunk.map(({ c, k }) => {
      const b = `${k % cfg.cols ? 'border-left:.7pt dashed #444;' : ''}${Math.floor(k / cfg.cols) ? 'border-top:.7pt dashed #444;' : ''}`;
      let inner;
      if (kind === 'back') inner = `<div class="rm sol"><h3>${c.title} · Lösung</h3>${c.sol}</div>`;
      else if (cfg.mode === 'block') inner = c.de + (cfg.german ? [] : c.t).map(([l, h]) => `<div class="blk" dir="${L[l][1]}"><i style="background:${L[l][2]}">${L[l][0]}</i><div>${h}</div></div>`).join('');
      else inner = `<div class="rm">${c.de}</div>`;
      return `<div class="card" style="${b}"><div class="in">${inner}</div><div class="ft"><span>${cfg.foot}</span><span>${kind === 'back' ? 'Rückseite' : ''}</span></div></div>`;
    }).join('');
    pages.push(`<section class="page" style="grid-template-columns:repeat(${cfg.cols},1fr);grid-template-rows:repeat(${cfg.rows},1fr)">${html}</section>`);
  }
  return pages.join('');
}

const FIT = (maxfs) => {
  document.querySelectorAll('.page').forEach(pg => {
    const cs = [...pg.querySelectorAll('.card')]; let m = maxfs;
    cs.forEach(c => { const i = c.querySelector('.in'); let fs = maxfs; i.style.setProperty('--fs', fs);
      while (fs > 4 && (i.scrollHeight > i.clientHeight + .5 || i.scrollWidth > i.clientWidth + .5)) { fs -= .25; i.style.setProperty('--fs', fs); } m = Math.min(m, fs); });
    cs.forEach(c => c.querySelector('.in').style.setProperty('--fs', m)); pg.dataset.fs = m;
  });
  return [...document.querySelectorAll('.page')].map(p => +p.dataset.fs);
};

(async () => {
  const want = process.argv.slice(2); const b = await chromium.launch();
  for (const [id, cfg] of Object.entries(SETS)) {
    if (want.length && !want.includes(id)) continue;
    const p = await b.newPage(); const cards = await extract(p, cfg);
    let html = pageHtml(cards, cfg, 'front');
    if (cfg.duplex) { /* Vorder- und Rückseiten abwechselnd, je 4 Karten */
      const per = cfg.cols * cfg.rows, parts = [];
      for (let o = 0; o < cards.length; o += per) { const part = cards.slice(o, o + per); parts.push(pageHtml(part, cfg, 'front'), pageHtml(part, cfg, 'back')); }
      html = parts.join('');
    }
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
    const sizes = await p.evaluate(FIT, cfg.maxfs);
    const body = path.join(TMP, id + '_karten.pdf');
    await p.pdf({ path: body, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    await p.close();
    execFileSync('pdfunite', [path.join(__dirname, 'orig', cfg.s1), body, path.join(ROOT, cfg.out)]);
    console.log(cfg.out, cards.length, 'Karten, Schrift', Math.min(...sizes), '–', Math.max(...sizes), 'pt');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
