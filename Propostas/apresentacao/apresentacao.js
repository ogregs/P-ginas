
const S=[...document.querySelectorAll('#palco>section')];let i=0;
const palco=document.getElementById('palco'),cont=document.getElementById('cont'),notas=document.getElementById('notas');
const MEDE=document.body.hasAttribute('data-reserva');
function escala(){const sel=document.getElementById('selo'),bar=document.getElementById('barra');
 const cima=MEDE&&sel?sel.offsetHeight+8:0,baixo=MEDE&&bar?bar.offsetHeight+8:0,alt=Math.max(innerHeight-cima-baixo,120);
 const k=Math.min(innerWidth/1920,alt/1080);palco.style.top=(cima+alt/2)+'px';palco.style.transform='scale('+k+') translate(-50%,-50%)';}
function mostra(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach((s,j)=>s.classList.toggle('ativo',j===i));cont.textContent=(i+1)+' / '+S.length;
 if(notas){const a=S[i].querySelector('aside');notas.textContent='';const t=document.createElement('b');t.textContent='Notas do slide '+(i+1);notas.appendChild(t);notas.appendChild(document.createTextNode(a?a.textContent:'(sem notas)'));}
 history.replaceState(null,'','#'+(i+1));}
function notasLiga(){if(notas)notas.style.display=notas.style.display==='block'?'none':'block';}
addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){mostra(i+1);e.preventDefault();}
 else if(['ArrowLeft','PageUp'].includes(e.key))mostra(i-1);else if(e.key==='Home')mostra(0);else if(e.key==='End')mostra(S.length-1);
 else if(e.key==='n'||e.key==='N')notasLiga();
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}});
document.getElementById('ant').addEventListener('click',()=>mostra(i-1));
document.getElementById('prox').addEventListener('click',()=>mostra(i+1));
const bn=document.getElementById('bn');if(bn)bn.addEventListener('click',notasLiga);
let x0=null;addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)mostra(i+(d<0?1:-1));x0=null;},{passive:true});
addEventListener('resize',escala);escala();mostra((parseInt(location.hash.slice(1))||1)-1);
