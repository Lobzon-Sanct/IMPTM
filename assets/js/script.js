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
    question: "Onde nos conhecemos pela primeira vez?",
    hint: "Dica: Foi no digital… mas virou algo bem real.",
    acceptedAnswers: [
      "discord",
      "warface",
      "jogando",
      "clã",
      "clan",
      "call"
    ],
    memoryTitle: "Começo de tudo",
    memoryText: "Nossa história começou ali... e o resto é só consequência. 💗"
  },

  {
    id: 2,
    question: "Qual é o nosso game favorito de casal?",
    hint: "Dica: Jogos ou Games?",
    acceptedAnswers: [
      "warface",
      "party animals",
      "sinuca",
      "it takes two",
      "it takes two game",

      "colaboracao",
      "colaboração",
      "colaboretion",
      "colaboreixon",
      "coop",
      "cooperativo",
      "cooperacao",
      "cooperação",

      "cody",
      "may",

      "qualquer um com você",
      "qualquer jogo",
      "qualquer game",
      "com você"
    ],
    memoryTitle: "Nosso jogo favorito",
    memoryText: "A gente pode jogar qualquer coisa... mas quando é junto, vira outra coisa. 🎮💜"
  },

  {
    id: 3,
    question: "Qual foi a viagem/rolê mais inesquecível que iremos fazer?",
    hint: "Dica: Ainda não aconteceu… mas já mora na cabeça.",
    acceptedAnswers: [
      "foz",
      "foz do iguaçu",
      "cataratas",
      "me ver",
      "me visitar",
      "te ver",
      "te visitar"
    ],
    memoryTitle: "Viagem inesquecível",
    memoryText: "Ainda não aconteceu... mas já é inesquecível só de imaginar com você. 🌍"
  },

  {
    id: 4,
    question: "Quantos “te odeio / te mato / idiota” você já disse?",
    hint: "Dica: Quantas estrelas existem no brilho dos seus olhos?",
    acceptedAnswers: [
      "muitos",
      "∞",
      "infinito",
      "infinitos",
      "mais que dois",
      "não o suficiente",
      "nao o suficiente",
      "poucos",
      "nenhum",
      "nada",
      "nunca",
      "nunca falei",
      "nunca disse"
    ],
    memoryTitle: "Bravinha (Reação explosiva de Na/CL+OD-io-nizado)",
    memoryText: "Você fala, eu rio... e no fim a gente se ama igual. 😏💗"
  }
];

// ========= HELPERS =========
function normalizeText(text){
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .trim();
}

function norm(s){
  return normalizeText(s);
}

function isAnswerCorrect(userAnswer, acceptedAnswers){
  const normalizedUser = normalizeText(userAnswer);

  return acceptedAnswers.some(answer =>
    normalizeText(answer) === normalizedUser
  );
}

function updatePhase(currentStep){
  const phaseEl = document.getElementById('quiz-progress');
  if(!phaseEl) return;

  const totalSteps = QUIZ_STEPS.length;
  const safeStep = Math.min(currentStep + 1, totalSteps);
  phaseEl.innerText = `Fase ${safeStep} de ${totalSteps}`;
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
  mute:false,
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
      STATE.unlockedSteps = Math.min(Number(STATE.unlockedSteps || 0), QUIZ_STEPS.length);
      STATE.showHate = !!STATE.showHate;
      STATE.mute = STATE.mute === true; // default false
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

function setupBgmAutoplayAfterInteraction(){
  const bgm = document.getElementById('bgm');
  if(!bgm) return;

  const playAudio = () => {
    bgm.play().catch(()=>{});
    document.removeEventListener('click', playAudio);
  };

  document.addEventListener('click', playAudio);
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

// ========= RESET =========
function setupReset(){
  const btn = document.getElementById('reset-progress');
  if(!btn) return;

  btn.addEventListener('click', async ()=>{
    const confirmed = window.confirm('Tem certeza que deseja recomeçar nossa história? Isso vai apagar o progresso salvo neste navegador.');
    if(!confirmed) return;

    localStorage.clear();

    if(typeof saveState === 'function'){
      try{
        await saveState({});
      }catch(e){}
    }

    window.alert('Memória resetada');
    window.location.reload();
  });
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
      card.className = 'memory-card';
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
    if(isAnswerCorrect(ans, accepted)) return { type:'ok', text:'Perfeito! Você acertou ❤️' };

    // "quente" se for substring de algum accepted ou vice-versa
    const warm = list.some(x => x.includes(a) || a.includes(x));
    if(warm) return { type:'warm', text:'Tá quente… bem perto! Ajusta só um pouquinho.' };

    return { type:'cold', text:'Tá frio 😅 tenta outra resposta.' };
  }



  
  function showNextStep(currentStep){
    const next = stepsWrap.querySelector(`[data-step="${currentStep + 1}"]`);
    if(next){
      next.style.display = 'block';
    }
  }

  function lockStep(stepIndex){
    const step = stepsWrap.querySelector(`[data-step="${stepIndex}"]`);
    if(!step) return;

    const input = step.querySelector('input');
    const button = step.querySelector('button');

    if(input) input.disabled = true;
    if(button){
      button.innerText = '✔';
      button.disabled = true;
    }
  }
  function render(){
    stepsWrap.innerHTML = '';

    const totalSteps = QUIZ_STEPS.length;
    const current = Math.min(STATE.unlockedSteps, totalSteps);
    updatePhase(current);

    QUIZ_STEPS.forEach((step, idx)=>{
      const box = document.createElement('div');
      box.className = 'quiz-step quiz-item';
      box.dataset.step = String(idx);
      box.style.display = idx <= current ? 'block' : 'none';

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
      input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
          e.preventDefault();
          btn.click();
        }
      });
      btn.addEventListener('click', async ()=>{
        if(idx !== STATE.unlockedSteps) return;
        const ans = input.value || '';
        if(!ans.trim()){
          feedback.className = 'feedback cold';
          feedback.textContent = 'Digite alguma coisa 🙂';
          return;
        }

        const acceptedAnswers = step.acceptedAnswers || step.accepted || [];
        const fb = feedbackQuenteFrio(ans, acceptedAnswers);
        feedback.className = 'feedback ' + fb.type;
        feedback.textContent = fb.text;

        if(fb.type === 'ok'){
          // salva e desbloqueia
          STATE.answers[idx] = ans.trim();
          STATE.unlockedSteps = Math.min(STATE.unlockedSteps + 1, QUIZ_STEPS.length);

          // desbloqueios por etapa
          if(step.id === 1) STATE.pages.gallery = true;
          if(step.id === 2) STATE.pages.sounds = true;
          if(step.id === 3) STATE.pages.contract = true;
          if(step.id === 4) STATE.showHate = true;

          await save();
          lockStep(idx);
          showNextStep(idx);
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
  setupBgmAutoplayAfterInteraction();
  setupCounters();
  setupQuiz();
  setupEasterEgg();
  setupReset();
}

document.addEventListener('DOMContentLoaded', init);
