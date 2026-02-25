// script.js
import { loadState, saveState } from './state.js';

// Config
// Senha romântica (minúsculo, sem acento, sem espaço). Troque para o apelido real de vocês.
const LOCK_PASS = 'pole';
const START_DATE = new Date('2015-01-01T00:00:00');
const LOVE_MIN = 750000;
const HATE_MIN = 95000;

// Record when the page was loaded (used for dynamic counters)
const PAGE_LOAD_TIME = new Date();

// Quiz questions
const QUIZ_STEPS = [
  {
    id: 1,
    question: 'Onde nos conhecemos pela primeira vez?',
    acceptedAnswers: ['escola', 'na escola', 'faculdade'],
    memoryTitle: 'Primeiro encontro',
    memoryText: 'Nossa história começou naquele lugar especial onde nos conhecemos...'
  },
  {
    id: 2,
    question: 'Qual é a nossa comida favorita de casal?',
    acceptedAnswers: ['pizza', 'sushi', 'hamburguer'],
    memoryTitle: 'Nosso prato preferido',
    memoryText: 'Lembra daquela noite em que descobrimos essa delícia juntos?'
  },
  {
    id: 3,
    question: 'Qual foi a viagem mais inesquecível que fizemos?',
    acceptedAnswers: ['praia', 'rio', 'montanha'],
    memoryTitle: 'Viagem inesquecível',
    memoryText: 'Foi nesse lugar que percebemos o quanto somos perfeitos um para o outro.'
  },
  {
    id: 4,
    question: 'Quantos “te odeio/idiota” já disse pra você?',
    acceptedAnswers: ['muitos', 'infinitos', 'infinito', 'um monte'],
    memoryTitle: 'Te odeio/idiota: mentira!',
    memoryText: 'Essas palavras nunca foram de verdade. Você sabe. ❤️'
  }
];

// Easter egg
function setupEasterEgg() {
  const eggButton = document.getElementById('egg-button');
  const modal = document.getElementById('egg-modal');
  const closeBtn = document.getElementById('close-egg');
  eggButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

// Lock screen
function setupLock() {
  const screen = document.getElementById('lock-screen');
  const input = document.getElementById('lock-input');
  const button = document.getElementById('lock-button');
  const errorMsg = document.getElementById('lock-error');
  button.addEventListener('click', () => {
    if (input.value.trim().toLowerCase() === LOCK_PASS.toLowerCase()) {
      screen.classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
    } else {
      errorMsg.textContent = 'Ops! Tente novamente...';
    }
  });
}

// Impostometro update
function updateCounters() {
  const daysEl = document.getElementById('days-count');
  const hoursEl = document.getElementById('hours-count');
  const loveEl = document.getElementById('love-count');
  const plansEl = document.getElementById('plans-count');

  function calc() {
    const now = new Date();
    const diff = now - START_DATE;
    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds / 3600);
    // dynamic extras based on time loaded
    const loadTime = new Date() - PAGE_LOAD_TIME;
    const extraLove = Math.floor(loadTime / 250); // 4 por segundo (250ms per)
    const extraHate = Math.floor(loadTime / 142); // ~7 por segundo
    const extraPlans = Math.floor(loadTime / 10000); // 1 a cada 10s
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    loveEl.textContent = LOVE_MIN + extraLove;
    plansEl.textContent = 10 + extraPlans;
    // hate updated in quiz after step 4 unlocked
  }

  calc();
  setInterval(calc, 1000);
}

// Quiz logic
async function setupQuiz() {
  const state = await loadState();
  state.unlockedSteps = state.unlockedSteps || [];
  state.pagesUnlocked = state.pagesUnlocked || {};
  state.signedContract = state.signedContract || false;

  const quizProgress = document.getElementById('quiz-progress');
  const quizSteps = document.getElementById('quiz-steps');
  const feedback = document.getElementById('quiz-feedback');
  const memories = document.getElementById('memories');
  const extraSection = document.getElementById('extra-section');
  const extraLinks = document.getElementById('extra-links');
  let currentIndex = state.unlockedSteps.length;

  function renderSteps() {
    quizSteps.innerHTML = '';
    QUIZ_STEPS.forEach((step, idx) => {
      const div = document.createElement('div');
      div.className = 'quiz-step';
      const q = document.createElement('p');
      q.textContent = step.question;
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Sua resposta...';
      input.disabled = idx < currentIndex;
      const btn = document.createElement('button');
      btn.textContent = 'Responder';
      btn.disabled = idx < currentIndex;
      div.appendChild(q);
      div.appendChild(input);
      div.appendChild(btn);
      quizSteps.appendChild(div);
      // fill answered steps
      if (idx < currentIndex) {
        input.value = state.answers ? state.answers[idx] || '' : '';
        btn.textContent = '✔';
        btn.disabled = true;
      }
      btn.addEventListener('click', async () => {
        const ans = input.value.trim().toLowerCase();
        if (!ans) {
          feedback.textContent = 'Digite algo!';
          feedback.className = 'feedback cold';
          return;
        }
        const accepted = step.acceptedAnswers.map(a => a.toLowerCase());
        // simple match: accepted or partial
        if (accepted.includes(ans)) {
          feedback.textContent = 'Perfeito! Você acertou ❤️';
          feedback.className = 'feedback ok';
          // save answer and unlock
          state.unlockedSteps.push(step.id);
          state.answers = state.answers || [];
          state.answers[idx] = ans;
          // if step 4, unlock hate counter page
          if (step.id === 4) {
            state.pagesUnlocked.hateCounter = true;
          }
          currentIndex++;
          await saveState(state);
          renderSteps();
          renderMemories();
          renderExtras();
        } else if (accepted.some(a => ans.includes(a))) {
          feedback.textContent = 'Quase lá! Ajuste sua resposta.';
          feedback.className = 'feedback warm';
        } else {
          feedback.textContent = 'Não foi dessa vez! Tente outra coisa.';
          feedback.className = 'feedback cold';
        }
      });
    });
    quizProgress.textContent = `Fase ${currentIndex + 1} de ${QUIZ_STEPS.length}`;
  }

  function renderMemories() {
    memories.innerHTML = '';
    state.unlockedSteps.forEach(id => {
      const step = QUIZ_STEPS.find(s => s.id === id);
      if (step) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        const title = document.createElement('h3');
        title.textContent = step.memoryTitle;
        const text = document.createElement('p');
        text.textContent = step.memoryText;
        card.appendChild(title);
        card.appendChild(text);
        memories.appendChild(card);
      }
    });
  }

  function renderExtras() {
    extraLinks.innerHTML = '';
    const pages = [
      { key: 'gallery', name: 'Galeria', url: 'gallery.html' },
      { key: 'sounds', name: 'Soundboard', url: 'sounds.html' },
      { key: 'contract', name: 'Contrato', url: 'contract.html' }
    ];
    let any = false;
    pages.forEach(p => {
      if (state.pagesUnlocked[p.key]) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = p.url;
        a.textContent = p.name;
        li.appendChild(a);
        extraLinks.appendChild(li);
        any = true;
      }
    });
    if (any) {
      extraSection.classList.remove('hidden');
    }
  }

  renderSteps();
  renderMemories();
  renderExtras();
}

// Initialize app
function init() {
  setupLock();
  updateCounters();
  setupQuiz();
  setupEasterEgg();
}

document.addEventListener('DOMContentLoaded', init);
