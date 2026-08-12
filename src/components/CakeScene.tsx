import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  onAllExtinguished: () => void;
  onBlow: () => void;
  unlocked: boolean;
};

const CANDLE_COUNT = 5;

const SPRINKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: 8 + ((i * 17) % 84),
  top: 10 + ((i * 23) % 55),
  rot: (i * 47) % 360,
  hue: i % 3,
}));

const DRIPS = [
  { left: '12%', delay: 0 },
  { left: '28%', delay: 0.4 },
  { left: '47%', delay: 0.15 },
  { left: '63%', delay: 0.55 },
  { left: '78%', delay: 0.25 },
];

export function CakeScene({ onAllExtinguished, onBlow, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(() => Array(CANDLE_COUNT).fill(true));
  const [smokeIds, setSmokeIds] = useState<number[]>([]);
  const [shakeId, setShakeId] = useState<number | null>(null);
  const litCount = lit.filter(Boolean).length;

  const extinguish = (index: number) => {
    if (!lit[index]) return;
    setLit((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setSmokeIds((s) => [...s, index]);
    setShakeId(index);
    onBlow();
    setTimeout(() => setShakeId(null), 420);
    setTimeout(() => {
      setSmokeIds((s) => s.filter((id) => id !== index));
    }, 1100);
  };

  useEffect(() => {
    if (lit.every((v) => !v)) {
      const t = setTimeout(onAllExtinguished, 500);
      return () => clearTimeout(t);
    }
  }, [lit, onAllExtinguished]);

  return (
    <section className="scene cake-scene">
      <motion.p
        className="scene__hint"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {unlocked
          ? 'Clique sur chaque bougie pour l’éteindre'
          : 'Écoute Lionel avant de commencer…'}
      </motion.p>

      <div className={`cake-stage ${unlocked ? '' : 'is-locked'}`}>
        {!reduced && litCount > 0 && (
          <div className="cake-glow" style={{ opacity: 0.25 + litCount * 0.12 }} aria-hidden>
            <span className="cake-glow__core" />
            <span className="cake-glow__ring" />
          </div>
        )}

        <motion.div
          className="cake"
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -8, -2, -7, 0],
                  rotate: [-0.8, 0.6, -0.4, 0.5, -0.8],
                }
          }
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="cake__candles">
            {lit.map((isLit, i) => (
              <motion.button
                key={i}
                type="button"
                className={`candle ${isLit ? 'is-lit' : 'is-out'}`}
                onClick={() => unlocked && extinguish(i)}
                aria-label={isLit ? `Éteindre la bougie ${i + 1}` : `Bougie ${i + 1} éteinte`}
                disabled={!isLit || !unlocked}
                animate={
                  shakeId === i
                    ? { x: [-3, 3, -2, 2, 0], rotate: [-4, 3, -2, 0] }
                    : reduced
                      ? undefined
                      : isLit
                        ? { rotate: [-2.5, 2.5, -1.5, 2, -2.5], y: [0, -1.5, 0] }
                        : { rotate: 0, y: 0 }
                }
                transition={
                  shakeId === i
                    ? { duration: 0.4 }
                    : {
                        duration: 1.8 + i * 0.22,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                whileHover={isLit ? { scale: 1.08 } : undefined}
                whileTap={isLit ? { scale: 0.92 } : undefined}
              >
                <span className="candle__wick" />
                <AnimatePresence>
                  {isLit && (
                    <motion.span
                      className="candle__flame-wrap"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2, y: -8 }}
                    >
                      <motion.span
                        className="candle__flame"
                        animate={
                          reduced
                            ? undefined
                            : {
                                scaleY: [1, 1.22, 0.82, 1.14, 0.95, 1],
                                scaleX: [1, 0.82, 1.18, 0.9, 1.08, 1],
                                rotate: [-5, 6, -4, 5, -2, -5],
                              }
                        }
                        transition={{
                          duration: 0.55 + i * 0.07,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <motion.span
                        className="candle__flame-inner"
                        animate={
                          reduced
                            ? undefined
                            : { scale: [1, 0.85, 1.1, 0.9, 1], opacity: [0.9, 1, 0.75, 1] }
                        }
                        transition={{ duration: 0.4 + i * 0.05, repeat: Infinity }}
                      />
                      {!reduced && (
                        <span className="candle__sparks" aria-hidden>
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
                {smokeIds.includes(i) && (
                  <>
                    <span className="candle__smoke candle__smoke--a" />
                    <span className="candle__smoke candle__smoke--b" />
                  </>
                )}
                <span className="candle__stick" />
              </motion.button>
            ))}
          </div>

          <div className="cake__topping">
            {!reduced &&
              SPRINKLES.map((s) => (
                <motion.span
                  key={s.id}
                  className={`cake__sprinkle cake__sprinkle--${s.hue}`}
                  style={{ left: `${s.left}%`, top: `${s.top}%`, rotate: `${s.rot}deg` }}
                  animate={{ y: [0, -1.5, 0], opacity: [0.75, 1, 0.75] }}
                  transition={{
                    duration: 2.2 + (s.id % 5) * 0.3,
                    repeat: Infinity,
                    delay: s.id * 0.08,
                  }}
                />
              ))}
            {DRIPS.map((d, i) => (
              <span
                key={i}
                className="cake__drip"
                style={{ left: d.left, animationDelay: `${d.delay}s` }}
              />
            ))}
            <motion.span
              className="cake__cherry"
              animate={reduced ? undefined : { y: [0, -3, 0], rotate: [-6, 6, -6] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className="cake__cherry cake__cherry--2"
              animate={reduced ? undefined : { y: [0, -2.5, 0], rotate: [5, -5, 5] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
          </div>

          <motion.div
            className="cake__layer cake__layer--top"
            animate={reduced ? undefined : { scaleX: [1, 1.012, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="cake__cream-wave" />
          </motion.div>
          <motion.div
            className="cake__layer cake__layer--mid"
            animate={reduced ? undefined : { scaleX: [1, 0.99, 1.008, 1] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="cake__layer cake__layer--base"
            animate={reduced ? undefined : { scaleX: [1, 1.01, 1] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <div className="cake__plate" />
          <motion.div
            className="cake__shadow"
            animate={
              reduced
                ? undefined
                : { scaleX: [1, 0.92, 1.02, 0.94, 1], opacity: [0.55, 0.4, 0.5, 0.42, 0.55] }
            }
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {!reduced && litCount > 0 && (
          <div className="cake-embers" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="cake-ember" style={{ ['--i' as string]: i }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
