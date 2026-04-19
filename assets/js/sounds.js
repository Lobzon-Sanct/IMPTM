// Soundboard: adicione/remova itens desta lista para mudar os botoes.

const DEFAULT_VISUAL = 'assets/img/sound-visual.svg';
const SOUND_ORDER_KEY = 'sound_order';

const sounds = [
  { id: 'adoro-pipocas-picapau', title: 'Adoro Pipocas', file: 'assets/audio/adoro-pipocas-picapau.mp3', visual: DEFAULT_VISUAL },
  { id: 'alegria-de-kids', title: 'Alegria de Kids', file: 'assets/audio/alegria-de-kids.mp3', visual: DEFAULT_VISUAL },
  { id: 'cano-de-metal-caindo', title: 'Cano de Metal Caindo', file: 'assets/audio/cano-de-metal-caindo.mp3', visual: DEFAULT_VISUAL },
  { id: 'cavalo', title: 'Cavalo', file: 'assets/audio/cavalo.mp3', visual: DEFAULT_VISUAL },
  { id: 'cebolinha', title: 'Cebolinha', file: 'assets/audio/cebolinha.mp3', visual: DEFAULT_VISUAL },
  { id: 'cebolinha-elogios', title: 'Cebolinha Elogios', file: 'assets/audio/cebolinha-elogios.mp3', visual: DEFAULT_VISUAL },
  { id: 'dango-balango', title: 'Dango Balango', file: 'assets/audio/dango-balango.mp3', visual: DEFAULT_VISUAL },
  { id: 'esse-cara-deve-ser-doido', title: 'Esse Cara Deve Ser Doido', file: 'assets/audio/esse-cara-deve-ser-doido.mp3', visual: DEFAULT_VISUAL },
  { id: 'fui-tapeado-picapau', title: 'Fui Tapeado', file: 'assets/audio/fui-tapeado-picapau.mp3', visual: DEFAULT_VISUAL },
  { id: 'hum-bolo-de-morango', title: 'Hum, Bolo de Morango', file: 'assets/audio/hum-bolo-de-morango.mp3', visual: DEFAULT_VISUAL },
  { id: 'hummm-nooooo', title: 'Hummm Nooooo', file: 'assets/audio/hummm-nooooo.mp3', visual: DEFAULT_VISUAL },
  { id: 'huuunooo-e-muito-cremoso', title: 'Huuunooo e Muito Cremoso', file: 'assets/audio/huuunooo-e-muito-cremoso.mp3', visual: DEFAULT_VISUAL },
  { id: 'nao-pode-fazer-nada-pica-pau', title: 'Nao Pode Fazer Nada', file: 'assets/audio/nao-pode-fazer-nada-pica-pau.mp3', visual: DEFAULT_VISUAL },
  { id: 'perdir-meu-dinheirinho', title: 'Perdi Meu Dinheirinho', file: 'assets/audio/perdir-meu-dinheirinho.mp3', visual: DEFAULT_VISUAL },
  { id: 'pica-pau-melholhou', title: 'Pica-Pau Melhorou', file: 'assets/audio/pica-pau-melholhou.mp3', visual: DEFAULT_VISUAL },
  { id: 'picapau-va-pro-inferno-fundo-verde', title: 'Va Pro Inferno', file: 'assets/audio/picapau-va-pro-inferno-fundo-verde.mp3', visual: DEFAULT_VISUAL },
  { id: 'snore-mimimimimimi', title: 'Mimimimimimi', file: 'assets/audio/snore-mimimimimimi.mp3', visual: DEFAULT_VISUAL },
  { id: 'spring-boing', title: 'Spring Boing', file: 'assets/audio/spring-boing.mp3', visual: DEFAULT_VISUAL },
  { id: 'toin', title: 'Toin', file: 'assets/audio/toin.mp3', visual: DEFAULT_VISUAL },
  { id: 'toin-oin-oin-oin', title: 'Toin Oin Oin Oin', file: 'assets/audio/toin-oin-oin-oin.mp3', visual: DEFAULT_VISUAL },
  { id: 'vinheta-xaropinho-rapaz', title: 'Xaropinho Rapaz', file: 'assets/audio/vinheta-xaropinho-rapaz_dx3f4Be.mp3', visual: DEFAULT_VISUAL },
  { id: 'voce-nao-vai-querer-me-comer', title: 'Voce Nao Vai Querer Me Comer', file: 'assets/audio/voce-nao-vai-querer-me-comer.mp3', visual: DEFAULT_VISUAL },
  { id: 'xaropinho-viadage', title: 'Xaropinho', file: 'assets/audio/xaropinho-viadage.mp3', visual: DEFAULT_VISUAL }
];

let current = null;
let visualWrap = null;
let sortableInstance = null;

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

function getOrderedSounds(){
  let savedOrder = [];

  try{
    savedOrder = JSON.parse(localStorage.getItem(SOUND_ORDER_KEY) || '[]');
  }catch(e){
    savedOrder = [];
  }

  if(!Array.isArray(savedOrder) || !savedOrder.length) return sounds;

  const byId = new Map(sounds.map(sound => [sound.id, sound]));
  const ordered = savedOrder.map(id => byId.get(id)).filter(Boolean);
  const missing = sounds.filter(sound => !savedOrder.includes(sound.id));

  return ordered.concat(missing);
}

function saveSoundOrder(wrap){
  const order = Array.from(wrap.querySelectorAll('[data-sound-id]'))
    .map(btn => btn.dataset.soundId);

  localStorage.setItem(SOUND_ORDER_KEY, JSON.stringify(order));
}

function setupSortable(wrap){
  if(typeof Sortable === 'undefined') return;
  if(sortableInstance) sortableInstance.destroy();

  sortableInstance = Sortable.create(wrap, {
    animation: 150,
    draggable: '[data-sound-id]',
    filter: '[data-action="stop"]',
    delayOnTouchOnly: true,
    delay: 120,
    touchStartThreshold: 4,
    onEnd: () => saveSoundOrder(wrap)
  });
}

function renderSoundboard(wrap){
  wrap.innerHTML = '';

  getOrderedSounds().forEach(sound=>{
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
  stopBtn.dataset.action = 'stop';
  stopBtn.textContent = 'Parar';
  stopBtn.addEventListener('click', stop);
  wrap.appendChild(stopBtn);

  setupSortable(wrap);
}

function setupResetSoundOrder(wrap){
  const btn = document.getElementById('reset-sound-order');
  if(!btn) return;

  btn.addEventListener('click', ()=>{
    localStorage.removeItem(SOUND_ORDER_KEY);
    stop();
    renderSoundboard(wrap);
  });
}

async function init(){
  await guard();

  const wrap = document.getElementById('soundboard');
  visualWrap = document.getElementById('sound-visual');
  if(!wrap) return;

  renderSoundboard(wrap);
  setupResetSoundOrder(wrap);
}

document.addEventListener('DOMContentLoaded', init);
