import { useState } from 'react';
import { SUPPLEMENTS, EVIDENCE_COLORS } from '../../data/supplements';
import { I } from '../icons/Icon';
import SupplementCard from './SupplementCard';

// ─── Category filter options ─────────────────────
const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: '🧬' },
  { id: 'cognicion', label: 'Cognicion', icon: '🧠' },
  { id: 'atencion', label: 'Atencion', icon: '⚡' },
  { id: 'bienestar', label: 'Bienestar', icon: '💚' },
  { id: 'aprendizaje', label: 'Aprendizaje', icon: '🎓' },
];

// ─── Selection criteria ──────────────────────────
const CRITERIA = [
  {
    icon: '🔬',
    title: 'Evidencia cientifica',
    desc: 'Solo incluimos suplementos con estudios publicados en revistas indexadas',
  },
  {
    icon: '🧪',
    title: 'Dosis efectivas',
    desc: 'Las dosis recomendadas se basan en las usadas en ensayos clinicos',
  },
  {
    icon: '⚖️',
    title: 'Seguridad',
    desc: 'Priorizamos suplementos con perfiles de seguridad bien establecidos',
  },
];

// ═══════════════════════════════════════════════════
// SupplementsTab — full catalog with filters
// ═══════════════════════════════════════════════════
export default function SupplementsTab() {
  const [filter, setFilter] = useState('todos');
  const [evidenceFilter, setEvidenceFilter] = useState('todas');

  // ── Apply filters ──────────────────────────────
  const filtered = SUPPLEMENTS.filter(s => {
    if (filter !== 'todos' && !s.categories.includes(filter)) return false;
    if (evidenceFilter !== 'todas' && s.evidence !== evidenceFilter) return false;
    return true;
  });

  return (
    <div style={styles.container}>
      {/* ── Medical disclaimer ─────────────────── */}
      <div style={styles.disclaimer}>
        <div style={styles.disclaimerInner}>
          <span style={{ flexShrink: 0, display: 'inline-flex' }}>
            {I('🏥', 18)}
          </span>
          <p style={styles.disclaimerText}>
            Los suplementos no sustituyen una dieta equilibrada ni tratamiento
            medico. Consulta a tu profesional de salud antes de iniciar cualquier
            suplementacion. Los enlaces pueden generar una pequena comision que
            ayuda a mantener NeuroTests Pro.
          </p>
        </div>
      </div>

      {/* ── Category filters ───────────────────── */}
      <div style={styles.filtersRow}>
        {CATEGORIES.map(cat => {
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              className="cat-btn"
              onClick={() => setFilter(cat.id)}
              style={{
                ...styles.catBtn,
                ...(isActive ? styles.catBtnActive : styles.catBtnInactive),
              }}
            >
              <span style={{ display: 'inline-flex' }}>
                {I(cat.icon, 15, isActive ? '#fff' : 'var(--text-dim)')}
              </span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Evidence filter ────────────────────── */}
      <div style={styles.evidenceRow}>
        <span style={styles.evidenceLabel}>Filtrar por evidencia:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="cat-btn"
            onClick={() => setEvidenceFilter('alta')}
            style={{
              ...styles.evidencePill,
              background: evidenceFilter === 'alta' ? EVIDENCE_COLORS.alta.bg : 'var(--bg)',
              color: evidenceFilter === 'alta' ? EVIDENCE_COLORS.alta.text : 'var(--text-dim)',
              border: `1px solid ${evidenceFilter === 'alta' ? EVIDENCE_COLORS.alta.border : 'var(--border)'}`,
            }}
          >
            Alta
          </button>
          <button
            className="cat-btn"
            onClick={() => setEvidenceFilter('media')}
            style={{
              ...styles.evidencePill,
              background: evidenceFilter === 'media' ? EVIDENCE_COLORS.media.bg : 'var(--bg)',
              color: evidenceFilter === 'media' ? EVIDENCE_COLORS.media.text : 'var(--text-dim)',
              border: `1px solid ${evidenceFilter === 'media' ? EVIDENCE_COLORS.media.border : 'var(--border)'}`,
            }}
          >
            Media
          </button>
          <button
            className="cat-btn"
            onClick={() => setEvidenceFilter('todas')}
            style={{
              ...styles.evidencePill,
              background: evidenceFilter === 'todas' ? 'var(--accent)' : 'var(--bg)',
              color: evidenceFilter === 'todas' ? '#fff' : 'var(--text-dim)',
              border: `1px solid ${evidenceFilter === 'todas' ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            Todas
          </button>
        </div>
      </div>

      {/* ── Count ──────────────────────────────── */}
      <div style={styles.count}>
        {filtered.length} suplementos
      </div>

      {/* ── Supplement grid ────────────────────── */}
      <div style={styles.grid}>
        {filtered.map(supplement => (
          <SupplementCard key={supplement.id} supplement={supplement} />
        ))}
      </div>

      {/* ── Como elegimos ──────────────────────── */}
      <div style={styles.criteriaSection}>
        <h3 style={styles.criteriaTitle}>
          Como seleccionamos los suplementos
        </h3>
        <div style={styles.criteriaList}>
          {CRITERIA.map((item, i) => (
            <div key={i} style={styles.criteriaCard}>
              <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <div style={styles.criteriaItemTitle}>{item.title}</div>
                <div style={styles.criteriaItemDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════
const styles = {
  container: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '0 0 20px',
    fontFamily: "'DM Sans', sans-serif",
  },

  // ── Disclaimer ────────────────────────────────
  disclaimer: {
    background: '#FFF5F0',
    border: '1px solid #F4D2C5',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 20,
  },
  disclaimerInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B3A2A',
    lineHeight: 1.5,
    margin: 0,
  },

  // ── Category filters ──────────────────────────
  filtersRow: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    marginBottom: 14,
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  catBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  },
  catBtnActive: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
  },
  catBtnInactive: {
    background: 'var(--bg)',
    color: 'var(--text-dim)',
    border: '1px solid var(--border)',
  },

  // ── Evidence filter ───────────────────────────
  evidenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  evidenceLabel: {
    fontSize: 12,
    color: 'var(--text-dim)',
    fontWeight: 500,
  },
  evidencePill: {
    padding: '4px 12px',
    borderRadius: 14,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // ── Count ─────────────────────────────────────
  count: {
    fontSize: 13,
    color: 'var(--text-dim)',
    fontWeight: 500,
    marginBottom: 12,
  },

  // ── Grid ──────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
    marginBottom: 28,
  },

  // ── Criteria section ──────────────────────────
  criteriaSection: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 20,
  },
  criteriaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 16px',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  criteriaCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  criteriaItemTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 2,
  },
  criteriaItemDesc: {
    fontSize: 12,
    color: 'var(--text-dim)',
    lineHeight: 1.45,
  },
};
