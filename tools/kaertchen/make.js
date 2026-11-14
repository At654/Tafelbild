#!/usr/bin/env node
/* Kärtchen-Generator: liest tools/kaertchen/data/<LFx_M_y>.txt und schreibt randfüllende A4-PDFs
   (Karten bis zum Blattrand, gestrichelte Schnittlinien, Deutsch + Übersetzungen + Piktogramm).
   Aufruf:  node tools/kaertchen/make.js [LF1_M_8 ...]      (ohne Argument: alle Dateien in data/)
   Format der Datendateien: siehe data/README.txt */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(__dirname, 'data');
const OUT = ROOT;

const LANGS = {
  vi: { code: 'VI', name: 'Tiếng Việt', dir: 'ltr' },
  ar: { code: 'AR', name: 'العربية', dir: 'rtl' },
  tr: { code: 'TR', name: 'Türkçe', dir: 'ltr' },
  es: { code: 'ES', name: 'Español', dir: 'ltr' },
  pt: { code: 'PT', name: 'Português', dir: 'ltr' },
  ti: { code: 'TI', name: 'ትግርኛ', dir: 'ltr' },
  uk: { code: 'UK', name: 'Українська', dir: 'ltr' },
  ru: { code: 'RU', name: 'Русский', dir: 'ltr' },
};
const VERSIONS = {
  A: { langs: ['vi', 'ar', 'tr'], file: 'VI-AR-TR' },
  B: { langs: ['es', 'pt', 'ti', 'uk', 'ru'], file: 'ES-PT-TI-UK-RU' },
};
const COLORS = {
  blue: ['#e8f0fb', '#2f6db5'], orange: ['#fdebdc', '#d9741a'], green: ['#e6f4e6', '#3a8a3a'],
  yellow: ['#fff7d6', '#b89400'], red: ['#fde6e6', '#c0392b'], purple: ['#f0e8f8', '#7d4fb0'],
  teal: ['#e0f4f2', '#1f8a80'], pink: ['#fbe7f0', '#c2477f'], gray: ['#eeeeee', '#666666'],
};

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function parse(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const m = { sheets: [], solution: [], opts: {} };
  let sheet = null, card = null, inSol = false;
  for (let raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (inSol) { m.solution.push(line); continue; }
    if (!line.trim() || line.startsWith('#')) continue;
    const i = line.indexOf(':');
    const key = line.slice(0, i).trim(), val = line.slice(i + 1).trim();
    if (key === 'solution') { inSol = true; if (val) m.solution.push(val); continue; }
    if (key === 'sheet') {
      const p = val.split('|').map(s => s.trim());
      sheet = { name: p[0], color: p[1] || 'blue', grid: p[2] || '', repeat: 1, cards: [] };
      m.sheets.push(sheet); card = null; continue;
    }
    if (key === 'repeat') { sheet.repeat = parseInt(val, 10); continue; }
    if (key === 'card') {
      const p = val.split('|').map(s => s.trim());
      card = { emoji: p[0], code: p[1] || '', color: p[2] || sheet.color, t: {} };
      sheet.cards.push(card); continue;
    }
    if (key === 'de' || LANGS[key]) { card.t[key] = val; continue; }
    m.opts[key] = val;
  }
  return m;
}

function textHtml(s) {
  const k = s.indexOf(' // ');
  if (k < 0) return `<b>${esc(s)}</b>`;
  return `<b>${esc(s.slice(0, k))}</b> <span>${esc(s.slice(k + 4)).split(' // ').join('<br>')}</span>`;
}

function cardHtml(c, langs, foot, col, row) {
  const [bgc, ac] = COLORS[c.color] || COLORS.blue; const bg = '#ffffff';
  const tr = langs.map(l => `<div class="ln ${l}"><i style="background:${ac}">${LANGS[l].code}</i><p dir="${LANGS[l].dir}">${textHtml(c.t[l])}</p></div>`).join('');
  return `<div class="card" style="background:${bg};--ac:${ac};${col ? 'border-left:.3pt dashed #777;' : ''}${row ? 'border-top:.3pt dashed #777;' : ''}">
<div class="in"><div class="em">${c.emoji}</div><div class="de">${textHtml(c.t.de)}</div><div class="tr">${tr}</div></div>
<div class="ft"><span>${esc(foot)}</span><span>${esc(c.code)}</span></div></div>`;
}

function build(m, ver, id) {
  const langs = VERSIONS[ver].langs;
  const miss = [];
  const pages = [];
  m.sheets.forEach(sh => {
    for (let rep = 1; rep <= sh.repeat; rep++) {
      const cards = sh.cards;
      const per = 8;
      for (let off = 0; off < cards.length; off += per) {
        const chunk = cards.slice(off, off + per);
        let cols = 2, rows;
        if (sh.grid) { [cols, rows] = sh.grid.split('x').map(Number); }
        else if (cards.length > 8) rows = 4;
        else rows = Math.max(2, Math.ceil(chunk.length / 2));
        const perPage = cols * rows;
        const foot = `${m.opts.module || id} · ${sh.name}${sh.repeat > 1 ? ' · Satz ' + rep : ''}`;
        const html = chunk.map((c, k) => {
          ['de', ...langs].forEach(l => { if (!c.t[l]) miss.push(`${id} ${sh.name} ${c.code || k}: ${l}`); });
          return cardHtml(c, langs, foot, k % cols, Math.floor(k / cols));
        }).join('');
        pages.push(`<section class="page" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)">${html}</section>`);
      }
    }
  });
  const legend = langs.map(l => `<b>${LANGS[l].code}</b> ${LANGS[l].name}`).join(' &nbsp;·&nbsp; ');
  const total = m.sheets.reduce((a, s) => a + s.cards.length * s.repeat, 0);
  const sol = `<section class="teacher"><h1>Für die Lehrkraft – diese Seite nicht mitkopieren</h1>
<p class="meta">${esc(m.opts.module || id)} · ${esc(m.opts.title || '')} · Sprachen: ${legend} · ${total} Karten</p>
<h2>Drucken und Schneiden</h2>
<p>A4 hoch, einseitig, <b>100 % / „Tatsächliche Größe“</b> (nicht „An Seite anpassen“). Die Karten gehen bis zum Blattrand; geschnitten wird an den gestrichelten Linien, der äußere Rand wird abgeschnitten. Karten vor dem Austeilen mischen.</p>
${m.opts.hint ? `<h2>Einsatz</h2><p>${esc(m.opts.hint)}</p>` : ''}
${m.solution.length ? `<h2>Lösung / Hinweise</h2><pre>${esc(m.solution.join('\n'))}</pre>` : ''}
<p class="meta">Übersetzungen maschinell erstellt – bitte von Muttersprachlerinnen und Muttersprachlern gegenlesen lassen (besonders Tigrinya).</p></section>`;
  return { miss, html: pages.join('') + sol };
}

const fontB64 = f => fs.readFileSync(path.join(ROOT, 'i18n', 'fonts', f)).toString('base64');
const CSS = `
@font-face{font-family:'NArab';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NArab';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-arabic-arabic-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'NEth';font-weight:400;src:url(data:font/woff2;base64,${fontB64('noto-sans-ethiopic-ethiopic-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'NEth';font-weight:700;src:url(data:font/woff2;base64,${fontB64('noto-sans-ethiopic-ethiopic-700-normal.woff2')}) format('woff2')}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Liberation Sans','DejaVu Sans',sans-serif;color:#1d2733}
.page{width:210mm;height:297mm;display:grid;page-break-after:always;overflow:hidden}
.card{position:relative;overflow:hidden;border-top:3pt solid var(--ac)}
.in{position:absolute;left:3.5mm;right:3.5mm;top:1.5mm;bottom:5mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-size:calc(var(--fs,12)*1pt)}
.em{font-family:'Noto Color Emoji',sans-serif;font-size:2.5em;line-height:1.15}
.de{font-size:1em;line-height:1.2;margin-top:.15em}
.de b{font-weight:700}.de span{font-weight:400;display:block}
.tr{width:100%;margin-top:.45em;padding-top:.4em;border-top:.4pt solid #bbb;display:flex;flex-direction:column;gap:.22em}
.ln{display:grid;grid-template-columns:2.1em 1fr;align-items:center;column-gap:.4em;font-size:.8em;line-height:1.2}
.ln i{font-style:normal;color:#fff;font-weight:700;font-size:.62em;border-radius:.3em;padding:.22em 0;text-align:center;letter-spacing:.02em}
.ln p{text-align:center;color:#26323f}
.ln b{font-weight:700}.ln span{font-weight:400}
.ln.ar p{font-family:'NArab','Liberation Sans',sans-serif;line-height:1.15}
.ln.ti p{font-family:'NEth','Liberation Sans',sans-serif;line-height:1.2}
.ft{position:absolute;left:3.5mm;right:3.5mm;bottom:1.4mm;display:flex;justify-content:space-between;font-size:5.5pt;color:#6b7785}
.teacher{width:210mm;height:297mm;padding:16mm 18mm;font-size:10pt;line-height:1.4;page-break-after:auto}
.teacher h1{font-size:15pt;color:#b02a2a;margin-bottom:3mm}
.teacher h2{font-size:11pt;margin:5mm 0 1.5mm;color:#2f6db5}
.teacher .meta{font-size:8.5pt;color:#555;margin:1.5mm 0}
.teacher pre{font-family:'Liberation Sans','DejaVu Sans',sans-serif;font-size:8.8pt;line-height:1.35;white-space:pre-wrap}
`;

const FIT = () => {
  document.querySelectorAll('.card').forEach(card => {
    const inner = card.querySelector('.in');
    let fs = 22;
    inner.style.setProperty('--fs', fs);
    while (fs > 4 && (inner.scrollHeight > inner.clientHeight + 0.5 || inner.scrollWidth > inner.clientWidth + 0.5)) {
      fs -= 0.25; inner.style.setProperty('--fs', fs);
    }
    inner.style.setProperty('--fs', fs);
    card.dataset.fs = fs;
  });
  return Array.from(document.querySelectorAll('.card')).map(c => +c.dataset.fs);
};

async function main() {
  const want = process.argv.slice(2);
  const files = fs.readdirSync(DATA).filter(f => f.endsWith('.txt') && f !== 'README.txt').map(f => f.replace('.txt', ''))
    .filter(f => !want.length || want.includes(f));
  const browser = await chromium.launch();
  const report = [];
  for (const id of files) {
    const m = parse(path.join(DATA, id + '.txt'));
    const versions = (m.opts.versions || 'A').split('');
    for (const v of versions) {
      const { miss, html } = build(m, v, id);
      if (miss.length) { console.error('FEHLT:', miss.slice(0, 10).join('; '), miss.length > 10 ? '… ' + miss.length : ''); process.exitCode = 1; continue; }
      const page = await browser.newPage();
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
      await page.evaluate(() => document.fonts.ready);
      const sizes = await page.evaluate(FIT);
      const out = path.join(OUT, `${id}_Kaertchen_${VERSIONS[v].file}.pdf`);
      await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
      await page.close();
      report.push(`${path.basename(out)}: ${sizes.length} Karten, Schrift ${Math.min(...sizes)}–${Math.max(...sizes)} pt`);
    }
  }
  await browser.close();
  console.log(report.join('\n'));
}
main().catch(e => { console.error(e); process.exit(1); });
