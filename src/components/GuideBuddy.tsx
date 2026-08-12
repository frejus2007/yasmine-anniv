import { AnimatePresence, motion } from 'framer-motion';
import { PERSONAL_CONFIG, type GuideLineScene, type Scene } from '../config';
import { LionelAvatar } from './LionelAvatar';

type Props = {
  scene: Scene;
  dark?: boolean;
  confirmed: boolean;
  onConfirm: () => void;
};

export function GuideBuddy({ scene, dark, confirmed, onConfirm }: Props) {
  const lineKey = scene as GuideLineScene;
  if (!(lineKey in PERSONAL_CONFIG.guideLines)) return null;

  const line = PERSONAL_CONFIG.guideLines[lineKey];
  const farewell = scene === 'heart-draw';

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={scene}
        className={`guide ${dark ? 'guide--dark' : ''} ${farewell ? 'guide--farewell' : ''}`}
        initial={{ opacity: 0, y: 24, x: -12 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        aria-live="polite"
      >
        <LionelAvatar size="sm" farewell={farewell} />
        <div className="guide__bubble">
          <p className="guide__name">{PERSONAL_CONFIG.guideName}</p>
          <p className="guide__text">{line}</p>
          {!confirmed && (
            <motion.button
              type="button"
              className="guide__confirm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              onClick={onConfirm}
            >
              C’est compris
            </motion.button>
          )}
          {confirmed && (
            <motion.p
              className="guide__ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              À toi maintenant ↓
            </motion.p>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
