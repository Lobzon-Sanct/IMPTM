import { loadState } from './state.js';

async function initSounds() {
  const state = await loadState();
  const lockMessage = document.getElementById('sounds-lock');
  const content = document.getElementById('sounds-content');
  if (!state.pagesUnlocked || !state.pagesUnlocked.sounds) {
    lockMessage.classList.remove('hidden');
    return;
  }
  content.classList.remove('hidden');
  // Event listeners
  const buttons = document.querySelectorAll('.sound-button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundName = btn.dataset.sound;
      const audio = new Audio(`assets/audio/${soundName}.mp3`);
      audio.play();
    });
  });
}

document.addEventListener('DOMContentLoaded', initSounds);
