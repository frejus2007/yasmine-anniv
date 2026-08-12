import { motion, AnimatePresence } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { PERSONAL_CONFIG, normalizeSecretCode } from '../config';

type Props = {
  onUnlock: () => void;
  onBack: () => void;
  onSuccess: () => void;
  onFail: () => void;
  unlocked: boolean;
};

export function SecretGateScene({ onUnlock, onBack, onSuccess, onFail, unlocked }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!unlocked) return;
    const ok = normalizeSecretCode(code) === normalizeSecretCode(PERSONAL_CONFIG.secretCode);
    if (ok) {
      onSuccess();
      onUnlock();
      return;
    }
    onFail();
    setError(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <section className="scene secret-gate">
      <div className="secret-gate__glow" aria-hidden />
      <motion.div
        className="secret-gate__portal"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="secret-gate__ring secret-gate__ring--outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="secret-gate__ring secret-gate__ring--inner"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="secret-gate__core"
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♥
        </motion.span>
      </motion.div>

      <motion.h2
        className="secret-gate__title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        Un monde réservé
      </motion.h2>
      <motion.p
        className="secret-gate__lead"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Derrière cette porte, il y a ce que je n’ai pas encore dit à voix haute.
      </motion.p>

      {!unlocked ? (
        <motion.p
          className="scene__waiting scene__waiting--light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Confirme d’abord auprès de Lionel…
        </motion.p>
      ) : (
      <motion.form
        className="secret-gate__form"
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={shaking ? { x: [-8, 8, -6, 6, 0], opacity: 1 } : { opacity: 1, y: 0, x: 0 }}
        transition={shaking ? { duration: 0.45 } : { delay: 0.15 }}
      >
        <p className="secret-gate__hint">{PERSONAL_CONFIG.secretHint}</p>
        <label className="sr-only" htmlFor="secret-code">
          Code secret
        </label>
        <input
          id="secret-code"
          className={`secret-gate__input ${error ? 'is-error' : ''}`}
          inputMode="numeric"
          autoComplete="off"
          placeholder="····"
          maxLength={8}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          aria-invalid={error}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              className="secret-gate__error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Pas encore… repense à ce qu’on partage.
            </motion.p>
          )}
        </AnimatePresence>
        <motion.button
          type="submit"
          className="btn btn--love"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Ouvrir mon cœur
        </motion.button>
      </motion.form>
      )}

      <button type="button" className="btn btn--ghost-dark" onClick={onBack}>
        Revenir
      </button>
    </section>
  );
}
