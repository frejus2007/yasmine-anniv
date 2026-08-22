import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PERSONAL_CONFIG } from '../config';
import { celebrateGoldenSky, starSparkAt } from '../lib/confetti';

type Props = {
  unlocked: boolean;
  onContinue: () => void;
  onStarTap?: () => void;
};

type Phase = 'entering' | 'exploring' | 'awakening' | 'revealed';

export function NightSkyScene({ unlocked, onContinue, onStarTap }: Props) {
  const reduced = useReducedMotion();
  const sky = PERSONAL_CONFIG.nightSky;
  const total = sky.stars.length;

  const [phase, setPhase] = useState<Phase>(reduced ? 'exploring' : 'entering');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [visibleLinks, setVisibleLinks] = useState(0);

  const starMap = useMemo(
    () => Object.fromEntries(sky.stars.map((s) => [s.id, s])),
    [sky.stars],
  );

  const activeStar = activeId ? starMap[activeId] : null;
  const allVisited = visited.size >= total;
  const progress = visited.size;

  useEffect(() => {
    if (reduced || !unlocked) return;
    const t = setTimeout(() => setPhase('exploring'), 3200);
    return () => clearTimeout(t);
  }, [reduced, unlocked]);

  useEffect(() => {
    if (!allVisited || !unlocked || phase === 'revealed' || phase === 'awakening') return;
    setPhase('awakening');
    setActiveId(null);

    if (reduced) {
      setVisibleLinks(sky.constellationLinks.length);
      setTimeout(() => {
        celebrateGoldenSky();
        setPhase('revealed');
      }, 800);
      return;
    }

    sky.constellationLinks.forEach((_, i) => {
      setTimeout(() => setVisibleLinks(i + 1), 400 + i * 350);
    });

    const revealAt = 400 + sky.constellationLinks.length * 350 + 900;
    setTimeout(() => {
      celebrateGoldenSky();
      setPhase('revealed');
    }, revealAt);
  }, [allVisited, unlocked, phase, reduced, sky.constellationLinks]);

  const openStar = useCallback(
    (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
      if (!unlocked || phase === 'entering' || phase === 'awakening') return;
      if (visited.has(id)) {
        setActiveId(id);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      starSparkAt(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight,
      );
      onStarTap?.();
      setActiveId(id);
      setVisited((prev) => new Set(prev).add(id));
    },
    [unlocked, phase, visited, onStarTap],
  );

  return (
    <section className="scene night-sky">
      <div className="night-sky__canvas" aria-hidden>
        <div className="night-sky__gradient" />
        <div className="night-sky__aurora night-sky__aurora--a" />
        <div className="night-sky__aurora night-sky__aurora--b" />
        {!reduced && (
          <>
            {Array.from({ length: 55 }).map((_, i) => (
              <span
                key={`d-${i}`}
                className="night-sky__dust"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 23) % 100}%`,
                  animationDelay: `${(i % 8) * 0.4}s`,
                }}
              />
            ))}
            <span className="night-sky__shooter night-sky__shooter--1" />
            <span className="night-sky__shooter night-sky__shooter--2" />
            <span className="night-sky__shooter night-sky__shooter--3" />
          </>
        )}
      </div>

      <AnimatePresence>
        {phase === 'entering' && unlocked && (
          <motion.div
            className="night-sky__curtain"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.p
              className="night-sky__whisper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {sky.entryWhisper}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="night-sky__header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: phase === 'entering' ? 0 : 1, y: 0 }}
        transition={{ delay: phase === 'entering' ? 0 : 0.2 }}
      >
        <p className="night-sky__eyebrow">{sky.subtitle}</p>
        <h2 className="night-sky__title">{sky.title}</h2>
        <p className="night-sky__lead">
          {!unlocked
            ? 'Écoute Lionel d’abord…'
            : phase === 'revealed'
              ? sky.surpriseTitle
              : sky.lead}
        </p>
        {unlocked && phase !== 'entering' && phase !== 'revealed' && (
          <div className="night-sky__progress" aria-label={`${progress} sur ${total} étoiles`}>
            <div className="night-sky__progress-track">
              <motion.div
                className="night-sky__progress-fill"
                animate={{ width: `${(progress / total) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="night-sky__progress-label">
              {progress}/{total} étoiles
            </span>
          </div>
        )}
      </motion.div>

      <div
        className={`night-sky__map ${unlocked && phase !== 'entering' ? '' : 'is-locked'} ${phase === 'awakening' || phase === 'revealed' ? 'is-awake' : ''}`}
      >
        <svg className="night-sky__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff8e8" />
              <stop offset="50%" stopColor="#c9a84a" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
          </defs>
          {sky.constellationLinks.slice(0, visibleLinks).map(([from, to]) => {
            const a = starMap[from];
            const b = starMap[to];
            if (!a || !b) return null;
            return (
              <line
                key={`${from}-${to}`}
                className="night-sky__line"
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#lineGrad)"
                strokeWidth="0.35"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {sky.stars.map((star, i) => {
          const isActive = activeId === star.id;
          const isVisited = visited.has(star.id);
          const showStar =
            phase !== 'entering' || reduced;
          if (!showStar) return null;

          return (
            <motion.button
              key={star.id}
              type="button"
              className={`night-sky__star ${isActive ? 'is-active' : ''} ${isVisited ? 'is-visited' : ''} ${!isVisited && unlocked ? 'is-waiting' : ''}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                ['--sz' as string]: `${star.size}`,
                ['--i' as string]: i,
              }}
              onClick={(e) => openStar(star.id, e)}
              disabled={!unlocked || phase === 'awakening'}
              aria-label={star.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: phase === 'awakening' || phase === 'revealed' ? [1, 1.15, 1] : 1,
              }}
              transition={{
                delay: reduced ? 0 : 0.15 + i * 0.1,
                type: 'spring',
                stiffness: 140,
                scale:
                  phase === 'awakening'
                    ? { duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }
                    : undefined,
              }}
              whileHover={unlocked && phase === 'exploring' ? { scale: 1.25 } : undefined}
            >
              {!isVisited && unlocked && phase === 'exploring' && (
                <span className="night-sky__star-pulse" aria-hidden />
              )}
              <span className="night-sky__star-core" />
              <span className="night-sky__star-ring" />
              {isVisited && <span className="night-sky__star-check">✦</span>}
            </motion.button>
          );
        })}

        <motion.div
          className="night-sky__center"
          animate={
            phase === 'revealed'
              ? { scale: [1, 1.2, 1.08], opacity: 1 }
              : { scale: 1, opacity: allVisited ? 1 : 0.55 }
          }
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="night-sky__moon" aria-hidden>
            {phase === 'revealed' ? 'Y' : '13·09'}
          </span>
          {phase === 'revealed' && (
            <motion.span
              className="night-sky__name-glow"
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.22em' }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              YASMINE
            </motion.span>
          )}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {activeStar && phase !== 'awakening' && (
          <motion.div
            key={activeStar.id}
            className="night-sky__card"
            initial={{ opacity: 0, y: 20, scale: 0.92, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            role="status"
          >
            <span className="night-sky__card-spark" aria-hidden>
              ✦
            </span>
            <p className="night-sky__card-label">{activeStar.label}</p>
            <p className="night-sky__card-text">{activeStar.message}</p>
            <button
              type="button"
              className="btn btn--ghost night-sky__card-close"
              onClick={() => setActiveId(null)}
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            className="night-sky__surprise"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="night-sky__surprise-title">{sky.surpriseTitle}</p>
            {sky.surpriseMessage.split('\n').map((line, i) => (
              <motion.p
                key={i}
                className="night-sky__surprise-line"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                {line || '\u00A0'}
              </motion.p>
            ))}
            <motion.button
              type="button"
              className="btn btn--gold night-sky__continue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
            >
              {sky.surpriseCta}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
