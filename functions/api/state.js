export async function onRequestGet({ env }) {
  const key = 'couple_state_v1';
  const state = await env.LOVE_STATE.get(key, { type: 'json' });
  return new Response(JSON.stringify(state || {}), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request, env }) {
  const key = 'couple_state_v1';
  const body = await request.json();
  // sanitize
  const safe = {
    unlockedSteps: Array.isArray(body.unlockedSteps) ? body.unlockedSteps : [],
    answers: Array.isArray(body.answers) ? body.answers : [],
    pagesUnlocked: body.pagesUnlocked || {},
    signedContract: !!body.signedContract,
  };
  await env.LOVE_STATE.put(key, JSON.stringify(safe));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
