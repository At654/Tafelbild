/* QR-Button für Smartboard: Schüler fotografieren den Code und öffnen das Spiel direkt am Handy.
   Einbinden mit <script src="qr_button.js"></script> vor </body>. Nutzt uebersicht_qr.js (liegt im selben Ordner). */
(function(){
  if(window.__qrBtn)return;window.__qrBtn=1;
  var me=document.currentScript,base=me&&me.src?me.src.replace(/[^\/]*$/,''):'';
  var st=document.createElement('style');
  st.textContent='#qrfab{position:fixed;right:12px;bottom:12px;z-index:2147483000;width:46px;height:46px;border-radius:50%;border:2px solid #fff;background:#13275a;color:#fff;font:700 13px/1 system-ui,Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.35);opacity:.85;padding:0}#qrfab:hover{opacity:1}'+
  '#qrov{position:fixed;inset:0;z-index:2147483001;background:rgba(10,15,30,.88);display:flex;align-items:center;justify-content:center;padding:16px}'+
  '#qrov .bx{background:#fff;color:#111;border-radius:16px;padding:20px 22px;text-align:center;max-width:96vw;font-family:system-ui,Arial,sans-serif}'+
  '#qrov canvas{width:min(70vh,80vw,560px);height:auto;aspect-ratio:1;display:block;margin:0 auto 10px;image-rendering:pixelated}'+
  '#qrov h2{margin:0 0 8px;font-size:clamp(18px,3vw,28px)}#qrov p{margin:4px 0;font-size:13px;color:#444;word-break:break-all;max-width:560px}'+
  '#qrov button{margin-top:10px;padding:10px 26px;font:700 16px system-ui,Arial,sans-serif;border:0;border-radius:10px;background:#13275a;color:#fff;cursor:pointer}'+
  '@media print{#qrfab,#qrov{display:none!important}}';
  document.head.appendChild(st);
  var b=document.createElement('button');b.id='qrfab';b.type='button';b.textContent='QR';b.title='QR-Code zum Fotografieren';b.setAttribute('aria-label','QR-Code anzeigen');
  b.onclick=show;document.body.appendChild(b);
  function show(){
    var url=location.href.split('#')[0];
    var ov=document.createElement('div');ov.id='qrov';
    ov.innerHTML='<div class="bx"><h2>📱 Mit dem Handy fotografieren</h2><canvas id="qrcv" width="400" height="400"></canvas><p></p><button type="button">Schließen</button></div>';
    ov.querySelector('p').textContent=/^file:/.test(url)?'Hinweis: Die Datei ist nur lokal geöffnet – der Code funktioniert erst, wenn das Spiel online (GitHub Pages) geöffnet ist.':url;
    document.body.appendChild(ov);
    var close=function(){ov.remove();};
    ov.onclick=function(e){if(e.target===ov)close();};ov.querySelector('button').onclick=close;
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',k);}});
    function draw(){try{
      var c=ov.querySelector('canvas'),x=c.getContext('2d'),q=new QRLib.QRCode(-1,QRLib.ECL.M);q.addData(url);q.make();
      var n=q.getModuleCount(),quiet=3,cell=Math.floor(c.width/(n+quiet*2)),off=Math.floor((c.width-cell*n)/2);
      x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.fillStyle='#000';
      for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(q.isDark(r,k))x.fillRect(off+k*cell,off+r*cell,cell,cell);
    }catch(e){ov.querySelector('p').textContent='QR konnte nicht erzeugt werden. Adresse: '+url;}}
    if(window.QRLib)draw();else{var s=document.createElement('script');s.src=base+'uebersicht_qr.js';s.onload=draw;s.onerror=function(){ov.querySelector('p').textContent='QR-Bibliothek nicht gefunden. Adresse: '+url;};document.head.appendChild(s);}
  }
})();
