#!/usr/bin/env node
/* Erzeugt die Daten für den Tagesplan (tagesplan.html) aus den vorhandenen Quellen:
   - materials/nützliches/12-Modul-Wiederholung/Key_Learning_Points_Uebersicht.html  (Key Learning Points, 7 Sprachen)
   - tools/tagesplan/leitfragen.txt                                                   (Leitfrage je Modul, Schlüssel = Stundenplan-Schlüssel)
   - uebersicht_daten.js / uebersicht_tr.js                                           (übersetzte Modul-Titel)
   Ausgabe: tagesplan_katalog.js (klein, für den Editor im Stundenplan)  und  tagesplan_daten/<TEIL>.js (je Lernfeld, für die Plan-Seite).
   Aufruf im Hauptordner:  node tools/tagesplan/build.js */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..','..');
const rd=f=>fs.readFileSync(path.join(root,f),'utf8');
const unesc=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const strip=s=>unesc(s.replace(/<[^>]+>/g,'')).trim();
const PID={W:'WISO1',M:'WPF-M'};
const klp=rd('materials/nützliches/12-Modul-Wiederholung/Key_Learning_Points_Uebersicht.html');
const lq={};rd('tools/tagesplan/leitfragen.txt').split('\n').forEach(l=>{const i=l.indexOf('\t');if(i>0)lq[l.slice(0,i)]=l.slice(i+1).trim();});
/* Titel-Übersetzungen */
const w1={window:{}};vm.runInNewContext(rd('uebersicht_daten.js'),w1);
const w2={window:{}};try{vm.runInNewContext(rd('uebersicht_tr.js'),w2);}catch(e){}
const UL=w1.window.UEB.langs,TR1=w1.window.UEB.tr||{},TR2=(w2.window.UEB_TR&&w2.window.UEB_TR.tr)||{};
const titleTr=t=>{const o={};const a=TR1[t];if(a)UL.forEach((l,i)=>{if(a[i])o[l]=a[i];});const b=TR2[t];if(b)o.tr=Array.isArray(b)?b[0]:b;return o;};
const uebTitle={};w1.window.UEB.groups.forEach(g=>g.sections.forEach(sc=>(sc.modules||[]).forEach(mo=>{uebTitle[sc.id+'.'+mo.id]=mo.title;})));
const parts={},cat={};let n=0,missQ=[],missT=[];
klp.split('<section class="lf"').slice(1).forEach(sec=>{
 const lf=/data-lf="([^"]+)"/.exec(sec)[1],pid=PID[lf]||('LF'+lf);
 const re=/<div class="m[^"]*">([\s\S]*?)<\/ol>/g;let m;
 while((m=re.exec(sec))){
  const blk=m[1],code=/class="code"[^>]*>([^<]*)</.exec(blk)[1].trim(),title=strip(/<b>([^<]*)<\/b><span class="sp">/.exec(blk)[1]);
  const pts=[...blk.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>{
   const li=x[1],d={de:strip(/<b>([\s\S]*?)<\/b>/.exec(li)[1])};
   for(const t of li.matchAll(/<span class="t (\w+)">([\s\S]*?)<\/span>/g))d[t[1]]=strip(t[2]);
   return d;});
  const key=pid+'.'+code,tt=Object.assign(titleTr(title),titleTr(uebTitle[key]||''));
  if(!lq[key])missQ.push(key);if(!Object.keys(tt).length)missT.push(key);
  (parts[pid]=parts[pid]||{})[code]={t:title,tt,p:pts};
  cat[key]={t:title,q:lq[key]||'',n:pts.length};n++;
 }
});
fs.mkdirSync(path.join(root,'tagesplan_daten'),{recursive:true});
Object.keys(parts).forEach(pid=>{
 fs.writeFileSync(path.join(root,'tagesplan_daten',pid+'.js'),'/* Key Learning Points '+pid+' (erzeugt mit tools/tagesplan/build.js – nicht von Hand ändern). Übersetzungen maschinell erstellt. */\nwindow.TPD&&TPD.add('+JSON.stringify(pid)+','+JSON.stringify(parts[pid])+');\n');
});
fs.writeFileSync(path.join(root,'tagesplan_katalog.js'),'/* Leitfragen und Module mit Key Learning Points (erzeugt mit tools/tagesplan/build.js). */\nwindow.TP_KAT='+JSON.stringify(cat)+';\n');
console.log(n+' Module; ohne Leitfrage:',missQ.length?missQ.join(' '):'-','; ohne Titel-Übersetzung:',missT.length+' ('+missT.slice(0,12).join(' ')+(missT.length>12?' …':'')+')');
