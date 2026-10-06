const GENS=[
 {n:'Pose misteriosa',e:'🧍',c:15,a:0.2},
 {n:'Óculos escuros',e:'🕶️',c:100,a:1},
 {n:'Trilha sonora épica',e:'🎧',c:600,a:6},
 {n:'Slow motion',e:'🎬',c:3500,a:30},
 {n:'Vento no cabelo',e:'🌬️',c:20000,a:150},
 {n:'Entrada de herói',e:'🚪',c:120000,a:800},
 {n:'Aura infinita',e:'♾️',c:900000,a:5000}
];
const UPS=[
 {n:'Olhar firme',e:'👁️',c:50,m:2},
 {n:'Sorriso certeiro',e:'😏',c:500,m:3},
 {n:'Postura impecável',e:'🏆',c:5000,m:5},
 {n:'Carisma lendário',e:'👑',c:50000,m:10},
 {n:'Aura cósmica',e:'🌌',c:600000,m:20}
];
const RANKS=[[0,'Sem aura'],[100,'Aura de iniciante'],[1e3,'Aura emergente'],[1e4,'Aura forte'],[1e5,'Aura absurda'],[1e6,'Aura de lenda'],[1e7,'Aura infinita']];
const KEY='aura-lilgiela33-v1';
let S={aura:0,total:0,gens:GENS.map(()=>0),ups:UPS.map(()=>0),t:Date.now()};
try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);if(o&&o.gens&&o.ups)S=Object.assign(S,o)}}catch(e){}
const $=id=>document.getElementById(id);
const fmt=n=>{if(n<1e3)return n<10&&n%1?n.toFixed(1):Math.floor(n).toString();const u=['k','M','B','T'];let i=-1;while(n>=1e3&&i<3){n/=1e3;i++}return n.toFixed(2)+u[i]};
const gcost=i=>Math.ceil(GENS[i].c*Math.pow(1.15,S.gens[i]));
const apc=()=>UPS.reduce((m,u,i)=>S.ups[i]?m*u.m:m,1);
const aps=()=>GENS.reduce((s,g,i)=>s+g.a*S.gens[i],0)*(1+0.01*S.ups.filter(Boolean).length*0);
function build(){
 $('ups').innerHTML=UPS.map((u,i)=>`<button class="item up" data-u="${i}"><span class="e">${u.e}</span><span class="t"><b>${u.n}</b><small>Clique x${u.m}</small></span><span class="cost">${fmt(u.c)}</span></button>`).join('');
 $('gens').innerHTML=GENS.map((g,i)=>`<button class="item" data-g="${i}"><span class="e">${g.e}</span><span class="t"><b>${g.n}</b><small>+${g.a}/s · <span class="cost" id="gc${i}"></span></small></span><span class="own" id="go${i}"></span></button>`).join('');
}
function render(){
 $('score').textContent=fmt(S.aura);
 $('aps').textContent=fmt(aps());$('apc').textContent=fmt(apc());
 let r=RANKS[0][1];for(const k of RANKS)if(S.total>=k[0])r=k[1];$('rank').textContent=r;
 GENS.forEach((g,i)=>{$('gc'+i).textContent=fmt(gcost(i));$('go'+i).textContent=S.gens[i];document.querySelector(`[data-g="${i}"]`).disabled=S.aura<gcost(i)});
 UPS.forEach((u,i)=>{const b=document.querySelector(`[data-u="${i}"]`);b.style.display=S.ups[i]?'none':'';b.disabled=S.aura<u.c});
 document.title=fmt(S.aura)+' aura · lilgiela33';
}
function pop(x,y,t){const p=document.createElement('div');p.className='pop';p.textContent=t;p.style.left=x-10+'px';p.style.top=y-20+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),900)}
$('orb').addEventListener('click',e=>{const v=apc();S.aura+=v;S.total+=v;
 const r=e.target.getBoundingClientRect();pop(e.clientX||r.left+r.width/2,e.clientY||r.top+r.height/2,'+'+fmt(v));render()});
$('gens').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const i=+b.dataset.g,c=gcost(i);if(S.aura>=c){S.aura-=c;S.gens[i]++;render()}});
$('ups').addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(!b)return;const i=+b.dataset.u;if(!S.ups[i]&&S.aura>=UPS[i].c){S.aura-=UPS[i].c;S.ups[i]=1;render()}});
$('theme').onclick=()=>{const d=document.documentElement,l=getComputedStyle(d).getPropertyValue('--bg').trim()==='#f5efff';d.dataset.theme=l?'dark':'light'};
$('reset').onclick=()=>{if(confirm('Zerar toda a aura?')){S={aura:0,total:0,gens:GENS.map(()=>0),ups:UPS.map(()=>0),t:Date.now()};try{localStorage.removeItem(KEY)}catch(e){}render()}};
let last=performance.now();
setInterval(()=>{const n=performance.now(),d=(n-last)/1000;last=n;const g=aps()*d;S.aura+=g;S.total+=g;render()},100);
setInterval(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},5000);
build();render();
