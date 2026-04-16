// Galeria: edite a lista abaixo com seus arquivos em assets/media

const MEDIA = [
  { type: 'img', file: 'assets/media/exemplo-1.jpg', caption: 'Exemplo 1' },
  { type: 'img', file: 'assets/media/exemplo-2.jpg', caption: 'Exemplo 2' },
  { type: 'video', file: 'assets/media/exemplo-video.mp4', caption: 'Exemplo em vídeo' },
  // { type: 'video', file: 'assets/media/clip.mp4', caption: 'Um clipe' },
  // { type: 'img', file: 'assets/media/collage.gif', caption: 'Um gif' },
];

function el(tag, cls){
  const x = document.createElement(tag);
  if(cls) x.className = cls;
  return x;
}

async function guard(){
  // se quiser restringir essa página por progresso, dá pra checar o state aqui
  const api = window.__LOVE_STATE__;
  if(!api) return true;
  const st = await api.loadState();
  if(!(st && st.pages && st.pages.gallery)){
    // não bloqueia com agressividade, só avisa
    console.warn('Galeria não desbloqueada no estado ainda.');
  }
  return true;
}

function createMediaElement(item){
  if(item.type === 'video'){
    const video = el('video');
    video.src = item.file;
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    return video;
  }

  const img = el('img');
  img.src = item.file;
  img.alt = item.caption || 'mídia da galeria';
  img.loading = 'lazy';
  return img;
}

async function init(){
  await guard();
  const grid = document.getElementById('gallery-grid');
  if(!grid) return;

  if(!MEDIA.length){
    grid.innerHTML = '<p class="muted">Nenhuma mídia listada ainda.</p>';
    return;
  }

  MEDIA.forEach(m=>{
    const item = el('div','gallery-item');
    const media = createMediaElement(m);
    const cap = el('div','gallery-cap');

    cap.textContent = m.caption || '';
    item.appendChild(media);
    item.appendChild(cap);
    grid.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', init);
