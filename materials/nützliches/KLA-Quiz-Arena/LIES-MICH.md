# KLA Quiz-Arena – Eintrag für den Stundenplan (Reiter „Lernstoff“, Bereich „nützliches“)

Dieser Ordner ist fertig zum Verlinken. Er enthält:

- `index.html` – die Quiz-Arena (eine einzige Datei, braucht kein Build). Öffnet auf der Startseite die Tafel für den Beamer.
- `Quizze/LF2 Modul 6 - Fragetechnik.json` – Quiz zu LF 2, Modul 6 „Fragetechnik“ (21 Fragen, Deutsch + Arabisch, Türkisch, Vietnamesisch, zwei PROFI-Fragen und ein PROFI-Brainstorming).

## So verlinken
1. Den ganzen Ordner `KLA-Quiz-Arena` so wie er ist nach `materials/nützliches/` kopieren (Pfad relativ zur `index.html` des Stundenplans: `materials/nützliches/KLA-Quiz-Arena/index.html`). Die Ordnerstruktur nicht ändern.
2. Im Reiter „Lernstoff“ im Bereich „nützliches“ Einträge anlegen, jeweils im neuen Tab öffnen (`target="_blank"`):
   - **Direktlink zum Quiz** (öffnet die Arena und die Lobby mit QR-Code sofort):
     `materials/nützliches/KLA-Quiz-Arena/index.html?quiz=Quizze/LF2%20Modul%206%20-%20Fragetechnik.json`
     Titel: `Quiz-Arena: LF 2 Modul 6 Fragetechnik (Live-Quiz)`
   - **Arena-Startseite** (eigenes Quiz wählen oder importieren):
     `materials/nützliches/KLA-Quiz-Arena/index.html`
     Titel: `KLA Quiz-Arena (Live-Quiz wie Kahoot)`
3. Diese Einträge sind für die Lehrkraft (Beamer), nicht für Schüler. Schüler kommen über den QR-Code auf der Tafel.
4. Der Parameter `?quiz=` nimmt einen Pfad relativ zur `index.html`. Leerzeichen als `%20` schreiben. Er funktioniert nur über die Webseite (GitHub Pages), nicht beim Öffnen der Datei von der Festplatte.

## So wird gespielt
- Mit Direktlink: Seite öffnet sich, das Quiz wird geladen, die Lobby mit QR-Code erscheint. Dann „Start“.
- Ohne Direktlink: Startseite → „Quiz importieren (.json)“ → Datei aus `Quizze/` wählen → „Spielen“. Das Quiz bleibt danach im Browser gespeichert (localStorage, pro Gerät).

## Weitere Quizze
Neue `.json`-Dateien einfach in `Quizze/` legen und im Stundenplan als weiteren Direktlink (`?quiz=Quizze/<Dateiname>`) eintragen. Namensschema: `LFx Modul y - Thema.json`.

## Hinweise
- Keine Schülerdaten werden gespeichert; die Live-Verbindung läuft über öffentliche MQTT-Broker (hivemq, emqx).
- Die Datei `index.html` nicht umbenennen und nicht in mehrere Dateien aufteilen.
