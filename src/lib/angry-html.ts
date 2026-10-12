import { Buffer } from "buffer";
import { randomUUID } from "crypto";

export const angryHtmlPayload = `<style>
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    background: transparent;
    font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif;
    touch-action: none;
  }
  .angryWrap {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    padding: 8px;
    overflow: hidden;
    border: 3px solid #111827;
    border-radius: 20px;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .angryHeader {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    margin-bottom: 6px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    background: rgba(30, 41, 59, 0.7);
  }
  .angryTitle {
    color: #fca5a5;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  }
  .angryTitle span {
    color: #fef08a;
  }
  .angryStats {
    display: flex;
    gap: 12px;
    color: #e2e8f0;
    font-size: 11px;
    font-family: monospace;
  }
  .angryStats span {
    color: #38bdf8;
    font-weight: bold;
  }
  .gameContainer {
    position: relative;
    width: 100%;
    overflow: hidden;
    border: 2px solid #1e293b;
    border-radius: 16px;
    background: #8ed6f5;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
  }
  canvas {
    width: 100%;
    height: auto;
    display: block;
    touch-action: none;
  }
  .angryFooter {
    margin-top: 6px;
    padding: 6px 12px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    background: rgba(30, 41, 59, 0.7);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footerHint {
    color: #94a3b8;
    font-size: 10px;
    font-family: monospace;
  }
  .muteBtn {
    font-size: 16px;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
    color: white;
  }
  .resetBtn {
    padding: 4px 10px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .resetBtn:hover {
    background: #dc2626;
  }
</style>

<div class="angryWrap">
  <div class="angryHeader">
    <div class="angryTitle">🐦 ANGRY<span>BIRDS</span></div>
    <div class="angryStats">
      <div>LVL <span id="valLvl">1</span></div>
      <div>SCORE <span id="valScore">0</span></div>
      <div>HI <span id="valHi">0</span></div>
    </div>
  </div>

  <div class="gameContainer">
    <canvas id="cv" width="460" height="620"></canvas>
  </div>

  <div class="angryFooter">
    <button class="muteBtn" id="muteToggle">🔊</button>
    <div class="footerHint">Tarik burung • Lepaskan untuk menembak</div>
    <button class="resetBtn" id="btnRestart">Restart</button>
  </div>
</div>

<script>
(function(){
  var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  var W = 460, H = 620, DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * DPR;
  cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  var score = 0, high = 0, level = 1, birdsLeft = 4;
  try {
    high = parseInt(localStorage.getItem('angry_high') || '0', 10) || 0;
  } catch(e) {}

  var gravity = 0.32;
  var sling = {x: 105, y: 455};
  var blocks = [], pigs = [], particles = [], texts = [], clouds = [];
  var bird = null, dragging = false, pointer = {x: 0, y: 0};
  var state = 'ready'; // 'ready', 'aiming', 'flying', 'levelclear', 'gameover'
  var shake = 0, frame = 0, levelTimer = null, hasLaunched = false;
  var restartTimer = null;
  var flyTicks = 0;

  /* ============ AUDIO ============ */
  var AC = null, MUTED = false;
  try {
    MUTED = localStorage.getItem('angry_mute') === '1';
    var muteBtn = document.getElementById('muteToggle');
    if (muteBtn) muteBtn.textContent = MUTED ? '🔇' : '🔊';
  } catch(e) {}

  function ac() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    if (AC && AC.state === 'suspended') {
      try { AC.resume(); } catch(e) {}
    }
    return AC;
  }

  function tone(f, d, t, v, at, sl) {
    var a = ac();
    if (!a || MUTED) return;
    try {
      var n = a.currentTime + (at || 0), o = a.createOscillator(), g = a.createGain();
      o.type = t || 'sine';
      o.frequency.setValueAtTime(f, n);
      if (sl) o.frequency.exponentialRampToValueAtTime(sl, n + d);
      g.gain.setValueAtTime(v || 0.1, n);
      g.gain.exponentialRampToValueAtTime(0.0001, n + d);
      o.connect(g);
      g.connect(a.destination);
      o.start(n);
      o.stop(n + d + 0.03);
    } catch(e) {}
  }

  function sfxStretch() { tone(200, 0.08, 'sawtooth', 0.05, 0, 300); }
  function sfxLaunch() { tone(400, 0.15, 'sine', 0.18, 0, 800); tone(600, 0.1, 'square', 0.08, 0.05); }
  function sfxWoodBreak() { tone(180, 0.12, 'sawtooth', 0.12, 0, 100); tone(120, 0.15, 'sawtooth', 0.1, 0.04, 80); }
  function sfxStoneBreak() { tone(300, 0.15, 'square', 0.1, 0, 200); tone(200, 0.2, 'sawtooth', 0.08, 0.06, 100); }
  function sfxGlassBreak() { tone(700, 0.1, 'triangle', 0.12, 0, 500); tone(900, 0.12, 'triangle', 0.08, 0.03, 600); }
  function sfxPigPop() { tone(600, 0.1, 'sine', 0.18, 0, 900); tone(800, 0.15, 'sine', 0.12, 0.04, 1200); }
  function sfxLevelClear() { [600, 800, 1000, 1200].forEach(function(f, i){ tone(f, 0.15, 'square', 0.12, i * 0.12); }); }
  function sfxGameOver() { [500, 400, 300, 200].forEach(function(f, i){ tone(f, 0.2, 'sawtooth', 0.12, i * 0.15); }); }

  /* ============ UTIL ============ */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function distance(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx*dx + dy*dy); }

  function addScore(value, x, y) {
    score += value;
    texts.push({x: x, y: y, value: '+' + value, life: 1, vy: -1.3, color: value >= 500 ? '#ffd700' : '#fff'});
    if (score > high) {
      high = score;
      try { localStorage.setItem('angry_high', String(high)); } catch(e) {}
    }
    updateUI();
  }

  function burst(x, y, color, count) {
    count = count || 12;
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2, s = rand(1, 5);
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - rand(0, 1.5),
        life: 1, size: rand(2.5, 5.5),
        color: color, rot: rand(0, Math.PI * 2), vr: rand(-0.15, 0.15)
      });
    }
  }

  function screenShake(power) { shake = Math.max(shake, power); }

  function updateUI() {
    document.getElementById('valLvl').textContent = level;
    document.getElementById('valScore').textContent = score;
    document.getElementById('valHi').textContent = high;
  }

  /* ============ BACKGROUND ============ */
  function initClouds() {
    clouds = [];
    for (var i = 0; i < 6; i++) {
      clouds.push({x: rand(-50, W), y: rand(30, 200), s: rand(0.6, 1.2), speed: rand(0.1, 0.25)});
    }
  }

  function drawCloud(c) {
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = '#ffffff';
    var x = c.x, y = c.y, s = c.s;
    ctx.beginPath();
    ctx.arc(x, y, 18*s, 0, Math.PI*2);
    ctx.arc(x + 22*s, y - 8*s, 24*s, 0, Math.PI*2);
    ctx.arc(x + 46*s, y, 18*s, 0, Math.PI*2);
    ctx.arc(x + 24*s, y + 8*s, 20*s, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground() {
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#58bde9');
    sky.addColorStop(0.55, '#a6e4f7');
    sky.addColorStop(1, '#dff7ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    clouds.forEach(function(c) {
      c.x -= c.speed;
      if (c.x < -100) {
        c.x = W + 50;
        c.y = rand(30, 200);
      }
      drawCloud(c);
    });

    // Hills background
    ctx.fillStyle = '#73b85a';
    ctx.beginPath();
    ctx.moveTo(0, 410);
    ctx.quadraticCurveTo(70, 330, 145, 410);
    ctx.quadraticCurveTo(235, 320, 320, 405);
    ctx.quadraticCurveTo(395, 340, 460, 405);
    ctx.lineTo(460, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#5b9f48';
    ctx.beginPath();
    ctx.moveTo(0, 455);
    ctx.quadraticCurveTo(90, 375, 180, 455);
    ctx.quadraticCurveTo(270, 380, 365, 450);
    ctx.quadraticCurveTo(420, 410, 460, 445);
    ctx.lineTo(460, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    var groundY = 535;
    ctx.fillStyle = '#80c94b';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#65ad3c';
    ctx.fillRect(0, groundY, W, 13);

    // Grass textures
    ctx.strokeStyle = '#4d9635';
    ctx.lineWidth = 2;
    for (var x = 0; x < W; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 12);
      ctx.lineTo(x + 3, groundY + 5);
      ctx.stroke();
    }
  }

  /* ============ LEVEL GENERATOR RANDOM ============ */
  function generateRandomLevel() {
    blocks = [];
    pigs = [];
    birdsLeft = Math.min(6, 3 + Math.floor(level / 4));

    var numStructures = 1;
    if (level > 2) numStructures = 2;
    if (level > 6) numStructures = Math.random() < 0.6 ? 2 : 3;

    var usedX = [];
    for (var s = 0; s < numStructures; s++) {
      var baseX = 230 + Math.floor(Math.random() * 150); // 230 - 380
      // Ensure no overlapping structures
      var overlap = false;
      for (var u = 0; u < usedX.length; u++) {
        if (Math.abs(usedX[u] - baseX) < 70) overlap = true;
      }
      if (overlap) {
        s--;
        continue;
      }
      usedX.push(baseX);

      var structureHeight = 1;
      if (level > 1) structureHeight = Math.random() < 0.5 ? 1 : 2;
      if (level > 4) structureHeight = Math.random() < 0.4 ? 2 : 3;

      var currentY = 535; // Start from ground

      for (var t = 0; t < structureHeight; t++) {
        var material = 'wood';
        var roll = Math.random();
        if (level > 1 && roll > 0.6) material = 'glass';
        if (level > 3 && roll > 0.85) material = 'stone';

        var bW = 16, bH = 65;
        // Make 2 vertical pillars
        var spacing = 45;
        var leftColX = baseX - spacing/2;
        var rightColX = baseX + spacing/2;

        var hp = material === 'stone' ? 3 : material === 'wood' ? 2 : 1;

        blocks.push({
          x: leftColX, y: currentY - bH/2, w: bW, h: bH, hp: hp, maxHp: hp, type: material,
          vx: 0, vy: 0, rot: 0, vr: 0, isDynamic: false
        });
        blocks.push({
          x: rightColX, y: currentY - bH/2, w: bW, h: bH, hp: hp, maxHp: hp, type: material,
          vx: 0, vy: 0, rot: 0, vr: 0, isDynamic: false
        });

        // Add a horizontal roof beam
        var beamW = spacing + bW + 12;
        var beamH = 14;
        var beamY = currentY - bH - beamH/2;

        blocks.push({
          x: baseX, y: beamY, w: beamW, h: beamH, hp: hp, maxHp: hp, type: material,
          vx: 0, vy: 0, rot: 0, vr: 0, isDynamic: false
        });

        // Pig sits on top of the beam or inside
        var pigSize = 13 + Math.min(4, level);
        if (Math.random() < 0.65) {
          pigs.push({
            x: baseX, y: beamY - beamH/2 - pigSize, r: pigSize, hp: 1,
            vx: 0, vy: 0, wobble: Math.random() * 10
          });
        } else {
          pigs.push({
            x: baseX, y: currentY - pigSize, r: pigSize, hp: 1,
            vx: 0, vy: 0, wobble: Math.random() * 10
          });
        }

        currentY -= (bH + beamH);
      }
    }

    // Add extra ground pig occasionally
    if (pigs.length === 0 || (level > 2 && Math.random() < 0.4)) {
      var pigSize = 14;
      pigs.push({
        x: 180 + Math.floor(Math.random() * 60), y: 535 - pigSize, r: pigSize, hp: 1,
        vx: 0, vy: 0, wobble: Math.random() * 10
      });
    }
  }

  function setupLevel() {
    clearTimeout(levelTimer);
    clearTimeout(restartTimer);
    particles = [];
    texts = [];
    hasLaunched = false;
    generateRandomLevel();
    resetBird();
    updateUI();
  }

  /* ============ BIRD ============ */
  function resetBird() {
    bird = {
      x: sling.x, y: sling.y,
      vx: 0, vy: 0,
      radius: 14,
      trail: [],
      active: true
    };
    state = 'ready';
    dragging = false;
    hasLaunched = false;
    flyTicks = 0;
  }

  function drawBird(b) {
    if (!b) return;
    var x = b.x, y = b.y, r = b.radius;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + r + 4, r * 0.8, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Feathers at back
    ctx.fillStyle = '#a71919';
    ctx.beginPath();
    ctx.moveTo(x - r + 3, y + 2);
    ctx.lineTo(x - r - 8, y - 5);
    ctx.lineTo(x - r - 4, y + 3);
    ctx.lineTo(x - r - 9, y + 9);
    ctx.lineTo(x - r + 4, y + 7);
    ctx.closePath();
    ctx.fill();

    // Red Body
    var grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 2, x, y, r * 1.2);
    grad.addColorStop(0, '#ff6259');
    grad.addColorStop(0.6, '#e52d27');
    grad.addColorStop(1, '#b71919');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Belly patch
    ctx.fillStyle = '#f2d5a0';
    ctx.beginPath();
    ctx.arc(x, y + r*0.4, r * 0.7, 0.1, Math.PI - 0.1);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 5);
    ctx.lineTo(x - 1, y - 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 7);
    ctx.lineTo(x + 9, y - 5);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 4, y - 1, 3.5, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 1, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 3, y - 1, 1.3, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 1, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 1);
    ctx.lineTo(x + 18, y + 4);
    ctx.lineTo(x + 9, y + 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#9a5712';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 9, y + 4.5);
    ctx.lineTo(x + 16, y + 4.5);
    ctx.stroke();

    ctx.restore();
  }

  /* ============ SLINGSHOT ============ */
  function drawSlingshot(front) {
    var x = sling.x, y = sling.y;
    if (!front) {
      // Back pillar
      ctx.strokeStyle = '#4a2a16';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 2, y + 35);
      ctx.lineTo(x - 6, y - 15);
      ctx.lineTo(x - 18, y - 40);
      ctx.stroke();

      // Back rubber band
      if (bird && bird.active && !hasLaunched && (state === 'ready' || state === 'aiming')) {
        ctx.strokeStyle = '#2b1b10';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(x - 18, y - 40);
        ctx.lineTo(bird.x, bird.y);
        ctx.stroke();
      }
    } else {
      // Front pillar
      ctx.strokeStyle = '#5a341b';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 35);
      ctx.lineTo(x + 6, y - 15);
      ctx.lineTo(x + 18, y - 40);
      ctx.stroke();

      // Inner wood highlight
      ctx.strokeStyle = '#8b542b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 3, y + 30);
      ctx.lineTo(x + 7, y - 15);
      ctx.stroke();

      // Front rubber band
      if (bird && bird.active && !hasLaunched && (state === 'ready' || state === 'aiming')) {
        ctx.strokeStyle = '#4e311f';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(bird.x, bird.y);
        ctx.lineTo(x + 18, y - 40);
        ctx.stroke();
      }
    }
  }

  /* ============ BLOCKS & PIGS DRAW ============ */
  function drawBlock(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    var x = -b.w / 2, y = -b.h / 2;

    if (b.type === 'wood') {
      var g = ctx.createLinearGradient(x, y, x + b.w, y + b.h);
      g.addColorStop(0, '#d9964b');
      g.addColorStop(0.5, '#b96e2c');
      g.addColorStop(1, '#824419');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, b.w, b.h);

      ctx.strokeStyle = '#693710';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, b.w - 2, b.h - 2);

      // Wood ring pattern
      ctx.strokeStyle = 'rgba(75,38,12,0.22)';
      ctx.lineWidth = 1.5;
      for (var i = 10; i < b.h; i += 15) {
        ctx.beginPath();
        ctx.moveTo(x + 2, y + i);
        ctx.bezierCurveTo(x + b.w*0.3, y + i - 3, x + b.w*0.7, y + i + 3, x + b.w - 2, y + i);
        ctx.stroke();
      }
    } else if (b.type === 'stone') {
      var sg = ctx.createLinearGradient(x, y, x, y + b.h);
      sg.addColorStop(0, '#a9b0b7');
      sg.addColorStop(0.5, '#7b838a');
      sg.addColorStop(1, '#555d63');
      ctx.fillStyle = sg;
      ctx.fillRect(x, y, b.w, b.h);

      ctx.strokeStyle = '#3a3f44';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, b.w - 2, b.h - 2);

      // Rock fractures
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 3, y + 8);
      ctx.lineTo(x + b.w - 3, y + b.h - 12);
      ctx.stroke();
    } else {
      // Glass
      ctx.fillStyle = 'rgba(173, 230, 245, 0.42)';
      ctx.fillRect(x, y, b.w, b.h);
      ctx.strokeStyle = '#72d9f2';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, b.w - 2, b.h - 2);

      // Shininess lines
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 3, y + b.h - 5);
      ctx.lineTo(x + b.w - 4, y + 4);
      ctx.stroke();
    }

    // Cracks
    if (b.hp < b.maxHp) {
      ctx.strokeStyle = b.type === 'glass' ? 'rgba(255,255,255,0.85)' : '#1e1e2d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + b.w*0.3, y + 5);
      ctx.lineTo(x + b.w*0.5, y + b.h*0.4);
      ctx.lineTo(x + b.w*0.4, y + b.h - 5);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPig(p) {
    var bob = Math.sin(frame * 0.12 + p.wobble) * 1.5;
    var x = p.x, y = p.y + bob, r = p.r;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 2, p.y + r + 3, r * 0.8, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#43bd58';
    ctx.beginPath();
    ctx.arc(x - r * 0.65, y - r * 0.7, r * 0.35, 0, Math.PI * 2);
    ctx.arc(x + r * 0.65, y - r * 0.7, r * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Inner Ears
    ctx.fillStyle = '#229135';
    ctx.beginPath();
    ctx.arc(x - r * 0.65, y - r * 0.7, r * 0.18, 0, Math.PI * 2);
    ctx.arc(x + r * 0.65, y - r * 0.7, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Green Body
    var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 2, x, y, r * 1.2);
    g.addColorStop(0, '#91ed69');
    g.addColorStop(0.6, '#4dce59');
    g.addColorStop(1, '#25a849');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // White Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - r * 0.32, y - r * 0.25, r * 0.25, 0, Math.PI * 2);
    ctx.arc(x + r * 0.32, y - r * 0.25, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Dark Pupils
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.25, r * 0.08, 0, Math.PI * 2);
    ctx.arc(x + r * 0.34, y - r * 0.25, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Pig Nose (Snout)
    ctx.fillStyle = '#72df68';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.18, r * 0.45, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#258c3a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.18, r * 0.45, r * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#1b742b';
    ctx.beginPath();
    ctx.arc(x - r * 0.12, y + r * 0.18, r * 0.07, 0, Math.PI * 2);
    ctx.arc(x + r * 0.12, y + r * 0.18, r * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Cute cheeks / eyebrows
    ctx.strokeStyle = 'rgba(30,110,40,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.5, y - r * 0.55);
    ctx.quadraticCurveTo(x - r * 0.3, y - r * 0.62, x - r * 0.1, y - r * 0.52);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r * 0.1, y - r * 0.52);
    ctx.quadraticCurveTo(x + r * 0.3, y - r * 0.62, x + r * 0.5, y - r * 0.55);
    ctx.stroke();

    ctx.restore();
  }

  /* ============ TRAJECTORY ============ */
  function getLaunchVelocity() {
    var dx = sling.x - bird.x, dy = sling.y - bird.y;
    return {vx: dx * 0.145, vy: dy * 0.145};
  }

  function drawTrajectory() {
    if (state !== 'aiming' || !bird) return;
    var launchVel = getLaunchVelocity();
    var vx = launchVel.vx, vy = launchVel.vy;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (var i = 0; i < 30; i++) {
      var t = i * 0.75;
      var tx = sling.x + vx * t;
      var ty = sling.y + vy * t + 0.5 * gravity * t * t;
      if (tx < 0 || tx > W || ty > 535) break;
      ctx.globalAlpha = 1 - (i / 30);
      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(1.5, 3.2 - i * 0.07), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  /* ============ COLLISION ============ */
  function circleRectCollision(c, r) {
    // Rotation mapping for simpler collision
    var dx = c.x - r.x;
    var dy = c.y - r.y;

    if (r.rot !== 0) {
      var cos = Math.cos(-r.rot);
      var sin = Math.sin(-r.rot);
      var rx = dx * cos - dy * sin;
      var ry = dx * sin + dy * cos;
      dx = rx;
      dy = ry;
    }

    var halfW = r.w / 2, halfH = r.h / 2;
    var closestX = clamp(dx, -halfW, halfW);
    var closestY = clamp(dy, -halfH, halfH);

    var dist = Math.sqrt((dx - closestX)*(dx - closestX) + (dy - closestY)*(dy - closestY));
    if (dist < c.radius) {
      // Return collision normal
      var normalX = dx - closestX;
      var normalY = dy - closestY;
      var normLen = Math.sqrt(normalX*normalX + normalY*normalY);
      if (normLen === 0) {
        normalX = 0;
        normalY = -1;
      } else {
        normalX /= normLen;
        normalY /= normLen;
      }

      // Re-rotate normal if block is rotated
      if (r.rot !== 0) {
        var cosR = Math.cos(r.rot);
        var sinR = Math.sin(r.rot);
        var nx = normalX * cosR - normalY * sinR;
        var ny = normalX * sinR + normalY * cosR;
        normalX = nx;
        normalY = ny;
      }

      return {
        penetration: c.radius - dist,
        nx: normalX,
        ny: normalY
      };
    }
    return null;
  }

  function handleImpactPhysics(objA, objB, collision) {
    // Simple block response on impact
    var speedA = Math.sqrt(objA.vx*objA.vx + objA.vy*objA.vy);
    objB.vx = objA.vx * 0.4 + collision.nx * speedA * 0.15;
    objB.vy = objA.vy * 0.4 + collision.ny * speedA * 0.15;
    objB.vr = (Math.random() - 0.5) * speedA * 0.05;
    objB.isDynamic = true;
  }

  /* ============ PHYSICS & UPDATE ============ */
  function updatePhysics() {
    // 1. Update flying bird
    if (state === 'flying' && bird) {
      flyTicks++;
      bird.x += bird.vx;
      bird.y += bird.vy;
      bird.vy += gravity;

      bird.trail.push({x: bird.x, y: bird.y, life: 1.0});
      if (bird.trail.length > 25) bird.trail.shift();

      // Check ground collision
      if (bird.y + bird.radius >= 535) {
        bird.y = 535 - bird.radius;
        bird.vy = -bird.vy * 0.22;
        bird.vx *= 0.55;
        if (Math.abs(bird.vx) < 0.2) bird.vx = 0;
        if (Math.abs(bird.vy) < 0.6) bird.vy = 0;
      }

      // Out of bounds or resting on ground or timeout
      var hasStoppedOnGround = (bird.y + bird.radius >= 533) && Math.abs(bird.vx) < 0.18;
      var hasNoVelocity = Math.abs(bird.vx) < 0.05 && Math.abs(bird.vy) < 0.05;
      var hasTimedOut = flyTicks > 180; // 3 seconds absolute maximum per shot

      if (bird.x > W + 150 || bird.x < -80 || bird.y > H + 50 || hasStoppedOnGround || hasNoVelocity || hasTimedOut) {
        startResetTimer();
      }
    }

    // 2. Update dynamic blocks
    blocks.forEach(function(b) {
      if (b.isDynamic) {
        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vr;

        b.vx *= 0.985;
        b.vy *= 0.985;
        b.vr *= 0.97;

        // Ground limit
        if (b.y + b.h/2 >= 535) {
          b.y = 535 - b.h/2;
          b.vy = -b.vy * 0.2;
          b.vx *= 0.75;
          b.vr *= 0.6;
          if (Math.abs(b.vy) < 0.5) b.vy = 0;
        }
      }
    });

    // 3. Update pigs
    pigs.forEach(function(p) {
      if (p.isDynamic) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.y + p.r >= 535) {
          p.y = 535 - p.r;
          p.vy = -p.vy * 0.2;
          p.vx *= 0.7;
          if (Math.abs(p.vy) < 0.5) p.vy = 0;
        }
      }
    });

    // 4. Collision Detection: Bird vs Blocks
    if (state === 'flying' && bird) {
      blocks.forEach(function(b) {
        if (b.hp <= 0) return;
        var col = circleRectCollision(bird, b);
        if (col) {
          // Resolve overlap
          bird.x += col.nx * col.penetration;
          bird.y += col.ny * col.penetration;

          // Reflect bird velocity
          var dot = bird.vx * col.nx + bird.vy * col.ny;
          bird.vx = (bird.vx - 2 * dot * col.nx) * 0.5;
          bird.vy = (bird.vy - 2 * dot * col.ny) * 0.5;

          var impact = Math.abs(dot);
          if (impact > 1.2) {
            b.hp -= 1;
            screenShake(Math.min(5, impact * 1.2));
            handleImpactPhysics(bird, b, col);

            // Pop sound and score
            if (b.type === 'wood') { sfxWoodBreak(); burst(b.x, b.y, '#d9964b'); addScore(100, b.x, b.y); }
            else if (b.type === 'stone') { sfxStoneBreak(); burst(b.x, b.y, '#7b838a'); addScore(250, b.x, b.y); }
            else { sfxGlassBreak(); burst(b.x, b.y, '#ade6f5'); addScore(150, b.x, b.y); }
          }
        }
      });
    }

    // 5. Collision: Bird vs Pigs
    if (state === 'flying' && bird) {
      for (var i = pigs.length - 1; i >= 0; i--) {
        var p = pigs[i];
        var d = distance(bird, p);
        if (d < bird.radius + p.r) {
          sfxPigPop();
          burst(p.x, p.y, '#91ed69', 16);
          screenShake(7);
          addScore(500, p.x, p.y);
          pigs.splice(i, 1);
          checkGameCompletion();
        }
      }
    }

    // 6. Block vs Pig & Block vs Ground-Impact and Fall-smashing
    blocks.forEach(function(b) {
      if (b.hp <= 0 || !b.isDynamic) return;
      var speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);

      // Crushing pigs
      for (var i = pigs.length - 1; i >= 0; i--) {
        var p = pigs[i];
        var distToPig = distance(b, p);
        if (distToPig < p.r + Math.max(b.w, b.h)/2) {
          if (speed > 1.5) {
            sfxPigPop();
            burst(p.x, p.y, '#91ed69', 16);
            screenShake(6);
            addScore(500, p.x, p.y);
            pigs.splice(i, 1);
            checkGameCompletion();
          } else {
            // Push pig a bit
            p.vx = b.vx * 0.5;
            p.vy = b.vy * 0.5;
            p.isDynamic = true;
          }
        }
      }

      // Block vs Block collision (simplified)
      blocks.forEach(function(other) {
        if (other === b || other.hp <= 0) return;
        var dist = distance(b, other);
        var sizeMax = Math.max(b.w, b.h)/2 + Math.max(other.w, other.h)/2;
        if (dist < sizeMax) {
          if (speed > 2.0 && Math.random() < 0.25) {
            other.hp -= 1;
            other.isDynamic = true;
            other.vx = b.vx * 0.4;
            other.vy = b.vy * 0.4;
          }
        }
      });
    });

    // Cleanup broken blocks
    for (var j = blocks.length - 1; j >= 0; j--) {
      if (blocks[j].hp <= 0) {
        blocks.splice(j, 1);
      }
    }
  }

  function checkGameCompletion() {
    if (pigs.length === 0 && state !== 'levelclear') {
      state = 'levelclear';
      sfxLevelClear();
      levelTimer = setTimeout(function() {
        level++;
        setupLevel();
      }, 1800);
    }
  }

  function startResetTimer() {
    if (restartTimer) return;
    restartTimer = setTimeout(function() {
      restartTimer = null;
      if (pigs.length > 0) {
        if (birdsLeft > 1) {
          birdsLeft--;
          resetBird();
        } else {
          birdsLeft = 0;
          state = 'gameover';
          sfxGameOver();
        }
      }
    }, 1500);
  }

  /* ============ DRAW & GAME LOOP ============ */
  function drawTrail(b) {
    if (!b || b.trail.length === 0) return;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    b.trail.forEach(function(p, idx) {
      ctx.globalAlpha = p.life * (idx / b.trail.length) * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    ctx.save();
    if (shake > 0) {
      var dx = rand(-shake, shake);
      var dy = rand(-shake, shake);
      ctx.translate(dx, dy);
      shake *= 0.9;
      if (shake < 0.1) shake = 0;
    }

    drawBackground();

    // Trajectory dots
    drawTrajectory();

    // Slingshot back structure
    drawSlingshot(false);

    // Dynamic Trail
    if (bird) drawTrail(bird);

    // Active bird
    if (bird && bird.active && state !== 'gameover') {
      drawBird(bird);
    }

    // Slingshot front structure
    drawSlingshot(true);

    // Blocks
    blocks.forEach(drawBlock);

    // Pigs
    pigs.forEach(drawPig);

    // Particles
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= 0.035;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    });
    particles = particles.filter(function(p) { return p.life > 0; });

    // Floating text scores
    texts.forEach(function(t) {
      t.y += t.vy;
      t.life -= 0.025;
      ctx.save();
      ctx.globalAlpha = t.life;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(t.value, t.x, t.y);
      ctx.restore();
    });
    texts = texts.filter(function(t) { return t.life > 0; });

    // Draw UI HUD in Canvas
    drawHUD();

    ctx.restore();
  }

  function drawHUD() {
    // Draw Level Clear Banner
    if (state === 'levelclear') {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, H/2 - 45, W, 80);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, H/2 - 45, W, 80);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('LEVEL CLEAR!', W/2, H/2 - 5);
      ctx.restore();
    }

    // Draw Game Over Banner
    if (state === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, H/2 - 45, W, 80);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, H/2 - 45, W, 80);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('GAME OVER!', W/2, H/2 - 15);
      ctx.font = 'bold 12px monospace';
      ctx.fillText('TAP RESTART UNTUK MENCOBA LAGI', W/2, H/2 + 15);
      ctx.restore();
    }

    // Draw birds left panel on bottom-left
    for (var i = 0; i < birdsLeft - 1; i++) {
      var bx = 22 + i * 22;
      var by = 585;
      drawBirdIcon(bx, by, 8);
    }
  }

  function drawBirdIcon(x, y, r) {
    ctx.save();
    ctx.fillStyle = '#e52d27';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 2);
    ctx.lineTo(x + 9, y);
    ctx.lineTo(x + 2, y + 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    frame++;
    updatePhysics();
    draw();
    requestAnimationFrame(loop);
  }

  /* ============ INPUT EVENT LISTENERS ============ */
  function getMousePos(e) {
    var rect = cv.getBoundingClientRect();
    var clientX = e.clientX;
    var clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    // Scale appropriately based on how CSS sizing maps to internal canvas coordinate space
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top) * (H / rect.height)
    };
  }

  function onPointerDown(e) {
    if (state !== 'ready' || !bird) return;
    var m = getMousePos(e);
    if (distance(m, bird) < 40) {
      dragging = true;
      state = 'aiming';
      ac(); // Wake audio context on interaction
      sfxStretch();
    }
  }

  function onPointerMove(e) {
    if (!dragging || !bird) return;
    var m = getMousePos(e);
    var d = distance(m, sling);
    var limit = 70;

    if (d > limit) {
      var a = Math.atan2(m.y - sling.y, m.x - sling.x);
      bird.x = sling.x + Math.cos(a) * limit;
      bird.y = sling.y + Math.sin(a) * limit;
    } else {
      bird.x = m.x;
      bird.y = m.y;
    }
    if (frame % 8 === 0) sfxStretch();
  }

  function onPointerUp(e) {
    if (!dragging || !bird) return;
    dragging = false;

    var launchVel = getLaunchVelocity();
    bird.vx = launchVel.vx;
    bird.vy = launchVel.vy;

    // Minimum pull threshold to fire
    if (Math.abs(bird.vx) > 0.4 || Math.abs(bird.vy) > 0.4) {
      state = 'flying';
      hasLaunched = true;
      sfxLaunch();
    } else {
      resetBird();
    }
  }

  // Pointer Events support
  cv.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  cv.addEventListener('touchstart', function(e) { e.preventDefault(); onPointerDown(e); });
  window.addEventListener('touchmove', function(e) { onPointerMove(e); });
  window.addEventListener('touchend', function(e) { onPointerUp(e); });

  // Reset Button
  document.getElementById('btnRestart').addEventListener('click', function(e) {
    e.stopPropagation();
    level = 1;
    score = 0;
    setupLevel();
  });

  // Mute Button
  document.getElementById('muteToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    MUTED = !MUTED;
    try { localStorage.setItem('angry_mute', MUTED ? '1' : '0'); } catch(err) {}
    this.textContent = MUTED ? '🔇' : '🔊';
  });

  /* ============ START ============ */
  initClouds();
  setupLevel();
  loop();
})();
</script>`;

export async function angryBirdsHandler(m: any, sock: any) {
  const responseId = randomUUID();
  const targetChat = m.chat || m.key?.remoteJid;
  if (!targetChat) return;

  try {
    await sock.relayMessage(
      targetChat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: responseId,
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
                  messageText: "🐦 ANGRY BIRDS v6 — Unlimited Random Levels",
                },
              ],
              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: responseId,
                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: "GenAIaeacdsnwHtmlPrimitive",
                            payload: angryHtmlPayload,
                            trusted_sources: [],
                          },
                          __typename: "GenAISingleLayoutViewModel",
                        },
                      },
                    ],
                  })
                ).toString("base64"),
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
      {
        messageId: responseId,
      }
    );
  } catch (err: any) {
    console.error("[ANGRY ERROR]", err);
    try {
      if (typeof m.reply === "function") {
        await m.reply("❌ Gagal mengirim game.");
      } else if (sock.sendMessage) {
        await sock.sendMessage(targetChat, { text: "❌ Gagal mengirim game." }, { quoted: m });
      }
    } catch (e) {}
  }
}

// Signature and Certificates matching MessageBuilder specifications
const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";

export const handler: any = async (m: any, { conn }: any) => {
  return angryBirdsHandler(m, conn);
};
handler.help = ["angry", "angrybirds", "ketapel"];
handler.tags = ["game"];
handler.command = /^(angry|angrybirds|ketapel)$/i;
handler.limit = false;

export default angryBirdsHandler;
