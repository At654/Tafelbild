# KLA Lern-Apps

Kleine Lern-Apps je Modul – wie LearningApps, aber im KLA-Design, mehrsprachig,
mit QR-Login, eigenem Tempo und Podium auf dem Smartboard.

## Was drin ist
- `index.html` – die ganze Plattform (eine Datei, kein Build). Startseite = Bibliothek.
- `Apps/` – eine `.json` je Lern-App. Neue Apps hier ablegen.
- `Apps/katalog.json` – Liste der Apps, die in der Bibliothek erscheinen.

## Die sieben Bausteine
| Typ | Was die Schüler tun |
|---|---|
| `info` | Merkkarte lesen |
| `sortier` | Karte in die richtige Ecke tippen (Ecken-Sortierer) |
| `paare` | zwei Karten antippen, die zusammengehören |
| `fehler` | alle falschen Aussagen antippen (Falsch-Finder) |
| `reihenfolge` | Schritte in die richtige Reihenfolge bringen |
| `luecke` | Lückentext mit Wortpool füllen |
| `quiz` | Multiple Choice, auch mehrere richtige Antworten |

Bilder: statt eines Emojis kann jede Karte `"g":"<name>"` bekommen – dann wird eine eigene
Grafik gezeichnet (brot, schinken, zeitung, kopfhoerer, kleid, jeans, schuhe, drucker, handy,
geschenk, kaffee, kaese, palette, preisplakat, neonlicht, deckenlicht, spot, lichtband, regal,
schuhwand, kasse, einkaufswagen, sofa, gartenmoebel, verkaeuferin, gang, musik, durchsage, duft,
parfuem, wein, stoff, teppich, bildschirm, dekoinsel, farbe, laden, handtasche, kaffeemaschine,
broetchen, sprechblase).

Jede Aufgabe kann eine `profi`-Frage haben: Die kommt nur, wenn der Schüler
am Anfang „Profi" wählt (Basis = ohne Begründungsfragen).

## Tafel-Optionen (in der Lobby)
- **👤 Einzeln / 👥 Teams** – im Teammodus wählen die Schüler am Handy eine Farbe (Rot, Blau, Gelb,
  Grün, Violett, Türkis). Die Tafel zeigt die Teamwertung (Summe der Punkte) und darunter die Einzelliste.
- **Sprint: aus / 5 / 10 / 15 Min** – Countdown läuft auf der Tafel und auf jedem Handy mit.
  Bei 0 ist Schluss und das Podium erscheint automatisch.

## Live-Ergebnis und Fehler-Hitliste
Rechts auf der Tafel steht je Aufgabe, wie viele fertig sind und wie viele es ohne Fehler geschafft
haben, mit Prozentbalken. Aufgaben, bei denen 40 % oder mehr Fehler gemacht haben, werden rot
markiert (🔥) und unten als „Das besprechen wir gleich" zusammengefasst. Die Liste bleibt auf dem
Podium stehen – praktisch fürs Auswerten.

## So läuft eine Stunde
1. In der Bibliothek bei der App auf **▶ Tafel starten** – am Beamer erscheinen QR-Code und Code.
2. Schüler scannen, wählen Sprache, Name, Tier und Basis/Profi.
3. **Starten** drücken. Alle arbeiten im eigenen Tempo; vorne wachsen die Balken,
   jeder sieht auf dem Handy seinen Platz.
4. Am Ende **Podium zeigen** – Top 3 mit Konfetti, darunter die Rangliste, dazu der Merksatz.

**👤 Üben** öffnet dieselbe App ohne Tafel – der Link passt für itslearning oder als Hausaufgabe.
**🔗 Link** zeigt beide Links und einen QR-Code zum Ausdrucken.

## Neue App bauen lassen
In der Bibliothek auf **＋ Neue App** – dort steht der fertige Auftrag zum Kopieren.
Modul nennen, Material anhängen, die fertige `.json` nach `Apps/` legen und in
`Apps/katalog.json` eintragen. Ohne Server geht auch **App importieren** (bleibt im Browser).

## Hinweise
- Die Live-Verbindung läuft über öffentliche MQTT-Broker (hivemq, emqx), anonym,
  es werden keine Schülerdaten gespeichert.
- `?bc=1` an den Link gehängt = Testbetrieb ohne Internet (nur Tabs im selben Browser).
- Von der Festplatte geöffnet funktioniert die eingebaute App und „Üben"; der
  Ordner `Apps/` wird erst gelesen, wenn die Seite im Netz liegt (GitHub Pages).
- `index.html` nicht umbenennen und nicht aufteilen.

## Einstellungen für Schüler (Lehrkraft)
Auf der Startseite bei jeder App **⚙ Einstellungen & Link**:
- Haken pro Aufgabe: einzelne Aufgaben (Ecken-Sortierer, Paare, Falsch-Finder, Quiz …) für die Schüler ein- oder ausschalten.
- „Schüler dürfen Aufgaben überspringen“: dann erscheint bei jeder Aufgabe der Knopf „Überspringen (keine Punkte)“. Punkte der übersprungenen Aufgabe verfallen.
- Die Einstellung steckt im Link (`aus=2,4&skip=1`) und im QR-Code der Tafel. „Tafel starten“ und „Üben“ benutzen die zuletzt gespeicherte Einstellung (pro Gerät, localStorage).
