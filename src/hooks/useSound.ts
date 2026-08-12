import { useCallback, useRef, useState } from 'react';

/** Sons doux générés via Web Audio (pas de fichiers externes). */
export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number, duration = 0.18, type: OscillatorType = 'sine', gain = 0.04) => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') void ctx.resume();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* ignore */
      }
    },
    [enabled, getCtx],
  );

  const playClick = useCallback(() => playTone(520, 0.12, 'triangle', 0.03), [playTone]);
  const playBlow = useCallback(() => playTone(180, 0.35, 'sine', 0.025), [playTone]);
  const playSuccess = useCallback(() => {
    playTone(440, 0.15, 'sine', 0.035);
    setTimeout(() => playTone(660, 0.2, 'sine', 0.03), 120);
  }, [playTone]);
  const playOpen = useCallback(() => playTone(320, 0.4, 'triangle', 0.04), [playTone]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      if (next) {
        try {
          const ctx = getCtx();
          if (ctx.state === 'suspended') void ctx.resume();
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }, [getCtx]);

  return { enabled, toggle, playClick, playBlow, playSuccess, playOpen };
}
