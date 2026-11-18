#!/usr/bin/env node
/* Baut stundenplan_material.json: Dateiliste + Material-Zuordnung (Modul -> Arbeitsblatt-PDF und Links) für stundenplan.html.
   Quelle: die vom Stundenplan bereits eingetragenen Links (nur wenn die Datei existiert) + alle Materialien aus uebersicht_daten.js.
   Aufruf:  node tools/matmap/build.js        (nach neuen Materialien oder neuer uebersicht_daten.js erneut ausführen)
   Voraussetzung: lokaler Webserver auf Port 8765 im Repo-Ordner (python3 -m http.server 8765) und Playwright. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const EXT = /\.(html?|pdf|pptx?|docx?|xlsx?)$/i;
function walk(dir, rel, out) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name.startsWith('.')) continue;
    const r = rel ? rel + '/' + f.name : f.name;
    if (f.isDirectory()) { if (['materials', 'Modulübergreifend'].includes(rel.split('/')[0] || f.name)) walk(path.join(dir, f.name), r, out); }
    else if (EXT.test(f.name)) out.push(r);
  }
}
(async () => {
  const files = []; walk(ROOT, '', files); files.sort();
  const has = new Set(files);
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.route('**/stundenplan_material.json', r => r.abort());
  await pg.goto('http://localhost:8765/stundenplan.html', { waitUntil: 'networkidle' }); await pg.waitForTimeout(1200);
  const cur = await pg.evaluate(() => JSON.parse(JSON.stringify(state.mat)));
  const keys = await pg.evaluate(() => { const k = []; Object.keys(CAT).forEach(p => CAT[p].items.forEach(i => k.push(p + '.' + i.id))); return k; });
  await b.close();
  const raw = fs.readFileSync(path.join(ROOT, 'uebersicht_daten.js'), 'utf8');
  const U = JSON.parse(raw.slice(raw.indexOf('=') + 1).trim().replace(/;$/, ''));
  const KMAP = { 'MATHE.B1': 'MATHE.M2', 'MATHE.D1': 'MATHE.M3', 'MATHE.G1': 'MATHE' };
  const mat = {};
  const ok = u => /^https?:/i.test(u) || has.has(u);
  Object.keys(cur).forEach(k => {
    const e = cur[k], links = [];
    (e.links || []).forEach(l => { if (l.u && ok(l.u) && !links.some(x => x.u === l.u)) links.push({ l: l.l, u: l.u }); });
    mat[k] = { pdf: e.pdf && ok(e.pdf) ? e.pdf : '', links };
  });
  U.groups.forEach(g => g.sections.forEach(s => s.modules.forEach(m => {
    let k = s.id + '.' + m.id; k = KMAP[k] || k;
    if (!keys.includes(k) && k !== 'MATHE') return;
    const e = mat[k] || (mat[k] = { pdf: '', links: [] });
    m.mats.forEach(x => {
      if (!has.has(x.u)) return;
      if (x.c === 'aufgaben' && /\.pdf$/i.test(x.u) && !e.pdf) { e.pdf = x.u; return; }
      if (x.u === e.pdf || e.links.some(l => l.u === x.u)) return;
      e.links.push({ l: x.c === 'loesung' ? 'Lösungen (PDF)' : x.label, u: x.u });
    });
  })));
  /* Zusatz-Zuordnungen für Schlüssel ohne eigenes Modul in der Übersicht */
  const EXTRA = { 'WISO2.X1': [['Kärtchen Modul 1 „Wer zahlt?“ (TR · VI · AR)', 'WiSo2_M_1_Kaertchen_VI-AR-TR.pdf']] };
  Object.keys(EXTRA).forEach(k => { const e = mat[k] || (mat[k] = { pdf: '', links: [] }); EXTRA[k].forEach(([l, u]) => { if (has.has(u) && !e.links.some(x => x.u === u)) e.links.push({ l, u }); }); });
  /* Lösungen und Lehrerhandreichungen ans Ende */
  Object.values(mat).forEach(e => { const t = /l[öo]e?sung|lehrerhandreichung/i; e.links = e.links.filter(l => !t.test(l.l)).concat(e.links.filter(l => t.test(l.l))); });
  const out = { built: new Date().toISOString().slice(0, 10) + '.' + Date.now().toString(36), files, mat };
  fs.writeFileSync(path.join(ROOT, 'stundenplan_material.json'), JSON.stringify(out));
  const n = Object.values(mat).reduce((a, e) => a + e.links.length, 0);
  console.log('Dateien:', files.length, '· Schlüssel:', Object.keys(mat).length, '· Links:', n);
})();
