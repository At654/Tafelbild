#!/usr/bin/env node
/* Weitere Kartensätze, randfüllend mit gestrichelten Schnittlinien und Übersetzung TR / AR / VI:
   bingo   -> LF2_M_1_Bingokarten_1_Seite.pdf          (4 Seiten, je Bingokarte eine Seite)
   rollen  -> LF2_Rollenspiel_-_Das_ganze_Gespraech.pdf (Seite 3 Warenkarten, Seite 4 Kundenkarten ersetzt; Seiten 1, 2, 5, 6 bleiben)
   lf6     -> LF6_M_14_Planspiel_Karten.pdf             (Angebote A–C und Ereigniskarten)
   tee     -> LF3_M_12_Preisschilder_Tee-Waage.pdf      (4 Preisschilder)
   Aufruf: node tools/kaertchen/standalone/extra.js [bingo|rollen|lf6|tee]
   Texte und Übersetzungen: extra_data.js (maschinell erstellt – bitte gegenlesen lassen). */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const D = require('./extra_data.js');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const ORIG = path.join(__dirname, 'orig');
const TMP = process.env.KTMP || fs.mkdtempSync(path.join(require('os').tmpdir(), 'kt-'));
const L = { tr: ['TR', 'ltr', '#c0392b'], ar: ['AR', 'rtl', '#1f8a80'], vi: ['VI', 'ltr', '#7d4fb0'] };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fontB64 = f => fs.readFileSync(path.join(ROOT, 'i18n', 'fonts', f)).toString('base64');
const ln = (l, html) => `<div class="ln ${l}"><i style="background:${L[l][2]}">${L[l][0]}</i><p dir="${L[l][1]}">${html}</p></div>`;
const trAll = f => Object.keys(L).map(l => ln(l, f(l))).join('');

const CSS = `
@font-face{font-family:'NArab';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NArab';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-700-normal.woff2')}) format('woff2')}
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733}
.page{width:210mm;height:297mm;display:grid;page-break-after:always;overflow:hidden;position:relative}
.cell{position:relative;overflow:hidden}
.in{position:absolute;left:5mm;right:5mm;top:4mm;bottom:7mm;display:flex;flex-direction:column;font-size:calc(var(--fs,11)*1pt);line-height:1.25}
.in>:first-child{margin-top:auto}.in>:last-child{margin-bottom:auto}
.ft{position:absolute;left:5mm;right:5mm;bottom:1.8mm;display:flex;justify-content:space-between;font-size:6pt;color:#6b7785}
.h{font-weight:700;color:#1f4e79;font-size:1.15em;margin-bottom:.3em}
.sub{font-size:.9em;color:#33414f}
.tr{margin-top:.5em;padding-top:.4em;border-top:.5pt solid #bbb;display:flex;flex-direction:column;gap:.28em}
.ln{display:grid;grid-template-columns:2.3em 1fr;align-items:start;column-gap:.4em;font-size:.82em;line-height:1.22}
.ln i{font-style:normal;color:#fff;font-weight:700;font-size:.62em;border-radius:.3em;padding:.25em 0;text-align:center;margin-top:.2em}
.ln.ar p{font-family:'NArab','Liberation Sans',sans-serif;line-height:1.32;text-align:right}
.ln b{font-weight:700}
.top{position:absolute;left:8mm;right:8mm;top:7mm;height:26mm}
.top h1{font-size:19pt;color:#1f4e79}.top p{font-size:10pt;color:#555;margin-top:1.5mm}
.bing{position:absolute;left:0;right:0;top:36mm;bottom:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);border-top:.7pt solid #444}
.bing .cell{border-right:.7pt solid #777;border-bottom:.7pt solid #777}.bing .cell:nth-child(3n){border-right:0}.bing .cell:nth-child(n+7){border-bottom:0}
.bing .de{font-size:1.25em;font-weight:700;text-align:center;line-height:1.2}.bing .tr{text-align:center}.bing .ln{grid-template-columns:2.1em 1fr}.bing .ln p{text-align:center}
.card{border-top:3pt solid var(--ac,#2f6db5)}
.wname{font-size:1.2em;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:#1f4e79}
.price{font-weight:700;margin:.15em 0}.feat b{color:#2f6db5}
.kunde b.k{color:#2f6db5}.kunde .a{margin-top:.25em}
.ang h4{font-size:1em;color:#1f4e79;margin-bottom:.35em}.ang ul{padding-left:1.1em}.ang li{margin:.08em 0}
.tt .n{font-size:2.2em;font-weight:700;color:#1f4e79}.tt .p{font-size:2.8em;font-weight:700;margin-top:.1em}.tt .g{font-size:.9em;color:#777;margin-top:.5em;border-top:.5pt dashed #bbb;padding-top:.35em}
.tt .tn{display:flex;gap:.8em;font-size:.8em;margin-top:.7em;color:#33414f}
.note{font-size:.95em}.note p{margin:.35em 0}
`;
const FIT = () => [...document.querySelectorAll('.page')].map(pg => {
  const mx = +(pg.dataset.maxfs || 14); const cs = [...pg.querySelectorAll('.cell .in')]; let m = mx;
  cs.forEach(i => { let fs = mx; i.style.setProperty('--fs', fs);
    while (fs > 4 && (i.scrollHeight > i.clientHeight + .5 || i.scrollWidth > i.clientWidth + .5)) { fs -= .25; i.style.setProperty('--fs', fs); } m = Math.min(m, fs); });
  cs.forEach(i => i.style.setProperty('--fs', m)); return m;
});

const gridPage = (cells, cols, rows, maxfs, foot, cls = '') => `<section class="page" data-maxfs="${maxfs}" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)">${cells.map((c, k) =>
  `<div class="cell ${cls}" style="${k % cols ? 'border-left:.7pt dashed #444;' : ''}${Math.floor(k / cols) ? 'border-top:.7pt dashed #444;' : ''}">${c}<div class="ft"><span>${esc(foot)}</span></div></div>`).join('')}</section>`;
const inner = h => `<div class="in">${h}</div>`;

/* ---------- Bingo ---------- */
const bingoHtml = () => { const B = D.bingo(); return Object.keys(B).sort().map(k => `<section class="page" data-maxfs="16">
  <div class="top"><h1>Gesprächsstörer-Bingo · Karte ${k}</h1><p>Name: ______________________________ &nbsp;&nbsp; Streiche jeden Satz durch, den du hörst. Drei in einer Reihe = BINGO!</p></div>
  <div class="bing">${B[k].map(c => `<div class="cell"><div class="in"><div class="de">${esc(c.de)}</div><div class="tr">${trAll(l => esc(c[l]))}</div></div></div>`).join('')}</div></section>`).join(''); };

/* ---------- Rollenspiel ---------- */
const warenCells = () => D.WAREN.map(w => inner(`<div class="wname">${esc(w.name)}</div><div class="price">${esc(w.price)}</div><div class="feat"><b>Merkmale:</b> ${esc(w.feat)}</div>
  <div class="tr">${trAll(l => `<b>${esc(w[l][0])}</b> – <b>${esc(D.WAREN_LABEL[l])}:</b> ${esc(w[l][1])}`)}</div>`));
const kundenCells = () => D.KUNDEN.map((c, i) => inner(`<div class="kunde"><b class="k">KUNDE ${i + 1}</b> — ${esc(c.de)}<div class="a"><b>Kaufmotiv:</b> ${esc(c.motiv)}.</div><div class="a"><b>Einwand:</b> ${esc(c.einwand)}</div><div class="a">${esc(c.kauf)}</div></div>
  <div class="tr">${trAll(l => `<b>${D.KUNDE_LABEL[l]} ${i + 1}</b> — ${esc(c[l])}`)}</div>`));

/* ---------- LF 6 Planspiel ---------- */
const angCells = () => D.ANGEBOTE.map(a => inner(`<div class="ang"><h4>${esc(a.title)}</h4><ul>${a.de.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="tr">${trAll(l => `<b>${l === 'ar' ? '' : ''}</b>${a[l].map(esc).join(' · ')}`)}</div>`));
const evCells = () => D.EREIGNISSE.map(e => inner(`<div class="h">${esc(e.title)}</div><div>${esc(e.de)}</div><div class="tr">${trAll(l => `<b>${esc(e[l][0])}.</b> ${esc(e[l][1])}`)}</div>`));

/* ---------- Tee-Preisschilder ---------- */
const teeCells = () => D.TEE.map(t => `<div class="in tt" style="align-items:center;text-align:center;justify-content:center"><div class="n">${esc(t.name)}</div><div class="p">1 kg = ${esc(t.kg)}</div><div class="tn"><span>TR ${esc(t.tr)}</span><span dir="rtl" style="font-family:NArab">AR ${esc(t.ar)}</span><span>VI ${esc(t.vi)}</span></div><div class="g">100 g = ${esc(t.g100)}</div></div>`);

const JOBS = {
  bingo: { out: 'LF2_M_1_Bingokarten_1_Seite.pdf', html: bingoHtml },
  rollen: { out: 'LF2_Rollenspiel_-_Das_ganze_Gespraech.pdf', merge: true,
    html: () => gridPage(warenCells(), 2, 4, 14, 'LF 2 · Das große Rollenspiel · Warenkarten · ausschneiden, verdeckt ziehen lassen', 'card') + gridPage(kundenCells(), 2, 4, 14, 'LF 2 · Das große Rollenspiel · Kundenkarten · ausschneiden, verdeckt ziehen lassen', 'card') },
  lf6: { out: 'LF6_M_14_Planspiel_Karten.pdf',
    html: () => gridPage([...angCells(), inner(`<div class="note"><div class="h">Phase 3: Die Angebote</div><p>Ausschneiden und an die Teams geben (je Team ein Satz A–C).</p><p>Aufgabe 3.1: Bezugspreis für 240 Stück berechnen.<br>Aufgabe 3.2: Entscheidungsbewertung ausfüllen.</p><div class="tr">${trAll(l => ({ tr: 'Kesip ekiplere verin. Her ekip için A–C setidir.', ar: 'قصّوها وأعطوها للفرق (مجموعة A–C لكل فريق).', vi: 'Cắt ra và đưa cho các nhóm (mỗi nhóm một bộ A–C).' }[l]))}</div></div>`)], 2, 2, 15, 'LF 6 · Modul 14 · Planspiel · Phase 3: Angebote', 'card')
      + gridPage(evCells(), 2, 3, 14, 'LF 6 · Modul 14 · Planspiel · Phase 5: Ereigniskarten · ausschneiden, verdeckt ziehen lassen', 'card') },
  tee: { out: 'LF3_M_12_Preisschilder_Tee-Waage.pdf', html: () => gridPage(teeCells(), 2, 2, 20, 'LF 3 · Modul 12 · Preisschilder Tee-Waage · ausschneiden') },
};

(async () => {
  const want = process.argv.slice(2); const b = await chromium.launch();
  for (const [id, job] of Object.entries(JOBS)) {
    if (want.length && !want.includes(id)) continue;
    const p = await b.newPage();
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${job.html()}</body></html>`);
    await p.evaluate(() => document.fonts.ready); const sizes = await p.evaluate(FIT);
    const body = path.join(TMP, id + '.pdf');
    await p.pdf({ path: body, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    await p.close();
    const out = path.join(ROOT, job.out);
    if (job.merge) {
      const parts = [1, 2].map(n => path.join(ORIG, `LF2_Rollenspiel_p${n}.pdf`));
      execFileSync('pdfseparate', [body, path.join(TMP, 'r%d.pdf')]);
      execFileSync('pdfunite', [...parts, path.join(TMP, 'r1.pdf'), path.join(TMP, 'r2.pdf'), path.join(ORIG, 'LF2_Rollenspiel_p5.pdf'), path.join(ORIG, 'LF2_Rollenspiel_p6.pdf'), out]);
    } else fs.copyFileSync(body, out);
    console.log(job.out, 'Schrift', sizes.map(s => s.toFixed(1)).join('/'), 'pt');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
