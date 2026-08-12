import { motion } from 'framer-motion';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  farewell?: boolean;
  waving?: boolean;
};

export function LionelAvatar({ size = 'md', farewell, waving = true }: Props) {
  const bobDuration = size === 'lg' ? 4.2 : 2.4;
  const waveDuration = size === 'lg' ? 2.8 : 1.6;

  return (
    <div className={`lionel lionel--${size}`} aria-hidden>
      <motion.div
        className="lionel__body"
        animate={{ y: [0, size === 'lg' ? -3 : -5, 0] }}
        transition={{ duration: bobDuration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="lionel__face">
          <i className={`lionel__eye ${farewell ? 'is-sad' : ''}`} />
          <i className={`lionel__eye ${farewell ? 'is-sad' : ''}`} />
          <motion.span
            className={`lionel__mouth ${farewell ? 'is-sad' : ''}`}
            animate={farewell ? { scaleX: [1, 0.75, 1] } : { scaleX: [1, 1.08, 1] }}
            transition={{ duration: size === 'lg' ? 3.4 : 2.2, repeat: Infinity }}
          />
        </span>
        <span className="lionel__scarf" />
        <span className="lionel__badge">L</span>
      </motion.div>
      {waving && (
        <motion.span
          className="lionel__hand"
          animate={{ rotate: farewell ? [-6, -12, -6] : [0, size === 'lg' ? 10 : 18, 0] }}
          transition={{ duration: waveDuration, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
