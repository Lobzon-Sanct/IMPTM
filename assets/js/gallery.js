// Galeria: edite a lista abaixo com seus arquivos em assets/media

const MEDIA = [
  { type: 'img', file: 'assets/media/exemplo-1.jpg', caption: 'Exemplo 1 (troque essa imagem)' },
  { type: 'img', file: 'assets/media/exemplo-2.jpg', caption: 'Exemplo 2' },
  // { type: 'video', file: 'assets/media/clip.mp4', caption: 'Um clipe' },
  // { type: 'img', file: 'assets/media/collage.gif', caption: 'Um gif' },
];

function el(tag, cls){ const x=document.createElement(tag); if(cls) x.className=cls; return x; }

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
    if(m.type === 'video'){
      const v = el('video');
      v.src = m.file;
      v.controls = true;
      v.playsInline = true;
      item.appendChild(v);
    }else{
      const img = el('img');
      img.src = m.file;
      img.alt = m.caption || 'mídia';
      item.appendChild(img);
    }
    const cap = el('div','gallery-cap');
    cap.textContent = m.caption || '';
    item.appendChild(cap);
    grid.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', init);
