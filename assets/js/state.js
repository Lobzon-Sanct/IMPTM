// state.js
// Utility functions to manage state via KV endpoint

let _cacheState = null;

export async function loadState() {
  if (_cacheState) return _cacheState;
  try {
    const res = await fetch('/api/state');
    if (!res.ok) throw new Error('Erro ao carregar estado');
    const data = await res.json();
    _cacheState = data || {};
    return _cacheState;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function saveState(state) {
  _cacheState = state;
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (err) {
    console.error(err);
  }
  return _cacheState;
}
