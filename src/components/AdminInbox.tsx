import { motion } from 'framer-motion';
import { useCallback, useState, type FormEvent } from 'react';
import { PERSONAL_CONFIG } from '../config';
import {
  deleteMessage,
  fetchMessages,
  markMessageRead,
  type StoredMessage,
} from '../lib/messages';

type Props = {
  onBack: () => void;
};

export function AdminInbox({ onBack }: Props) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (pwd: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await fetchMessages(PERSONAL_CONFIG.messagesApiUrl, pwd);
      setMessages(list);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'unauthorized') {
        setAuthError(true);
        setAuthed(false);
      } else {
        setLoadError('Impossible de charger les messages. Vérifie le déploiement Netlify.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(false);
    const ok = await load(password);
    if (ok) setAuthed(true);
  };

  return (
    <div className="admin">
      <header className="admin__top">
        <div>
          <p className="admin__eyebrow">Espace privé</p>
          <h1 className="admin__title">Messages de Yasmine</h1>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Retour au site
        </button>
      </header>

      {!authed ? (
        <form className="admin__login" onSubmit={login}>
          <p>Entre ton mot de passe pour ouvrir la boîte.</p>
          <label className="sr-only" htmlFor="admin-pass">
            Mot de passe
          </label>
          <input
            id="admin-pass"
            type="password"
            className="admin__input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(false);
            }}
            placeholder="Mot de passe"
            autoComplete="current-password"
          />
          {authError && <p className="admin__error">Mot de passe incorrect.</p>}
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Ouverture…' : 'Ouvrir'}
          </button>
        </form>
      ) : (
        <div className="admin__inbox">
          <div className="admin__toolbar">
            <p>
              {loadError
                ? loadError
                : messages.length === 0
                  ? 'Aucun message pour l’instant.'
                  : `${messages.length} message${messages.length > 1 ? 's' : ''}`}
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => void load(password)}
              disabled={loading}
            >
              {loading ? 'Chargement…' : 'Actualiser'}
            </button>
          </div>

          <ul className="admin__list">
            {messages.map((m) => (
              <motion.li
                key={m.id}
                className={`admin__item ${m.read ? 'is-read' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="admin__meta">
                  <time dateTime={m.createdAt}>
                    {new Date(m.createdAt).toLocaleString('fr-FR')}
                  </time>
                  {!m.read && <span className="admin__badge">Nouveau</span>}
                </div>
                <p className="admin__body">{m.text}</p>
                <div className="admin__row">
                  {!m.read && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={async () => {
                        await markMessageRead(
                          PERSONAL_CONFIG.messagesApiUrl,
                          password,
                          m.id,
                        );
                        await load(password);
                      }}
                    >
                      Marquer lu
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={async () => {
                      await deleteMessage(
                        PERSONAL_CONFIG.messagesApiUrl,
                        password,
                        m.id,
                      );
                      await load(password);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
