import { useState, useEffect, useRef } from 'react';

const COLORS = ['var(--accent)', 'var(--gold)', '#95D5B2', '#52B788', '#E8C97A'];
const PARTICLE_COUNT_MIN = 40;
const PARTICLE_COUNT_MAX = 60;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateParticles() {
  const count = Math.floor(randomBetween(PARTICLE_COUNT_MIN, PARTICLE_COUNT_MAX));
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(6, 12),
    left: randomBetween(0, 100),
    delay: randomBetween(0, 0.8),
    duration: randomBetween(1.8, 3.2),
    drift: randomBetween(-80, 80),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(180, 720) * (Math.random() > 0.5 ? 1 : -1),
    shape: Math.random() > 0.5 ? 'square' : 'circle',
  }));
}

const keyframesId = 'confetti-keyframes';

function ensureKeyframes() {
  if (document.getElementById(keyframesId)) return;
  const style = document.createElement('style');
  style.id = keyframesId;
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(-20px) translateX(0px) rotate(var(--rot-start));
        opacity: 1;
      }
      75% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rot-end));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default function Confetti({ active, duration = 3000 }) {
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (active) {
      ensureKeyframes();
      setParticles(generateParticles());
      setVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setParticles([]);
      }, duration);
    } else {
      setVisible(false);
      setParticles([]);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, duration]);

  if (!visible || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            '--drift': `${p.drift}px`,
            '--rot-start': `${p.rotation}deg`,
            '--rot-end': `${p.rotation + p.rotationSpeed}deg`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  );
}
