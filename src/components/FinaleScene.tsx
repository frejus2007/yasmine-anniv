import { motion } from 'framer-motion';
import { useState } from 'react';
import { PERSONAL_CONFIG } from '../config';

type Props = {
  onReplayIntro: () => void;
  compliment: string | null;
  onDismissCompliment: () => void;
  unlocked: boolean;
};

export function FinaleScene({
  onReplayIntro,
  compliment,
  onDismissCompliment,
  unlocked,
}: Props) {
  const photo = PERSONAL_CONFIG.finalePhoto;
  const [photoReady, setPhotoReady] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = unlocked && !photoFailed;

  return (
    <section className="scene finale-scene">
      {showPhoto && (
        <motion.figure
          className="finale__portrait"
          initial={{ opacity: 0, y: 28, rotate: -2, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`finale__portrait-frame ${photoReady ? 'is-ready' : 'is-loading'}`}>
            <img
              className="finale__portrait-img"
              src={photo.src}
              alt={photo.alt}
              loading="eager"
              decoding="async"
              onLoad={() => setPhotoReady(true)}
              onError={() => setPhotoFailed(true)}
            />
            <span className="finale__portrait-shine" aria-hidden />
          </div>
          <motion.figcaption
            className="finale__portrait-caption"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: photoReady ? 1 : 0.4, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="finale__portrait-word">{photo.word}</span>
            <span className="finale__portrait-note">{photo.caption}</span>
          </motion.figcaption>
        </motion.figure>
      )}

      <motion.h2
        className="finale__title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: showPhoto ? 0.35 : 0 }}
      >
        Merci d’être toi, Yasmine
      </motion.h2>
      <motion.p
        className="finale__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: showPhoto ? 0.55 : 0.4 }}
      >
        — {PERSONAL_CONFIG.authorName}
      </motion.p>

      {!unlocked ? (
        <motion.p
          className="scene__waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Lionel a un dernier mot pour toi…
        </motion.p>
      ) : (
        <motion.p
          className="finale__closing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showPhoto ? 0.75 : 0.6 }}
        >
          Garde cette nuit du 13 septembre quelque part en toi. ✦
        </motion.p>
      )}

      <motion.button
        type="button"
        className="btn btn--ghost"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onReplayIntro}
      >
        Rejouer l’introduction
      </motion.button>

      {compliment && (
        <motion.button
          type="button"
          className="compliment-toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={onDismissCompliment}
        >
          {compliment}
        </motion.button>
      )}
    </section>
  );
}
