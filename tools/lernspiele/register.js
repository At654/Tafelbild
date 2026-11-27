#!/usr/bin/env node
/* Trägt die mit build.js gebauten Spiele ein:
   - uebersicht_daten.js  (Kategorie „lernspiel“ beim Modul)
   - stundenplan_material.json  (Link beim Modul im Stundenplan, neue Fassung -> wird beim nächsten Öffnen übernommen)
   Mehrfaches Ausführen ist unschädlich (kein Doppeleintrag). */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const built = JSON.parse(fs.readFileSync(path.join(__dirname, 'built.json'), 'utf8'));

const up = path.join(ROOT, 'uebersicht_daten.js');
const raw = fs.readFileSync(up, 'utf8');
const UEB = JSON.parse(raw.slice(raw.indexOf('=') + 1).trim().replace(/;$/, ''));
const mp = path.join(ROOT, 'stundenplan_material.json');
const MAT = JSON.parse(fs.readFileSync(mp, 'utf8'));

const label = b => `${b.h1} (Spiel, DE · ${b.langs.map(l => l.toUpperCase()).join(' · ')})`;
const now = Math.floor(Date.now() / 1000);
let added = 0;
for (const b of Object.values(built)) {
  if (!fs.existsSync(path.join(ROOT, b.file))) { console.log('fehlt (Datei):', b.file); continue; }
  const [sec, mod] = b.key.split('.');
  let mo = null;
  UEB.groups.forEach(g => g.sections.forEach(s => { if (s.id === sec) s.modules.forEach(m => { if (m.id === mod) mo = m; }); }));
  if (!mo) { console.log('Modul nicht gefunden:', b.key); continue; }
  mo.mats = mo.mats.filter(x => x.u !== b.file);
  const e = { u: b.file, label: label(b), t: 'web', lang: b.langs.slice(), mt: now, c: 'lernspiel' };
  const at = mo.mats.findIndex(x => x.c === 'weiteres');
  if (at < 0) mo.mats.push(e); else mo.mats.splice(at, 0, e);
  const me = MAT.mat[b.key] || (MAT.mat[b.key] = { pdf: '', links: [] });
  me.links = me.links.filter(x => x.u !== b.file);
  me.links.push({ l: label(b), u: b.file });
  if (!MAT.files.includes(b.file)) MAT.files.push(b.file);
  added++;
}
MAT.files.sort();
MAT.built = new Date().toISOString().slice(0, 10) + '.lernspiele';
UEB.built = new Date().toISOString().slice(0, 10);
fs.writeFileSync(up, 'window.UEB=' + JSON.stringify(UEB) + ';\n');
fs.writeFileSync(mp, JSON.stringify(MAT));
console.log('eingetragen:', added);
