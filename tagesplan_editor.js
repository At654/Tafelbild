/* Tagesplan-Editor für den Stundenplan (stundenplan.html): Material einer Unterrichtsstunde anklicken → Smartboard-Seite „Unser Plan für heute“
   (tagesplan.html) mit Leitfrage, Aufträgen + QR-Codes, eigenem Text und Key Learning Points; der ganze Plan steckt im Link zum Verschicken.
   Greift auf Variablen des Stundenplans zu (state, C, CAT, matOf, pdfLink, isLink, MAT_FILES, thema …). */
(function(){
'use strict';
if(window.TPE)return;
const $=id=>document.getElementById(id);
const E=window.TPE={};
let ED=null,KAT=null,FILES=[];
const SRC_DIRS={modul:['Modulübergreifend/','Modulübergreifend (Ordner)'],nuetz:['materials/nützliches/','Nützliches (Ordner)']};
const TEACHER=/lehrerhandreichung|l[öo]e?sung|musterl/i;
const e2=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CSS=`#tpEd{position:fixed;inset:0;z-index:40;background:#0009;display:none;align-items:flex-start;justify-content:center;padding:12px;overflow:auto}
#tpEd.on{display:flex}
#tpEd .bx{background:var(--card);color:var(--ink);border-radius:14px;padding:16px;max-width:860px;width:100%;margin:auto}
#tpEd h2{margin:0 0 4px;font-size:19px}#tpEd h3{margin:16px 0 6px;font-size:15px}
#tpEd .small{font-size:12.5px;color:var(--mut)}
#tpEd .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}
#tpEd textarea,#tpEd input[type=text],#tpEd select{width:100%}
#tpEd .chips{display:flex;flex-wrap:wrap;gap:6px}
#tpEd .chip{display:inline-flex;gap:6px;align-items:center;background:var(--free);border:1px solid var(--line);border-radius:99px;padding:3px 6px 3px 10px;font-size:13px}
#tpEd .chip button{border:0;background:none;padding:0 4px;cursor:pointer;color:var(--mut)}
#tpEd .list{border:1px solid var(--line);border-radius:10px;max-height:260px;overflow:auto;padding:4px 8px}
#tpEd .list label{display:flex;gap:8px;align-items:flex-start;color:var(--ink);font-size:13.5px;padding:3px 0;border-top:1px solid var(--line);cursor:pointer;margin:0}
#tpEd .list label:first-child{border-top:0}
#tpEd .list .tag{font-size:11px;background:var(--c-orbg,#ffe9d6);color:var(--c-or,#a64b00);border-radius:6px;padding:0 6px;white-space:nowrap}
#tpEd .it{display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;padding:5px 0;border-top:1px solid var(--line)}
#tpEd .it:first-child{border-top:0}
#tpEd .it .u{grid-column:2/3;font-size:11.5px;color:var(--mut);overflow-wrap:anywhere}
#tpEd .nr{display:inline-flex;width:26px;height:26px;border-radius:50%;background:var(--pri);color:var(--priink);align-items:center;justify-content:center;font-weight:700;font-size:13px}
#tpEd .acts2{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;position:sticky;bottom:-16px;background:var(--card);padding:10px 0 4px;border-top:1px solid var(--line)}
#tpEd .linkbox{display:none;margin-top:8px}
`;

function ensureUi(){
 if($('tpEd'))return;
 const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 const d=document.createElement('div');d.id='tpEd';document.body.appendChild(d);
 d.addEventListener('click',onClick);d.addEventListener('input',onInput);d.addEventListener('change',onChange);
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&$('tpEd').classList.contains('on'))close();});
}
const loadKat=()=>new Promise(res=>{if(window.TP_KAT){KAT=window.TP_KAT;return res();}const s=document.createElement('script');s.src='tagesplan_katalog.js';s.charset='utf-8';s.onload=()=>{KAT=window.TP_KAT||{};res();};s.onerror=()=>{KAT={};res();};document.head.appendChild(s);});

/* ---------- Module und Material ---------- */
function unitOf(key){const a=key.split('.'),p=CAT[a[0]],it=p&&p.items.find(x=>x.id===a[1]);return p&&it?{key,part:p,item:it,dsNo:1,total:1}:null;}
const modLabel=key=>{const u=unitOf(key);if(u)return (u.item.lab?u.part.tag+' · '+u.item.lab+': ':u.part.tag+': ')+u.item.name;const k=KAT&&KAT[key];return k?key+': '+k.t:key;};
const modShort=key=>{const u=unitOf(key);return u?(u.item.lab?u.part.tag+' '+u.item.lab:u.part.tag)+' '+u.item.name:key;};
function dayKeys(klasse,date){
 const keys=[];(C.byDate[date]||[]).filter(o=>o.klasse===klasse).forEach(o=>(o.segs||[]).forEach(g=>{if(g.unit&&!keys.includes(g.unit.key))keys.push(g.unit.key);}));
 return keys;
}
const prettify=f=>{let b=f.split('/').pop().replace(/\.[a-z0-9]+$/i,'').replace(/_/g,' ').replace(/\s+/g,' ').trim();return b;};
function linksOfKey(key){ /* Modul "LF4.M3" oder ganzes Lernfeld "LF4" */
 const out=[];const m=matOf(key);
 if(key.indexOf('.')>0){const u=unitOf(key);if(u){const pl=(m.pdf||'').trim()||pdfLink(u);if(pl&&isLink(pl))out.push({l:'Arbeitsblatt (PDF)',u:pl});}}
 (m.links||[]).forEach(x=>{if(x.u&&isLink(x.u))out.push({l:x.l||prettify(x.u),u:x.u});});
 return out;
}
function dirFiles(dir){const pre=SRC_DIRS[dir][0];return (FILES||[]).filter(f=>f.indexOf(pre)===0&&/\.(html?|pdf|docx?|pptx?)$/i.test(f)).map(f=>({l:prettify(f),u:f}));}
function cands(){
 const s=ED.src;let L=[];
 if(s.indexOf('mod:')===0)L=linksOfKey(s.slice(4));
 else if(s.indexOf('part:')===0)L=linksOfKey(s.slice(5));
 else if(s.indexOf('dir:')===0)L=dirFiles(s.slice(4));
 const f=(ED.filter||'').toLowerCase().trim();
 if(f)L=L.filter(x=>(x.l+' '+x.u).toLowerCase().includes(f));
 const seen=new Set();L=L.filter(x=>!seen.has(x.u)&&seen.add(x.u));
 return L;
}
const norm=u=>(u||'').trim();
const stuU=u=>{u=norm(u);return /Lernsituation/i.test(u)&&!/^https?:/i.test(u)?u+(u.includes('?')?'&':'?')+'mode=schueler':u;};
const encU=u=>{u=stuU(u);if(/^https?:/i.test(u))return u;try{return encodeURI(decodeURI(u));}catch(e){return encodeURI(u);}};

/* ---------- Leitfrage ---------- */
function suggestQ(key){
 const k=KAT&&KAT[key];if(k&&k.q)return k.q;
 const u=unitOf(key);if(!u)return '';
 const t=(typeof thema==='function')?thema(u):u.item.name;
 return 'Was lernen wir heute zum Thema „'+t+'“?';
}
function autoQ(){const k=ED.mods.find(x=>KAT&&KAT[x]&&KAT[x].q)||ED.mods[0];return k?suggestQ(k):'';}

/* ---------- Zustand ---------- */
const keyOf=(k,d)=>k+'|'+d;
function open(klasse,date){
 ensureUi();
 loadKat().then(()=>{
  FILES=(typeof MAT_FILES!=='undefined'&&MAT_FILES)?[...MAT_FILES]:[];
  state.tagesplaene=state.tagesplaene&&typeof state.tagesplaene==='object'?state.tagesplaene:{};
  const dk=dayKeys(klasse,date),sv=state.tagesplaene[keyOf(klasse,date)];
  ED={klasse,date,dayKeys:dk,mods:sv&&Array.isArray(sv.mods)?sv.mods.slice():dk.slice(),q:sv?sv.q:'',qAuto:!sv||sv.qAuto!==false,x:sv?sv.x||'':'',kx:sv?sv.kx||'':'',
   items:sv&&Array.isArray(sv.items)?sv.items.map(i=>({l:i.l,u:i.u})):[],src:dk.length?'mod:'+dk[0]:'dir:nuetz',filter:''};
  if(ED.qAuto||!ED.q)ED.q=autoQ();
  if(!sv&&!ED.items.length)ED.items=[];
  renderAll();$('tpEd').classList.add('on');
 });
}
function close(){const d=$('tpEd');if(d)d.classList.remove('on');}
function persist(){
 if(!ED||typeof STUDENT!=='undefined'&&STUDENT)return;
 state.tagesplaene[keyOf(ED.klasse,ED.date)]={mods:ED.mods,q:ED.q,qAuto:ED.qAuto,x:ED.x,kx:ED.kx,items:ED.items.map(i=>({l:i.l,u:i.u})),saved:new Date().toISOString()};
 try{save();}catch(e){}
}

/* ---------- Ausgabe ---------- */
function srcOptions(){
 let h='';
 if(ED.dayKeys.length)h+=`<optgroup label="Heute im Unterricht">${ED.dayKeys.map(k=>`<option value="mod:${e2(k)}" ${ED.src==='mod:'+k?'selected':''}>${e2(modLabel(k))}</option>`).join('')}</optgroup>`;
 h+=`<optgroup label="Ordner">${Object.keys(SRC_DIRS).map(d=>`<option value="dir:${d}" ${ED.src==='dir:'+d?'selected':''}>${SRC_DIRS[d][1]}</option>`).join('')}</optgroup>`;
 const fachs=[...new Set(Object.keys(CAT).map(k=>CAT[k].fach))];
 fachs.forEach(f=>{
  const ps=Object.keys(CAT).map(k=>CAT[k]).filter(p=>p.fach===f);
  ps.forEach(p=>{
   h+=`<optgroup label="${e2(p.tag+' – '+p.name)}"><option value="part:${e2(p.id)}" ${ED.src==='part:'+p.id?'selected':''}>${e2(p.tag)}: Material zum ganzen Teil (Spiele, Klausurtrainer …)</option>`+
    p.items.filter(it=>it.lab).map(it=>{const k=p.id+'.'+it.id;return `<option value="mod:${e2(k)}" ${ED.src==='mod:'+k?'selected':''}>${e2(it.lab+': '+it.name)}</option>`;}).join('')+'</optgroup>';
  });
 });
 return h;
}
function renderAll(){
 const dt=TAGE[wd(ED.date)]+' '+de(ED.date);
 $('tpEd').innerHTML=`<div class="bx" role="dialog" aria-label="Tagesplan"><div class="row" style="justify-content:space-between;margin-top:0"><div><h2>🖥️ Tagesplan für das Smartboard</h2><div class="small">${e2(ED.klasse)} · ${e2(dt)} · wird automatisch gespeichert</div></div><button class="btn ghost" data-tp="close">Schließen ✕</button></div>
 <h3>1 · Modul(e) dieser Stunde – für Leitfrage und Key Learning Points</h3>
 <div id="tpChips" class="chips"></div>
 <div class="row"><select id="tpAddMod" style="flex:1;min-width:220px"><option value="">+ weiteres Modul hinzufügen …</option>${Object.keys(KAT||{}).map(k=>`<option value="${e2(k)}">${e2(modLabel(k))}</option>`).join('')}</select></div>
 <h3>2 · Leitfrage</h3>
 <textarea id="tpQ" style="min-height:62px" placeholder="Leitfrage für die Stunde">${e2(ED.q)}</textarea>
 <div class="row" id="tpQsug"></div>
 <h3>3 · Material anklicken</h3>
 <div class="row"><select id="tpSrc" style="flex:2;min-width:240px">${srcOptions()}</select><input type="text" id="tpFilter" style="flex:1;min-width:140px" placeholder="Suchen …" value="${e2(ED.filter)}"></div>
 <div class="row"><button class="btn sm" data-tp="allStu">Alle für Schüler anhaken</button><button class="btn sm ghost" data-tp="noneSrc">Alle abwählen</button><span class="small" id="tpCount"></span></div>
 <div class="list" id="tpCands"></div>
 <h3>4 · Reihenfolge und Bezeichnung</h3>
 <div id="tpItems"></div>
 <div class="row"><input type="text" id="tpOwnL" style="flex:2;min-width:180px" placeholder="Eigener Auftrag (Text)"><input type="text" id="tpOwnU" style="flex:2;min-width:180px" placeholder="Link (optional, https://… oder Datei)"><button class="btn" data-tp="addOwn">+ Auftrag</button></div>
 <h3>5 · Eigener Text (optional)</h3>
 <textarea id="tpX" style="min-height:70px" placeholder="z. B. Bitte Heft und Stift bereithalten. Gruppen: …">${e2(ED.x)}</textarea>
 <h3>6 · Eigene Key Learning Points (optional, eine pro Zeile)</h3>
 <textarea id="tpKx" style="min-height:56px" placeholder="Wird zusätzlich zu den Key Learning Points des Moduls auf Seite 2 angezeigt.">${e2(ED.kx)}</textarea>
 <div class="acts2"><button class="btn pri" data-tp="board">🖥️ Smartboard-Ansicht öffnen</button><button class="btn" data-tp="copy">🔗 Link kopieren</button><button class="btn" data-tp="share">⤴ Teilen</button><button class="btn" data-tp="mail">✉ E-Mail</button></div>
 <div class="linkbox" id="tpLinkBox"><label>Link zu diesem Plan (zum Verschicken an die Klasse):</label><input type="text" id="tpLink" readonly><p class="small">Der Link enthält den ganzen Plan. Schüler öffnen ihn am Handy, wählen ihre Sprache und sehen Aufträge und Key Learning Points. Hast du etwas geändert, kopiere den Link erneut.</p></div></div>`;
 renderChips();renderQsug();renderCands();renderItems();
}
function renderChips(){
 $('tpChips').innerHTML=ED.mods.map((k,i)=>`<span class="chip">${e2(modShort(k))}${KAT&&KAT[k]?'':' <span class="small">(ohne Key Learning Points)</span>'}<button data-tp="delMod" data-i="${i}" title="Entfernen" aria-label="Entfernen">✕</button></span>`).join('')||'<span class="small">Kein Modul gewählt – unten eines hinzufügen.</span>';
}
function renderQsug(){
 $('tpQsug').innerHTML=ED.mods.map(k=>`<button class="btn sm ghost" data-tp="sugQ" data-k="${e2(k)}" title="${e2(suggestQ(k))}">↻ Vorschlag: ${e2(modShort(k).slice(0,40))}</button>`).join('');
}
function renderCands(){
 const L=cands(),have=new Set(ED.items.map(i=>norm(i.u)));
 $('tpCount').textContent=L.length+' Dateien'+(L.length>120?' (zeige die ersten 120 – bitte suchen)':'');
 $('tpCands').innerHTML=L.slice(0,120).map((x,i)=>`<label><input type="checkbox" data-tp="cand" data-u="${e2(x.u)}" data-l="${e2(x.l)}" ${have.has(norm(x.u))?'checked':''}><span style="flex:1">${e2(x.l)}<br><span class="small">${e2(x.u)}</span></span>${TEACHER.test(x.l+' '+x.u)?'<span class="tag">nur Lehrkraft</span>':''}</label>`).join('')||'<p class="small" style="padding:8px">Keine Dateien gefunden.</p>';
}
function renderItems(){
 $('tpItems').innerHTML=ED.items.length?ED.items.map((it,i)=>`<div class="it"><span class="nr">${i+1}</span><input type="text" data-tp="lab" data-i="${i}" value="${e2(it.l)}" aria-label="Bezeichnung"><span style="display:flex;gap:2px"><button class="btn sm" data-tp="up" data-i="${i}" ${i?'':'disabled'} aria-label="nach oben">↑</button><button class="btn sm" data-tp="down" data-i="${i}" ${i<ED.items.length-1?'':'disabled'} aria-label="nach unten">↓</button><button class="btn sm danger" data-tp="del" data-i="${i}" aria-label="Entfernen">✕</button></span><span class="u">${e2(it.u||'(kein Link)')}</span></div>`).join(''):'<p class="small">Noch nichts ausgewählt – oben Dateien anhaken.</p>';
}

/* ---------- Ereignisse ---------- */
function onInput(ev){
 const t=ev.target;
 if(t.id==='tpQ'){ED.q=t.value;ED.qAuto=false;persist();}
 else if(t.id==='tpX'){ED.x=t.value;persist();}
 else if(t.id==='tpKx'){ED.kx=t.value;persist();}
 else if(t.id==='tpFilter'){ED.filter=t.value;renderCands();}
 else if(t.dataset&&t.dataset.tp==='lab'){const it=ED.items[+t.dataset.i];if(it){it.l=t.value;persist();}}
}
function onChange(ev){
 const t=ev.target;
 if(t.id==='tpSrc'){ED.src=t.value;ED.filter='';$('tpFilter').value='';renderCands();}
 else if(t.id==='tpAddMod'&&t.value){if(!ED.mods.includes(t.value))ED.mods.push(t.value);t.value='';modsChanged();}
 else if(t.dataset&&t.dataset.tp==='cand'){
  const u=t.dataset.u,l=t.dataset.l,i=ED.items.findIndex(x=>norm(x.u)===norm(u));
  if(t.checked&&i<0)ED.items.push({l,u});else if(!t.checked&&i>=0)ED.items.splice(i,1);
  persist();renderItems();
 }
}
function modsChanged(){if(ED.qAuto||!ED.q.trim()){ED.q=autoQ();$('tpQ').value=ED.q;ED.qAuto=true;}persist();renderChips();renderQsug();}
function onClick(ev){
 const b=ev.target.closest&&ev.target.closest('[data-tp]');if(!b||b.tagName==='INPUT'&&b.type==='text'||b.dataset.tp==='cand'||b.dataset.tp==='lab')return;
 const a=b.dataset.tp,i=+b.dataset.i;
 switch(a){
  case 'close':close();break;
  case 'delMod':ED.mods.splice(i,1);modsChanged();break;
  case 'sugQ':ED.q=suggestQ(b.dataset.k);ED.qAuto=false;$('tpQ').value=ED.q;persist();break;
  case 'allStu':{cands().filter(x=>!TEACHER.test(x.l+' '+x.u)).forEach(x=>{if(!ED.items.some(y=>norm(y.u)===norm(x.u)))ED.items.push({l:x.l,u:x.u});});persist();renderCands();renderItems();break;}
  case 'noneSrc':{const us=new Set(cands().map(x=>norm(x.u)));ED.items=ED.items.filter(x=>!us.has(norm(x.u)));persist();renderCands();renderItems();break;}
  case 'up':if(i>0){[ED.items[i-1],ED.items[i]]=[ED.items[i],ED.items[i-1]];persist();renderItems();}break;
  case 'down':if(i<ED.items.length-1){[ED.items[i+1],ED.items[i]]=[ED.items[i],ED.items[i+1]];persist();renderItems();}break;
  case 'del':ED.items.splice(i,1);persist();renderItems();renderCands();break;
  case 'addOwn':{const l=$('tpOwnL').value.trim(),u=$('tpOwnU').value.trim();if(!l){toast('Bitte einen Text für den Auftrag eintragen',true);break;}ED.items.push({l,u});$('tpOwnL').value='';$('tpOwnU').value='';persist();renderItems();break;}
  case 'board':makeLink().then(u=>{window.open(u,'_blank','noopener');showLink(u);});break;
  case 'copy':makeLink().then(u=>{showLink(u);copyText(u);});break;
  case 'share':makeLink().then(async u=>{showLink(u);const d={title:'Unser Plan für heute',text:'Unser Plan für heute – '+TAGE[wd(ED.date)]+' '+de(ED.date)+' ('+ED.klasse+')',url:u};if(navigator.share){try{await navigator.share(d);}catch(e){}}else copyText(u);});break;
  case 'mail':makeLink().then(u=>{showLink(u);const sub='Unser Plan für heute – '+TAGE[wd(ED.date)]+' '+de(ED.date);location.href='mailto:?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent('Hallo zusammen,\n\nhier ist unser Plan für heute (Aufträge, Leitfrage und Key Learning Points – in eurer Sprache):\n\n'+u+'\n');});break;
 }
}
function showLink(u){$('tpLinkBox').style.display='block';$('tpLink').value=u;}

/* ---------- Link erzeugen ---------- */
function plan(){
 const mods=ED.mods.filter(k=>KAT&&KAT[k]);
 return {v:1,d:ED.date,k:ED.klasse,h:ED.mods.map(modShort).join(' + '),q:ED.q.trim(),x:ED.x.trim(),m:mods,kx:ED.kx.split('\n').map(s=>s.trim()).filter(Boolean),
  i:ED.items.filter(i=>i.l&&i.l.trim()).map(i=>[i.l.trim(),i.u?encU(i.u):''])};
}
const b64u=bytes=>{let s='';for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
async function makeLink(){
 const base=new URL('tagesplan.html',location.href);base.search='';base.hash='';
 const bytes=new TextEncoder().encode(JSON.stringify(plan()));
 let tag='p',out=bytes;
 if(typeof CompressionStream!=='undefined'){
  try{const r=new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw')));out=new Uint8Array(await r.arrayBuffer());tag='z';}catch(e){out=bytes;tag='p';}
 }
 return base.href+'#'+tag+'='+b64u(out);
}
E.open=open;E.makeLink=makeLink;
})();
