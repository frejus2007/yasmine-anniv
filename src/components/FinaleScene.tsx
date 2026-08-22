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
    <section className="scene finale-scene" style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow for elegance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showPhoto ? 0.35 : 0 }}
        transition={{ duration: 3 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150vh',
          height: '150vh',
          background: 'radial-gradient(circle, rgba(255,190,200,0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {showPhoto && (
        <motion.figure
          style={{
            position: 'relative',
            width: '90vw',
            maxWidth: '480px',
            aspectRatio: '3/4',
            margin: '0 auto 2.5rem',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            zIndex: 1
          }}
          initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <motion.img
              src={photo.src}
              alt={photo.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: photoReady ? 1 : 0,
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: photoReady ? 1 : 1.1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              loading="eager"
              decoding="async"
              onLoad={() => setPhotoReady(true)}
              onError={() => setPhotoFailed(true)}
            />
            {/* Elegant overlay gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%)',
              pointerEvents: 'none'
            }} />
            
            <motion.figcaption
              style={{
                position: 'absolute',
                bottom: '32px',
                left: '32px',
                right: '32px',
                textAlign: 'left',
                color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: photoReady ? 1 : 0, y: photoReady ? 0 : 20 }}
              transition={{ delay: 1.2, duration: 1.2 }}
            >
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 300, letterSpacing: '3px', marginBottom: '8px' }}>
                {photo.word}
              </span>
              <span style={{ display: 'block', fontSize: '1rem', opacity: 0.8, fontStyle: 'italic', fontWeight: 300 }}>
                {photo.caption}
              </span>
            </motion.figcaption>
          </div>
        </motion.figure>
      )}

      <div style={{ zIndex: 1, textAlign: 'center' }}>
        <motion.h2
          className="finale__title"
          style={{ fontSize: '2.2rem', fontWeight: 300, margin: '0 0 12px 0', letterSpacing: '1px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: showPhoto ? 1.8 : 0 }}
        >
          Merci d’être toi, Yasmine
        </motion.h2>
        <motion.p
          className="finale__sub"
          style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '20px', fontWeight: 300 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: showPhoto ? 2.4 : 0.4 }}
        >
          — {PERSONAL_CONFIG.authorName}
        </motion.p>

        {!unlocked && (
          <motion.p
            className="scene__waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Lionel a un dernier mot pour toi…
          </motion.p>
        )}

        <motion.button
          type="button"
          className="btn btn--ghost"
          style={{ marginTop: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1.5 }}
          onClick={onReplayIntro}
        >
          Rejouer l’introduction
        </motion.button>
      </div>

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
