#!/usr/bin/env node
/* Hängt an das bestehende Lehrkraft-PDF "<id>_Einstiegsmaterial.pdf" ein Ergänzungsblatt mit den Karten an,
   die ein Kartensatz auf 20 verschiedene Karten erweitert haben (nur deutsche Texte, zum Ausschneiden).
   Basis ist immer die Fassung aus dem Branch "main", damit ein erneuter Lauf nichts doppelt anhängt.
   Aufruf: node tools/kaertchen/zusatzkarten.js LF2_M_2 [LF2_M_5 ...]   (ohne Argument: alle aus ZUSATZ) */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const BASEREF = process.env.BASEREF || 'main';
/* Blattname -> Nummer der ersten neuen Karte (0-basiert = Anzahl der bisherigen Karten) */
const ZUSATZ = {
  LF2_M_2: { 'Gefühlskarten': 8 }, LF2_M_5: { 'Verhaltenskarten': 16, 'Motivkarten': 16 },
  LF2_M_6: { 'Themenkarten': 12 }, LF2_M_7: { 'Geheime Warenkarten': 12 }, LF2_M_8: { 'Begriffskarten': 14 },
  LF2_M_12: { 'Beschwerdekarten': 12 }, LF2_M_14: { 'Signalkarten': 12 },
  LF5_M_6: { 'Streitkarten': 12 }, LF5_M_10: { 'Argumentkarten': 12 },
  LF3_M_2: { 'Kundenkarten': 6 }, LF3_M_5: { 'Situationskarten': 8 }, WiSo1_M_6: { 'Aussagen': 8 },
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function sheets(id) {
  const out = {}; let cur = null, inSol = false; const sol = [];
  for (const line of fs.readFileSync(path.join(__dirname, 'data', id + '.txt'), 'utf8').split('\n')) {
    if (inSol) { sol.push(line); continue; }
    if (line.startsWith('solution:')) { inSol = true; continue; }
    if (line.startsWith('sheet:')) { cur = line.slice(6).split('|')[0].trim(); out[cur] = []; }
    else if (line.startsWith('de:') && cur) out[cur].push(line.slice(3).trim());
  }
  return { out, sol };
}
const fmt = t => { const k = t.indexOf(' // '); return k < 0 ? `<b>${esc(t)}</b>` : `<b>${esc(t.slice(0, k))}</b> — ${esc(t.slice(k + 4))}`; };
async function main() {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ZUSATZ);
  const browser = await chromium.launch(); const tmp = fs.mkdtempSync('/tmp/zk-');
  for (const id of ids) {
    const cfg = ZUSATZ[id]; if (!cfg) { console.error('unbekannt:', id); continue; }
    const { out, sol } = sheets(id); const modNr = id.replace(/^LF(\d+)_M_(\d+)$/, 'LF $1 · Modul $2').replace(/^WiSo(\d)_M_(\d+)$/, 'WiSo $1 · Modul $2');
    let body = '';
    for (const [name, from] of Object.entries(cfg)) {
      const neu = out[name].slice(from);
      body += `<h2>Ergänzungskarten: ${esc(name)} (Nr. ${from + 1}–${out[name].length})</h2><div class="g">${neu.map(t => `<div class="c"><div>${fmt(t)}</div></div>`).join('')}</div>`;
    }
    const lines = sol.filter(l => l.trim());
    const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{font-family:'Liberation Sans',Arial,sans-serif;font-size:10pt;margin:0}
h1{font-size:15pt;color:#1f4e79;border-bottom:1px solid #8db3e2;padding-bottom:1mm;margin:0 0 2mm}
.sub{color:#555;font-style:italic;margin:0 0 4mm}h2{font-size:11.5pt;color:#1f4e79;margin:5mm 0 2mm}
.g{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:26mm;border-top:.5pt dashed #777;border-left:.5pt dashed #777}
.c{border-right:.5pt dashed #777;border-bottom:.5pt dashed #777;display:flex;align-items:center;justify-content:center;text-align:center;padding:2mm 4mm;font-size:10pt}
.box{background:#dbe5f1;border:1px solid #b8cce4;border-left:3px solid #8db3e2;padding:2.5mm 4mm;margin:5mm 0;font-size:8.8pt;page-break-inside:avoid}.box p{margin:1mm 0}
</style><h1>${modNr}: Ergänzung – Kartensatz auf 20 erweitert</h1>
<p class="sub">Diese Karten ergänzen die Karten im vorderen Teil dieses Einstiegsmaterials. Zusammen ergeben sie 20 verschiedene Karten, sodass jede Person eine eigene bekommt (kein Doppeldruck nötig). Zahlenangaben im vorderen Text (z. B. „zwölf Karten“) gelten nur für den Grundsatz.</p>
${body}${lines.length ? `<div class="box"><b>Lösung / Hinweise zum erweiterten Satz</b>${lines.map(l => `<p>${esc(l)}</p>`).join('')}</div>` : ''}`;
    const page = await browser.newPage(); await page.setContent(html);
    const extra = path.join(tmp, id + '_extra.pdf');
    await page.pdf({ path: extra, format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '18mm', right: '18mm' } });
    await page.close();
    const base = path.join(tmp, id + '_base.pdf'); const target = path.join(ROOT, id + '_Einstiegsmaterial.pdf');
    fs.writeFileSync(base, cp.execFileSync('git', ['show', `${BASEREF}:${id}_Einstiegsmaterial.pdf`], { cwd: ROOT, maxBuffer: 1 << 28 }));
    cp.execFileSync('pdfunite', [base, extra, target]);
    console.log('ergänzt:', path.basename(target));
  }
  await browser.close();
}
main();
