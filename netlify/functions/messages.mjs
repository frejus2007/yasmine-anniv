import { getStore } from '@netlify/blobs';

/**
 * API messages hébergée sur Netlify Functions + Blobs.
 * Routes : /api/messages , /api/messages/:id , /api/messages/:id/read
 */

const STORE_NAME = 'yasmine-messages';
const INBOX_KEY = 'inbox';

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'frejus-1309';
}

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    },
  });
}

function requireAdmin(req) {
  const password = req.headers.get('x-admin-password') || '';
  return password === adminPassword();
}

async function readInbox() {
  const store = getStore(STORE_NAME);
  const data = await store.get(INBOX_KEY, { type: 'json' });
  return Array.isArray(data) ? data : [];
}

async function writeInbox(messages) {
  const store = getStore(STORE_NAME);
  await store.setJSON(INBOX_KEY, messages);
}

function parsePath(url) {
  // /api/messages | /api/messages/:id | /api/messages/:id/read
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // ["api", "messages", ...]
  const after = parts.slice(2);
  return {
    id: after[0] || null,
    action: after[1] || null,
  };
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  try {
    const url = new URL(req.url);
    const { id, action } = parsePath(url);

    if (req.method === 'POST' && !id) {
      const body = await req.json().catch(() => ({}));
      const text = String(body?.text ?? '').trim();
      if (!text || text.length > 2000) {
        return json({ error: 'Message invalide' }, 400);
      }
      const messages = await readInbox();
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text,
        createdAt: new Date().toISOString(),
        read: false,
      };
      messages.unshift(entry);
      await writeInbox(messages);
      return json({ ok: true, id: entry.id }, 201);
    }

    if (req.method === 'GET' && !id) {
      if (!requireAdmin(req)) return json({ error: 'Mot de passe incorrect' }, 401);
      const messages = await readInbox();
      return json({ messages });
    }

    if (req.method === 'PATCH' && id && action === 'read') {
      if (!requireAdmin(req)) return json({ error: 'Mot de passe incorrect' }, 401);
      const messages = await readInbox();
      const msg = messages.find((m) => m.id === id);
      if (!msg) return json({ error: 'Introuvable' }, 404);
      msg.read = true;
      await writeInbox(messages);
      return json({ ok: true });
    }

    if (req.method === 'DELETE' && id && !action) {
      if (!requireAdmin(req)) return json({ error: 'Mot de passe incorrect' }, 401);
      const messages = await readInbox();
      await writeInbox(messages.filter((m) => m.id !== id));
      return json({ ok: true });
    }

    return json({ error: 'Route introuvable' }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: 'Erreur serveur' }, 500);
  }
};

export const config = {
  path: ['/api/messages', '/api/messages/*'],
};
