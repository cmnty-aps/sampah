import { Buffer } from "buffer";
import { randomUUID } from "crypto";

export const FRUIT_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{
  margin:0;
  padding:0;
  width:100%;
  background:transparent;
  font-family:Arial,sans-serif;
  touch-action:none;
  user-select:none;
  -webkit-user-select:none;
  overflow:hidden;
}
.fruitWrap{
  width:100%;
  max-width:440px;
  margin:0 auto;
  padding:6px;
  overflow:hidden;
  border:3px solid #2a1708;
  border-radius:18px;
  background:linear-gradient(145deg, #3d200e, #1a0c04);
  box-shadow:0 6px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15);
}
.fruitHeader{
  height:40px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 10px;
  margin-bottom:6px;
  border:1px solid rgba(255,215,100,0.25);
  border-radius:12px;
  background:rgba(50,25,10,0.85);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.15);
}
.fruitTitle{
  color:#ffca28;
  font-weight:900;
  font-size:16px;
  letter-spacing:1px;
  text-shadow:0 2px 4px rgba(0,0,0,0.6);
}
.fruitTitle span{
  color:#9cff6b;
}
.fruitStats{
  display:flex;
  gap:12px;
  color:#ffe8b0;
  font-size:12px;
  font-weight:bold;
  font-family:monospace;
}
.fruitStats span{
  color:#ffd54f;
}
.gameContainer{
  position:relative;
  width:100%;
  overflow:hidden;
  border:2px solid #2a1708;
  border-radius:14px;
  background:#54301a;
  box-shadow:inset 0 0 20px rgba(0,0,0,0.5);
}
canvas{
  width:100%;
  height:auto;
  display:block;
  touch-action:none;
}
.fruitFooter{
  margin-top:6px;
  padding:5px 10px;
  border:1px solid rgba(255,215,100,0.15);
  border-radius:10px;
  background:rgba(30,15,6,0.7);
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.footerHint{
  color:#e8c9a0;
  font-size:10px;
  font-weight:bold;
}
.muteBtn{
  font-size:15px;
  cursor:pointer;
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,215,100,0.3);
  border-radius:6px;
  padding:2px 8px;
  outline:none;
  color:#ffd98a;
}
.overlay{
  position:absolute;
  z-index:40;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(10,5,1,0.72);
  backdrop-filter:blur(2px);
  padding:8px;
}
.overlay.hidden{
  display:none;
}
.card{
  width:90%;
  max-width:320px;
  padding:16px 14px;
  border:3px solid #c9a25a;
  border-radius:18px;
  background:linear-gradient(#503217,#2a1709);
  box-shadow:inset 0 0 25px rgba(0,0,0,0.6),0 6px 0 #180d05,0 15px 35px rgba(0,0,0,0.8);
  text-align:center;
  color:#fff;
}
.card h1{
  margin:0 0 2px;
  color:#ffd98a;
  font-size:24px;
  font-family:'Arial Black',Arial,sans-serif;
  text-shadow:0 2px #000,0 0 16px rgba(255,140,50,0.6);
}
.card .reason{
  margin:1px 0 6px;
  color:#e8c9a0;
  font-size:12px;
}
.card .big{
  margin:2px 0 0;
  font-size:42px;
  font-family:'Arial Black',Arial,sans-serif;
  color:#fff;
  text-shadow:0 3px 0 #7a3b12,0 0 20px rgba(255,200,80,0.8);
  line-height:1;
}
.card .lbl{
  margin:0 0 8px;
  color:#c9a25a;
  font-size:10px;
  letter-spacing:2px;
  font-weight:bold;
}
.card .best{
  margin:2px 0;
  color:#e8c9a0;
  font-size:13px;
}
.card .tag{
  display:none;
  margin-left:6px;
  background:#ffca28;
  color:#4e2600;
  font-size:9px;
  font-weight:900;
  padding:2px 6px;
  border-radius:6px;
  vertical-align:middle;
  letter-spacing:1px;
}
.card .stats{
  margin:6px 0 4px;
  color:#cbb08a;
  font-size:11px;
  line-height:1.5;
}
.btns{
  display:flex;
  gap:8px;
  width:100%;
  margin-top:10px;
}
.btns button{
  flex:1;
  height:42px;
  border:2px solid #1c3a12;
  border-radius:12px;
  font-family:'Arial Black',Arial,sans-serif;
  font-weight:900;
  font-size:13px;
  cursor:pointer;
  color:#0e2008;
  background:linear-gradient(#d8f17b,#77b44c);
  box-shadow:inset 0 2px rgba(255,255,255,0.5),0 3px #294621;
}
.btns button.ghost{
  border-color:#543016;
  color:#f0dcb2;
  background:linear-gradient(#7a5226,#4a2c15);
  box-shadow:inset 0 2px rgba(255,255,255,0.25),0 3px #2a1708;
}
.btns button:active{
  transform:translateY(2px);
  box-shadow:inset 0 1px rgba(255,255,255,0.4);
}
</style>
</head>
<body>
<div class="fruitWrap">
  <div class="fruitHeader">
    <div class="fruitTitle">🍉 FRUIT<span>SLASH</span></div>
    <div class="fruitStats">
      <div>SKOR <span id="topScore">0</span></div>
      <div>REKOR <span id="topBest">0</span></div>
    </div>
  </div>

  <div class="gameContainer">
    <canvas id="canvas" width="440" height="620"></canvas>
    <div class="overlay hidden" id="gameover">
      <div class="card">
        <h1 id="ovTitle">GAME OVER</h1>
        <p class="reason" id="ovReason"></p>
        <div class="big" id="ovScore">0</div>
        <div class="lbl">SKOR AKHIR</div>
        <p class="best">Rekor: <b id="ovBest">0</b><span class="tag" id="newBest">REKOR BARU!</span></p>
        <p class="stats" id="ovStats"></p>
        <div class="btns">
          <button id="again">MAIN LAGI</button>
          <button id="menuBtn" class="ghost">MENU</button>
        </div>
      </div>
    </div>
  </div>

  <div class="fruitFooter">
    <button class="muteBtn" id="muteBtn">🔊</button>
    <div class="footerHint">👆 Ketuk / Tebas Buah • Hindari Bom!</div>
    <button class="muteBtn" id="btnRestart" style="font-weight:bold;font-size:11px;">Mulai Ulang</button>
  </div>
</div>

<script>
(function(){
'use strict';
var PI=Math.PI,TAU=PI*2;
var GRAV_MIN=780,GRAV_MAX=940,APEX_TOP=0.06,APEX_BOT=0.34,SIZE_SCALE=1.3,HIT_FAT=1.45,SPAWN_BASE=1.35,SPAWN_MIN=0.55;
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var muteBtn=document.getElementById('muteBtn');
var btnRestart=document.getElementById('btnRestart');
var topScore=document.getElementById('topScore');
var topBest=document.getElementById('topBest');
var over=document.getElementById('gameover');
var ovTitle=document.getElementById('ovTitle');
var ovReason=document.getElementById('ovReason');
var ovScore=document.getElementById('ovScore');
var ovBest=document.getElementById('ovBest');
var newTag=document.getElementById('newBest');
var ovStats=document.getElementById('ovStats');
var againBtn=document.getElementById('again');
var menuBtn=document.getElementById('menuBtn');

var W=440,H=620,dpr=Math.min(window.devicePixelRatio||1,2);
canvas.width=W*dpr;
canvas.height=H*dpr;
ctx.setTransform(dpr,0,0,dpr,0,0);

var bg=document.createElement('canvas');
bg.width=W*dpr;
bg.height=H*dpr;

var SFX=(function(){
var ac=null,master=null,muted=false,lastWhoosh=0;
function init(){if(ac)return;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{ac=new AC();master=ac.createGain();master.gain.value=0.55;master.connect(ac.destination);}catch(e){ac=null;}}
function resume(){init();if(ac&&ac.state==='suspended')ac.resume();}
function ok(){return ac&&!muted;}
function now(){return ac.currentTime;}
function noise(dur){var n=Math.max(1,Math.floor(ac.sampleRate*dur));var buf=ac.createBuffer(1,n,ac.sampleRate);var d=buf.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;return buf;}
function gainNode(peak,atk,dur,delay){var gn=ac.createGain();var t0=now()+(delay||0);gn.gain.setValueAtTime(0.0001,t0);gn.gain.exponentialRampToValueAtTime(Math.max(0.001,peak),t0+atk);gn.gain.exponentialRampToValueAtTime(0.0001,t0+atk+dur);return gn;}
function tone(type,f0,f1,dur,peak,atk,delay){if(!ok())return;var o=ac.createOscillator();o.type=type;var t0=now()+(delay||0);o.frequency.setValueAtTime(f0,t0);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur*0.85);var gn=gainNode(peak,atk,dur,delay||0);o.connect(gn);gn.connect(master);o.start(t0);o.stop(t0+dur+atk+0.05);}
function noiseFx(dur,ftype,f0,f1,peak,atk,delay,q){if(!ok())return;var src=ac.createBufferSource();src.buffer=noise(dur);var f=ac.createBiquadFilter();f.type=ftype;f.Q.value=q||0.9;var t0=now()+(delay||0);f.frequency.setValueAtTime(f0,t0);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t0+dur*0.9);var gn=gainNode(peak,atk,dur,delay||0);src.connect(f);f.connect(gn);gn.connect(master);src.start(t0);}
return {
resume:resume,toggle:function(){muted=!muted;if(master)master.gain.value=muted?0:0.55;return muted;},
slice:function(){if(!ok())return;var p=0.85+Math.random()*0.45;noiseFx(0.13,'lowpass',3600*p,420,0.5,0.004);noiseFx(0.05,'highpass',4200,null,0.16,0.002);tone('sine',140+Math.random()*130,55,0.1,0.28,0.004);},
whoosh:function(){if(!ok())return;var t=performance.now();if(t-lastWhoosh<85)return;lastWhoosh=t;noiseFx(0.2,'bandpass',240,1500,0.1,0.05,0,1.4);},
boom:function(){if(!ok())return;noiseFx(0.75,'lowpass',9000,55,0.95,0.008);tone('sine',160,30,0.5,0.85,0.01);noiseFx(0.05,'highpass',2500,null,0.4,0.002);tone('square',90,28,0.3,0.22,0.005);},
miss:function(){if(!ok())return;tone('triangle',290,120,0.28,0.32,0.01);noiseFx(0.14,'lowpass',500,160,0.28,0.005);},
tick:function(){if(!ok())return;tone('square',880,null,0.05,0.22,0.002);noiseFx(0.02,'highpass',3000,null,0.12,0.001);},
go:function(){if(!ok())return;tone('sine',392,null,0.9,0.35,0.005);tone('sine',588,null,0.7,0.18,0.005);noiseFx(0.45,'lowpass',1400,300,0.12,0.05);},
blip:function(n){if(!ok())return;var f=430+Math.min(n,24)*38;tone('sine',f,null,0.07,0.12,0.003);},
fanfare:function(n){if(!ok())return;var notes=[523,659,784,988,1175,1319];var c=Math.min(n,6);for(var i=0;i<c;i++)tone('triangle',notes[i],null,0.16,0.24,0.004,i*0.06);},
frenzy:function(){if(!ok())return;var f=320;for(var i=0;i<8;i++){tone('triangle',f,null,0.1,0.2,0.004,i*0.05);f*=1.21;}noiseFx(0.5,'highpass',5000,null,0.05,0.1);},
freeze:function(){if(!ok())return;tone('sine',1900,850,0.5,0.2,0.01);tone('sine',2500,1300,0.45,0.12,0.01,0.07);noiseFx(0.4,'highpass',6500,null,0.05,0.08);},
over:function(){if(!ok())return;var notes=[392,330,262,196];for(var i=0;i<notes.length;i++)tone('triangle',notes[i],null,0.3,0.26,0.01,i*0.21);},
tap:function(){if(!ok())return;tone('square',1150,null,0.04,0.12,0.002);}
};
})();

function random(min,max){return Math.random()*(max-min)+min;}
function distSeg(px,py,x1,y1,x2,y2){var dx=x2-x1,dy=y2-y1;var l2=dx*dx+dy*dy;if(l2===0)return Math.hypot(px-x1,py-y1);var t=((px-x1)*dx+(py-y1)*dy)/l2;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(x1+t*dx),py-(y1+t*dy));}
var seed=13;function srand(){seed=(seed*9301+49297)%233280;return seed/233280;}
function dome(c,rr){c.beginPath();c.arc(0,0,rr,PI,0);c.closePath();}
function domeE(c,rx,ry){c.beginPath();c.ellipse(0,0,rx,ry,0,PI,0);c.closePath();}
function gloss(c,r){c.strokeStyle='rgba(255,255,255,0.4)';c.lineWidth=Math.max(2,r*0.08);c.lineCap='round';c.beginPath();c.arc(0,0,r*0.68,PI*1.08,PI*1.42);c.stroke();}
function rim(c,r){c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=2;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();}
function sparkleAt(c,x,y,s,color,alpha){c.save();c.translate(x,y);c.globalAlpha=Math.max(0,alpha);c.fillStyle=color;c.beginPath();c.moveTo(0,-s);c.lineTo(s*0.28,-s*0.28);c.lineTo(s,0);c.lineTo(s*0.28,s*0.28);c.lineTo(0,s);c.lineTo(-s*0.28,s*0.28);c.lineTo(-s,0);c.lineTo(-s*0.28,-s*0.28);c.closePath();c.fill();c.restore();}

function drawMelon(c,r){var g=c.createRadialGradient(-r*0.35,-r*0.4,r*0.15,0,0,r*1.05);g.addColorStop(0,'#b6e35c');g.addColorStop(0.65,'#67b132');g.addColorStop(1,'#3c7d23');c.beginPath();c.arc(0,0,r,0,TAU);c.fillStyle=g;c.fill();c.save();c.beginPath();c.arc(0,0,r*0.985,0,TAU);c.clip();c.strokeStyle='#2c6b1e';c.lineWidth=r*0.17;c.lineCap='round';for(var i=-2;i<=2;i++){var x=i*r*0.42;c.beginPath();c.moveTo(x-r*0.06,-r);c.quadraticCurveTo(x+(i%2===0?r*0.12:-r*0.12),0,x-r*0.06,r);c.stroke();}c.restore();gloss(c,r);rim(c,r);}
function drawMelonHalf(c,r){dome(c,r);c.fillStyle='#2c6b1e';c.fill();dome(c,r*0.92);c.fillStyle='#dff2c8';c.fill();dome(c,r*0.84);c.fillStyle='#ff4b57';c.fill();dome(c,r*0.45);c.fillStyle='#ff5f6b';c.fill();var seeds=[[-0.5,-0.32],[-0.22,-0.55],[0.15,-0.5],[0.45,-0.28],[-0.34,-0.14],[0.08,-0.22],[0.32,-0.62]];c.fillStyle='#2b1a10';for(var i=0;i<seeds.length;i++){var sx=seeds[i][0]*r,sy=seeds[i][1]*r;c.beginPath();c.ellipse(sx,sy,r*0.045,r*0.09,Math.atan2(sy,sx),0,TAU);c.fill();}}
function drawOrange(c,r){var g=c.createRadialGradient(-r*0.3,-r*0.35,r*0.15,0,0,r);g.addColorStop(0,'#ffbe4d');g.addColorStop(0.7,'#f57c00');g.addColorStop(1,'#e65100');c.beginPath();c.arc(0,0,r,0,TAU);c.fillStyle=g;c.fill();c.fillStyle='rgba(255,255,255,0.16)';for(var i=0;i<12;i++){var a=i*2.62+0.4;var d=r*(0.3+((i*53)%43)/100);c.beginPath();c.arc(Math.cos(a)*d,Math.sin(a)*d,r*0.035,0,TAU);c.fill();}c.save();c.translate(r*0.08,-r*0.92);c.rotate(-0.55);c.fillStyle='#388e3c';c.beginPath();c.ellipse(0,0,r*0.32,r*0.13,0,0,TAU);c.fill();c.strokeStyle='#2e7d32';c.lineWidth=1.5;c.stroke();c.restore();c.fillStyle='#5d4037';c.beginPath();c.arc(0,-r*0.9,r*0.06,0,TAU);c.fill();gloss(c,r);rim(c,r);}
function citrusHalf(c,r,rind,pith,flesh){dome(c,r);c.fillStyle=rind;c.fill();dome(c,r*0.9);c.fillStyle=pith;c.fill();dome(c,r*0.82);c.fillStyle=flesh;c.fill();c.strokeStyle=pith;c.lineWidth=r*0.055;c.lineCap='round';var angs=[PI+0.45,PI+0.95,PI+1.57,PI+2.19,PI+2.69];for(var i=0;i<angs.length;i++){var a=angs[i];c.beginPath();c.moveTo(Math.cos(a)*r*0.1,Math.sin(a)*r*0.1);c.lineTo(Math.cos(a)*r*0.72,Math.sin(a)*r*0.72);c.stroke();}c.fillStyle=pith;c.beginPath();c.arc(0,0,r*0.09,0,TAU);c.fill();}
function drawOrangeHalf(c,r){citrusHalf(c,r,'#f57c00','#ffeccf','#ffa733');}
function drawLemonHalf(c,r){citrusHalf(c,r,'#fbc02d','#fdf7d9','#f5df55');}
function drawLemon(c,r){var g=c.createRadialGradient(-r*0.3,-r*0.3,r*0.1,0,0,r*1.1);g.addColorStop(0,'#fff59d');g.addColorStop(0.55,'#ffe234');g.addColorStop(1,'#f4b400');c.beginPath();c.ellipse(0,0,r*0.95,r*0.78,0,0,TAU);c.fillStyle=g;c.fill();c.strokeStyle='#e0a010';c.lineWidth=2;c.stroke();c.fillStyle='#fbc02d';c.beginPath();c.arc(-r*0.93,0,r*0.13,0,TAU);c.fill();c.beginPath();c.arc(r*0.93,0,r*0.13,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,0.5)';c.beginPath();c.ellipse(-r*0.35,-r*0.35,r*0.2,r*0.09,-0.6,0,TAU);c.fill();}
function drawApple(c,r){var g=c.createRadialGradient(-r*0.35,-r*0.4,r*0.12,0,0,r*1.05);g.addColorStop(0,'#ff8a80');g.addColorStop(0.6,'#e53935');g.addColorStop(1,'#b71c1c');c.beginPath();c.arc(0,0,r,0,TAU);c.fillStyle=g;c.fill();c.strokeStyle='#5d4037';c.lineWidth=Math.max(2,r*0.09);c.lineCap='round';c.beginPath();c.moveTo(0,-r*0.8);c.quadraticCurveTo(r*0.06,-r*1.02,r*0.16,-r*1.1);c.stroke();c.fillStyle='#7cb342';c.beginPath();c.ellipse(r*0.3,-r,r*0.24,r*0.1,-0.4,0,TAU);c.fill();c.strokeStyle='#558b2f';c.lineWidth=1.5;c.stroke();gloss(c,r);rim(c,r);}
function drawAppleHalf(c,r){dome(c,r);c.fillStyle='#d32f2f';c.fill();dome(c,r*0.93);c.fillStyle='#f7edcf';c.fill();c.fillStyle='#efe0bd';c.beginPath();c.ellipse(0,-r*0.3,r*0.14,r*0.22,0,0,TAU);c.fill();c.fillStyle='#4e342e';c.beginPath();c.ellipse(-r*0.15,-r*0.32,r*0.045,r*0.09,0.4,0,TAU);c.fill();c.beginPath();c.ellipse(r*0.15,-r*0.32,r*0.045,r*0.09,-0.4,0,TAU);c.fill();c.strokeStyle='rgba(160,120,60,0.35)';c.lineWidth=1;for(var i=0;i<5;i++){var a=PI+(i+0.5)/5*PI;c.beginPath();c.moveTo(0,-r*0.3);c.lineTo(Math.cos(a)*r*0.32,-r*0.3+Math.sin(a)*r*0.32);c.stroke();}}
function drawKiwi(c,r){var g=c.createRadialGradient(-r*0.25,-r*0.3,r*0.1,0,0,r*1.05);g.addColorStop(0,'#9a7b4f');g.addColorStop(1,'#6d532f');c.beginPath();c.ellipse(0,0,r*0.92,r,0,0,TAU);c.fillStyle=g;c.fill();c.strokeStyle='rgba(70,52,28,0.9)';c.lineWidth=1;for(var i=0;i<26;i++){var a=i/26*TAU;var ex=Math.cos(a)*r*0.92,ey=Math.sin(a)*r;c.beginPath();c.moveTo(ex,ey);c.lineTo(ex*1.09,ey*1.09);c.stroke();}c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=2;c.beginPath();c.ellipse(0,0,r*0.92,r,0,0,TAU);c.stroke();}
function drawKiwiHalf(c,r){domeE(c,r*0.92,r);c.fillStyle='#7a5c3e';c.fill();domeE(c,r*0.85,r*0.93);c.fillStyle='#8bc34a';c.fill();c.strokeStyle='rgba(240,255,220,0.35)';c.lineWidth=1;for(var i=0;i<9;i++){var a=PI+(i+0.5)/9*PI;c.beginPath();c.moveTo(Math.cos(a)*r*0.22,Math.sin(a)*r*0.24);c.lineTo(Math.cos(a)*r*0.55,Math.sin(a)*r*0.6);c.stroke();}domeE(c,r*0.22,r*0.24);c.fillStyle='#f1f8dc';c.fill();c.fillStyle='#1a1a1a';for(var j=0;j<9;j++){var a2=PI+(j+0.5)/9*PI;c.beginPath();c.arc(Math.cos(a2)*r*0.4,Math.sin(a2)*r*0.43,r*0.035,0,TAU);c.fill();}}
function drawPineapple(c,r){for(var i=-2;i<=2;i++){var bx=i*r*0.15,by=-r*0.78;var tx=i*r*0.34,ty=-r*1.28-(2-Math.abs(i))*r*0.14;c.beginPath();c.moveTo(bx-r*0.14,by);c.lineTo(tx,ty);c.lineTo(bx+r*0.14,by);c.closePath();c.fillStyle=i===0?'#388e3c':'#2e7d32';c.fill();}var g=c.createRadialGradient(-r*0.25,-r*0.15,r*0.1,0,r*0.1,r*1.15);g.addColorStop(0,'#ffe082');g.addColorStop(0.6,'#f9a825');g.addColorStop(1,'#c88511');c.beginPath();c.ellipse(0,r*0.12,r*0.78,r*0.92,0,0,TAU);c.fillStyle=g;c.fill();c.save();c.beginPath();c.ellipse(0,r*0.12,r*0.78,r*0.92,0,0,TAU);c.clip();c.strokeStyle='rgba(140,84,10,0.5)';c.lineWidth=r*0.05;for(var k=-6;k<=6;k++){var x0=-r+r*0.32*k;c.beginPath();c.moveTo(x0-r*1.1,-r*0.9);c.lineTo(x0+r*1.1,r*1.1);c.stroke();c.beginPath();c.moveTo(x0+r*1.1,-r*0.9);c.lineTo(x0-r*1.1,r*1.1);c.stroke();}c.restore();c.strokeStyle='rgba(90,55,10,0.6)';c.lineWidth=2;c.beginPath();c.ellipse(0,r*0.12,r*0.78,r*0.92,0,0,TAU);c.stroke();}
function drawPineappleHalf(c,r){domeE(c,r*0.78,r*0.95);c.fillStyle='#e0a32e';c.fill();domeE(c,r*0.66,r*0.82);c.fillStyle='#ffe691';c.fill();c.strokeStyle='#fff3c4';c.lineWidth=r*0.045;var angs=[PI+0.4,PI+0.9,PI+1.57,PI+2.24,PI+2.74];for(var i=0;i<angs.length;i++){var a=angs[i];c.beginPath();c.moveTo(Math.cos(a)*r*0.14,Math.sin(a)*r*0.16);c.lineTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.7);c.stroke();}domeE(c,r*0.16,r*0.18);c.fillStyle='#fff3c4';c.fill();}
function drawCoconut(c,r){var g=c.createRadialGradient(-r*0.3,-r*0.35,r*0.1,0,0,r);g.addColorStop(0,'#9c7860');g.addColorStop(0.6,'#5d4037');g.addColorStop(1,'#3e2723');c.beginPath();c.arc(0,0,r,0,TAU);c.fillStyle=g;c.fill();c.strokeStyle='rgba(40,25,18,0.55)';c.lineWidth=r*0.06;c.beginPath();c.arc(0,0,r*0.55,0.3,1.3);c.stroke();c.beginPath();c.arc(0,0,r*0.55,PI+0.3,PI+1.3);c.stroke();c.beginPath();c.arc(0,0,r*0.62,2.3,3.1);c.stroke();c.fillStyle='#2d1b14';c.beginPath();c.arc(-r*0.22,-r*0.28,r*0.07,0,TAU);c.fill();c.beginPath();c.arc(r*0.22,-r*0.28,r*0.07,0,TAU);c.fill();c.beginPath();c.arc(0,-r*0.05,r*0.07,0,TAU);c.fill();gloss(c,r*0.9);rim(c,r);}
function drawCoconutHalf(c,r){dome(c,r);c.fillStyle='#5d4037';c.fill();dome(c,r*0.88);c.fillStyle='#f7f2e7';c.fill();c.strokeStyle='rgba(120,100,80,0.5)';c.lineWidth=r*0.05;c.beginPath();c.arc(0,0,r*0.7,PI,0);c.stroke();}
function berryPath(c,s){c.beginPath();c.moveTo(0,-0.55*s);c.bezierCurveTo(0.9*s,-0.75*s,0.85*s,0.35*s,0,0.95*s);c.bezierCurveTo(-0.85*s,0.35*s,-0.9*s,-0.75*s,0,-0.55*s);c.closePath();}
function drawStrawberry(c,r){var g=c.createRadialGradient(-r*0.25,-r*0.2,r*0.1,0,0,r*1.1);g.addColorStop(0,'#ff6f6f');g.addColorStop(0.7,'#e53935');g.addColorStop(1,'#b71c1c');berryPath(c,r);c.fillStyle=g;c.fill();c.strokeStyle='rgba(120,10,10,0.5)';c.lineWidth=1.5;c.stroke();c.fillStyle='#ffe9a8';var sp=[[-0.42,-0.28],[-0.15,-0.38],[0.15,-0.38],[0.42,-0.28],[-0.55,0.0],[-0.25,-0.05],[0.05,-0.08],[0.35,-0.05],[0.58,0.06],[-0.35,0.28],[-0.05,0.25],[0.28,0.3],[-0.15,0.55],[0.12,0.58]];for(var i=0;i<sp.length;i++){c.beginPath();c.ellipse(sp[i][0]*r,sp[i][1]*r,r*0.032,r*0.055,sp[i][0]*0.8,0,TAU);c.fill();}c.fillStyle='#43a047';for(var j=-2;j<=2;j++){c.beginPath();c.moveTo(j*r*0.16,-r*0.52);c.lineTo(j*r*0.3,-r*0.88);c.lineTo(j*r*0.16+r*0.14,-r*0.5);c.closePath();c.fill();}c.strokeStyle='#66bb6a';c.lineWidth=1;c.beginPath();c.moveTo(0,-r*0.55);c.lineTo(0,-r*0.85);c.stroke();}
function drawStrawberryHalf(c,r){berryPath(c,r*0.98);c.fillStyle='#ffd7da';c.fill();berryPath(c,r*0.98);c.strokeStyle='#d32f2f';c.lineWidth=r*0.12;c.stroke();c.fillStyle='rgba(255,255,255,0.85)';c.beginPath();c.ellipse(0,r*0.1,r*0.07,r*0.42,0,0,TAU);c.fill();}
function bananaPath(c,r){c.beginPath();c.moveTo(-r*0.85,-r*0.35);c.quadraticCurveTo(0,r*1.05,r*0.85,-r*0.35);c.quadraticCurveTo(0,r*0.32,-r*0.85,-r*0.35);c.closePath();}
function drawBanana(c,r){bananaPath(c,r);var g=c.createLinearGradient(0,-r*0.3,0,r*0.8);g.addColorStop(0,'#fff176');g.addColorStop(0.5,'#ffe135');g.addColorStop(1,'#f5c518');c.fillStyle=g;c.fill();c.strokeStyle='#c99700';c.lineWidth=2;c.stroke();c.strokeStyle='rgba(160,110,10,0.35)';c.lineWidth=1.5;c.beginPath();c.moveTo(-r*0.55,-r*0.2);c.quadraticCurveTo(0,r*0.8,r*0.55,-r*0.2);c.stroke();c.beginPath();c.moveTo(-r*0.3,-r*0.1);c.quadraticCurveTo(0,r*0.55,r*0.3,-r*0.1);c.stroke();c.fillStyle='#6d4c41';c.beginPath();c.arc(-r*0.85,-r*0.35,r*0.09,0,TAU);c.fill();c.beginPath();c.arc(r*0.85,-r*0.35,r*0.09,0,TAU);c.fill();}
function drawBananaPiece(c,r){c.beginPath();c.moveTo(-r*0.7,-r*0.18);c.quadraticCurveTo(0,r*0.8,r*0.7,-r*0.18);c.quadraticCurveTo(0,r*0.28,-r*0.7,-r*0.18);c.closePath();c.fillStyle='#f9eec4';c.fill();c.strokeStyle='#d9b83a';c.lineWidth=2;c.stroke();c.fillStyle='#8a6d3b';c.beginPath();c.arc(-r*0.7,-r*0.18,r*0.08,0,TAU);c.fill();c.beginPath();c.arc(r*0.7,-r*0.18,r*0.08,0,TAU);c.fill();}
function drawSpecialBanana(c,r,kind){var body,edge,glow,spark;if(kind==='frenzy'){body='#ffca28';edge='#f57f17';glow='#ffd740';spark='#fff8e1';}else{body='#81d4fa';edge='#0277bd';glow='#4fc3f7';spark='#ffffff';}c.save();c.shadowColor=glow;c.shadowBlur=16;bananaPath(c,r);var g=c.createLinearGradient(0,-r*0.4,0,r*0.9);g.addColorStop(0,'#ffffff');g.addColorStop(0.25,body);g.addColorStop(1,edge);c.fillStyle=g;c.fill();c.shadowBlur=0;c.strokeStyle=edge;c.lineWidth=2;c.stroke();c.fillStyle='#5d4037';c.beginPath();c.arc(-r*0.85,-r*0.35,r*0.08,0,TAU);c.fill();c.beginPath();c.arc(r*0.85,-r*0.35,r*0.08,0,TAU);c.fill();for(var i=0;i<3;i++){var a=gt*2.2+i*2.09;var sx=Math.cos(a)*r*1.15;var sy=Math.sin(a)*r*0.85-r*0.1;var tw=0.6+0.4*Math.sin(gt*7+i*2);sparkleAt(c,sx,sy,r*0.14*tw+2,spark,0.9);}c.restore();}
function drawBomb(c,r){var pulse=0.5+0.5*Math.sin(gt*9);c.save();c.globalAlpha=0.18+0.22*pulse;c.fillStyle='#ff3b30';c.beginPath();c.arc(0,0,r*1.22,0,TAU);c.fill();c.restore();var g=c.createRadialGradient(-r*0.3,-r*0.35,r*0.1,0,0,r);g.addColorStop(0,'#707070');g.addColorStop(0.55,'#2a2a2a');g.addColorStop(1,'#0a0a0a');c.beginPath();c.arc(0,0,r,0,TAU);c.fillStyle=g;c.fill();c.strokeStyle='#000';c.lineWidth=2;c.stroke();c.strokeStyle='rgba(255,255,255,0.45)';c.lineWidth=Math.max(2,r*0.09);c.lineCap='round';c.beginPath();c.arc(0,0,r*0.66,PI*1.05,PI*1.45);c.stroke();c.strokeStyle='#8d6e63';c.lineWidth=Math.max(2,r*0.12);c.beginPath();c.moveTo(0,-r*0.92);c.quadraticCurveTo(r*0.3,-r*1.25,r*0.55,-r*1.08);c.stroke();var sx=r*0.55,sy=-r*1.08;c.fillStyle='#ffb300';c.globalAlpha=0.5+0.5*pulse;c.beginPath();c.arc(sx,sy,r*0.16+pulse*r*0.08,0,TAU);c.fill();c.globalAlpha=1;for(var i=0;i<7;i++){var a=Math.random()*TAU;var ln=r*(0.1+Math.random()*0.2);c.strokeStyle=i%2?'#fff176':'#ff9800';c.lineWidth=2;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a)*ln,sy+Math.sin(a)*ln);c.stroke();}}

var FRUITS=[
{r:48,pts:10,juice:'#ff5464',whole:drawMelon,half:drawMelonHalf},
{r:36,pts:11,juice:'#ffa733',whole:drawOrange,half:drawOrangeHalf},
{r:33,pts:11,juice:'#ffe14d',whole:drawLemon,half:drawLemonHalf},
{r:34,pts:10,juice:'#ffd9a0',whole:drawApple,half:drawAppleHalf},
{r:33,pts:13,juice:'#9ccc65',whole:drawKiwi,half:drawKiwiHalf},
{r:41,pts:15,juice:'#ffe082',whole:drawPineapple,half:drawPineappleHalf},
{r:35,pts:14,juice:'#f5f0e6',whole:drawCoconut,half:drawCoconutHalf},
{r:32,pts:12,juice:'#ff6b81',whole:drawStrawberry,half:drawStrawberryHalf},
{r:38,pts:15,juice:'#ffe98a',whole:drawBanana,half:drawBananaPiece}
];

var state='menu',gt=0,last=0;
var fruits=[],halves=[],particles=[],splats=[],popups=[],rings=[],trail=[];
var menuAmb=[],melonFruit=null,melonSliced=false,menuT=0,ambT=1,startDelay=0;
var score=0,misses=0,streak=0,streakT=0,maxStreak=0,fruitsSliced=0;
var playTime=0,spawnT=0,specialCd=0,frenzyLeft=0,frenzyT=0,freezeT=0;
var swipeHits=0,pointerDown=false,lastPt=null;
var banner=null,countT=0,lastCount=99;
var endT=0,endReason='';
var flashT=0,flashColor='255,255,255',shakeT=0,missPop=0;
var newRecord=false;

function loadBest(){try{var v=parseInt(localStorage.getItem('fs_best'),10);return isNaN(v)?0:v;}catch(e){return 0;}}
function saveBest(v){try{localStorage.setItem('fs_best',String(v));}catch(e){}}
var bestScore=loadBest();
topBest.textContent=bestScore;

function renderBG(){
var c=bg.getContext('2d');
c.setTransform(dpr,0,0,dpr,0,0);
seed=13;
var base=c.createLinearGradient(0,0,0,H);
base.addColorStop(0,'#7a4e26');base.addColorStop(0.5,'#66401e');base.addColorStop(1,'#4e2f14');
c.fillStyle=base;c.fillRect(0,0,W,H);
var planks=Math.max(5,Math.round(H/95));
var ph=H/planks;
for(var i=0;i<planks;i++){
var y0=i*ph;var t2=(srand()-0.5)*0.14;c.fillStyle=t2>0?'rgba(230,180,110,'+t2.toFixed(3)+')':'rgba(10,5,2,'+(-t2).toFixed(3)+')';c.fillRect(0,y0,W,ph);
c.fillStyle='rgba(20,10,4,0.85)';c.fillRect(0,y0-1.5,W,3);
c.strokeStyle='rgba(35,18,8,0.25)';c.lineWidth=1;var lines=4+(srand()*3|0);for(var l=0;l<lines;l++){var gy=y0+ph*(0.15+srand()*0.7);c.beginPath();c.moveTo(-10,gy);for(var sgm=1;sgm<=5;sgm++){var xx=(sgm/5)*(W+20)-10;c.quadraticCurveTo(xx-(W+20)/10,gy+(srand()-0.5)*8,xx,gy+(srand()-0.5)*5);}c.stroke();}
if(srand()<0.5){var kx=srand()*W,ky=y0+ph*(0.3+srand()*0.4);c.strokeStyle='rgba(30,15,6,0.5)';c.lineWidth=2;c.beginPath();c.ellipse(kx,ky,ph*0.09,ph*0.05,srand()*PI,0,TAU);c.stroke();c.beginPath();c.ellipse(kx,ky,ph*0.04,ph*0.022,0,0,TAU);c.stroke();}
}
var vg=c.createRadialGradient(W/2,H*0.42,Math.min(W,H)*0.25,W/2,H*0.5,Math.max(W,H)*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.55)');c.fillStyle=vg;c.fillRect(0,0,W,H);
var tl=c.createLinearGradient(0,0,0,H*0.3);tl.addColorStop(0,'rgba(255,235,200,0.10)');tl.addColorStop(1,'rgba(255,235,200,0)');c.fillStyle=tl;c.fillRect(0,0,W,H*0.3);
}

renderBG();

function launchOne(opt){
opt=opt||{};
if(fruits.length>=16)return;
var def=null;
if(!opt.bomb&&!opt.special)def=FRUITS[(Math.random()*FRUITS.length)|0];
var r=opt.bomb?36*SIZE_SCALE*0.9:opt.special?40*SIZE_SCALE*0.85:def.r*SIZE_SCALE*(1+Math.random()*0.15);
var x=random(r+10,Math.max(r+11,W-r-10));
var grav=random(GRAV_MIN,GRAV_MAX);
var apexY=random(H*APEX_TOP,H*APEX_BOT);
var vy=-Math.sqrt(2*grav*(H+r-apexY));
var vx=(W/2-x)*random(0.04,0.14)+random(-35,35);
fruits.push({
x:x,
y:H+r+8,
vx:vx,
vy:vy,
r:r,
grav:grav,
rot:random(0,TAU),
spin:random(-2.2,2.2),
def:def,
bomb:!!opt.bomb,
special:opt.special||null
});
SFX.whoosh();
}

function launchMenuFruit(){
var def=FRUITS[(Math.random()*FRUITS.length)|0];
var r=def.r*0.85;
var x=random(r+8,Math.max(r+9,W-r-8));
var grav=600;
menuAmb.push({
x:x,
y:H+r,
vx:random(-30,30),
vy:-Math.sqrt(2*grav*H*0.5),
r:r,
grav:grav,
rot:random(0,TAU),
spin:random(-1.6,1.6),
def:def,
bomb:false,
special:null
});
SFX.whoosh();
}

function doSpawn(){
var t=playTime;
var p=Math.random();
var count=p<0.55?1:(p<0.85?2:3);
if(t<4)count=1;
if(t<10)count=Math.min(count,2);
for(var i=0;i<count;i++){
if(fruits.length>=16)break;
var isBomb=false,isSpecial=null;
if(frenzyLeft<=0){
var bombCh=t<6?0:Math.min(0.14,0.04+t*0.001);
if(Math.random()<bombCh)isBomb=true;
else if(t>12&&specialCd<=0&&Math.random()<0.033){
isSpecial=Math.random()<0.5?'frenzy':'freeze';
specialCd=20;
}
}
launchOne({bomb:isBomb,special:isSpecial});
}
}

function nextInterval(){
return Math.max(SPAWN_MIN,SPAWN_BASE-playTime*0.005)*random(0.9,1.15);
}

function spawnHalves(f,ang){
var nx=Math.sin(ang),ny=-Math.cos(ang);
var sep=110+Math.random()*70;
var drawF=f.special?drawBananaPiece:(f.def?f.def.half:drawBananaPiece);
halves.push({
x:f.x+nx*f.r*0.4,
y:f.y+ny*f.r*0.4,
vx:f.vx*0.5+nx*sep,
vy:f.vy*0.4+ny*sep-40,
r:f.r*0.85,
rot:ang,
spin:f.spin+random(-1.2,1.2),
grav:f.grav*0.85,
life:1,
draw:drawF
});
halves.push({
x:f.x-nx*f.r*0.4,
y:f.y-ny*f.r*0.4,
vx:f.vx*0.5-nx*sep,
vy:f.vy*0.4-ny*sep-40,
r:f.r*0.85,
rot:ang+PI,
spin:f.spin+random(-1.2,1.2),
grav:f.grav*0.85,
life:1,
draw:drawF
});
}

function spawnJuice(f,color){
var n=14+(Math.random()*8|0);
for(var i=0;i<n;i++){
particles.push({
x:f.x,
y:f.y,
vx:random(-230,230)+f.vx*0.3,
vy:random(-260,60)+f.vy*0.3,
size:random(2,5.5),
life:1,
decay:random(0.9,1.8),
color:color
});
}
}

function addSplat(x,y,color,size){
var blobs=[{dx:0,dy:0,rx:size*0.42,ry:size*0.34,rot:Math.random()*TAU}];
var n=6+(Math.random()*4|0);
for(var i=0;i<n;i++){
var a=Math.random()*TAU;
var d=Math.random()*size*0.9;
blobs.push({
dx:Math.cos(a)*d,
dy:Math.sin(a)*d,
rx:size*(0.12+Math.random()*0.22),
ry:size*(0.08+Math.random()*0.18),
rot:Math.random()*TAU
});
}
splats.push({x:x,y:y,color:color,blobs:blobs,life:1});
if(splats.length>26)splats.shift();
}

function setBanner(text,sub,dur,color,size){
banner={text:text,sub:sub||'',t:0,dur:dur||1,color:color||'#ffd54f',size:size||46};
}

function tryTap(x,y){
var hit=false;
if(state==='menu'){
if(melonFruit){
if(Math.hypot(melonFruit.x-x,melonFruit.y-y)<melonFruit.r*1.8){
sliceFruit(melonFruit,random(0,TAU),true);
return true;
}
}
for(var i=menuAmb.length-1;i>=0;i--){
var f=menuAmb[i];
if(Math.hypot(f.x-x,f.y-y)<f.r*1.6){
menuAmb.splice(i,1);
sliceFruit(f,random(0,TAU),true);
return true;
}
}
if(Math.hypot(W/2-x,H*0.42-y)<85||Math.hypot(W/2-x,H*0.68-y)<70){
if(melonFruit)sliceFruit(melonFruit,random(0,TAU),true);
return true;
}
}else if(state==='play'){
for(var j=fruits.length-1;j>=0;j--){
var g=fruits[j];
if(Math.hypot(g.x-x,g.y-y)<g.r*HIT_FAT){
fruits.splice(j,1);
if(g.bomb){
explode(g);
if(state!=='play')break;
}else{
sliceFruit(g,random(0,TAU),false);
}
hit=true;
}
}
}
return hit;
}

function trySlice(x1,y1,x2,y2){
var ang=Math.atan2(y2-y1,x2-x1);
if(state==='menu'){
if(melonFruit){
var d=distSeg(melonFruit.x,melonFruit.y,x1,y1,x2,y2);
if(d<melonFruit.r*HIT_FAT){
sliceFruit(melonFruit,ang,true);
return;
}
}
for(var i=menuAmb.length-1;i>=0;i--){
var f=menuAmb[i];
if(distSeg(f.x,f.y,x1,y1,x2,y2)<f.r*HIT_FAT){
menuAmb.splice(i,1);
sliceFruit(f,ang,true);
}
}
}else if(state==='play'){
for(var j=fruits.length-1;j>=0;j--){
var g=fruits[j];
if(distSeg(g.x,g.y,x1,y1,x2,y2)<g.r*HIT_FAT){
fruits.splice(j,1);
if(g.bomb){
explode(g);
if(state!=='play')break;
}else{
sliceFruit(g,ang,false);
}
}
}
}
}

function sliceFruit(f,ang,isMenu){
SFX.slice();
var juice=f.def?f.def.juice:'#ffd54f';
if(f.special)juice=f.special==='frenzy'?'#ffd54f':'#7ec8ff';
addSplat(f.x,f.y,juice,f.r);
spawnJuice(f,juice);
spawnHalves(f,ang);
rings.push({x:f.x,y:f.y,r:f.r*0.8,life:1});
if(isMenu){
if(f===melonFruit){
melonSliced=true;
melonFruit=null;
startDelay=0.55;
}
return;
}
swipeHits++;
streak++;
streakT=1.3;
if(streak>maxStreak)maxStreak=streak;
if(streak>=3)SFX.blip(streak);
if(f.special){
if(f.special==='frenzy'){
SFX.frenzy();
setBanner('FRENZY!','BUAH BANYAK! 🍉',1.3,'#ffd54f');
frenzyLeft=14;
frenzyT=0;
}else{
SFX.freeze();
setBanner('FREEZE!','WAKTU BEKU! ❄️',1.3,'#7ec8ff');
freezeT=6;
}
score+=5;
topScore.textContent=score;
popups.push({x:f.x,y:f.y-f.r*0.7,text:'+5',life:1});
for(var i=0;i<16;i++){
particles.push({
x:f.x,
y:f.y,
vx:random(-260,260),
vy:random(-260,120),
size:random(2,4),
life:1,
decay:random(1,2),
color:f.special==='frenzy'?'#fff1b0':'#d6efff'
});
}
return;
}
var mult=streak>=30?5:(streak>=20?4:(streak>=12?3:(streak>=6?2:1)));
var pts=f.def.pts*mult;
score+=pts;
topScore.textContent=score;
fruitsSliced++;
popups.push({x:f.x,y:f.y-f.r*0.7,text:'+'+pts,life:1});
}

function explode(f){
SFX.boom();
state='ending';
endT=1.3;
endReason='bomb';
flashT=1;
flashColor='255,90,20';
shakeT=0.7;
rings.push({x:f.x,y:f.y,r:f.r*0.6,life:1});
rings.push({x:f.x,y:f.y,r:f.r*0.2,life:1});
var cols=['#ffca28','#ff7043','#ff3b30','#bdbdbd','#757575'];
for(var i=0;i<60;i++){
particles.push({
x:f.x,
y:f.y,
vx:random(-520,520),
vy:random(-520,380),
size:random(2,7),
life:1,
decay:random(0.6,1.4),
color:cols[i%cols.length]
});
}
}

function fruitMissed(){
if(misses>=3)return;
misses++;
missPop=1;
streak=0;
SFX.miss();
if(misses>=3){
state='ending';
endT=1.0;
endReason='miss';
flashT=0.4;
flashColor='255,255,255';
}
}

function beginGame(){
fruits=[];halves=[];particles=[];splats=[];popups=[];rings=[];trail=[];banner=null;menuAmb=[];
score=0;misses=0;streak=0;streakT=0;maxStreak=0;fruitsSliced=0;swipeHits=0;
frenzyLeft=0;freezeT=0;specialCd=0;newRecord=false;flashT=0;shakeT=0;missPop=0;
topScore.textContent=0;
state='count';
countT=3.0;
lastCount=99;
}

function startPlay(){
state='play';
playTime=0;
spawnT=0.45;
}

function showOver(){
state='over';
SFX.over();
if(score>bestScore){
bestScore=score;
newRecord=true;
saveBest(bestScore);
topBest.textContent=bestScore;
}
ovTitle.textContent=endReason==='bomb'?'💥 BOOM!':'GAME OVER';
ovReason.textContent=endReason==='bomb'?'Kamu menebas bom!':'3 buah terlewat!';
ovScore.textContent=score;
ovBest.textContent=bestScore;
newTag.style.display=newRecord?'inline-block':'none';
ovStats.textContent='🍌 Buah ditebas: '+fruitsSliced+' • 🔥 Combo: x'+maxStreak;
over.classList.remove('hidden');
}

function toMenu(){
over.classList.add('hidden');
fruits=[];halves=[];particles=[];splats=[];popups=[];rings=[];trail=[];banner=null;
state='menu';
menuT=0;
ambT=1;
melonSliced=false;
startDelay=0;
melonFruit={x:W/2,y:H*0.42,r:62,vx:0,vy:-120,rot:0,spin:0,grav:900,def:FRUITS[0],bomb:false,special:null};
}

function updateFruits(dt,checkMiss){
for(var i=fruits.length-1;i>=0;i--){
var f=fruits[i];
f.vy+=f.grav*dt;
f.x+=f.vx*dt;
f.y+=f.vy*dt;
f.rot+=f.spin*dt;
if(f.x<f.r&&f.vx<0)f.vx=-f.vx*0.7;
if(f.x>W-f.r&&f.vx>0)f.vx=-f.vx*0.7;
if(f.y>H+f.r*2.5){
fruits.splice(i,1);
if(checkMiss&&!f.bomb&&!f.special)fruitMissed();
}
}
}

function updatePhysicsFX(dt){
for(var i=halves.length-1;i>=0;i--){
var h=halves[i];
h.vy+=h.grav*dt;
h.x+=h.vx*dt;
h.y+=h.vy*dt;
h.rot+=h.spin*dt;
h.life-=dt*0.8;
if(h.life<=0||h.y>H+h.r*4)halves.splice(i,1);
}
for(var j=particles.length-1;j>=0;j--){
var p=particles[j];
p.vy+=1000*dt;
p.x+=p.vx*dt;
p.y+=p.vy*dt;
p.life-=p.decay*dt;
if(p.life<=0)particles.splice(j,1);
}
}

function updateMetaFX(dt){
for(var i=popups.length-1;i>=0;i--){
var pp=popups[i];
pp.y-=70*dt;
pp.life-=dt*1.1;
if(pp.life<=0)popups.splice(i,1);
}
for(var j=splats.length-1;j>=0;j--){
splats[j].life-=dt/9;
if(splats[j].life<=0)splats.splice(j,1);
}
for(var k=rings.length-1;k>=0;k--){
rings[k].r+=560*dt;
rings[k].life-=dt*1.5;
if(rings[k].life<=0)rings.splice(k,1);
}
if(banner){
banner.t+=dt;
if(banner.t>=banner.dur)banner=null;
}
if(missPop>0)missPop-=dt*2.2;
if(flashT>0)flashT-=dt*2.4;
if(shakeT>0)shakeT-=dt*1.4;
var cutoff=performance.now()-150;
while(trail.length&&trail[0].t<cutoff)trail.shift();
}

function update(dt){
if(state==='menu'){
menuT+=dt;
ambT-=dt;
if(ambT<=0){
launchMenuFruit();
ambT=2.4+Math.random()*1.6;
}
if(melonFruit){
melonFruit.x=W/2;
melonFruit.y=H*0.42+Math.sin(menuT*1.7)*8;
melonFruit.rot+=dt*0.35;
}
for(var i=menuAmb.length-1;i>=0;i--){
var mf=menuAmb[i];
mf.vy+=mf.grav*dt;
mf.x+=mf.vx*dt;
mf.y+=mf.vy*dt;
mf.rot+=mf.spin*dt;
if(mf.y>H+mf.r*3)menuAmb.splice(i,1);
}
if(melonSliced){
startDelay-=dt;
if(startDelay<=0)beginGame();
}
updatePhysicsFX(dt);
updateMetaFX(dt);
}else if(state==='count'){
countT-=dt;
var n=Math.ceil(countT);
if(n>0&&n!==lastCount){
lastCount=n;
setBanner(String(n),'',0.85,'#ffca28',64);
SFX.tick();
}
if(countT<=0){
setBanner('TEBAS!','',0.7,'#9cff6b',64);
SFX.go();
startPlay();
}
updatePhysicsFX(dt);
updateMetaFX(dt);
}else if(state==='play'){
playTime+=dt;
specialCd-=dt;
if(freezeT>0)freezeT-=dt;
if(streak>0){
streakT-=dt;
if(streakT<=0)streak=0;
}
if(frenzyLeft>0){
frenzyT-=dt;
if(frenzyT<=0){
frenzyT=0.16;
frenzyLeft--;
launchOne({});
}
}else{
spawnT-=dt;
if(spawnT<=0){
doSpawn();
spawnT=nextInterval();
}
}
var ts=freezeT>0?(freezeT>1.2?0.35:(0.35+((1.2-freezeT)/1.2)*0.65)):1;
updateFruits(dt*ts,true);
updatePhysicsFX(dt*ts);
updateMetaFX(dt);
}else if(state==='ending'){
endT-=dt;
if(endT<=0)showOver();
updateFruits(dt*0.55,false);
updatePhysicsFX(dt*0.55);
updateMetaFX(dt);
}else if(state==='over'){
updateFruits(dt,false);
updatePhysicsFX(dt);
updateMetaFX(dt);
}
}

function txt(str,x,y,size,fill,stroke,lw,align){
ctx.font='900 '+size+'px "Arial Black","Arial Bold",Arial,sans-serif';
ctx.textAlign=align||'center';
ctx.textBaseline='middle';
ctx.lineJoin='round';
if(stroke){
ctx.strokeStyle=stroke;
ctx.lineWidth=lw||Math.max(3,size*0.18);
ctx.strokeText(str,x,y);
}
ctx.fillStyle=fill;
ctx.fillText(str,x,y);
}

function backOut(p){
var c=1.9;
var q=p-1;
return q*q*((c+1)*q+c)+1;
}

function drawFruitEntity(f){
ctx.save();
ctx.translate(f.x,f.y);
ctx.rotate(f.rot);
if(f.bomb)drawBomb(ctx,f.r);
else if(f.special)drawSpecialBanana(ctx,f.r,f.special);
else f.def.whole(ctx,f.r);
ctx.restore();
}

function drawSplats(){
for(var i=0;i<splats.length;i++){
var s=splats[i];
var a=Math.min(1,s.life*2.2)*0.5;
if(a<=0)continue;
ctx.globalAlpha=a;
ctx.fillStyle=s.color;
for(var j=0;j<s.blobs.length;j++){
var b=s.blobs[j];
ctx.beginPath();
ctx.ellipse(s.x+b.dx,s.y+b.dy,b.rx,b.ry,b.rot,0,TAU);
ctx.fill();
}
}
ctx.globalAlpha=1;
}

function drawParticles(){
for(var i=0;i<particles.length;i++){
var p=particles[i];
ctx.globalAlpha=Math.max(0,Math.min(1,p.life));
ctx.fillStyle=p.color;
ctx.beginPath();
ctx.arc(p.x,p.y,p.size*(0.35+0.65*Math.max(0,p.life)),0,TAU);
ctx.fill();
}
ctx.globalAlpha=1;
}

function drawTrail(){
var n=trail.length;
if(n<2)return;
ctx.lineCap='round';
ctx.lineJoin='round';
for(var i=1;i<n;i++){
var k=i/n;
ctx.globalAlpha=0.8*k;
ctx.strokeStyle='#ffffff';
ctx.lineWidth=1.5+9*k;
ctx.beginPath();
ctx.moveTo(trail[i-1].x,trail[i-1].y);
ctx.lineTo(trail[i].x,trail[i].y);
ctx.stroke();
if(k>0.55){
ctx.globalAlpha=0.9*k;
ctx.strokeStyle='#ffffff';
ctx.lineWidth=1.5+2.5*k;
ctx.beginPath();
ctx.moveTo(trail[i-1].x,trail[i-1].y);
ctx.lineTo(trail[i].x,trail[i].y);
ctx.stroke();
}
}
ctx.globalAlpha=1;
}

function drawHUD(){
txt('SKOR',16,22,11,'#ffd98a','#3b1f05',3,'left');
txt(String(score),16,52,36,'#ffffff','#3b1f05',7,'left');
if(streak>=2){
txt('COMBO x'+streak,18,82,17,'#ffca28','#3b1f05',4,'left');
}
for(var i=0;i<3;i++){
var x=W-22-i*36,y=32,s=11;
var filled=i<misses;
var sc=(filled&&i===misses-1)?(1+Math.max(0,missPop)*0.9):1;
ctx.save();
ctx.translate(x,y);
ctx.scale(sc,sc);
ctx.lineCap='round';
if(filled){
ctx.strokeStyle='rgba(255,255,255,0.9)';
ctx.lineWidth=8;
ctx.beginPath();
ctx.moveTo(-s,-s);
ctx.lineTo(s,s);
ctx.moveTo(s,-s);
ctx.lineTo(-s,s);
ctx.stroke();
ctx.strokeStyle='#e53935';
ctx.lineWidth=5;
ctx.beginPath();
ctx.moveTo(-s,-s);
ctx.lineTo(s,s);
ctx.moveTo(s,-s);
ctx.lineTo(-s,s);
ctx.stroke();
}else{
ctx.strokeStyle='rgba(255,255,255,0.28)';
ctx.lineWidth=4;
ctx.beginPath();
ctx.moveTo(-s,-s);
ctx.lineTo(s,s);
ctx.moveTo(s,-s);
ctx.lineTo(-s,s);
ctx.stroke();
}
ctx.restore();
}
}

function drawBanner(){
if(!banner)return;
var p=banner.t/banner.dur;
var s=p<0.15?backOut(p/0.15):(p>0.8?1-((p-0.8)/0.2)*0.1:1);
var alpha=p>0.72?1-((p-0.72)/0.28):1;
var bs=Math.min(banner.size||46,W*0.13);
ctx.save();
ctx.translate(W/2,H*0.35);
ctx.scale(Math.max(0.01,s),Math.max(0.01,s));
ctx.globalAlpha=Math.max(0,alpha);
txt(banner.text,0,0,bs,banner.color,'#2d1608',bs*0.2);
if(banner.sub)txt(banner.sub,0,bs*0.55,Math.min(19,W*0.05),'#fff7df','#2d1608',4);
ctx.restore();
}

function drawMenuTexts(){
txt('FRUIT',W/2,H*0.13,Math.min(52,W*0.14),'#ffca28','#3b1f05',8);
txt('SLASH',W/2,H*0.22,Math.min(52,W*0.14),'#9cff6b','#1b4d13',8);
txt('KETUK • COMBO • HINDARI BOM',W/2,H*0.30,Math.min(13,W*0.038),'#e8d5b0','#241407',3);
var pa=0.6+0.4*Math.sin(gt*3.5);
txt('👆 KETUK SEMANGKA UNTUK MULAI!',W/2,H*0.68,Math.min(17,W*0.046),'rgba(255,244,214,'+pa.toFixed(3)+')','#3b1f05',4);
txt('🏆 REKOR: '+bestScore,W/2,H*0.76,Math.min(15,W*0.042),'#ffd98a','#3b1f05',4);
txt('🔊 Nyalakan volume untuk SFX',W/2,H*0.93,11,'rgba(255,240,210,0.55)',null,0);
}

function draw(){
ctx.clearRect(0,0,W,H);
ctx.save();
if(shakeT>0){
var pw=shakeT*14;
ctx.translate((Math.random()-0.5)*pw,(Math.random()-0.5)*pw);
}
ctx.drawImage(bg,0,0,W,H);
drawSplats();
for(var i=0;i<halves.length;i++){
var h=halves[i];
ctx.save();
ctx.globalAlpha=Math.max(0,Math.min(1,h.life*1.5));
ctx.translate(h.x,h.y);
ctx.rotate(h.rot);
h.draw(ctx,h.r);
ctx.restore();
}
for(var j=0;j<fruits.length;j++)drawFruitEntity(fruits[j]);
if(state==='menu'){
if(melonFruit){
ctx.save();
ctx.globalAlpha=0.2+0.12*Math.sin(gt*3);
ctx.fillStyle='#ffd54f';
ctx.beginPath();ctx.arc(melonFruit.x,melonFruit.y,melonFruit.r*1.5,0,TAU);ctx.fill();
ctx.restore();
drawFruitEntity(melonFruit);
}
for(var k=0;k<menuAmb.length;k++)drawFruitEntity(menuAmb[k]);
}
drawParticles();
for(var l=0;l<rings.length;l++){
var rg=rings[l];
ctx.globalAlpha=Math.max(0,rg.life)*0.8;
ctx.strokeStyle='#ffcc80';
ctx.lineWidth=Math.max(1,6*rg.life);
ctx.beginPath();ctx.arc(rg.x,rg.y,rg.r,0,TAU);ctx.stroke();
}
ctx.globalAlpha=1;
for(var m=0;m<popups.length;m++){
var pp=popups[m];
ctx.globalAlpha=Math.max(0,Math.min(1,pp.life*1.4));
txt(pp.text,pp.x,pp.y,22,'#ffca28','#3b1f05',5);
}
ctx.globalAlpha=1;
if(freezeT>0&&state==='play'){
var fa=0.10+0.05*Math.sin(gt*6);
ctx.fillStyle='rgba(110,180,255,'+fa.toFixed(3)+')';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='rgba(255,255,255,0.5)';
for(var q=0;q<30;q++){
var ix=((q*97+gt*40)%(W+40))-20;
var iy=((q*173+gt*55)%(H+40))-20;
ctx.fillRect(ix,iy,2,2);
}
}
drawTrail();
if(state==='play'||state==='ending')drawHUD();
drawBanner();
if(state==='menu')drawMenuTexts();
ctx.restore();
if(flashT>0){
ctx.fillStyle='rgba('+flashColor+','+(flashT*0.65).toFixed(3)+')';
ctx.fillRect(0,0,W,H);
}
}

function ptFromEvent(e){
var rect=canvas.getBoundingClientRect();
var cx=e.clientX,cy=e.clientY;
if(e.touches&&e.touches.length>0){
cx=e.touches[0].clientX;
cy=e.touches[0].clientY;
}else if(e.changedTouches&&e.changedTouches.length>0){
cx=e.changedTouches[0].clientX;
cy=e.changedTouches[0].clientY;
}
var rw=rect.width>0?rect.width:W;
var rh=rect.height>0?rect.height:H;
return {
x:((cx||0)-rect.left)*(W/rw),
y:((cy||0)-rect.top)*(H/rh)
};
}

function onDown(e){
if(e.cancelable)e.preventDefault();
SFX.resume();
pointerDown=true;
lastPt=ptFromEvent(e);
trail.push({x:lastPt.x,y:lastPt.y,t:performance.now()});
swipeHits=0;
tryTap(lastPt.x,lastPt.y);
if(e.pointerId&&canvas.setPointerCapture){
try{canvas.setPointerCapture(e.pointerId);}catch(err){}
}
}

function onMove(e){
if(!pointerDown)return;
if(e.cancelable)e.preventDefault();
var p=ptFromEvent(e);
var dx=p.x-lastPt.x,dy=p.y-lastPt.y;
if(Math.hypot(dx,dy)>3){
trail.push({x:p.x,y:p.y,t:performance.now()});
if(state==='play'||state==='menu'){
tryTap(p.x,p.y);
trySlice(lastPt.x,lastPt.y,p.x,p.y);
}
lastPt=p;
}
}

function endSwipeE(){
if(!pointerDown)return;
pointerDown=false;
if(state==='play'&&swipeHits>=3){
var bonus=swipeHits*5;
score+=bonus;
topScore.textContent=score;
setBanner(swipeHits+' BUAH COMBO!','BONUS +'+bonus,1.1,'#ffca28');
SFX.fanfare(swipeHits);
}
swipeHits=0;
}

if(window.PointerEvent){
canvas.addEventListener('pointerdown',onDown,{passive:false});
canvas.addEventListener('pointermove',onMove,{passive:false});
canvas.addEventListener('pointerup',endSwipeE);
canvas.addEventListener('pointercancel',endSwipeE);
}else{
canvas.addEventListener('touchstart',onDown,{passive:false});
canvas.addEventListener('touchmove',onMove,{passive:false});
canvas.addEventListener('touchend',endSwipeE);
canvas.addEventListener('touchcancel',endSwipeE);
canvas.addEventListener('mousedown',onDown);
canvas.addEventListener('mousemove',onMove);
canvas.addEventListener('mouseup',endSwipeE);
}

againBtn.addEventListener('click',function(){SFX.resume();SFX.tap();over.classList.add('hidden');beginGame();});
menuBtn.addEventListener('click',function(){SFX.resume();SFX.tap();toMenu();});
btnRestart.addEventListener('click',function(){SFX.resume();SFX.tap();over.classList.add('hidden');beginGame();});
muteBtn.addEventListener('click',function(){SFX.resume();var mu=SFX.toggle();muteBtn.textContent=mu?'🔇':'🔊';});

function gameLoop(now){
requestAnimationFrame(gameLoop);
var dt=Math.min(0.033,(now-last)/1000||0.016);
last=now;
gt+=dt;
update(dt);
draw();
}

toMenu();
last=performance.now();
requestAnimationFrame(gameLoop);
})();
</script>
</body>
</html>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";

export async function fruitGameHandler(m: any, sock: any) {
  try {
    const targetChat = m.chat || m.key?.remoteJid;
    if (!targetChat) return;

    const data = Buffer.from(
      JSON.stringify({
        __typename: "GenAIUnifiedResponse",
        response_id: randomUUID(),
        sections: [
          {
            __typename: "GenAIUnifiedResponseSection",
            view_model: {
              __typename: "GenAISingleLayoutViewModel",
              primitive: {
                __typename: "GenAIaeacdsnwHtmlPrimitive",
                payload: FRUIT_HTML,
                trusted_sources: [],
              },
            },
          },
        ],
      })
    ).toString("base64");

    await sock.relayMessage(
      targetChat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: randomUUID(),
            verificationMetadata: {
              proofs: [
                {
                  version: 1,
                  useCase: 1,
                  signature: SIG,
                  certificateChain: [CERT1, CERT2],
                },
              ],
            },
          },
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🍉 Fruit Slash",
                },
              ],
              unifiedResponse: {
                data,
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: "867051314767696@bot",
                },
                forwardOrigin: 4,
              },
            },
          },
        },
      },
      {}
    );
  } catch (err: any) {
    console.error("[FRUIT ERROR]", err);
    try {
      if (typeof m.reply === "function") {
        await m.reply("❌ Gagal mengirim game: " + (err?.message || err));
      } else if (sock.sendMessage) {
        await sock.sendMessage(m.chat || m.key?.remoteJid, { text: "❌ Gagal mengirim game: " + (err?.message || err) }, { quoted: m });
      }
    } catch (e) {}
  }
}

export const handler: any = async (m: any, { conn }: any) => {
  return fruitGameHandler(m, conn);
};
handler.help = ["fruitninja", "fruitslash", "fs"];
handler.tags = ["game"];
handler.command = /^(fruitninja|fruitslash|fruitgame|fs)$/i;
handler.limit = false;

export default fruitGameHandler;
