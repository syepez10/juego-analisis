import { useState, useEffect } from 'react';

const AXES = [
  { key: 'cognicion',   label: 'Cognicion',    emoji: '\u{1F9E0}', angle: -Math.PI / 2 },
  { key: 'atencion',    label: 'Atencion',     emoji: '\u26A1',    angle: 0 },
  { key: 'bienestar',   label: 'Bienestar',    emoji: '\u{1F49A}', angle: Math.PI / 2 },
  { key: 'aprendizaje', label: 'Aprendizaje',  emoji: '\u{1F393}', angle: Math.PI },
];

const GRID_LEVELS = [0.25, 0.5, 0.75, 1];

function polarToCart(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function buildPolygonPoints(cx, cy, radius, values) {
  return AXES.map((axis, i) => {
    const val = values ? (values[axis.key] || 0) : 1;
    const r = radius * val;
    const pt = polarToCart(cx, cy, r, axis.angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');
}

export default function RadarChart({ scores = {}, size = 280, showLabels = true }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;
  const labelOffset = size * 0.44;

  // Sanitize scores to 0-1
  const safe = {};
  for (const axis of AXES) {
    const raw = scores[axis.key];
    safe[axis.key] = typeof raw === 'number' ? Math.max(0, Math.min(1, raw)) : 0;
  }

  const scorePoints = buildPolygonPoints(cx, cy, maxR, mounted ? safe : { cognicion: 0, atencion: 0, bienestar: 0, aprendizaje: 0 });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="radar-bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
          </radialGradient>
        </defs>

        {/* Background fill */}
        <circle cx={cx} cy={cy} r={maxR} fill="url(#radar-bg-grad)" />

        {/* Grid polygons */}
        {GRID_LEVELS.map((level) => (
          <polygon
            key={level}
            points={buildPolygonPoints(cx, cy, maxR * level, null)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={level === 1 ? 1.5 : 0.8}
            strokeDasharray={level === 1 ? 'none' : '3,3'}
            opacity={level === 1 ? 0.7 : 0.45}
          />
        ))}

        {/* Axis lines */}
        {AXES.map((axis) => {
          const tip = polarToCart(cx, cy, maxR, axis.angle);
          return (
            <line
              key={axis.key}
              x1={cx}
              y1={cy}
              x2={tip.x}
              y2={tip.y}
              stroke="var(--border)"
              strokeWidth={0.8}
              opacity={0.5}
            />
          );
        })}

        {/* Score polygon */}
        <polygon
          points={scorePoints}
          fill="var(--accent)"
          fillOpacity={0.2}
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          style={{
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* Score dots */}
        {AXES.map((axis) => {
          const val = mounted ? safe[axis.key] : 0;
          const pt = polarToCart(cx, cy, maxR * val, axis.angle);
          return (
            <g key={`dot-${axis.key}`}>
              {/* Outer glow */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={7}
                fill="var(--accent)"
                opacity={0.15}
                style={{ transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              {/* Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="var(--surface)"
                stroke="var(--accent)"
                strokeWidth={2}
                style={{ transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
            </g>
          );
        })}

        {/* Labels */}
        {showLabels && AXES.map((axis) => {
          const pt = polarToCart(cx, cy, labelOffset, axis.angle);
          const pct = Math.round(safe[axis.key] * 100);

          // Text anchoring based on position
          let textAnchor = 'middle';
          let dx = 0;
          if (Math.abs(axis.angle) < 0.1 || Math.abs(axis.angle) < 0.1) {
            // Right side
          }
          if (axis.angle === 0) { textAnchor = 'start'; dx = 4; }
          if (Math.abs(axis.angle - Math.PI) < 0.01) { textAnchor = 'end'; dx = -4; }

          return (
            <g key={`label-${axis.key}`}>
              <text
                x={pt.x + dx}
                y={pt.y - 7}
                textAnchor={textAnchor}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  fill: 'var(--text)',
                }}
              >
                {axis.emoji} {axis.label}
              </text>
              <text
                x={pt.x + dx}
                y={pt.y + 8}
                textAnchor={textAnchor}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  fill: 'var(--accent)',
                }}
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={2} fill="var(--border)" opacity={0.5} />
      </svg>
    </div>
  );
}
