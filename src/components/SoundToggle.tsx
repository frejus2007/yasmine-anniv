import { motion } from 'framer-motion';

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`sound-toggle ${enabled ? 'is-on' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Couper le son' : 'Activer le son'}
    >
      <motion.span
        className="sound-toggle__icon"
        animate={enabled ? { rotate: [0, 8, -8, 0] } : { rotate: 0 }}
        transition={
          enabled
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        {enabled ? '♪' : '🔇'}
      </motion.span>
      <span className="sound-toggle__label">{enabled ? 'Son' : 'Muet'}</span>
    </button>
  );
}
