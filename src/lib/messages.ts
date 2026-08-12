export type StoredMessage = {
  id: string;
  text: string;
  createdAt: string;
  read: boolean;
};

/** Envoie un message vers l’API Netlify. */
export async function sendReplyMessage(text: string, apiBase: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Message vide');

  const res = await fetch(`${apiBase}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed }),
  });

  if (!res.ok) {
    throw new Error('API indisponible');
  }
}

export async function fetchMessages(
  apiBase: string,
  adminPassword: string,
): Promise<StoredMessage[]> {
  const res = await fetch(`${apiBase}/messages`, {
    headers: { 'x-admin-password': adminPassword },
  });

  if (res.status === 401) {
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    throw new Error('load-failed');
  }

  const data = (await res.json()) as { messages: StoredMessage[] };
  return data.messages;
}

export async function markMessageRead(
  apiBase: string,
  adminPassword: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${apiBase}/messages/${id}/read`, {
    method: 'PATCH',
    headers: { 'x-admin-password': adminPassword },
  });
  if (!res.ok) throw new Error('update-failed');
}

export async function deleteMessage(
  apiBase: string,
  adminPassword: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${apiBase}/messages/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': adminPassword },
  });
  if (!res.ok) throw new Error('delete-failed');
}
