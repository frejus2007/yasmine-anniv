import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onContinue: () => void;
  onOpen: () => void;
  unlocked: boolean;
};

export function CardScene({ onContinue, onOpen, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!unlocked || open) return;
    setOpen(true);
    onOpen();
  };

  return (
    <section className="scene card-scene">
      <motion.p
        className="scene__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {!unlocked
          ? 'Écoute Lionel d’abord…'
          : open
            ? 'Un petit message pour toi'
            : 'Touche la carte pour l’ouvrir'}
      </motion.p>

      <div className={`greeting-card-stage ${unlocked ? '' : 'is-locked'}`} style={{ perspective: 1200 }}>
        <motion.button
          type="button"
          className={`greeting-card ${open ? 'is-open' : ''}`}
          onClick={handleOpen}
          disabled={!unlocked}
          aria-expanded={open}
          aria-label={open ? 'Carte de vœux ouverte' : 'Ouvrir la carte de vœux'}
          initial={{ rotateY: -8, rotateX: 4, opacity: 0, scale: 0.9 }}
          animate={{
            rotateY: open ? (reduced ? 0 : -12) : 0,
            rotateX: open ? 0 : 2,
            opacity: unlocked ? 1 : 0.45,
            scale: 1,
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          whileHover={unlocked && !open ? { scale: 1.02, rotateY: 4 } : undefined}
        >
          <div className="greeting-card__cover">
            <span className="greeting-card__heart" aria-hidden>
              ♥
            </span>
            <span className="greeting-card__cover-title">Pour Yasmine</span>
            <span className="greeting-card__cover-sub">20 ans</span>
          </div>
          <motion.div
            className="greeting-card__inside"
            initial={false}
            animate={{
              rotateY: open ? 0 : 90,
              opacity: open ? 1 : 0,
            }}
            transition={{ duration: reduced ? 0.3 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="greeting-card__text">
              {PERSONAL_CONFIG.cardMessage.split(' ').map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={open ? { opacity: 0, y: 6 } : false}
                  animate={open ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.045, duration: 0.35 }}
                  style={{ display: 'inline-block', marginRight: '0.28em' }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </motion.button>
      </div>

      {open && (
        <motion.button
          type="button"
          className="btn btn--ghost"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={onContinue}
        >
          Continuer
        </motion.button>
      )}
    </section>
  );
}
