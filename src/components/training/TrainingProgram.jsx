import { useState, useMemo, useEffect } from 'react';
import { I } from '../icons/Icon';
import { TRAINING_WEEKS, FOCUS_ICONS, FOCUS_LABELS } from '../../data/training';

// ─── localStorage key ──────────────────────────────
const START_KEY = 'training-start-date';

function getStartDate() {
  const saved = localStorage.getItem(START_KEY);
  if (saved) return new Date(saved);
  return null;
}

function setStartDate() {
  const now = new Date().toISOString();
  localStorage.setItem(START_KEY, now);
  return new Date(now);
}

// ─── Helpers ───────────────────────────────────────
function daysBetween(a, b) {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

function isDayCompleted(day, profile, startDate) {
  if (!startDate || !profile?.history) return false;
  const testIds = new Set(day.tests);
  // A day is completed if ALL its test IDs appear in history at any date >= startDate
  const historyTestIds = new Set(
    profile.history
      .filter(h => new Date(h.date) >= startDate)
      .map(h => h.testId)
  );
  return [...testIds].every(id => historyTestIds.has(id));
}

function getCompletedDays(program, profile, startDate) {
  return program.filter(day => isDayCompleted(day, profile, startDate)).length;
}

function getBestScoreForTest(testId, profile, startDate) {
  if (!profile?.history || !startDate) return null;
  const entries = profile.history.filter(
    h => h.testId === testId && new Date(h.date) >= startDate
  );
  if (entries.length === 0) return null;
  // Return the most recent result
  return entries[0].result;
}

// ─── Progress Ring SVG ─────────────────────────────
function ProgressRing({ completed, total, size = 72, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text)"
        fontSize={size * 0.22}
        fontWeight="700"
        fontFamily="'Playfair Display',serif"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {completed}/{total}
      </text>
    </svg>
  );
}

// ─── Motivational message ──────────────────────────
function getMotivation(completed, total) {
  const pct = total > 0 ? completed / total : 0;
  if (pct === 0) return { text: "Tu viaje cognitivo empieza hoy. ¡Vamos!", icon: "rocket" };
  if (pct < 0.15) return { text: "¡Gran comienzo! Cada día cuenta.", icon: "sparkles" };
  if (pct < 0.35) return { text: "Vas avanzando con paso firme. ¡Sigue así!", icon: "flame" };
  if (pct < 0.5) return { text: "¡A mitad de camino! Tu cerebro lo nota.", icon: "zap" };
  if (pct < 0.7) return { text: "¡Impresionante progreso! La constancia paga.", icon: "star" };
  if (pct < 0.9) return { text: "¡Casi lo logras! El final está cerca.", icon: "trophy" };
  if (pct < 1) return { text: "¡Un último esfuerzo! La meta está ahí.", icon: "crown" };
  return { text: "¡Programa completado! Eres una leyenda cognitiva.", icon: "crown" };
}

// ─── Focus color helper ────────────────────────────
function getFocusColor(focus) {
  switch (focus) {
    case 'cognicion': return { bg: '#E8F5E9', text: '#2D6A4F', border: '#A7D7C5' };
    case 'atencion': return { bg: '#FFF8E1', text: '#E76F51', border: '#F4D2C5' };
    case 'bienestar': return { bg: '#FCE4EC', text: '#C2185B', border: '#F8BBD0' };
    case 'aprendizaje': return { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' };
    default: return { bg: 'var(--accent-light)', text: 'var(--accent)', border: 'var(--border)' };
  }
}

// ═══════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════
export default function TrainingProgram({ program, profile, isPro, onStartTest, allTests, onShowPricing }) {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [startDate, setStartDateState] = useState(getStartDate);

  // Initialize start date on first open
  useEffect(() => {
    if (isPro && !startDate) {
      const d = setStartDate();
      setStartDateState(d);
    }
  }, [isPro, startDate]);

  const completedDays = useMemo(
    () => getCompletedDays(program, profile, startDate),
    [program, profile, startDate]
  );

  // Current day based on calendar days since start
  const currentProgramDay = useMemo(() => {
    if (!startDate) return 1;
    const elapsed = daysBetween(startDate, new Date());
    return Math.min(Math.max(elapsed + 1, 1), 30);
  }, [startDate]);

  // Auto-expand current week
  useEffect(() => {
    if (!startDate) { setExpandedWeek(1); return; }
    const week = TRAINING_WEEKS.find(
      w => currentProgramDay >= w.days[0] && currentProgramDay <= w.days[1]
    );
    if (week) setExpandedWeek(week.week);
  }, [currentProgramDay, startDate]);

  const testMap = useMemo(() => {
    const m = {};
    if (allTests) allTests.forEach(t => { m[t.id] = t; });
    return m;
  }, [allTests]);

  const motivation = getMotivation(completedDays, program.length);

  // ── PRO Gate ───────────────────────────────────
  if (!isPro) {
    return (
      <div style={styles.container}>
        <div style={styles.gateWrapper}>
          {/* Blurred preview behind */}
          <div style={styles.blurredPreview}>
            <div style={styles.header}>
              <div>
                <h2 style={styles.mainTitle}>Programa de Entrenamiento Cognitivo</h2>
                <p style={styles.mainSub}>30 días de progresión guiada</p>
              </div>
            </div>
            {TRAINING_WEEKS.slice(0, 3).map(w => (
              <div key={w.week} style={styles.weekHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'inline-flex', color: 'var(--accent)' }}>{I(w.icon, 20)}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Semana {w.week}: {w.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{w.desc}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ ...styles.dayNode, opacity: 0.5 }}>
              <div style={styles.dayCircle}>1</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Conoce tu cerebro</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>2 tests</div>
              </div>
            </div>
            <div style={{ ...styles.dayNode, opacity: 0.35 }}>
              <div style={styles.dayCircle}>2</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Reflejos al limite</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>2 tests</div>
              </div>
            </div>
          </div>

          {/* Overlay CTA */}
          <div style={styles.gateCTA}>
            <div style={{ color: 'var(--gold)' }}>{I("crown", 48)}</div>
            <h3 style={styles.gateTitle}>Desbloquea el programa de 30 dias</h3>
            <p style={styles.gateDesc}>
              Entrenamiento cognitivo progresivo con plan diario personalizado,
              seguimiento de progreso y evaluaciones comparativas.
            </p>
            <div style={styles.gateFeatures}>
              {[
                "30 dias de entrenamiento guiado",
                "Progresion adaptativa",
                "XP bonus exclusivos",
                "Evaluacion inicial y final comparativa",
              ].map((f, i) => (
                <div key={i} style={styles.gateFeatureItem}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{I("check", 14, "var(--accent)")}</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onShowPricing}
              style={styles.upgradeBtn}
              className="cta-btn"
            >
              Activar PRO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main PRO view ──────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, background: 'var(--gold)', color: '#fff',
              padding: '2px 8px', borderRadius: 4, letterSpacing: 1,
            }}>
              PRO
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>
              Dia {currentProgramDay} de 30
            </span>
          </div>
          <h2 style={styles.mainTitle}>Programa de Entrenamiento Cognitivo</h2>
          <p style={styles.mainSub}>
            {completedDays === 0
              ? "Comienza tu viaje de 30 dias"
              : `${completedDays} de 30 dias completados`}
          </p>
        </div>
        <ProgressRing completed={completedDays} total={program.length} />
      </div>

      {/* Week sections */}
      {TRAINING_WEEKS.map(week => {
        const weekDays = program.filter(
          d => d.day >= week.days[0] && d.day <= week.days[1]
        );
        const weekCompleted = weekDays.filter(d => isDayCompleted(d, profile, startDate)).length;
        const isExpanded = expandedWeek === week.week;
        const allWeekDone = weekCompleted === weekDays.length;

        return (
          <div key={week.week} style={styles.weekSection}>
            {/* Week header — collapsible */}
            <button
              onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
              style={styles.weekHeader}
              className="cta-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: allWeekDone ? 'var(--accent)' : 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: allWeekDone ? '#fff' : 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {allWeekDone ? I("check", 20, "#fff") : I(week.icon, 20)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display',serif" }}>
                    Semana {week.week}: {week.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 1 }}>
                    {week.desc} &middot; {weekCompleted}/{weekDays.length} dias
                  </div>
                </div>
              </div>
              <div style={{
                display: 'inline-flex', transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                color: 'var(--text-dim)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Days — vertical path */}
            {isExpanded && (
              <div style={styles.daysList}>
                {weekDays.map((day, idx) => {
                  const completed = isDayCompleted(day, profile, startDate);
                  const isCurrent = day.day === currentProgramDay && !completed;
                  const isFuture = day.day > currentProgramDay && !completed;
                  const focusColors = getFocusColor(day.focus);
                  const score = completed ? getBestScoreForTest(day.tests[0], profile, startDate) : null;

                  return (
                    <div key={day.day} style={{ position: 'relative' }}>
                      {/* Connecting line */}
                      {idx < weekDays.length - 1 && (
                        <div style={{
                          position: 'absolute', left: 23, top: 48, width: 2,
                          height: 'calc(100% - 24px)',
                          background: completed ? 'var(--accent)' : 'var(--border)',
                          zIndex: 0,
                        }} />
                      )}

                      <div
                        style={{
                          ...styles.dayNode,
                          ...(isCurrent ? styles.dayNodeCurrent : {}),
                          ...(isFuture ? styles.dayNodeFuture : {}),
                          ...(completed ? styles.dayNodeCompleted : {}),
                          position: 'relative', zIndex: 1,
                        }}
                      >
                        {/* Day circle */}
                        <div style={{
                          ...styles.dayCircle,
                          ...(completed ? {
                            background: 'var(--accent)', color: '#fff',
                            borderColor: 'var(--accent)',
                          } : isCurrent ? {
                            background: 'var(--accent-light)', color: 'var(--accent)',
                            borderColor: 'var(--accent)',
                            boxShadow: '0 0 0 4px var(--accent-light)',
                            animation: 'pulse 2s ease-in-out infinite',
                          } : {
                            background: 'var(--bg)', color: 'var(--text-dim)',
                            borderColor: 'var(--border)',
                          }),
                        }}>
                          {completed ? I("check", 16, "#fff") : day.day}
                        </div>

                        {/* Day content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{
                              fontWeight: 700, fontSize: 14,
                              fontFamily: "'Playfair Display',serif",
                              color: isFuture ? 'var(--text-dim)' : 'var(--text)',
                            }}>
                              {day.title}
                            </span>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 3,
                              fontSize: 10, fontWeight: 600, padding: '2px 8px',
                              borderRadius: 20,
                              background: focusColors.bg, color: focusColors.text,
                              border: `1px solid ${focusColors.border}`,
                            }}>
                              {I(FOCUS_ICONS[day.focus], 10, focusColors.text)}
                              {FOCUS_LABELS[day.focus]}
                            </span>
                          </div>
                          <div style={{
                            fontSize: 12, color: 'var(--text-dim)',
                            marginBottom: 6,
                          }}>
                            {day.desc}
                          </div>

                          {/* Test pills */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {day.tests.map(testId => {
                              const test = testMap[testId];
                              if (!test) return null;
                              const testScore = getBestScoreForTest(testId, profile, startDate);
                              return (
                                <span
                                  key={testId}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    fontSize: 11, padding: '3px 10px', borderRadius: 20,
                                    background: testScore ? 'var(--accent-light)' : 'var(--bg)',
                                    border: `1px solid ${testScore ? 'var(--accent)' : 'var(--border)'}`,
                                    color: testScore ? 'var(--accent-dark)' : 'var(--text-dim)',
                                    fontWeight: 500,
                                  }}
                                >
                                  {I(test.icon, 11, testScore ? 'var(--accent)' : 'var(--text-dim)')}
                                  {test.title.length > 20 ? test.title.slice(0, 18) + '...' : test.title}
                                  {testScore && (
                                    <span style={{ fontWeight: 700, fontSize: 10, color: 'var(--accent)' }}>
                                      {testScore.age}
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right side — action or status */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                          {/* XP bonus */}
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: 'var(--gold)',
                            display: 'flex', alignItems: 'center', gap: 3,
                          }}>
                            +{day.xpBonus}XP
                          </span>

                          {completed && score && (
                            <div style={{
                              fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              {I("check", 14, "var(--accent)")}
                              <span>{score.label?.length > 15 ? score.label.slice(0, 13) + '...' : score.label}</span>
                            </div>
                          )}

                          {isCurrent && (
                            <button
                              onClick={() => {
                                // Start the first uncompleted test of the day
                                const nextTestId = day.tests.find(
                                  tid => !getBestScoreForTest(tid, profile, startDate)
                                ) || day.tests[0];
                                const test = testMap[nextTestId];
                                if (test && onStartTest) onStartTest(test);
                              }}
                              className="cta-btn"
                              style={styles.startBtn}
                            >
                              Empezar
                            </button>
                          )}

                          {isFuture && (
                            <span style={{
                              display: 'inline-flex', color: 'var(--text-dim)', opacity: 0.5,
                            }}>
                              {I("shield", 18, "var(--text-dim)")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Motivational footer */}
      <div style={styles.motivation}>
        <span style={{ display: 'inline-flex', color: 'var(--accent)' }}>
          {I(motivation.icon, 24)}
        </span>
        <div>
          <div style={{
            fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 15,
            marginBottom: 2,
          }}>
            {completedDays === program.length ? "Programa completado" : "Sigue adelante"}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.4 }}>
            {motivation.text}
          </div>
        </div>
      </div>

      {/* Total XP possible */}
      <div style={{
        textAlign: 'center', padding: '12px 0 4px', fontSize: 12,
        color: 'var(--text-dim)',
      }}>
        {I("sparkles", 13, "var(--gold)")}
        {' '}Total posible: {program.reduce((s, d) => s + d.xpBonus, 0)} XP bonus
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
  },

  // ── Header ─────────────────────────────────────
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 24,
    padding: '20px 22px',
    background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    borderRadius: 'var(--radius)',
    color: '#fff',
  },
  mainTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.2,
    color: '#fff',
    margin: 0,
  },
  mainSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,.65)',
    margin: '4px 0 0',
  },

  // ── Week Section ───────────────────────────────
  weekSection: {
    marginBottom: 12,
  },
  weekHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 18px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif",
    color: 'var(--text)',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  daysList: {
    padding: '12px 8px 8px 8px',
  },

  // ── Day Node ───────────────────────────────────
  dayNode: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 16px',
    marginBottom: 8,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    transition: 'all 0.2s ease',
  },
  dayNodeCurrent: {
    border: '2px solid var(--accent)',
    boxShadow: '0 4px 20px rgba(45,106,79,.12)',
    background: 'var(--surface)',
  },
  dayNodeFuture: {
    opacity: 0.55,
    filter: 'grayscale(0.3)',
  },
  dayNodeCompleted: {
    background: 'var(--surface)',
    borderColor: 'var(--accent)',
    borderLeftWidth: 3,
    borderLeftColor: 'var(--accent)',
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 16,
    fontFamily: "'Playfair Display',serif",
    border: '2px solid var(--border)',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },

  // ── Start Button ───────────────────────────────
  startBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'DM Sans',sans-serif",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },

  // ── Motivation ─────────────────────────────────
  motivation: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 20px',
    background: 'var(--accent-light)',
    border: '1px solid var(--accent)',
    borderRadius: 'var(--radius)',
    marginTop: 16,
  },

  // ── PRO Gate ───────────────────────────────────
  gateWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  blurredPreview: {
    padding: '20px',
    filter: 'blur(3px)',
    opacity: 0.5,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  gateCTA: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 28px',
    background: 'rgba(245,243,238,.88)',
    backdropFilter: 'blur(8px)',
    textAlign: 'center',
  },
  gateTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: 22,
    fontWeight: 700,
    margin: '12px 0 8px',
    color: 'var(--text)',
  },
  gateDesc: {
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.55,
    maxWidth: 380,
    margin: '0 0 18px',
  },
  gateFeatures: {
    display: 'grid',
    gap: 8,
    textAlign: 'left',
    marginBottom: 20,
  },
  gateFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text)',
    fontWeight: 500,
  },
  upgradeBtn: {
    background: 'linear-gradient(135deg, #D4A853, #E8C97A)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 36px',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'DM Sans',sans-serif",
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(212,168,83,.3)',
    letterSpacing: 0.3,
  },
};
