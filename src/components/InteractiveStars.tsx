import { motion } from 'framer-motion';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onReveal: (text: string) => void;
};

const positions = [
  { top: '18%', left: '12%' },
  { top: '28%', left: '78%' },
  { top: '62%', left: '16%' },
  { top: '70%', left: '72%' },
  { top: '42%', left: '88%' },
];

export function InteractiveStars({ onReveal }: Props) {
  return (
    <div className="stars" aria-hidden={false}>
      {PERSONAL_CONFIG.starCompliments.map((text, i) => (
        <motion.button
          key={i}
          type="button"
          className="star-btn"
          style={positions[i]}
          aria-label="Étoile — révéler un compliment"
          title="Quelqu’un pense à toi"
          whileHover={{ scale: 1.45 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onReveal(text);
          }}
        >
          <span className="star-btn__glow" />
          ✦
        </motion.button>
      ))}
    </div>
  );
}
