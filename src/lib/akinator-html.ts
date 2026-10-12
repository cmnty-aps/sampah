import { Buffer } from "buffer";
import crypto from "crypto";

export const AKINATOR_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Akinator - Sang Jin Pembaca Pikiran</title>
<style>
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
html, body {
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  user-select: none;
  -webkit-user-select: none;
  background: radial-gradient(circle at 50% 20%, #15558d 0%, #0c3862 55%, #051e36 100%);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  height: 100dvh;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  padding: 6px 10px 8px;
  justify-content: space-between;
}

/* Header */
.aki-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-bottom: 2px solid rgba(245, 197, 66, 0.4);
  background: rgba(4, 26, 49, 0.7);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}
.aki-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #ffdf6d;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.aki-logo .lamp-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(255,215,0,0.6));
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.stat-pill {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 223, 109, 0.4);
  color: #ffdf6d;
  padding: 3px 8px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 223, 109, 0.35);
  color: #ffdf6d;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
}
.icon-btn:active { transform: scale(0.92); background: rgba(255, 255, 255, 0.2); }

/* Main Stage */
.main-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 2px;
  gap: 4px;
  position: relative;
  overflow: hidden;
}

/* 2D Genie Character Frame */
.genie-frame {
  width: 100%;
  max-width: 180px;
  height: 120px;
  max-height: 125px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));
  flex-shrink: 0;
}
.genie-svg {
  width: 100%;
  height: 100%;
  max-height: 120px;
  transition: transform 0.3s ease;
}

/* Authentic Akinator Speech Bubble */
.bubble-container {
  width: 100%;
  position: relative;
  z-index: 10;
}
.speech-bubble {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 8px 12px;
  box-shadow: 0 8px 20px -3px rgba(0, 0, 0, 0.35);
  position: relative;
  text-align: center;
}
.speech-bubble::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 8px 8px 8px;
  border-style: solid;
  border-color: transparent transparent #ffffff transparent;
  display: block;
  width: 0;
}
.q-number {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 10px;
  margin-bottom: 3px;
}
.q-text {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Akinometer Progress Bar */
.akinometer-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
  margin: 2px 0;
}
.akinometer-bar {
  flex: 1;
  height: 7px;
  background: rgba(5, 23, 44, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(255, 223, 109, 0.4);
  overflow: hidden;
  position: relative;
}
.akinometer-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 50%, #f59e0b 100%);
  border-radius: 8px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.akinometer-label {
  font-size: 11px;
  font-weight: 800;
  color: #ffdf6d;
  font-family: monospace;
  min-width: 32px;
  text-align: right;
}

/* 5 Authentic Answer Buttons */
.answers-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 2px;
}
.answers-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.btn-ans {
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 10px;
  background: #ffffff;
  color: #1e293b;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  padding: 7px 6px;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(0,0,0,0.05);
  transition: all 0.12s ease;
}
.btn-ans:active {
  transform: translateY(2px);
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.btn-ans.ya {
  border-color: #22c55e;
  color: #15803d;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}
.btn-ans.tidak {
  border-color: #ef4444;
  color: #b91c1c;
  background: linear-gradient(180deg, #ffffff 0%, #fef2f2 100%);
}
.btn-ans.gatau {
  border-color: #f59e0b;
  color: #b45309;
  background: linear-gradient(180deg, #ffffff 0%, #fffbeb 100%);
}
.btn-ans.mungkin {
  border-color: #0284c7;
  color: #0369a1;
  background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%);
}
.btn-ans.mungkintidak {
  border-color: #8b5cf6;
  color: #6d28d9;
  background: linear-gradient(180deg, #ffffff 0%, #faf5ff 100%);
}

/* Sub controls (Kembali & Ulang) */
.sub-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 6px;
  margin-top: 2px;
}
.btn-sub {
  flex: 1;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 223, 109, 0.35);
  color: #ffdf6d;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s ease;
}
.btn-sub:active { transform: scale(0.96); background: rgba(255, 255, 255, 0.22); }

/* Overlays (Guess Proposal, Win, Defeat) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 20, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow-y: auto;
}
.modal-overlay.hidden { display: none !important; }

.modal-card {
  background: #ffffff;
  border: 3px solid #ffdf6d;
  border-radius: 18px;
  width: 100%;
  max-width: 350px;
  max-height: calc(100dvh - 24px);
  overflow-y: auto;
  padding: 16px 14px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.7);
  animation: popIn 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-sizing: border-box;
}
@keyframes popIn {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal-title {
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 2px;
  font-family: Georgia, serif;
}
.modal-sub {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

/* Character Photo Container */
.char-photo-wrapper {
  width: 110px;
  height: 110px;
  margin: 0 auto 10px;
  border-radius: 16px;
  border: 3px solid #f59e0b;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  background: #f1f5f9;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.char-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}
.char-photo.loaded {
  display: block;
}
.char-photo-fallback {
  font-size: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #e0f2fe 0%, #bae6fd 100%);
}
.char-photo-fallback.hidden {
  display: none !important;
}

.char-title {
  font-size: 17px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 3px;
  line-height: 1.25;
}
.char-details {
  font-size: 12px;
  color: #475569;
  line-height: 1.35;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  gap: 8px;
}
.modal-btn {
  flex: 1;
  padding: 10px 8px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: transform 0.1s ease;
}
.modal-btn:active { transform: scale(0.96); }
.modal-btn.confirm {
  background: #16a34a;
  color: #ffffff;
  box-shadow: 0 3px 0 #15803d;
}
.modal-btn.reject {
  background: #dc2626;
  color: #ffffff;
  box-shadow: 0 3px 0 #b91c1c;
}
.modal-btn.primary {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 3px 0 #0369a1;
  width: 100%;
}

/* Footer Credit */
.footer-credit {
  margin-top: 4px;
  text-align: center;
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5px;
}
</style>
</head>
<body>

<div class="app-container">
  <!-- Authentic Header -->
  <header class="aki-header">
    <div class="aki-logo">
      <span class="lamp-icon">🪔</span>
      <span>AKINATOR</span>
    </div>
    <div class="header-actions">
      <div class="stat-pill" id="stepPill">Pertanyaan 1</div>
      <button class="icon-btn" id="muteBtn" title="Suara">🔊</button>
    </div>
  </header>

  <!-- Main Stage -->
  <main class="main-stage">
    <!-- 2D Genie Character (Authentic Vector Graphic) -->
    <div class="genie-frame" id="genieFrame">
      <svg class="genie-svg" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="turbanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8d7b0"/>
            <stop offset="100%" stop-color="#e2aa72"/>
          </linearGradient>
          <linearGradient id="vestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#034575"/>
          </linearGradient>
          <linearGradient id="smokeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(14,165,233,0.6)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>

        <!-- Mystical Vapor / Smoke from Lamp -->
        <path d="M120 180 C110 160, 135 150, 120 135 C110 125, 128 115, 120 100" stroke="url(#smokeGrad)" stroke-width="18" stroke-linecap="round" fill="none" />
        <path d="M120 180 C112 165, 128 152, 120 135" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />

        <!-- Golden Aladdin Lamp at bottom left -->
        <g transform="translate(45, 155) scale(0.65)">
          <ellipse cx="40" cy="40" rx="30" ry="12" fill="url(#goldGrad)" />
          <path d="M20 40 Q40 10 65 35 Q85 20 80 18 Q60 38 40 40 Z" fill="url(#goldGrad)" />
          <circle cx="20" cy="28" r="12" stroke="url(#goldGrad)" stroke-width="4" fill="none" />
        </g>

        <!-- Torso & Blue Vest -->
        <path d="M85 100 L155 100 L140 145 L100 145 Z" fill="url(#vestGrad)" stroke="#ca8a04" stroke-width="2" />
        <!-- Inner Shirt / Chest -->
        <polygon points="105,100 135,100 120,130" fill="url(#skinGrad)" />
        <path d="M102 100 L118 132 L138 100" stroke="#ca8a04" stroke-width="2" fill="none" />

        <!-- Arms (Classic Folded Arms Pose) -->
        <g id="genieArms">
          <path d="M85 102 C75 118, 95 138, 120 135 C145 138, 165 118, 155 102 C150 115, 138 126, 120 126 C102 126, 90 115, 85 102 Z" fill="url(#skinGrad)" stroke="#ca8a04" stroke-width="1.5" />
          <path d="M92 122 L148 122" stroke="#ca8a04" stroke-width="1.5" />
        </g>

        <!-- Neck -->
        <rect x="112" y="80" width="16" height="15" fill="url(#skinGrad)" />

        <!-- Head -->
        <ellipse cx="120" cy="65" rx="22" ry="24" fill="url(#skinGrad)" />

        <!-- Pointed Ears & Gold Earring -->
        <path d="M98 62 L86 54 L99 70 Z" fill="url(#skinGrad)" />
        <path d="M142 62 L154 54 L141 70 Z" fill="url(#skinGrad)" />
        <circle cx="88" cy="67" r="4.5" stroke="url(#goldGrad)" stroke-width="2" fill="none" />

        <!-- Goatee Beard & Mustache -->
        <path d="M112 77 Q120 88 128 77 Q120 95 112 77 Z" fill="#1e293b" />
        <path d="M110 72 Q120 75 130 72" stroke="#1e293b" stroke-width="2" fill="none" />

        <!-- Eyes & Eyebrows -->
        <g id="genieEyes">
          <ellipse cx="111" cy="62" rx="4" ry="3" fill="#ffffff" />
          <ellipse cx="129" cy="62" rx="4" ry="3" fill="#ffffff" />
          <circle cx="112" cy="62" r="2" fill="#0f172a" />
          <circle cx="128" cy="62" r="2" fill="#0f172a" />
          <!-- Eyebrows (Arched confident look) -->
          <path d="M106 56 Q112 53 117 56" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" />
          <path d="M123 56 Q128 53 134 56" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" />
        </g>

        <!-- Nose & Smile -->
        <path d="M120 62 L118 68 L122 68" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" fill="none" />
        <path d="M114 73 Q120 77 126 73" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" />

        <!-- Classic White Turban -->
        <path d="M96 52 C94 30, 146 30, 144 52 C146 42, 138 34, 120 34 C102 34, 94 42, 96 52 Z" fill="url(#turbanGrad)" stroke="#cbd5e1" stroke-width="1.5" />
        <ellipse cx="120" cy="48" rx="26" ry="12" fill="url(#turbanGrad)" stroke="#cbd5e1" stroke-width="1.5" />
        <!-- Golden Turban Band -->
        <path d="M96 50 Q120 56 144 50 Q120 60 96 50 Z" fill="url(#goldGrad)" />
        <!-- Ruby Gem on Turban -->
        <circle cx="120" cy="47" r="4.5" fill="#dc2626" stroke="#ca8a04" stroke-width="1" />
        <!-- Cyan Feather -->
        <path d="M120 44 Q116 22 122 14 Q124 24 120 44 Z" fill="#06b6d4" />
      </svg>
    </div>

    <!-- Authentic Speech Bubble -->
    <div class="bubble-container">
      <div class="speech-bubble">
        <span class="q-number" id="qNumberBadge">Pertanyaan 1</span>
        <div class="q-text" id="questionText">Menghubungkan ke Akinator...</div>
      </div>
    </div>

    <!-- Akinometer Progress Bar -->
    <div class="akinometer-wrap">
      <div class="akinometer-bar">
        <div class="akinometer-fill" id="progFill"></div>
      </div>
      <div class="akinometer-label" id="progLabel">0%</div>
    </div>

    <!-- The 5 Authentic Answer Buttons -->
    <div class="answers-grid">
      <div class="answers-row">
        <button class="btn-ans ya" id="btnYa">
          <span>✅</span>
          <span>Ya</span>
        </button>
        <button class="btn-ans tidak" id="btnTidak">
          <span>❌</span>
          <span>Tidak</span>
        </button>
      </div>
      <div class="answers-row">
        <button class="btn-ans gatau" id="btnGatau">
          <span>❓</span>
          <span>Saya Tidak Tahu</span>
        </button>
        <button class="btn-ans mungkin" id="btnMungkin">
          <span>🔮</span>
          <span>Mungkin</span>
        </button>
      </div>
      <button class="btn-ans mungkintidak" id="btnMungkinTidak">
        <span>🌧️</span>
        <span>Mungkin Tidak</span>
      </button>
    </div>

    <!-- Sub Controls -->
    <div class="sub-controls">
      <button class="btn-sub" id="btnBack">
        <span>↩️</span>
        <span>Pertanyaan Sebelumnya</span>
      </button>
      <button class="btn-sub" id="btnRestart">
        <span>🔄</span>
        <span>Mulai Ulang</span>
      </button>
    </div>
  </main>

  <footer class="footer-credit">
    Akinator • Ditenagai oleh CMNTY
  </footer>
</div>

<!-- Modal: Guess Proposal (Akinator Menebak dengan FOTO ASLI) -->
<div class="modal-overlay hidden" id="guessModal">
  <div class="modal-card">
    <div class="modal-title">AKU MEMIKIRKAN...</div>
    <div class="modal-sub">Apakah ini tokoh yang kamu pikirkan?</div>
    
    <!-- Real Character Photo -->
    <div class="char-photo-wrapper">
      <img id="guessPhoto" class="char-photo" alt="Foto Karakter" />
      <div class="char-photo-fallback" id="guessPhotoFallback">👤</div>
    </div>

    <div class="char-title" id="guessName">Nama Tokoh</div>
    <div class="char-details" id="guessDesc">Deskripsi tokoh...</div>
    <div class="modal-actions">
      <button class="modal-btn confirm" id="btnConfirmGuess">YA, BENAR! 🎉</button>
      <button class="modal-btn reject" id="btnRejectGuess">BUKAN ❌</button>
    </div>
  </div>
</div>

<!-- Modal: Win Screen (Akinator Berhasil Menebak) -->
<div class="modal-overlay hidden" id="winModal">
  <div class="modal-card">
    <!-- Win Photo -->
    <div class="char-photo-wrapper" style="width: 100px; height: 100px; margin-bottom: 8px;">
      <img id="winPhoto" class="char-photo" alt="Foto Karakter" />
      <div class="char-photo-fallback" id="winPhotoFallback">🎉</div>
    </div>

    <div class="modal-title" style="color: #16a34a;">HEBAT! AKU MENEBAKNYA!</div>
    <div class="modal-sub">Pikiranmu berhasil kubaca sekali lagi!</div>
    <div class="char-title" id="winCharName" style="color: #0284c7; margin-top: 6px;">-</div>
    <p style="font-size: 13px; color: #64748b; margin: 6px 0 16px;">
      Tertebak dalam <strong id="winStepsCount" style="color: #0f172a;">0</strong> pertanyaan.
    </p>
    <button class="modal-btn primary" id="btnPlayAgain">MAIN LAGI 🔮</button>
  </div>
</div>

<!-- Modal: Defeat Screen (Akinator Menyerah) -->
<div class="modal-overlay hidden" id="defeatModal">
  <div class="modal-card">
    <div style="font-size: 48px; margin-bottom: 8px;">🎩👏</div>
    <div class="modal-title" style="color: #ca8a04;">BRAVO! KAMU MENANG!</div>
    <div class="modal-sub">Aku menyerah! Tokoh yang kamu pikirkan terlalu sulit atau unik.</div>
    <p style="font-size: 13px; color: #64748b; margin: 12px 0 18px;">
      Hebat! Kamu berhasil mengelabui sang Jin pembaca pikiran.
    </p>
    <button class="modal-btn primary" id="btnDefeatAgain">TANTANG LAGI 🔮</button>
  </div>
</div>

<script>
// Audio Synthesizer (Native Web Audio API)
var audioCtx = null;
var soundMuted = false;

function initAudio() {
  if (!audioCtx) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type, duration, gainVal) {
  if (soundMuted) return;
  initAudio();
  if (!audioCtx) return;
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal || 0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e){}
}

function sfxClick() { playTone(560, 'sine', 0.08, 0.15); }
function sfxMagic() {
  playTone(440, 'sine', 0.14, 0.15);
  setTimeout(function(){ playTone(659, 'sine', 0.16, 0.15); }, 75);
  setTimeout(function(){ playTone(880, 'sine', 0.22, 0.15); }, 150);
}
function sfxWin() {
  var chords = [523.25, 659.25, 783.99, 1046.50];
  chords.forEach(function(f, idx){
    setTimeout(function(){ playTone(f, 'triangle', 0.35, 0.2); }, idx * 95);
  });
}
function sfxDefeat() {
  playTone(320, 'sawtooth', 0.25, 0.15);
  setTimeout(function(){ playTone(240, 'sawtooth', 0.3, 0.15); }, 110);
}

// Fallback Character Knowledge Base with Real Photo URLs
var CHARACTERS = [
  // Indonesian Leaders & Politics
  { id: 'jokowi', name: 'Joko Widodo (Jokowi)', desc: 'Presiden Republik Indonesia ke-7 (2014-2024)', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fb%2Fbe%2FJoko_Widodo_2019_official_portrait.jpg%2F500px-Joko_Widodo_2019_official_portrait.jpg&w=400&output=jpg', icon: '🏛️', tags: ['real', 'indo', 'man', 'politisi', 'presiden', 'famous', 'solo'] },
  { id: 'prabowo', name: 'Prabowo Subianto', desc: 'Presiden Republik Indonesia ke-8, Menhan, Ketum Gerindra', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F55%2FPrabowo_Subianto_2024_official_portrait.jpg%2F500px-Prabowo_Subianto_2024_official_portrait.jpg&w=400&output=jpg', icon: '🎖️', tags: ['real', 'indo', 'man', 'politisi', 'presiden', 'militer'] },
  { id: 'gibran', name: 'Gibran Rakabuming Raka', desc: 'Wakil Presiden RI ke-14, mantan Walikota Solo, putra Jokowi', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F22%2FGibran_Rakabuming_2024_official_portrait.jpg%2F500px-Gibran_Rakabuming_2024_official_portrait.jpg&w=400&output=jpg', icon: '👔', tags: ['real', 'indo', 'man', 'politisi', 'muda', 'solo'] },
  { id: 'megawati', name: 'Megawati Soekarnoputri', desc: 'Presiden RI ke-5, Ketua Umum PDI Perjuangan', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F88%2FPresident_Megawati_Sukarnoputri_-_Indonesia.jpg%2F500px-President_Megawati_Sukarnoputri_-_Indonesia.jpg&w=400&output=jpg', icon: '🔴', tags: ['real', 'indo', 'woman', 'politisi', 'presiden'] },
  { id: 'soekarno', name: 'Ir. Soekarno', desc: 'Proklamator Kemerdekaan & Presiden RI Pertama', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F01%2FPresiden_Sukarno.jpg%2F500px-Presiden_Sukarno.jpg&w=400&output=jpg', icon: '⭐', tags: ['real', 'indo', 'man', 'politisi', 'presiden', 'pahlawan', 'meninggal'] },
  { id: 'habibie', name: 'B.J. Habibie', desc: 'Presiden RI ke-3, Teknokrat jenius pembuat pesawat N250', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2a%2FB._J._Habibie%252C_President_of_Indonesia_portrait.jpg%2F500px-B._J._Habibie%252C_President_of_Indonesia_portrait.jpg&w=400&output=jpg', icon: '✈️', tags: ['real', 'indo', 'man', 'politisi', 'presiden', 'teknologi', 'meninggal'] },
  { id: 'anies', name: 'Anies Baswedan', desc: 'Mantan Gubernur DKI Jakarta & mantan Mendikbud', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F7%2F72%2FAnies_Baswedan%252C_Candidate_for_Indonesia%2527s_President_in_2024.jpg%2F500px-Anies_Baswedan%252C_Candidate_for_Indonesia%2527s_President_in_2024.jpg&w=400&output=jpg', icon: '👓', tags: ['real', 'indo', 'man', 'politisi', 'jakarta', 'kacamata'] },

  // Indonesian Creators & Celebrities
  { id: 'deddy', name: 'Deddy Corbuzier', desc: 'Podcaster Close The Door, mantan mentalist pesulap', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff2%2FDeddy_Corbuzier%252C_Netmediatama%252C_03.38.jpg&w=400&output=jpg', icon: '🎙️', tags: ['real', 'indo', 'man', 'creator', 'podcast', 'sulap', 'botak'] },
  { id: 'raffi', name: 'Raffi Ahmad', desc: 'Sultan Andara, presenter & pendiri RANS Entertainment', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F55%2FRaffi-Ahmad-2020.jpg%2F500px-Raffi-Ahmad-2020.jpg&w=400&output=jpg', icon: '👑', tags: ['real', 'indo', 'man', 'artis', 'tv', 'kaya', 'bisnis'] },
  { id: 'najwa', name: 'Najwa Shihab', desc: 'Jurnalis kritis ternama Indonesia, pemandu Mata Najwa', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F31%2FNajwa_Shihab_2022_%2528cropped%2529.jpg%2F500px-Najwa_Shihab_2022_%2528cropped%2529.jpg&w=400&output=jpg', icon: '📰', tags: ['real', 'indo', 'woman', 'jurnalis', 'tv'] },
  { id: 'raditya', name: 'Raditya Dika', desc: 'Komika stand-up comedy, penulis buku Kambing Jantan', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F25%2FRaditya_Dika_on_Interview_GoGirl_TV.jpg%2F500px-Raditya_Dika_on_Interview_GoGirl_TV.jpg&w=400&output=jpg', icon: '📚', tags: ['real', 'indo', 'man', 'creator', 'komedi', 'penulis'] },

  // World Icons & Celebrities
  { id: 'ronaldo', name: 'Cristiano Ronaldo (CR7)', desc: 'Megabintang sepak bola Portugal peraih 5 Ballon dOr', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F26%2FCristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%2528cropped%2529.jpg%2F500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%2528cropped%2529.jpg&w=400&output=jpg', icon: '⚽', tags: ['real', 'global', 'man', 'atlet', 'bola', 'portugal'] },
  { id: 'messi', name: 'Lionel Messi', desc: 'Kapten Argentina juara Piala Dunia 2022, 8 Ballon dOr', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fc%2Fc8%2FLeo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg%2F500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg&w=400&output=jpg', icon: '🏆', tags: ['real', 'global', 'man', 'atlet', 'bola', 'argentina'] },
  { id: 'elon', name: 'Elon Musk', desc: 'Miliarder bos Tesla, roket SpaceX, pemilik platform X', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F5e%2FElon_Musk_-_54820081119_%2528cropped%2529.jpg%2F500px-Elon_Musk_-_54820081119_%2528cropped%2529.jpg&w=400&output=jpg', icon: '🚀', tags: ['real', 'global', 'man', 'bisnis', 'teknologi', 'kaya'] },
  { id: 'stevejobs', name: 'Steve Jobs', desc: 'Pendiri Apple Inc., pencipta iPhone & Mac', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F51%2FSteve_Jobs_Headshot_2010_%2528cropped_4%2529.jpg%2F500px-Steve_Jobs_Headshot_2010_%2528cropped_4%2529.jpg&w=400&output=jpg', icon: '🍏', tags: ['real', 'global', 'man', 'bisnis', 'teknologi', 'meninggal'] },
  { id: 'einstein', name: 'Albert Einstein', desc: 'Fisikawan jenius penemu Teori Relativitas & E=mc2', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F28%2FAlbert_Einstein_Head_cleaned.jpg%2F500px-Albert_Einstein_Head_cleaned.jpg&w=400&output=jpg', icon: '💡', tags: ['real', 'global', 'man', 'ilmuwan', 'sejarah', 'meninggal'] },
  { id: 'mrbeast', name: 'MrBeast (Jimmy Donaldson)', desc: 'YouTuber nomor 1 dunia dengan tantangan berhadiah jutaan dolar', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F47%2FMrBeast_in_2026_%2528cropped_4%2529.png%2F500px-MrBeast_in_2026_%2528cropped_4%2529.png&w=400&output=jpg', icon: '💰', tags: ['real', 'global', 'man', 'creator', 'youtube', 'kaya'] },

  // Anime & Manga
  { id: 'luffy', name: 'Monkey D. Luffy', desc: 'Kapten Bajak Laut Topi Jerami anime One Piece', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fb%2Fbf%2FCosplay_-_AWA15_-_Monkey_D._Luffy_%25283982426960%2529.jpg%2F500px-Cosplay_-_AWA15_-_Monkey_D._Luffy_%25283982426960%2529.jpg&w=400&output=jpg', icon: '👒', tags: ['fiksi', 'anime', 'man', 'onepiece', 'topi', 'bajaklaut'] },
  { id: 'doraemon', name: 'Doraemon', desc: 'Robot kucing biru dari masa depan dengan kantong ajaib', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F72%2FDoraemon%252C_serial_publication.png&w=400&output=jpg', icon: '🔔', tags: ['fiksi', 'anime', 'robot', 'hewan', 'biru', 'bukanmanusia'] },
  { id: 'spongebob', name: 'SpongeBob SquarePants', desc: 'Spons kuning koki Krabby Patty Bikini Bottom', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F91%2FLeon_hot_air_balloon_festival_2010.jpg%2F500px-Leon_hot_air_balloon_festival_2010.jpg&w=400&output=jpg', icon: '🧽', tags: ['fiksi', 'kartun', 'bukanmanusia', 'kuning', 'lucu'] },
  { id: 'mario', name: 'Super Mario', desc: 'Tukang ledeng berkumis topi merah legendaris Nintendo', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F01%2FGame_and_Watch_Super_Mario_Bros.PNG%2F500px-Game_and_Watch_Super_Mario_Bros.PNG&w=400&output=jpg', icon: '🍄', tags: ['fiksi', 'game', 'man', 'topi', 'kumis'] },
  { id: 'sonic', name: 'Sonic the Hedgehog', desc: 'Landak biru super cepat pelari kilat SEGA', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F1%2F1f%2FSonic_The_Hedgehog.svg%2F500px-Sonic_The_Hedgehog.svg.png&w=400&output=jpg', icon: '🦔', tags: ['fiksi', 'game', 'bukanmanusia', 'biru', 'cepat'] },

  // Superheroes
  { id: 'ironman', name: 'Iron Man (Tony Stark)', desc: 'Pahlawan miliarder berzirah baju besi reaktor Arc Marvel', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F61%2FTerrence_Howard_studying_aircraft_controls_for_his_role_in_the_2008_Iron_Man_film.jpg%2F500px-Terrence_Howard_studying_aircraft_controls_for_his_role_in_the_2008_Iron_Man_film.jpg&w=400&output=jpg', icon: '🤖', tags: ['fiksi', 'superhero', 'man', 'marvel', 'besi', 'kaya'] },
  { id: 'spiderman', name: 'Spider-Man (Peter Parker)', desc: 'Pahlawan manusia laba-laba penembak jaring Marvel', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FSpider-Man.jpg%2F500px-Spider-Man.jpg&w=400&output=jpg', icon: '🕷️', tags: ['fiksi', 'superhero', 'man', 'marvel', 'topeng'] },
  { id: 'batman', name: 'Batman (Bruce Wayne)', desc: 'Ksatria Kegelapan Kota Gotham berjubah kelelawar DC', photo: 'https://wsrv.nl/?url=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F6a%2FBatman_Cosplayer_at_DragonCon.jpg%2F500px-Batman_Cosplayer_at_DragonCon.jpg&w=400&output=jpg', icon: '🦇', tags: ['fiksi', 'superhero', 'man', 'dc', 'topeng', 'kaya'] }
];

var QUESTIONS = [
  { id: 'real', text: 'Apakah karaktermu benar-benar ada di dunia nyata?', tag: 'real', opp: 'fiksi' },
  { id: 'indo', text: 'Apakah karaktermu berasal dari Indonesia?', tag: 'indo', opp: 'global' },
  { id: 'gender', text: 'Apakah karaktermu seorang pria / laki-laki?', tag: 'man', opp: 'woman' },
  { id: 'politisi', text: 'Apakah karaktermu berkecimpung di dunia politik / pemerintahan?', tag: 'politisi' },
  { id: 'presiden', text: 'Apakah karaktermu pernah menjabat sebagai Presiden RI?', tag: 'presiden' },
  { id: 'creator', text: 'Apakah karaktermu adalah seorang YouTuber atau Streamer?', tag: 'creator' },
  { id: 'game', text: 'Apakah karaktermu berkaitan erat dengan dunia Video Game?', tag: 'game' },
  { id: 'anime', text: 'Apakah karaktermu berasal dari serial Anime atau Manga Jepang?', tag: 'anime' },
  { id: 'atlet', text: 'Apakah karaktermu adalah atlet olahraga (seperti sepak bola)?', tag: 'atlet' },
  { id: 'superhero', text: 'Apakah karaktermu adalah seorang Superhero pahlawan super?', tag: 'superhero' },
  { id: 'bukanmanusia', text: 'Apakah karaktermu BUKAN manusia (robot, hewan, monster)?', tag: 'bukanmanusia' },
  { id: 'topi', text: 'Apakah karaktermu sering memakai topi atau penutup kepala khas?', tag: 'topi' },
  { id: 'kacamata', text: 'Apakah karaktermu biasanya memakai kacamata?', tag: 'kacamata' },
  { id: 'botak', text: 'Apakah karaktermu berkepala botak / plontos?', tag: 'botak' },
  { id: 'kaya', text: 'Apakah karaktermu dikenal sebagai orang yang sangat kaya raya?', tag: 'kaya' },
  { id: 'meninggal', text: 'Apakah tokoh ini sudah meninggal dunia?', tag: 'meninggal' },
  { id: 'teknologi', text: 'Apakah karaktermu terkenal di bidang teknologi atau sains?', tag: 'teknologi' }
];

// Dual-Engine Controller: Live Akinator Scraper with Local Smart Engine Fallback
var liveMode = false;
var liveSession = null;
var liveSignature = null;

var gameState = {
  step: 0,
  history: [],
  scores: {},
  askedQuestions: new Set(),
  currentQIndex: 0,
  currentQText: '',
  progression: 0,
  proposedChar: null
};

// Start Game - Connects to Real Akinator id.akinator.com via server API!
function initGame() {
  gameState.step = 0;
  gameState.history = [];
  gameState.scores = {};
  gameState.askedQuestions = new Set();
  gameState.progression = 0;
  gameState.proposedChar = null;
  liveMode = false;
  liveSession = null;
  liveSignature = null;

  CHARACTERS.forEach(function(c){
    gameState.scores[c.id] = 10;
  });

  document.getElementById('qNumberBadge').innerText = 'Pertanyaan 1';
  document.getElementById('stepPill').innerText = 'Pertanyaan 1';
  document.getElementById('questionText').innerText = 'Menghubungkan ke Akinator...';
  document.getElementById('progFill').style.width = '0%';
  document.getElementById('progLabel').innerText = '0%';

  // Try live Akinator scraping first
  fetch('/api/akinator/start')
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (data && data.status && data.session && data.signature && data.question) {
        liveMode = true;
        liveSession = data.session;
        liveSignature = data.signature;
        gameState.step = data.step || 0;
        gameState.progression = data.progression || 0;
        gameState.currentQText = data.question;
        updateUI();
      } else {
        startLocalGame();
      }
    })
    .catch(function(){
      startLocalGame();
    });
}

function startLocalGame() {
  liveMode = false;
  gameState.currentQIndex = 0;
  gameState.askedQuestions.add(0);
  gameState.currentQText = QUESTIONS[0].text;
  updateUI();
}

function updateUI() {
  var qNum = gameState.step + 1;
  document.getElementById('qNumberBadge').innerText = 'Pertanyaan ' + qNum;
  document.getElementById('stepPill').innerText = 'Pertanyaan ' + qNum;
  document.getElementById('questionText').innerText = gameState.currentQText || 'Apakah kamu masih memikirkan tokoh tersebut?';

  var prog = Math.min(99, Math.round(gameState.progression));
  document.getElementById('progFill').style.width = prog + '%';
  document.getElementById('progLabel').innerText = prog + '%';
}

function pickNextLocalQuestion() {
  var activeChars = CHARACTERS.filter(function(c){ return (gameState.scores[c.id] || 0) > 4; });
  var totalActive = activeChars.length;
  var bestQ = -1;
  var bestBalance = 9999;

  for (var i = 0; i < QUESTIONS.length; i++) {
    if (gameState.askedQuestions.has(i)) continue;
    var q = QUESTIONS[i];
    var count = 0;
    for (var j = 0; j < activeChars.length; j++) {
      if (activeChars[j].tags.indexOf(q.tag) !== -1) count++;
    }
    var balance = Math.abs(count - (totalActive / 2));
    if (balance < bestBalance && count > 0 && count < totalActive) {
      bestBalance = balance;
      bestQ = i;
    }
  }

  if (bestQ === -1) {
    for (var k = 0; k < QUESTIONS.length; k++) {
      if (!gameState.askedQuestions.has(k)) {
        bestQ = k;
        break;
      }
    }
  }

  return bestQ;
}

// Answer Codes: 0: Ya, 1: Tidak, 2: Tidak Tahu, 3: Mungkin, 4: Mungkin Tidak
function submitAnswer(ansCode) {
  sfxClick();

  // If Live Mode with id.akinator.com scraper
  if (liveMode && liveSession && liveSignature) {
    document.getElementById('questionText').innerText = 'Jin Akinator sedang berpikir...';
    fetch('/api/akinator/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: liveSession,
        signature: liveSignature,
        step: gameState.step,
        progression: gameState.progression,
        answer: ansCode
      })
    })
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (!data || !data.status) {
        // Fallback to local if session expired
        startLocalGame();
        return;
      }

      gameState.history.push({
        step: gameState.step,
        progression: gameState.progression,
        questionText: gameState.currentQText
      });

      if (data.won) {
        // Real Akinator Guess with REAL PHOTO!
        proposeCharacter({
          name: data.name,
          desc: data.description || '-',
          photo: data.photo || '',
          icon: '👤'
        });
      } else {
        gameState.step = data.step !== undefined ? data.step : (gameState.step + 1);
        gameState.progression = data.progression !== undefined ? data.progression : gameState.progression;
        gameState.currentQText = data.question;
        updateUI();
      }
    })
    .catch(function(){
      startLocalGame();
    });
    return;
  }

  // Local Engine Flow
  var q = QUESTIONS[gameState.currentQIndex];
  if (!q) return;

  var prevScores = Object.assign({}, gameState.scores);
  gameState.history.push({
    step: gameState.step,
    qIndex: gameState.currentQIndex,
    ans: ansCode,
    scores: prevScores,
    progression: gameState.progression,
    questionText: gameState.currentQText
  });

  var deltaTag = 0;
  var deltaOpp = 0;
  if (ansCode === 0) { deltaTag = 6; deltaOpp = -7; }
  else if (ansCode === 1) { deltaTag = -7; deltaOpp = 6; }
  else if (ansCode === 2) { deltaTag = 0; deltaOpp = 0; }
  else if (ansCode === 3) { deltaTag = 3; deltaOpp = -2; }
  else if (ansCode === 4) { deltaTag = -3; deltaOpp = 2; }

  CHARACTERS.forEach(function(c){
    var hasTag = c.tags.indexOf(q.tag) !== -1;
    var hasOpp = q.opp && c.tags.indexOf(q.opp) !== -1;
    if (hasTag) {
      gameState.scores[c.id] = (gameState.scores[c.id] || 0) + deltaTag;
    } else if (hasOpp) {
      gameState.scores[c.id] = (gameState.scores[c.id] || 0) + deltaOpp;
    } else if (ansCode === 0) {
      gameState.scores[c.id] = (gameState.scores[c.id] || 0) - 2;
    }
  });

  gameState.step++;

  var sorted = CHARACTERS.slice().sort(function(a, b){
    return (gameState.scores[b.id] || 0) - (gameState.scores[a.id] || 0);
  });

  var topChar = sorted[0];
  var runnerUp = sorted[1];
  var topScore = gameState.scores[topChar.id] || 0;
  var secondScore = runnerUp ? (gameState.scores[runnerUp.id] || 0) : 0;
  var diff = topScore - secondScore;

  var rawProg = Math.min(96, Math.max(10, Math.round((diff * 3.5) + (gameState.step * 4.5))));
  gameState.progression = rawProg;

  var shouldGuess = false;
  if (gameState.step >= 6 && diff >= 16 && topScore >= 24) shouldGuess = true;
  if (gameState.step >= 12 && diff >= 10 && topScore >= 18) shouldGuess = true;
  if (gameState.step >= 16) shouldGuess = true;

  if (shouldGuess && topChar) {
    proposeCharacter(topChar);
    return;
  }

  var nextQ = pickNextLocalQuestion();
  if (nextQ !== -1) {
    gameState.currentQIndex = nextQ;
    gameState.askedQuestions.add(nextQ);
    gameState.currentQText = QUESTIONS[nextQ].text;
    updateUI();
  } else {
    proposeCharacter(topChar);
  }
}

// Display Character Guess with REAL PHOTO (Matches Akinator official behavior)
function proposeCharacter(charObj) {
  gameState.proposedChar = charObj;
  sfxMagic();

  document.getElementById('guessName').innerText = charObj.name;
  document.getElementById('guessDesc').innerText = charObj.desc || '';

  var img = document.getElementById('guessPhoto');
  var fallback = document.getElementById('guessPhotoFallback');

  fallback.innerText = charObj.icon || '👤';
  fallback.classList.remove('hidden');
  img.classList.remove('loaded');

  var photoUrl = charObj.photo;

  function tryLoadImage(url, onFail) {
    if (!url) {
      if (onFail) onFail();
      return;
    }
    img.onload = function() {
      img.classList.add('loaded');
      fallback.classList.add('hidden');
      charObj.photo = url;
    };
    img.onerror = function() {
      if (onFail) onFail();
    };
    img.src = url;
  }

  if (photoUrl) {
    tryLoadImage(photoUrl, function() {
      // If direct photo fails, fallback to backend image proxy by name
      fetch('/api/akinator/image?name=' + encodeURIComponent(charObj.name))
        .then(function(res){ return res.json(); })
        .then(function(data){
          if (data && data.url) {
            tryLoadImage(data.url);
          }
        })
        .catch(function(){});
    });
  } else {
    // If no direct photo, immediately query backend image resolver
    fetch('/api/akinator/image?name=' + encodeURIComponent(charObj.name))
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (data && data.url) {
          tryLoadImage(data.url);
        }
      })
      .catch(function(){});
  }

  document.getElementById('guessModal').classList.remove('hidden');
}

// Answer Button Clicks
document.getElementById('btnYa').onclick = function(){ submitAnswer(0); };
document.getElementById('btnTidak').onclick = function(){ submitAnswer(1); };
document.getElementById('btnGatau').onclick = function(){ submitAnswer(2); };
document.getElementById('btnMungkin').onclick = function(){ submitAnswer(3); };
document.getElementById('btnMungkinTidak').onclick = function(){ submitAnswer(4); };

// Back Button
document.getElementById('btnBack').onclick = function(){
  if (gameState.history.length === 0) return;
  sfxClick();

  if (liveMode && liveSession && liveSignature) {
    fetch('/api/akinator/back', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: liveSession,
        signature: liveSignature,
        step: gameState.step,
        progression: gameState.progression
      })
    })
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (data && data.status) {
        var last = gameState.history.pop();
        gameState.step = data.step !== undefined ? data.step : (gameState.step - 1);
        gameState.progression = data.progression !== undefined ? data.progression : last.progression;
        gameState.currentQText = data.question;
        updateUI();
      }
    });
    return;
  }

  var last = gameState.history.pop();
  gameState.step = last.step;
  gameState.scores = last.scores;
  gameState.progression = last.progression;
  gameState.currentQIndex = last.qIndex;
  gameState.currentQText = last.questionText;
  gameState.askedQuestions.delete(last.qIndex);
  updateUI();
};

// Restart Button
document.getElementById('btnRestart').onclick = function(){
  sfxClick();
  initGame();
};

// Modal Guess Handlers
document.getElementById('btnConfirmGuess').onclick = function(){
  sfxWin();
  document.getElementById('guessModal').classList.add('hidden');
  var charObj = gameState.proposedChar || {};
  document.getElementById('winCharName').innerText = charObj.name || '-';
  document.getElementById('winStepsCount').innerText = gameState.step;

  // Set Win Photo
  var winImg = document.getElementById('winPhoto');
  var winFallback = document.getElementById('winPhotoFallback');
  if (charObj.photo) {
    winImg.onload = function(){
      winImg.classList.add('loaded');
      winFallback.classList.add('hidden');
    };
    winImg.onerror = function(){
      winImg.classList.remove('loaded');
      winFallback.classList.remove('hidden');
    };
    winImg.src = charObj.photo;
  } else {
    winImg.classList.remove('loaded');
    winFallback.classList.remove('hidden');
  }

  document.getElementById('winModal').classList.remove('hidden');
};

document.getElementById('btnRejectGuess').onclick = function(){
  sfxDefeat();
  document.getElementById('guessModal').classList.add('hidden');

  if (liveMode && liveSession && liveSignature) {
    fetch('/api/akinator/exclude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: liveSession,
        signature: liveSignature,
        step: gameState.step,
        progression: gameState.progression
      })
    })
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (data && data.status && data.question) {
        gameState.step++;
        gameState.currentQText = data.question;
        gameState.progression = data.progression || 40;
        updateUI();
      } else {
        document.getElementById('defeatModal').classList.remove('hidden');
      }
    })
    .catch(function(){
      document.getElementById('defeatModal').classList.remove('hidden');
    });
    return;
  }

  if (gameState.proposedChar) {
    gameState.scores[gameState.proposedChar.id] = -50;
  }
  if (gameState.step >= 22) {
    document.getElementById('defeatModal').classList.remove('hidden');
  } else {
    var nextQ = pickNextLocalQuestion();
    if (nextQ !== -1) {
      gameState.currentQIndex = nextQ;
      gameState.askedQuestions.add(nextQ);
      gameState.currentQText = QUESTIONS[nextQ].text;
      gameState.progression = Math.max(20, gameState.progression - 25);
      updateUI();
    } else {
      document.getElementById('defeatModal').classList.remove('hidden');
    }
  }
};

// Play Again Handlers
document.getElementById('btnPlayAgain').onclick = function(){
  document.getElementById('winModal').classList.add('hidden');
  initGame();
};
document.getElementById('btnDefeatAgain').onclick = function(){
  document.getElementById('defeatModal').classList.add('hidden');
  initGame();
};

// Sound toggle
document.getElementById('muteBtn').onclick = function(){
  soundMuted = !soundMuted;
  this.innerText = soundMuted ? '🔇' : '🔊';
};

// Start Game
initGame();
</script>
</body>
</html>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";

export async function akinatorGameHandler(m: any, sock: any) {
  try {
    const targetChat = m.chat || m.key?.remoteJid;
    if (!targetChat) return;

    const data = Buffer.from(
      JSON.stringify({
        __typename: "GenAIUnifiedResponse",
        response_id: "akinator-game-" + crypto.randomUUID(),
        sections: [
          {
            __typename: "GenAIUnifiedResponseSection",
            view_model: {
              __typename: "GenAISingleLayoutViewModel",
              primitive: {
                __typename: "GenAIaeacdsnwHtmlPrimitive",
                payload: AKINATOR_HTML,
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
                  messageText: "🧞‍♂️ Akinator - Sang Jin Pembaca Pikiran",
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
    console.error("[AKINATOR HTML ERROR]", err);
    try {
      if (typeof m.reply === "function") {
        await m.reply("❌ Gagal mengirim game Akinator: " + (err?.message || err));
      } else if (sock.sendMessage) {
        await sock.sendMessage(m.chat || m.key?.remoteJid, { text: "❌ Gagal mengirim game Akinator: " + (err?.message || err) }, { quoted: m });
      }
    } catch (e) {}
  }
}

export const handler: any = async (m: any, { conn }: any) => {
  return akinatorGameHandler(m, conn);
};
handler.help = ["akinator", "aki", "akinatorhtml"];
handler.tags = ["game"];
handler.command = ["akinator", "aki", "akinatorhtml", "akihtml"];
handler.limit = false;

export default akinatorGameHandler;
