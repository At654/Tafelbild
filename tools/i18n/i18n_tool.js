#!/usr/bin/env node
/*
 * Hilfswerkzeug für die Mehrsprachigkeit.
 *
 *   node tools/i18n/i18n_tool.js extract <seite.html ...>   deutsche Texte der Seite(n) auslesen -> i18n/pages/<seite>/de.json
 *   node tools/i18n/i18n_tool.js extract --dry <seite...>   nur anzeigen, was neu/geändert/entfallen ist
 *   node tools/i18n/i18n_tool.js extract --explore [--runs 6 --actions 120] <seite>   Spiel/Trainer automatisch durchklicken und alle Texte sammeln
 *   node tools/i18n/i18n_tool.js missing [--lang ar] [--out datei.json]   fehlende Übersetzungen auflisten
 *   node tools/i18n/i18n_tool.js check [--live]             Qualitätsprüfung (vor jedem Commit); --live liest die Seiten neu ein
 *
 * Voraussetzung: Node + Playwright (bei Claude Code vorinstalliert; lokal: npm i playwright).
 */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..', '..');
const I18N = path.join(ROOT, 'i18n');
const LANGS = ['tr', 'ar', 'vi', 'ru', 'es', 'ti', 'pt', 'uk'];
const RTL = { ar: 1 };

const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const exists = f => fs.existsSync(f);
function pageId(file) {
  let p = path.basename(file).replace(/\.html?$/i, '');
  return p.replace(/[^A-Za-z0-9_\-]+/g, '_') || 'index';
}
function pagesWithDe() {
  const d = path.join(I18N, 'pages');
  return exists(d) ? fs.readdirSync(d).filter(x => exists(path.join(d, x, 'de.json'))) : [];
}
function loadDe() { // {id: {text, pages:[..]}}
  const all = {};
  const add = (src, name) => { const o = rd(src); for (const k in o) { (all[k] = all[k] || { text: o[k], where: [] }).where.push(name); } };
  const c = path.join(I18N, 'common', 'de.json');
  if (exists(c)) add(c, 'common');
  pagesWithDe().forEach(p => add(path.join(I18N, 'pages', p, 'de.json'), p));
  return all;
}

/* ---------- Auslesen mit Headless-Browser ---------- */
function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !exists(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
function playwright() {
  try { return require('playwright'); } catch (e) {
    try { return require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); } catch (e2) { console.error('Playwright nicht gefunden.'); process.exit(2); }
  }
}
const GERMAN_HINT = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|und|oder|nicht|ist|sind|wird|werden|mit|für|auf|von|zu|im|am|bei|nach|ihr|sie|wir|du|dich|dir|dein|deine|wie|was|wer|wo|welche|welcher|welches|kann|darf|muss|bitte|aus|an|als|auch|nur|noch|wenn|dass)\b|[äöüßÄÖÜ]/i;
const OTHER_HINT = /\b(el|los|las|una|uno|para|con|por|que|está|são|não|uma|para|você|os|as|dos|das|the|and|is|are|of|to|with|bir|ve|için|değil|bu|nasıl)\b/gi;
function looksForeign(t) {
  if (/[\u0400-\u04FF\u0600-\u06FF\u1200-\u137F]/.test(t)) return true;
  if (/[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệ]/i.test(t)) return true;
  const other = (t.match(OTHER_HINT) || []).length;
  return other >= 2 && !GERMAN_HINT.test(t);
}
async function extractPages(files, dry, opts = {}) {
  const { chromium } = playwright();
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch();
  const libJs = fs.readFileSync(path.join(I18N, 'i18n.js'), 'utf8');
  const common = exists(path.join(I18N, 'common', 'de.json')) ? rd(path.join(I18N, 'common', 'de.json')) : {};
  const report = [];
  for (const file of files) {
    const abs = path.resolve(file), rel = path.relative(ROOT, abs).split(path.sep).map(encodeURIComponent).join('/');
    const id = pageId(abs);
    const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    const pg = await ctx.newPage();
    pg.on('dialog', d => d.dismiss());
    if (!fs.readFileSync(abs, 'utf8').includes('i18n/i18n.js')) await pg.addInitScript({ content: libJs }); // Seiten ohne Script-Zeile: Bibliothek einspielen
    await pg.goto(`http://127.0.0.1:${port}/${rel}`, { waitUntil: 'load' });
    await pg.waitForTimeout(400);
    const cfgFile = path.join(I18N, 'pages', id, 'config.json');
    if (exists(cfgFile)) await pg.evaluate(c => window.I18N.configure(c), rd(cfgFile));
    const seen = new Map();
    const grab = async () => { (await pg.evaluate(() => window.I18N.collect())).forEach(x => { if (!seen.has(x.id)) seen.set(x.id, x); }); };
    await grab();
    if (opts.explore) await explore(pg, grab, opts);
    if (opts.harvest) {
      const scripts = await pg.evaluate(() => [...document.scripts].filter(s => !s.src).map(s => s.textContent));
      const extra = path.join(I18N, 'pages', id, 'extra.txt');
      const hs = harvestStrings(scripts);
      if (exists(extra)) fs.readFileSync(extra, 'utf8').split('\n').map(s => s.trim()).filter(Boolean).forEach(s => hs.push(s));
      const ids = await pg.evaluate(hs => hs.map(h => [window.I18N.hash(h)]), hs);
      hs.forEach((h, i) => { const k = ids[i][0]; if (!seen.has(k)) seen.set(k, { id: k, text: h, kind: 'text', harvested: true }); });
    }
    const stepsFile = path.join(I18N, 'pages', id, 'steps.json');
    if (exists(stepsFile)) {
      for (const s of rd(stepsFile)) {
        if (s.click) await pg.click(s.click);
        if (s.select) await pg.selectOption(s.select, { index: s.index || 1 });
        if (s.eval) await pg.evaluate(s.eval);
        await pg.waitForTimeout(s.wait || 250);
        await grab();
      }
    }
    await ctx.close();
    const igf = path.join(I18N, 'pages', id, 'ignore.txt');
    const ignore = new Set(exists(igf) ? fs.readFileSync(igf, 'utf8').split('\n').map(s => s.trim()).filter(Boolean) : []);
    const out = {}, foreign = [];
    // Zahlen-Varianten (≥3 Texte, die sich nur in Ziffern unterscheiden) -> eine Vorlage mit {1},{2}
    const grp = new Map();
    for (const [k, x] of seen) if (x.alt) { (grp.get(x.alt.id) || grp.set(x.alt.id, []).get(x.alt.id)).push(k); }
    for (const [aid, ks] of grp) if (ks.length >= 3) { const x = seen.get(ks[0]); ks.forEach(k => seen.delete(k)); seen.set(aid, { id: aid, text: x.alt.text, kind: 'text' }); }
    for (const [k, x] of seen) {
      if (common[k] !== undefined) continue;
      if (ignore.has(x.text)) continue;
      if (looksForeign(x.text)) { foreign.push(x.text); continue; }
      out[k] = x.text;
    }
    const dir = path.join(I18N, 'pages', id), f = path.join(dir, 'de.json');
    const old = exists(f) ? rd(f) : {};
    if (opts.explore && !opts.prune) for (const k in old) if (!(k in out) && !ignore.has(old[k]) && !/^\{1\} kg = \{2\} €$/.test(old[k])) out[k] = old[k]; // Durchklicken ergänzt, löscht nicht
    const added = Object.keys(out).filter(k => !(k in old)), gone = Object.keys(old).filter(k => !(k in out));
    report.push({ id, n: Object.keys(out).length, added: added.length, gone: gone.length, foreign: foreign.length, addedTexts: added.map(k => out[k]), goneTexts: gone.map(k => old[k]) });
    if (!dry) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(f, JSON.stringify(out, null, 1) + '\n'); }
  }
  await browser.close(); srv.close();
  return report;
}

/* Texte aus den Skripten ernten: alle Zeichenketten, die wie deutscher Text aussehen */
function harvestStrings(scripts) {
  const out = new Set();
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  for (const src of scripts) {
    let m;
    while ((m = re.exec(src))) {
      let s = m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3];
      if (s === undefined || s.includes('${')) continue;
      try { s = JSON.parse('"' + s.replace(/\\'/g, "'").replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"'); } catch (e) { continue; }
      s = s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
      if (s.length < 2 || s.length > 600 || !/\p{L}{2}/u.test(s)) continue;
      if (/^[a-z][A-Za-z0-9_\-]*$/.test(s) && !/[äöüß]/.test(s)) continue;           // Bezeichner wie click, div
      if (/^(https?:|\.|#|[\w\-]+\/|[\w\-]+\.(js|css|png|svg|json|html|pdf))/i.test(s)) continue; // URLs, Dateinamen
      if (/[{};=]|=>|function|\bvar\b|px\b|rgba?\(|#[0-9a-f]{3,6}\b/i.test(s)) continue;           // Code/CSS
      if (/^[A-Z0-9_]+$/.test(s) && s.length < 12) continue;                           // KONSTANTEN
      if (/[\]\[]|">|\)"|:checked/.test(s)) continue;                                      // Selektoren/HTML-Reste
      out.add(s);
    }
  }
  return [...out];
}
/* Durchklicker: spielt die Seite zufällig durch und sammelt alle neu erscheinenden Texte */
async function explore(pg, grab, opts) {
  const runs = opts.runs || 6, actions = opts.actions || 120, startUrl = pg.url();
  for (let r = 0; r < runs; r++) {
    if (r > 0) { await pg.goto(startUrl, { waitUntil: 'load' }).catch(() => {}); await pg.waitForTimeout(300); await grab(); }
    for (let a = 0; a < actions; a++) {
      let ok = false;
      try {
        ok = await pg.evaluate((seed) => {
          const sel = 'button,[role=button],[onclick],label,summary,select,input:not([type=hidden]),textarea,.opt,.card,.choice,[tabindex="0"]';
          const vis = e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 2 && b.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.disabled && !e.closest('#i18n-fab,#i18n-panel,#i18n-bubble'); };
          window.__clicked = window.__clicked || new Map();
          let c = [...new Set([...document.querySelectorAll(sel), ...[...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).cursor === 'pointer')])].filter(vis);
          if (!c.length) return false;
          const key = e => e.tagName + '|' + (e.id || '') + '|' + (e.textContent || '').trim().slice(0, 30);
          const fresh = c.filter(e => !window.__clicked.has(key(e)));
          const pool = fresh.length && Math.random() < 0.85 ? fresh : c;
          const e = pool[Math.floor(Math.random() * pool.length)];
          window.__clicked.set(key(e), 1);
          e.scrollIntoView({ block: 'center' });
          if (e.tagName === 'SELECT') { const o = e.options; e.selectedIndex = Math.floor(Math.random() * o.length); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }
          else if (e.tagName === 'INPUT' && /^(text|number|search|)$/.test(e.type)) { e.value = String(Math.floor(Math.random() * 90) + 1); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); e.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }
          else if (e.tagName === 'TEXTAREA') { e.value = 'Test'; e.dispatchEvent(new Event('input', { bubbles: true })); }
          else e.click();
          return true;
        });
      } catch (e) { /* Seite hat navigiert o. ä. */ }
      if (pg.url().split('?')[0] !== startUrl.split('?')[0]) { await pg.goto(startUrl, { waitUntil: 'load' }).catch(() => {}); }
      await pg.waitForTimeout(opts.wait || 90);
      try { await grab(); } catch (e) {}
      if (!ok && a > 5) break;
    }
  }
}

/* ---------- Prüfungen ---------- */
const nums = s => (s.match(/\d+(?:[.,:]\d+)*/g) || []).sort().join('|');
const phs = s => ((s.match(/\{\d+\}|___/g) || []).sort().join('|'));
function check(opts) {
  const errs = [], warns = [];
  const E = (m) => errs.push(m), W = (m) => warns.push(m);
  const de = loadDe();
  let gl = [], info = 0;
  let glSorted = [];
  const gf = path.join(I18N, 'glossary.json');
  if (exists(gf)) gl = rd(gf).terms;
  glSorted = gl.slice().sort((a, b) => (b.stem || b.de).length - (a.stem || a.de).length);
  const files = [];
  const cdir = path.join(I18N, 'common');
  const dirs = [['common', cdir]].concat(pagesWithDe().map(p => [p, path.join(I18N, 'pages', p)]));
  let total = 0, filled = 0;
  for (const [name, dir] of dirs) {
    const deF = path.join(dir, 'de.json');
    if (!exists(deF)) continue;
    const src = rd(deF);
    for (const l of LANGS) {
      const f = path.join(dir, l + '.json');
      total += Object.keys(src).length;
      if (!exists(f)) { E(`${name}/${l}: Datei fehlt`); continue; }
      const raw = fs.readFileSync(f, 'utf8'); let tr;
      try { tr = JSON.parse(raw); } catch (e) { E(`${name}/${l}: ungültiges JSON`); continue; }
      const keys = (raw.match(/^\s*"(t[a-z0-9]+)"\s*:/gm) || []).map(x => x.match(/"(.+)"/)[1]);
      if (new Set(keys).size !== keys.length) E(`${name}/${l}: doppelte IDs`);
      for (const k in tr) if (!(k in src)) E(`${name}/${l}: verwaiste ID ${k} ("${String(tr[k]).slice(0, 40)}")`);
      for (const k in src) {
        const t = tr[k], d = src[k], tag = `${name}/${l} ${k}`;
        if (t === undefined) { E(`${tag}: fehlt ("${d.slice(0, 50)}")`); continue; }
        if (typeof t !== 'string' || !t.trim()) { E(`${tag}: leer`); continue; }
        filled++;
        if (nums(d) !== nums(t)) E(`${tag}: Zahlen weichen ab  DE[${nums(d)}] ≠ ${l}[${nums(t)}]  ("${d.slice(0, 50)}")`);
        if (phs(d) !== phs(t)) E(`${tag}: Platzhalter/Lücken (___) weichen ab ("${d.slice(0, 50)}")`);
        if (/[٠-٩۰-۹]/.test(t)) E(`${tag}: östliche Ziffern – bitte 0-9 verwenden`);
        if (l === 'ar' && !/[؀-ۿ]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine arabische Schrift ("${t.slice(0, 40)}")`);
        if (l === 'ti' && !/[ሀ-፿]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine Ge'ez-Schrift ("${t.slice(0, 40)}")`);
        if (l === 'ti' && /[؀-ۿ]/.test(t)) E(`${tag}: arabische Schrift im Tigrinya`);
        if ((l === 'ru' || l === 'uk') && !/[Ѐ-ӿ]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine kyrillische Schrift`);
        if (l === 'uk' && /[ыэъё]/i.test(t)) E(`${tag}: russische Buchstaben im Ukrainischen`);
        if (l === 'ru' && /[іїєґ]/i.test(t)) E(`${tag}: ukrainische Buchstaben im Russischen`);
        if (l === 'vi' && !/[ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/i.test(t) && t.length > 25) W(`${tag}: keine vietnamesischen Zeichen`);
        if (t.trim() === d.trim() && /\p{L}{4}/u.test(d) && d.split(' ').length > 1) W(`${tag}: identisch mit Deutsch ("${d.slice(0, 40)}")`);
        if (t.length > d.length * 4 + 20) W(`${tag}: Übersetzung auffällig lang`);
        if (RTL[l] && /[A-Za-z]{3}/.test(t) && !/\(/.test(t)) W(`${tag}: lateinischer Text ohne Klammer im RTL-Text`);
        // Glossar: längere Begriffe zuerst (Umsatzsteuer vor Umsatz); jeder Treffer wird danach ausgeblendet
        let masked = d.toLowerCase();
        for (const g of glSorted) {
          if (!g[l]) continue;
          const stem = (g.stem || g.de).toLowerCase();
          if (!masked.includes(stem)) continue;
          masked = masked.split(stem).join(' ');
          if (new RegExp('\\([^)]*' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^)]*\\)', 'i').test(d)) continue; // Begriff steht im Deutschen selbst in Klammern
          const lc = x => x.toLocaleLowerCase(l === 'tr' ? 'tr' : 'en');
          const tl = lc(t);
          // jedes Wort des Glossar-Eintrags muss (mit Endungen/Fällen/Plural tolerant) vorkommen
          const okTr = lc(String(g[l])).split(/[\s\-]+/).filter(w => w.length > 2).every(w => {
            w = w.replace(/^ال/, ''); const s = w.length > 4 ? w.slice(0, -2) : w.length > 3 ? w.slice(0, -1) : w; return tl.includes(s);
          });
          if (!okTr) W(`${tag}: Glossar „${g.de}“ -> ${g[l]}  [Übersetzung fehlt]`);
          else if (!tl.includes(lc(g.de))) info++;
        }
      }
    }
  }
  // Glossar vollständig?
  gl.forEach(g => LANGS.forEach(l => { if (!g[l] || !String(g[l]).trim()) E(`glossary: „${g.de}“ ohne ${l}`); }));
  if (info) console.log(`Hinweis: bei ${info} Glossar-Treffern fehlt der deutsche Begriff in Klammern (nur beim ersten Vorkommen pro Text nötig).`);
  return { errs, warns, total, filled };
}

/* ---------- main ---------- */
(async () => {
  const [cmd, ...args] = process.argv.slice(2);
  const flag = n => args.includes(n);
  const val = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  if (cmd === 'extract') {
    const files = args.filter(a => /\.html?$/i.test(a));
    const rep = await extractPages(files, flag('--dry'), { explore: flag('--explore'), prune: flag('--prune'), harvest: flag('--harvest'), runs: parseInt(val('--runs') || '6', 10), actions: parseInt(val('--actions') || '120', 10) });
    rep.forEach(r => {
      console.log(`${r.id}: ${r.n} Texte (neu ${r.added}, entfallen ${r.gone}, fremdsprachig übersprungen ${r.foreign})`);
      if (flag('--dry')) { r.addedTexts.forEach(t => console.log('  + ' + t.slice(0, 80))); r.goneTexts.forEach(t => console.log('  - ' + t.slice(0, 80))); }
    });
  } else if (cmd === 'missing') {
    const only = val('--lang'), de = loadDe(), out = {}; let n = 0;
    const dirs = [['common', path.join(I18N, 'common')]].concat(pagesWithDe().map(p => [p, path.join(I18N, 'pages', p)]));
    for (const [name, dir] of dirs) {
      if (!exists(path.join(dir, 'de.json'))) continue;
      const src = rd(path.join(dir, 'de.json'));
      for (const l of LANGS) {
        if (only && l !== only) continue;
        const tr = exists(path.join(dir, l + '.json')) ? rd(path.join(dir, l + '.json')) : {};
        const miss = Object.keys(src).filter(k => !tr[k] || !String(tr[k]).trim());
        if (miss.length) { out[`${name}/${l}`] = Object.fromEntries(miss.map(k => [k, src[k]])); n += miss.length; console.log(`${name} [${l}]: ${miss.length} fehlen`); }
      }
    }
    console.log(n ? `Insgesamt fehlen ${n} Einträge.` : 'Nichts fehlt.');
    if (val('--out')) fs.writeFileSync(val('--out'), JSON.stringify(out, null, 1));
  } else if (cmd === 'coverage') {
    // Spiel in einer Sprache durchklicken und alle angezeigten Texte ohne Übersetzung auflisten
    const file = args.find(a => /\.html?$/i.test(a)), lang = val('--lang') || 'ar';
    const { chromium } = playwright(); const srv = await serve(), port = srv.address().port, br = await chromium.launch();
    const rel = path.relative(ROOT, path.resolve(file)).split(path.sep).map(encodeURIComponent).join('/');
    const ctx = await br.newContext({ viewport: { width: 900, height: 900 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    const pg = await ctx.newPage(); pg.on('dialog', d => d.dismiss());
    if (!fs.readFileSync(path.resolve(file), 'utf8').includes('i18n/i18n.js')) await pg.addInitScript({ content: fs.readFileSync(path.join(I18N, 'i18n.js'), 'utf8') });
    await pg.goto(`http://127.0.0.1:${port}/${rel}?lang=${lang}&mode=under`, { waitUntil: 'load' }); await pg.waitForTimeout(800);
    const miss = new Map();
    const grab = async () => { await pg.waitForFunction(() => window.I18N && window.I18N.state().load !== 'loading' && window.I18N.state().load !== 'idle', null, { timeout: 5000 }).catch(() => {}); await pg.waitForTimeout(130); (await pg.evaluate(() => window.I18N.untranslated())).forEach(x => miss.set(x[0], x[1])); };
    await grab();
    await explore(pg, grab, { runs: parseInt(val('--runs') || '8', 10), actions: parseInt(val('--actions') || '150', 10), wait: 60 });
    await br.close(); srv.close();
    const known = new Set();
    [path.join(I18N, 'common', 'de.json'), path.join(I18N, 'pages', pageId(file), 'de.json')].forEach(f => { if (exists(f)) Object.values(rd(f)).forEach(v => known.add(v)); });
    const list = [...miss].filter(([x, alt]) => !known.has(x) && !(alt && known.has(alt)) && !looksForeign(x)).map(([x, alt]) => alt || x);
    list.forEach(x => console.log('  ? ' + x.slice(0, 120)));
    console.log(`${list.length} angezeigte Texte ohne Übersetzung (${lang}).`);
    if (val('--out')) fs.writeFileSync(val('--out'), list.join('\n'));
  } else if (cmd === 'promote') {
    // Texte, die auf mehreren Seiten vorkommen (oder in --texts datei.txt stehen), nach i18n/common verschieben
    const min = parseInt(val('--min') || '0', 10), tf = val('--texts');
    const wanted = tf ? new Set(fs.readFileSync(tf, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)) : null;
    const pages = pagesWithDe(), cnt = {}, text = {};
    pages.forEach(p => { const o = rd(path.join(I18N, 'pages', p, 'de.json')); for (const k in o) { cnt[k] = (cnt[k] || 0) + 1; text[k] = o[k]; } });
    const ids = Object.keys(cnt).filter(k => (min && cnt[k] >= min) || (wanted && wanted.has(text[k])));
    const cdir = path.join(I18N, 'common'); fs.mkdirSync(cdir, { recursive: true });
    const move = (lang) => {
      const cf = path.join(cdir, lang + '.json'), c = exists(cf) ? rd(cf) : {};
      pages.forEach(p => {
        const f = path.join(I18N, 'pages', p, lang + '.json'); if (!exists(f)) return;
        const o = rd(f); let ch = false;
        ids.forEach(k => { if (k in o) { if (!(k in c)) c[k] = o[k]; delete o[k]; ch = true; } });
        if (ch) fs.writeFileSync(f, JSON.stringify(o, null, 1) + '\n');
      });
      fs.writeFileSync(cf, JSON.stringify(c, null, 1) + '\n');
    };
    ['de'].concat(LANGS).forEach(move);
    console.log(`${ids.length} Texte nach i18n/common verschoben.`);
  } else if (cmd === 'check') {
    let live = [];
    if (flag('--live')) {
      const files = [];
      const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
        if (['.git', '_backup', 'node_modules', 'i18n', 'tools'].includes(e.name)) return;
        const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) files.push(p);
      });
      walk(ROOT);
      const have = new Set(pagesWithDe());
      const mine = files.filter(f => have.has(pageId(f)));
      const rep = await extractPages(mine, true);
      rep.forEach(r => { if (r.added || r.gone) live.push(`${r.id}: Deutsch hat sich geändert (neu ${r.added}, entfallen ${r.gone}) – bitte „extract“ und Übersetzungen ergänzen`); });
    }
    const r = check();
    live.forEach(m => r.errs.push(m));
    r.warns.forEach(w => console.log('WARNUNG ' + w));
    r.errs.forEach(e => console.log('FEHLER  ' + e));
    console.log(`\n${r.filled}/${r.total} Übersetzungen vorhanden · ${r.errs.length} Fehler · ${r.warns.length} Warnungen`);
    process.exit(r.errs.length ? 1 : 0);
  } else {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\n?/, ''));
  }
})();
