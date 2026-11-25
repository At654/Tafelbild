#!/usr/bin/env node
/* Baut die deutschen Lehrkraft-PDFs "LF2_M_<n>_Einstiegsmaterial.pdf" für Modul 9, 10, 11, 13 neu
   (Layout wie die bisherigen LibreOffice-PDFs: Kopfkasten mit Logo, Tabellen, Merke-Kästen, Schneidekarten).
   Die Kartentexte kommen aus tools/kaertchen/data/LF2_M_<n>.txt, damit Einstiegsmaterial und
   mehrsprachige Kärtchen immer dieselben Karten enthalten.
   Aufruf: node tools/kaertchen/einstiegsmaterial_lf2.js [9 10 11 13] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'standalone', 'kla_logo.png')).toString('base64');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function sheets(n) { /* {Blattname: [deutscher Text, ...]} aus der Datendatei */
  const out = {}; let cur = null, inSol = false;
  for (const line of fs.readFileSync(path.join(__dirname, 'data', `LF2_M_${n}.txt`), 'utf8').split('\n')) {
    if (line.startsWith('solution:')) inSol = true;
    if (inSol) continue;
    if (line.startsWith('sheet:')) { cur = line.slice(6).split('|')[0].trim(); out[cur] = []; }
    else if (line.startsWith('de:') && cur) out[cur].push(line.slice(3).trim());
  }
  return out;
}
const fmt = t => { const k = t.indexOf(' // '); if (k < 0) return `<b>${esc(t)}</b>`; return `<b>${esc(t.slice(0, k))}</b> — ${esc(t.slice(k + 4))}`; };
const grid = (list, cols, rowH, small) => `<div class="grid" style="grid-template-columns:repeat(${cols},1fr);grid-auto-rows:${rowH}mm">${list.map(t => `<div class="c${small ? ' s' : ''}"><div>${fmt(t)}</div></div>`).join('')}</div>`;
const chunks = (a, k) => { const r = []; for (let i = 0; i < a.length; i += k) r.push(a.slice(i, i + k)); return r; };
const h2 = (t, brk) => `<h2${brk ? ' class="brk"' : ''}>${t}</h2>`;
const lead = t => `<p class="lead">${t}</p>`;
const table = rows => `<table><tr><th style="width:20%">Schritt</th><th>Was passiert</th><th style="width:11%">Zeit</th></tr>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`;
const merke = t => `<div class="box"><b>Merke:</b> ${t}</div>`;
const diff = t => `<div class="box blue"><b class="bt">Differenzierung nach oben</b>${t}</div>`;
const box = (title, body, blue) => `<div class="box${blue === false ? '' : ' blue'}"><b class="bt">${title}</b>${body}</div>`;
const head = (n) => `<table class="kopf"><tr><td class="kl"><div>Datum:</div><hr><div>Name:</div></td><td class="km"><b class="lf">Lernfeld 2</b><div class="lft">Verkaufsgespräche kundenorientiert führen</div><div class="mt"><b>Modul ${n} – Einstiegsmaterial</b></div></td><td class="kr"><img src="${LOGO}"></td></tr></table>`;

const MODS = {};

/* ---------------- Modul 9 ---------------- */
MODS[9] = () => {
  const s = sheets(9), merkm = s['Merkmalskarten'], sat = s['Satzkarten'], stufen = s['Stufenschilder'];
  return `${head(9)}<h1>Modul 9: Material für die Einstiege</h1>
<p class="sub">Für die Lehrkraft · zum Ausdrucken und Ausschneiden · Merkmal – Vorteil – Nutzen</p>
${box('Was Sie brauchen', `<p>Doppelstunde 1: zwei gleiche Kugelschreiber und eine Stoppuhr. Dazu den Abstimmungsbogen (Seite 3).</p>
<p>Doppelstunde 2: die zwanzig Merkmalskarten (Seiten 4 und 5) – Sie lesen vor, die Klasse ruft.</p>
<p>Doppelstunde 3: Kreppband für drei Stufen am Boden, die drei Stufenschilder (Seite 6) und die einundzwanzig Satzkarten (Seiten 7 und 8).</p>
<p>Jeder Einstieg dauert höchstens zehn Minuten.</p>`, false)}
${h2('Doppelstunde 1: „Verkauf mir diesen Stift“')}
${lead('Der Klassiker – und er funktioniert, weil die Klasse den Unterschied hört, bevor sie ihn benennen kann.')}
${table([
    ['1. Auftrag', 'Zwei Freiwillige gehen kurz vor die Tür. Der Rest bekommt den Abstimmungsbogen.', '1 Min.'],
    ['2. Runde 1', 'Person A kommt herein: „Sie haben 30 Sekunden. Verkaufen Sie mir diesen Kugelschreiber.“', '1 Min.'],
    ['3. Runde 2', 'Person B kommt herein, gleicher Auftrag, gleicher Stift.', '1 Min.'],
    ['4. Abstimmen', 'Die Klasse stimmt ab und trägt in den Bogen ein, welche Sätze überzeugt haben.', '3 Min.'],
    ['5. Sortieren', 'Sie schreiben die genannten Sätze in zwei Spalten an die Tafel – noch ohne Überschrift. Links alles, was der Stift hat. Rechts alles, was der Käufer davon hat.', '3 Min.'],
    ['6. Benennen', 'Erst jetzt die Überschriften: Warenmerkmal und Kundennutzen. Dazwischen fehlt noch eine Spalte – der Warenvorteil.', '1 Min.']])}
${merke('Fast immer gewinnt die Person, die gesagt hat, was der Stift dem Käufer bringt. Das ist der Kundennutzen – und nur der verkauft.')}
${h2('Doppelstunde 2: „Na und?“')}
${lead('Zwei Minuten Vorbereitung, große Wirkung: Die Klasse zwingt Sie mit einem einzigen Zuruf bis zum Kundennutzen.')}
${table([
    ['1. Spielregel', '„Ich sage etwas über eine Ware. Ihr ruft im Chor: Na und?“ Einmal üben.', '1 Min.'],
    ['2. Erste Runde', 'Sie lesen eine Merkmalskarte vor. Chor: „Na und?“ Sie antworten mit dem Vorteil. Chor: „Na und?“ Sie antworten mit dem Nutzen. Jetzt darf niemand mehr rufen.', '3 Min.'],
    ['3. Tauschen', 'Jetzt umgekehrt: Eine Schülerin zieht eine Karte, die Klasse ruft, sie muss zweimal antworten. Bei zwanzig Karten kommen viele Personen dran.', '4 Min.'],
    ['4. Regel', '„Woran habt ihr gemerkt, dass ihr nicht mehr rufen dürft?“ Antwort: Wenn im Satz steht, was der Kunde davon hat.', '2 Min.']])}
${merke('„Na und?“ ist die Prüffrage für jedes Verkaufsargument. Solange sie sich noch sinnvoll stellen lässt, ist man noch nicht beim Kundennutzen angekommen.')}
${h2('Doppelstunde 3: Die Nutzen-Treppe')}
${lead('Drei Stufen am Boden, einundzwanzig Satzkarten. Die Klasse sortiert im Stehen und merkt dabei, dass Vorteil und Nutzen leicht zu verwechseln sind.')}
${table([
    ['1. Aufbau', 'Drei Kreppbandstreifen hintereinander am Boden, davor die drei Stufenschilder.', 'vorher'],
    ['2. Ziehen', 'Jede Person zieht eine Satzkarte und liest sie still. Bei weniger als 21 Personen legen Sie eine Kette zur Seite oder spielen selbst mit.', '1 Min.'],
    ['3. Stellen', 'Alle stellen sich auf die Stufe, zu der ihre Karte gehört.', '3 Min.'],
    ['4. Prüfen', 'Reihum vorlesen. Wer glaubt, jemand steht falsch, sagt es. Umstellen ist erlaubt.', '4 Min.'],
    ['5. Ketten bilden', 'Zum Schluss suchen sich jeweils drei Personen, deren Karten zusammen eine vollständige Kette ergeben.', '2 Min.']])}
${diff('<p>Für eine sehr leistungsstarke Person: Sie bekommt drei Nutzen-Karten und den Auftrag, zu jeder zwei verschiedene Kunden zu erfinden, für die derselbe Warenvorteil einen unterschiedlichen Nutzen hat – und zu begründen, woher sie das im Gespräch wissen kann. Das ist genau der Punkt, an dem Bedarfsermittlung und Argumentation zusammengehören.</p>')}
<div class="pb"></div>
${h2('Doppelstunde 1: Abstimmungsbogen')}
${lead('Für jede Person ein Exemplar. Wird während der beiden 30-Sekunden-Runden ausgefüllt.')}
<table class="bogen"><tr><th style="width:34%"></th><th>Person A</th><th>Person B</th></tr>
<tr><td>Ein Satz, den ich mir gemerkt habe</td><td></td><td></td></tr>
<tr><td>Hat sie gesagt, was der Stift kann?</td><td></td><td></td></tr>
<tr><td>Hat sie gesagt, was ich davon habe?</td><td></td><td></td></tr>
<tr><td>Wer hat mich überzeugt? (ankreuzen)</td><td></td><td></td></tr></table>
<p class="bogenfrage">Der Satz, der mich am meisten überzeugt hat – im Wortlaut:</p><div class="lines"></div>
${box('Hinweis für Sie', '<p>Sagen Sie den beiden Freiwilligen vor der Tür nichts über Merkmale oder Nutzen – sonst ist der Effekt weg. Wenn beide nur Merkmale aufzählen, ist das kein Problem: Dann fragen Sie die Klasse „Und was hättet ihr hören wollen?“ und die Sätze kommen von dort.</p>')}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwanzig Merkmalskarten – Blatt 1')}
${grid(merkm.slice(0, 10), 2, 27)}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwanzig Merkmalskarten – Blatt 2')}
${grid(merkm.slice(10), 2, 27)}
${box('Zwei Beispielketten für Sie', '<p>Thermoskanne: hält zwölf Stunden warm → man muss unterwegs nichts nachkaufen → „Sie haben auf der ganzen Schicht heißen Kaffee, ohne zwischendurch loszulaufen.“</p><p>Kinderwagen: mit einer Hand zusammenklappbar → das andere Kind bleibt auf dem Arm → „Sie können Ihr Kind tragen und gleichzeitig den Wagen in den Kofferraum stellen.“</p>')}
<div class="pb"></div>
${h2('Doppelstunde 3: die drei Stufenschilder')}
${grid(stufen, 1, 40)}
${box('So erkennt die Klasse die Stufe', '<p>Stufe 1 enthält eine Zahl, ein Material oder ein Bauteil. Stufe 2 beginnt meist mit „dadurch ist …“ oder „damit lässt sich …“. Stufe 3 enthält das Wort „Sie“.</p><p>Das Wort „Sie“ ist der sicherste Test – und genau der, den die Klasse in der Prüfung braucht.</p>')}
<div class="pb"></div>
${h2('Doppelstunde 3: Satzkarten – Blatt 1')}
${grid(sat.slice(0, 12), 2, 27)}
<div class="pb"></div>
${h2('Doppelstunde 3: Satzkarten – Blatt 2')}
${grid(sat.slice(12), 2, 27)}
${box('Auflösung für Sie', '<p>Jede Dreiergruppe auf den Blättern gehört zusammen: erst das Merkmal, dann der Vorteil, dann der Nutzen. Sieben vollständige Ketten insgesamt (Jacke, Laptop, Matratze, Waschmaschine, Schrank, Brot, Powerbank).</p><p>Mischen Sie die Karten gut. Die Stolperstellen sind „Dadurch bleibt es länger frisch und ist bekömmlicher“ (klingt nach Nutzen, ist aber Vorteil – es fehlt das „Sie“) und „So steht er noch in zwanzig Jahren gerade in Ihrem Flur“ (klingt nach Merkmal wegen der Zahl, ist aber Nutzen).</p>')}`;
};

/* ---------------- Modul 10 ---------------- */
MODS[10] = () => {
  const s = sheets(10), preis = s['Preisschilder'], ware = s['Warenkarten'];
  return `${head(10)}<h1>Modul 10: Material für die Einstiege</h1>
<p class="sub">Für die Lehrkraft · zum Ausdrucken und Ausschneiden · Den Preis nennen</p>
${box('Was Sie brauchen', `<p>Doppelstunde 1: einen beliebigen Gegenstand aus Ihrer Tasche, die drei Preisschilder (Seite 4) und den Stimmungsbogen (Seite 3).</p>
<p>Doppelstunde 2: pro Zweiergruppe einen Taschenrechner und die zwanzig Warenkarten (Seiten 5 und 6).</p>
<p>Beide Einstiege dauern höchstens zehn Minuten.</p>`, false)}
${h2('Doppelstunde 1: Der nackte Preis')}
${lead('Drei Sekunden Stille reichen. Die Klasse fühlt den Preisschock am eigenen Leib und kann ihn danach beschreiben – das ist der ganze Einstieg.')}
${table([
    ['1. Nackt', 'Sie halten den Gegenstand hoch und sagen nur: „179 Euro.“ Dann schweigen Sie fünf Sekunden. Nicht lächeln, nichts erklären.', '1 Min.'],
    ['2. Nachfragen', '„Was ist gerade in euch passiert?“ Drei Antworten einsammeln. Meist: erschrocken, abgeschreckt, wieso so viel.', '3 Min.'],
    ['3. Verpackt', 'Jetzt noch einmal, mit Schild 2: erst ein Nutzen, dann der Preis, dann noch ein Nutzen. Wieder fragen: „Und jetzt?“', '3 Min.'],
    ['4. Vergleich', 'Sie schreiben beide Fassungen untereinander an die Tafel. „Derselbe Preis. Was ist der Unterschied?“', '2 Min.'],
    ['5. Benennen', 'Erst jetzt kommen die Wörter dazu: Preisschock und Sandwich-Methode.', '1 Min.']])}
${merke('Ein Preis ohne Nutzen davor und danach ist ein nackter Preis. Er löst einen Preisschock aus. Bei der Sandwich-Methode wird der Preis zwischen zwei Nutzenaussagen verpackt.')}
${h2('Doppelstunde 2: Cent pro Tag')}
${lead('Die Klasse rechnet selbst – und findet selbst die Stelle, an der die Rechnerei unehrlich wird. Genau diese Grenze ist der Lernertrag.')}
${table([
    ['1. Auftrag', 'Zweiergruppen ziehen eine Warenkarte (zwanzig Karten – bei mehr als zehn Gruppen werden Karten doppelt vergeben). „Rechnet den Preis auf ein Jahr, einen Monat und einen Tag herunter.“', '1 Min.'],
    ['2. Rechnen', 'Vier Minuten, Taschenrechner erlaubt. Die Ergebnisse kommen an die Tafel.', '4 Min.'],
    ['3. Staunen', '„Welche Zahl klingt am harmlosesten?“ Meist gewinnt die Kartoffelschälmaschine mit ein paar Cent am Tag.', '2 Min.'],
    ['4. Stolpern', 'Jetzt die Rückfrage: „Karte 7 ist ein Handy. Würdet ihr auch auf zehn Jahre rechnen? Warum nicht?“', '3 Min.'],
    ['5. Regel', 'Die Klasse formuliert selbst: Die Rechnung gilt nur so lange, wie der Kunde die Nutzungsdauer glaubt.', '2 Min.']])}
${merke('Die Verkleinerungsmethode – auch Divisionsmethode – rechnet den Preis auf eine kleine Zeiteinheit herunter. Sie wirkt nur, solange die zugrunde gelegte Nutzungsdauer glaubwürdig ist.')}
${diff('<p>Für eine sehr leistungsstarke Person: „Suche dir eine Ware aus und rechne einmal ehrlich und einmal unehrlich. Begründe, ab welcher Nutzungsdauer du selbst als Kunde misstrauisch würdest – und was der Verkäufer verliert, wenn der Kunde den Trick durchschaut.“</p>')}
<div class="pb"></div>
${h2('Doppelstunde 1: Stimmungsbogen')}
${lead('Wird zweimal ausgefüllt: einmal nach dem nackten Preis, einmal nach der verpackten Fassung.')}
<table class="bogen"><tr><th style="width:34%"></th><th>Fassung 1: nur der Preis</th><th>Fassung 2: verpackt</th></tr>
<tr><td>Mein erster Gedanke war …</td><td></td><td></td></tr>
<tr><td>Wie teuer wirkt die Ware? (1 = günstig, 5 = sehr teuer)</td><td></td><td></td></tr>
<tr><td>Möchte ich mehr hören?</td><td></td><td></td></tr>
<tr><td>Was hat mir gefehlt?</td><td></td><td></td></tr></table>
<p class="bogenfrage">Unser Satz zum Schluss: Ein Preis wirkt kleiner, wenn …</p><div class="lines"></div>
<div class="pb"></div>
${h2('Doppelstunde 1: die drei Preisschilder')}
${grid(preis, 1, 42, true)}
${box('Hinweis zu Schild 3', '<p>Schild 3 ist der Streitfall. Lassen Sie die Klasse abstimmen: Ist das geschickt oder ausweichend? Beide Antworten sind richtig – die Verzögerung darf nur kurz sein, sonst fühlt sich der Kunde hingehalten. Damit ist der Unterschied zwischen Verzögerungsmethode und Ausweichen geklärt.</p>')}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwanzig Warenkarten – Blatt 1')}
${grid(ware.slice(0, 10), 2, 27)}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwanzig Warenkarten – Blatt 2')}
${grid(ware.slice(10), 2, 27)}
<table class="raster"><tr><th>Karte</th><th>Preis</th><th>pro Jahr</th><th>pro Monat</th><th>pro Tag</th></tr>${'<tr><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(4)}</table>
${box('Auflösung für Sie', `<p>Karte 1: 69 € im Jahr · 5,75 € im Monat · rund 19 Cent pro Nacht. Karte 5: rund 50 € im Jahr · 4,16 € im Monat · 14 Cent am Tag. Karte 7: rund 300 € im Jahr · 25 € im Monat · 82 Cent am Tag. Karte 9: rund 10 € im Jahr · 82 Cent im Monat · 3 Cent am Tag. Karte 20: rund 13 € im Jahr · 1,11 € im Monat · 4 Cent am Tag.</p>
<p>Karte 7 ist die Stolperstelle: Bei einem Handy sind zehn Jahre nicht glaubwürdig, und bei drei Jahren bleibt die Zahl groß. Genau daran merkt die Klasse, dass die Methode Grenzen hat.</p>
<p>Karte 6 ist die zweite Stolperstelle: Ein Kind wächst aus dem Rad heraus – die Nutzungsdauer bestimmt hier das Kind, nicht die Ware. Bei Karte 14 (Sportschuhe, zwei Jahre) bleibt der Tagespreis ebenfalls hoch.</p>`)}`;
};

/* ---------------- Modul 11 ---------------- */
MODS[11] = () => {
  const s = sheets(11), ecken = s['Eckenschilder'], kund = s['Kundensätze'], meth = s['Methodenkarten'], einw = s['Einwandkarten'];
  return `${head(11)}<h1>Modul 11: Material für die Einstiege</h1>
<p class="sub">Für die Lehrkraft · zum Ausdrucken und Ausschneiden · Kundeneinwände</p>
${box('Was Sie brauchen', `<p>Doppelstunde 1: eine beliebige Ware aus Ihrer Tasche und vier Tafelspalten. Sonst nichts.</p>
<p>Doppelstunde 2: zwei Schilder „Echter Einwand“ und „Vorwand“ (Seite 3) sowie die zwanzig Kundensätze (Seiten 3 und 4).</p>
<p>Doppelstunde 3: die fünf Methodenkarten (Seite 5) und die zwanzig Einwandkarten (Seiten 6 und 7), für den Innen- und Außenkreis.</p>
<p>Jeder Einstieg dauert höchstens zehn Minuten.</p>`, false)}
${h2('Doppelstunde 1: Der Einwand-Hagel')}
${lead('Sie stellen sich vorn hin und lassen sich zwei Minuten lang beschießen. Danach stehen die vier Arten von Einwänden an der Tafel – gesammelt von der Klasse, nicht von Ihnen.')}
${table([
    ['1. Ansage', '„Ich verkaufe euch gleich diesen Gegenstand. Eure Aufgabe: Findet alles, was dagegen spricht. Ruft es mir zu.“', '1 Min.'],
    ['2. Hagel', 'Zwei Minuten. Sie halten die Ware hoch und sagen zwei Sätze dazu. Die Klasse ruft. Jemand schreibt an der Tafel mit.', '2 Min.'],
    ['3. Sortieren', 'Vier Spalten an der Tafel, noch ohne Überschrift. Sie sortieren die Zurufe ein, die Klasse rät jeweils mit, wohin.', '3 Min.'],
    ['4. Benennen', 'Erst jetzt die Überschriften: Ware · Preis-Leistungs-Verhältnis · Geschäft · Personal.', '2 Min.'],
    ['5. Umdeuten', 'Die entscheidende Frage: „War das eben schlimm für mich – oder hilfreich?“ Antwort: hilfreich. Jetzt weiß ich, wo ich ansetzen muss.', '2 Min.']])}
${merke('Ein Kundeneinwand zeigt, dass der Kunde an der Ware interessiert ist. Er sagt der Verkäuferin außerdem, an welcher Stelle sie mit ihrer Argumentation ansetzen muss. Ein Einwand ist eine Chance für den Verkauf.')}
${h2('Doppelstunde 2: Echt oder vorgeschoben?')}
${lead('Zwanzig Sätze, zwei Ecken – und ein paar Sätze, bei denen sich die Klasse nicht einig wird. Der Streit ist beabsichtigt.')}
${table([
    ['1. Ecken', 'Zwei Schilder in zwei Ecken des Raums.', 'vorher'],
    ['2. Sätze', 'Jede Person zieht einen Kundensatz, liest ihn laut vor und geht in eine Ecke. Jede Karte gibt es nur einmal.', '5 Min.'],
    ['3. Begründen', 'Bei jedem dritten Satz fragen Sie nach: „Woran hast du das erkannt?“', '—'],
    ['4. Regel', '„Was haben alle Vorwände gemeinsam?“ Antwort: Sie sagen nichts über die Ware aus.', '3 Min.'],
    ['5. Folge', '„Und was mache ich bei einem Vorwand?“ Nicht weiter argumentieren, sondern freundlich verabschieden.', '2 Min.']])}
${merke('Ein echter Einwand kritisiert etwas an der Ware, am Preis, am Geschäft oder am Personal. Ein Vorwand schiebt einen äußeren Grund vor, damit der Kunde das Geschäft ohne Gesichtsverlust verlassen kann.')}
${h2('Doppelstunde 3: Das Einwand-Karussell')}
${lead('Innen- und Außenkreis, fünf Runden, in jeder Runde eine andere Methode. Am Ende hat jede Person alle fünf Methoden einmal selbst gesprochen.')}
${table([
    ['1. Kreise', 'Innenkreis sind Verkäufer, Außenkreis sind Kunden. Jeder Kunde zieht eine Einwandkarte (zwanzig verschiedene Karten).', '1 Min.'],
    ['2. Methode', 'Sie halten eine Methodenkarte hoch. Alle Verkäufer müssen mit dieser Methode antworten.', '—'],
    ['3. Runde', 'Der Kunde liest seinen Einwand vor, der Verkäufer antwortet. Eine Minute.', 'je 1 Min.'],
    ['4. Weiterrücken', 'Außenkreis rückt einen Platz weiter, Sie zeigen die nächste Methodenkarte. Fünf Runden insgesamt.', '5 Min.'],
    ['5. Auswerten', '„Welche Methode war am schwersten?“ Fast immer die Umkehr-Methode – und genau die lohnt sich im Arbeitsblatt.', '3 Min.']])}
${diff('<p>Für eine sehr leistungsstarke Person: Sie bleibt in der Verkäuferrolle und bekommt den Zusatzauftrag, in jeder Runde die zugerufene Methode anzuwenden, ohne das Wort „aber“ zu benutzen. Danach erklärt sie der Klasse, mit welchen Wörtern sie „aber“ ersetzt hat – allerdings, jedoch, gleichzeitig, dafür. Das ist genau die Formulierungsarbeit, die in der mündlichen Prüfung verlangt wird.</p>')}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwei Eckenschilder')}
${grid(ecken, 2, 30, true)}
${h2('Doppelstunde 2: die zwanzig Kundensätze – Blatt 1')}
${grid(kund.slice(0, 10), 2, 25)}
<div class="pb"></div>
${h2('Doppelstunde 2: die zwanzig Kundensätze – Blatt 2')}
${grid(kund.slice(10), 2, 25)}
${box('Auflösung für Sie', '<p>Echte Einwände: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 – sie nennen jeweils einen Grund, der in der Ware, im Preis, im Geschäft oder im Personal liegt.</p><p>Vorwände: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 – kein Wort über die Ware.</p><p>Strittig wird es meist bei Satz 2 (manche Kunden müssen wirklich Rücksprache halten) und bei Satz 12 (das kann auch ein echter, nur unausgesprochener Einwand sein). Genau dort setzen Sie die Gegenfrage-Methode an: „Was müsste denn anders sein?“</p>')}
<div class="pb"></div>
${h2('Doppelstunde 3: die fünf Methodenkarten')}
${grid(meth, 1, 36, true)}
<div class="pb"></div>
${h2('Doppelstunde 3: die zwanzig Einwandkarten – Blatt 1')}
${grid(einw.slice(0, 10), 2, 25)}
<div class="pb"></div>
${h2('Doppelstunde 3: die zwanzig Einwandkarten – Blatt 2')}
${grid(einw.slice(10), 2, 25)}
${box('Welche Karte zu welcher Methode besonders gut passt', '<p>Umkehr: Karten 2, 5, 9, 12, 20 – der genannte Nachteil ist zugleich der Vorteil (klein = handlich, wenige Fächer = leicht, hart = stützend, schwer = stabil, groß = viel Platz).</p><p>Gegenfrage: Karten 4, 11, 13, 14 – der Einwand ist zu unbestimmt, um ihn zu entkräften.</p><p>Vergleich: Karten 6, 7, 15 – zwei Waren nebeneinanderlegen und den Unterschied zeigen.</p><p>Ja-Aber: Karten 1, 3, 10, 18, 19 – zustimmen und den eigenen Nutzen dagegensetzen.</p><p>Preiseinwand: Karten 8, 16, 17 – als letztes Mittel, wenn alle Argumente genannt sind.</p>')}`;
};


/* ---------------- Modul 13 ---------------- */
MODS[13] = () => {
  const ware = sheets(13)['Warenkarten'];
  return `${head(13)}<h1>Modul 13: Material für die Einstiege</h1>
<p class="sub">Für die Lehrkraft · zum Ausdrucken und Ausschneiden · Ergänzung, Zusatz, Alternative</p>
${box('Was Sie brauchen', `<p>Doppelstunde 1: eine Taschenlampe ohne Batterien (oder etwas Vergleichbares: ein Füller ohne Patrone, ein Drucker ohne Papier) und die vierundzwanzig Warenkarten (Seiten 3 und 4).</p>
<p>Doppelstunde 2: die beiden Rollenskripte (Seite 5) für zwei Paare von Freiwilligen.</p>
<p>Beide Einstiege dauern höchstens zehn Minuten.</p>`, false)}
${h2('Doppelstunde 1: „Was fehlt noch?“')}
${lead('Eine Taschenlampe, die nicht leuchtet – und die Klasse hat den Unterschied zwischen „notwendig“ und „nur schöner“ in drei Minuten selbst gefunden.')}
${table([
    ['1. Verkauf', 'Sie verkaufen der Klasse die Taschenlampe mit zwei guten Argumenten. Dann drücken Sie den Schalter. Nichts passiert.', '2 Min.'],
    ['2. Fragen', '„Was ist mein Fehler gewesen?“ Die Klasse kommt sofort auf die Batterien.', '1 Min.'],
    ['3. Zweite Runde', '„Und was hätte ich noch anbieten können, das nicht notwendig ist, aber die Lampe besser macht?“ Antworten: Gürteltasche, Handschlaufe, Ersatzbirne.', '2 Min.'],
    ['4. Trennen', 'Zwei Spalten an der Tafel, noch ohne Überschrift: links alles, ohne das die Ware nicht funktioniert, rechts alles Übrige.', '2 Min.'],
    ['5. Benennen', 'Erst jetzt die Überschriften: Ergänzungsangebot und Zusatzangebot.', '1 Min.']])}
${merke('Ergänzungsartikel sind für die Nutzung der Hauptware notwendig – sie müssen immer angeboten werden. Zusatzartikel erhöhen nur den Nutzen.')}
${box('Der Satz, der hängen bleibt', '<p>„Wer die Batterie vergisst, verkauft eine Taschenlampe, die zu Hause nicht leuchtet. Der Kunde ist enttäuscht – und die Batterie kauft er trotzdem, nur woanders.“</p>')}
${h2('Doppelstunde 2: „Leider nicht da“')}
${lead('Zweimal dieselbe Lücke im Sortiment, zweimal ein anderer Satz. Die Klasse hört den Unterschied, ohne dass Sie ihn erklären müssen.')}
${table([
    ['1. Szene A', 'Zwei Freiwillige spielen Skript A vor der Klasse – mit den verbotenen Sätzen.', '2 Min.'],
    ['2. Notieren', 'Die Klasse notiert einen Satz, bei dem sie als Kundin aus dem Gespräch ausgestiegen wäre.', '1 Min.'],
    ['3. Szene B', 'Zwei andere Freiwillige spielen Skript B – gleiche Situation, geschickte Sätze.', '2 Min.'],
    ['4. Vergleich', '„Was war anders?“ Die Klasse findet: In Szene A hört man zuerst, was fehlt. In Szene B hört man zuerst, was da ist.', '3 Min.'],
    ['5. Regel', 'An die Tafel: Nie damit beginnen, was man nicht hat.', '2 Min.']])}
${merke('Ein Alternativangebot darf nur gemacht werden, wenn die Alternativware den gleichen oder einen höheren Standard hat. Sätze wie „Das führen wir leider nicht“ setzen das eigene Sortiment herab.')}
<div class="pb"></div>
${h2('Doppelstunde 1: die vierundzwanzig Warenkarten – Blatt 1')}
${lead('Zum Sortieren in Gruppen oder im Plenum: Welche Karte ist ein Ergänzungsartikel, welche ein Zusatzartikel? Die Hauptware steht jeweils dabei. Vierundzwanzig Karten – eine pro Person.')}
${grid(ware.slice(0, 12), 2, 27)}
<div class="pb"></div>
${h2('Doppelstunde 1: die vierundzwanzig Warenkarten – Blatt 2')}
${grid(ware.slice(12), 2, 27)}
${box('Auflösung für Sie', `<p>Ergänzungsartikel (notwendig): Batterien (Funkwecker), Blasebalg, Patronen, Ladekabel, Betriebssystem, Leuchtmittel, Druckerpatrone, Batterien (Taschenlampe), Akku, Filtertüten.</p>
<p>Zusatzartikel (erhöhen den Nutzen): Reisetasche, Sitzkissen, Ledermäppchen, Schutzhülle, Mauspad, LED-Dimmer, Hemd/Krawatte/Gürtel, Fotopapier, Perlenclips, Gürteltasche, Stativ, Tassenset.</p>
<p>Karten ohne Zubehör („nichts, funktioniert allein“): Anzug, Perlenkette.</p>
<p>Der LED-Dimmer ist der Streitfall: Das Lehrbuch führt ihn beim Ergänzungsangebot – begründbar ist beides. Lassen Sie die Klasse darüber streiten, das schärft die Definition: Notwendig ist, was ohne die Ware nicht nutzbar macht.</p>`)}
<div class="pb"></div>
${h2('Doppelstunde 2: Skript A – so nicht')}
<div class="grid" style="grid-template-columns:1fr;grid-auto-rows:48mm"><div class="c"><div><b>SKRIPT A</b> — Kundin: „Ich suche eine Regenjacke von Schöffel.“ · Verkäufer: „Schöffel führen wir leider nicht.“ · Kundin: „Ach so. Und sonst?“ · Verkäufer: „Da kann ich Ihnen höchstens noch die von Berghaus anbieten, die ist auch ganz gut. Kostet aber 189 Euro.“ · Kundin: „Hm. Ich schau mich noch mal um.“ · Verkäufer: „Ja, machen Sie das.“</div></div></div>
${h2('Doppelstunde 2: Skript B – so besser')}
<div class="grid" style="grid-template-columns:1fr;grid-auto-rows:55mm"><div class="c"><div><b>SKRIPT B</b> — Kundin: „Ich suche eine Regenjacke von Schöffel.“ · Verkäuferin: „Für Regenjacken haben wir uns für den Hersteller Berghaus entschieden. Probieren Sie doch einmal dieses Modell – es hat verschweißte Nähte und eine Kapuze mit Schirm.“ · Kundin: „Und die hält wirklich dicht?“ · Verkäuferin: „Der Artikel hat für Sie den Vorteil, dass Sie auch bei Seitenregen trocken bleiben. Sie kostet 189 Euro – und Sie haben fünf Jahre Garantie auf die Membran.“ · Kundin: „Die probiere ich mal an.“</div></div></div>
${box('Worauf Sie in der Auswertung zeigen', `<p>Skript A beginnt mit dem Wort „leider“ und dem, was fehlt. Danach kommen „höchstens“, „auch ganz gut“ und „kostet aber“ – vier Abwertungen in zwei Sätzen.</p>
<p>Skript B nennt die fehlende Marke gar nicht, sondern sofort die eigene Entscheidung. Der Preis steht in der Mitte zwischen zwei Nutzen – das ist die Sandwich-Methode aus Modul 10.</p>
<p>Fragen Sie am Ende: „Welchen einzigen Satz aus Skript A müsste man ändern, damit das Gespräch nicht kippt?“ Meist wird der erste genannt – und das ist richtig.</p>`)}`;
};

const CSS = `
@page{size:A4;margin:14mm 18mm 18mm 18mm}
*{box-sizing:border-box}
body{font-family:'Liberation Sans',Arial,sans-serif;font-size:10pt;line-height:1.35;color:#000;margin:0}
table{border-collapse:collapse;width:100%}
table.kopf{border:1px solid #000;margin-bottom:6mm}
.kopf td{vertical-align:middle;padding:2mm 3mm}
.kopf .kl{width:29%;border-right:1px solid #000;font-size:9.5pt}.kopf .kl hr{border:0;border-top:1px solid #000;margin:1mm 0 6mm 0}
.kopf .km{text-align:center;border-right:1px solid #000}.kopf .lf{font-size:11pt}.kopf .lft{font-size:9.5pt;border-bottom:1px solid #000;padding:0 0 1.5mm;margin:1mm 0 4mm}
.kopf .mt{font-size:10.5pt}.kopf .kr{width:20%;text-align:center}.kopf img{height:20mm}
h1{font-size:18pt;color:#1f4e79;margin:6mm 0 1.5mm;border-bottom:1px solid #8db3e2;padding-bottom:1mm}
h2{font-size:12.5pt;color:#1f4e79;margin:8mm 0 1.5mm;border-bottom:1px solid #8db3e2;padding-bottom:1mm;page-break-after:avoid}
.sub{color:#666;font-size:8.8pt;margin:0 0 4mm}
.lead{color:#555;font-style:italic;margin:0 0 3mm}
table:not(.kopf):not(.bogen):not(.raster){margin-bottom:5mm}
th{background:#e6b8b7;text-align:left;padding:2mm 2.5mm;font-size:9pt;border:1px solid #bbb}
td{border:1px solid #bbb;padding:2mm 2.5mm;vertical-align:top;font-size:9pt}
tr{page-break-inside:avoid}
.box{background:#f2f2f2;border:1px solid #d0d0d0;border-left:3px solid #bbb;padding:2.5mm 4mm;margin:5mm 0;font-size:9.5pt;page-break-inside:avoid}
.box.blue{background:#dbe5f1;border-color:#b8cce4;border-left-color:#8db3e2;font-size:8.8pt}
.box p{margin:1mm 0}.box .bt{display:block;color:#1f4e79;font-size:9pt;margin-bottom:1mm}
.pb{page-break-after:always;height:0}
.grid{display:grid;border-top:.5pt dashed #777;border-left:.5pt dashed #777;margin:2mm 0 4mm}
.c{border-right:.5pt dashed #777;border-bottom:.5pt dashed #777;display:flex;align-items:center;justify-content:center;text-align:center;padding:2mm 4mm;font-size:9pt}
.c.s{font-size:9.5pt}.c b{font-weight:700}
table.bogen{margin:3mm 0}.bogen th{background:#e6b8b7}.bogen td{height:18mm}.bogen td:first-child{background:#fafafa;font-weight:700}
.bogenfrage{font-weight:700;margin:6mm 0 2mm}.lines{height:22mm;border-bottom:1px solid #999;background:repeating-linear-gradient(transparent 0 7.5mm,#999 7.5mm calc(7.5mm + .5pt))}
table.raster{margin:5mm 0}.raster td{height:8mm}.raster th{background:#e6b8b7}
`;

async function main() {
  const want = process.argv.slice(2).map(Number); const mods = want.length ? want : [9, 10, 11, 13];
  const browser = await chromium.launch();
  for (const n of mods) {
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${MODS[n]()}</body></html>`);
    const out = path.join(ROOT, `LF2_M_${n}_Einstiegsmaterial.pdf`);
    await page.pdf({
      path: out, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font-family:'Liberation Sans',Arial,sans-serif;font-size:7.5pt;color:#666;text-align:right;padding-right:18mm"><span>LF 2 · Modul ${n} · Einstiegsmaterial &nbsp;</span><span style="font-size:11pt;color:#000"><span class="pageNumber"></span></span> / <span style="font-size:11pt;color:#000" class="totalPages"></span></div>`,
      margin: { top: '14mm', bottom: '18mm', left: '18mm', right: '18mm' },
    });
    await page.close(); console.log('geschrieben:', path.basename(out));
  }
  await browser.close();
}
main();
