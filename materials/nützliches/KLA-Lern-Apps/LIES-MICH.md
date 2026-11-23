# KLA Lern-Apps (Reiter „Lernstoff“, Kachel „Nützliches“)

- `index.html` – die Lern-Apps-Startseite (eine einzige Datei, kein Build).
- `Apps/katalog.json` – Liste der Apps; neue App: `.json` in `Apps/` legen und in `katalog.json` eintragen.
- Enthalten: LF 2 M 7 Bedarfsermittlung, LF 4 M 1 Verkaufsraum, LF 4 M 2 Mit allen Sinnen.

## Einstellungen für Schüler (Lehrkraft)
Auf der Startseite bei jeder App **⚙ Einstellungen & Link**:
- Haken pro Aufgabe: einzelne Aufgaben (Ecken-Sortierer, Paare, Falsch-Finder, Quiz …) für die Schüler ein- oder ausschalten.
- „Schüler dürfen Aufgaben überspringen“: dann erscheint bei jeder Aufgabe ein Knopf „Überspringen (keine Punkte)“. Punkte der übersprungenen Aufgabe verfallen.
- Die Einstellung steckt im Link (`aus=2,4&skip=1`) und im QR-Code der Tafel. „Tafel starten“ und „Üben“ benutzen die zuletzt gespeicherte Einstellung (pro Gerät, localStorage).

Live-Modus und Rangliste funktionieren nur über die Webseite (GitHub Pages).
