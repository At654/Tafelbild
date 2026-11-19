#!/usr/bin/env node
/* LF 4: Farb-Memory und Schaufenster-Quartett als randfüllende A4-Karten (2 Spalten, gestrichelte Schnittlinien).
   Aufruf:  node tools/kaertchen/standalone/simple_cards.js [memory|quartett]
   Seite 1 der bisherigen PDFs (Spielanleitung) bleibt erhalten (orig/…_S1.pdf). */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const TMP = process.env.KTMP || fs.mkdtempSync(path.join(require('os').tmpdir(), 'kt-'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- Farb-Memory: 12 Paare ---------- */
const P = [
  ['Rot', '#D32F2F', '', 'aktiviert, Signal, Kraft', 'Sonderangebote, Preisschilder im Angebot'],
  ['Orange', '#F57C00', '', 'hell, heiter, warm – fällt auf', 'Aktionsflächen, Kinderabteilung'],
  ['Gelb', '#FDD835', '', 'anregend, warm, freundlich', 'Backwarentheke'],
  ['Blau', '#1976D2', '', 'kühl, ruhig, Vertrauen', 'Beratungsecke für teure Matratzen'],
  ['Grün', '#388E3C', '', 'natürlich, frisch, entspannend', 'Obst und Gemüse, Bio'],
  ['Weiß', '#FFFFFF', '', 'sauber, frisch, festlich', 'Drogerie, Brautmode'],
  ['Schwarz', '#212121', '', 'feierlich, elegant', 'Juwelier (mit Gold oder Weiß)'],
  ['Warmes Licht', '#FFF3C4', '💡', 'lässt Brot, Fleisch und Obst appetitlich wirken', ''],
  ['Naturgetreues Licht', '#E3F2FD', '☀️', 'Textilien: Die Farbe sieht zu Hause genauso aus wie im Laden', ''],
  ['Akzentbeleuchtung', '#EDE7F6', '🔦', 'ein Spot hebt einzelne Ware hervor', ''],
  ['Grundbeleuchtung', '#E8F5E9', '🏬', 'gleichmäßige Helligkeit im ganzen Verkaufsraum', ''],
  ['Kaltes, bläuliches Licht an der Fleischtheke', '#E1F5FE', '🥶', 'Fehler! Fleisch wirkt grau und unappetitlich', ''],
];
const light = c => { const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150; };
const memCards = [];
P.forEach(([a, c, i, b, b2], k) => {
  memCards.push(`<div class="mc a" style="background:${c};color:${light(c) ? '#1d2733' : '#fff'}">${i ? `<div class="ic">${i}</div>` : ''}<div class="big">${esc(a)}</div></div>`);
  memCards.push(`<div class="mc b"><div class="eff">${esc(b)}</div>${b2 ? `<div class="ex">z. B. ${esc(b2)}</div>` : ''}</div>`);
});

/* ---------- Schaufenster-Quartett: 6 Quartette A–D ---------- */
const Q = [
  ['Übersichtsfenster', '#2f6db5', '#e8f0fb', ['Merkmal', 'Beispiel', 'Ziel', 'Tipp'], ['zeigt einen Überblick über das Sortiment', 'Kaufhaus – aus jeder Abteilung ein Artikel', 'informieren, zeigen, was es gibt', 'nicht überladen, Warengruppen bilden']],
  ['Fantasiefenster', '#d9741a', '#fdebdc', ['Merkmal', 'Beispiel', 'Ziel', 'Tipp'], ['originelle Szene unter einem Leitgedanken', 'Strandszene „Endlich Urlaub“', 'begeistern, Gefühle wecken', 'Die Ware muss erkennbar bleiben']],
  ['Stapelfenster', '#3a8a3a', '#e6f4e6', ['Merkmal', 'Beispiel', 'Ziel', 'Tipp'], ['eine Warengruppe in großer Menge', 'Weinhandlung mit Flaschenpyramiden', 'Auswahl und Menge zeigen, preiswert wirken', 'ordentlich und gleichmäßig stapeln']],
  ['Durchblickfenster', '#1f8a80', '#e0f4f2', ['Merkmal', 'Beispiel', 'Ziel', 'Tipp'], ['freier Blick in den Verkaufsraum', 'Optiker, Autohaus', 'Der Laden selbst lädt zum Eintreten ein', 'Der Verkaufsraum muss aufgeräumt sein']],
  ['Anlassfenster', '#7d4fb0', '#f0e8f8', ['Merkmal', 'Beispiel', 'Ziel', 'Tipp'], ['ein besonderer Anlass steht im Mittelpunkt', 'Weihnachten, Schulanfang, Muttertag', 'an den Anlass erinnern, Geschenkideen geben', 'rechtzeitig vor dem Anlass gestalten']],
  ['Gestaltungsregeln', '#c2477f', '#fbe7f0', ['Blickfang', 'Preise', 'Licht', 'Wechsel'], ['ein Hingucker für 3–4 Sekunden', 'Pflicht nach der Preisangabenverordnung', 'auch abends beleuchten', 'regelmäßig neu gestalten']],
];
const quartPages = Q.map(([name, ac, bg, labels, vals]) => ['A', 'B', 'C', 'D'].map((l, i) =>
  `<div class="qc" style="background:${bg};--ac:${ac}"><div class="qt">${esc(name)} ${l}</div>${labels.map((lab, j) =>
    `<div class="qf${i === j ? ' on' : ''}"><b>${esc(lab)}</b>${i === j ? `<span>${esc(vals[j])}</span>` : '<span class="blank"></span>'}</div>`).join('')}</div>`));

const SETS = {
  memory: { out: 'LF4_Farb-Memory.pdf', s1: 'LF4_Farb-Memory_S1.pdf', cols: 2, rows: 4, cards: memCards, foot: 'LF 4 · Modul 2 · Farb-Memory' },
  quartett: { out: 'LF4_Schaufenster-Quartett.pdf', s1: 'LF4_Schaufenster-Quartett_S1.pdf', cols: 2, rows: 2, cards: quartPages.flat(), foot: 'LF 4 · Modul 3 · Schaufenster-Quartett' },
};
const CSS = `
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733}
.page{width:210mm;height:297mm;display:grid;page-break-after:always;overflow:hidden}
.cell{position:relative;overflow:hidden}.cell>*{position:absolute;inset:0}
.ft{position:absolute!important;inset:auto 5mm 2mm 5mm!important;display:flex;justify-content:space-between;font-size:6pt;color:#6b7785}
.mc{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:8mm;font-size:calc(var(--fs,20)*1pt)}
.mc.b{background:#fff}.mc .big{font-size:1.9em;font-weight:700;line-height:1.1}.mc .ic{font-size:3em;line-height:1.1}
.mc .eff{font-size:1.2em;font-weight:700;line-height:1.25;color:#1f3a5a}.mc .ex{margin-top:.7em;font-size:.95em;color:#333}
.qc{padding:7mm 7mm 9mm;display:flex;flex-direction:column;justify-content:center;gap:3.2mm;font-size:calc(var(--fs,14)*1pt);border-top:3.5pt solid var(--ac)}
.qt{font-size:1.45em;font-weight:700;color:var(--ac);margin-bottom:1mm}
.qf{background:#fff;border:.8pt solid var(--ac);border-radius:2mm;padding:2.2mm 3mm;min-height:19mm;display:flex;flex-direction:column;justify-content:center}
.qf b{font-size:.78em;color:var(--ac);text-transform:uppercase;letter-spacing:.04em}.qf span{font-size:1em;line-height:1.2;margin-top:.5mm}.qf.on{border-width:1.6pt}
`;
const FIT = () => document.querySelectorAll('.page').forEach(pg => {
  const cs = [...pg.querySelectorAll('.cell>*:not(.ft)')]; let m = 99;
  cs.forEach(c => { let fs = +(c.classList.contains('qc') ? 22 : 20); c.style.setProperty('--fs', fs);
    while (fs > 5 && (c.scrollHeight > c.clientHeight + .5 || c.scrollWidth > c.clientWidth + .5)) { fs -= .25; c.style.setProperty('--fs', fs); } m = Math.min(m, fs); });
  cs.forEach(c => c.style.setProperty('--fs', m));
});
(async () => {
  const want = process.argv.slice(2); const b = await chromium.launch();
  for (const [id, cfg] of Object.entries(SETS)) {
    if (want.length && !want.includes(id)) continue;
    const per = cfg.cols * cfg.rows, pages = [];
    for (let o = 0; o < cfg.cards.length; o += per) {
      pages.push(`<section class="page" style="grid-template-columns:repeat(${cfg.cols},1fr);grid-template-rows:repeat(${cfg.rows},1fr)">${cfg.cards.slice(o, o + per).map((c, k) =>
        `<div class="cell" style="${k % cfg.cols ? 'border-left:.7pt dashed #444;' : ''}${Math.floor(k / cfg.cols) ? 'border-top:.7pt dashed #444;' : ''}">${c}<div class="ft"><span>${cfg.foot}</span></div></div>`).join('')}</section>`);
    }
    const p = await b.newPage();
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('')}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.evaluate(FIT);
    const body = path.join(TMP, id + '_karten.pdf');
    await p.pdf({ path: body, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    await p.close();
    execFileSync('pdfunite', [path.join(__dirname, 'orig', cfg.s1), body, path.join(ROOT, cfg.out)]);
    console.log(cfg.out, cfg.cards.length, 'Karten,', pages.length, 'Kartenseiten');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
