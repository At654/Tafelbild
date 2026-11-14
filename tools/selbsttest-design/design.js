(function(){
  "use strict";
  var ICON = __ICONS__;
  var TEXT = {
    1: "Überragend! Du hast das Thema voll im Griff!",
    2: "Klasse gemacht! Fast alles richtig.",
    3: "Gute Arbeit! Die Grundlagen sitzen.",
    4: "Bestanden! Da ist noch Potenzial nach oben.",
    5: "Noch nicht ganz geschafft – nutze die Lösungen als Trainingsplan!",
    6: "Halb so wild! Lies dir das Thema noch einmal durch und starte neu."
  };
  var SYMBOL = {1: "trophy", 2: "star", 3: "check", 4: "rocket", 5: "bulb", 6: "restart"};
  var WORT = {1: "sehr gut", 2: "gut", 3: "befriedigend", 4: "ausreichend", 5: "mangelhaft", 6: "ungenügend"};
  var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function svg(name, cls){
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  function rnd(a, b){ return a + Math.random() * (b - a); }

  /* ---------- Fortschritt ---------- */
  function fortschrittAnzeigen(){
    var form = document.getElementById("test");
    if (!form) return;
    var gruppen = {};
    form.querySelectorAll("input[type=radio]").forEach(function(r){
      if (!(r.name in gruppen)) gruppen[r.name] = false;
      if (r.checked) gruppen[r.name] = true;
    });
    var selects = form.querySelectorAll("select");
    var gesamt = Object.keys(gruppen).length + selects.length, fertig = 0;
    Object.keys(gruppen).forEach(function(k){ if (gruppen[k]) fertig++; });
    selects.forEach(function(s){ if (s.value) fertig++; });
    var bar = document.querySelector(".fbar i"), zahl = document.querySelector(".fzahl");
    if (bar) bar.style.width = (gesamt ? Math.round(fertig / gesamt * 100) : 0) + "%";
    if (zahl) zahl.textContent = fertig + " / " + gesamt;
  }

  /* ---------- Richtig / falsch markieren ---------- */
  function markiereAntworten(){
    var details = document.querySelectorAll("#details .detail");
    var fragen = document.querySelectorAll("#mc .frage");
    var zuord = document.querySelectorAll("#zuord select");
    var luecken = document.querySelectorAll("select[name^='l']");
    var nMC = fragen.length, nZ = zuord.length;
    details.forEach(function(el, i){
      var ok = !!el.querySelector(".kopfz .ok");
      var b = el.querySelector(".loesung b");
      var erwartet = (b && b.nextSibling) ? b.nextSibling.textContent.trim() : "";
      if (i < nMC){
        var sel = fragen[i].querySelector("input:checked");
        fragen[i].querySelectorAll("label.opt").forEach(function(lb){
          if (sel && lb.contains(sel)) lb.classList.add(ok ? "ok" : "nein");
          else if (!ok && erwartet && lb.textContent.trim() === erwartet) lb.classList.add("richtig");
        });
      } else if (i < nMC + nZ){
        if (zuord[i - nMC]) zuord[i - nMC].classList.add(ok ? "ok" : "nein");
      } else {
        var s = luecken[i - nMC - nZ];
        if (s) s.classList.add(ok ? "ok" : "nein");
      }
    });
  }

  /* ---------- Effekte ---------- */
  function neueEffektebene(){
    var alt = document.querySelector(".fx");
    if (alt) alt.parentNode.removeChild(alt);
    var b = document.createElement("div");
    b.className = "fx";
    b.setAttribute("aria-hidden", "true");
    document.body.appendChild(b);
    return b;
  }
  function konfetti(ebene){
    var farben = ["#ff6b6b", "#ffd43b", "#51cf66", "#339af0", "#cc5de8", "#ff922b", "#20c997"];
    var n = REDUCE ? 12 : 90;
    for (var i = 0; i < n; i++){
      var p = document.createElement("i");
      p.className = "konf";
      p.style.left = rnd(0, 100) + "%";
      p.style.background = farben[i % farben.length];
      p.style.width = rnd(7, 12) + "px";
      p.style.height = rnd(10, 18) + "px";
      p.style.borderRadius = Math.random() < 0.3 ? "50%" : "2px";
      p.style.setProperty("--x", rnd(-120, 120) + "px");
      p.style.setProperty("--r", rnd(360, 900) + "deg");
      p.style.setProperty("--d", rnd(2.2, 3.8) + "s");
      p.style.setProperty("--v", rnd(0, 0.8) + "s");
      ebene.appendChild(p);
    }
  }
  function sternenregen(ebene){
    var n = REDUCE ? 6 : 24;
    for (var i = 0; i < n; i++){
      var s = document.createElement("span");
      s.className = "stern";
      s.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
      var size = rnd(18, 34);
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = rnd(0, 100) + "%";
      s.style.setProperty("--x", rnd(-40, 40) + "px");
      s.style.setProperty("--d", rnd(3.5, 5.5) + "s");
      s.style.setProperty("--v", rnd(0, 1.2) + "s");
      ebene.appendChild(s);
    }
  }
  function heldenSymbol(ebene, note){
    var h = document.createElement("div");
    h.className = "hero";
    var inhalt = "";
    if (note === 3) inhalt = '<svg class="ic puls" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path class="haken" d="M7.5 12.5l3 3 6-6.5"/></svg>';
    if (note === 4) inhalt = '<svg class="ic wackel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON.rocket + '</svg><div class="pad"></div>';
    if (note === 5) inhalt = '<svg class="ic licht" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON.bulb + '</svg>';
    if (note === 6) inhalt = '<svg class="ic drehen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON.restart + '</svg>';
    h.innerHTML = inhalt;
    ebene.appendChild(h);
  }
  function zeigeEffekt(note){
    var ebene = neueEffektebene();
    if (note === 1) konfetti(ebene);
    else if (note === 2) sternenregen(ebene);
    else heldenSymbol(ebene, note);
    setTimeout(function(){ ebene.classList.add("aus"); }, 3000);
    setTimeout(function(){ if (ebene.parentNode) ebene.parentNode.removeChild(ebene); }, 3700);
  }

  /* ---------- Zentrale Feedback-Funktion ---------- */
  function zeigeFeedback(note, prozent){
    var n = Math.min(6, Math.max(1, Math.round(Number(note)) || 6));
    var fb = document.querySelector(".fortschritt");
    if (fb) fb.style.display = "none";
    var box = document.getElementById("ergebnis");
    var nb = box ? box.querySelector(".note") : null;
    if (nb){
      nb.setAttribute("data-note", n);
      var zahl = document.getElementById("notezahl");
      if (zahl && zahl.textContent.trim() !== String(n)) zahl.textContent = String(n);
      var pz = document.getElementById("prozent");
      var p = (typeof prozent === "number") ? prozent : parseInt(pz ? pz.textContent : "", 10);
      if (!isNaN(p)){
        if (pz) pz.textContent = p + " %";
        var daten = nb.querySelector(".daten");
        var pb = daten ? daten.querySelector(".pbar") : null;
        if (daten && !pb){
          pb = document.createElement("div");
          pb.className = "pbar";
          pb.innerHTML = "<i></i>";
          if (pz) pz.insertAdjacentElement("afterend", pb); else daten.appendChild(pb);
        }
        var fuell = pb ? pb.querySelector("i") : null;
        if (fuell){
          fuell.style.width = "0%";
          requestAnimationFrame(function(){ requestAnimationFrame(function(){ fuell.style.width = Math.max(0, Math.min(100, p)) + "%"; }); });
        }
      }
      var wort = document.getElementById("notetext");
      if (wort && !wort.textContent.trim()) wort.textContent = WORT[n];
      var motiv = box.querySelector(".motiv");
      if (!motiv){
        motiv = document.createElement("div");
        nb.insertAdjacentElement("afterend", motiv);
      }
      motiv.className = "motiv g" + n;
      motiv.innerHTML = svg(SYMBOL[n]) + "<span>" + TEXT[n] + "</span>";
    }
    zeigeEffekt(n);
  }
  window.zeigeFeedback = zeigeFeedback;

  /* ---------- Start ---------- */
  var form = document.getElementById("test");
  if (form){
    var blatt = document.querySelector(".blatt");
    if (blatt && !document.querySelector(".fortschritt")){
      var f = document.createElement("div");
      f.className = "fortschritt";
      f.innerHTML = '<div class="fbar"><i></i></div><span class="fzahl">0 / 0</span>';
      blatt.insertBefore(f, blatt.firstChild);
    }
    form.addEventListener("change", fortschrittAnzeigen);
    form.addEventListener("input", fortschrittAnzeigen);
    fortschrittAnzeigen();
    var ausw = document.getElementById("auswerten");
    if (ausw){
      // Diese Zeile läuft nach der bestehenden Auswertung der Seite und liest deren Ergebnis.
      ausw.addEventListener("click", function(){
        var note = parseInt((document.getElementById("notezahl") || {}).textContent, 10);
        var proz = parseInt((document.getElementById("prozent") || {}).textContent, 10);
        markiereAntworten();
        if (!isNaN(note)) zeigeFeedback(note, isNaN(proz) ? undefined : proz);
      });
    }
  }
  /* Icons für Hinweise werden per CSS gesetzt; Vorschau-Seite nutzt zusätzlich zeigeFeedback direkt. */
})();
