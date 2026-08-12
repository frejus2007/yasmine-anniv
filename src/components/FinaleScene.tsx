import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

const STORAGE_KEY = 'yasmine-secret-world-sealed';

export function isSecretWorldSealed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function sealSecretWorldForever(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

type Props = {
  onReplayIntro: () => void;
  onEnterSecret: () => void;
  compliment: string | null;
  onDismissCompliment: () => void;
  unlocked: boolean;
  sealed: boolean;
  onSealForever: () => void;
};

type Phase = 'offer' | 'confirm' | 'sealed';

export function FinaleScene({
  onReplayIntro,
  onEnterSecret,
  compliment,
  onDismissCompliment,
  unlocked,
  sealed,
  onSealForever,
}: Props) {
  const [phase, setPhase] = useState<Phase>(sealed ? 'sealed' : 'offer');
  const copy = PERSONAL_CONFIG.secretConfirm;

  return (
    <section className="scene finale-scene">
      <motion.h2
        className="finale__title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Merci d’être toi, Yasmine
      </motion.h2>
      <motion.p
        className="finale__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        — {PERSONAL_CONFIG.authorName}
      </motion.p>

      {!unlocked ? (
        <motion.p
          className="scene__waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Lionel a un dernier mot pour toi…
        </motion.p>
      ) : (
        <AnimatePresence mode="wait">
          {phase === 'offer' && (
            <motion.div
              key="offer"
              className="finale__secret-tease"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="finale__secret-label">Il reste un dernier monde…</p>
              <motion.button
                type="button"
                className="btn btn--secret"
                onClick={() => setPhase('confirm')}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="btn__shine" />
                Entrer dans le secret ♥
              </motion.button>
            </motion.div>
          )}

          {phase === 'confirm' && (
            <motion.div
              key="confirm"
              className="secret-confirm"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="secret-confirm-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45 }}
            >
              <p className="secret-confirm__eyebrow">Dernière chance</p>
              <h3 id="secret-confirm-title" className="secret-confirm__title">
                {copy.title}
              </h3>
              <p className="secret-confirm__warning">{copy.warning}</p>
              <p className="secret-confirm__question">{copy.question}</p>
              <div className="secret-confirm__actions">
                <motion.button
                  type="button"
                  className="btn btn--secret"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onEnterSecret}
                >
                  {copy.accept}
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn--seal"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onSealForever();
                    setPhase('sealed');
                  }}
                >
                  {copy.refuse}
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 'sealed' && (
            <motion.div
              key="sealed"
              className="secret-sealed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span className="secret-sealed__icon" aria-hidden>
                ✕
              </span>
              <h3 className="secret-sealed__title">{copy.sealedTitle}</h3>
              <p className="secret-sealed__text">{copy.sealedMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <motion.button
        type="button"
        className="btn btn--ghost"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onReplayIntro}
      >
        Rejouer l’introduction
      </motion.button>

      {compliment && (
        <motion.button
          type="button"
          className="compliment-toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={onDismissCompliment}
        >
          {compliment}
        </motion.button>
      )}
    </section>
  );
}
