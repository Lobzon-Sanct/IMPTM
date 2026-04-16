// Soundboard: coloque seus mp3 em assets/audio e edite a lista

const SOUNDS = [
  { label: 'Som 1', file: 'assets/audio/som1.mp3' },
  { label: 'Som 2', file: 'assets/audio/som2.mp3' },
  { label: 'Som 3', file: 'assets/audio/som3.mp3' },
  { label: 'Som 4', file: 'assets/audio/som4.mp3' },
  { label: 'Som 5', file: 'assets/audio/som5.mp3' },
  { label: 'Som 6', file: 'assets/audio/som6.mp3' },
  { label: 'Som 7', file: 'assets/audio/som7.mp3' },
  // { label: 'Meme do casal', file: 'assets/audio/meme.mp3' },
];

const soundVisuals = {
  'assets/audio/som1.mp3': 'assets/media/exemplo-1.jpg',
  'assets/audio/som2.mp3': 'assets/media/exemplo-2.jpg',
  'assets/audio/som3.mp3': 'assets/media/exemplo-1.jpg',
  'assets/audio/som4.mp3': 'assets/media/exemplo-2.jpg',
  'assets/audio/som5.mp3': 'assets/media/exemplo-1.jpg',
  'assets/audio/som6.mp3': 'assets/media/exemplo-2.jpg',
  'assets/audio/som7.mp3': 'assets/media/exemplo-1.jpg'
};

let current = null;
let visualWrap = null;

async function guard(){
  const api = window.__LOVE_STATE__;
  if(!api) return true;
  const st = await api.loadState();
  if(!(st && st.pages && st.pages.sounds)){
    console.warn('Soundboard não desbloqueado no estado ainda.');
  }
  return true;
}

function stop(){
  if(current){
    current.pause();
    current.currentTime = 0;
    current = null;
  }
  clearVisual();
}

function clearVisual(){
  if(visualWrap){
    visualWrap.innerHTML = '';
  }
}

function renderVisual(file, label){
  if(!visualWrap) return;

  const visual = soundVisuals[file];
  if(!visual){
    clearVisual();
    return;
  }

  visualWrap.innerHTML = '';
  const img = document.createElement('img');
  img.src = visual;
  img.alt = label ? `Visual do ${label}` : 'Visual do som';
  visualWrap.appendChild(img);
}

function playSound(file, label){
  stop();
  renderVisual(file, label);
  current = new Audio(file);
  current.addEventListener('ended', clearVisual);
  current.play().catch(()=>{});
}

async function init(){
  await guard();

  const wrap = document.getElementById('soundboard');
  visualWrap = document.getElementById('sound-visual');
  if(!wrap) return;

  SOUNDS.forEach(s=>{
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.type = 'button';
    btn.textContent = s.label;
    btn.addEventListener('click', ()=> playSound(s.file, s.label));
    wrap.appendChild(btn);
  });

  const stopBtn = document.createElement('button');
  stopBtn.className = 'btn';
  stopBtn.type = 'button';
  stopBtn.textContent = 'Parar';
  stopBtn.addEventListener('click', stop);
  wrap.appendChild(stopBtn);
}

document.addEventListener('DOMContentLoaded', init);
