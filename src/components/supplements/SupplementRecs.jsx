import { getRecommendedSupplements, getAffiliateUrl, getAffiliatePlatform, EVIDENCE_COLORS } from '../../data/supplements';
import { I } from '../icons/Icon';

const styles = {
  wrapper: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 22,
    border: '1px solid var(--border)',
    marginTop: 16,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.5,
    marginBottom: 14,
    marginTop: 4,
  },
  grid: {
    display: 'grid',
    gap: 10,
  },
  miniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px 16px',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 1,
    flexShrink: 0,
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  benefits: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: 'var(--accent)',
    lineHeight: 1.4,
    marginTop: 2,
  },
  evidencePill: {
    display: 'inline-block',
    fontSize: 9,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    padding: '2px 7px',
    borderRadius: 10,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  ctaBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all .2s',
  },
  disclaimer: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: 'var(--text-dim)',
    lineHeight: 1.4,
    marginTop: 12,
  },
};

export default function SupplementRecs({ testCategory, resultLevel }) {
  const supplements = getRecommendedSupplements(testCategory, resultLevel, 3);
  if (supplements.length === 0) return null;

  const isHigh = resultLevel === 'high';
  const titleText = isHigh
    ? 'Suplementos para mantener tu nivel'
    : 'Suplementos que pueden ayudarte';
  const subtitleText = isHigh
    ? 'Tu rendimiento es excelente. Estos suplementos apoyan el mantenimiento cognitivo.'
    : 'Basado en tu resultado, estos suplementos pueden complementar tu entrenamiento.';

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.headerRow}>
        <span style={{ display: 'inline-flex', color: 'var(--accent)' }}>{I('💊', 18)}</span>
        <span style={styles.title}>{titleText}</span>
      </div>

      {/* Subtitle */}
      <p style={styles.subtitle}>{subtitleText}</p>

      {/* Mini supplement cards */}
      <div style={styles.grid}>
        {supplements.map((supp) => {
          const evidence = EVIDENCE_COLORS[supp.evidence] || EVIDENCE_COLORS.media;
          const url = getAffiliateUrl(supp);

          return (
            <div key={supp.id} style={styles.miniCard}>
              {/* Emoji */}
              <span style={styles.emoji}>{supp.emoji}</span>

              {/* Middle: name + benefits + evidence */}
              <div style={styles.middle}>
                <div style={styles.name}>{supp.name}</div>
                <div style={styles.benefits}>{supp.benefits.join(' \u00B7 ')}</div>
                <span
                  style={{
                    ...styles.evidencePill,
                    background: evidence.bg,
                    color: evidence.text,
                    border: `1px solid ${evidence.border}`,
                  }}
                >
                  {evidence.label}
                </span>
              </div>

              {/* CTA button */}
              {url && (
                <button
                  className="cta-btn"
                  style={styles.ctaBtn}
                  onClick={() => window.open(url, '_blank', 'noopener')}
                >
                  Ver
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p style={styles.disclaimer}>
        {I('🏥', 11)} Consulta a tu medico antes de tomar suplementos. Enlace de afiliado.
      </p>
    </div>
  );
}
