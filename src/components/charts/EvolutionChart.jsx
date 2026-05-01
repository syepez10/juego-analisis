import { useState, useMemo, useRef, useCallback } from 'react';

const PADDING = { top: 28, right: 20, bottom: 40, left: 44 };
const DOT_R = 4;
const DOT_HOVER_R = 6;

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function linearRegression(points) {
  const n = points.length;
  if (n < 2) return null;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += points[i];
    sumXY += i * points[i];
    sumXX += i * i;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function EvolutionChart({
  history = [],
  category,
  isPro = true,
  onShowPricing,
}) {
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  // Filter by category if provided, then limit to last 20 entries in last 30 days
  const data = useMemo(() => {
    let filtered = category
      ? history.filter((h) => h.category === category || h.testCategory === category)
      : [...history];

    // Sort by date ascending
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((h) => new Date(h.date).getTime() >= cutoff);

    // Last 20 entries max
    if (filtered.length > 20) {
      filtered = filtered.slice(filtered.length - 20);
    }

    return filtered;
  }, [history, category]);

  const width = 520;
  const height = 260;
  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  // Compute scales
  const xScale = useCallback(
    (i) => PADDING.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    [data.length, chartW]
  );
  const yScale = useCallback(
    (val) => PADDING.top + chartH - (val / 100) * chartH,
    [chartH]
  );

  // Build line path and area path
  const linePath = useMemo(() => {
    if (data.length === 0) return '';
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.score)}`)
      .join(' ');
  }, [data, xScale, yScale]);

  const areaPath = useMemo(() => {
    if (data.length === 0) return '';
    const baseline = PADDING.top + chartH;
    let path = `M${xScale(0)},${baseline} `;
    data.forEach((d, i) => {
      path += `L${xScale(i)},${yScale(d.score)} `;
    });
    path += `L${xScale(data.length - 1)},${baseline} Z`;
    return path;
  }, [data, xScale, yScale, chartH]);

  // Trend line
  const trendLine = useMemo(() => {
    if (data.length < 2) return null;
    const reg = linearRegression(data.map((d) => d.score));
    if (!reg) return null;
    const y0 = Math.max(0, Math.min(100, reg.intercept));
    const yN = Math.max(0, Math.min(100, reg.intercept + reg.slope * (data.length - 1)));
    return {
      x1: xScale(0),
      y1: yScale(y0),
      x2: xScale(data.length - 1),
      y2: yScale(yN),
    };
  }, [data, xScale, yScale]);

  // Y axis ticks
  const yTicks = [0, 25, 50, 75, 100];

  // X axis: show up to 6 date labels
  const xLabelIndices = useMemo(() => {
    if (data.length <= 6) return data.map((_, i) => i);
    const step = Math.ceil(data.length / 5);
    const indices = [];
    for (let i = 0; i < data.length; i += step) indices.push(i);
    if (indices[indices.length - 1] !== data.length - 1) indices.push(data.length - 1);
    return indices;
  }, [data.length]);

  const handleMouseMove = (e) => {
    if (!svgRef.current || data.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * width;
    // Find nearest point
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dist = Math.abs(xScale(i) - mx);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    if (minDist < 30) {
      setHoverIdx(nearest);
      setTooltipPos({
        x: xScale(nearest),
        y: yScale(data[nearest].score),
      });
    } else {
      setHoverIdx(null);
      setTooltipPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
    setTooltipPos(null);
  };

  // Unique gradient ID per instance
  const gradId = 'evo-grad';
  const areaGradId = 'evo-area-grad';

  // ==================== EMPTY STATE ====================
  if (data.length === 0 && isPro) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📈</div>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: 6,
        }}>
          Completa tests para ver tu evolucion
        </p>
        <p style={{
          fontSize: 13,
          color: 'var(--text-dim)',
          lineHeight: 1.5,
        }}>
          Aqui aparecera tu grafico de progreso cognitivo a lo largo del tiempo.
        </p>
      </div>
    );
  }

  // ==================== CHART ====================
  const chart = (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '20px 16px 16px',
      position: 'relative',
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          maxWidth: width,
          height: 'auto',
          display: 'block',
          margin: '0 auto',
          overflow: 'visible',
          cursor: data.length > 0 ? 'crosshair' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Line gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-dark)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          {/* Area gradient */}
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y axis grid lines and labels */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={PADDING.left}
              y1={yScale(tick)}
              x2={PADDING.left + chartW}
              y2={yScale(tick)}
              stroke="var(--border)"
              strokeWidth={0.7}
              strokeDasharray={tick === 0 ? 'none' : '3,3'}
              opacity={0.6}
            />
            <text
              x={PADDING.left - 8}
              y={yScale(tick) + 4}
              textAnchor="end"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fill: 'var(--text-dim)',
                fontWeight: 500,
              }}
            >
              {tick}%
            </text>
          </g>
        ))}

        {/* X axis date labels */}
        {xLabelIndices.map((i) => (
          <text
            key={`x-${i}`}
            x={xScale(i)}
            y={PADDING.top + chartH + 20}
            textAnchor="middle"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fill: 'var(--text-dim)',
              fontWeight: 500,
            }}
          >
            {formatDate(data[i].date)}
          </text>
        ))}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#${areaGradId})`}
          />
        )}

        {/* Trend line */}
        {trendLine && (
          <line
            x1={trendLine.x1}
            y1={trendLine.y1}
            x2={trendLine.x2}
            y2={trendLine.y2}
            stroke="var(--gold)"
            strokeWidth={1.5}
            strokeDasharray="6,4"
            opacity={0.6}
          />
        )}

        {/* Data line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data dots */}
        {data.map((d, i) => {
          const x = xScale(i);
          const y = yScale(d.score);
          const isHover = hoverIdx === i;
          return (
            <g key={`dot-${i}`}>
              {isHover && (
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="var(--accent)"
                  opacity={0.1}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isHover ? DOT_HOVER_R : DOT_R}
                fill="var(--surface)"
                stroke="var(--accent)"
                strokeWidth={isHover ? 2.5 : 2}
                style={{ transition: 'r 0.15s ease' }}
              />
            </g>
          );
        })}

        {/* Hover vertical guide */}
        {hoverIdx !== null && tooltipPos && (
          <line
            x1={tooltipPos.x}
            y1={PADDING.top}
            x2={tooltipPos.x}
            y2={PADDING.top + chartH}
            stroke="var(--accent)"
            strokeWidth={0.8}
            strokeDasharray="3,3"
            opacity={0.35}
          />
        )}

        {/* Tooltip */}
        {hoverIdx !== null && tooltipPos && data[hoverIdx] && (() => {
          const d = data[hoverIdx];
          const tx = tooltipPos.x;
          const ty = tooltipPos.y;
          const tooltipW = 110;
          const tooltipH = 44;
          // Flip tooltip if too close to edge
          const flipX = tx + tooltipW + 12 > width;
          const flipY = ty - tooltipH - 12 < 0;
          const rx = flipX ? tx - tooltipW - 8 : tx + 8;
          const ry = flipY ? ty + 12 : ty - tooltipH - 8;

          return (
            <g>
              {/* Tooltip background */}
              <rect
                x={rx}
                y={ry}
                width={tooltipW}
                height={tooltipH}
                rx={8}
                fill="var(--text)"
                opacity={0.92}
              />
              {/* Date */}
              <text
                x={rx + tooltipW / 2}
                y={ry + 17}
                textAnchor="middle"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fill: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                }}
              >
                {formatDate(d.date)}
              </text>
              {/* Score */}
              <text
                x={rx + tooltipW / 2}
                y={ry + 34}
                textAnchor="middle"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  fill: '#fff',
                  fontWeight: 700,
                }}
              >
                {Math.round(d.score)}%
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Trend legend */}
      {trendLine && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 12,
          marginTop: 8,
          paddingRight: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width={20} height={3}>
              <line x1={0} y1={1.5} x2={20} y2={1.5} stroke="var(--accent)" strokeWidth={2} />
            </svg>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: 'var(--text-dim)',
              fontWeight: 500,
            }}>Puntuacion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width={20} height={3}>
              <line x1={0} y1={1.5} x2={20} y2={1.5} stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="4,3" />
            </svg>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: 'var(--text-dim)',
              fontWeight: 500,
            }}>Tendencia</span>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== PRO GATE ====================
  if (!isPro) {
    return (
      <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {/* Blurred chart behind */}
        <div style={{
          filter: 'blur(6px)',
          opacity: 0.5,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {chart}
        </div>

        {/* Lock overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(245, 243, 238, 0.6)',
          backdropFilter: 'blur(2px)',
          borderRadius: 'var(--radius)',
          padding: '24px 20px',
          textAlign: 'center',
        }}>
          {/* Lock icon */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-dark), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(45, 106, 79, 0.25)',
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 6,
          }}>
            Desbloquea tu evolucion cognitiva
          </h3>
          <p style={{
            fontSize: 13,
            color: 'var(--text-dim)',
            lineHeight: 1.5,
            maxWidth: 300,
            marginBottom: 18,
          }}>
            Accede a graficos de progreso, tendencias y analisis detallado de tu rendimiento cognitivo.
          </p>
          <button
            onClick={onShowPricing}
            className="cta-btn"
            style={{
              background: 'linear-gradient(135deg, var(--gold), #E8C97A)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px 28px',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 16px rgba(212, 168, 83, 0.3)',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l3 12h14l3-12-5.5 7L12 3l-4.5 8L2 4z" />
            </svg>
            Upgrade a Pro
          </button>
        </div>
      </div>
    );
  }

  return chart;
}
