#!/usr/bin/env node
/* Liest aus den Arbeitsblatt-PDFs der Module die Seiten im Lehrbuch und im Arbeitsheft ("Lehrbuch S. 208–209 · Arbeitsheft S. 161")
   und schreibt tagesplan_seiten.js. Braucht pdftotext. Aufruf im Hauptordner: node tools/tagesplan/seiten.js */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..','..');
const M=JSON.parse(fs.readFileSync(path.join(root,'stundenplan_material.json'),'utf8')).mat;
const out={};let n=0,miss=[];
Object.keys(M).forEach(k=>{
 const pdf=M[k].pdf;if(!pdf||k.indexOf('.')<0||!fs.existsSync(path.join(root,pdf)))return;
 let t='';try{t=cp.execFileSync('pdftotext',['-l','2','-layout',path.join(root,pdf),'-'],{encoding:'utf8',maxBuffer:1<<24});}catch(e){return;}
 const head=t.split('\n').slice(0,25).join('\n');
 const cut=s=>s.replace(/\s+/g,' ').replace(/\s*(und|,)\s*$/,'').trim();
 const lb=/Lehrbuch\s+S\.?\s*([0-9][0-9–\-, und]*)/i.exec(head),ah=/Arbeitsheft\s+S\.?\s*([0-9][0-9–\-, und]*)/i.exec(head);
 if(lb||ah){out[k]={};if(lb)out[k].lb=cut(lb[1]);if(ah)out[k].ah=cut(ah[1]);n++;}else miss.push(k);
});
fs.writeFileSync(path.join(root,'tagesplan_seiten.js'),'/* Seiten in Lehrbuch und Arbeitsheft je Modul (erzeugt mit tools/tagesplan/seiten.js aus den Arbeitsblatt-PDFs). */\nwindow.TP_SEITEN='+JSON.stringify(out)+';\n');
console.log(n+' Module mit Seitenangaben; ohne:',miss.join(' '));
