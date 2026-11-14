#!/usr/bin/env python3
"""Baut das neue Design in alle LF1-5-Selbsttests ein (Quelle: git HEAD, idempotent)
und erzeugt die Design-Vorschau. Ändert keine Texte und keine IDs der Tests."""
import json, re, subprocess, urllib.parse, pathlib

REPO = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).parent

ICONS = {
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "liste": '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    "restart": '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
    "bulb": '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V17h6v-.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
    "trophy": '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    "star": '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "rocket": '<path d="M12 2c3 2.5 4.5 6 4.5 10L12 17.5 7.5 12C7.5 8 9 4.5 12 2z"/><circle cx="12" cy="9" r="1.8"/><path d="M7.5 12 5 14.5V18l2.5-1.5M16.5 12 19 14.5V18l-2.5-1.5"/><path d="M10 17.5v2.5h4v-2.5M11 22h2"/>',
}


def mask_uri(inner):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>')
    return 'url("data:image/svg+xml,' + urllib.parse.quote(svg, safe=" =:/;,.-") + '")'


CSS = (HERE / "design.css").read_text(encoding="utf-8")
for key, name in [("__ICO_LISTE__", "liste"), ("__ICO_RESTART__", "restart"),
                  ("__ICO_BULB__", "bulb"), ("__ICO_TARGET__", "target")]:
    CSS = CSS.replace(key, mask_uri(ICONS[name]))
JS = (HERE / "design.js").read_text(encoding="utf-8").replace("__ICONS__", json.dumps(ICONS, ensure_ascii=False))
STYLE_BLOCK = '<style id="design-2026">\n' + CSS + '</style>\n'
SCRIPT_BLOCK = '<script id="design-2026-js">\n' + JS + '</script>\n'


def inject(html):
    assert html.count("</head>") == 1 and html.count("</body>") == 1, "unexpected skeleton"
    html = html.replace("</head>", STYLE_BLOCK + "</head>")
    html = html.replace("</body>", SCRIPT_BLOCK + "</body>")
    return html


def git_files():
    out = subprocess.run(["git", "ls-files"], cwd=REPO, capture_output=True, text=True, check=True).stdout
    return out.splitlines()


def build_tests():
    targets = [f for f in git_files() if re.match(r"^LF[1-5]_.*Selbsttest.*\.html$", f)]
    for rel in targets:
        src = subprocess.run(["git", "show", "HEAD:" + rel], cwd=REPO, capture_output=True, check=True).stdout
        html = inject(src.decode("utf-8"))
        (REPO / rel).write_text(html, encoding="utf-8")
    return targets


DEMO_BODY = """
<div class="blatt">
  <header class="kopf">
    <div class="li">Datum:<br><br>Name:</div>
    <div class="mi">
      <div class="lf">Vorschau</div>
      <div class="lftxt">Design und Feedback für alle Noten</div>
      <div class="mod">Selbsttest – Design-Vorschau</div>
    </div>
  </header>
  <h1>Design-Vorschau: Selbsttest</h1>
  <p class="unter">Beantworte die Fragen und klicke auf „Auswerten“. Darunter kannst du jede Note einzeln ansehen.</p>
  <form id="test">
    <h2>Teil 1: Multiple Choice</h2>
    <p class="hinweis">Je eine Antwort ist richtig. Ein Punkt pro Frage.</p>
    <div id="mc">
      <div class="frage"><p class="txt"><span class="nr">1.</span> Welche Produktionsfaktoren gibt es?</p>
        <label class="opt"><input type="radio" name="mc0" value="0">Arbeit, Boden, Kapital</label>
        <label class="opt"><input type="radio" name="mc0" value="1">Arbeit, Boden, Kapital, Dienstleistung</label>
        <label class="opt"><input type="radio" name="mc0" value="2">Geld, Waren, Lohn</label>
      </div>
      <div class="frage"><p class="txt"><span class="nr">2.</span> Was fließt im Güterstrom von den Haushalten zu den Unternehmen?</p>
        <label class="opt"><input type="radio" name="mc1" value="0">Arbeitskraft</label>
        <label class="opt"><input type="radio" name="mc1" value="1">Geld</label>
        <label class="opt"><input type="radio" name="mc1" value="2">Steuern</label>
      </div>
      <div class="frage"><p class="txt"><span class="nr">3.</span> Wie nennt man Geld, das Haushalte für Waren ausgeben?</p>
        <label class="opt"><input type="radio" name="mc2" value="0">Einkommen</label>
        <label class="opt"><input type="radio" name="mc2" value="1">Ersparnis</label>
        <label class="opt"><input type="radio" name="mc2" value="2">Konsumausgaben</label>
      </div>
      <div class="frage"><p class="txt"><span class="nr">4.</span> Welcher Vorgang ist ein Geldstrom?</p>
        <label class="opt"><input type="radio" name="mc3" value="0">Ein Lkw liefert Ware.</label>
        <label class="opt"><input type="radio" name="mc3" value="1">Das Modehaus zahlt das Gehalt.</label>
        <label class="opt"><input type="radio" name="mc3" value="2">Eine Jacke wird verkauft.</label>
      </div>
    </div>
    <button type="button" id="auswerten">Auswerten</button>
  </form>

  <div id="ergebnis">
    <h1>Dein Ergebnis</h1>
    <div class="note">
      <div class="zahl" id="notezahl">–</div>
      <div class="daten">
        <div class="gross"><span id="punkte">0</span> von <span id="gesamt">4</span> Punkten</div>
        <div id="prozent">0 %</div>
        <div id="notetext"></div>
      </div>
    </div>
    <div id="details"></div>
    <button type="button" id="nochmal" class="zweit">Test noch einmal starten</button>
  </div>

  <h2>Vorschau: Feedback für die Noten 1 bis 6</h2>
  <p class="hinweis">Jede Schaltfläche zeigt das Ergebnis für eine Note mit Abzeichen, Text und Animation.</p>
  <div class="gleiste">
    <button type="button" class="gbtn" data-n="1">Note 1 · Konfetti</button>
    <button type="button" class="gbtn" data-n="2">Note 2 · Sterne</button>
    <button type="button" class="gbtn" data-n="3">Note 3 · Haken</button>
    <button type="button" class="gbtn" data-n="4">Note 4 · Rakete</button>
    <button type="button" class="gbtn" data-n="5">Note 5 · Glühbirne</button>
    <button type="button" class="gbtn" data-n="6">Note 6 · Neustart</button>
  </div>
</div>
"""

DEMO_STYLE = """<style>
  .gleiste{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
  .gleiste .gbtn{margin:0;min-height:46px;padding:10px 16px;font-size:15px;box-shadow:none;background:#fff;color:#3b5bdb;border:2px solid #c7d3f7}
  .gleiste .gbtn:hover{background:#f3f6ff}
</style>
"""

DEMO_SCRIPT = """<script>
(function(){
  "use strict";
  var RICHTIG = [1, 0, 2, 1];
  var OPTS = [["Arbeit, Boden, Kapital","Arbeit, Boden, Kapital, Dienstleistung","Geld, Waren, Lohn"],
              ["Arbeitskraft","Geld","Steuern"],["Einkommen","Ersparnis","Konsumausgaben"],
              ["Ein Lkw liefert Ware.","Das Modehaus zahlt das Gehalt.","Eine Jacke wird verkauft."]];
  var WORT = {1:"sehr gut",2:"gut",3:"befriedigend",4:"ausreichend",5:"mangelhaft",6:"ungenügend"};
  function note(p){if(p>=92)return 1;if(p>=81)return 2;if(p>=67)return 3;if(p>=50)return 4;if(p>=30)return 5;return 6;}
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function zeigeErgebnis(n, punkte, gesamt, proz, details){
    document.getElementById("notezahl").textContent = n;
    document.getElementById("notetext").textContent = WORT[n];
    document.getElementById("punkte").textContent = punkte;
    document.getElementById("gesamt").textContent = gesamt;
    document.getElementById("prozent").textContent = proz + " %";
    var box = document.getElementById("details"); box.innerHTML = "";
    details.forEach(function(d){
      var el = document.createElement("div"); el.className = "detail";
      var h = '<div class="kopfz">' + esc(d.t) + ': ' + (d.ok ? '<span class="ok">richtig</span>' : '<span class="nein">falsch</span>') + '</div>';
      if(!d.ok){ h += '<div class="loesung"><b>Richtig wäre:</b> ' + esc(d.loesung) + '</div>'; }
      el.innerHTML = h; box.appendChild(el);
    });
    document.getElementById("test").style.display = "none";
    document.getElementById("ergebnis").style.display = "block";
  }
  document.getElementById("auswerten").addEventListener("click", function(){
    var punkte = 0, det = [];
    RICHTIG.forEach(function(r, i){
      var sel = document.querySelector('input[name="mc' + i + '"]:checked');
      var ok = !!sel && Number(sel.value) === r; if (ok) punkte++;
      det.push({t: "Frage " + (i + 1), ok: ok, loesung: OPTS[i][r]});
    });
    var proz = Math.round(punkte / RICHTIG.length * 100);
    zeigeErgebnis(note(proz), punkte, RICHTIG.length, proz, det);
  });
  document.querySelectorAll(".gbtn").forEach(function(b){
    b.addEventListener("click", function(){
      var n = Number(b.getAttribute("data-n"));
      var pr = {1:[10,100],2:[9,90],3:[7,70],4:[5,50],5:[3,30],6:[2,20]}[n];
      zeigeErgebnis(n, pr[0], 10, pr[1], [
        {t:"Beispiel Frage 1", ok:true}, {t:"Beispiel Frage 2", ok: n < 3, loesung:"Arbeitskraft"}]);
      window.zeigeFeedback(n, pr[1]);
      document.getElementById("ergebnis").scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
  document.getElementById("nochmal").addEventListener("click", function(){ location.reload(); });
})();
</script>
"""


def build_demo():
    head = ('<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>Design-Vorschau – Selbsttest</title>\n</head>\n<body>\n')
    html = head + DEMO_BODY + DEMO_STYLE + DEMO_SCRIPT + "</body>\n</html>\n"
    html = inject(html)
    (REPO / "Selbsttest_Design_Vorschau.html").write_text(html, encoding="utf-8")


if __name__ == "__main__":
    t = build_tests()
    build_demo()
    print("Tests gebaut:", len(t))
