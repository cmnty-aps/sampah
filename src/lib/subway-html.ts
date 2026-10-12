import { Buffer } from "buffer";
import crypto from "crypto";

export const SUBWAY_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Subway Surfers</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
html,body{
  width:100%;height:100%;overflow:hidden;
  background:#091428;
  font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,Arial,sans-serif;
  touch-action:none;user-select:none;-webkit-user-select:none;
  color:#fff;
}
.subwayApp{
  display:flex;flex-direction:column;
  width:100%;height:100dvh;max-width:480px;
  margin:0 auto;background:#0d1b33;
  position:relative;overflow:hidden;
  box-shadow:0 0 30px rgba(0,0,0,0.8);
}
/* Top Header */
.topNav{
  height:44px;min-height:44px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 12px;background:linear-gradient(180deg,#1c3357 0%,#10223d 100%);
  border-bottom:2px solid #ffd23f;
  z-index:20;
}
.logoTitle{
  display:flex;align-items:center;gap:6px;
  font-family:'Arial Black',Impact,sans-serif;
  font-size:16px;font-weight:900;letter-spacing:1px;
  color:#ffd23f;text-shadow:0 2px 4px rgba(0,0,0,0.6);
}
.logoTitle span{color:#58c0ff;}
.statPills{
  display:flex;align-items:center;gap:8px;
}
.pill{
  background:rgba(5,15,30,0.7);
  border:1px solid rgba(255,210,63,0.35);
  border-radius:20px;padding:3px 9px;
  font-size:11px;font-weight:800;
  display:flex;align-items:center;gap:4px;
  color:#ffd23f;font-family:monospace;
}
.pill.blue{color:#7ad3ff;border-color:rgba(122,211,255,0.4);}
.navBtn{
  background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,210,63,0.4);
  color:#ffd23f;border-radius:50%;
  width:28px;height:28px;display:flex;
  align-items:center;justify-content:center;
  font-size:13px;cursor:pointer;
}

/* Canvas Viewport */
.canvasArea{
  flex:1;position:relative;
  width:100%;height:100%;
  background:#2f8fe8;overflow:hidden;
}
#gameCanvas{
  width:100%;height:100%;
  display:block;touch-action:none;
}

/* Bottom Control Pad */
.controlPad{
  background:linear-gradient(180deg,#10223d 0%,#091428 100%);
  padding:6px 10px 8px;border-top:2px solid rgba(255,210,63,0.25);
  display:flex;flex-direction:column;gap:5px;
  z-index:20;
}
.padRowMain{
  display:grid;grid-template-columns:1fr 1.2fr 1.2fr 1fr;
  gap:6px;
}
.ctrlBtn{
  height:44px;border-radius:10px;
  border:2px solid #ffd23f;
  background:linear-gradient(180deg,#2e5288 0%,#162d4e 100%);
  color:#fff;font-family:'Arial Black',sans-serif;
  font-size:16px;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1px;box-shadow:0 3px 0 #0b172a,inset 0 1px 0 rgba(255,255,255,0.3);
  transition:all 0.08s ease;touch-action:none;
}
.ctrlBtn small{
  font-family:Arial,sans-serif;font-size:8px;font-weight:900;
  color:#ffd23f;letter-spacing:0.5px;
}
.ctrlBtn:active,.ctrlBtn.active{
  transform:translateY(2px);
  background:linear-gradient(180deg,#ffd23f 0%,#e6a100 100%);
  color:#2a1a00;box-shadow:0 1px 0 #0b172a;
}
.ctrlBtn:active small,.ctrlBtn.active small{color:#4a2e00;}

.padRowSub{
  display:flex;gap:6px;align-items:center;
}
.subBtn{
  flex:1;height:34px;border-radius:8px;
  border:1px solid #ffd23f;
  background:linear-gradient(180deg,#213e68 0%,#11233d 100%);
  color:#ffd23f;font-size:11px;font-weight:900;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;
  box-shadow:0 2px 0 #08111e;
}
.subBtn b{
  background:#ef4444;color:#fff;font-size:9px;
  padding:1px 5px;border-radius:6px;
}
.subBtn:active{transform:translateY(1px);}
.subBtn.active{
  background:linear-gradient(180deg,#10b981 0%,#047857 100%);
  color:#fff;border-color:#34d399;
}

/* Modals & Overlays */
.overlayModal{
  position:absolute;inset:0;z-index:50;
  background:rgba(6,14,28,0.85);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  padding:12px;
}
.overlayModal.hidden{display:none !important;}
.menuCard{
  width:100%;max-width:360px;
  background:linear-gradient(180deg,#1c3357 0%,#0e1c36 100%);
  border:3px solid #ffd23f;border-radius:18px;
  padding:16px 14px;text-align:center;
  box-shadow:0 20px 40px rgba(0,0,0,0.8),inset 0 0 20px rgba(0,0,0,0.5);
  animation:popIn 0.22s cubic-bezier(0.175,0.885,0.32,1.275);
}
@keyframes popIn{
  0%{transform:scale(0.85);opacity:0;}
  100%{transform:scale(1);opacity:1;}
}
.menuTitle{
  font-family:'Arial Black',Impact,sans-serif;
  font-size:24px;font-weight:900;color:#ffd23f;
  text-shadow:0 2px 0 #7a3b12,0 0 16px rgba(255,210,63,0.6);
  margin-bottom:2px;
}
.menuSubtitle{font-size:11px;color:#9bc1ee;margin-bottom:12px;}

.actionBtn{
  width:100%;height:44px;margin-top:8px;
  border-radius:12px;border:2px solid #7a5a00;
  background:linear-gradient(180deg,#ffd23f 0%,#f59e0b 100%);
  color:#3a2000;font-family:'Arial Black',sans-serif;
  font-size:15px;font-weight:900;cursor:pointer;
  box-shadow:0 3px 0 #7a5a00,inset 0 2px 0 rgba(255,255,255,0.5);
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.actionBtn:active{transform:translateY(2px);box-shadow:0 1px 0 #7a5a00;}
.actionBtn.blue{
  border-color:#16305c;color:#eaf4ff;
  background:linear-gradient(180deg,#3b82f6 0%,#1d4ed8 100%);
  box-shadow:0 3px 0 #0f274a,inset 0 2px 0 rgba(255,255,255,0.3);
}

/* Character Roster Grid */
.rosterScroll{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:8px;max-height:260px;overflow-y:auto;
  padding:4px;margin:10px 0;
}
.charCard{
  background:rgba(15,30,55,0.8);
  border:2px solid rgba(255,210,63,0.3);
  border-radius:12px;padding:8px 6px;
  cursor:pointer;transition:all 0.15s ease;
  display:flex;flex-direction:column;align-items:center;gap:4px;
}
.charCard.selected{
  border-color:#ffd23f;background:rgba(255,210,63,0.18);
  box-shadow:0 0 12px rgba(255,210,63,0.4);
}
.charAvatar{
  width:44px;height:44px;border-radius:50%;
  background:radial-gradient(circle,#38bdf8 0%,#0369a1 100%);
  border:2px solid #ffd23f;display:flex;align-items:center;
  justify-content:center;font-size:22px;
}
.charName{font-size:12px;font-weight:900;color:#fff;}
.charPerk{font-size:9px;color:#93c5fd;line-height:1.1;}
.charCost{font-size:10px;color:#ffd23f;font-weight:800;}
.charCost.unlocked{color:#34d399;}

/* Stats Row */
.statRow{
  display:flex;justify-content:space-between;
  padding:6px 10px;margin:4px 0;
  background:rgba(10,20,38,0.6);border-radius:8px;
  font-size:12px;color:#cbd5e1;
}
.statRow b{color:#ffd23f;}
</style>
</head>
<body>
<div class="subwayApp">
  <!-- Top Header Navigation -->
  <header class="topNav">
    <div class="logoTitle">🛹 SUBWAY <span>SURF</span></div>
    <div class="statPills">
      <div class="pill">🪙 <span id="uiCoins">0</span></div>
      <div class="pill blue">🏆 <span id="uiBest">0</span></div>
    </div>
    <button class="navBtn" id="btnSound" title="Suara">🔊</button>
  </header>

  <!-- Canvas Game Viewport -->
  <main class="canvasArea">
    <canvas id="gameCanvas" width="440" height="540"></canvas>

    <!-- Overlay: Main Menu -->
    <div class="overlayModal" id="modalMenu">
      <div class="menuCard">
        <div class="menuTitle">SUBWAY SURFERS</div>
        <div class="menuSubtitle">Lari di rel kereta, hindari rintangan & kumpulkan koin!</div>
        
        <div class="statRow">
          <span>Karakter Aktif:</span>
          <b id="menuActiveChar">Jake 🧢</b>
        </div>
        <div class="statRow">
          <span>Skor Tertinggi:</span>
          <b id="menuBestScore">0</b>
        </div>
        <div class="statRow">
          <span>Total Tabungan Koin:</span>
          <b id="menuTotalCoins">0 🪙</b>
        </div>

        <button class="actionBtn" id="btnPlayGame">▶ MAIN SEKARANG</button>
        <button class="actionBtn blue" id="btnOpenRoster">👤 PILIH KARAKTER</button>
        <button class="actionBtn blue" id="btnOpenBoards">🛹 HOVERBOARD</button>
      </div>
    </div>

    <!-- Overlay: Character Roster -->
    <div class="overlayModal hidden" id="modalRoster">
      <div class="menuCard">
        <div class="menuTitle" style="font-size:20px;">PILIH KARAKTER</div>
        <div class="menuSubtitle">Karakter asli Subway Surfers dengan bonus spesial!</div>
        <div class="rosterScroll" id="rosterList"></div>
        <button class="actionBtn" id="btnCloseRoster">KEMBALI KE MENU</button>
      </div>
    </div>

    <!-- Overlay: Hoverboard Store -->
    <div class="overlayModal hidden" id="modalBoards">
      <div class="menuCard">
        <div class="menuTitle" style="font-size:20px;">PILIH HOVERBOARD</div>
        <div class="menuSubtitle">Gunakan hoverboard untuk kebal dari tabrakan!</div>
        <div class="rosterScroll" id="boardsList"></div>
        <button class="actionBtn" id="btnCloseBoards">KEMBALI KE MENU</button>
      </div>
    </div>

    <!-- Overlay: Game Over -->
    <div class="overlayModal hidden" id="modalOver">
      <div class="menuCard">
        <div class="menuTitle" id="overTitle" style="color:#ef4444;">TERTANGKAP!</div>
        <div class="menuSubtitle" id="overReason">Inspektur berhasil menangkapmu di rel!</div>
        
        <div style="margin:8px 0;font-size:38px;font-family:'Arial Black',sans-serif;color:#ffd23f;text-shadow:0 2px 8px rgba(255,210,63,0.5);" id="overScore">0</div>
        <div style="font-size:10px;letter-spacing:1.5px;color:#94a3b8;font-weight:bold;margin-bottom:8px;">SKOR AKHIR</div>

        <div class="statRow">
          <span>🪙 Koin Diperoleh:</span>
          <b id="overCoins">+0</b>
        </div>
        <div class="statRow">
          <span>📏 Jarak Tempuh:</span>
          <b id="overDist">0 m</b>
        </div>
        <div class="statRow">
          <span>🏆 Rekor Terbaik:</span>
          <b id="overBest">0</b>
        </div>

        <button class="actionBtn" id="btnPlayAgain">🔄 MAIN LAGI</button>
        <button class="actionBtn blue" id="btnOverMenu">🏠 MENU UTAMA</button>
      </div>
    </div>
  </main>

  <!-- Touch On-Screen Controls -->
  <footer class="controlPad">
    <div class="padRowMain">
      <button class="ctrlBtn" id="btnLeft"><span>◀</span><small>KIRI</small></button>
      <button class="ctrlBtn" id="btnJump"><span>▲</span><small>LOMPAT</small></button>
      <button class="ctrlBtn" id="btnRoll"><span>▼</span><small>ROLL</small></button>
      <button class="ctrlBtn" id="btnRight"><span>▶</span><small>KANAN</small></button>
    </div>
    <div class="padRowSub">
      <button class="subBtn" id="btnHoverboard">🛹 HOVERBOARD (<span id="hbCount">2</span>)</button>
      <button class="subBtn" id="btnRosterQuick">👤 KARAKTER</button>
    </div>
  </footer>
</div>

<script>
(function(){
'use strict';

// -------------------------------------------------------------
// 1. SOUND & AUDIO SYNTHESIZER (Native Web Audio API)
// -------------------------------------------------------------
var audioCtx = null;
var soundMuted = false;

function initAudio(){
  if(audioCtx) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  if(AC) audioCtx = new AC();
}
function resumeAudio(){
  initAudio();
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, type, duration, gainVal, slideFreq){
  if(soundMuted) return;
  resumeAudio();
  if(!audioCtx) return;
  try{
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    var t = audioCtx.currentTime;
    osc.frequency.setValueAtTime(freq, t);
    if(slideFreq) osc.frequency.exponentialRampToValueAtTime(slideFreq, t + duration);
    gain.gain.setValueAtTime(gainVal || 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }catch(e){}
}

var SFX = {
  jump: function(){ playTone(300, 'sine', 0.18, 0.2, 700); },
  roll: function(){ playTone(400, 'triangle', 0.2, 0.18, 160); },
  lane: function(){ playTone(450, 'sine', 0.08, 0.12, 600); },
  coin: function(combo){
    var base = 700 + Math.min(combo * 40, 600);
    playTone(base, 'sine', 0.1, 0.18);
    setTimeout(function(){ playTone(base * 1.5, 'sine', 0.08, 0.1); }, 30);
  },
  powerup: function(){
    [523, 659, 784, 1046, 1318].forEach(function(f, idx){
      setTimeout(function(){ playTone(f, 'triangle', 0.15, 0.22); }, idx * 60);
    });
  },
  boardOn: function(){ playTone(220, 'sawtooth', 0.35, 0.2, 880); },
  boardBreak: function(){ playTone(350, 'square', 0.3, 0.25, 80); },
  crash: function(){
    playTone(180, 'sawtooth', 0.5, 0.35, 40);
    playTone(100, 'square', 0.4, 0.3, 30);
  },
  jetpack: function(){ playTone(150, 'sawtooth', 0.6, 0.18, 400); },
  wordLetter: function(){ playTone(880, 'triangle', 0.25, 0.25, 1200); }
};

// -------------------------------------------------------------
// 2. AUTHENTIC SUBWAY SURFERS CHARACTERS & BOARDS DATABASE
// -------------------------------------------------------------
var CHARACTERS_DB = [
  {
    id: 'jake',
    name: 'Jake',
    icon: '🧢',
    role: 'The Original Street Runner',
    perk: '+10% Bonus Koin',
    cost: 0,
    colors: { cap: '#dc2626', capBrim: '#2563eb', hair: '#78350f', skin: '#fcd34d', skinShadow: '#f59e0b', jacket: '#1d4ed8', shirt: '#ffffff', pants: '#1e3a8a', shoes: '#ef4444' }
  },
  {
    id: 'tricky',
    name: 'Tricky',
    icon: '🎀',
    role: 'The Brain & Smart Girl',
    perk: '+20% Hangtime Lompatan',
    cost: 200,
    colors: { beanie: '#fef08a', hair: '#fde047', skin: '#fcd34d', glasses: '#0f172a', top: '#ef4444', pants: '#065f46', shoes: '#06b6d4' }
  },
  {
    id: 'fresh',
    name: 'Fresh',
    icon: '📻',
    role: 'The Music & 90s Beat Boy',
    perk: '+30% Durasi Magnet Koin',
    cost: 500,
    colors: { hair: '#18181b', skin: '#b45309', shades: '#000000', jacket: '#10b981', shirt: '#f97316', pants: '#1e293b', shoes: '#eab308' }
  },
  {
    id: 'yutani',
    name: 'Yutani',
    icon: '👽',
    role: 'The Science Girl in Alien Suit',
    perk: '+40% Durasi Jetpack Roket',
    cost: 800,
    colors: { suit: '#84cc16', belly: '#facc15', skin: '#fcd34d', eyes: '#0f172a', shoes: '#a855f7' }
  },
  {
    id: 'spike',
    name: 'Spike',
    icon: '🎸',
    role: 'The Rock Punk Guitarist',
    perk: '+35% Durasi 2× Skor',
    cost: 1200,
    colors: { mohawk: '#dc2626', skin: '#fcd34d', vest: '#18181b', shirt: '#f8fafc', pants: '#b91c1c', shoes: '#0f172a' }
  },
  {
    id: 'tagbot',
    name: 'Tagbot',
    icon: '🤖',
    role: 'The Robotic Tagging Unit',
    perk: 'Mulai dengan 1 Hoverboard ekstra',
    cost: 1600,
    colors: { chassis: '#cbd5e1', visor: '#06b6d4', glow: '#38bdf8', joints: '#334155' }
  },
  {
    id: 'frank',
    name: 'Frank',
    icon: '🎭',
    role: 'The Mysterious Suit Clown',
    perk: '+20% Pengganda Skor Dasar',
    cost: 2200,
    colors: { mask: '#f8fafc', suit: '#0f172a', tie: '#dc2626', pants: '#1e293b', shoes: '#020617' }
  },
  {
    id: 'king',
    name: 'King',
    icon: '👑',
    role: 'The Royal Subway Majesty',
    perk: 'Nilai Koin Ganda (2×)',
    cost: 3000,
    colors: { crown: '#fbbf24', robe: '#1e40af', fur: '#f8fafc', pants: '#6b21a8', shoes: '#f59e0b' }
  }
];

var BOARDS_DB = [
  { id: 'starboard', name: 'Starboard', icon: '⭐', perk: 'Hoverboard Klasik', cost: 0, deckCol: '#f59e0b', flameCol: '#ef4444' },
  { id: 'sunset', name: 'Sunset Wave', icon: '🌅', perk: 'Trail Neon Kecepatan', cost: 300, deckCol: '#ec4899', flameCol: '#8b5cf6' },
  { id: 'monster', name: 'Monster Board', icon: '🦖', perk: 'Lompatan Super Tinggi', cost: 800, deckCol: '#22c55e', flameCol: '#15803d' },
  { id: 'teleport', name: 'Teleport Warp', icon: '⚡', perk: 'Kilat Petir Listrik', cost: 1500, deckCol: '#06b6d4', flameCol: '#3b82f6' }
];

// -------------------------------------------------------------
// 3. PERSISTENCE & STORAGE
// -------------------------------------------------------------
var savedData = {
  highScore: 0,
  totalCoins: 0,
  selectedChar: 'jake',
  selectedBoard: 'starboard',
  unlockedChars: ['jake'],
  unlockedBoards: ['starboard']
};

function loadStorage(){
  try{
    var d = localStorage.getItem('subway_surfers_v2');
    if(d){
      var parsed = JSON.parse(d);
      Object.assign(savedData, parsed);
    }
  }catch(e){}
}
function saveStorage(){
  try{
    localStorage.setItem('subway_surfers_v2', JSON.stringify(savedData));
  }catch(e){}
}
loadStorage();

// -------------------------------------------------------------
// 4. GAME ENGINE CONSTANTS & 3D PROJECTION
// -------------------------------------------------------------
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var W = 440, H = 540;
function resizeCanvas(){
  var rect = canvas.parentElement.getBoundingClientRect();
  W = Math.floor(rect.width) || 440;
  H = Math.floor(rect.height) || 540;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

var TAU = Math.PI * 2;
var LANE_W = 100, PZ = 340;
var LANES = [-LANE_W, 0, LANE_W];
var TRAIN_HW = 46, TRAIN_H = 135;
var BASE_SPEED = 540, MAX_ADD = 520;
var GRAV = 2200, JUMP_VY = 880, RAMP_VY = 860;
var HIT = 50;

var FOC = 520, HORY = H * 0.32, CAMY = (H * 0.48 * PZ) / FOC;
var camX = 0, camLift = 0;

function proj(x, y, z){
  z = Math.max(90, z);
  var s = FOC / z;
  return {
    x: W / 2 + (x - camX) * s,
    y: HORY + (CAMY + camLift - y) * s,
    s: s
  };
}

function q4(a,b,c,d,fill){
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
  ctx.lineTo(c.x,c.y); ctx.lineTo(d.x,d.y);
  ctx.closePath(); ctx.fill();
}
function zq(xa,xb,ya,yb,z,col){
  var a = proj(xa,yb,z), b = proj(xb,yb,z), c = proj(xb,ya,z), d = proj(xa,ya,z);
  q4(a,b,c,d,col);
  return [a,b,c,d];
}
function xq(x,ya,yb,z1,z2,col){
  var a = proj(x,yb,z1), b = proj(x,ya,z1), c = proj(x,ya,z2), d = proj(x,yb,z2);
  q4(a,b,c,d,col);
}
function yq(xa,xb,y,z1,z2,col){
  var a = proj(xa,y,z1), b = proj(xb,y,z1), c = proj(xb,y,z2), d = proj(xa,y,z2);
  q4(a,b,c,d,col);
}

// -------------------------------------------------------------
// 5. GAME STATE & VARIABLES
// -------------------------------------------------------------
var gameState = 'menu'; // menu, run, ending, over
var speed = 0, dist = 0, score = 0, runCoins = 0;
var frontier = 600, gt = 0, lastFrame = performance.now();
var objs = [], particles = [], floatPops = [];

var player = {
  lane: 1, laneFrom: 1, px: 0,
  y: 0, py0: 0, vy: 0,
  air: false, rollT: 0, runPhase: 0,
  recentLC: 0, sup: 0
};

var powerups = {
  magnet: 0,
  x2: 0,
  jetpack: 0,
  sneakers: 0
};

var hoverboards = 2;
var hoverboardTimer = 0;
var invulnerableTimer = 0;
var blinkTimer = 0;
var screenShake = 0;
var redFlash = 0;
var endReason = '';
var endTimer = 0;

// Inspector Guard & Dog
var guard = {
  gap: 90,
  x: 0,
  runPhase: 0,
  armsReach: 0
};

// Daily Word Hunt ("S-U-R-F")
var WORD_HUNT = ['S', 'U', 'R', 'F'];
var collectedLetters = [false, false, false, false];

// -------------------------------------------------------------
// 6. TRACK & OBSTACLE GENERATOR
// -------------------------------------------------------------
function addObj(o){ objs.push(o); }

function spawnCoinsLine(lane, z, count, step, y){
  for(var i=0; i<count; i++){
    addObj({ t: 'coin', x: LANES[lane], y: y || 70, z: z + i * (step || 55), r: 26 });
  }
}
function spawnCoinsArc(lane, z){
  for(var i=0; i<7; i++){
    addObj({ t: 'coin', x: LANES[lane], y: 70 + Math.sin(i / 6 * Math.PI) * 110, z: z + i * 55, r: 26 });
  }
}
function spawnTrain(lane, z, len, moving, vz){
  var colors = [
    { col: '#e8a03c', stripe: '#f8fafc' },
    { col: '#ef4444', stripe: '#ffd23f' },
    { col: '#3b82f6', stripe: '#ffffff' },
    { col: '#10b981', stripe: '#f8fafc' }
  ];
  var pick = colors[Math.floor(Math.random() * colors.length)];
  addObj({
    t: moving ? 'mtrain' : 'train',
    x: LANES[lane], z: z, len: len,
    hw: TRAIN_HW, h: TRAIN_H,
    col: pick.col, stripe: pick.stripe,
    vz: vz || 0, vz0: vz || 0,
    horned: false
  });
  frontier = Math.max(frontier, z + len + 250);
}

function spawnTrackChunk(){
  var z0 = frontier + 280;
  var patterns = ['coins_hurdle', 'train_line', 'bars_crossover', 'ramp_roof', 'jetpack_flight', 'moving_train'];
  var pick = patterns[Math.floor(Math.random() * patterns.length)];

  if(pick === 'coins_hurdle'){
    var l = Math.floor(Math.random() * 3);
    addObj({ t: 'hurd', x: LANES[l], z: z0, len: 26, hw: 44 });
    spawnCoinsArc(l, z0 - 130);
    var other = (l + 1) % 3;
    spawnCoinsLine(other, z0 + 40, 7, 60);
  }
  else if(pick === 'train_line'){
    var tl = Math.floor(Math.random() * 3);
    spawnTrain(tl, z0, 750);
    for(var k=0; k<6; k++){
      addObj({ t: 'coin', x: LANES[tl], y: TRAIN_H + 52, z: z0 + 120 + k * 60, r: 26 });
    }
    var safeL = (tl + 1) % 3;
    spawnCoinsLine(safeL, z0 + 40, 8, 60);
  }
  else if(pick === 'bars_crossover'){
    var bl = Math.floor(Math.random() * 3);
    addObj({ t: 'bar', x: LANES[bl], z: z0, len: 22, hw: 46 });
    spawnCoinsLine(bl, z0 - 80, 4, 40, 40);
    var bl2 = (bl + 1) % 3;
    spawnCoinsLine(bl2, z0 + 100, 8, 55);
  }
  else if(pick === 'ramp_roof'){
    var rl = Math.floor(Math.random() * 3);
    addObj({ t: 'ramp', x: LANES[rl], z: z0 + 30, len: 230, hw: 46 });
    spawnTrain(rl, z0 + 280, 820);
    for(var j=0; j<8; j++){
      addObj({ t: 'coin', x: LANES[rl], y: TRAIN_H + 52, z: z0 + 340 + j * 60, r: 26 });
    }
  }
  else if(pick === 'moving_train'){
    var ml = Math.floor(Math.random() * 3);
    spawnTrain(ml, z0 + 900, 520, true, 300);
    var sl = (ml + 1) % 3;
    spawnCoinsLine(sl, z0 + 80, 8, 60);
  }
  else if(pick === 'jetpack_flight'){
    var pl = Math.floor(Math.random() * 3);
    var kinds = ['jetpack', 'magnet', 'x2', 'sneakers', 'box', 'letter'];
    var pKind = kinds[Math.floor(Math.random() * kinds.length)];
    addObj({ t: 'powerup', x: LANES[pl], y: 80, z: z0 + 120, kind: pKind });
  }

  frontier = Math.max(frontier, z0 + 750);
}

// -------------------------------------------------------------
// 7. INPUT & ACTION CONTROLS
// -------------------------------------------------------------
function changeLane(dir){
  if(gameState !== 'run') return;
  var target = Math.max(0, Math.min(2, player.lane + dir));
  if(target !== player.lane){
    player.laneFrom = player.lane;
    player.lane = target;
    player.recentLC = 0.28;
    SFX.lane();
  }
}

function doJump(){
  if(gameState !== 'run') return;
  if(player.air) return;
  player.rollT = 0;
  var boost = powerups.sneakers > 0 ? 1.45 : 1.0;
  var currentChar = getCurrentChar();
  if(currentChar.id === 'tricky') boost *= 1.2;
  player.vy = JUMP_VY * boost;
  player.air = true;
  SFX.jump();
}

function doRoll(){
  if(gameState !== 'run') return;
  if(player.air){
    player.vy = -1600; // dive down
    SFX.roll();
    return;
  }
  player.rollT = 0.85;
  SFX.roll();
}

function activateHoverboard(){
  if(gameState !== 'run') return;
  if(hoverboardTimer > 0 || hoverboards <= 0) return;
  hoverboards--;
  hoverboardTimer = 15;
  SFX.boardOn();
  spawnPopup('🛹 HOVERBOARD ON!', W/2, H * 0.42, '#38bdf8');
  updateUIElements();
}

function triggerStumble(){
  if(invulnerableTimer > 0) return;
  invulnerableTimer = 1.0;
  blinkTimer = 1.0;
  screenShake = 0.3;
  redFlash = 0.3;
  guard.gap = Math.max(26, guard.gap - 110);
  SFX.crash();
  spawnPopup('AWAS!', W/2, H * 0.4, '#ef4444');
  player.lane = player.laneFrom;
  if(guard.gap < 48){
    startGameOver('caught');
  }
}

function triggerCrash(){
  if(invulnerableTimer > 0) return;
  if(hoverboardTimer > 0){
    hoverboardTimer = 0;
    invulnerableTimer = 1.6;
    blinkTimer = 1.6;
    screenShake = 0.4;
    SFX.boardBreak();
    spawnPopup('PENYELAMATAN HOVERBOARD! 🎉', W/2, H * 0.4, '#38bdf8');
    updateUIElements();
    return;
  }
  startGameOver('crash');
}

function startGameOver(reason){
  gameState = 'ending';
  endReason = reason;
  endTimer = 1.4;
  SFX.crash();
  screenShake = 0.5;
  redFlash = 0.45;
}

function finishGameOver(){
  gameState = 'over';
  var finalScore = Math.floor(score);
  var isNewBest = false;
  if(finalScore > savedData.highScore){
    savedData.highScore = finalScore;
    isNewBest = true;
  }
  savedData.totalCoins += runCoins;
  saveStorage();

  document.getElementById('overTitle').textContent = endReason === 'caught' ? 'TERTANGKAP!' : 'CRASH MENABRAK!';
  document.getElementById('overReason').textContent = endReason === 'caught' ? 'Inspektur dan anjing penjaganya berhasil menangkapmu!' : 'Kamu menabrak gerbong kereta!';
  document.getElementById('overScore').textContent = finalScore + (isNewBest ? ' 🏆 (REKOR BARU!)' : '');
  document.getElementById('overCoins').textContent = '+' + runCoins + ' 🪙';
  document.getElementById('overDist').textContent = Math.floor(dist / 50) + ' m';
  document.getElementById('overBest').textContent = savedData.highScore;

  document.getElementById('modalOver').classList.remove('hidden');
  updateUIElements();
}

function spawnPopup(txt, x, y, col){
  floatPops.push({ txt: txt, x: x, y: y, life: 1.0, color: col || '#ffd23f' });
}

// -------------------------------------------------------------
// 8. GAME LOOP UPDATE
// -------------------------------------------------------------
function resetRun(){
  objs = [];
  particles = [];
  floatPops = [];
  speed = BASE_SPEED;
  dist = 0;
  score = 0;
  runCoins = 0;
  frontier = 600;
  powerups = { magnet: 0, x2: 0, jetpack: 0, sneakers: 0 };
  
  var currentChar = getCurrentChar();
  hoverboards = currentChar.id === 'tagbot' ? 3 : 2;
  hoverboardTimer = 0;
  invulnerableTimer = 0;
  blinkTimer = 0;
  screenShake = 0;
  redFlash = 0;
  
  player = {
    lane: 1, laneFrom: 1, px: 0,
    y: 0, py0: 0, vy: 0,
    air: false, rollT: 0, runPhase: 0,
    recentLC: 0, sup: 0
  };
  
  guard = { gap: 90, x: 0, runPhase: 0, armsReach: 0 };
  collectedLetters = [false, false, false, false];

  gameState = 'run';
  document.getElementById('modalMenu').classList.add('hidden');
  document.getElementById('modalOver').classList.add('hidden');
  document.getElementById('modalRoster').classList.add('hidden');
  document.getElementById('modalBoards').classList.add('hidden');

  updateUIElements();
}

function update(dt){
  gt += dt;
  if(screenShake > 0) screenShake -= dt * 1.5;
  if(redFlash > 0) redFlash -= dt * 1.6;
  if(invulnerableTimer > 0) invulnerableTimer -= dt;
  if(blinkTimer > 0) blinkTimer -= dt;
  if(hoverboardTimer > 0){
    hoverboardTimer -= dt;
    if(hoverboardTimer <= 0) updateUIElements();
  }

  // Float Pops & Particles
  for(var p=particles.length-1; p>=0; p--){
    var pt = particles[p];
    pt.x += pt.vx * dt; pt.y += pt.vy * dt;
    pt.vy += 600 * dt;
    pt.life -= pt.decay * dt;
    if(pt.life <= 0) particles.splice(p, 1);
  }
  for(var fp=floatPops.length-1; fp>=0; fp--){
    floatPops[fp].y -= 45 * dt;
    floatPops[fp].life -= dt * 1.1;
    if(floatPops[fp].life <= 0) floatPops.splice(fp, 1);
  }

  if(gameState === 'menu'){
    speed = 120;
    dist += speed * dt;
    player.runPhase += dt * 8;
    updateTrackObjects(dt);
    return;
  }

  if(gameState === 'run'){
    var targetSpeed = BASE_SPEED + Math.min(MAX_ADD, dist * 0.012);
    speed += (targetSpeed - speed) * Math.min(1, dt * 1.8);
    dist += speed * dt;

    var currentChar = getCurrentChar();
    var mult = 1 + Math.min(9, Math.floor((dist / 50) / 350));
    if(currentChar.id === 'frank') mult = Math.floor(mult * 1.2) + 1;
    score += speed * dt * 0.06 * mult * (powerups.x2 > 0 ? 2 : 1);
    
    player.runPhase += dt * (10 + speed * 0.005);
    guard.runPhase += dt * (10 + speed * 0.005);
    guard.gap = Math.min(150, guard.gap + dt * 16);
    guard.x += (player.px - guard.x) * Math.min(1, dt * 5);

    player.recentLC -= dt;
    var targetX = LANES[player.lane];
    player.px += (targetX - player.px) * Math.min(1, dt * 12);

    // Powerup Timers
    if(powerups.magnet > 0) powerups.magnet -= dt;
    if(powerups.x2 > 0) powerups.x2 -= dt;
    if(powerups.sneakers > 0) powerups.sneakers -= dt;
    if(powerups.jetpack > 0){
      powerups.jetpack -= dt;
      player.y = 190;
      player.air = true;
      // Emit jetpack rainbow smoke
      if(Math.random() < 0.6){
        var colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
        var prj = proj(player.px, player.y + 20, PZ);
        particles.push({
          x: prj.x + (Math.random()-0.5)*18,
          y: prj.y + 20,
          vx: (Math.random()-0.5)*50,
          vy: Math.random()*80 + 30,
          life: 0.8, decay: 1.5,
          color: colors[Math.floor(Math.random()*colors.length)],
          size: Math.random()*4 + 3
        });
      }
    } else {
      // Normal gravity physics
      if(player.rollT > 0) player.rollT -= dt;
      if(player.air){
        player.py0 = player.y;
        player.vy -= GRAV * dt;
        player.y += player.vy * dt;
        if(player.vy <= 0){
          if(player.y <= player.sup && player.py0 >= player.sup - 45){
            player.y = player.sup; player.vy = 0; player.air = false;
            SFX.jump();
          } else if(player.y <= 0 && player.sup <= 0){
            player.y = 0; player.vy = 0; player.air = false;
          }
        }
        if(player.y < 0) player.y = 0;
      } else {
        if(player.y > player.sup + 4){
          player.air = true; player.vy = 0; player.py0 = player.y;
        } else if(player.y !== player.sup){
          player.y = player.sup;
        }
      }
    }

    checkCollisions(dt);
    updateTrackObjects(dt);

    camX += (player.px * 0.35 - camX) * Math.min(1, dt * 5);
    var targetLift = player.y > 80 ? (player.y - 80) * 0.65 : 0;
    camLift += (targetLift - camLift) * Math.min(1, dt * 6);
    return;
  }

  if(gameState === 'ending'){
    endTimer -= dt;
    speed = Math.max(0, speed - BASE_SPEED * 2 * dt);
    guard.gap = Math.max(20, guard.gap - 280 * dt);
    guard.armsReach = Math.min(1, guard.armsReach + dt * 3.5);
    updateTrackObjects(dt);
    if(endTimer <= 0) finishGameOver();
  }
}

function updateTrackObjects(dt){
  for(var i=objs.length-1; i>=0; i--){
    var o = objs[i];
    o.z -= speed * dt;
    if(o.vz) o.z -= o.vz * dt;
    var far = o.t === 'coin' || o.t === 'powerup' ? -120 : -320;
    if(o.z + (o.len || 40) < far) objs.splice(i, 1);
  }
  frontier -= speed * dt;
  while(frontier < 2400) spawnTrackChunk();
}

function checkCollisions(dt){
  var px = player.px, py = player.y;
  var sup = 0;
  var i, o, dx, zc;

  for(i=0; i<objs.length; i++){
    o = objs[i];
    if(o.t !== 'train' && o.t !== 'mtrain') continue;
    dx = Math.abs(px - o.x);
    if(dx < HIT && o.z < PZ + 40 && o.z + o.len > PZ - 24){
      sup = Math.max(sup, o.h);
      if(gameState === 'run' && invulnerableTimer <= 0 && powerups.jetpack <= 0){
        if(py < o.h * 0.55 && player.py0 < o.h * 0.55 + 10){
          if(player.recentLC > 0) triggerStumble(); else triggerCrash();
          if(gameState !== 'run') return;
        } else if(player.air && player.vy <= 0 && py < o.h){
          player.y = o.h; player.vy = 0; player.air = false; player.py0 = o.h;
        }
      }
    }
  }
  player.sup = sup;

  for(i=objs.length-1; i>=0; i--){
    o = objs[i];
    dx = Math.abs(px - o.x);
    zc = o.z + (o.len || 0) / 2;

    if(o.t === 'coin'){
      if(o.z < 90) continue;
      if(powerups.magnet > 0 && o.z < PZ + 750 && o.z > 60){
        o.x += (px - o.x) * Math.min(1, dt * 8);
        o.y += (py + 60 - o.y) * Math.min(1, dt * 8);
        o.z -= 950 * dt;
      }
      if(Math.abs(o.z - PZ) < 60 && dx < 58 && Math.abs(o.y - (py + 60)) < 120){
        objs.splice(i, 1);
        var currentChar = getCurrentChar();
        var coinAdd = currentChar.id === 'king' ? 2 : 1;
        runCoins += coinAdd;
        SFX.coin(runCoins);
        updateUIElements();
        continue;
      }
    }

    if(o.t === 'powerup'){
      if(o.z < 90) continue;
      if(Math.abs(o.z - PZ) < 60 && dx < 55 && py < 180){
        objs.splice(i, 1);
        SFX.powerup();
        var pChar = getCurrentChar();
        if(o.kind === 'magnet'){
          powerups.magnet = 12 * (pChar.id === 'fresh' ? 1.3 : 1.0);
          spawnPopup('🧲 MAGNET KOIN!', W/2, H * 0.4, '#ef4444');
        } else if(o.kind === 'x2'){
          powerups.x2 = 15 * (pChar.id === 'spike' ? 1.35 : 1.0);
          spawnPopup('⭐ 2× SKOR MULTIPLIER!', W/2, H * 0.4, '#ffd23f');
        } else if(o.kind === 'jetpack'){
          powerups.jetpack = 10 * (pChar.id === 'yutani' ? 1.4 : 1.0);
          SFX.jetpack();
          spawnPopup('🚀 JETPACK TERBANG!', W/2, H * 0.4, '#38bdf8');
          // Spawn sky coins trail
          for(var sk=0; sk<20; sk++){
            addObj({ t: 'coin', x: LANES[sk%3], y: 190, z: PZ + 180 + sk * 75, r: 28 });
          }
        } else if(o.kind === 'sneakers'){
          powerups.sneakers = 14;
          spawnPopup('👟 SUPER SNEAKERS!', W/2, H * 0.4, '#22c55e');
        } else if(o.kind === 'box'){
          var mysteryBonus = [50, 100, 200, 350][Math.floor(Math.random()*4)];
          runCoins += mysteryBonus;
          spawnPopup('🎁 MYSTERY BOX +' + mysteryBonus + ' KOIN!', W/2, H * 0.4, '#a855f7');
        } else if(o.kind === 'letter'){
          for(var lt=0; lt<4; lt++){
            if(!collectedLetters[lt]){
              collectedLetters[lt] = true;
              SFX.wordLetter();
              spawnPopup('HURUF "' + WORD_HUNT[lt] + '" TERKUMPUL!', W/2, H * 0.4, '#10b981');
              break;
            }
          }
        }
        continue;
      }
    }

    if(gameState !== 'run' || invulnerableTimer > 0 || powerups.jetpack > 0) continue;

    if(o.t === 'hurd'){
      if(dx < HIT && Math.abs(zc - PZ) < 42 && py < 54){
        if(py >= 26) triggerStumble(); else triggerCrash();
        if(gameState !== 'run') return;
      }
    } else if(o.t === 'bar'){
      if(dx < HIT && Math.abs(zc - PZ) < 38 && player.rollT <= 0 && py < 145){
        if(player.recentLC > 0) triggerStumble(); else triggerCrash();
        if(gameState !== 'run') return;
      }
    } else if(o.t === 'ramp'){
      if(dx < HIT && Math.abs(zc - PZ) < 95 && !player.air && py < 22){
        player.vy = RAMP_VY; player.air = true;
        SFX.jump();
      }
    }
  }
}

// -------------------------------------------------------------
// 9. RENDERING (AUTHENTIC SUBWAY SURFERS AESTHETICS)
// -------------------------------------------------------------
function drawSky(){
  var g = ctx.createLinearGradient(0, 0, 0, HORY + 40);
  g.addColorStop(0, '#2563eb');
  g.addColorStop(0.6, '#38bdf8');
  g.addColorStop(1, '#bae6fd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HORY + 40);

  // Distant warm sun
  var sx = W * 0.78, sy = H * 0.08;
  var sg = ctx.createRadialGradient(sx, sy, 4, sx, sy, 55);
  sg.addColorStop(0, '#fef08a');
  sg.addColorStop(0.4, '#fde047');
  sg.addColorStop(1, 'rgba(253,224,71,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(sx - 60, sy - 60, 120, 120);

  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for(var c=0; c<3; c++){
    var cx = ((c * 200 + gt * 8 + dist * 0.02) % (W + 220)) - 100;
    var cy = H * 0.06 + c * 20;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 38, 14, 0, 0, TAU);
    ctx.ellipse(cx + 26, cy - 6, 26, 12, 0, 0, TAU);
    ctx.ellipse(cx - 24, cy + 3, 22, 10, 0, 0, TAU);
    ctx.fill();
  }
}

function drawGround(){
  yq(-420, 420, 0, 95, 3400, '#a8896c');
  for(var l=0; l<3; l++){
    yq(LANES[l] - 56, LANES[l] + 56, 0, 95, 3400, '#8c7358');
  }
  // Sleepers & Rails
  var st = 75;
  var s0 = Math.floor((dist + 95) / st), s1 = Math.ceil((dist + 3000) / st);
  for(var s=s0; s<=s1; s++){
    var zz = s * st - dist;
    if(zz < 95 || zz > 3000) continue;
    for(var l2=0; l2<3; l2++){
      yq(LANES[l2] - 44, LANES[l2] + 44, 2, zz, zz + 14, s % 2 === 0 ? '#634020' : '#523419');
    }
  }
  for(var l3=0; l3<3; l3++){
    for(var r=-1; r<=1; r+=2){
      var rx = LANES[l3] + 32 * r;
      xq(rx - 2.5, 0, 9, 95, 3400, '#94a3b8');
      yq(rx - 2.5, rx + 2.5, 9, 95, 3400, '#cbd5e1');
      yq(rx - 0.8, rx + 0.8, 9.5, 95, 3400, '#f8fafc');
    }
  }
}

function drawWalls(){
  for(var s=-1; s<=1; s+=2){
    var sx = s * 248;
    var k0 = Math.floor((dist + 95) / 260), k1 = Math.ceil((dist + 2800) / 260);
    for(var k=k1; k>=k0; k--){
      var z = k * 260 - dist; if(z < 95) z = 95;
      var z2 = z + 248;
      var fog = 1 - Math.max(0, Math.min(1, (z - 1400) / 1400)) * 0.65;
      ctx.globalAlpha = fog;
      xq(sx, 0, 320, z, z2, '#b45309');
      // Graffiti tags
      if(k % 3 === 0){
        xq(sx, 40, 110, z + 20, z + 160, k % 2 === 0 ? '#ec4899' : '#06b6d4');
      }
      xq(sx, 310, 335, z, z2, '#f59e0b');
      ctx.globalAlpha = 1;
    }
  }
}

// -------------------------------------------------------------
// 10. AUTHENTIC CHARACTER DRAWING (JAKE, TRICKY, FRESH, ETC)
// -------------------------------------------------------------
function getCurrentChar(){
  for(var i=0; i<CHARACTERS_DB.length; i++){
    if(CHARACTERS_DB[i].id === savedData.selectedChar) return CHARACTERS_DB[i];
  }
  return CHARACTERS_DB[0];
}

function drawPlayerCharacter(u){
  var char = getCurrentChar();
  var ph = player.runPhase * 1.5;
  var bob = player.air ? 1 : Math.abs(Math.sin(ph)) * 3.5;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 26 * u, 8 * u, 0, 0, TAU);
  ctx.fill();

  // Hoverboard rendering if active
  if(hoverboardTimer > 0){
    var hbColor = '#f59e0b';
    ctx.save();
    ctx.translate(0, -6 * u);
    ctx.fillStyle = hbColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 36 * u, 9 * u, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(-26 * u, 0, 6 * u, 4 * u, 0, 0, TAU);
    ctx.ellipse(26 * u, 0, 6 * u, 4 * u, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.translate(0, -10 * u);
  }

  // Rolling pose
  if(player.rollT > 0){
    ctx.save();
    ctx.translate(0, -26 * u);
    ctx.rotate((1 - player.rollT / 0.85) * TAU * 2);
    ctx.fillStyle = char.colors.jacket || char.colors.suit || '#2563eb';
    ctx.beginPath();
    ctx.arc(0, 0, 24 * u, 0, TAU);
    ctx.fill();
    ctx.fillStyle = char.colors.cap || char.colors.beanie || '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -10 * u, 14 * u, 0, Math.PI);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Legs & Shoes
  for(var lg=-1; lg<=1; lg+=2){
    var sw = player.air ? (lg * 0.4) : (lg > 0 ? Math.sin(ph) : Math.sin(ph + Math.PI));
    var kx = lg * 8 * u + Math.sin(sw) * (player.air ? 4 * u : 14 * u);
    var ky = -18 * u;
    var fx = lg * 8 * u + Math.sin(sw) * (player.air ? 8 * u : 24 * u);
    var fy = player.air ? -8 * u : -Math.abs(Math.cos(sw)) * 8 * u;

    // Pants
    ctx.strokeStyle = char.colors.pants || '#1e3a8a';
    ctx.lineWidth = 9 * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lg * 7 * u, -42 * u);
    ctx.lineTo(kx, ky);
    ctx.lineTo(fx, fy);
    ctx.stroke();

    // Sneakers / Shoes
    ctx.fillStyle = char.colors.shoes || '#ef4444';
    ctx.beginPath();
    ctx.ellipse(fx, fy, 8 * u, 5 * u, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(fx + 2 * u, fy + 2 * u, 6 * u, 2.5 * u, 0, 0, TAU);
    ctx.fill();
  }

  // Torso / Jacket / Shirt
  var hy = -80 * u - bob * u;
  ctx.fillStyle = char.colors.jacket || char.colors.top || char.colors.suit || '#1d4ed8';
  ctx.beginPath();
  ctx.roundRect(-16 * u, -74 * u - bob * u, 32 * u, 34 * u, 6 * u);
  ctx.fill();

  // White inner shirt
  if(char.colors.shirt){
    ctx.fillStyle = char.colors.shirt;
    ctx.fillRect(-6 * u, -74 * u - bob * u, 12 * u, 24 * u);
  }

  // Arms
  for(var ar=-1; ar<=1; ar+=2){
    var asw = player.air ? (ar * 0.6) : Math.sin(ph + (ar > 0 ? Math.PI : 0)) * 0.7;
    var ex = ar * (22 * u + Math.abs(asw) * 4 * u);
    var ey = -58 * u - bob * u + Math.cos(asw) * 5 * u;
    var hx = ar * (20 * u + Math.sin(asw) * 12 * u);
    var h_y = -42 * u + Math.cos(asw) * 6 * u;

    ctx.strokeStyle = char.colors.jacket || char.colors.top || '#1d4ed8';
    ctx.lineWidth = 7 * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ar * 14 * u, -70 * u - bob * u);
    ctx.lineTo(ex, ey);
    ctx.lineTo(hx, h_y);
    ctx.stroke();

    // Hands
    ctx.fillStyle = char.colors.skin || '#fcd34d';
    ctx.beginPath();
    ctx.arc(hx, h_y, 4 * u, 0, TAU);
    ctx.fill();
  }

  // Head & Face
  var headY = -92 * u - bob * u;
  ctx.fillStyle = char.colors.skin || '#fcd34d';
  ctx.beginPath();
  ctx.arc(0, headY, 15 * u, 0, TAU);
  ctx.fill();

  // Character specific headwear
  if(char.id === 'jake'){
    // Backwards Red Cap
    ctx.fillStyle = char.colors.cap;
    ctx.beginPath();
    ctx.arc(0, headY - 3 * u, 16 * u, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Cap Brim
    ctx.fillStyle = char.colors.capBrim;
    ctx.fillRect(-18 * u, headY - 4 * u, 10 * u, 5 * u);
    // Subway green emblem
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(4 * u, headY - 6 * u, 3 * u, 0, TAU);
    ctx.fill();
  } else if(char.id === 'tricky'){
    // Knit Beanie with Pom-pom
    ctx.fillStyle = char.colors.beanie;
    ctx.beginPath();
    ctx.arc(0, headY - 6 * u, 16 * u, 0, Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, headY - 22 * u, 5 * u, 0, TAU);
    ctx.fill();
    // Round Hipster Glasses
    ctx.strokeStyle = char.colors.glasses;
    ctx.lineWidth = 2 * u;
    ctx.beginPath();
    ctx.arc(-5 * u, headY, 4 * u, 0, TAU);
    ctx.arc(5 * u, headY, 4 * u, 0, TAU);
    ctx.stroke();
  } else if(char.id === 'fresh'){
    // High-top Flat Fade Hair
    ctx.fillStyle = char.colors.hair;
    ctx.fillRect(-12 * u, headY - 24 * u, 24 * u, 14 * u);
    // Dark Shades
    ctx.fillStyle = char.colors.shades;
    ctx.fillRect(-10 * u, headY - 3 * u, 20 * u, 6 * u);
  } else if(char.id === 'yutani'){
    // Alien Hood & Antennae
    ctx.fillStyle = char.colors.suit;
    ctx.beginPath();
    ctx.arc(0, headY - 2 * u, 17 * u, 0, TAU);
    ctx.fill();
    // Antennae
    ctx.strokeStyle = char.colors.suit;
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(-6 * u, headY - 17 * u); ctx.lineTo(-10 * u, headY - 26 * u);
    ctx.moveTo(6 * u, headY - 17 * u); ctx.lineTo(10 * u, headY - 26 * u);
    ctx.stroke();
  } else if(char.id === 'spike'){
    // Mohawk Hair
    ctx.fillStyle = char.colors.mohawk;
    ctx.beginPath();
    ctx.moveTo(-4 * u, headY - 14 * u);
    ctx.lineTo(0, headY - 28 * u);
    ctx.lineTo(4 * u, headY - 14 * u);
    ctx.fill();
  } else if(char.id === 'king'){
    // Golden Crown
    ctx.fillStyle = char.colors.crown;
    ctx.beginPath();
    ctx.moveTo(-12 * u, headY - 14 * u);
    ctx.lineTo(-14 * u, headY - 26 * u);
    ctx.lineTo(-6 * u, headY - 20 * u);
    ctx.lineTo(0, headY - 28 * u);
    ctx.lineTo(6 * u, headY - 20 * u);
    ctx.lineTo(14 * u, headY - 26 * u);
    ctx.lineTo(12 * u, headY - 14 * u);
    ctx.closePath();
    ctx.fill();
  }
}

function drawInspectorAndDog(){
  var gz = Math.max(120, PZ - guard.gap - 20);
  var p = proj(guard.x, 0, gz);
  if(p.y > H + 200) return;
  var u = p.s * 0.85;
  var ph = guard.runPhase * 1.35;
  var bob = Math.abs(Math.sin(ph)) * 3;

  ctx.save();
  ctx.translate(p.x, p.y);

  // Inspector Dog (Bulldog)
  var dogX = 46 * u;
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(dogX, -16 * u, 16 * u, 12 * u, 0, 0, TAU);
  ctx.fill();
  // Dog Head
  ctx.beginPath();
  ctx.arc(dogX + 12 * u, -20 * u, 9 * u, 0, TAU);
  ctx.fill();
  // Red Collar
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(dogX + 6 * u, -18 * u, 4 * u, 8 * u);

  // Inspector Body (Security Uniform)
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.roundRect(-20 * u, -80 * u - bob * u, 40 * u, 42 * u, 10 * u);
  ctx.fill();
  // Police Gold Badge
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(8 * u, -70 * u - bob * u, 4 * u, 0, TAU);
  ctx.fill();

  // Head & Police Cap
  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(0, -94 * u - bob * u, 14 * u, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-16 * u, -108 * u - bob * u, 32 * u, 8 * u);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-18 * u, -102 * u - bob * u, 36 * u, 4 * u);

  ctx.restore();
}

function draw(){
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  if(screenShake > 0){
    var sAmt = screenShake * 12;
    ctx.translate((Math.random() - 0.5) * sAmt, (Math.random() - 0.5) * sAmt);
  }

  drawSky();
  drawGround();
  drawWalls();

  // Depth Sorted Track Entities
  var list = [];
  for(var i=0; i<objs.length; i++){
    var o = objs[i];
    list.push({ z: o.z + (o.len || 40), obj: o });
  }
  list.sort(function(a,b){ return b.z - a.z; });

  for(var j=0; j<list.length; j++){
    var ob = list[j].obj;
    if(ob.t === 'train' || ob.t === 'mtrain'){
      // Train
      var z1 = Math.max(90, ob.z), z2 = ob.z + ob.len;
      if(z2 > z1){
        var x = ob.x, hw = ob.hw, h = ob.h;
        yq(x - hw, x + hw, h, z1, z2, ob.col);
        zq(x - hw, x + hw, 0, h, z1, ob.col);
        // Headlights
        var h1 = proj(x - hw * 0.6, h * 0.35, z1);
        var h2 = proj(x + hw * 0.6, h * 0.35, z1);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(h1.x, h1.y, 6 * h1.s, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(h2.x, h2.y, 6 * h2.s, 0, TAU); ctx.fill();
      }
    } else if(ob.t === 'coin'){
      var p = proj(ob.x, ob.y, ob.z);
      if(p.s > 0){
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(p.x, p.y, ob.r * p.s, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffd23f';
        ctx.beginPath(); ctx.arc(p.x, p.y, ob.r * p.s * 0.8, 0, TAU); ctx.fill();
      }
    } else if(ob.t === 'powerup'){
      var pp = proj(ob.x, ob.y, ob.z);
      if(pp.s > 0){
        ctx.fillStyle = '#ffd23f';
        ctx.beginPath(); ctx.arc(pp.x, pp.y, 24 * pp.s, 0, TAU); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold ' + Math.max(10, 16 * pp.s) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var icon = ob.kind === 'jetpack' ? '🚀' : (ob.kind === 'magnet' ? '🧲' : (ob.kind === 'sneakers' ? '👟' : (ob.kind === 'box' ? '🎁' : '⭐')));
        ctx.fillText(icon, pp.x, pp.y);
      }
    } else if(ob.t === 'hurd'){
      zq(ob.x - ob.hw, ob.x + ob.hw, 0, 50, ob.z, '#ef4444');
    } else if(ob.t === 'bar'){
      zq(ob.x - ob.hw, ob.x + ob.hw, 100, 150, ob.z, '#f59e0b');
    }
  }

  // Draw Player
  var pp = proj(player.px, player.y, PZ);
  ctx.save();
  ctx.translate(pp.x, pp.y);
  if(blinkTimer > 0 && Math.floor(gt * 16) % 2 === 0){
    ctx.globalAlpha = 0.5;
  }
  drawPlayerCharacter(pp.s * 0.8);
  ctx.restore();

  // Draw Inspector
  if(gameState === 'run' || gameState === 'ending'){
    drawInspectorAndDog();
  }

  // Float popups
  for(var fp=0; fp<floatPops.length; fp++){
    var pop = floatPops[fp];
    ctx.globalAlpha = Math.max(0, Math.min(1, pop.life));
    ctx.fillStyle = pop.color;
    ctx.font = '900 16px "Arial Black",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pop.txt, pop.x, pop.y);
  }

  ctx.restore();

  if(redFlash > 0){
    ctx.fillStyle = 'rgba(239,68,68,' + (redFlash * 0.45).toFixed(2) + ')';
    ctx.fillRect(0, 0, W, H);
  }
}

// -------------------------------------------------------------
// 11. UI & ROSTER INTERFACES
// -------------------------------------------------------------
function updateUIElements(){
  document.getElementById('uiCoins').textContent = runCoins;
  document.getElementById('uiBest').textContent = savedData.highScore;
  document.getElementById('menuBestScore').textContent = savedData.highScore;
  document.getElementById('menuTotalCoins').textContent = savedData.totalCoins;
  document.getElementById('hbCount').textContent = hoverboards;
  
  var char = getCurrentChar();
  document.getElementById('menuActiveChar').textContent = char.name + ' ' + char.icon;
}

function renderRosterCards(){
  var container = document.getElementById('rosterList');
  container.innerHTML = '';
  CHARACTERS_DB.forEach(function(c){
    var isUnlocked = savedData.unlockedChars.indexOf(c.id) >= 0;
    var isSelected = savedData.selectedChar === c.id;
    var card = document.createElement('div');
    card.className = 'charCard' + (isSelected ? ' selected' : '');
    card.innerHTML = 
      '<div class="charAvatar">' + c.icon + '</div>' +
      '<div class="charName">' + c.name + '</div>' +
      '<div class="charPerk">' + c.perk + '</div>' +
      '<div class="charCost ' + (isUnlocked ? 'unlocked' : '') + '">' + 
      (isSelected ? '✓ DIPILIH' : (isUnlocked ? 'MILIKMU' : '🪙 ' + c.cost)) + 
      '</div>';
    
    card.onclick = function(){
      if(isUnlocked){
        savedData.selectedChar = c.id;
        saveStorage();
        renderRosterCards();
        updateUIElements();
      } else if(savedData.totalCoins >= c.cost){
        savedData.totalCoins -= c.cost;
        savedData.unlockedChars.push(c.id);
        savedData.selectedChar = c.id;
        saveStorage();
        renderRosterCards();
        updateUIElements();
        SFX.powerup();
      } else {
        alert('Koin tidak cukup! Butuh ' + c.cost + ' koin.');
      }
    };
    container.appendChild(card);
  });
}

function renderBoardsCards(){
  var container = document.getElementById('boardsList');
  container.innerHTML = '';
  BOARDS_DB.forEach(function(b){
    var isUnlocked = savedData.unlockedBoards.indexOf(b.id) >= 0;
    var isSelected = savedData.selectedBoard === b.id;
    var card = document.createElement('div');
    card.className = 'charCard' + (isSelected ? ' selected' : '');
    card.innerHTML = 
      '<div class="charAvatar">' + b.icon + '</div>' +
      '<div class="charName">' + b.name + '</div>' +
      '<div class="charPerk">' + b.perk + '</div>' +
      '<div class="charCost ' + (isUnlocked ? 'unlocked' : '') + '">' + 
      (isSelected ? '✓ DIPILIH' : (isUnlocked ? 'MILIKMU' : '🪙 ' + b.cost)) + 
      '</div>';
    
    card.onclick = function(){
      if(isUnlocked){
        savedData.selectedBoard = b.id;
        saveStorage();
        renderBoardsCards();
      } else if(savedData.totalCoins >= b.cost){
        savedData.totalCoins -= b.cost;
        savedData.unlockedBoards.push(b.id);
        savedData.selectedBoard = b.id;
        saveStorage();
        renderBoardsCards();
        SFX.powerup();
      } else {
        alert('Koin tidak cukup! Butuh ' + b.cost + ' koin.');
      }
    };
    container.appendChild(card);
  });
}

// -------------------------------------------------------------
// 12. EVENT BINDINGS
// -------------------------------------------------------------
document.getElementById('btnPlayGame').onclick = function(){ resumeAudio(); resetRun(); };
document.getElementById('btnPlayAgain').onclick = function(){ resumeAudio(); resetRun(); };
document.getElementById('btnOverMenu').onclick = function(){
  document.getElementById('modalOver').classList.add('hidden');
  document.getElementById('modalMenu').classList.remove('hidden');
  gameState = 'menu';
  updateUIElements();
};

document.getElementById('btnOpenRoster').onclick = function(){
  renderRosterCards();
  document.getElementById('modalRoster').classList.remove('hidden');
};
document.getElementById('btnCloseRoster').onclick = function(){
  document.getElementById('modalRoster').classList.add('hidden');
};

document.getElementById('btnOpenBoards').onclick = function(){
  renderBoardsCards();
  document.getElementById('modalBoards').classList.remove('hidden');
};
document.getElementById('btnCloseBoards').onclick = function(){
  document.getElementById('modalBoards').classList.add('hidden');
};

document.getElementById('btnRosterQuick').onclick = function(){
  renderRosterCards();
  document.getElementById('modalRoster').classList.remove('hidden');
};

document.getElementById('btnSound').onclick = function(){
  soundMuted = !soundMuted;
  this.textContent = soundMuted ? '🔇' : '🔊';
};

// Direction Buttons
function bindTouchBtn(id, fn){
  var el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('pointerdown', function(e){
    e.preventDefault(); e.stopPropagation();
    resumeAudio();
    fn();
    el.classList.add('active');
  });
  el.addEventListener('pointerup', function(){ el.classList.remove('active'); });
  el.addEventListener('pointercancel', function(){ el.classList.remove('active'); });
}

bindTouchBtn('btnLeft', function(){ changeLane(-1); });
bindTouchBtn('btnRight', function(){ changeLane(1); });
bindTouchBtn('btnJump', doJump);
bindTouchBtn('btnRoll', doRoll);
bindTouchBtn('btnHoverboard', activateHoverboard);

// Swipe Gestures on Canvas
var touchStartX = 0, touchStartY = 0, touchActive = false;
canvas.addEventListener('touchstart', function(e){
  e.preventDefault();
  resumeAudio();
  if(e.touches.length > 0){
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }
}, { passive: false });

canvas.addEventListener('touchmove', function(e){
  if(!touchActive || e.touches.length === 0) return;
  var dx = e.touches[0].clientX - touchStartX;
  var dy = e.touches[0].clientY - touchStartY;
  if(Math.hypot(dx, dy) > 22){
    touchActive = false; // consume swipe
    if(Math.abs(dx) > Math.abs(dy)){
      if(dx > 0) changeLane(1); else changeLane(-1);
    } else {
      if(dy < 0) doJump(); else doRoll();
    }
  }
}, { passive: false });

canvas.addEventListener('touchend', function(){ touchActive = false; });

// Keyboard Controls
window.addEventListener('keydown', function(e){
  resumeAudio();
  if(gameState === 'menu' && (e.key === ' ' || e.key === 'Enter')){ resetRun(); return; }
  if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') changeLane(-1);
  else if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') changeLane(1);
  else if(e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') doJump();
  else if(e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') doRoll();
  else if(e.key === 'b' || e.key === 'B') activateHoverboard();
});

// Main Loop
function mainLoop(now){
  requestAnimationFrame(mainLoop);
  var dt = Math.min(0.033, (now - lastFrame) / 1000);
  if(dt <= 0) dt = 0.016;
  lastFrame = now;
  update(dt);
  draw();
}

updateUIElements();
requestAnimationFrame(mainLoop);

})();
</script>
</body>
</html>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";

export async function subwaySurfHandler(m: any, sock: any) {
  try {
    const targetChat = m.chat || m.key?.remoteJid;
    if (!targetChat) return;

    const data = Buffer.from(
      JSON.stringify({
        __typename: "GenAIUnifiedResponse",
        response_id: crypto.randomUUID(),
        sections: [
          {
            __typename: "GenAIUnifiedResponseSection",
            view_model: {
              __typename: "GenAISingleLayoutViewModel",
              primitive: {
                __typename: "GenAIaeacdsnwHtmlPrimitive",
                payload: SUBWAY_HTML,
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
            botResponseId: crypto.randomUUID(),
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
                  messageText: "🛹 Subway Surf",
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
    console.error("[SUBWAY ERROR]", err);
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
  return subwaySurfHandler(m, conn);
};
handler.help = ["subwaysurf", "subway", "surfer"];
handler.tags = ["game"];
handler.command = /^(subway|subwaysurf|surfer)$/i;
handler.register = true;

export default subwaySurfHandler;
