// Impostômetro do Amor (index)
// Tudo configurável aqui.

// ========= CONFIG =========
const LOCK_PASS = 'pole'; // <-- troque aqui (sem acento, minúsculo recomendado)
const START_DATE = new Date('2015-01-01T00:00:00');

// contadores mínimos (iniciais)
const LOVE_MIN = 750000;
const HATE_MIN = 95000;

// velocidade (quanto aumenta por segundo)
const LOVE_PER_SEC = 4;   // 4/seg
const HATE_PER_SEC = 7;   // 7/seg
const PLANS_EVERY_SEC = 10; // +1 plano a cada 10s

// desbloqueios
// - gallery: após acerto da pergunta 1
// - sounds:  após acerto da pergunta 2
// - contract: após acerto da pergunta 3
// - hate counter: após acerto da pergunta 4

// Perguntas (troque livremente)
const QUIZ_STEPS = [
  {
    id: 1,
    question: 'Onde nos conhecemos pela primeira vez?',
    hint: 'Dica: uma resposta curta já resolve (ex: “escola”).',
    accepted: ['escola', 'na escola', 'colégio', 'colegio'],
    memoryTitle: 'Começo de tudo',
    memoryText: 'Nossa história começou ali… e o resto é só consequência. 💗'
  },
  {
    id: 2,
    question: 'Qual é a nossa comida favorita de casal?',
    hint: 'Dica: pode ser “pizza”, “sushi”… você decide aqui.',
    accepted: ['pizza', 'sushi', 'hamburguer', 'hambúrguer', 'hamburger'],
    memoryTitle: 'Nosso prato preferido',
    memoryText: 'Dois garfos, uma risada, e o mundo ficando leve. 🍕'
  },
  {
    id: 3,
    question: 'Qual foi a viagem/rolê mais inesquecível que fizemos?',
    hint: 'Dica: pode ser um lugar (ex: “foz”), ou algo tipo “praia”.',
    accepted: ['foz', 'foz do iguacu', 'foz do iguaçu', 'praia', 'rio', 'montanha'],
    memoryTitle: 'Viagem inesquecível',
    memoryText: 'Tem lugares que viram “casa” quando você tá comigo. 🧳'
  },
  {
    id: 4,
    question: 'Quantos “te odeio / te mato / idiota” você já disse?',
    hint: 'Resposta válida: “muitos”, “∞”, “mais que dois”…',
    accepted: ['muitos', 'infinito', 'infinitos', '∞', 'mais que dois', 'pra cacete', 'nao o suficiente', 'não o suficiente'],
    memoryTitle: 'Bravinha (mentira)',
    memoryText: 'Você fala, eu rio… e a gente se ama igual. 😌'
  }
];

// ========= HELPERS =========
function norm(s){
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'');
}

function setSaveIndicator(text){
  const el = document.getElementById('save-indicator');
  if(!el) return;
  el.textContent = text || '';
}

// ========= STATE =========
const { loadState, saveState } = window.__LOVE_STATE__ || {};
let STATE = {
  unlockedSteps: 0,
  answers: [],
  pages: { gallery:false, sounds:false, contract:false },
  showHate:false,
  mute:true,
  signedContract:false
};

async function load(){
  if(typeof loadState === 'function'){
    const s = await loadState();
    if(s && typeof s === 'object'){
      STATE = Object.assign({}, STATE, s);
      // garante estrutura
      STATE.pages = Object.assign({gallery:false,sounds:false,contract:false}, STATE.pages || {});
      STATE.answers = Array.isArray(STATE.answers) ? STATE.answers : [];
      STATE.unlockedSteps = Number(STATE.unlockedSteps || 0);
      STATE.showHate = !!STATE.showHate;
      STATE.mute = STATE.mute !== false; // default true
    }
  }
}

async function save(){
  if(typeof saveState === 'function'){
    try{
      setSaveIndicator('salvando…');
      await saveState(STATE);
      setSaveIndicator('salvo ✓');
      setTimeout(()=>setSaveIndicator(''), 1200);
    }catch(e){
      setSaveIndicator('');
    }
  }
}

// ========= LOCK =========
function setupLock(){
  const screen = document.getElementById('lock-screen');
  const app = document.getElementById('app');
  const input = document.getElementById('lock-input');
  const btn = document.getElementById('lock-button');
  const err = document.getElementById('lock-error');

  function tryUnlock(){
    const typed = norm(input.value);
    if(typed && typed === norm(LOCK_PASS)){
      screen.classList.add('hidden');
      app.classList.remove('hidden');
      err.textContent = '';
      // música: tenta tocar, mas respeita autoplay (muitos browsers bloqueiam)
      const bgm = document.getElementById('bgm');
      if(bgm && !STATE.mute){ bgm.play().catch(()=>{}); }
    }else{
      err.textContent = 'Ops! Tente novamente…';
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') tryUnlock(); });
}

// ========= MUSIC =========
function setupMusic(){
  const btn = document.getElementById('mute-btn');
  const bgm = document.getElementById('bgm');
  if(!btn || !bgm) return;

  function render(){
    btn.textContent = STATE.mute ? '🔇' : '🔊';
    btn.title = STATE.mute ? 'Ativar música' : 'Mutar música';
  }

  btn.addEventListener('click', async ()=>{
    STATE.mute = !STATE.mute;
    render();
    if(STATE.mute){ bgm.pause(); }
    else{ bgm.play().catch(()=>{}); }
    await save();
  });

  render();
}

// ========= COUNTERS =========
const PAGE_LOAD = new Date();
function setupCounters(){
  const daysEl = document.getElementById('days-count');
  const hoursEl = document.getElementById('hours-count');
  const loveEl = document.getElementById('love-count');
  const plansEl = document.getElementById('plans-count');
  const hateEl = document.getElementById('hate-count');

  function tick(){
    const now = new Date();
    const diffSec = Math.floor((now - START_DATE) / 1000);
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor(diffSec / 3600);

    // cresce enquanto a página está aberta
    const openSec = Math.floor((now - PAGE_LOAD) / 1000);
    const love = LOVE_MIN + (openSec * LOVE_PER_SEC);
    const plans = 10 + Math.floor(openSec / PLANS_EVERY_SEC);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours);
    loveEl.textContent = String(love);
    plansEl.textContent = String(plans);

    // hate só aparece quando desbloquear
    if(STATE.showHate && hateEl){
      const hate = HATE_MIN + (openSec * HATE_PER_SEC);
      hateEl.textContent = String(hate);
    }
  }

  tick();
  setInterval(tick, 1000);
}

// ========= EASTER EGG =========
function setupEasterEgg(){
  const eggBtn = document.getElementById('egg-button');
  const modal = document.getElementById('egg-modal');
  const close = document.getElementById('close-egg');
  if(!eggBtn || !modal || !close) return;
  eggBtn.addEventListener('click', ()=> modal.classList.remove('hidden'));
  close.addEventListener('click', ()=> modal.classList.add('hidden'));
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });
}

// ========= QUIZ =========
function setupQuiz(){
  const progress = document.getElementById('quiz-progress');
  const stepsWrap = document.getElementById('quiz-steps');
  const feedback = document.getElementById('quiz-feedback');
  const memories = document.getElementById('memories');

  const extras = document.getElementById('extras');
  const extraLinks = document.getElementById('extra-links');
  const hateWrap = document.getElementById('hate-wrapper');

  function renderExtras(){
    extraLinks.innerHTML = '';
    const pages = [];
    if(STATE.pages.gallery) pages.push({name:'Galeria', url:'gallery.html'});
    if(STATE.pages.sounds) pages.push({name:'Soundboard', url:'sounds.html'});
    if(STATE.pages.contract) pages.push({name:'Contrato', url:'contract.html'});

    if(pages.length){
      extras.classList.remove('hidden');
      pages.forEach(p=>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = p.url;
        a.textContent = p.name;
        li.appendChild(a);
        extraLinks.appendChild(li);
      });
    }

    if(STATE.showHate){
      hateWrap.classList.remove('hidden');
    }
  }

  function renderMemories(){
    memories.innerHTML = '';
    for(let i=0; i<STATE.unlockedSteps; i++){
      const step = QUIZ_STEPS[i];
      const card = document.createElement('div');
      card.className = 'memory';
      const h = document.createElement('h4');
      h.textContent = step.memoryTitle;
      const p = document.createElement('p');
      p.textContent = step.memoryText;
      card.appendChild(h);
      card.appendChild(p);
      memories.appendChild(card);
    }
  }

  function feedbackQuenteFrio(ans, accepted){
    const a = norm(ans);
    const list = accepted.map(norm);

    // match exato
    if(list.includes(a)) return { type:'ok', text:'Perfeito! Você acertou ❤️' };

    // "quente" se for substring de algum accepted ou vice-versa
    const warm = list.some(x => x.includes(a) || a.includes(x));
    if(warm) return { type:'warm', text:'Tá quente… bem perto! Ajusta só um pouquinho.' };

    return { type:'cold', text:'Tá frio 😅 tenta outra resposta.' };
  }

  function render(){
    stepsWrap.innerHTML = '';

    const current = Math.min(STATE.unlockedSteps, QUIZ_STEPS.length);
    progress.textContent = `Fase ${current + 1} de ${QUIZ_STEPS.length}`;

    QUIZ_STEPS.forEach((step, idx)=>{
      const box = document.createElement('div');
      box.className = 'quiz-step';

      const q = document.createElement('p');
      q.className = 'quiz-q';
      q.textContent = step.question;

      const help = document.createElement('p');
      help.className = 'quiz-help';
      help.textContent = step.hint || '';

      const row = document.createElement('div');
      row.className = 'quiz-row';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Sua resposta…';

      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.type = 'button';

      // já respondido
      if(idx < current){
        input.value = STATE.answers[idx] || '';
        input.disabled = true;
        btn.textContent = '✔';
        btn.disabled = true;
      } else if(idx === current){
        btn.textContent = 'Responder';
        btn.disabled = false;
      } else {
        input.disabled = true;
        btn.textContent = 'Bloqueado';
        btn.disabled = true;
      }

      btn.addEventListener('click', async ()=>{
        if(idx !== STATE.unlockedSteps) return;
        const ans = input.value || '';
        if(!ans.trim()){
          feedback.className = 'feedback cold';
          feedback.textContent = 'Digite alguma coisa 🙂';
          return;
        }

        const fb = feedbackQuenteFrio(ans, step.accepted);
        feedback.className = 'feedback ' + fb.type;
        feedback.textContent = fb.text;

        if(fb.type === 'ok'){
          // salva e desbloqueia
          STATE.answers[idx] = ans.trim();
          STATE.unlockedSteps = STATE.unlockedSteps + 1;

          // desbloqueios por etapa
          if(step.id === 1) STATE.pages.gallery = true;
          if(step.id === 2) STATE.pages.sounds = true;
          if(step.id === 3) STATE.pages.contract = true;
          if(step.id === 4) STATE.showHate = true;

          await save();
          render();
          renderMemories();
          renderExtras();
        }
      });

      row.appendChild(input);
      row.appendChild(btn);

      box.appendChild(q);
      if(step.hint) box.appendChild(help);
      box.appendChild(row);

      stepsWrap.appendChild(box);
    });

    renderMemories();
    renderExtras();
  }

  render();
}

// ========= INIT =========
async function init(){
  await load();
  setupLock();
  setupMusic();
  setupCounters();
  setupQuiz();
  setupEasterEgg();
}

document.addEventListener('DOMContentLoaded', init);
