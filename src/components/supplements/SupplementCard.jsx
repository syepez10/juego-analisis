import { getAffiliateUrl, getAffiliatePlatform, EVIDENCE_COLORS } from '../../data/supplements';

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 1,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  brand: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: 'var(--text-dim)',
    marginTop: 2,
  },
  evidencePill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.3,
    alignSelf: 'flex-start',
  },
  benefitsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  benefitPill: {
    background: 'var(--accent-light)',
    color: 'var(--accent)',
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    padding: '3px 9px',
    borderRadius: 12,
  },
  description: {
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
  },
  dose: {
    fontSize: 12,
    color: 'var(--text-dim)',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--gold)',
    fontFamily: "'DM Sans', sans-serif",
  },
  ctaBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '11px 16px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all .2s',
  },
};

export default function SupplementCard({ supplement }) {
  const evidence = EVIDENCE_COLORS[supplement.evidence] || EVIDENCE_COLORS.media;
  const platform = getAffiliatePlatform(supplement);
  const url = getAffiliateUrl(supplement);

  const handleClick = () => {
    if (url) window.open(url, '_blank', 'noopener');
  };

  return (
    <div style={styles.card}>
      {/* Header: emoji + name + brand */}
      <div style={styles.header}>
        <span style={styles.emoji}>{supplement.emoji}</span>
        <div style={styles.headerText}>
          <div style={styles.name}>{supplement.name}</div>
          <div style={styles.brand}>{supplement.brand}</div>
        </div>
      </div>

      {/* Evidence badge */}
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

      {/* Benefits pills */}
      <div style={styles.benefitsRow}>
        {supplement.benefits.map((b) => (
          <span key={b} style={styles.benefitPill}>
            {b}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={styles.description}>{supplement.description}</p>

      {/* Dose */}
      <div style={styles.dose}>
        <span>💊</span>
        <span>Dosis: {supplement.dose}</span>
      </div>

      {/* Price */}
      <div style={styles.priceRow}>
        <span style={styles.price}>{supplement.price}</span>
      </div>

      {/* CTA button */}
      {url && (
        <button className="cta-btn" style={styles.ctaBtn} onClick={handleClick}>
          Ver en {platform}
          <svg
            width="14"
            height="14"
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
}
