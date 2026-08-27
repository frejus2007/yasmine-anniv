import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onRestart: () => void;
  onFinale: () => void;
  onOpen: () => void;
  unlocked: boolean;
};

type Step = 'closed' | 'shake' | 'break' | 'flap' | 'letter' | 'read';
type WritePhase = 'body' | 'name' | 'done';

function WritingHand() {
  return (
    <svg className="letter__hand-svg" viewBox="0 0 72 88" aria-hidden>
      <path
        d="M42 8 L46 2 L49 8 L47 34 L44 34 Z"
        fill="#c9a84a"
        stroke="#7a6230"
        strokeWidth="0.8"
      />
      <path d="M42.5 8 L48.5 8 L47 18 L44 18 Z" fill="#5a4c46" />
      <rect x="43.4" y="18" width="5.2" height="22" rx="1" fill="#2c241f" />
      <path d="M44.2 40 L48 40 L46.1 52 Z" fill="#d8c4a8" stroke="#7a6230" strokeWidth="0.4" />
      <path
        d="M28 48 C26 40 32 36 38 40 C42 32 52 34 54 44 C62 46 66 56 60 64 C70 70 66 84 52 84 C40 86 22 80 20 68 C18 58 24 54 28 48 Z"
        fill="#f0c9b0"
        stroke="#c48a72"
        strokeWidth="1.1"
      />
      <path d="M30 50 C34 44 40 44 42 50" fill="none" stroke="#c48a72" strokeWidth="0.9" />
      <path d="M48 52 C52 48 56 52 56 58" fill="none" stroke="#c48a72" strokeWidth="0.8" />
    </svg>
  );
}

export function EnvelopeScene({ onRestart, onFinale, onOpen, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>('closed');
  const [written, setWritten] = useState(false);

  const openSequence = () => {
    if (!unlocked || step !== 'closed') return;
    onOpen();
    if (reduced) {
      setStep('read');
      return;
    }
    setStep('shake');
    setTimeout(() => setStep('break'), 450);
    setTimeout(() => setStep('flap'), 900);
    setTimeout(() => setStep('letter'), 1500);
    setTimeout(() => setStep('read'), 2100);
  };

  const closeLetter = () => {
    setStep('closed');
    setWritten(false);
  };

  return (
    <section className="scene envelope-scene">
      <AnimatePresence mode="wait">
        {step !== 'read' ? (
          <motion.div
            key="envelope"
            className="envelope-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <p className="scene__hint">
              {unlocked
                ? 'Ouvre l’enveloppe — le sceau attend ton touché'
                : 'Écoute Lionel avant d’ouvrir…'}
            </p>
            <motion.button
              type="button"
              className={`envelope ${step}`}
              onClick={openSequence}
              disabled={!unlocked}
              aria-label="Ouvrir l’enveloppe"
              animate={
                step === 'closed'
                  ? reduced
                    ? undefined
                    : { y: [0, -5, 0] }
                  : step === 'shake'
                    ? { x: [-4, 4, -3, 3, 0], rotate: [-1, 1, -1, 0] }
                    : { y: 0 }
              }
              transition={
                step === 'closed'
                  ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.4 }
              }
            >
              <div className="envelope__back" />
              <motion.div
                className="envelope__paper"
                animate={{
                  y: step === 'letter' ? -48 : 8,
                  opacity: step === 'flap' || step === 'letter' ? 1 : 0.4,
                }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="envelope__flap"
                style={{ transformOrigin: 'top center' }}
                animate={{
                  rotateX: step === 'flap' || step === 'letter' ? 175 : 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="envelope__front" />
              <motion.div
                className={`envelope__seal ${step === 'break' || step === 'flap' || step === 'letter' ? 'is-broken' : ''}`}
                animate={
                  step === 'break'
                    ? { scale: [1, 1.2, 0], opacity: [1, 1, 0], rotate: 25 }
                    : { scale: 1, opacity: step === 'closed' || step === 'shake' ? 1 : 0 }
                }
                transition={{ duration: 0.45 }}
              >
                ♥
              </motion.div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="letter"
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0 }}
          >
            <HandwrittenLetter reduced={!!reduced} onDone={() => setWritten(true)} />
            {written ? (
              <div className="letter__actions">
                <button type="button" className="btn btn--ghost" onClick={closeLetter}>
                  Refermer
                </button>
                <button type="button" className="btn btn--ghost" onClick={onRestart}>
                  Recommencer
                </button>
                <button type="button" className="btn btn--primary" onClick={onFinale}>
                  <span className="btn__shine" />
                  Continuer
                </button>
              </div>
            ) : (
              <p className="letter__hint">
                Une main écrit pour toi… touche la lettre pour aller plus vite.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HandwrittenLetter({
  reduced,
  onDone,
}: {
  reduced: boolean;
  onDone: () => void;
}) {
  const body = PERSONAL_CONFIG.envelopeMessage;
  const name = PERSONAL_CONFIG.authorName;

  const paperRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);

  const [phase, setPhase] = useState<WritePhase>(reduced ? 'done' : 'body');
  const [shown, setShown] = useState(reduced ? body.length : 0);
  const [nameShown, setNameShown] = useState(reduced ? name.length : 0);
  const [hand, setHand] = useState({ x: 36, y: 48, show: !reduced });

  const markDone = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setShown(body.length);
    setNameShown(name.length);
    setPhase('done');
    setHand((h) => ({ ...h, show: false }));
    onDone();
  };

  useEffect(() => {
    if (reduced) onDone();
  }, [reduced, onDone]);

  useEffect(() => {
    if (phase !== 'body' || doneRef.current) return;
    if (shown >= body.length) {
      const t = setTimeout(() => setPhase('name'), 500);
      return () => clearTimeout(t);
    }
    const ch = body[shown];
    const delay = ch === '\n' ? 260 : ch === '.' || ch === '!' ? 120 : ch === ' ' ? 28 : 32;
    const t = setTimeout(() => setShown((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [phase, shown, body]);

  useEffect(() => {
    if (phase !== 'name' || doneRef.current) return;
    if (nameShown >= name.length) {
      const t = setTimeout(() => markDone(), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setNameShown((n) => n + 1), 90);
    return () => clearTimeout(t);
  }, [phase, nameShown, name]);

  useLayoutEffect(() => {
    if (!hand.show || !paperRef.current || !caretRef.current) return;
    const paper = paperRef.current.getBoundingClientRect();
    const caret = caretRef.current.getBoundingClientRect();
    setHand((prev) => ({
      ...prev,
      x: caret.left - paper.left + paperRef.current!.scrollLeft,
      y: caret.top - paper.top + paperRef.current!.scrollTop,
    }));
  }, [shown, nameShown, phase, hand.show]);

  useEffect(() => {
    const el = paperRef.current;
    if (!el || phase === 'done') return;
    const caret = caretRef.current;
    if (!caret) return;
    const caretTop = caret.offsetTop;
    const view = el.clientHeight;
    if (caretTop > el.scrollTop + view - 80) {
      el.scrollTo({ top: caretTop - view + 120, behavior: 'smooth' });
    }
  }, [shown, nameShown, phase]);

  return (
    <div
      className="letter__paper letter__paper--hand"
      ref={paperRef}
      onClick={() => {
        if (phase !== 'done') markDone();
      }}
      role="article"
    >
      <p className="letter__handwriting">
        {body.slice(0, shown)}
        {phase === 'body' && <span ref={caretRef} className="letter__caret" />}
      </p>

      {(phase === 'name' || phase === 'done') && (
        <p className="letter__from-name">
          {name.slice(0, nameShown)}
          {phase === 'name' && <span ref={caretRef} className="letter__caret" />}
        </p>
      )}

      {hand.show && phase !== 'done' && (
        <div className="letter__hand" style={{ left: hand.x, top: hand.y }}>
          <WritingHand />
        </div>
      )}
    </div>
  );
}
