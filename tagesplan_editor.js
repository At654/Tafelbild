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
#tpEd .it .off{grid-column:2/4;font-size:12.5px;color:var(--mut);display:flex;gap:6px;align-items:center;margin:0}
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
const loadSeiten=()=>new Promise(res=>{if(window.TP_SEITEN)return res();const s=document.createElement('script');s.src='tagesplan_seiten.js';s.charset='utf-8';s.onload=s.onerror=()=>res();document.head.appendChild(s);});
const loadKat=()=>new Promise(res=>{if(window.TP_KAT){KAT=window.TP_KAT;return loadSeiten().then(res);}const s=document.createElement('script');s.src='tagesplan_katalog.js';s.charset='utf-8';s.onload=()=>{KAT=window.TP_KAT||{};loadSeiten().then(res);};s.onerror=()=>{KAT={};loadSeiten().then(res);};document.head.appendChild(s);});

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
 return sortRank(L);
}
const norm=u=>(u||'').trim();
/* Standard-Reihenfolge: Einstieg, Einstiegsmaterial, Arbeitsblatt, Arbeitsblatt online, Lösung, Digitales Arbeitsblatt, Bastelbögen, Online-Spiele, Sonstiges, ganz zuletzt Selbsttest.
   Gilt beim Anhaken und über „Automatisch sortieren“; mit ↑ ↓ kannst du danach selbst umsortieren. */
const RANKS=[
 [/^lesen:/i,0.2],[/^arbeitsheft:/i,0.6],
 [/selbsttest/i,9],[/l[öo]e?sung|musterl/i,4.1],[/lehrerhandreichung/i,4.2],[/einstiegsmaterial|einstiegs-material/i,1],
 [/einstieg|live-app|gta auftakt|auftakt/i,0],[/bastel|leporello|k[äa]e?rtchen/i,6],[/digitales arbeitsblatt|interaktives arbeitsblatt|digitale arbeitsbl/i,5],
 [/spiel|escape|adventure|abenteuer|story|trainer|quiz|arena|imperium|phantom|countdown|ladenmacher|rettet|wett-/i,7],[/online/i,3],[/arbeitsblatt/i,2]
];
function rank(x){
 for(const src of [x.l||'',(x.u||'').split('/').pop().replace(/[_-]+/g,' ')]){
  for(const r of RANKS)if(r[0].test(src))return r[1];
 }
 return 8;
}
const sortRank=a=>a.map((x,i)=>[x,i]).sort((p,q)=>rank(p[0])-rank(q[0])||p[1]-q[1]).map(p=>p[0]);
const ikey=x=>norm(x.u)||('#'+x.l);
function addItem(x){ /* an der Stelle der Standard-Reihenfolge einfügen, ohne deine übrige Reihenfolge zu ändern */
 if(ED.items.some(y=>ikey(y)===ikey(x)))return;
 const r=rank(x),i=ED.items.findIndex(y=>rank(y)>r);
 if(i<0)ED.items.push({l:x.l,u:x.u});else ED.items.splice(i,0,{l:x.l,u:x.u});
}
const stuU=u=>{u=norm(u);return /Lernsituation/i.test(u)&&!/^https?:/i.test(u)?u+(u.includes('?')?'&':'?')+'mode=schueler':u;};
const encU=u=>{u=stuU(u);if(/^https?:/i.test(u))return u;try{return encodeURI(decodeURI(u));}catch(e){return encodeURI(u);}};

/* ---------- Leitfrage ---------- */
/* Seiten aus dem Arbeitsblatt: „Lesen: Lehrbuch Seite …“ und „Arbeitsheft: Seite …“ (tagesplan_seiten.js, erzeugt aus den Arbeitsblatt-PDFs) */
const pg=v=>(/[–,]|\bund\b/.test(v)?'Seiten ':'Seite ')+v;
function seitenItems(keys){
 const S=window.TP_SEITEN||{},out=[];
 keys.forEach(k=>{const v=S[k];if(!v)return;if(v.lb)out.push({l:'Lesen: Lehrbuch '+pg(v.lb),u:''});if(v.ah)out.push({l:'Arbeitsheft: '+pg(v.ah),u:''});});
 return out;
}
/* Offenes vom letzten Termin derselben Klasse */
function prevOff(klasse,date){
 const ks=Object.keys(state.tagesplaene||{}).filter(k=>k.indexOf(klasse+'|')===0&&k.slice(klasse.length+1)<date).sort(),k=ks[ks.length-1];
 if(!k)return {from:'',list:[]};
 const v=state.tagesplaene[k],l=[];
 (v.items||[]).concat(v.carry||[]).forEach(i=>{if(i&&i.off&&i.l&&!l.some(x=>ikey(x)===ikey(i)))l.push({l:i.l,u:i.u||'',off:false});});
 return {from:k.slice(klasse.length+1),list:l};
}
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
   items:sv&&Array.isArray(sv.items)?sv.items.map(i=>({l:i.l,u:i.u,off:!!i.off})):[],note:sv?sv.note||'':'',carry:null,carryFrom:'',src:dk.length?'mod:'+dk[0]:'dir:nuetz',filter:''};
  if(ED.qAuto||!ED.q)ED.q=autoQ();
  if(sv&&Array.isArray(sv.carry)){ED.carry=sv.carry.map(i=>({l:i.l,u:i.u||'',off:!!i.off}));ED.carryFrom=sv.carryFrom||'';}
  else{const po=prevOff(klasse,date);ED.carry=po.list;ED.carryFrom=po.from;}
  if(!sv)seitenItems(ED.mods).forEach(addItem);
  renderAll();$('tpEd').classList.add('on');
 });
}
function close(){const d=$('tpEd');if(d)d.classList.remove('on');}
function persist(){
 if(!ED||typeof STUDENT!=='undefined'&&STUDENT)return;
 state.tagesplaene[keyOf(ED.klasse,ED.date)]={mods:ED.mods,q:ED.q,qAuto:ED.qAuto,x:ED.x,kx:ED.kx,items:ED.items.map(i=>({l:i.l,u:i.u,off:!!i.off})),carry:ED.carry.map(i=>({l:i.l,u:i.u,off:!!i.off})),carryFrom:ED.carryFrom,note:ED.note,saved:new Date().toISOString()};
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
 <div id="tpNoteBox"></div>
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
 <div class="row"><button class="btn sm" data-tp="autoSort">↕ Automatisch sortieren</button><button class="btn sm" data-tp="seiten">📖 Seiten aus dem Arbeitsblatt</button><span class="small">Einstieg → Einstiegsmaterial → Arbeitsblatt → Arbeitsblatt online → Lösung → Digitales Arbeitsblatt → Bastelbögen → Online-Spiele → … → Selbsttest. Mit ↑ ↓ änderst du selbst.</span></div>
 <div id="tpItems"></div>
 <div class="row"><input type="text" id="tpOwnL" style="flex:2;min-width:180px" placeholder="Eigener Auftrag (Text)"><input type="text" id="tpOwnU" style="flex:2;min-width:180px" placeholder="Link (optional, https://… oder Datei)"><button class="btn" data-tp="addOwn">+ Auftrag</button></div>
 <h3>Noch offen vom letzten Termin<span id="tpCarryFrom" class="small"></span></h3>
 <div id="tpCarry"></div>
 <div class="row"><button class="btn sm" data-tp="reloadCarry">↻ Offenes vom letzten Termin neu laden</button><span class="small">Erscheint als eigene Vorseite „Noch offen von unserem letzten Termin“ vor der Agenda.</span></div>
 <h3>5 · Eigener Text (optional)</h3>
 <textarea id="tpX" style="min-height:70px" placeholder="z. B. Bitte Heft und Stift bereithalten. Gruppen: …">${e2(ED.x)}</textarea>
 <h3>6 · Eigene Key Learning Points (optional, eine pro Zeile)</h3>
 <textarea id="tpKx" style="min-height:56px" placeholder="Wird zusätzlich zu den Key Learning Points des Moduls auf Seite 2 angezeigt.">${e2(ED.kx)}</textarea>
 <div class="acts2"><button class="btn pri" data-tp="board">🖥️ Smartboard-Ansicht öffnen</button><button class="btn" data-tp="copy">🔗 Link kopieren</button><button class="btn" data-tp="share">⤴ Teilen</button><button class="btn" data-tp="mail">✉ E-Mail</button></div>
 <div class="linkbox" id="tpLinkBox"><label>Link zu diesem Plan (zum Verschicken an die Klasse):</label><input type="text" id="tpLink" readonly><p class="small">Der Link enthält den ganzen Plan. Schüler öffnen ihn am Handy, wählen ihre Sprache und sehen Aufträge und Key Learning Points. Hast du etwas geändert, kopiere den Link erneut.</p></div></div>`;
 renderChips();renderQsug();renderCands();renderItems();renderCarry();renderNote();
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
function renderNote(){
 const hid=(()=>{try{return localStorage.getItem('tp_note_hidden')==='1';}catch(e){return false;}})();
 $('tpNoteBox').innerHTML=`<div class="row" style="margin:10px 0 2px"><b>📝 Meine Vermerke</b><span class="small">nur für dich – nicht im Link, nicht am Smartboard</span><button class="btn sm ghost" data-tp="noteToggle" style="margin-inline-start:auto" title="Vermerke ein- oder ausblenden">${hid?'👁 einblenden':'🙈 ausblenden'}</button></div>`+(hid?'':`<textarea id="tpNote" style="min-height:64px" placeholder="Vermerke zum Unterricht: was lief gut, wer braucht Hilfe, was war schwierig …">${e2(ED.note)}</textarea>`);
}
function renderCarry(){
 $('tpCarryFrom').textContent=ED.carryFrom?' (Termin '+de(ED.carryFrom)+')':'';
 $('tpCarry').innerHTML=ED.carry.length?ED.carry.map((it,i)=>`<div class="it"><span class="nr">↷</span><input type="text" data-tp="clab" data-i="${i}" value="${e2(it.l)}" aria-label="Bezeichnung"><button class="btn sm danger" data-tp="cdel" data-i="${i}" aria-label="Entfernen" title="Entfernen (zum Beispiel weil doch erledigt)">✕</button><span class="u">${e2(it.u||'(kein Link)')}</span><label class="off"><input type="checkbox" data-tp="coff" data-i="${i}" ${it.off?'checked':''}> ↷ immer noch nicht geschafft – weiter zum nächsten Termin</label></div>`).join(''):'<p class="small">Nichts offen.</p>';
}
function renderItems(){
 $('tpItems').innerHTML=ED.items.length?ED.items.map((it,i)=>`<div class="it"><span class="nr">${i+1}</span><input type="text" data-tp="lab" data-i="${i}" value="${e2(it.l)}" aria-label="Bezeichnung"><span style="display:flex;gap:2px"><button class="btn sm" data-tp="up" data-i="${i}" ${i?'':'disabled'} aria-label="nach oben">↑</button><button class="btn sm" data-tp="down" data-i="${i}" ${i<ED.items.length-1?'':'disabled'} aria-label="nach unten">↓</button><button class="btn sm danger" data-tp="del" data-i="${i}" aria-label="Entfernen">✕</button></span><span class="u">${e2(it.u||'(kein Link)')}</span><label class="off"><input type="checkbox" data-tp="off" data-i="${i}" ${it.off?'checked':''}> ↷ nicht geschafft – beim nächsten Termin unter „Noch offen“</label></div>`).join(''):'<p class="small">Noch nichts ausgewählt – oben Dateien anhaken.</p>';
}

/* ---------- Ereignisse ---------- */
function onInput(ev){
 const t=ev.target;
 if(t.id==='tpQ'){ED.q=t.value;ED.qAuto=false;persist();}
 else if(t.id==='tpNote'){ED.note=t.value;persist();}
 else if(t.id==='tpX'){ED.x=t.value;persist();}
 else if(t.id==='tpKx'){ED.kx=t.value;persist();}
 else if(t.id==='tpFilter'){ED.filter=t.value;renderCands();}
 else if(t.dataset&&t.dataset.tp==='lab'){const it=ED.items[+t.dataset.i];if(it){it.l=t.value;persist();}}
 else if(t.dataset&&t.dataset.tp==='clab'){const it=ED.carry[+t.dataset.i];if(it){it.l=t.value;persist();}}
}
function onChange(ev){
 const t=ev.target;
 if(t.id==='tpSrc'){ED.src=t.value;ED.filter='';$('tpFilter').value='';renderCands();}
 else if(t.id==='tpAddMod'&&t.value){if(!ED.mods.includes(t.value))ED.mods.push(t.value);t.value='';modsChanged();}
 else if(t.dataset&&t.dataset.tp==='off'){const it=ED.items[+t.dataset.i];if(it){it.off=t.checked;persist();}}
 else if(t.dataset&&t.dataset.tp==='coff'){const it=ED.carry[+t.dataset.i];if(it){it.off=t.checked;persist();}}
 else if(t.dataset&&t.dataset.tp==='cand'){
  const u=t.dataset.u,l=t.dataset.l,i=ED.items.findIndex(x=>norm(x.u)===norm(u));
  if(t.checked&&i<0)addItem({l,u});else if(!t.checked&&i>=0)ED.items.splice(i,1);
  persist();renderItems();
 }
}
function modsChanged(){if(ED.qAuto||!ED.q.trim()){ED.q=autoQ();$('tpQ').value=ED.q;ED.qAuto=true;}persist();renderChips();renderQsug();}
function onClick(ev){
 const b=ev.target.closest&&ev.target.closest('[data-tp]');if(!b||b.tagName==='INPUT'&&b.type==='text'||['cand','lab','clab','off','coff'].includes(b.dataset.tp))return;
 const a=b.dataset.tp,i=+b.dataset.i;
 switch(a){
  case 'close':close();break;
  case 'delMod':ED.mods.splice(i,1);modsChanged();break;
  case 'sugQ':ED.q=suggestQ(b.dataset.k);ED.qAuto=false;$('tpQ').value=ED.q;persist();break;
  case 'allStu':{cands().filter(x=>!TEACHER.test(x.l+' '+x.u)).forEach(x=>{addItem(x);});persist();renderCands();renderItems();break;}
  case 'noneSrc':{const us=new Set(cands().map(x=>norm(x.u)));ED.items=ED.items.filter(x=>!us.has(norm(x.u)));persist();renderCands();renderItems();break;}
  case 'autoSort':ED.items=sortRank(ED.items);persist();renderItems();toast('Sortiert: Einstieg … Selbsttest');break;
  case 'seiten':{const L=seitenItems(ED.mods);if(!L.length){toast('Im Arbeitsblatt dieses Moduls stehen keine Seitenangaben',true);break;}L.forEach(addItem);persist();renderItems();break;}
  case 'cdel':ED.carry.splice(i,1);persist();renderCarry();break;
  case 'reloadCarry':{const po=prevOff(ED.klasse,ED.date);ED.carry=po.list;ED.carryFrom=po.from;persist();renderCarry();toast(po.list.length?po.list.length+' offene Aufträge übernommen':'Vom letzten Termin ist nichts offen');break;}
  case 'noteToggle':{try{localStorage.setItem('tp_note_hidden',localStorage.getItem('tp_note_hidden')==='1'?'0':'1');}catch(e){}renderNote();break;}
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
  i:ED.items.filter(i=>i.l&&i.l.trim()).map(i=>[i.l.trim(),i.u?encU(i.u):'']),o:ED.carry.filter(i=>i.l&&i.l.trim()).map(i=>[i.l.trim(),i.u?encU(i.u):'']),od:ED.carryFrom||''};
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
