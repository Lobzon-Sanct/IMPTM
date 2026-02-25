import { loadState } from './state.js';

const START_DATE = new Date('2015-01-01T00:00:00');
const PAGE_LOAD_TIME = new Date();

function updateCounter() {
  const counterEl = document.getElementById('gallery-count');
  const now = new Date();
  const diff = now - START_DATE;
  const days = diff / 86400000; // days
  const base = Math.floor(days * 2); // base attachments per day
  const extra = Math.floor((new Date() - PAGE_LOAD_TIME) / 5000); // +1 a cada 5s
  counterEl.textContent = base + extra;
}

async function initGallery() {
  const state = await loadState();
  const lockMessage = document.getElementById('gallery-lock');
  const content = document.getElementById('gallery-content');
  if (!state.pagesUnlocked || !state.pagesUnlocked.gallery) {
    lockMessage.classList.remove('hidden');
    return;
  }
  content.classList.remove('hidden');
  updateCounter();
  setInterval(updateCounter, 1000);
}

document.addEventListener('DOMContentLoaded', initGallery);
