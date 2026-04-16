// Contrato: assinatura no canvas e libera download de PDF pronto.

function getPos(canvas, evt){
  const rect = canvas.getBoundingClientRect();
  const isTouch = evt.touches && evt.touches[0];
  const clientX = isTouch ? evt.touches[0].clientX : evt.clientX;
  const clientY = isTouch ? evt.touches[0].clientY : evt.clientY;
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

async function init(){
  const canvas = document.getElementById('sig');
  const clearBtn = document.getElementById('clear');
  const saveBtn = document.getElementById('save');
  const msg = document.getElementById('sig-msg');
  const dl = document.getElementById('download');
  const downloadBtn = document.getElementById('download-btn');
  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#111827';

  let drawing = false;
  let hasInk = false;

  function revealDownload(){
    dl.classList.remove('hidden');
    dl.classList.add('download-ready');
    if(downloadBtn){
      downloadBtn.setAttribute('aria-disabled', 'false');
    }
  }

  function start(e){
    drawing = true;
    const p = getPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    hasInk = true;
    e.preventDefault();
  }
  function move(e){
    if(!drawing) return;
    const p = getPos(canvas, e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }
  function end(e){
    drawing = false;
    e && e.preventDefault && e.preventDefault();
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, {passive:false});
  canvas.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('touchend', end, {passive:false});

  clearBtn.addEventListener('click', ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    hasInk = false;
    msg.textContent = '';
  });

  // se já tinha assinado antes, já libera
  const api = window.__LOVE_STATE__;
  if(api){
    const st = await api.loadState();
    if(st && st.signedContract){
      revealDownload();
    }
  }

  saveBtn.addEventListener('click', async ()=>{
    if(!hasInk){
      msg.textContent = 'Assina primeiro 😅';
      return;
    }
    msg.textContent = 'Contrato selado 💍';
    revealDownload();

    if(api){
      const st = await api.loadState();
      st.signedContract = true;
      await api.saveState(st);
    }else{
      try{
        localStorage.setItem('couple_state_v1', JSON.stringify({ signedContract: true }));
      }catch(e){}
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
