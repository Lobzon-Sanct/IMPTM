import { loadState, saveState } from './state.js';

const START_DATE = new Date('2015-01-01T00:00:00');
const PAGE_LOAD_TIME = new Date();

function updateContractCounter() {
  const counterEl = document.getElementById('contract-count');
  const now = new Date();
  const diff = now - START_DATE;
  const days = diff / 86400000;
  const base = Math.floor(days * 1.5); // revisions per day (just for fun)
  const extra = Math.floor((new Date() - PAGE_LOAD_TIME) / 8000); // +1 every 8s
  counterEl.textContent = base + extra;
}

function setupSignature() {
  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let hasSignature = false;

  function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
  function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = '#574f7d';
    ctx.lineWidth = 2;
    ctx.stroke();
    hasSignature = true;
  }
  function endDrawing() {
    drawing = false;
  }
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDrawing);
  canvas.addEventListener('mouseout', endDrawing);

  // Touch events for mobile
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    drawing = true;
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.strokeStyle = '#574f7d';
    ctx.lineWidth = 2;
    ctx.stroke();
    hasSignature = true;
  });
  canvas.addEventListener('touchend', () => {
    drawing = false;
  });

  // Controls
  document.getElementById('clear-signature').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
  });

  document.getElementById('confirm-signature').addEventListener('click', async () => {
    if (!hasSignature) {
      alert('Faça sua assinatura primeiro!');
      return;
    }
    const state = await loadState();
    state.signedContract = true;
    state.pagesUnlocked = state.pagesUnlocked || {};
    state.pagesUnlocked.contract = true;
    await saveState(state);
    document.getElementById('signature-area').classList.add('hidden');
    document.getElementById('signed-message').classList.remove('hidden');
  });
}

async function initContract() {
  const state = await loadState();
  const lockMessage = document.getElementById('contract-lock');
  const content = document.getElementById('contract-content');
  if (!state.pagesUnlocked || !state.pagesUnlocked.contract) {
    lockMessage.classList.remove('hidden');
    return;
  }
  content.classList.remove('hidden');
  updateContractCounter();
  setInterval(updateContractCounter, 1000);
  // If already signed, show message and hide canvas
  if (state.signedContract) {
    document.getElementById('signature-area').classList.add('hidden');
    document.getElementById('signed-message').classList.remove('hidden');
  } else {
    setupSignature();
  }
}

document.addEventListener('DOMContentLoaded', initContract);
