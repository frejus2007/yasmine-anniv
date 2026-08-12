import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onRestart: () => void;
  onFinale: () => void;
  onOpen: () => void;
  unlocked: boolean;
};

type Step = 'closed' | 'shake' | 'break' | 'flap' | 'letter' | 'read';

export function EnvelopeScene({ onRestart, onFinale, onOpen, unlocked }: Props) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>('closed');

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
  };

  const lines = PERSONAL_CONFIG.envelopeMessage.split('\n');

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
            <div className="letter__paper">
              {lines.map((line, i) => (
                <motion.p
                  key={i}
                  className={line ? 'letter__line' : 'letter__gap'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.45 }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
