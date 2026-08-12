import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type FormEvent } from 'react';

type Props = {
  onContinue: () => void;
  onSend: () => void;
  unlocked: boolean;
};

export function WishScene({ onContinue, onSend, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [wish, setWish] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!unlocked || !wish.trim() || sent) return;
    setSent(true);
    onSend();
    setTimeout(onContinue, reduced ? 800 : 2800);
  };

  return (
    <section className="scene wish-scene">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.p
            key="wait"
            className="scene__waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Lionel a quelque chose à te dire…
          </motion.p>
        ) : !sent ? (
          <motion.form
            key="form"
            className="wish-form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -40 }}
          >
            <h2 className="wish-form__title">Fais un vœu, Yasmine</h2>
            <p className="wish-form__sub">Écris-le ici — il s’envolera vers le ciel.</p>
            <label className="sr-only" htmlFor="wish-input">
              Ton vœu
            </label>
            <textarea
              id="wish-input"
              className="wish-form__input"
              rows={3}
              maxLength={180}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Mon vœu pour cette année…"
            />
            <motion.button
              type="submit"
              className="btn btn--primary"
              disabled={!wish.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="btn__shine" />
              Envoyer mon vœu
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="flight"
            className="wish-flight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="wish-flight__envelope"
              initial={{ y: 40, scale: 1, opacity: 1 }}
              animate={{
                y: -220,
                x: [0, 40, -20, 30],
                scale: 0.35,
                opacity: [1, 1, 0.4, 0],
                rotate: [0, -8, 6, -4],
              }}
              transition={{ duration: reduced ? 0.6 : 2.4, ease: 'easeInOut' }}
            />
            <motion.div
              className="wish-flight__constellation"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduced ? 0.2 : 1.6, duration: 0.8 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`wish-star wish-star--${i}`} />
              ))}
              <p>Ton vœu brille maintenant.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
