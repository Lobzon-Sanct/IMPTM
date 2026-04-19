// Soundboard: adicione/remova itens desta lista para mudar os botoes.

const sounds = [
  { id: 'adoro-pipocas-picapau', title: 'Adoro Pipocas', file: 'assets/audio/adoro-pipocas-picapau.mp3', visual: null },
  { id: 'alegria-de-kids', title: 'Alegria de Kids', file: 'assets/audio/alegria-de-kids.mp3', visual: null },
  { id: 'cano-de-metal-caindo', title: 'Cano de Metal Caindo', file: 'assets/audio/cano-de-metal-caindo.mp3', visual: null },
  { id: 'cavalo', title: 'Cavalo', file: 'assets/audio/cavalo.mp3', visual: null },
  { id: 'cebolinha', title: 'Cebolinha', file: 'assets/audio/cebolinha.mp3', visual: null },
  { id: 'cebolinha-elogios', title: 'Cebolinha Elogios', file: 'assets/audio/cebolinha-elogios.mp3', visual: null },
  { id: 'dango-balango', title: 'Dango Balango', file: 'assets/audio/dango-balango.mp3', visual: null },
  { id: 'esse-cara-deve-ser-doido', title: 'Esse Cara Deve Ser Doido', file: 'assets/audio/esse-cara-deve-ser-doido.mp3', visual: null },
  { id: 'fui-tapeado-picapau', title: 'Fui Tapeado', file: 'assets/audio/fui-tapeado-picapau.mp3', visual: null },
  { id: 'hum-bolo-de-morango', title: 'Hum, Bolo de Morango', file: 'assets/audio/hum-bolo-de-morango.mp3', visual: null },
  { id: 'hummm-nooooo', title: 'Hummm Nooooo', file: 'assets/audio/hummm-nooooo.mp3', visual: null },
  { id: 'huuunooo-e-muito-cremoso', title: 'Huuunooo e Muito Cremoso', file: 'assets/audio/huuunooo-e-muito-cremoso.mp3', visual: null },
  { id: 'nao-pode-fazer-nada-pica-pau', title: 'Nao Pode Fazer Nada', file: 'assets/audio/nao-pode-fazer-nada-pica-pau.mp3', visual: null },
  { id: 'perdir-meu-dinheirinho', title: 'Perdi Meu Dinheirinho', file: 'assets/audio/perdir-meu-dinheirinho.mp3', visual: null },
  { id: 'pica-pau-melholhou', title: 'Pica-Pau Melhorou', file: 'assets/audio/pica-pau-melholhou.mp3', visual: null },
  { id: 'picapau-va-pro-inferno-fundo-verde', title: 'Va Pro Inferno', file: 'assets/audio/picapau-va-pro-inferno-fundo-verde.mp3', visual: null },
  { id: 'snore-mimimimimimi', title: 'Mimimimimimi', file: 'assets/audio/snore-mimimimimimi.mp3', visual: null },
  { id: 'spring-boing', title: 'Spring Boing', file: 'assets/audio/spring-boing.mp3', visual: null },
  { id: 'toin', title: 'Toin', file: 'assets/audio/toin.mp3', visual: null },
  { id: 'toin-oin-oin-oin', title: 'Toin Oin Oin Oin', file: 'assets/audio/toin-oin-oin-oin.mp3', visual: null },
  { id: 'vinheta-xaropinho-rapaz', title: 'Xaropinho Rapaz', file: 'assets/audio/vinheta-xaropinho-rapaz_dx3f4Be.mp3', visual: null },
  { id: 'voce-nao-vai-querer-me-comer', title: 'Voce Nao Vai Querer Me Comer', file: 'assets/audio/voce-nao-vai-querer-me-comer.mp3', visual: null },
  { id: 'xaropinho-viadage', title: 'Xaropinho', file: 'assets/audio/xaropinho-viadage.mp3', visual: null }
];

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

function renderVisual(sound){
  if(!visualWrap) return;

  if(!sound.visual){
    clearVisual();
    return;
  }

  visualWrap.innerHTML = '';
  const img = document.createElement('img');
  img.src = sound.visual;
  img.alt = sound.title ? `Visual do ${sound.title}` : 'Visual do som';
  visualWrap.appendChild(img);
}

function playSound(sound){
  stop();
  renderVisual(sound);
  current = new Audio(sound.file);
  current.addEventListener('ended', clearVisual);
  current.play().catch(()=>{});
}

async function init(){
  await guard();

  const wrap = document.getElementById('soundboard');
  visualWrap = document.getElementById('sound-visual');
  if(!wrap) return;

  sounds.forEach(sound=>{
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.type = 'button';
    btn.dataset.soundId = sound.id;
    btn.textContent = sound.title;
    btn.addEventListener('click', ()=> playSound(sound));
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
