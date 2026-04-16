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

let current = null;

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
}

function playSound(file){
  stop();
  current = new Audio(file);
  current.play().catch(()=>{});
}

async function init(){
  await guard();

  const wrap = document.getElementById('soundboard');
  if(!wrap) return;

  SOUNDS.forEach(s=>{
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.type = 'button';
    btn.textContent = s.label;
    btn.addEventListener('click', ()=> playSound(s.file));
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
