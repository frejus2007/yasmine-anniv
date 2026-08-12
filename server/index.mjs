import cors from 'cors';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'messages.json');
const PORT = Number(process.env.PORT) || 8787;
/** Mot de passe admin — doit matcher PERSONAL_CONFIG.adminPassword */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'frejus-1309';

async function readMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeMessages(messages) {
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

function requireAdmin(req, res, next) {
  const password = req.header('x-admin-password') || '';
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }
  next();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

/** Yasmine envoie un message (public). */
app.post('/api/messages', async (req, res) => {
  const text = String(req.body?.text ?? '').trim();
  if (!text || text.length > 2000) {
    res.status(400).json({ error: 'Message invalide' });
    return;
  }

  const messages = await readMessages();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.unshift(entry);
  await writeMessages(messages);
  res.status(201).json({ ok: true, id: entry.id });
});

/** Fréjus lit les messages (protégé). */
app.get('/api/messages', requireAdmin, async (_req, res) => {
  const messages = await readMessages();
  res.json({ messages });
});

app.patch('/api/messages/:id/read', requireAdmin, async (req, res) => {
  const messages = await readMessages();
  const msg = messages.find((m) => m.id === req.params.id);
  if (!msg) {
    res.status(404).json({ error: 'Introuvable' });
    return;
  }
  msg.read = true;
  await writeMessages(messages);
  res.json({ ok: true });
});

app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  const messages = await readMessages();
  const next = messages.filter((m) => m.id !== req.params.id);
  await writeMessages(next);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Boîte aux lettres Fréjus → http://localhost:${PORT}`);
});
