/**
 * Cloudflare Pages Function: /api/state
 *
 * Requer um binding KV chamado LOVE_STATE.
 *
 * Cloudflare Dashboard > Workers & Pages > (seu projeto) > Settings > Functions > KV bindings
 *   Variable name: LOVE_STATE
 *   KV namespace:  (seu namespace)
 */

const KEY = 'couple_state_v1';

export async function onRequest(context) {
  const { request, env } = context;

  // Se KV não estiver bindado, devolve erro claro.
  if (!env || !env.LOVE_STATE) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'KV não configurado. Crie um KV Namespace e faça o binding como LOVE_STATE no Pages.'
    }), {
      status: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (request.method === 'GET') {
    const raw = await env.LOVE_STATE.get(KEY);
    const json = raw ? raw : '{}';
    return new Response(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }

  if (request.method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Normaliza o que salvamos (evita coisas estranhas)
    const safe = (body && typeof body === 'object') ? body : {};
    await env.LOVE_STATE.put(KEY, JSON.stringify(safe));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
