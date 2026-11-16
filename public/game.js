'use strict';
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const joinPanel=document.getElementById('joinPanel');
const hud=document.getElementById('hud');
const nameInput=document.getElementById('nameInput');
const playButton=document.getElementById('playButton');
let socket=null;
let myId=null;
let selectedFaction=null;
let latest=null;
let keys=new Set();
let mouse={x:0,y:0,down:false};
let attackQueued=false;
let dashQueued=false;
const colors=['#ff5c67','#4da6ff','#59d66f'];

document.querySelectorAll('.factions button').forEach(button=>button.addEventListener('click',()=>{selectedFaction=Number(button.dataset.faction);document.querySelectorAll('.factions button').forEach(item=>item.classList.remove('selected'));button.classList.add('selected')}));
playButton.addEventListener('click',joinGame);
nameInput.addEventListener('keydown',event=>{if(event.key==='Enter')joinGame()});
window.addEventListener('keydown',event=>{keys.add(event.key.toLowerCase());if(event.key===' ')dashQueued=true});
window.addEventListener('keyup',event=>keys.delete(event.key.toLowerCase()));
canvas.addEventListener('mousemove',event=>{mouse.x=event.clientX;mouse.y=event.clientY});
canvas.addEventListener('mousedown',event=>{if(event.button===0){mouse.down=true;attackQueued=true}});
window.addEventListener('mouseup',event=>{if(event.button===0)mouse.down=false});
function joinGame(){const protocol=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(`${protocol}//${location.host}`);socket.addEventListener('open',()=>socket.send(JSON.stringify({type:'join',name:nameInput.value.trim()||'Recruit',faction:selectedFaction})));socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.type==='welcome'){myId=message.id;joinPanel.style.display='none';canvas.style.display='block';hud.style.display='block'}if(message.type==='state')latest=message})}
setInterval(()=>{if(!socket||socket.readyState!==WebSocket.OPEN)return;const up=keys.has('w')||keys.has('arrowup'),down=keys.has('s')||keys.has('arrowdown'),left=keys.has('a')||keys.has('arrowleft'),right=keys.has('d')||keys.has('arrowright');socket.send(JSON.stringify({type:'input',input:{up,down,left,right,aimX:mouse.x,aimY:mouse.y,attack:attackQueued||mouse.down,dash:dashQueued}}));attackQueued=false;dashQueued=false)},50);
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener('resize',resize);resize();
function render(){ctx.clearRect(0,0,innerWidth,innerHeight);if(latest){ctx.fillStyle='#10243a';ctx.fillRect(0,0,innerWidth,innerHeight);for(const player of latest.players){ctx.fillStyle=colors[player.faction];ctx.beginPath();ctx.arc(player.x%innerWidth,player.y%innerHeight,17,0,Math.PI*2);ctx.fill()}const me=latest.players.find(player=>player.id===myId);if(me){document.getElementById('identity').textContent=`${me.name} · ${me.hp}/${me.maxHp} HP`;document.getElementById('roundInfo').textContent=`Round ${latest.round} · ${latest.timeLeft}s`;document.getElementById('resources').textContent=`Score ${me.score} · Gold ${me.gold} · Supply ${me.supply}`}}requestAnimationFrame(render)}
render();
