import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  pointer: { x: number; y: number };
  onLeave: () => void;
  onHeartTap: () => void;
};

function seeded(n: number) {
  const x = Math.sin(n * 999.13) * 10000;
  return x - Math.floor(x);
}

type Floater = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
  depth: number;
};

export function LoveUniverseScene({ pointer, onLeave, onHeartTap }: Props) {
  const reduced = useReducedMotion();
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [revealed, setRevealed] = useState(false);

  const floaters = useMemo<Floater[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: seeded(i + 1) * 100,
        size: 14 + seeded(i + 2) * 42,
        delay: seeded(i + 3) * 8,
        duration: 10 + seeded(i + 4) * 14,
        drift: (seeded(i + 5) - 0.5) * 60,
        opacity: 0.2 + seeded(i + 6) * 0.55,
        depth: 0.3 + seeded(i + 7) * 0.7,
      })),
    [],
  );

  const lines = PERSONAL_CONFIG.loveMessage.split('\n');

  const spawnBurst = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setBurstHearts((h) => [...h, { id, x: clientX, y: clientY }]);
    onHeartTap();
    setTimeout(() => {
      setBurstHearts((h) => h.filter((b) => b.id !== id));
    }, 1200);
  };

  const parallaxX = reduced ? 0 : (pointer.x - 0.5) * 30;
  const parallaxY = reduced ? 0 : (pointer.y - 0.5) * 20;

  return (
    <section className="love-universe">
      <div className="love-universe__sky" aria-hidden>
        <div className="love-universe__nebula love-universe__nebula--a" />
        <div className="love-universe__nebula love-universe__nebula--b" />
        <div className="love-universe__nebula love-universe__nebula--c" />
        <div className="love-universe__vignette" />
      </div>

      <motion.div
        className="love-universe__field"
        style={{ x: parallaxX * 0.4, y: parallaxY * 0.4 }}
        aria-hidden
      >
        {floaters.map((f) => (
          <motion.button
            key={f.id}
            type="button"
            className="love-floater"
            style={{
              left: `${f.left}%`,
              fontSize: f.size,
              opacity: f.opacity,
              ['--drift' as string]: `${f.drift}px`,
            }}
            initial={false}
            animate={
              reduced
                ? { y: 0 }
                : {
                    y: [0, -120 - f.depth * 80, -240 - f.depth * 120],
                    x: [0, f.drift * 0.4, f.drift],
                    scale: [1, 1.08 + f.depth * 0.1, 0.95],
                    rotate: [0, -8, 8],
                  }
            }
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            whileHover={{ scale: 1.35, opacity: 1 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              spawnBurst(e.clientX, e.clientY);
            }}
            aria-label="Cœur"
          >
            <motion.span
              animate={
                reduced
                  ? undefined
                  : { scale: [1, 1.18, 0.94, 1.12, 1] }
              }
              transition={{
                duration: 1.6 + (f.id % 5) * 0.2,
                repeat: Infinity,
                times: [0, 0.2, 0.4, 0.65, 1],
                ease: 'easeInOut',
              }}
            >
              ♥
            </motion.span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {burstHearts.map((b) => (
          <span key={b.id} className="love-burst" style={{ left: b.x, top: b.y }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} style={{ ['--a' as string]: `${i * 45}deg` }} />
            ))}
          </span>
        ))}
      </AnimatePresence>

      <div className="love-universe__content">
        <motion.p
          className="love-universe__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Bienvenue dans mon secret
        </motion.p>
        <motion.h2
          className="love-universe__title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {PERSONAL_CONFIG.loveTitle}
        </motion.h2>

        <motion.div
          className="love-universe__pulse"
          animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.25, 1] }}
          aria-hidden
        >
          ♥
        </motion.div>

        {!revealed ? (
          <motion.button
            type="button"
            className="btn btn--love love-universe__reveal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setRevealed(true);
              onHeartTap();
            }}
          >
            Lis ce que je ressens
          </motion.button>
        ) : (
          <motion.article
            className="love-letter"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {lines.map((line, i) => (
              <motion.p
                key={i}
                className={line ? 'love-letter__line' : 'love-letter__gap'}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.55 }}
              >
                {line || '\u00A0'}
              </motion.p>
            ))}
          </motion.article>
        )}

        <motion.button
          type="button"
          className="btn btn--ghost-dark love-universe__leave"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onLeave}
        >
          Revenir doucement
        </motion.button>
      </div>
    </section>
  );
}
