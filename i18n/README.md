# Mehrsprachigkeit (Türkisch, Arabisch, Vietnamesisch, Russisch, Spanisch, Tigrinya, Portugiesisch, Ukrainisch)

Auf jeder eingebundenen Seite gibt es unten rechts den Knopf **🌐 Sprache**. Dort wählt man die Sprache (Name in der jeweiligen Landessprache) und die Anzeige:

- **Antippen / Maus**: Sprechblase mit Übersetzung (Maus darüber, Tipp am Handy, Tab-Taste/Fokus). Erneut tippen oder `Esc` schließt sie.
- **Darunter**: Die Übersetzung steht in kleiner grauer Schrift unter dem deutschen Text. Wird mitgedruckt.
- **Deutsch** (Standard) = alles aus.

Sprache und Anzeige werden im Browser gemerkt und gelten auf allen Seiten. Per Link vorgeben (z. B. als QR-Code):

    …/materials/LF4_M_1_Selbsttest.html?lang=ar&mode=under
    lang = tr | ar | vi | ru | es | ti | pt | uk | de        mode = hover | under

## Wie es funktioniert
Die Seite selbst bleibt unverändert, sie bekommt nur **eine Zeile** vor `</body>`:
`<script src="../i18n/i18n.js" defer></script>` (Seiten im Hauptordner: `i18n/i18n.js`).
Das Skript liest die sichtbaren deutschen Textblöcke (auch die von JavaScript erzeugten), bildet aus jedem Text eine feste ID (Prüfsumme) und holt die Übersetzung aus:

- `i18n/common/<sprache>.json` – Texte, die auf vielen Seiten gleich sind (z. B. „Auswerten“, „Teil 1: Multiple Choice“)
- `i18n/pages/<seitenname>/<sprache>.json` – Texte nur dieser Seite
- `i18n/pages/<seitenname>/de.json` – die deutschen Originaltexte (Quelle für Übersetzer/Prüfskript)
- `i18n/pages/<seitenname>/config.json` – Sonderfälle (wechselnde Zahlen, Wortlisten in Zufallsreihenfolge)
- `i18n/pages/<seitenname>/steps.json` – Klickfolge, damit auch Texte aus dem Ergebnisbildschirm erfasst werden
- `i18n/glossary.json` – zentrales Glossar der Fachbegriffe (deutscher Begriff steht in Klammern)

Ändert sich ein deutscher Satz, ändert sich seine ID – die alte Übersetzung wird dann nicht mehr angezeigt und vom Prüfskript als „verwaist/fehlend“ gemeldet. So kann nie eine veraltete Übersetzung zu neuem Deutsch angezeigt werden.
Es werden keine Server, keine Übersetzungsdienste und keine Tracker benutzt. Schriften (Noto Sans Ethiopic/Arabic) liegen lokal in `i18n/fonts/`.
Hinweis: Die Übersetzungen werden per `fetch` geladen – das funktioniert auf GitHub Pages oder mit einem lokalen Server, **nicht** beim Doppelklick auf die Datei (`file://`).

## Neue Seite hinzufügen
1. Zeile `<script src="../i18n/i18n.js" defer></script>` vor `</body>` einfügen.
2. Deutsche Texte auslesen: `node tools/i18n/i18n_tool.js extract materials/MeineSeite.html`
   (Bei Tests mit Ergebnisbildschirm vorher `steps.json` anlegen – Beispiel: `pages/LF4_M_1_Selbsttest/`.)
3. Fehlende Übersetzungen auflisten: `node tools/i18n/i18n_tool.js missing --out fehlt.json`
4. Übersetzen lassen (Regeln unten), Ergebnis in `pages/<seite>/<sprache>.json` speichern.
5. Prüfen: `node tools/i18n/i18n_tool.js check` (vor jedem Commit; `--live` liest zusätzlich die Seiten neu ein und meldet geänderte deutsche Texte).
6. Texte, die auf mehreren Seiten vorkommen, nach `common` verschieben: `node tools/i18n/i18n_tool.js promote --min 3`

## Spiele, Trainer und Escape Rooms (Texte aus JavaScript)
- `node tools/i18n/i18n_tool.js extract --explore --harvest <seite.html>` klickt das Spiel automatisch durch und liest zusätzlich alle deutschen Texte aus dem Programmcode.
- `node tools/i18n/i18n_tool.js coverage --lang ar <seite.html>` spielt die Seite in einer Sprache durch und listet alle angezeigten Texte, die noch **keine** Übersetzung haben.
- Sonderfälle pro Seite stehen in `pages/<seite>/`:
  `config.json` (`numeric` wechselnde Zahlen · `force` Einzelteile · `skip` ignorieren · `bag` Wortlisten · `prefix` Satzanfänge wie „Richtig!“ · `split` Trennzeichen wie „ · “ und „ = “),
  `steps.json` (Klickfolge), `extra.txt` (zusätzliche Texte), `ignore.txt` (Texte, die nie übersetzt werden sollen).
- Texte mit wechselnden Zahlen werden automatisch zu Vorlagen: „Punkte: 150“ wird zu „Punkte: {1}“. Die Zahl wird beim Anzeigen wieder eingesetzt.

## Übersetzungsregeln
Einfache, kurze Sätze. Fachbegriffe aus dem Glossar übersetzen und den deutschen Begriff in Klammern dahinter setzen („Einkaufspreis (Bezugspreis)“). Nicht übersetzen: Zahlen, Formeln, Eigennamen, Dateinamen, Marken, wörtlich zitierte IHK-Prüfungsfragen. Platzhalter `{1}` und Lücken `___` bleiben erhalten, Zahlen immer mit 0–9. Lösungen/Antwortoptionen werden nur 1:1 übersetzt, nie ergänzt. **Das Deutsche gilt.**

## Qualitätshinweis
Alle Übersetzungen sind **maschinell erstellt** und noch **nicht** von Muttersprachlerinnen/Muttersprachlern geprüft. Besonders bei **Tigrinya (Ge'ez-Schrift)** sollte eine Muttersprachlerin/ein Muttersprachler die Texte und das Glossar prüfen. Auch bei Arabisch, Vietnamesisch, Ukrainisch und Türkisch ist eine Stichprobe durch Muttersprachler empfehlenswert, vor allem bei Fachbegriffen.

## Große Spiele: bewusst nur teilweise übersetzt
Bei „Das Erdbeer-Imperium“ (LF 4) und „Countdown Hafenstraße“ (LF 5) sind Bedienung, Menüs, Anleitungen, Erfolge und Einstiegsseiten übersetzt. Die einzelnen Spielszenen, Aufgaben und Gästebeschreibungen bleiben deutsch (rund 1.000 bzw. 1.400 Textblöcke). Die Liste, was noch fehlt, liefert `coverage`.
