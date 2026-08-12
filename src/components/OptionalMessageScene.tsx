import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { PERSONAL_CONFIG } from '../config';
import { sendReplyMessage } from '../lib/messages';

type Props = {
  onDone: () => void;
};

type Mode = 'ask' | 'form' | 'sent' | 'skipped';

export function OptionalMessageScene({ onDone }: Props) {
  const [mode, setMode] = useState<Mode>('ask');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await sendReplyMessage(text, PERSONAL_CONFIG.messagesApiUrl);
      setMode('sent');
    } catch {
      setError('Impossible d’envoyer pour le moment. Réessaie.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="scene optional-message">
      <AnimatePresence mode="wait">
        {mode === 'ask' && (
          <motion.div
            key="ask"
            className="optional-message__card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p className="optional-message__eyebrow">Au choix</p>
            <h2 className="optional-message__title">
              {PERSONAL_CONFIG.replyPrompt.title}
            </h2>
            <p className="optional-message__text">{PERSONAL_CONFIG.replyPrompt.lead}</p>
            <div className="optional-message__actions">
              <motion.button
                type="button"
                className="btn btn--primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('form')}
              >
                <span className="btn__shine" />
                {PERSONAL_CONFIG.replyPrompt.writeCta}
              </motion.button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setMode('skipped');
                  setTimeout(onDone, 600);
                }}
              >
                {PERSONAL_CONFIG.replyPrompt.skipCta}
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'form' && (
          <motion.form
            key="form"
            className="optional-message__card"
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="optional-message__title">Ton message pour Fréjus</h2>
            <p className="optional-message__text">
              Écris seulement si tu en as envie. Il pourra le lire de son côté.
            </p>
            <label className="sr-only" htmlFor="reply-message">
              Message
            </label>
            <textarea
              id="reply-message"
              className="optional-message__input"
              rows={5}
              maxLength={2000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ce que tu veux lui dire…"
              autoFocus
            />
            {error && <p className="optional-message__error">{error}</p>}
            <div className="optional-message__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!text.trim() || sending}
              >
                <span className="btn__shine" />
                {sending ? 'Envoi…' : 'Envoyer'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setMode('ask')}
                disabled={sending}
              >
                Retour
              </button>
            </div>
          </motion.form>
        )}

        {mode === 'sent' && (
          <motion.div
            key="sent"
            className="optional-message__card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="optional-message__title">C’est parti</h2>
            <p className="optional-message__text">
              Ton message a été déposé. Merci d’avoir pris ce moment.
            </p>
            <button type="button" className="btn btn--primary" onClick={onDone}>
              Continuer
            </button>
          </motion.div>
        )}

        {mode === 'skipped' && (
          <motion.p
            key="skipped"
            className="scene__waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            D’accord… on continue doucement.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
