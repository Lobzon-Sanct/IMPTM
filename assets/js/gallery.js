// Galeria: edite a lista abaixo com seus arquivos em assets/media

const MEDIA = [
  { type: 'img', file: 'assets/media/2025-09-27T00-46-46-240.jpg', caption: 'Select Chale 01' },
  { type: 'img', file: 'assets/media/2025-09-27T00-46-49-996.jpg', caption: 'Select Chale 02' },
  { type: 'img', file: 'assets/media/2025-09-27T00-47-00-454.jpg', caption: 'Select Chale 03' },
  { type: 'img', file: 'assets/media/2025-09-27T00-47-03-211.jpg', caption: 'Select Chale 04' },
  { type: 'img', file: 'assets/media/2025-09-27T00-47-28-796.jpg', caption: 'Select Chale 05' },
  { type: 'img', file: 'assets/media/2025-09-27T00-47-33-122.jpg', caption: 'Select Chale 06' },
  { type: 'img', file: 'assets/media/2025-09-27T00-54-23-538.jpg', caption: 'Select Chale 07' },
  { type: 'img', file: 'assets/media/2025-09-27T00-54-25-958.jpg', caption: 'Select Chale 08' },
  { type: 'img', file: 'assets/media/2025-09-27T00-54-33-865.jpg', caption: 'Select Chale 09' },
  { type: 'img', file: 'assets/media/2025-09-27T00-54-37-993.jpg', caption: 'Select Chale 10' },
  { type: 'img', file: 'assets/media/2025-09-27T00-55-02-291.jpg', caption: 'Select Chale 11' },
  { type: 'img', file: 'assets/media/2025-09-27T00-55-12-151.jpg', caption: 'Select Chale 12' },
  { type: 'img', file: 'assets/media/agarra podio.jpg', caption: 'Agarra Podio' },
  { type: 'img', file: 'assets/media/bj podio.jpg', caption: 'Bj Podio' },
  { type: 'img', file: 'assets/media/chamego podio.jpg', caption: 'Chamego Podio' },
  { type: 'img', file: 'assets/media/chamego01.jpg', caption: 'Chamego 01' },
  { type: 'img', file: 'assets/media/chamego02.jpg', caption: 'Chamego 02' },
  { type: 'img', file: 'assets/media/chamego03.jpg', caption: 'Chamego 03' },
  { type: 'img', file: 'assets/media/croco podio.jpg', caption: 'Croco Podio' },
  { type: 'img', file: 'assets/media/oiv1.jpg', caption: 'Oiv 1' },
  { type: 'img', file: 'assets/media/oiv2.jpg', caption: 'Oiv 2' },
  { type: 'img', file: 'assets/media/pocoto podio.jpg', caption: 'Pocoto Podio' },
  { type: 'img', file: 'assets/media/podio sim.jpg', caption: 'Podio Sim' },
  { type: 'img', file: 'assets/media/podio x.jpg', caption: 'Podio X' },
  { type: 'img', file: 'assets/media/soquinho podio.jpg', caption: 'Soquinho Podio' },
  { type: 'img', file: 'assets/media/vemk podio.jpg', caption: 'Vemk Podio' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/hello.mp4', caption: 'Hello Hii 🥰' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/comeca%20com%20s.mp4', caption: 'Começa Com S' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/ela%20e%20tudo%20isso.mp4', caption: 'Pole💕' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/gabiel%20ne.mp4', caption: 'Gabriel Né?' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/me%20chamu%20du%20que.mp4', caption: 'Se Me Xanu di Ke?' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/ta%20bom.mp4', caption: 'Quanto Sentimento' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/ta%20dentro%20ou%20fora.mp4', caption: 'Momento Bonito' },
  { type: 'video', file: 'https://pub-4a8ba770d5154e8682abe06d3de4cb33.r2.dev/traeseirox1.mp4', caption: 'Vou te Matar' }
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
