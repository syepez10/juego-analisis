import { useRef, useCallback } from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.6)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    width: 400,
    height: 520,
    borderRadius: 'var(--radius)',
    background: 'linear-gradient(165deg, #1B4332 0%, var(--accent) 60%, #40916C 100%)',
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,.35)',
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: 20,
    color: '#fff',
  },
  proBadge: {
    fontSize: 9,
    fontWeight: 800,
    background: 'var(--gold)',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: 4,
    letterSpacing: 1,
  },
  middleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  testIcon: {
    fontSize: 52,
    marginBottom: 8,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.2))',
  },
  testTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 600,
    color: 'rgba(255,255,255,.9)',
    marginBottom: 8,
  },
  ageText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 56,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.1,
    textShadow: '0 2px 20px rgba(0,0,0,.2)',
  },
  labelText: {
    fontSize: 15,
    color: 'rgba(255,255,255,.75)',
    marginTop: 4,
    fontWeight: 500,
  },
  scoreText: {
    fontSize: 14,
    color: '#95D5B2',
    fontWeight: 600,
    marginTop: 8,
  },
  percentileBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(212,168,83,.25)',
    border: '1px solid rgba(212,168,83,.5)',
    borderRadius: 20,
    padding: '5px 14px',
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--gold)',
    marginTop: 10,
  },
  bottomSection: {
    width: '100%',
    textAlign: 'center',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,.65)',
    marginBottom: 14,
  },
  profileSeparator: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'rgba(255,255,255,.3)',
  },
  watermark: {
    fontSize: 11,
    color: 'rgba(255,255,255,.35)',
    letterSpacing: 1,
    fontWeight: 600,
  },
  orbTop: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(149,213,178,.2) 0%, transparent 70%)',
    top: -60,
    right: -60,
    pointerEvents: 'none',
  },
  orbBottom: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,168,83,.15) 0%, transparent 70%)',
    bottom: -40,
    left: -40,
    pointerEvents: 'none',
  },
  buttonsRow: {
    display: 'flex',
    gap: 10,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all .2s',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    color: 'var(--accent)',
    border: '2px solid var(--accent)',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all .2s',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'rgba(255,255,255,.15)',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#fff',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background .2s',
  },
};

export default function ShareCard({ test, result, profile, onClose }) {
  const cardRef = useRef(null);

  const handleShare = useCallback(async () => {
    const shareText = [
      `${test?.icon || ''} ${test?.title || 'Test Cognitivo'}`,
      `Resultado: ${result?.age || ''}`,
      result?.label || '',
      result?.correct != null && result?.total
        ? `${result.correct}/${result.total} aciertos`
        : '',
      result?.percentile ? `Top ${100 - result.percentile}%` : '',
      `Nivel ${profile?.level || 1} · ${profile?.xp || 0} XP`,
      '',
      'neurotests.pro',
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi resultado en NeuroTests Pro',
          text: shareText,
        });
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Resultado copiado al portapapeles');
      } catch {
        // Fallback: select text approach
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Resultado copiado al portapapeles');
      }
    }
  }, [test, result, profile]);

  const handleDownload = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;

    // Create a standalone HTML document for the card so user can screenshot/print
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>NeuroTests Pro - Resultado</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --accent: #2D6A4F;
    --gold: #D4A853;
    --radius: 14px;
  }
  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #111;
    font-family: 'DM Sans', sans-serif;
  }
  @media print {
    body { background: #fff; }
  }
</style>
</head>
<body>${el.outerHTML}</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) {
      w.addEventListener('load', () => URL.revokeObjectURL(url));
    } else {
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        {/* The shareable card */}
        <div ref={cardRef} style={styles.card}>
          <div style={styles.orbTop} />
          <div style={styles.orbBottom} />

          <button
            style={styles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
          >
            &#10005;
          </button>

          {/* Top: Logo */}
          <div style={styles.topSection}>
            <span style={{ fontSize: 22 }}>&#129504;</span>
            <span style={styles.logoText}>NeuroTests</span>
            <span style={styles.proBadge}>PRO</span>
          </div>

          {/* Middle: Result */}
          <div style={styles.middleSection}>
            <div style={styles.testIcon}>{test?.icon || '&#129504;'}</div>
            <div style={styles.testTitle}>{test?.title || 'Test Cognitivo'}</div>
            <div style={styles.ageText}>{result?.age || '--'}</div>
            <div style={styles.labelText}>{result?.label || ''}</div>
            {result?.correct != null && result?.total != null && (
              <div style={styles.scoreText}>
                {result.correct}/{result.total} aciertos
              </div>
            )}
            {result?.percentile != null && (
              <div style={styles.percentileBadge}>
                &#9733; Top {100 - result.percentile}%
              </div>
            )}
          </div>

          {/* Bottom: Profile + Watermark */}
          <div style={styles.bottomSection}>
            {profile && (
              <div style={styles.profileRow}>
                <span>Nivel {profile.level || 1}</span>
                <span style={styles.profileSeparator} />
                <span>{profile.xp || 0} XP</span>
                <span style={styles.profileSeparator} />
                <span>Racha {profile.streak || 0} dias</span>
              </div>
            )}
            <div style={styles.watermark}>neurotests.pro</div>
          </div>
        </div>

        {/* Action buttons below the card */}
        <div style={styles.buttonsRow}>
          <button
            style={styles.actionBtn}
            onClick={handleShare}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartir
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={handleDownload}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent)';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
