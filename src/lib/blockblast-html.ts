export const htmlPayload = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Block Blast Game</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    html, body {
      width: 100%;
      margin: 0;
      padding: 0;
      background: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    body {
      padding: 8px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .game-container {
      width: 100%;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      box-sizing: border-box;
    }
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 6px 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      box-sizing: border-box;
    }
    .player-badge {
      display: flex;
      flex-direction: column;
    }
    .player-title {
      font-size: 9px;
      font-weight: 700;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .player-name {
      font-size: 13px;
      font-weight: 800;
      color: #38bdf8;
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .score-container {
      text-align: right;
    }
    .score-label {
      font-size: 9px;
      color: #71717a;
      text-transform: uppercase;
      font-weight: 700;
    }
    .score-val {
      font-size: 18px;
      font-weight: 900;
      color: #facc15;
      line-height: 1;
    }
    .high-score {
      font-size: 9px;
      color: #a1a1aa;
      margin-top: 1px;
      font-weight: 600;
    }
    .board-wrapper {
      position: relative;
      width: 100%;
      max-width: 330px;
      aspect-ratio: 1;
      background: #18181b;
      border: 1.5px solid #27272a;
      border-radius: 14px;
      padding: 5px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      box-sizing: border-box;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      gap: 2px;
      width: 100%;
      height: 100%;
    }
    .cell {
      background: #27272a;
      border-radius: 3px;
      position: relative;
    }
    .cell.hover-valid {
      background: rgba(56, 189, 248, 0.45) !important;
      border: 1px solid #38bdf8;
      transition: none !important;
    }
    .cell.hover-invalid {
      background: rgba(239, 68, 68, 0.45) !important;
      border: 1px solid #ef4444;
      transition: none !important;
    }

    /* Colors */
    .c-1 { background: #06b6d4; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(6,182,212,0.4); }
    .c-2 { background: #a855f7; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(168,85,247,0.4); }
    .c-3 { background: #ec4899; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(236,72,153,0.4); }
    .c-4 { background: #f59e0b; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(245,158,11,0.4); }
    .c-5 { background: #10b981; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(16,185,129,0.4); }
    .c-6 { background: #3b82f6; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 8px rgba(59,130,246,0.4); }

    .cell.clearing {
      animation: clearAnim 0.3s ease-out forwards;
    }
    @keyframes clearAnim {
      0% { transform: scale(1); filter: brightness(2.5); opacity: 1; }
      100% { transform: scale(0.2); filter: brightness(1); opacity: 0; }
    }

    .dock {
      width: 100%;
      height: 80px;
      flex-shrink: 0;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 6px;
      box-sizing: border-box;
    }
    .piece-slot {
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,0.02);
      cursor: grab;
      position: relative;
    }
    .piece-slot.active-selected {
      border: 2px solid #38bdf8;
      background: rgba(56, 189, 248, 0.12);
    }
    .piece-preview {
      display: grid;
      gap: 3px;
      pointer-events: none;
    }
    .mini-block {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .combo-toast {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      font-size: 26px;
      font-weight: 900;
      color: #facc15;
      text-shadow: 0 0 20px rgba(250, 204, 21, 0.9), 0 4px 10px rgba(0,0,0,0.9);
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 30;
    }
    .combo-toast.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-box {
      background: #18181b;
      border: 2px solid #38bdf8;
      border-radius: 20px;
      padding: 20px;
      width: 85%;
      max-width: 280px;
      text-align: center;
      box-shadow: 0 0 32px rgba(56, 189, 248, 0.3);
      transform: scale(0.85);
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .modal-overlay.active .modal-box {
      transform: scale(1);
    }
    .modal-title {
      font-size: 20px;
      font-weight: 900;
      color: #ef4444;
      margin-bottom: 6px;
    }
    .modal-score {
      font-size: 14px;
      color: #e4e4e7;
      margin-bottom: 14px;
    }
    .modal-score span {
      font-size: 20px;
      font-weight: 800;
      color: #facc15;
    }
    .btn {
      background: linear-gradient(135deg, #38bdf8, #0284c7);
      color: #000;
      font-weight: 800;
      font-size: 14px;
      padding: 10px 24px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(56,189,248,0.4);
      transition: transform 0.1s ease;
    }
    .btn:active {
      transform: scale(0.95);
    }

    .drag-avatar {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1000;
      display: grid;
      gap: 3px;
      opacity: 0.95;
      will-change: transform;
      transform: translate3d(0, 0, 0) translate(-50%, -100%);
      margin-top: -10px;
    }
    .drag-block {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
    }
  </style>
</head>
<body>
  <div class="game-container">
    <div class="header">
      <div class="player-badge">
        <span class="player-title">PLAYER</span>
        <span class="player-name">{{playerName}}</span>
      </div>
      <div class="score-container">
        <span class="score-label">SCORE</span>
        <div class="score-val" id="score">0</div>
        <div class="high-score">HIGH: <span id="high-score">0</span></div>
      </div>
    </div>

    <div class="board-wrapper">
      <div class="grid" id="grid"></div>
      <div class="combo-toast" id="combo-toast">COMBO x2!</div>
    </div>

    <div class="dock" id="dock">
      <div class="piece-slot" data-slot="0"></div>
      <div class="piece-slot" data-slot="1"></div>
      <div class="piece-slot" data-slot="2"></div>
    </div>
  </div>

  <div class="modal-overlay" id="game-over-modal">
    <div class="modal-box">
      <div class="modal-title">GAME OVER</div>
      <div class="modal-score">Skor Akhir: <br><span id="final-score">0</span></div>
      <button class="btn" id="restart-btn">MAIN LAGI</button>
    </div>
  </div>

  <script>
    // Web Audio Synthesizer for SFX
    let audioCtx = null;

    function playSound(type) {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtxClass) return;
        if (!audioCtx) audioCtx = new AudioCtxClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'place') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'clear') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'combo') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'gameover') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        }
      } catch (e) {}
    }

    // Shapes definitions: matrix [row, col] and color index 1-6
    const SHAPES = [
      { shape: [[1]], color: 1 },
      { shape: [[1,1]], color: 1 },
      { shape: [[1],[1]], color: 1 },
      { shape: [[1,1,1]], color: 2 },
      { shape: [[1],[1],[1]], color: 2 },
      { shape: [[1,1,1,1]], color: 3 },
      { shape: [[1],[1],[1],[1]], color: 3 },
      { shape: [[1,1],[1,1]], color: 4 },
      { shape: [[1,1,1],[1,1,1],[1,1,1]], color: 5 },
      { shape: [[1,0],[1,0],[1,1]], color: 6 },
      { shape: [[0,1],[0,1],[1,1]], color: 6 },
      { shape: [[1,1,1],[1,0,0]], color: 2 },
      { shape: [[1,1,1],[0,0,1]], color: 2 },
      { shape: [[1,1,1],[0,1,0]], color: 5 },
      { shape: [[0,1,0],[1,1,1]], color: 5 },
      { shape: [[1,1],[1,0]], color: 4 },
      { shape: [[1,1],[0,1]], color: 4 }
    ];

    const GRID_SIZE = 8;
    let gridData = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    let currentDockPieces = [null, null, null];
    let selectedSlotIndex = null;
    let score = 0;
    let highScore = 0;
    try {
      highScore = localStorage.getItem('bb_highscore') || 0;
    } catch (e) {}

    const gridEl = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('high-score');
    const dockEl = document.getElementById('dock');
    const comboToast = document.getElementById('combo-toast');
    const modalEl = document.getElementById('game-over-modal');
    const finalScoreEl = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    if (highScoreEl) highScoreEl.innerText = highScore;

    // Create 8x8 cells
    function createGridUI() {
      gridEl.innerHTML = '';
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.r = r;
          cell.dataset.c = c;
          gridEl.appendChild(cell);
        }
      }
    }

    function renderGrid() {
      const cells = gridEl.children;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const idx = r * GRID_SIZE + c;
          const cell = cells[idx];
          const val = gridData[r][c];
          cell.className = 'cell' + (val ? \` c-\${val}\` : '');
        }
      }
    }

    function getRandomPiece() {
      return SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }

    function refillDock() {
      for (let i = 0; i < 3; i++) {
        if (!currentDockPieces[i]) {
          currentDockPieces[i] = getRandomPiece();
        }
      }
      renderDock();
      checkGameOver();
    }

    function renderDock() {
      const slots = dockEl.children;
      for (let i = 0; i < 3; i++) {
        const slot = slots[i];
        slot.innerHTML = '';
        slot.classList.remove('active-selected');
        if (selectedSlotIndex === i) slot.classList.add('active-selected');

        const piece = currentDockPieces[i];
        if (piece) {
          const preview = document.createElement('div');
          preview.className = 'piece-preview';
          preview.style.gridTemplateColumns = \`repeat(\${piece.shape[0].length}, 1fr)\`;
          
          piece.shape.forEach(row => {
            row.forEach(val => {
              const mini = document.createElement('div');
              mini.className = val ? \`mini-block c-\${piece.color}\` : 'mini-block';
              if (!val) mini.style.opacity = '0';
              preview.appendChild(mini);
            });
          });
          slot.appendChild(preview);
        }
      }
    }

    function canPlacePiece(piece, startR, startC) {
      if (!piece) return false;
      const rows = piece.shape.length;
      const cols = piece.shape[0].length;

      if (startR + rows > GRID_SIZE || startC + cols > GRID_SIZE) return false;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (piece.shape[r][c] && gridData[startR + r][startC + c] !== 0) {
            return false;
          }
        }
      }
      return true;
    }

    function placePiece(slotIndex, startR, startC) {
      const piece = currentDockPieces[slotIndex];
      if (!piece) return;

      currentDockPieces[slotIndex] = null;
      selectedSlotIndex = null;
      renderDock();

      const rows = piece.shape.length;
      const cols = piece.shape[0].length;
      let placedBlocks = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (piece.shape[r][c]) {
            gridData[startR + r][startC + c] = piece.color;
            placedBlocks++;
          }
        }
      }

      score += placedBlocks * 10;
      updateScore();
      playSound('place');
      renderGrid();

      // Check line clears & dock refill
      checkAndClearLines();
    }

    function checkAndClearLines() {
      let fullRows = [];
      let fullCols = [];

      // Check rows
      for (let r = 0; r < GRID_SIZE; r++) {
        if (gridData[r].every(val => val !== 0)) {
          fullRows.push(r);
        }
      }

      // Check cols
      for (let c = 0; c < GRID_SIZE; c++) {
        let full = true;
        for (let r = 0; r < GRID_SIZE; r++) {
          if (gridData[r][c] === 0) { full = false; break; }
        }
        if (full) fullCols.push(c);
      }

      const totalLines = fullRows.length + fullCols.length;

      if (totalLines > 0) {
        const cellsToClear = new Set();

        fullRows.forEach(r => {
          for (let c = 0; c < GRID_SIZE; c++) cellsToClear.add(\`\${r}-\${c}\`);
        });
        fullCols.forEach(c => {
          for (let r = 0; r < GRID_SIZE; r++) cellsToClear.add(\`\${r}-\${c}\`);
        });

        const cellsUI = gridEl.children;
        cellsToClear.forEach(key => {
          const [r, c] = key.split('-').map(Number);
          const idx = r * GRID_SIZE + c;
          cellsUI[idx].classList.add('clearing');
        });

        setTimeout(() => {
          cellsToClear.forEach(key => {
            const [r, c] = key.split('-').map(Number);
            gridData[r][c] = 0;
          });

          score += totalLines * 120;
          if (totalLines > 1) {
            score += totalLines * 80; // combo bonus
            showComboToast(\`COMBO x\${totalLines}!\`);
            playSound('combo');
          } else {
            playSound('clear');
          }

          updateScore();
          renderGrid();

          // Check refill dock
          if (currentDockPieces.every(p => p === null)) {
            refillDock();
          } else {
            checkGameOver();
          }
        }, 300);
      } else {
        if (currentDockPieces.every(p => p === null)) {
          refillDock();
        } else {
          checkGameOver();
        }
      }
    }

    function showComboToast(msg) {
      comboToast.innerText = msg;
      comboToast.classList.add('show');
      setTimeout(() => comboToast.classList.remove('show'), 1200);
    }

    function updateScore() {
      if (scoreEl) scoreEl.innerText = score;
      if (score > highScore) {
        highScore = score;
        if (highScoreEl) highScoreEl.innerText = highScore;
        try {
          localStorage.setItem('bb_highscore', highScore);
        } catch (e) {}
      }
    }

    function checkGameOver() {
      const remainingPieces = currentDockPieces.filter(p => p !== null);
      if (remainingPieces.length === 0) return;

      let hasValidMove = false;
      for (const piece of remainingPieces) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (canPlacePiece(piece, r, c)) {
              hasValidMove = true;
              break;
            }
          }
          if (hasValidMove) break;
        }
        if (hasValidMove) break;
      }

      if (!hasValidMove) {
        setTimeout(() => {
          playSound('gameover');
          finalScoreEl.innerText = score;
          modalEl.classList.add('active');
        }, 400);
      }
    }

    // --- ULTRA-SMOOTH DRAG & DROP & TAP SYSTEM ---
    let activeDragIndex = null;
    let dragAvatarEl = null;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let dragRafPending = false;
    let cachedGridRect = null;
    let lastHoveredKey = null;

    function updateGridRectCache() {
      cachedGridRect = gridEl.getBoundingClientRect();
    }
    window.addEventListener('resize', updateGridRectCache);

    function getGridCellAtPos(x, y) {
      if (!cachedGridRect) updateGridRectCache();
      const rect = cachedGridRect;
      const margin = 25;
      if (x >= rect.left - margin && x <= rect.right + margin && y >= rect.top - margin && y <= rect.bottom + margin) {
        const clampX = Math.max(rect.left, Math.min(rect.right - 1, x));
        const clampY = Math.max(rect.top, Math.min(rect.bottom - 1, y));
        const c = Math.floor(((clampX - rect.left) / rect.width) * GRID_SIZE);
        const r = Math.floor(((clampY - rect.top) / rect.height) * GRID_SIZE);
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
          return { r, c };
        }
      }
      return null;
    }

    function createDragAvatar(piece, x, y) {
      removeDragAvatar();
      dragAvatarEl = document.createElement('div');
      dragAvatarEl.className = 'drag-avatar';
      dragAvatarEl.style.gridTemplateColumns = \`repeat(\${piece.shape[0].length}, 1fr)\`;
      dragAvatarEl.style.transform = \`translate3d(\${x}px, \${y - 20}px, 0) translate(-50%, -100%)\`;

      piece.shape.forEach(row => {
        row.forEach(val => {
          const block = document.createElement('div');
          block.className = val ? \`drag-block c-\${piece.color}\` : 'drag-block';
          if (!val) block.style.opacity = '0';
          dragAvatarEl.appendChild(block);
        });
      });

      document.body.appendChild(dragAvatarEl);
    }

    function removeDragAvatar() {
      if (dragAvatarEl) {
        dragAvatarEl.remove();
        dragAvatarEl = null;
      }
    }

    function highlightSlotUI(idx) {
      const slots = dockEl.querySelectorAll('.piece-slot');
      slots.forEach((s, i) => {
        if (i === idx) s.classList.add('active-selected');
        else s.classList.remove('active-selected');
      });
    }

    function getValidPlacementOrigin(piece, r, c) {
      if (!piece) return null;
      if (canPlacePiece(piece, r, c)) return { r, c };

      const rows = piece.shape.length;
      const cols = piece.shape[0].length;

      // Check offset positions so tapping any cell belonging to the piece fits
      for (let pr = 0; pr < rows; pr++) {
        for (let pc = 0; pc < cols; pc++) {
          if (piece.shape[pr][pc]) {
            const testR = r - pr;
            const testC = c - pc;
            if (testR >= 0 && testC >= 0 && canPlacePiece(piece, testR, testC)) {
              return { r: testR, c: testC };
            }
          }
        }
      }

      // Check clamped edge
      const clampedR = Math.max(0, Math.min(r, GRID_SIZE - rows));
      const clampedC = Math.max(0, Math.min(c, GRID_SIZE - cols));
      if (canPlacePiece(piece, clampedR, clampedC)) {
        return { r: clampedR, c: clampedC };
      }

      return null;
    }

    function tryPlacePiece(slotIndex, r, c) {
      if (slotIndex === null) return false;
      const piece = currentDockPieces[slotIndex];
      if (!piece) return false;

      const origin = getValidPlacementOrigin(piece, r, c);
      if (origin) {
        placePiece(slotIndex, origin.r, origin.c);
        clearHover();
        return true;
      }
      return false;
    }

    function highlightHoverAtCell(cellPos, slotIdx) {
      if (slotIdx === null || !cellPos) {
        if (lastHoveredKey !== null) clearHover();
        return;
      }
      const piece = currentDockPieces[slotIdx];
      if (!piece) {
        if (lastHoveredKey !== null) clearHover();
        return;
      }

      const { r, c } = cellPos;
      const key = slotIdx + '_' + r + '_' + c;
      if (key === lastHoveredKey) return;
      lastHoveredKey = key;

      clearHover();

      const origin = getValidPlacementOrigin(piece, r, c);
      const rows = piece.shape.length;
      const cols = piece.shape[0].length;
      const cellsUI = gridEl.children;

      if (origin) {
        for (let pr = 0; pr < rows; pr++) {
          for (let pc = 0; pc < cols; pc++) {
            if (piece.shape[pr][pc]) {
              const tr = origin.r + pr;
              const tc = origin.c + pc;
              if (tr >= 0 && tr < GRID_SIZE && tc >= 0 && tc < GRID_SIZE) {
                const idx = tr * GRID_SIZE + tc;
                cellsUI[idx].classList.add('hover-valid');
              }
            }
          }
        }
      } else {
        for (let pr = 0; pr < rows; pr++) {
          for (let pc = 0; pc < cols; pc++) {
            if (piece.shape[pr][pc]) {
              const tr = r + pr;
              const tc = c + pc;
              if (tr >= 0 && tr < GRID_SIZE && tc >= 0 && tc < GRID_SIZE) {
                const idx = tr * GRID_SIZE + tc;
                cellsUI[idx].classList.add('hover-invalid');
              }
            }
          }
        }
      }
    }

    function clearHover() {
      const cellsUI = gridEl.children;
      for (let i = 0; i < cellsUI.length; i++) {
        cellsUI[i].classList.remove('hover-valid', 'hover-invalid');
      }
      lastHoveredKey = null;
    }

    function updateDragFrame() {
      dragRafPending = false;
      if (activeDragIndex !== null && dragAvatarEl) {
        dragAvatarEl.style.transform = \`translate3d(\${currentPointerX}px, \${currentPointerY - 20}px, 0) translate(-50%, -100%)\`;
        const targetCell = getGridCellAtPos(currentPointerX, currentPointerY - 50);
        highlightHoverAtCell(targetCell, activeDragIndex);
      } else if (selectedSlotIndex !== null) {
        const targetCell = getGridCellAtPos(currentPointerX, currentPointerY);
        highlightHoverAtCell(targetCell, selectedSlotIndex);
      }
    }

    function scheduleDragUpdate(x, y) {
      currentPointerX = x;
      currentPointerY = y;
      if (!dragRafPending) {
        dragRafPending = true;
        requestAnimationFrame(updateDragFrame);
      }
    }

    function getEventPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e.changedTouches && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function handleStart(e) {
      const slot = e.target.closest('.piece-slot');
      if (!slot) return;
      const idx = parseInt(slot.dataset.slot);
      const piece = currentDockPieces[idx];
      if (!piece) return;

      if (e.cancelable) e.preventDefault();

      updateGridRectCache();
      activeDragIndex = idx;
      selectedSlotIndex = idx;
      highlightSlotUI(idx);

      const pos = getEventPos(e);
      createDragAvatar(piece, pos.x, pos.y);
      scheduleDragUpdate(pos.x, pos.y);
    }

    function handleMove(e) {
      if (activeDragIndex !== null || selectedSlotIndex !== null) {
        if (e.cancelable) e.preventDefault();
        const pos = getEventPos(e);
        scheduleDragUpdate(pos.x, pos.y);
      }
    }

    function handleEnd(e) {
      if (activeDragIndex !== null) {
        const slotIdx = activeDragIndex;
        activeDragIndex = null;
        removeDragAvatar();

        const pos = getEventPos(e);
        const targetCell = getGridCellAtPos(pos.x, pos.y - 50);
        if (targetCell) {
          tryPlacePiece(slotIdx, targetCell.r, targetCell.c);
        }
        clearHover();
      }
    }

    dockEl.addEventListener('touchstart', handleStart, { passive: false });
    dockEl.addEventListener('pointerdown', handleStart);

    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('pointermove', handleMove);

    window.addEventListener('touchend', handleEnd);
    window.addEventListener('pointerup', handleEnd);

    function handleGridCellTap(e) {
      if (selectedSlotIndex === null) return;
      const cell = e.target.closest('.cell');
      let r, c;
      if (cell) {
        r = parseInt(cell.dataset.r);
        c = parseInt(cell.dataset.c);
      } else {
        const pos = getEventPos(e);
        const posCell = getGridCellAtPos(pos.x, pos.y);
        if (posCell) {
          r = posCell.r;
          c = posCell.c;
        }
      }

      if (r !== undefined && c !== undefined && !isNaN(r) && !isNaN(c)) {
        const success = tryPlacePiece(selectedSlotIndex, r, c);
        if (success && e.cancelable) {
          e.preventDefault();
        }
      }
    }

    gridEl.addEventListener('touchstart', handleGridCellTap, { passive: false });
    gridEl.addEventListener('pointerdown', handleGridCellTap);
    gridEl.addEventListener('click', handleGridCellTap);

    gridEl.addEventListener('pointerleave', clearHover);

    restartBtn.addEventListener('click', () => {
      gridData = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
      currentDockPieces = [null, null, null];
      selectedSlotIndex = null;
      score = 0;
      updateScore();
      modalEl.classList.remove('active');
      renderGrid();
      refillDock();
    });

    // Init Game
    createGridUI();
    renderGrid();
    refillDock();
  </script>
</body>
</html>`;
