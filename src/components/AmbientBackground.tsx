import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, type MouseEvent } from 'react';

type Props = {
  pointer: { x: number; y: number };
  onBackgroundClick?: (e: MouseEvent) => void;
};

function rand(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function AmbientBackground({ pointer, onBackgroundClick }: Props) {
  const reduced = useReducedMotion();
  const dust = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: rand(i + 1) * 100,
        top: rand(i + 2) * 100,
        size: 2 + rand(i + 3) * 4,
        delay: rand(i + 4) * 8,
        duration: 10 + rand(i + 5) * 14,
      })),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: rand(i + 20) * 100,
        delay: rand(i + 21) * 12,
        duration: 16 + rand(i + 22) * 10,
        rotate: rand(i + 23) * 360,
      })),
    [],
  );

  const parallaxX = reduced ? 0 : (pointer.x - 0.5) * 18;
  const parallaxY = reduced ? 0 : (pointer.y - 0.5) * 12;

  return (
    <div className="ambient" onClick={onBackgroundClick} aria-hidden>
      <div className="ambient__texture" />
      <motion.div
        className="ambient__layer ambient__layer--far"
        style={{ x: parallaxX * 0.35, y: parallaxY * 0.35 }}
      >
        {!reduced &&
          dust.map((d) => (
            <span
              key={d.id}
              className="ambient__dust"
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
              }}
            />
          ))}
      </motion.div>
      <motion.div
        className="ambient__layer ambient__layer--near"
        style={{ x: parallaxX * 0.7, y: parallaxY * 0.7 }}
      >
        {!reduced &&
          petals.map((p) => (
            <span
              key={p.id}
              className="ambient__petal"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                ['--rot' as string]: `${p.rotate}deg`,
              }}
            />
          ))}
      </motion.div>
      <div className="ambient__halo ambient__halo--a" />
      <div className="ambient__halo ambient__halo--b" />
    </div>
  );
}
