/* Konfettiregen mit Blinken für erfolgreich gelöste Escape Rooms.
   Aufruf: konfettiRegen(). Löst automatisch aus, sobald das Element #ende sichtbar wird. */
(function(){
  var FARBEN=['#e63946','#f4a261','#ffd23f','#2a9d8f','#4cc9f0','#7b2cbf','#ff5fa2','#80ed99'];
  var laeuft=false;
  function konfettiRegen(dauer){
    if(laeuft) return; laeuft=true;
    dauer=dauer||7000;
    var ruhig=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var c=document.createElement('canvas');
    c.setAttribute('aria-hidden','true');
    c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:99999';
    document.body.appendChild(c);
    var x=c.getContext('2d'),dpr=window.devicePixelRatio||1,W,H;
    function gr(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
    gr(); addEventListener('resize',gr);
    var n=Math.min(220,Math.round(W/5)),teile=[];
    for(var i=0;i<n;i++) teile.push({
      x:Math.random()*W, y:-Math.random()*H, w:6+Math.random()*8, h:10+Math.random()*10,
      vy:2+Math.random()*3.5, vx:-1+Math.random()*2, r:Math.random()*6.28, vr:-.2+Math.random()*.4,
      f:FARBEN[i%FARBEN.length], ph:Math.random()*6.28, fr:5+Math.random()*7, rund:Math.random()<.3
    });
    var t0=performance.now();
    (function frame(t){
      var e=t-t0; x.clearRect(0,0,W,H);
      var a=e>dauer-1200?Math.max(0,(dauer-e)/1200):1;
      teile.forEach(function(p){
        p.y+=p.vy; p.x+=p.vx+Math.sin(e/400+p.ph)*.8; p.r+=p.vr;
        if(p.y>H+20&&e<dauer-1500){p.y=-20;p.x=Math.random()*W}
        var blink=ruhig?1:(Math.sin(e/1000*p.fr+p.ph)>0?1:.12);
        x.globalAlpha=a*blink; x.fillStyle=p.f;
        x.save(); x.translate(p.x,p.y); x.rotate(p.r);
        if(p.rund){x.beginPath();x.arc(0,0,p.w/2,0,6.28);x.fill()} else x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        x.restore();
      });
      if(e<dauer) requestAnimationFrame(frame);
      else{c.remove();removeEventListener('resize',gr);laeuft=false}
    })(t0);
  }
  window.konfettiRegen=konfettiRegen;
  function beobachte(){
    var el=document.getElementById('ende'); if(!el) return;
    function sichtbar(){return getComputedStyle(el).display!=='none'}
    var war=sichtbar();
    new MutationObserver(function(){var jetzt=sichtbar(); if(jetzt&&!war) konfettiRegen(); war=jetzt})
      .observe(el,{attributes:true,attributeFilter:['style','class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',beobachte); else beobachte();
})();
