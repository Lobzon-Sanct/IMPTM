// Funções para carregar e salvar estado usando a API interna (Workers KV)

export async function loadState() {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) throw new Error('Falha ao carregar estado');
    const json = await res.json();
    return json || {};
  } catch (err) {
    // Fallback: tenta recuperar do localStorage
    try {
      const local = window.localStorage.getItem('couple_state_v1');
      return local ? JSON.parse(local) : {};
    } catch (e) {
      return {};
    }
  }
}

export async function saveState(state) {
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (err) {
    // fallback: salva no localStorage
    try {
      window.localStorage.setItem('couple_state_v1', JSON.stringify(state));
    } catch (e) {}
  }
}