import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onOpenSurprise: () => void;
  onPlayClick: () => void;
  unlocked: boolean;
};

export function IntroScene({ onOpenSurprise, onPlayClick, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'wait' | 'name' | 'title' | 'ready'>('wait');
  const name = 'Yasmine';

  useEffect(() => {
    if (reduced) {
      setPhase('ready');
      return;
    }
    const t1 = setTimeout(() => setPhase('name'), 1400);
    const t2 = setTimeout(() => setPhase('title'), 3200);
    const t3 = setTimeout(() => setPhase('ready'), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduced]);

  return (
    <section className="scene intro">
      <AnimatePresence>
        {phase === 'wait' && (
          <motion.div
            className="intro__wait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="intro__envelope-preview"
              animate={reduced ? undefined : { y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="intro__flap" />
              <div className="intro__body" />
              <div className="intro__seal" />
            </motion.div>
            <p className="intro__wait-text">Une surprise se prépare pour toi…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === 'name' || phase === 'title' || phase === 'ready') && (
        <h1 className="intro__name" aria-label="Yasmine">
          {name.split('').map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="intro__letter"
              initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      )}

      {(phase === 'title' || phase === 'ready') && (
        <motion.h2
          className="intro__greeting"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {PERSONAL_CONFIG.greetingTitle.split(' ').map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="intro__word"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>
      )}

      {phase === 'ready' && unlocked && (
        <motion.div
          className="intro__cta-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="intro__message">{PERSONAL_CONFIG.introMessage}</p>
          <motion.button
            type="button"
            className="btn btn--primary intro__cta"
            onClick={() => {
              onPlayClick();
              onOpenSurprise();
            }}
            animate={reduced ? undefined : { scale: [1, 1.035, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="btn__shine" />
            Ouvrir la surprise
          </motion.button>
        </motion.div>
      )}
      {phase === 'ready' && !unlocked && (
        <motion.p
          className="scene__waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Écoute Lionel en bas à gauche…
        </motion.p>
      )}
    </section>
  );
}
