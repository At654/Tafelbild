/* Größensteuerung + Tafel-Modus für die digitale Tafel (Lehrerversion).
   Einbinden mit <script src="tafel_zoom.js"></script> vor </body>.
   Vergrößert per CSS-zoom auf <html> (A−/A+, 60–300 %), Tafel-Modus = 150 % + Vollbild-Knopf,
   blendet Elemente mit class="nur-schueler" aus. Die Leiste liegt unten rechts und wird nicht mitgezoomt.
   Auf Schüler-Handys (Beitritts-Link mit ?s=…) erscheint die Leiste nicht. */
(function(){
  if(window.__tzBar)return;
  if(/[?&]s=/.test(location.search))return;
  window.__tzBar=1;
  var STUFEN=[60,75,90,100,110,125,150,175,200,250,300];
  var KEY='tafelansicht:'+(document.title||location.pathname);
  var root=document.documentElement;
  var st={z:100,t:false};
  try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&STUFEN.indexOf(s.z)>=0)st={z:s.z,t:!!s.t};}catch(e){}
  var css=document.createElement('style');
  css.textContent='html{zoom:var(--tz,1)}'+
   'html.tafel .nur-schueler{display:none!important}'+
   '#tzLeiste{position:fixed;right:68px;bottom:12px;z-index:2147482999;display:flex;gap:8px;align-items:center;padding:6px;border-radius:14px;background:#fff;color:#111;border:1px solid rgba(128,128,128,.5);box-shadow:0 4px 16px rgba(0,0,0,.25);font:600 18px/1 system-ui,Arial,sans-serif;zoom:calc(1/var(--tz,1))}'+
   '#qrfab,#qrov{zoom:calc(1/var(--tz,1))}'+
   '#tzLeiste button{min-height:48px;min-width:48px;padding:0 14px;border-radius:10px;cursor:pointer;font:inherit;background:#13275a;color:#fff;border:0;touch-action:manipulation}'+
   '#tzLeiste button:disabled{opacity:.35;cursor:default}'+
   '#tzLeiste button[aria-pressed="true"]{outline:3px solid #111;outline-offset:-3px}'+
   '#tzLeiste [hidden]{display:none}'+
   '#tzWert{min-width:4.2em;text-align:center}'+
   '@media print{html{zoom:1!important}#tzLeiste{display:none!important}}';
  document.head.appendChild(css);
  var bar=document.createElement('div');
  bar.id='tzLeiste';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Größe und Tafel-Modus');
  bar.innerHTML='<button id="tzMinus" type="button" aria-label="Kleiner">A−</button><span id="tzWert" aria-live="polite">100 %</span><button id="tzPlus" type="button" aria-label="Größer">A+</button><button id="tzTafel" type="button" aria-pressed="false">Tafel-Modus</button><button id="tzVoll" type="button" hidden>Vollbild</button>';
  document.body.appendChild(bar);
  function $(id){return document.getElementById(id);}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
  function apply(halten){
    function max(){return Math.max(1,root.scrollHeight-innerHeight);}
    var anteil=halten?scrollY/max():null;
    root.style.setProperty('--tz',st.z/100);
    root.classList.toggle('tafel',st.t);
    $('tzWert').textContent=st.z+' %';
    var i=STUFEN.indexOf(st.z);
    $('tzMinus').disabled=i<=0;$('tzPlus').disabled=i>=STUFEN.length-1;
    var b=$('tzTafel');b.setAttribute('aria-pressed',String(st.t));
    b.textContent=st.t?'Tafel-Modus beenden':'Tafel-Modus';
    $('tzVoll').hidden=!(st.t&&document.fullscreenEnabled);
    if(anteil!==null)requestAnimationFrame(function(){scrollTo(0,anteil*max());});
    save();
  }
  function stufe(d){var i=STUFEN.indexOf(st.z)+d;if(i>=0&&i<STUFEN.length){st.z=STUFEN[i];apply(true);}}
  $('tzMinus').onclick=function(){stufe(-1);};
  $('tzPlus').onclick=function(){stufe(1);};
  $('tzTafel').onclick=function(){
    st.t=!st.t;st.z=st.t?150:100;
    if(!st.t&&document.fullscreenElement)document.exitFullscreen().catch(function(){});
    apply(true);
  };
  $('tzVoll').onclick=function(){
    var b=$('tzVoll');
    function hinweis(){b.textContent='Vollbild: F11';setTimeout(function(){b.textContent='Vollbild';},3000);}
    try{var p=root.requestFullscreen();if(p&&p.catch)p.catch(hinweis);}catch(e){hinweis();}
  };
  apply(false);
})();
