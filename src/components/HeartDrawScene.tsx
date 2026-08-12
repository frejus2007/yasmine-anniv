import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  onComplete: () => void;
  unlocked: boolean;
};

/** Cœur SVG qui se dessine après confirmation de Lionel. */
export function HeartDrawScene({ onComplete, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'draw' | 'fill' | 'pulse' | 'done'>('idle');

  useEffect(() => {
    if (!unlocked) {
      setPhase('idle');
      return;
    }
    if (reduced) {
      setPhase('done');
      const t = setTimeout(onComplete, 900);
      return () => clearTimeout(t);
    }
    setPhase('draw');
    const t1 = setTimeout(() => setPhase('fill'), 3200);
    const t2 = setTimeout(() => setPhase('pulse'), 4200);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 5600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [unlocked, reduced, onComplete]);

  return (
    <section className="scene heart-draw" aria-label="Un cœur se dessine">
      <motion.p
        className="heart-draw__caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {!unlocked ? 'Lionel te dit au revoir…' : 'Avant d’ouvrir la porte…'}
      </motion.p>

      {unlocked && (
        <div className="heart-draw__stage">
          <svg
            className={`heart-draw__svg is-${phase}`}
            viewBox="0 0 200 180"
            aria-hidden
          >
            <defs>
              <linearGradient id="heartFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8aa3" />
                <stop offset="55%" stopColor="#ff4d7a" />
                <stop offset="100%" stopColor="#c9184a" />
              </linearGradient>
              <filter id="heartGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              className="heart-draw__path"
              d="M100 158 C100 158 20 110 20 62 C20 34 42 22 62 22 C80 22 93 34 100 48 C107 34 120 22 138 22 C158 22 180 34 180 62 C180 110 100 158 100 158 Z"
              fill="none"
              stroke="url(#heartFill)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#heartGlow)"
              pathLength={1}
            />

            <motion.path
              d="M100 158 C100 158 20 110 20 62 C20 34 42 22 62 22 C80 22 93 34 100 48 C107 34 120 22 138 22 C158 22 180 34 180 62 C180 110 100 158 100 158 Z"
              fill="url(#heartFill)"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: phase === 'fill' || phase === 'pulse' || phase === 'done' ? 1 : 0,
                scale: phase === 'pulse' || phase === 'done' ? [1, 1.06, 1] : 0.92,
              }}
              transition={
                phase === 'pulse'
                  ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.9 }
              }
              style={{ transformOrigin: '100px 90px' }}
              filter="url(#heartGlow)"
            />
          </svg>

          <motion.p
            className="heart-draw__sub"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'fill' || phase === 'pulse' || phase === 'done' ? 1 : 0,
            }}
          >
            {phase === 'pulse' || phase === 'done'
              ? 'Le monde s’ouvre…'
              : 'Trait après trait…'}
          </motion.p>
        </div>
      )}
    </section>
  );
}
