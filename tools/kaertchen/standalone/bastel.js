#!/usr/bin/env node
/* Übersetzungsblätter zu den Bastelbögen (deutsche Bögen ohne eigene Übersetzungsfassung).
   Je Bogen und Version eine PDF (A4 hoch) mit Titel, Ablauf und den Wörtern/Texten des Bogens auf Deutsch + Zielsprachen.
   Daten: bastel_data_*.js (Texte: [de, tr, ar, vi, es, pt, ti, ru]).
   Aufruf: node tools/kaertchen/standalone/bastel.js [LF1_M10 …]     (ohne Argument: alle) */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT = path.join(ROOT, 'materials', 'bastelboegen');
const LANGS = [null, ['TR', 'ltr', '#c0392b', 'Türkçe'], ['AR', 'rtl', '#1f8a80', 'العربية'], ['VI', 'ltr', '#7d4fb0', 'Tiếng Việt'], ['ES', 'ltr', '#d9741a', 'Español'], ['PT', 'ltr', '#3a8a3a', 'Português'], ['TI', 'ltr', '#2f6db5', 'ትግርኛ'], ['RU', 'ltr', '#b02a6a', 'Русский']];
const VERS = { V26_1: { idx: [6, 4, 7, 5], tag: 'V26-1', names: 'TI · ES · RU · PT' }, V26_2: { idx: [3, 2, 1], tag: 'V26-2', names: 'VI · AR · TR' }, VI_AR_TR: { idx: [3, 2, 1], tag: 'DE-VI-AR-TR', names: 'VI · AR · TR' } };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fontB64 = f => fs.readFileSync(path.join(ROOT, 'i18n', 'fonts', f)).toString('base64');
const CSS = `
@font-face{font-family:'NArab';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NArab';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'NEth';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-ethiopic-ethiopic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NEth';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-ethiopic-ethiopic-700-normal.woff2')}) format('woff2')}
@page{size:A4;margin:12mm 14mm 14mm}
*{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733;font-size:9.6pt;line-height:1.28}
header{border-bottom:2pt solid #2f6db5;padding-bottom:2.5mm;margin-bottom:3.5mm}
.tag{font-size:8.5pt;color:#fff;background:#2f6db5;border-radius:1.5mm;padding:.6mm 2.2mm;display:inline-block;font-weight:700}
h1{font-size:17pt;color:#1f4e79;margin-top:1.5mm}
.tt{display:flex;flex-wrap:wrap;gap:1mm 4mm;margin-top:1.5mm;font-size:9.5pt;color:#33414f}
.tt span{display:inline-flex;gap:1.2mm;align-items:baseline}
h2{font-size:11.5pt;color:#2f6db5;margin:4mm 0 1.5mm;border-bottom:.5pt solid #c9d5e2;padding-bottom:.7mm}
.it{break-inside:avoid;padding:1.4mm 0;border-bottom:.4pt dashed #cfd6de}
.de{font-weight:700;font-size:10pt}
.ln{display:grid;grid-template-columns:7mm 1fr;column-gap:1.6mm;align-items:start;margin-top:.5mm}
.ln i{font-style:normal;color:#fff;font-weight:700;font-size:5.8pt;border-radius:.9mm;padding:.45mm 0;text-align:center;margin-top:.45mm}
.ln.ar p{font-family:'NArab','Liberation Sans',sans-serif;text-align:right;line-height:1.38}
.ln.ti p{font-family:'NEth','Liberation Sans',sans-serif;line-height:1.35}
footer{margin-top:5mm;font-size:7.5pt;color:#6b7785;border-top:.4pt solid #ccc;padding-top:1.5mm}
`;
function pageHtml(b, vk) {
  const v = VERS[vk];
  const line = (arr, i) => { const [code, dir, col] = LANGS[i]; return `<div class="ln${i === 2 ? ' ar' : i === 6 ? ' ti' : ''}"><i style="background:${col}">${code}</i><p dir="${dir}">${esc(arr[i])}</p></div>`; };
  const body = b.sections.map(s => `<h2>${esc(s.h[0])} <span style="font-weight:400;font-size:9pt;color:#5a6978">· ${v.idx.map(i => esc(s.h[i])).join(' · ')}</span></h2>` + s.items.map(it => `<div class="it"><div class="de">${esc(it[0])}</div>${v.idx.map(i => line(it, i)).join('')}</div>`).join('')).join('');
  const tt = v.idx.map(i => `<span><b style="color:${LANGS[i][2]}">${LANGS[i][0]}</b> ${esc(b.title[i])}</span>`).join('');
  return `<header><span class="tag">${esc(b.lf)} · Übersetzung ${esc(v.names)}</span><h1>${esc(b.title[0])}</h1><div class="tt">${tt}</div></header>${body}<footer>Zum Bastelbogen „${esc(b.file)}“ (Deutsch). Übersetzung maschinell erstellt – bitte von Muttersprachlerinnen und Muttersprachlern gegenlesen lassen (besonders Tigrinya).</footer>`;
}
(async () => {
  const want = process.argv.slice(2);
  const data = fs.readdirSync(__dirname).filter(f => /^bastel_data_.*\.js$/.test(f)).flatMap(f => require(path.join(__dirname, f)));
  const br = await chromium.launch(); const made = [];
  for (const b of data) {
    if (want.length && !want.includes(b.id)) continue;
    for (const vk of b.versions) {
      const v = VERS[vk];
      for (const it of b.sections.flatMap(s => s.items)) for (const i of v.idx) if (!it[i]) throw new Error(`Text fehlt: ${b.id} ${LANGS[i][0]} ${it[0]}`);
      const p = await br.newPage();
      await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pageHtml(b, vk)}</body></html>`);
      await p.evaluate(() => document.fonts.ready);
      const out = path.join(OUT, b.dir, `${b.file}_Uebersetzung_${vk}.pdf`);
      await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
      await p.close(); made.push(path.relative(ROOT, out));
    }
  }
  await br.close(); console.log(made.join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
