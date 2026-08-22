import confetti, { type Shape } from 'canvas-confetti';

const soft = ['#D48C94', '#E8D5C8', '#F9ECEE', '#F4EBE1', '#FDFBF7', '#c9a88a'];
const firework = ['#ff6b8a', '#ffd4a8', '#fff1c9', '#ff9eb5', '#e8b4bc', '#ffe8f0', '#f0c27a'];

function shootStar(x: number, y: number, colors: string[]) {
  const defaults = {
    origin: { x, y },
    colors,
    disableForReducedMotion: true,
  };

  confetti({
    ...defaults,
    particleCount: 28,
    spread: 360,
    startVelocity: 28,
    scalar: 0.85,
    ticks: 90,
    gravity: 0.95,
    shapes: ['circle'] as Shape[],
  });
  confetti({
    ...defaults,
    particleCount: 18,
    spread: 360,
    startVelocity: 42,
    scalar: 1.05,
    ticks: 120,
    gravity: 1.05,
    shapes: ['star'] as Shape[],
  });
  confetti({
    ...defaults,
    particleCount: 12,
    spread: 360,
    startVelocity: 18,
    scalar: 0.55,
    ticks: 160,
    gravity: 0.55,
    drift: (Math.random() - 0.5) * 0.6,
    shapes: ['circle'] as Shape[],
  });
}

/** Feux d’artifice : fusées qui montent puis explosent en étoiles. */
export function celebrateBurst(origin?: { x: number; y: number }) {
  const x = origin?.x ?? 0.5;
  const y = origin?.y ?? 0.42;

  // Traînée de fusée
  confetti({
    particleCount: 8,
    angle: 90,
    spread: 12,
    startVelocity: 55,
    origin: { x, y: Math.min(0.92, y + 0.35) },
    colors: ['#fff6e8', '#ffd4a8', '#D48C94'],
    shapes: ['circle'],
    scalar: 0.45,
    gravity: 1.2,
    ticks: 40,
    disableForReducedMotion: true,
  });

  setTimeout(() => shootStar(x, y, firework), 180);
}

/** Salve de feux d’artifice en plusieurs points du ciel. */
export function celebrateWaves() {
  const bursts = [
    { x: 0.2, y: 0.35, delay: 0 },
    { x: 0.5, y: 0.28, delay: 220 },
    { x: 0.78, y: 0.38, delay: 420 },
    { x: 0.35, y: 0.45, delay: 650 },
    { x: 0.65, y: 0.32, delay: 880 },
    { x: 0.5, y: 0.4, delay: 1100 },
  ];

  bursts.forEach(({ x, y, delay }) => {
    setTimeout(() => {
      confetti({
        particleCount: 6,
        angle: 90,
        spread: 10,
        startVelocity: 60,
        origin: { x, y: 0.95 },
        colors: ['#fff8f0', '#ffc9a8'],
        shapes: ['circle'],
        scalar: 0.4,
        ticks: 45,
        gravity: 1.1,
        disableForReducedMotion: true,
      });
      setTimeout(() => shootStar(x, y, firework), 200);
    }, delay);
  });

  // Pluie douce de pétales après la salve
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      startVelocity: 22,
      origin: { x: 0.5, y: 0.2 },
      colors: soft,
      shapes: ['circle'],
      scalar: 0.8,
      gravity: 0.55,
      ticks: 220,
      disableForReducedMotion: true,
    });
  }, 1400);
}

export function petalBurst(x: number, y: number) {
  confetti({
    particleCount: 14,
    spread: 50,
    startVelocity: 18,
    origin: { x, y },
    colors: ['#D48C94', '#F9ECEE', '#E8D5C8'],
    shapes: ['circle'],
    scalar: 0.7,
    gravity: 0.6,
    ticks: 140,
    disableForReducedMotion: true,
  });
}

const gold = ['#fff8e8', '#c9a84a', '#ffd700', '#f0e6d0', '#ffe9a8'];

/** Pluie d’étoiles dorées — révélation du ciel. */
export function celebrateGoldenSky() {
  const end = Date.now() + 2800;
  const frame = () => {
    confetti({
      particleCount: 8,
      spread: 80,
      startVelocity: 26,
      origin: { x: Math.random(), y: Math.random() * 0.45 },
      colors: gold,
      shapes: ['star'],
      scalar: 0.9,
      gravity: 0.45,
      ticks: 180,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 120,
      origin: { x: 0.5, y: 0.45 },
      colors: gold,
      shapes: ['star', 'circle'],
      scalar: 1.1,
      gravity: 0.35,
      ticks: 220,
      disableForReducedMotion: true,
    });
  }, 600);
}

export function starSparkAt(x: number, y: number) {
  confetti({
    particleCount: 12,
    spread: 360,
    startVelocity: 14,
    origin: { x, y },
    colors: gold,
    shapes: ['star'],
    scalar: 0.55,
    gravity: 0.5,
    ticks: 80,
    disableForReducedMotion: true,
  });
}
