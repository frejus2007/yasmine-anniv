import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PERSONAL_CONFIG } from '../config';
import { LionelAvatar } from './LionelAvatar';

type Props = {
  onReady: () => void;
};

/** Présentation lente et posée : Lionel apparaît, puis parle phrase après phrase. */
export function LionelIntroScene({ onReady }: Props) {
  const reduced = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCta, setShowCta] = useState(false);

  const lines = [
    PERSONAL_CONFIG.lionelIntro.hello,
    PERSONAL_CONFIG.lionelIntro.role,
    PERSONAL_CONFIG.lionelIntro.ask,
  ];

  useEffect(() => {
    if (reduced) {
      setVisibleLines(lines.length);
      setShowCta(true);
      return;
    }

    // Silence après l’arrivée, puis chaque phrase avec le temps de la lire.
    const timers = [
      setTimeout(() => setVisibleLines(1), 2800),
      setTimeout(() => setVisibleLines(2), 7000),
      setTimeout(() => setVisibleLines(3), 11800),
      setTimeout(() => setShowCta(true), 14500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reduced, lines.length]);

  return (
    <section className="scene lionel-intro">
      <motion.div
        className="lionel-intro__spot"
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="lionel-intro__glow"
          animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <LionelAvatar size="lg" />
      </motion.div>

      <div className="lionel-intro__dialogue" aria-live="polite">
        <div className="lionel-intro__lines">
          {lines.map((line, i) =>
            visibleLines > i ? (
              <motion.p
                key={i}
                className="lionel-intro__line"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.p>
            ) : null,
          )}
        </div>
        <motion.p
          className="lionel-intro__name"
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleLines > 0 ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {PERSONAL_CONFIG.guideName}
        </motion.p>
      </div>

      {showCta && (
        <motion.button
          type="button"
          className="btn btn--primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReady}
        >
          <span className="btn__shine" />
          Oui, j’arrive avec toi
        </motion.button>
      )}
    </section>
  );
}
