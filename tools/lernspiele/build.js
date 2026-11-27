#!/usr/bin/env node
/* Baut Lernspiele (eine HTML-Datei je Spiel) aus knappen Spielbeschreibungen in tools/lernspiele/games/*.js.
   Aufruf:  node tools/lernspiele/build.js [games/lf1.js ...]   (ohne Angabe: alle)
   Danach:  node tools/lernspiele/register.js                    (trägt die Spiele in Übersicht und Stundenplan ein)
   Texte stehen als "Deutsch ¦ Sprache1 ¦ Sprache2 …" – die Reihenfolge der Sprachen legt `langs` im Spiel fest.
   Fehlt eine Übersetzung oder ist eine zu viel, bricht der Bau mit Fehlermeldung ab. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const SRC = fs.readFileSync(path.join(ROOT, 'LF1_M_11_Ziele-Check.html'), 'utf8').split('\n');
const LF4 = fs.readFileSync(path.join(ROOT, 'LF4_M_8_Augenhoehe_ist_Kaufhoehe.html'), 'utf8');

const NAMES = { es: 'Español', pt: 'Português', ru: 'Русский', ti: 'ትግርኛ', tr: 'Türkçe', vi: 'Tiếng Việt', ar: 'العربية', uk: 'Українська' };
const MASTER_ORDER = ['es', 'pt', 'ru', 'ti', 'tr', 'vi', 'ar'];

/* Oberflächentexte aus dem LF-4-Spiel (de, es, pt, ru, ti, tr, vi, ar) + zwei Zusatztexte für „Reihenfolge“ */
const U_MASTER = (() => {
  const m = LF4.match(/const U=\{[\s\S]*?\n\};/);
  const U = eval('(' + m[0].slice('const U='.length, -1) + ')');
  U.naechster = ['Tippe immer den nächsten Schritt an.', 'Toca siempre el siguiente paso.', 'Toca sempre no passo seguinte.', 'Всегда нажимай на следующий шаг.', 'ወትሩ ዝቕጽል ስጉምቲ ንኪ።', 'Her zaman bir sonraki adıma dokun.', 'Luôn chạm vào bước tiếp theo.', 'المس دائمًا الخطوة التالية.'];
  U.nichtdran = ['Das ist noch nicht dran.', 'Todavía no toca este.', 'Ainda não é este.', 'Это ещё не сейчас.', 'እዚ ገና ኣይኮነን።', 'Henüz sırası değil.', 'Chưa đến bước này.', 'ليست هذه الخطوة الآن.'];
  return U;
})();

/* Standard-Einleitung (de, es, pt, ru, ti, tr, vi, ar) */
const INTRO = ['Löse die Aufgaben allein oder zu zweit am Handy. Für richtige Antworten gibt es Punkte. Wähle Basis oder Profi.', 'Resuelve las tareas solo o en pareja en el móvil. Las respuestas correctas dan puntos. Elige Básico o Profi.', 'Resolve as tarefas sozinho ou a dois no telemóvel. As respostas certas dão pontos. Escolhe Básico ou Profi.', 'Выполняй задания один или вдвоём на телефоне. За верные ответы начисляются очки. Выбери «Базовый» или «Профи».', 'ነቲ ዕማማት ባዕልኻ ወይ ክልተ ኮይንኩም ኣብ ተሌፎን ፍታሕ። ንቅኑዕ መልሲ ነጥቢ ኣሎ። መሰረታዊ ወይ ፕሮፌሽናል ምረጽ።', 'Görevleri tek başına veya iki kişi telefonda çöz. Doğru cevaplara puan verilir. Temel veya Profesyonel seç.', 'Làm bài một mình hoặc hai người trên điện thoại. Trả lời đúng được điểm. Chọn Cơ bản hoặc Nâng cao.', 'حلّ المهام وحدك أو مع زميل على الهاتف. الإجابات الصحيحة تمنح نقاطًا. اختر أساسي أو متقدم.'];

function helpers(langs) {
  const n = langs.length + 1;
  const X = (s, where) => {
    if (Array.isArray(s)) return s;
    const p = String(s).split('¦').map(x => x.trim());
    if (p.length !== n || p.some(x => !x)) throw new Error(`Text mit ${p.length} statt ${n} Teilen: ${String(s).slice(0, 90)}`);
    return p;
  };
  const N = s => Array(n).fill(String(s));
  return {
    X, N,
    B: (e, t) => ({ e, n: X(t) }),
    I: (e, b, t, w) => { const o = { e, b, t: X(t) }; if (w) o.w = X(w); return o; },
    K: (e, ok, t) => ({ e, ok: ok ? 1 : 0, t: X(t) }),
    O: (e, t) => ({ e, t: X(t) }),
    MC: (e, q, o, r, w, p) => ({ type: 'mc', e, q: X(q), o: o.map(x => X(x)), r, w: X(w), p: p ? 1 : 0 }),
    SORT: (task, bins, items, p) => ({ type: 'sort', task: X(task), bins, items, p: p ? 1 : 0 }),
    PICK: (task, w, items, p) => ({ type: 'pick', task: X(task), w: X(w), items, p: p ? 1 : 0 }),
    ORDER: (task, h, items, p) => ({ type: 'order', task: X(task), h: X(h), items, p: p ? 1 : 0 }),
    CALC: (e, q, unit, a, hint, sol, p, tol) => ({ type: 'calc', e, q: X(q), unit, a, hint: X(hint), sol: typeof sol === 'string' && sol.indexOf('¦') < 0 ? N(sol) : X(sol), p: p ? 1 : 0, tol: tol == null ? 0.004 : tol }),
  };
}

function build(g) {
  const langs = g.langs;
  const idx = [0].concat(langs.map(l => 1 + MASTER_ORDER.indexOf(l)));
  if (langs.some(l => MASTER_ORDER.indexOf(l) < 0)) throw new Error('Unbekannte Sprache in ' + g.file);
  const U = {};
  for (const k in U_MASTER) U[k] = idx.map(i => U_MASTER[k][i]);
  const H = helpers(langs);
  const intro = g.intro ? H.X(g.intro) : idx.map(i => INTRO[i]);
  const sub = g.sub ? H.X(g.sub) : [g.subde || (g.h1 + ' · ' + g.title.split(' – ')[1] + ' · KLA Bremerhaven')];   /* ohne Übersetzung: nur Deutsch */
  const txt = { sub, head: H.X(g.head), intro, merktext: H.X(g.merk) };
  const GAME = { icon: g.icon, h1: g.h1, title: g.title, file: g.file, lskey: g.lskey, txt, stages: g.stages(H) };
  GAME.stages.forEach(s => { if (!s.p) delete s.p; });
  if (!GAME.stages.some(s => s.p)) throw new Error(g.file + ': keine Profi-Aufgabe (p=1)');
  const langset = [['de', 'Deutsch']].concat(langs.map(l => [l, NAMES[l]]));
  /* Gerüst aus Ziele-Check: Kopf (Zeilen 1-101) + Engine (ab Zeile 182) */
  let head = SRC.slice(0, 101).join('\n')
    .replace('<title>Ziele-Check – LF 1 Modul 11</title>', `<title>${g.title}</title>`)
    .replace('<h1>Ziele-Check</h1>', `<h1>${g.h1}</h1>`);
  let eng = SRC.slice(181).join('\n');
  eng = eng.replace(/const LSKEY="[^"]*";/, `const LSKEY="${g.lskey}";`)
    .replace(/U\.naechster=NXT;U\.nichtdran=NDR;const UX=\{.*\};\nfor\(const k in UX\)\{[^\n]*\}\n/, '')
    .replace('<div>${L(it.w)}</div></div>`;\n    h+=S.r.k', '${it.w?`<div>${L(it.w)}</div>`:""}</div>`;\n    h+=S.r.k');
  if (/UX=/.test(eng)) throw new Error('Engine-Umbau (UX) fehlgeschlagen');
  if (!/it\.w\?/.test(eng)) throw new Error('Engine-Umbau (w optional) fehlgeschlagen');
  const out = head + '\n<script>\nconst LANGSET=' + JSON.stringify(langset) + ';\nconst U=' + JSON.stringify(U) + ';\nconst GAME=' + JSON.stringify(GAME) + ';\n' + eng;
  fs.writeFileSync(path.join(ROOT, g.file), out);
  return { file: g.file, langs, h1: g.h1, key: g.key };
}

if (require.main === module) {
  const files = process.argv.slice(2);
  const dir = path.join(__dirname, 'games');
  const list = (files.length ? files : fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => path.join('games', f)));
  const done = [];
  for (const f of list) {
    const games = require(path.resolve(__dirname, f));
    for (const g of games) { done.push(build(g)); console.log('✔', g.file, '(' + g.langs.join(',') + ')'); }
  }
  fs.writeFileSync(path.join(__dirname, 'built.json'), JSON.stringify(Object.assign(JSON.parse(fs.existsSync(path.join(__dirname, 'built.json')) ? fs.readFileSync(path.join(__dirname, 'built.json'), 'utf8') : '{}'), Object.fromEntries(done.map(d => [d.file, d]))), null, 1));
}
module.exports = { build };
