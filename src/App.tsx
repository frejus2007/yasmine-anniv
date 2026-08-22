import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { CakeScene } from './components/CakeScene';
import { CardScene } from './components/CardScene';
import { EnvelopeScene } from './components/EnvelopeScene';
import { FinaleScene } from './components/FinaleScene';
import { GuideBuddy } from './components/GuideBuddy';
import { InteractiveStars } from './components/InteractiveStars';
import { IntroScene } from './components/IntroScene';
import { LionelIntroScene } from './components/LionelIntroScene';
import { NightSkyScene } from './components/NightSkyScene';
import { OptionalMessageScene } from './components/OptionalMessageScene';
import { SoundToggle } from './components/SoundToggle';
import { WishScene } from './components/WishScene';
import { PERSONAL_CONFIG, type Scene } from './config';
import { useSound } from './hooks/useSound';
import { celebrateBurst, celebrateWaves, petalBurst } from './lib/confetti';
import './App.css';

function CelebrationMoment({
  unlocked,
  onDone,
}: {
  unlocked: boolean;
  onDone: () => void;
}) {
  return (
    <motion.section
      className="scene celebration-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2
        className="celebration__title"
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Fais un vœu, Yasmine
      </motion.h2>
      {unlocked ? (
        <motion.button
          type="button"
          className="btn btn--primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onDone}
        >
          <span className="btn__shine" />
          Continuer
        </motion.button>
      ) : (
        <motion.p className="scene__waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Confirme auprès de Lionel…
        </motion.p>
      )}
    </motion.section>
  );
}

export default function App() {
  const [scene, setScene] = useState<Scene>('lionel-intro');
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [compliment, setCompliment] = useState<string | null>(null);
  const [guideConfirmed, setGuideConfirmed] = useState(false);
  const sound = useSound();

  const isNightSky = scene === 'night-sky';
  const showGuide = scene !== 'lionel-intro';
  const go = useCallback((next: Scene) => {
    setGuideConfirmed(false);
    setScene(next);
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    setPointer({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  const onBackgroundClick = (e: React.MouseEvent) => {
    if (isNightSky || scene === 'lionel-intro') return;
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    petalBurst(x, y);
  };

  const restart = () => {
    setCompliment(null);
    setGuideConfirmed(false);
    setScene('lionel-intro');
  };

  return (
    <div
      className={`app ${isNightSky ? 'app--night' : ''} ${scene === 'lionel-intro' ? 'app--lionel' : ''}`}
      onPointerMove={onPointerMove}
    >
      {!isNightSky && (
        <AmbientBackground pointer={pointer} onBackgroundClick={onBackgroundClick} />
      )}

      <header className={`topbar ${isNightSky ? 'topbar--night' : ''}`}>
        <div className="brand">
          <motion.span
            className="brand__heart"
            animate={{ scale: [1, 1.18, 0.95, 1.12, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.18, 0.35, 0.55, 1] }}
            aria-hidden
          >
            ♥
          </motion.span>
          <div>
            <p className="brand__name">
              {scene === 'lionel-intro'
                ? PERSONAL_CONFIG.guideName
                : isNightSky
                  ? '13 septembre'
                  : 'Pour Yasmine'}
            </p>
            <motion.p
              className="brand__sub"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {scene === 'lionel-intro'
                ? 'ton guide pour cette aventure'
                : isNightSky
                  ? 'la nuit de notre jour'
                  : '20 ans · un petit univers cadeau'}
            </motion.p>
          </div>
        </div>
        <SoundToggle enabled={sound.enabled} onToggle={sound.toggle} />
      </header>

      {(scene === 'finale' || scene === 'envelope' || scene === 'card') && (
        <InteractiveStars
          onReveal={(text) => {
            setCompliment(text);
            sound.playClick();
            setTimeout(() => setCompliment(null), 3200);
          }}
        />
      )}

      {showGuide && (
        <GuideBuddy
          scene={scene}
          dark={isNightSky}
          confirmed={guideConfirmed}
          onConfirm={() => {
            sound.playClick();
            setGuideConfirmed(true);
          }}
        />
      )}

      <main className={`stage ${isNightSky ? 'stage--night' : ''}`}>
        <AnimatePresence mode="wait">
          {scene === 'lionel-intro' && (
            <motion.div
              key="lionel-intro"
              className="stage__panel stage__panel--wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7 }}
            >
              <LionelIntroScene
                onReady={() => {
                  sound.playSuccess();
                  go('intro');
                }}
              />
            </motion.div>
          )}

          {scene === 'intro' && (
            <motion.div
              key="intro"
              className="stage__panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
              transition={{ duration: 0.7 }}
            >
              <IntroScene
                unlocked={guideConfirmed}
                onPlayClick={sound.playClick}
                onOpenSurprise={() => {
                  celebrateBurst({ x: 0.5, y: 0.4 });
                  setTimeout(() => celebrateBurst({ x: 0.22, y: 0.36 }), 260);
                  setTimeout(() => celebrateBurst({ x: 0.78, y: 0.34 }), 480);
                  setTimeout(() => celebrateBurst({ x: 0.4, y: 0.48 }), 700);
                  sound.playSuccess();
                  setTimeout(() => go('cake'), 1100);
                }}
              />
            </motion.div>
          )}

          {scene === 'cake' && (
            <motion.div
              key="cake"
              className="stage__panel"
              initial={{ opacity: 0, scale: 0.92, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <CakeScene
                unlocked={guideConfirmed}
                onBlow={sound.playBlow}
                onAllExtinguished={() => {
                  celebrateWaves();
                  sound.playSuccess();
                  go('celebration');
                }}
              />
            </motion.div>
          )}

          {scene === 'celebration' && (
            <motion.div
              key="celebration"
              className="stage__panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CelebrationMoment unlocked={guideConfirmed} onDone={() => go('wish')} />
            </motion.div>
          )}

          {scene === 'wish' && (
            <motion.div
              key="wish"
              className="stage__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <WishScene
                unlocked={guideConfirmed}
                onSend={sound.playOpen}
                onContinue={() => go('card')}
              />
            </motion.div>
          )}

          {scene === 'card' && (
            <motion.div
              key="card"
              className="stage__panel"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <CardScene
                unlocked={guideConfirmed}
                onOpen={sound.playOpen}
                onContinue={() => go('envelope')}
              />
            </motion.div>
          )}

          {scene === 'envelope' && (
            <motion.div
              key="envelope"
              className="stage__panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EnvelopeScene
                unlocked={guideConfirmed}
                onOpen={sound.playOpen}
                onRestart={restart}
                onFinale={() => go('night-sky')}
              />
            </motion.div>
          )}

          {scene === 'night-sky' && (
            <motion.div
              key="night-sky"
              className="stage__panel stage__panel--full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 1 }}
            >
              <NightSkyScene
                unlocked={guideConfirmed}
                onStarTap={sound.playClick}
                onContinue={() => go('reply')}
              />
            </motion.div>
          )}

          {scene === 'reply' && (
            <motion.div
              key="reply"
              className="stage__panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <OptionalMessageScene onDone={() => go('finale')} />
            </motion.div>
          )}

          {scene === 'finale' && (
            <motion.div
              key="finale"
              className="stage__panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <FinaleScene
                unlocked={guideConfirmed}
                onReplayIntro={restart}
                compliment={compliment}
                onDismissCompliment={() => setCompliment(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {compliment && scene !== 'finale' && (
        <motion.div
          className="compliment-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={compliment}
        >
          {compliment}
        </motion.div>
      )}
    </div>
  );
}
