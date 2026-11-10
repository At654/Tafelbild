/*!
 * Mehrsprachigkeit für die Unterrichtsseiten (statisch, ohne Server, ohne Tracker).
 * Einbinden mit EINER Zeile vor </body>:   <script src="../i18n/i18n.js" defer></script>
 * (auf Seiten im Hauptordner: i18n/i18n.js)
 *
 * Funktionsweise: Das Skript liest die sichtbaren deutschen Textblöcke der Seite (auch von JavaScript
 * erzeugte), bildet daraus eine feste ID (Hash des Textes) und sucht die Übersetzung in
 *   i18n/common/<sprache>.json          (Texte, die auf vielen Seiten gleich sind)
 *   i18n/pages/<seite>/<sprache>.json   (Texte nur dieser Seite)
 * Die Seite selbst (HTML, Logik, Lösungen) wird nicht verändert. Das Deutsche bleibt maßgeblich.
 */
(function () {
  'use strict';
  if (window.I18N) return;

  var LANGS = [
    { c: 'de', n: 'Deutsch' },
    { c: 'tr', n: 'Türkçe' },
    { c: 'ar', n: 'العربية', rtl: 1 },
    { c: 'vi', n: 'Tiếng Việt' },
    { c: 'ru', n: 'Русский' },
    { c: 'es', n: 'Español' },
    { c: 'ti', n: 'ትግርኛ' },
    { c: 'pt', n: 'Português' },
    { c: 'uk', n: 'Українська' }
  ];
  var K_LANG = 'tu-i18n-lang', K_MODE = 'tu-i18n-mode';

  /* Oberflächentexte des Bedienfelds */
  var UI = {
    de: { fab: 'Sprache', title: 'Übersetzung', lang: 'Sprache', mode: 'Anzeige', hover: 'Antippen / Maus', under: 'Darunter', note: 'Maschinelle Übersetzung. Die deutsche Fassung gilt.', missing: 'Für diese Seite gibt es noch keine Übersetzung.' },
    tr: { fab: 'Dil', title: 'Çeviri', lang: 'Dil', mode: 'Gösterim', hover: 'Dokun / fare', under: 'Altında', note: 'Makine çevirisi. Almanca metin geçerlidir.', missing: 'Bu sayfa için henüz çeviri yok.' },
    ar: { fab: 'اللغة', title: 'الترجمة', lang: 'اللغة', mode: 'العرض', hover: 'اضغط / الفأرة', under: 'تحت النص', note: 'ترجمة آلية. النص الألماني هو المعتمد.', missing: 'لا توجد ترجمة لهذه الصفحة بعد.' },
    vi: { fab: 'Ngôn ngữ', title: 'Bản dịch', lang: 'Ngôn ngữ', mode: 'Cách hiển thị', hover: 'Chạm / chuột', under: 'Bên dưới', note: 'Bản dịch tự động. Bản tiếng Đức mới là chính thức.', missing: 'Trang này chưa có bản dịch.' },
    ru: { fab: 'Язык', title: 'Перевод', lang: 'Язык', mode: 'Показ', hover: 'Нажать / мышь', under: 'Под текстом', note: 'Машинный перевод. Верен немецкий текст.', missing: 'Для этой страницы перевода пока нет.' },
    es: { fab: 'Idioma', title: 'Traducción', lang: 'Idioma', mode: 'Mostrar', hover: 'Tocar / ratón', under: 'Debajo', note: 'Traducción automática. Vale el texto alemán.', missing: 'Esta página aún no tiene traducción.' },
    ti: { fab: 'ቋንቋ', title: 'ትርጉም', lang: 'ቋንቋ', mode: 'ኣተራዓዕባ', hover: 'ንካዕ / ማውስ', under: 'ኣብ ትሕቲ', note: 'ብማሽን ዝተተርጎመ። እቲ ጀርመንኛ ጽሑፍ እዩ ቀዳማይ።', missing: 'ን እዛ ገጽ ገና ትርጉም የለን።' },
    pt: { fab: 'Idioma', title: 'Tradução', lang: 'Idioma', mode: 'Exibição', hover: 'Tocar / mouse', under: 'Por baixo', note: 'Tradução automática. O texto em alemão é o que vale.', missing: 'Esta página ainda não tem tradução.' },
    uk: { fab: 'Мова', title: 'Переклад', lang: 'Мова', mode: 'Показ', hover: 'Натиснути / миша', under: 'Під текстом', note: 'Машинний переклад. Чинний — німецький текст.', missing: 'Для цієї сторінки перекладу ще немає.' }
  };

  var script = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    for (var i = s.length - 1; i >= 0; i--) if (/i18n\.js(\?|$)/.test(s[i].src)) return s[i];
  })();
  var BASE = script && script.src ? script.src.replace(/[^\/]*$/, '') : 'i18n/';
  var PAGE = (script && script.getAttribute('data-i18n-page')) || pageIdFromUrl();

  function pageIdFromUrl() {
    var p = location.pathname.split('/').pop() || 'index';
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/\.html?$/i, '').replace(/[^A-Za-z0-9_\-]+/g, '_') || 'index';
  }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function langInfo(c) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].c === c) return LANGS[i]; return LANGS[0]; }

  /* ---------- Zustand (URL > localStorage > Standard) ---------- */
  var lang = 'de', mode = 'hover';
  (function init() {
    var q = {};
    try { new URLSearchParams(location.search).forEach(function (v, k) { q[k] = v; }); } catch (e) {}
    var l = (q.lang || get(K_LANG) || 'de').toLowerCase();
    var m = (q.mode || get(K_MODE) || 'hover').toLowerCase();
    lang = langInfo(l).c === l ? l : 'de';
    mode = (m === 'under' || m === 'darunter') ? 'under' : 'hover';
    if (q.lang) put(K_LANG, lang);
    if (q.mode) put(K_MODE, mode);
  })();

  /* ---------- Textblöcke finden ---------- */
  var SKIP_SEL = '[data-i18n-ui],[data-i18n-skip],[translate=no],.notranslate,script,style,noscript,svg,canvas,textarea,code,template,iframe,#i18n-fab,#i18n-panel,#i18n-bubble';
  var INLINE_TAGS = /^(SPAN|B|STRONG|I|EM|U|MARK|SMALL|SUB|SUP|BDI|BDO|ABBR|CITE|Q|S|TIME|FONT|A|DEL|INS|KBD|VAR|WBR)$/;
  var BLOCK_TAGS = /^(P|DIV|LI|TD|TH|TR|TABLE|THEAD|TBODY|UL|OL|H[1-6]|HEADER|FOOTER|SECTION|ARTICLE|MAIN|NAV|ASIDE|FORM|FIELDSET|BLOCKQUOTE|FIGURE|FIGCAPTION|DT|DD|DL|SUMMARY|DETAILS|BUTTON|LABEL|CAPTION|LEGEND|PRE|SELECT|OPTION|BODY)$/;

  /* Seitenspezifische Einstellungen (pages/<seite>/config.json):
     numeric = Selektoren, deren Zahlen als {1},{2} … zählen (für wechselnde Ergebnisse, z. B. Punktzahl)
     force   = Selektoren, die immer ein eigener Textblock sind (z. B. <span>richtig</span> in einer Zeile)
     skip    = Selektoren, die ganz ignoriert werden (z. B. Zeitanzeige, Zähler)
     prefix  = Satzanfänge wie „Richtig!“, „Fachbegriff:“: Der Rest wird in Bausteine zerlegt (bei „→“ und „: “), die einzeln übersetzt und zusammengesetzt werden
     split   = Trennzeichen wie " · " und " = ": Texte aus lauter einzeln übersetzten Teilen (z. B. „Plakat = Werbemittel · Litfaßsäule = Werbeträger.“)
     bag     = Wortlisten „Titel: a · b · c“ in zufälliger Reihenfolge (jedes Wort wird einzeln übersetzt) */
  var CFG = { numeric: '', force: '', bag: '', skip: '', prefix: [], split: [] };
  function configure(c) {
    CFG.numeric = (c && c.numeric || []).join(',');
    CFG.force = (c && c.force || []).join(',');
    CFG.bag = (c && c.bag || []).join(',');
    CFG.skip = (c && c.skip || []).join(',');
    CFG.prefix = (c && c.prefix) || [];
    CFG.split = (c && c.split) || [];
  }
  function template(el, t) {
    if (!CFG.numeric || !el.matches(CFG.numeric)) return { text: t, vals: null };
    var vals = [];
    var text = t.replace(/\d+(?:[.,]\d+)*/g, function (m) { vals.push(m); return '{' + vals.length + '}'; });
    return { text: text, vals: vals };
  }
  /* Zusammengesetzte Texte: <Präfix> <A> → <B>   oder   <Präfix> <A>: <B>.   Liefert Bausteine [{text, glue}] oder null. */
  function composeSplit(t) {
    var pre = [], rest = t, again = true;
    while (again && CFG.prefix.length) {
      again = false;
      for (var i = 0; i < CFG.prefix.length; i++) {
        var p = CFG.prefix[i];
        if (rest.indexOf(p) === 0 && rest.length > p.length) { pre.push({ text: p.replace(/\s+$/, ''), glue: ' ', pre: true }); rest = norm(rest.slice(p.length)); again = true; break; }
      }
    }
    var parts = pre.slice();
    if (pre.length) {
      rest.split(' → ').forEach(function (seg, i) {
        var glue = i ? ' → ' : ' ';
        var k = seg.indexOf(': ');
        if (k > -1) { parts.push({ text: seg.slice(0, k), glue: glue }); parts.push({ text: seg.slice(k + 2), glue: ': ' }); }
        else parts.push({ text: seg, glue: glue });
      });
      return { parts: parts, npre: pre.length, rest: rest };
    }
    if (CFG.split.length) {
      var re = new RegExp('(' + CFG.split.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')');
      var bits = t.split(re);
      if (bits.length < 3) return null;
      for (var j = 0; j < bits.length; j += 2) if (bits[j]) parts.push({ text: bits[j], glue: j ? bits[j - 1] : '' });
      return { parts: parts, npre: 0, rest: null };
    }
    return null;
  }
  function composeHtml(u) {
    var pieces = [], i;
    for (i = 0; i < u.npre; i++) { var x = lookupPiece(u.parts[i].text); if (!x) return null; pieces.push(u.parts[i].glue + fmt(x)); }
    if (u.rest) { var whole = lookupPiece(u.rest); if (whole) return pieces.join('') + ' ' + fmt(whole); }
    for (i = u.npre; i < u.parts.length; i++) { var y = lookupPiece(u.parts[i].text); if (!y) return null; pieces.push(u.parts[i].glue + fmt(y)); }
    return pieces.join('');
  }
  function lookupPiece(x) {
    var d = dict && dict[hash(x)];
    if (d) return d;
    var m = /^(.*?)([.!?])$/.exec(x);
    d = m && dict && dict[hash(m[1])];
    return d ? d + m[2] : null;
  }
  /* Allgemeine Zahlen-Vorlage: „Punkte: 150“ -> „Punkte: {1}“. Wird nur benutzt, wenn der Text selbst nicht übersetzt ist, die Vorlage aber schon. */
  function generic(t) {
    var vals = [];
    var text = t.replace(/\d+(?:[.,]\d+)*/g, function (m) { vals.push(m); return '{' + vals.length + '}'; });
    return vals.length ? { text: text, vals: vals } : null;
  }
  function subst(tr, vals) {
    return vals ? tr.replace(/\{(\d+)\}/g, function (m, n) { return vals[n - 1] !== undefined ? vals[n - 1] : m; }) : tr;
  }
  function isBoundary(el) {
    var t = el.tagName;
    if (CFG.force && el.matches(CFG.force)) return true;
    if (BLOCK_TAGS.test(t)) return true;
    var d;
    try { d = getComputedStyle(el).display; } catch (e) { return false; }
    if (INLINE_TAGS.test(t)) return !/^inline/.test(d) && d !== 'contents' && d !== 'none' ? true : false;
    return !(/^inline/.test(d) || d === 'contents');
  }
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function textOf(el) {
    var s = '';
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) s += n.nodeValue;
      else if (n.nodeType === 1) {
        if (n.matches(SKIP_SEL) || (CFG.skip && n.matches(CFG.skip))) continue;
        var t = n.tagName;
        if (t === 'BR') s += ' ';
        else if (t === 'SELECT') s += '___';
        else if (t === 'INPUT') { if (/^(text|number|search|)$/.test(n.type || '')) s += '___'; }
        else if (isBoundary(n)) continue;
        else s += textOf(n);
      }
    }
    return norm(s);
  }
  /* 53-Bit-Hash (cyrb53) – dieselbe Funktion nutzt das Prüfwerkzeug */
  function hash(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 't' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  var UNITS = /\b(kg|g|mg|ml|cl|dl|l|cm|mm|m|km|qm|ct|Std|h|min|Min|Sek|s|Stk|EUR|USD|MwSt|USt|PLZ|IBAN|GTIN)\b\.?/g;
  function qualifies(t) { // braucht echte Wörter, nicht nur Zahlen, Einheiten und Symbole
    if (t.length < 2 || !/\p{L}{2}/u.test(t)) return false;
    return /\p{L}{2}/u.test(t.replace(/\{\d+\}|\d+(?:[.,]\d+)*/g, ' ').replace(UNITS, ' '));
  }

  /* Liefert alle Einheiten der Seite: {el, id, text, kind} */
  function units() {
    var out = [], all = document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest(SKIP_SEL) || (CFG.skip && el.closest(CFG.skip))) continue;
      if (el.tagName === 'SELECT') {
        var opts = [], ok = false;
        for (var k = 0; k < el.options.length; k++) {
          var ot = norm(el.options[k].text);
          if (qualifies(ot)) { opts.push({ id: hash(ot), text: ot, value: el.options[k].value }); ok = true; }
        }
        if (ok) out.push({ el: el, kind: 'select', opts: opts });
        continue;
      }
      if (el.tagName === 'OPTION' || !isBoundary(el)) continue;
      var t = textOf(el);
      if (CFG.bag && el.matches(CFG.bag) && qualifies(t)) {
        var ix = t.indexOf(':'), lab = ix > -1 ? t.slice(0, ix + 1) : '';
        var parts = t.slice(ix + 1).split('·').map(norm).filter(Boolean).map(function (w) { return { id: hash(w), text: w }; });
        out.push({ el: el, kind: 'bag', label: lab ? { id: hash(lab), text: lab } : null, parts: parts });
        continue;
      }
      if (!qualifies(t)) continue;
      var tp = template(el, t);
      var cp = (!tp.vals && (CFG.prefix.length || CFG.split.length)) ? composeSplit(t) : null;
      if (cp) { out.push({ el: el, kind: 'compose', parts: cp.parts, npre: cp.npre, rest: cp.rest, id: hash(t), text: t }); continue; }
      var gn = tp.vals ? null : generic(t);
      out.push({ el: el, id: hash(tp.text), text: tp.text, vals: tp.vals, kind: 'text', alt: gn ? { id: hash(gn.text), text: gn.text, vals: gn.vals } : null });
    }
    return out;
  }
  function collect() {
    var seen = {}, res = [];
    units().forEach(function (u) {
      if (u.kind === 'compose') { u.parts.forEach(function (p) { var tx = p.pre ? p.text : p.text.replace(/[.!?]$/, ''); if (!seen[hash(tx)]) { seen[hash(tx)] = 1; res.push({ id: hash(tx), alt: null, text: tx, kind: 'text', tag: 'compose' }); } }); return; }
      var items = u.kind === 'select' ? u.opts : u.kind === 'bag' ? (u.label ? [u.label] : []).concat(u.parts) : [u];
      items.forEach(function (x) {
        if (seen[x.id]) return;
        seen[x.id] = 1;
        res.push({ id: x.id, alt: x.alt ? { id: x.alt.id, text: x.alt.text } : null, text: x.text, kind: u.kind === 'select' ? 'option' : u.kind === 'bag' ? 'bag' : 'text', tag: u.el.tagName.toLowerCase() });
      });
    });
    return res;
  }

  /* ---------- Wörterbücher ---------- */
  var dict = null, dictLang = null, loadState = 'idle'; // idle | loading | ok | none
  function fetchJson(url) {
    return fetch(url).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
  }
  function loadDict(cb) {
    if (lang === 'de') { dict = null; dictLang = null; loadState = 'idle'; return cb(); }
    if (dictLang === lang && dict) return cb();
    loadState = 'loading';
    var want = lang;
    Promise.all([fetchJson(BASE + 'common/' + want + '.json'), fetchJson(BASE + 'pages/' + PAGE + '/' + want + '.json'), fetchJson(BASE + 'pages/' + PAGE + '/config.json')]).then(function (r) {
      if (want !== lang) return;
      configure(r[2]);
      var d = {};
      [r[0], r[1]].forEach(function (o) { for (var k in o) if (o[k]) d[k] = o[k]; });
      dict = d; dictLang = want;
      loadState = Object.keys(r[1]).length ? 'ok' : 'none';
      cb();
    });
  }

  /* ---------- Anzeige ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(s) { // deutsche Begriffe in Klammern bidi-sicher isolieren (für Arabisch)
    var h = esc(s);
    if (langInfo(lang).rtl) h = h.replace(/\(([^()]*[A-Za-zÄÖÜäöüß][^()]*)\)/g, '(<bdi dir="ltr">$1</bdi>)');
    return h;
  }
  function setLangAttrs(node) {
    node.setAttribute('lang', lang);
    node.setAttribute('dir', langInfo(lang).rtl ? 'rtl' : 'ltr');
  }
  function isInteractive(el) {
    return !!el.closest('button,label,select,input,a[href],summary,[onclick],[role=button],[tabindex]:not([data-i18n-tab])');
  }
  function selectHtml(u, full) {
    var li = '', cur = u.el.value;
    u.opts.forEach(function (o) {
      var tr = dict[o.id]; if (!tr || !o.value) return;
      if (full) li += '<li><small>' + esc(o.text) + '</small>' + fmt(tr) + '</li>';
      else if (o.value === cur) li = fmt(tr);
    });
    return full ? (li ? '<ul>' + li + '</ul>' : '') : li;
  }
  var groupSeen = {};
  function applyAll() {
    if (!document.body) return;
    groupSeen = {};
    var list = units();
    for (var i = 0; i < list.length; i++) applyOne(list[i]);
    updateFab();
  }
  function clearOne(el) {
    el.removeAttribute('data-i18n-id');
    el.classList.remove('i18n-hv');
    if (el.hasAttribute('data-i18n-tab')) { el.removeAttribute('tabindex'); el.removeAttribute('data-i18n-tab'); }
    if (el.__i18nU) { if (el.__i18nU.parentNode) el.__i18nU.parentNode.removeChild(el.__i18nU); el.__i18nU = null; }
  }
  function applyOne(u) {
    var el = u.el, has = false, html = '';
    if (lang === 'de' || !dict) { clearOne(el); return; }
    if (u.kind === 'select') {
      var key = u.opts.map(function (o) { return o.id; }).join('|');
      var first = !groupSeen[key]; groupSeen[key] = 1;
      html = (first ? selectHtml(u, true) : '') + (el.value ? '<div>' + selectHtml(u, false) + '</div>' : '');
      has = !!html;
      el.__i18nSel = u;
      if (has) el.setAttribute('data-i18n-id', 'select');
    } else if (u.kind === 'compose') {
      var ch = composeHtml(u);
      if (!ch && dict[u.id]) ch = fmt(dict[u.id]);
      has = !!ch;
      if (has) { html = ch; el.setAttribute('data-i18n-id', 'compose'); el.__i18nBag = html; }
    } else if (u.kind === 'bag') {
      var all = u.parts.every(function (p) { return dict[p.id]; });
      has = all && u.parts.length > 0;
      if (has) {
        html = (u.label && dict[u.label.id] ? fmt(dict[u.label.id]) + ' ' : '') + u.parts.map(function (p) { return fmt(dict[p.id]); }).join(' &nbsp;·&nbsp; ');
        el.setAttribute('data-i18n-id', 'bag'); el.__i18nBag = html;
      }
    } else {
      var tr = dict[u.id], vals = u.vals, aid = u.id;
      if (!tr && u.alt && dict[u.alt.id]) { tr = dict[u.alt.id]; vals = u.alt.vals; aid = u.alt.id; }
      has = !!tr;
      if (has) { html = fmt(subst(tr, vals)); el.setAttribute('data-i18n-id', aid); el.__i18nVals = vals; }
    }
    if (!has) { clearOne(el); return; }
    if (mode === 'hover') {
      if (el.__i18nU) { el.__i18nU.remove(); el.__i18nU = null; }
      el.classList.add('i18n-hv');
      if (!el.hasAttribute('tabindex') && !isInteractive(el) && !el.hasAttribute('data-i18n-tab')) { el.setAttribute('tabindex', '0'); el.setAttribute('data-i18n-tab', '1'); }
    } else {
      el.classList.remove('i18n-hv');
      if (el.hasAttribute('data-i18n-tab')) { el.removeAttribute('tabindex'); el.removeAttribute('data-i18n-tab'); }
      var node = el.__i18nU;
      if (!node) {
        node = document.createElement('span');
        node.className = 'i18n-u';
        node.setAttribute('data-i18n-ui', '1');
        el.__i18nU = node;
      }
      setLangAttrs(node);
      if (node.__h !== html) { node.innerHTML = html; node.__h = html; }
      if (u.kind === 'select' && !/^(TD|TH)$/.test(el.parentNode.tagName) && textOf(el.parentNode)) {
        // Select mitten im Fließtext (z. B. Lückentext): keine Einfügung, sonst wird der Satz zerrissen (Hover/Bubble bleibt)
        if (node.parentNode) node.parentNode.removeChild(node);
      } else if (u.kind === 'select') { if (node.previousSibling !== el) el.parentNode.insertBefore(node, el.nextSibling); }
      else if (node.parentNode !== el || node !== el.lastChild) el.appendChild(node);
    }
  }

  /* ---------- Sprechblase ---------- */
  var bubble, bubbleFor = null, hoverTimer = null, lastPtr = 'mouse', shownAt = 0;
  function bubbleHtml(el) {
    if (el.__i18nBag) return el.__i18nBag;
    if (el.__i18nSel) return selectHtml(el.__i18nSel, true) || selectHtml(el.__i18nSel, false);
    return fmt(subst(dict[el.getAttribute('data-i18n-id')] || '', el.__i18nVals));
  }
  function showBubble(el) {
    if (mode !== 'hover' || lang === 'de' || !dict) return;
    var html = bubbleHtml(el); if (!html) return;
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.id = 'i18n-bubble'; bubble.setAttribute('role', 'tooltip'); bubble.setAttribute('data-i18n-ui', '1');
      document.body.appendChild(bubble);
    }
    if (bubbleFor && bubbleFor !== el) bubbleFor.removeAttribute('aria-describedby');
    bubble.innerHTML = html; setLangAttrs(bubble);
    bubble.style.display = 'block'; bubble.style.visibility = 'hidden'; bubble.style.left = '0px'; bubble.style.top = '0px';
    var r = el.getBoundingClientRect(), w = bubble.offsetWidth, h = bubble.offsetHeight;
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, m = 8;
    var top = r.bottom + 6;
    if (top + h > vh - m) top = r.top - h - 6;
    if (top < m) top = Math.max(m, Math.min(vh - h - m, r.bottom + 6));
    var left = langInfo(lang).rtl ? r.right - w : r.left;
    left = Math.max(m, Math.min(vw - w - m, left));
    bubble.style.left = left + 'px'; bubble.style.top = top + 'px'; bubble.style.visibility = 'visible';
    bubble.id = 'i18n-bubble';
    el.setAttribute('aria-describedby', 'i18n-bubble');
    bubbleFor = el; shownAt = Date.now();
  }
  function hideBubble() {
    clearTimeout(hoverTimer);
    if (bubble) bubble.style.display = 'none';
    if (bubbleFor) bubbleFor.removeAttribute('aria-describedby');
    bubbleFor = null;
  }
  function unitOf(t) { return t && t.closest ? t.closest('[data-i18n-id]') : null; }

  document.addEventListener('pointerdown', function (e) { lastPtr = e.pointerType || 'mouse'; }, true);
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse' || mode !== 'hover') return;
    var u = unitOf(e.target); if (!u || u === bubbleFor) return;
    clearTimeout(hoverTimer); hoverTimer = setTimeout(function () { showBubble(u); }, 120);
  });
  document.addEventListener('pointerout', function (e) {
    if (e.pointerType !== 'mouse') return;
    var u = unitOf(e.target); if (!u) return;
    if (e.relatedTarget && u.contains(e.relatedTarget)) return;
    hideBubble();
  });
  document.addEventListener('click', function (e) {
    if (mode !== 'hover' || lang === 'de' || lastPtr === 'mouse') return;
    if (e.target.closest && e.target.closest('#i18n-panel,#i18n-fab')) return;
    var u = unitOf(e.target);
    if (!u) { hideBubble(); return; }
    if (u === bubbleFor && Date.now() - shownAt > 350 && !isInteractive(u)) hideBubble(); else showBubble(u);
  }, true);
  document.addEventListener('focusin', function (e) {
    var u = unitOf(e.target); if (u && mode === 'hover') showBubble(u);
  });
  document.addEventListener('focusout', hideBubble);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hideBubble(); setPanel(false); } });
  window.addEventListener('scroll', hideBubble, true);
  window.addEventListener('resize', hideBubble);
  document.addEventListener('change', function (e) { if (e.target && e.target.tagName === 'SELECT') schedule(); });

  /* ---------- Bedienfeld ---------- */
  var fab, panel;
  function setPanel(open) {
    if (!panel) return;
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function buildUi() {
    fab = document.createElement('button');
    fab.id = 'i18n-fab'; fab.type = 'button'; fab.setAttribute('data-i18n-ui', '1');
    fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'i18n-panel');
    fab.addEventListener('click', function () { setPanel(panel.hidden); });
    panel = document.createElement('div');
    panel.id = 'i18n-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('data-i18n-ui', '1');
    document.body.appendChild(panel); document.body.appendChild(fab);
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-l')) setLang(b.getAttribute('data-l'));
      if (b.hasAttribute('data-m')) setMode(b.getAttribute('data-m'));
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !e.target.closest('#i18n-panel,#i18n-fab')) setPanel(false);
    });
    renderPanel(); updateFab();
  }
  function renderPanel() {
    var t = UI[lang] || UI.de, h = '';
    h += '<h2 lang="' + lang + '">' + esc(t.title) + '</h2>';
    h += '<span class="lab" lang="' + lang + '">' + esc(t.lang) + '</span><div class="grp">';
    LANGS.forEach(function (l) {
      h += '<button type="button" data-l="' + l.c + '" lang="' + l.c + '" dir="' + (l.rtl ? 'rtl' : 'ltr') + '" aria-pressed="' + (l.c === lang) + '">' + l.n + '</button>';
    });
    h += '</div>';
    if (lang !== 'de') {
      h += '<span class="lab" lang="' + lang + '">' + esc(t.mode) + '</span><div class="grp">' +
        '<button type="button" data-m="hover" lang="' + lang + '" aria-pressed="' + (mode === 'hover') + '">' + esc(t.hover) + '</button>' +
        '<button type="button" data-m="under" lang="' + lang + '" aria-pressed="' + (mode === 'under') + '">' + esc(t.under) + '</button></div>';
      h += '<p class="note" lang="' + lang + '" dir="' + (langInfo(lang).rtl ? 'rtl' : 'ltr') + '">' + esc(t.note) + '</p>';
      if (loadState === 'none') h += '<p class="warn" lang="' + lang + '" dir="' + (langInfo(lang).rtl ? 'rtl' : 'ltr') + '">' + esc(t.missing) + '</p>';
      if (lang === 'ti') h += '<p class="warn" lang="de">⚠ Tigrinya: maschinelle Übersetzung, noch nicht von Muttersprachlerinnen/Muttersprachlern geprüft.</p>';
    }
    panel.innerHTML = h;
  }
  function updateFab() {
    if (!fab) return;
    var t = UI[lang] || UI.de;
    fab.setAttribute('lang', lang);
    fab.setAttribute('data-on', lang === 'de' ? 'off' : 'on');
    fab.textContent = '🌐 ' + (lang === 'de' ? t.fab : langInfo(lang).n);
    fab.setAttribute('aria-label', (lang === 'de' ? 'Sprache / Language' : t.title + ': ' + langInfo(lang).n));
  }

  /* ---------- Steuerung ---------- */
  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(applyAll, 120); }
  function refresh() {
    hideBubble();
    document.documentElement.setAttribute('data-i18n-lang', lang);
    document.documentElement.setAttribute('data-i18n-mode', mode);
    loadDict(function () { applyAll(); renderPanel(); });
    renderPanel();
  }
  function setLang(c) { lang = langInfo(c).c === c ? c : 'de'; put(K_LANG, lang); refresh(); }
  function setMode(m) { mode = m === 'under' ? 'under' : 'hover'; put(K_MODE, mode); refresh(); }

  function start() {
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = BASE + 'i18n.css'; link.setAttribute('data-i18n-ui', '1');
    document.head.appendChild(link);
    buildUi();
    new MutationObserver(function (ms) {
      if (lang === 'de') return;
      for (var i = 0; i < ms.length; i++) {
        var t = ms[i].target;
        if (t.nodeType === 1 && t.closest && t.closest('[data-i18n-ui]')) continue;
        var only = true;
        [].forEach.call(ms[i].addedNodes || [], function (n) { if (!(n.nodeType === 1 && n.hasAttribute('data-i18n-ui'))) only = false; });
        [].forEach.call(ms[i].removedNodes || [], function (n) { if (!(n.nodeType === 1 && n.hasAttribute('data-i18n-ui'))) only = false; });
        if (ms[i].type === 'childList' && only && (ms[i].addedNodes.length + ms[i].removedNodes.length)) continue;
        schedule(); return;
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    refresh();
  }

  /* Für das Prüfwerkzeug: angezeigte Textblöcke ohne Übersetzung */
  function untranslated() {
    var res = {};
    units().forEach(function (u) {
      if (u.kind === 'compose') { if (!composeHtml(u) && !(dict && dict[u.id])) res[u.text] = ''; return; }
      var items = u.kind === 'select' ? u.opts : u.kind === 'bag' ? u.parts : [u];
      items.forEach(function (x) {
        var ok = !!(dict && (dict[x.id] || (x.alt && dict[x.alt.id])));
        if (!ok) res[x.text] = x.alt ? x.alt.text : '';
      });
    });
    return Object.keys(res).map(function (k) { return [k, res[k]]; });
  }
  window.I18N = { collect: collect, untranslated: untranslated, configure: configure, hash: hash, setLang: setLang, setMode: setMode, page: PAGE, version: 1,
    state: function () { return { lang: lang, mode: mode, load: loadState }; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
