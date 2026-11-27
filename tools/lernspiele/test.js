#!/usr/bin/env node
/* Spielt jedes gebaute Spiel in jeder Sprache einmal durch (Zufallsklicks) und meldet JS-Fehler.
   Aufruf: node tools/lernspiele/test.js [Datei.html ...] */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..', '..');
(async () => {
  const built = JSON.parse(fs.readFileSync(path.join(__dirname, 'built.json'), 'utf8'));
  let files = process.argv.slice(2); if (!files.length) files = Object.keys(built);
  const b = await chromium.launch(); let bad = 0;
  for (const f of files) {
    const langs = ['de'].concat(built[f].langs);
    for (const lg of langs) {
      const pg = await b.newPage({ viewport: { width: 420, height: 800 } }); const errs = [];
      pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      await pg.goto('file://' + path.join(ROOT, f)); 
      await pg.evaluate(l => { try { localStorage.setItem(GAME.lskey, l); } catch (e) {} }, lg);
      await pg.reload();
      await pg.evaluate(() => { document.getElementById('b1').click(); });
      await pg.evaluate(() => { document.getElementById('go').click(); });
      let steps = 0, tlCount = 0;
      while (steps++ < 400) {
        const done = await pg.evaluate(() => S.screen === 'end'); if (done) break;
        await pg.evaluate(() => {
          const m = document.getElementById('main'); const tryc = s => { const e = m.querySelector(s); if (e && !e.disabled) { e.click(); return true; } return false; };
          const st = S.st[S.si];
          if (st.type === 'calc') { const cv = document.getElementById('cv'); if (cv) { S.r.val = String(st.a); cv.value = S.r.val; } if (tryc('#cc')) return; }
          if (st.type === 'pick' && !S.r.done) { m.querySelectorAll('[data-pk]').forEach(b => { const i = +b.dataset.pk; if (st.items[i].ok && !S.r.sel.has(i)) b.click(); }); if (tryc('#chk')) return; }
          if (st.type === 'order') { const b = m.querySelector('[data-o="' + S.r.k + '"]'); if (b) { b.click(); return; } }
          if (st.type === 'sort' && S.r.ans === null) { const b = m.querySelector('[data-b]'); if (b) { b.click(); return; } }
          if (tryc('#nk') || tryc('#nx')) return;
          if (st.type === 'mc' && S.r.ans === null) { const b = m.querySelector('[data-mc="' + st.r + '"]'); if (b) { b.click(); return; } }
        });
        if (lg !== 'de') tlCount += await pg.evaluate(() => document.querySelectorAll('#main .tl').length);
      }
      const end = await pg.evaluate(() => ({ s: S.screen, p: S.pts, m: S.max }));
      if (end.s !== 'end' || errs.length || (lg !== 'de' && !tlCount)) { bad++; console.log('✘', f, lg, JSON.stringify(end), errs.slice(0, 2), 'tl:', tlCount); }
      await pg.close();
    }
    console.log('✔', f);
  }
  await b.close(); process.exit(bad ? 1 : 0);
})();
