/*
  Persistência de estado via Cloudflare Pages Functions (Workers KV).

  - GET  /api/state  -> retorna JSON do estado
  - POST /api/state  -> salva JSON do estado

  Se a Function/KV não estiver configurada, cai no fallback do localStorage.
*/

(function(){
  const KEY = 'couple_state_v1';

  async function loadState(){
    try{
      const res = await fetch('/api/state', { method: 'GET' });
      if(!res.ok) throw new Error('GET /api/state falhou');
      const data = await res.json();
      return data && typeof data === 'object' ? data : {};
    }catch(err){
      try{
        const local = localStorage.getItem(KEY);
        return local ? JSON.parse(local) : {};
      }catch(e){
        return {};
      }
    }
  }

  async function saveState(state){
    try{
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state || {})
      });
    }catch(err){
      try{ localStorage.setItem(KEY, JSON.stringify(state || {})); }catch(e){}
    }
  }

  // expõe no window (sem ES Modules)
  window.__LOVE_STATE__ = { loadState, saveState };
})();
