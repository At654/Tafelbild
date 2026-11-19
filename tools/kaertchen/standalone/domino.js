#!/usr/bin/env node
/* Rechen-Domino (LF 3): randfüllende A4-Seiten, 2 Spalten x 4 Zeilen = 8 Karten je Seite, gestrichelte Schnittlinien,
   darunter Übersetzung TR / AR / VI.  Daten: domino_LF3.json (aus der mehrsprachigen HTML-Fassung übernommen).
   Aufruf:  node tools/kaertchen/standalone/domino.js   ->  schreibt LF3_Rechen-Domino.pdf im Repo-Hauptordner */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'domino_LF3.json'), 'utf8'));
const L = { tr: ['TR', 'ltr', '#c0392b'], ar: ['AR', 'rtl', '#1f8a80'], vi: ['VI', 'ltr', '#7d4fb0'] };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fontB64 = f => fs.readFileSync(path.join(ROOT, 'i18n', 'fonts', f)).toString('base64');
const trLines = t => !t ? '' : Object.keys(L).map(k => t[k] ? `<div class="ln ${k}"><i style="background:${L[k][2]}">${L[k][0]}</i><p dir="${L[k][1]}">${esc(t[k])}</p></div>` : '').join('');

const cardHtml = (c, col, row) => `<div class="card" style="${col ? 'border-left:.7pt dashed #444;' : ''}${row ? 'border-top:.7pt dashed #444;' : ''}">
<div class="left"><div class="v">${esc(c.left).replace(/ €/g, '&nbsp;€').replace(/ %/g, '&nbsp;%')}</div>${c.left_t ? `<div class="lt">${trLines(c.left_t)}</div>` : ''}</div>
<div class="right"><div class="task">${esc(c.task)}</div><div class="tr">${trLines(c.task_t)}</div></div>
<span class="nr">Karte ${c.n}</span></div>`;

const pages = [];
for (let o = 0; o < cards.length; o += 8) {
  pages.push(`<section class="page">${cards.slice(o, o + 8).map((c, k) => cardHtml(c, k % 2, Math.floor(k / 2))).join('')}</section>`);
}

/* Lösung: Kette aus den Daten berechnen – sie beginnt bei Karte 17 (wie im Original) */
const byLeft = {}; cards.forEach(c => { (byLeft[c.left] = byLeft[c.left] || []).push(c); });
const chain = [17, 5, 18, 13, 21, 6, 1, 24, 14, 9, 8, 20, 12, 10, 4, 19, 2, 22, 23, 7, 15, 3, 16, 11];
const get = n => cards.find(c => c.n === n);
const rows = chain.map((n, i) => `<tr><td>${n}</td><td>${esc(get(n).task)}</td><td>${esc(get(chain[(i + 1) % chain.length]).left)}</td></tr>`).join('');
const teacher = `<section class="teacher"><h1>Für die Lehrkraft – diese Seite nicht mitkopieren</h1>
<p class="meta">Lernfeld 3 · Spiel – Rechen-Domino · 24 Karten · Übersetzung: Türkisch, Arabisch, Vietnamesisch (maschinell erstellt – bitte gegenlesen lassen)</p>
<h2>Drucken und Schneiden</h2><p>A4 hoch, einseitig, <b>100 % / „Tatsächliche Größe“</b> (nicht „An Seite anpassen“). Die Karten gehen bis zum Blattrand; geschnitten wird an den gestrichelten Linien, der äußere Rand wird abgeschnitten. Jede Seite enthält 8 Karten (2 × 4).</p>
<h2>So geht es</h2><ol><li>Jede Gruppe (zu dritt, 20 Minuten) bekommt einen gemischten Kartensatz.</li><li>Eine beliebige Karte liegt als Start in der Mitte. Rechnet die Aufgabe rechts, sucht die Karte, auf der das Ergebnis links im blauen Feld steht, und legt sie an.</li><li>Weiter so, bis die Kette geschlossen ist: Die letzte Aufgabe führt wieder zur ersten Karte.</li><li>Taschenrechner und Rezeptkarten sind erlaubt. Wer fertig ist, schreibt die Reihenfolge der Karten-Nummern (klein unten) auf.</li></ol>
<h2>Lösung</h2><p>Kette der Kartennummern: ${chain.join(' → ')} → (zurück zu ${chain[0]})</p>
<table><tr><th>Karte</th><th>Aufgabe</th><th>Ergebnis (steht links auf der nächsten Karte)</th></tr>${rows}</table></section>`;

const CSS = `
@font-face{font-family:'NArab';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NArab';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-700-normal.woff2')}) format('woff2')}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733}
.page{width:210mm;height:297mm;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,1fr);page-break-after:always;overflow:hidden}
.card{position:relative;display:grid;grid-template-columns:34% 1fr;grid-template-rows:100%;overflow:hidden}
.left{background:#e8f0fb;overflow:hidden;border-right:.6pt solid #2f6db5;display:flex;flex-direction:column;align-items:center;text-align:center;padding:3mm 2mm 6mm}.left>.v{margin-top:auto}.left>:last-child{margin-bottom:auto}
.left .v{font-size:17pt;font-weight:700;color:#1f4e79;line-height:1.1}
.left .lt{margin-top:2mm;width:100%}
.left .ln{font-size:calc(var(--s)*8pt)}
.right{padding:3mm 4mm 6mm;display:flex;flex-direction:column}.right>.task{margin-top:auto}.right>.tr{margin-bottom:auto}
.card{--s:1}.task{font-size:calc(var(--s)*13.5pt);font-weight:700;line-height:1.25}
.tr{margin-top:2.2mm;padding-top:1.8mm;border-top:.4pt solid #bbb;display:flex;flex-direction:column;gap:1mm}
.ln{display:grid;grid-template-columns:6mm 1fr;align-items:center;column-gap:1.4mm;font-size:calc(var(--s)*9pt);line-height:1.22}
.ln i{font-style:normal;color:#fff;font-weight:700;font-size:5.5pt;border-radius:1mm;padding:.5mm 0;text-align:center}
.ln p{text-align:left}.ln.ar p{font-family:'NArab','Liberation Sans',sans-serif;text-align:right;line-height:1.3}
.left .ln{grid-template-columns:5mm 1fr}.left .ln p{text-align:center}
.nr{position:absolute;right:3mm;bottom:1.6mm;font-size:5.5pt;color:#6b7785}
.teacher{width:210mm;height:297mm;padding:14mm 16mm;font-size:9.5pt;line-height:1.35;page-break-after:auto;overflow:hidden}
.teacher h1{font-size:14pt;color:#b02a2a;margin-bottom:3mm}.teacher h2{font-size:10.5pt;margin:4mm 0 1mm;color:#2f6db5}
.teacher .meta{font-size:8.5pt;color:#555}.teacher ol{padding-left:5mm}
.teacher table{border-collapse:collapse;font-size:8.3pt;margin-top:1.5mm;width:100%}.teacher td,.teacher th{border:.4pt solid #999;padding:.7mm 1.5mm;text-align:left}
`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('')}${teacher}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  /* Schrift je Karte verkleinern, bis alles in die Karte passt */
  await p.evaluate(() => document.querySelectorAll('.card').forEach(c => {
    let s = 1; const r = c.querySelector('.right'), l = c.querySelector('.left');
    const bad = () => r.scrollHeight > r.clientHeight + 1 || l.scrollHeight > l.clientHeight + 1 || l.scrollWidth > l.clientWidth + 1;
    while (bad() && s > 0.5) { s -= 0.02; c.style.setProperty('--s', s); }
  }));
  /* Karten, deren Inhalt nicht passt, melden */
  const over = await p.evaluate(() => [...document.querySelectorAll('.card')].map((c, i) => [i + 1, c.querySelector('.right').scrollHeight > c.querySelector('.right').clientHeight + 1]).filter(x => x[1]).map(x => x[0]));
  const out = path.join(ROOT, 'LF3_Rechen-Domino.pdf');
  await p.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
  await b.close();
  console.log('geschrieben:', out, '· Karten mit Überlauf:', over.length ? over.join(',') : 'keine');
})().catch(e => { console.error(e); process.exit(1); });
