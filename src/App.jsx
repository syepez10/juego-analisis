import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { TESTS } from './data/tests';
import { CATEGORIES } from './data/categories';
import { ACHIEVEMENTS, LEVELS } from './data/achievements';
import { PLANS, XP_PER_TEST, XP_PER_PERFECT, XP_PER_STREAK_DAY, DAILY_TEST_LIMIT } from './data/plans';
import { getLevel, getNextLevel, initProfile } from './utils/scoring';
import { getUnlockedTestIds, getUnlockLevel } from './utils/unlock';
import { getDailyChallenge, shuffle, todaySeed } from './utils/engagement';
import { getPercentile } from './utils/percentile';
import { mkSpeedMath } from './utils/speed-math';
import { useProfile } from './hooks/useProfile';
import { useWeeklyPlan } from './hooks/useWeeklyPlan';
import { TRAINING_PROGRAM } from './data/training';
import { I } from './components/icons/Icon';
import { S } from './styles';
import { shouldAskPermission, requestPermission, markAsked, scheduleStreakReminder } from './utils/notifications';
import { calcBrainAge, calcCategoryBrainAges, brainAgeLabel } from './utils/brain-age';
const TestRunner = lazy(() => import('./components/test/TestRunner'));
const ResultScreen = lazy(() => import('./components/results/ResultScreen'));
const RadarChart = lazy(() => import('./components/charts/RadarChart'));
const EvolutionChart = lazy(() => import('./components/charts/EvolutionChart'));
const Confetti = lazy(() => import('./components/effects/Confetti'));
const ShareCard = lazy(() => import('./components/social/ShareCard'));
const Leaderboard = lazy(() => import('./components/leaderboard/Leaderboard'));
const TrainingProgram = lazy(() => import('./components/training/TrainingProgram'));
const SupplementsTab = lazy(() => import('./components/supplements/SupplementsTab'));

export default function App() {
  const [view, setView] = useState("home");
  const [activeTest, setActiveTest] = useState(null);
  const [result, setResult] = useState(null);
  const [cat, setCat] = useState("todos");
  const [vis, setVis] = useState(9);
  const [hover, setHover] = useState(null);
  const [profile, setProfile] = useProfile();
  const [showDash, setShowDash] = useState(false);
  const [showAch, setShowAch] = useState(false);
  const [newAch, setNewAch] = useState(null);
  const [tab, setTab] = useState("tests");
  const [dailyDone, setDailyDone] = useState(false);
  const [dailyResult, setDailyResult] = useState(null);
  const [showLimit, setShowLimit] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const speedMath = useRef(mkSpeedMath());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('neurotests-theme') === 'dark');
  const [showAge, setShowAge] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [pendingStreakUpdate, setPendingStreakUpdate] = useState(null);

  const lv = getLevel(profile.xp);
  const nlv = getNextLevel(profile.xp);
  const unlockedIds = useMemo(() => isPro ? new Set(TESTS.map(t => t.id)) : getUnlockedTestIds(lv.level), [lv.level, isPro]);
  const daily = useMemo(() => getDailyChallenge(TESTS, profile), []);
  const weeklyPlan = useWeeklyPlan(TESTS, profile);

  const todayStr = new Date().toDateString();
  const todayTestCount = profile.history.filter(h => !h.isDaily && h.date && new Date(h.date).toDateString() === todayStr).length;
  const testsRemaining = isPro ? 999 : Math.max(0, DAILY_TEST_LIMIT - todayTestCount);
  const limitReached = !isPro && todayTestCount >= DAILY_TEST_LIMIT;

  useEffect(() => {
    const lastDaily = profile.history.find(h => h.isDaily && h.date && new Date(h.date).toDateString() === new Date().toDateString());
    if (lastDaily) { setDailyDone(true); setDailyResult(lastDaily.result); }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('neurotests-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!profile.age) setShowAge(true);
  }, []);

  // Notification: ask permission after 3+ tests
  useEffect(() => {
    if (shouldAskPermission(profile.testsCompleted)) {
      setShowNotifBanner(true);
    }
  }, [profile.testsCompleted]);

  // Notification: schedule streak reminder each session
  useEffect(() => {
    scheduleStreakReminder(profile.streak, dailyDone);
  }, [dailyDone, profile.streak]);

  const radarScores = useMemo(() => {
    const cats = { cognicion: [], atencion: [], bienestar: [], aprendizaje: [] };
    for (const h of profile.history) {
      const test = TESTS.find(t => t.id === h.testId);
      if (!test || !h.result || h.result.correct == null || !h.result.total) continue;
      if (cats[test.cat] !== undefined) cats[test.cat].push(h.result.correct / h.result.total);
    }
    const avg = {};
    for (const [key, scores] of Object.entries(cats)) {
      avg[key] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }
    return avg;
  }, [profile.history]);

  const brainAge = useMemo(() => calcBrainAge(radarScores, profile.age), [radarScores, profile.age]);
  const brainAgeCategories = useMemo(() => calcCategoryBrainAges(radarScores, profile.age), [radarScores, profile.age]);
  const brainAgeText = brainAgeLabel(brainAge, profile.age);

  const evolutionData = useMemo(() => {
    return profile.history
      .filter(h => h.result?.correct != null && h.result?.total)
      .map(h => ({
        date: h.date,
        score: Math.round((h.result.correct / h.result.total) * 100),
        category: TESTS.find(t => t.id === h.testId)?.cat,
      }));
  }, [profile.history]);

  const updateStreak = (p) => {
    const today = new Date().toDateString();
    if (p.lastPlayDate === today) return p;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (p.lastPlayDate === yesterday || !p.lastPlayDate) {
      // Streak continues or first day
      const streak = p.lastPlayDate ? p.streak + 1 : 1;
      return { ...p, streak, lastPlayDate: today, xp: p.xp + XP_PER_STREAK_DAY };
    }
    // Streak would break — check for freeze
    if (p.streak > 0 && (p.streakFreezes > 0 || isPro)) {
      setPendingStreakUpdate(p);
      setShowFreezeModal(true);
      return p; // don't update yet, wait for modal
    }
    // No freeze available, reset streak
    return { ...p, streak: 1, lastPlayDate: today, xp: p.xp + XP_PER_STREAK_DAY };
  };

  const applyFreeze = () => {
    if (!pendingStreakUpdate) return;
    const p = { ...pendingStreakUpdate };
    if (!isPro) p.streakFreezes = Math.max(0, (p.streakFreezes || 0) - 1);
    p.lastPlayDate = new Date().toDateString();
    p.xp += XP_PER_STREAK_DAY;
    // streak stays the same
    setProfile(p);
    setShowFreezeModal(false);
    setPendingStreakUpdate(null);
  };

  const skipFreeze = () => {
    if (!pendingStreakUpdate) return;
    const p = { ...pendingStreakUpdate, streak: 1, lastPlayDate: new Date().toDateString(), xp: pendingStreakUpdate.xp + XP_PER_STREAK_DAY };
    setProfile(p);
    setShowFreezeModal(false);
    setPendingStreakUpdate(null);
  };

  const checkAchievements = (p) => {
    const stats = { ...p, level: getLevel(p.xp).level, uniqueTests: p.testsDone.size, categoriesCompleted: p.categoriesDone.size };
    let newUnlocked = null;
    for (const a of ACHIEVEMENTS) {
      if (!p.unlockedAchievements.includes(a.id) && a.check(stats)) {
        p.unlockedAchievements = [...p.unlockedAchievements, a.id];
        newUnlocked = a;
      }
    }
    if (newUnlocked) setNewAch(newUnlocked);
    return p;
  };

  const startTest = (t) => {
    if (!unlockedIds.has(t.id)) return;
    if (limitReached) { setShowLimit(true); return; }
    setActiveTest(t); setResult(null); setView("test"); window.scrollTo(0, 0);
  };
  const goHome = () => { setView("home"); setActiveTest(null); setResult(null); window.scrollTo(0, 0); };

  const finishTest = (res, isDaily = false) => {
    let p = { ...profile };
    p = updateStreak(p);
    p.testsCompleted++;
    p.xp += XP_PER_TEST;
    if (activeTest) {
      p.testsDone = new Set([...p.testsDone, activeTest.id]);
      p.categoriesDone = new Set([...p.categoriesDone, activeTest.cat]);
    }
    if (res.correct != null && res.total && res.correct === res.total) { p.perfectScores++; p.xp += XP_PER_PERFECT; }
    if (activeTest?.type === "reaction" && res.age) { const ms = parseInt(res.age); if (!isNaN(ms) && ms < p.bestReaction) p.bestReaction = ms; }
    const h = new Date().getHours();
    if (h >= 22) p.nightTest = true;
    if (h < 7) p.earlyTest = true;
    const entry = { testId: activeTest?.id || daily.test.id, testTitle: activeTest?.title || daily.test.title, icon: activeTest?.icon || daily.test.icon, result: res, date: new Date().toISOString(), isDaily };
    p.history = [entry, ...p.history].slice(0, 50);
    p = checkAchievements(p);
    setProfile(p);
    setShowConfetti(true);
    if (isDaily) { setDailyDone(true); setDailyResult(res); setView("home"); window.scrollTo(0, 0); }
    else { setResult(res); setView("result"); window.scrollTo(0, 0); }
  };

  const finishDaily = (res) => {
    const pctile = res.correct != null && res.total ? getPercentile(daily.test.id, res.correct, res.total) : null;
    res.percentile = pctile;
    finishTest(res, true);
  };

  const filtered = cat === "todos" ? TESTS : TESTS.filter(t => t.cat === cat);
  const shuffledFiltered = useMemo(() => shuffle(filtered, todaySeed()), [cat]);
  const shown = shuffledFiltered.slice(0, vis);
  const unlockedSet = new Set(profile.unlockedAchievements);

  return (
    <div style={S.page}>

      {/* ACHIEVEMENT POPUP */}
      {newAch && <div style={S.achPopup} onClick={() => setNewAch(null)}>
        <div style={S.achPopupInner} className="ach-pop">
          <div style={{ color: "var(--gold)" }}>{I(newAch.icon, 48)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "var(--gold)", marginTop: 8 }}>Logro desbloqueado</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginTop: 4 }}>{newAch.title}</div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{newAch.desc}</div>
          <div style={{ fontSize: 11, marginTop: 12, color: "var(--text-dim)" }}>Toca para cerrar</div>
        </div>
      </div>}

      {/* DAILY LIMIT MODAL */}
      {showLimit && <div style={S.achPopup} onClick={() => setShowLimit(false)}>
        <div style={{ ...S.panel, maxWidth: 420, textAlign: "center", padding: "32px 28px" }} className="ach-pop" onClick={e => e.stopPropagation()}>
          <div style={{ color: "var(--accent)" }}>{I("🏥", 44)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent)", marginTop: 10 }}>Límite diario alcanzado</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>Has completado tus {DAILY_TEST_LIMIT} tests de hoy</div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8, lineHeight: 1.5 }}>El descanso entre sesiones mejora la consolidación cognitiva. Vuelve mañana o desbloquea tests ilimitados.</p>

          <div style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F)", borderRadius: 14, padding: "20px 18px", marginTop: 18, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, background: "var(--gold)", color: "#fff", padding: "2px 8px", borderRadius: 4, letterSpacing: .5 }}>PRO</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif", marginLeft: 10 }}>4,99€<span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.6)" }}>/mes</span></span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {["Tests ilimitados al día", "27 tests completos", "Informes PDF", "Percentiles por edad"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.85)" }}>
                  <span style={{ color: "#95D5B2" }}>{I("check", 12, "#95D5B2")}</span>{f}
                </div>
              ))}
            </div>
            <button className="cta-btn" onClick={() => { setShowLimit(false); setIsPro(true); }} style={{ width: "100%", marginTop: 14, background: "#95D5B2", color: "#1B4332", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Activar Pro</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center" }}>
            <button className="cta-btn" style={{ ...S.secBtn, fontSize: 12 }} onClick={() => setShowLimit(false)}>Seguir con plan gratuito</button>
            <button className="cta-btn" style={{ fontSize: 12, background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setShowLimit(false); setShowPricing(true); }}>Ver todos los planes</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 8 }}>El chequeo diario no cuenta para el límite</div>
        </div>
      </div>}

      {/* PRICING MODAL */}
      {showPricing && <div style={S.overlay} onClick={() => setShowPricing(false)} role="dialog" aria-label="Planes de precio">
        <div style={{ ...S.panel, maxWidth: 820, maxHeight: "90vh", padding: 0, overflow: "auto" }} onClick={e => e.stopPropagation()}>
          <div style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F)", padding: "28px 28px 24px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={{ ...S.closeBtn, color: "rgba(255,255,255,.6)" }} onClick={() => setShowPricing(false)}>✕</button></div>
            <div style={{ color: "#95D5B2" }}>{I("🧠", 36)}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, color: "#fff", marginTop: 8 }}>Elige tu plan</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 4 }}>Cancela cuando quieras · Sin compromiso</p>
          </div>
          <div style={{ padding: "24px 20px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                border: plan.highlight ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 14, padding: "22px 18px", position: "relative",
                background: plan.highlight ? "var(--accent-light)" : "var(--surface)",
                display: "flex", flexDirection: "column"
              }}>
                {plan.badge && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: plan.highlight ? "var(--accent)" : "var(--gold)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 20, letterSpacing: .5, whiteSpace: "nowrap" }}>{plan.badge}</div>}
                <div style={{ textAlign: "center", marginBottom: 14, marginTop: plan.badge ? 8 : 0 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600 }}>{plan.name}</div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "var(--accent-dark)" }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{plan.period}</span>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 8, flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: f.included ? "var(--text)" : "var(--text-dim)" }}>
                      {f.included
                        ? <span style={{ color: "var(--accent)", flexShrink: 0 }}>{I("check", 14, "var(--accent)")}</span>
                        : <span style={{ color: "var(--border)", flexShrink: 0 }}>{I("x", 14, "var(--border)")}</span>
                      }
                      <span style={{ ...(!f.included ? { textDecoration: "line-through", opacity: .5 } : {}) }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <button className="cta-btn" onClick={() => {
                  if (plan.id === "free") { setShowPricing(false); }
                  else { setIsPro(true); setShowPricing(false); }
                }} style={{
                  width: "100%", marginTop: 18, borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                  ...(plan.highlight
                    ? { background: "var(--accent)", color: "#fff", border: "none" }
                    : plan.id === "clinic"
                      ? { background: "var(--accent-dark)", color: "#fff", border: "none" }
                      : { background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)" }
                  )
                }}>
                  {plan.id === "free" ? (isPro ? "Plan actual: Pro" : "Plan actual")
                    : plan.id === "pro" ? (isPro ? "Plan activo ✓" : "Empezar prueba gratuita")
                      : "Contactar ventas"}
                </button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border)", padding: "14px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>Pago seguro con Stripe · Factura disponible · 14 días de prueba gratuita en todos los planes de pago</p>
          </div>
        </div>
      </div>}

      {/* TOP BAR */}
      <div style={S.topBar} className="top-bar-bg">
        <div style={S.topInner}>
          <div style={S.brand} onClick={goHome}>
            <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I("🧠", 22)}</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>NeuroTests</span>
            <span style={S.proBadge}>{isPro ? "PRO" : "FREE"}</span>
          </div>
          <div style={S.topRight}>
            <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} title={darkMode ? "Modo claro" : "Modo oscuro"} aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            {!isPro && <button className="cta-btn" onClick={() => setShowPricing(true)} style={{ background: "linear-gradient(135deg,#D4A853,#E8C97A)", color: "#fff", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", letterSpacing: .3 }}>Upgrade</button>}
            {!isPro && <div style={{ ...S.streakPill, background: limitReached ? "#FEE2E2" : testsRemaining <= 1 ? "#FFF5F0" : "var(--accent-light)", borderColor: limitReached ? "#FCA5A5" : testsRemaining <= 1 ? "#F4D2C5" : "var(--accent)" }} title={`${testsRemaining} tests restantes hoy`}>
              <span style={{ fontSize: 12, fontWeight: 700, color: limitReached ? "#DC2626" : "var(--accent-dark)" }}>{testsRemaining}/{DAILY_TEST_LIMIT}</span>
            </div>}
            <div style={S.streakPill} title="Racha diaria">
              <span style={{ display: "inline-flex", color: "#E76F51" }}>{I("🔥", 14)}</span> <span style={{ fontWeight: 700 }}>{profile.streak}</span>
            </div>
            {!isPro && <div style={{ ...S.streakPill, background: "rgba(147,197,253,.15)", borderColor: "#93C5FD", padding: "4px 8px" }} title={`${profile.streakFreezes || 0} streak freeze disponible`}>
              <span style={{ fontSize: 12 }}>{I("🛡️", 12)}</span><span style={{ fontWeight: 700, fontSize: 12, color: "#3B82F6" }}>{profile.streakFreezes || 0}</span>
            </div>}
            <div style={S.xpPill} onClick={() => setShowDash(!showDash)} title="Tu perfil" role="button" aria-label={`Perfil: Nivel ${lv.level}, ${profile.xp} XP`} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setShowDash(!showDash)}>
              <span style={{ display: "inline-flex", verticalAlign: "middle" }}>{I(lv.icon, 16)}</span>
              <span style={{ fontWeight: 700 }}>Nv.{lv.level}</span>
              <span style={{ color: "var(--text-dim)", fontSize: 12 }}>{profile.xp}XP</span>
            </div>
            <button style={S.achBtn} onClick={() => setShowAch(!showAch)} title="Logros" aria-label={`Logros: ${profile.unlockedAchievements.length} de ${ACHIEVEMENTS.length} desbloqueados`}>
              <span style={{ display: "inline-flex", verticalAlign: "middle" }}>{I("🏆", 14)}</span> <span style={S.achCount}>{profile.unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS PANEL */}
      {showAch && <div style={S.overlay} onClick={() => setShowAch(false)} role="dialog" aria-label="Logros">
        <div style={S.panel} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, display: "flex", alignItems: "center", gap: 8 }}>{I("🏆", 22)} Logros</h3>
            <button style={S.closeBtn} onClick={() => setShowAch(false)}>✕</button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = unlockedSet.has(a.id);
              return (<div key={a.id} style={{ ...S.achCard, ...(!unlocked ? { opacity: .4, filter: "grayscale(1)" } : {}) }}>
                <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(a.icon, 28)}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{a.desc}</div>
                </div>
                {unlocked && <span style={{ marginLeft: "auto", color: "var(--gold)", fontSize: 18 }}>✓</span>}
              </div>);
            })}
          </div>
        </div>
      </div>}

      {/* DASHBOARD PANEL */}
      {showDash && <div style={S.overlay} onClick={() => setShowDash(false)} role="dialog" aria-label="Panel del paciente">
        <div style={S.panel} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, display: "flex", alignItems: "center", gap: 8 }}>{I("📊", 22)} Panel del paciente</h3>
            <button style={S.closeBtn} onClick={() => setShowDash(false)}>✕</button>
          </div>
          <div style={S.lvCard}>
            <div style={{ color: "var(--accent)" }}>{I(lv.icon, 42)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--accent)" }}>Nivel {lv.level} — {lv.title}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{profile.xp} XP</div>
              {nlv && <>
                <div style={S.xpBar}><div style={{ ...S.xpBarFill, width: `${((profile.xp - lv.xp) / (nlv.xp - lv.xp)) * 100}%` }} /></div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{nlv.xp - profile.xp} XP para nivel {nlv.level}</div>
              </>}
            </div>
          </div>
          {brainAge != null && <div style={{ textAlign: "center", margin: "16px 0", padding: "18px 16px", background: "var(--accent-light)", borderRadius: 14, border: "1px solid var(--accent)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent)", marginBottom: 4 }}>Edad cerebral</div>
            <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "var(--accent-dark)" }}>{brainAge} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-dim)" }}>años</span></div>
            <div style={{ fontSize: 12, color: "var(--accent)" }}>{brainAgeText}</div>
          </div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "16px 0" }}>
            {[
              { n: profile.testsCompleted, l: "Tests hechos", i: "📝" },
              { n: profile.testsDone.size, l: "Tests únicos", i: "🎯" },
              { n: profile.perfectScores, l: "Perfectos", i: "💎" },
            ].map((s, i) => <div key={i} style={S.statCard}><span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(s.i, 22)}</span><div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{s.n}</div><div style={{ fontSize: 11, color: "var(--text-dim)" }}>{s.l}</div></div>)}
          </div>
          {profile.history.length > 0 && <div style={{ margin: "16px 0" }}>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 10 }}>Perfil cognitivo</h4>
            <Suspense fallback={null}><RadarChart scores={radarScores} size={240} /></Suspense>
          </div>}
          <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 10 }}>Historial reciente</h4>
          {profile.history.length === 0 ? <p style={{ fontSize: 13, color: "var(--text-dim)" }}>Aún no has completado ningún test.</p> :
            <div style={{ display: "grid", gap: 8, maxHeight: 250, overflowY: "auto" }}>
              {profile.history.slice(0, 10).map((h, i) => (
                <div key={i} style={S.histItem}>
                  <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(h.icon, 20)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{h.testTitle}{h.isDaily ? <span style={{ marginLeft: 6, fontSize: 10, background: "var(--gold)", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>DIARIO</span> : null}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{h.result.label}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>{h.result.age}</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{new Date(h.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>}
        </div>
      </div>}

      {/* HOME */}
      {view === "home" && <>
        {/* HERO */}
        <section style={S.hero}>
          <div style={S.heroInner}>
            <div style={S.heroBadge}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#95D5B2", animation: "pulse 2s ease infinite", display: "inline-block" }} />&nbsp; Plataforma profesional de evaluación cognitiva</div>
            <h1 style={S.heroTitle}>Tests cognitivos<br /><span style={S.heroAccent}>para profesionales</span></h1>
            <p style={S.heroSub}>27 pruebas con entrenamiento diario, progresión adaptativa y seguimiento inteligente. Diseñado para clínicas, logopedas y neuropsicólogos.</p>
            <div style={S.heroGrid}>
              {[{ i: "🧠", n: "10", l: "Cognición" }, { i: "⚡", n: "6", l: "Atención" }, { i: "💚", n: "6", l: "Bienestar" }, { i: "🎓", n: "5", l: "Aprendizaje" }].map((s, i) => (
                <div key={i} className="hero-stat" style={S.heroStat}>
                  <span style={{ display: "inline-flex", color: "#95D5B2" }}>{I(s.i, 24)}</span>
                  <div><div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif" }}>{s.n}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{s.l}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={S.heroOrb1} /><div style={S.heroOrb2} />
        </section>

        {/* DAILY CHALLENGE */}
        <section style={{ padding: "0 20px", marginTop: -20, position: "relative", zIndex: 3 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: dailyDone ? "var(--surface)" : "linear-gradient(135deg,#1B4332,#2D6A4F)", borderRadius: 16, padding: "22px 24px", border: dailyDone ? "1px solid var(--border)" : "none", boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: dailyDone ? "var(--accent)" : "#95D5B2", animation: dailyDone ? "none" : "pulse 2s ease infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: dailyDone ? "var(--accent)" : "#95D5B2" }}>Chequeo diario</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: dailyDone ? "var(--text)" : "#fff", marginBottom: 4 }}>
                    {dailyDone ? "Completado hoy" : `${daily.test.title} — 5 preguntas`}
                  </div>
                  <div style={{ fontSize: 13, color: dailyDone ? "var(--text-dim)" : "rgba(255,255,255,.65)" }}>
                    {dailyDone && dailyResult
                      ? `${dailyResult.correct}/${dailyResult.total} aciertos${dailyResult.percentile ? ` · Mejor que el ${dailyResult.percentile}% de usuarios` : ''}`
                      : "2 min · Mantén tu racha y mide tu evolución"}
                  </div>
                </div>
                {!dailyDone && <button className="cta-btn" onClick={() => { setActiveTest({ ...daily.test, qs: daily.qs, _isDaily: true, dur: 120 }); setResult(null); setView("test"); window.scrollTo(0, 0); }} style={{ background: "#95D5B2", color: "#1B4332", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>Empezar</button>}
                {dailyDone && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "var(--accent-light)", color: "var(--accent)" }}>{I("✅", 24)}</div>}
              </div>
            </div>
          </div>
        </section>

        {/* BRAIN AGE CARD */}
        {brainAge != null && <section style={{ padding: "16px 20px 0", position: "relative", zIndex: 3 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: "var(--surface)", borderRadius: 16, padding: "20px 24px", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="5"/>
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${Math.max(10, Math.min(226, (1 - (brainAge - 15) / 70) * 226))} 226`}
                      transform="rotate(-90 40 40)" style={{ transition: "stroke-dasharray 1s ease" }}/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "var(--accent-dark)", lineHeight: 1 }}>{brainAge}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: .5 }}>años</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent)" }}>Edad cerebral</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: brainAgeText === 'Excepcional' || brainAgeText === 'Por encima de la media' ? "var(--accent)" : brainAgeText === 'Mejorable' ? "#C53030" : "var(--gold)", background: brainAgeText === 'Excepcional' || brainAgeText === 'Por encima de la media' ? "var(--accent-light)" : brainAgeText === 'Mejorable' ? "#FEE2E2" : "rgba(212,168,83,.15)", padding: "2px 8px", borderRadius: 4 }}>{brainAgeText}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600 }}>Tu cerebro tiene {brainAge} años</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Basado en {profile.testsCompleted} evaluaciones cognitivas</div>
                  {isPro && Object.keys(brainAgeCategories).length > 0 && <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                    {Object.entries(brainAgeCategories).map(([k, v]) => (
                      <div key={k} style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{k}:</span> {v} años
                      </div>
                    ))}
                  </div>}
                  {!isPro && Object.keys(brainAgeCategories).length > 0 && <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 6, cursor: "pointer" }} onClick={() => setShowPricing(true)}>
                    {I("👑", 12)} Desglose por categoria — Solo Pro
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </section>}

        {/* WEEKLY PLAN */}
        {weeklyPlan && weeklyPlan.tests.length > 0 && <section style={{ padding: "16px 20px 0", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: "var(--surface)", borderRadius: 14, padding: "18px 20px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I("🎯", 18)}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: .8 }}>Plan semanal</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: "auto" }}>{weeklyPlan.type === "improve" ? "Áreas de mejora" : weeklyPlan.type === "explore" ? "Explorar" : "Mantenimiento"}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>{weeklyPlan.message}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {weeklyPlan.tests.map(t => {
                  const isUnlocked = unlockedIds.has(t.id);
                  return (<button key={t.id} className={isUnlocked ? "cta-btn" : ""} onClick={() => isUnlocked && startTest(t)} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: isUnlocked ? "var(--text)" : "var(--text-dim)", opacity: isUnlocked ? 1 : .5, cursor: isUnlocked ? "pointer" : "default" }}>
                    <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(t.icon, 16)}</span>
                    {t.title}
                    {t.lastScore != null && <span style={{ fontSize: 11, color: "#C53030", fontWeight: 600 }}>{Math.round(t.lastScore)}%</span>}
                  </button>);
                })}
              </div>
            </div>
          </div>
        </section>}

        {/* DISCLAIMER */}
        <section style={S.warn}>
          <div style={S.warnInner}>
            <span style={{ flexShrink: 0, color: "#6B3A2A" }}>{I("🏥", 18)}</span>
            <p style={S.warnText}><strong>Uso profesional:</strong> Herramientas de cribado y seguimiento. Los resultados no constituyen diagnóstico clínico.</p>
          </div>
        </section>

        <section style={S.sec}>
          <div style={S.secInner}>
            {/* Tabs */}
            <div style={S.tabs}>
              {[{ id: "tests", l: "Biblioteca" }, { id: "progress", l: "Progreso" }, { id: "training", l: "Entrenamiento" }, { id: "ranking", l: "Ranking" }, { id: "supplements", l: "Suplementos" }, { id: "achievements", l: "Logros" }].map(t => (
                <button key={t.id} className="cat-btn" onClick={() => setTab(t.id)} style={{ ...S.tabBtn, ...(tab === t.id ? S.tabActive : {}) }}>{t.l}</button>
              ))}
            </div>

            {/* TESTS TAB */}
            {tab === "tests" && <>
              <div style={S.filterRow}>
                {CATEGORIES.map(c => (
                  <button key={c.id} className="cat-btn" onClick={() => { setCat(c.id); setVis(9); }} style={{ ...S.catBtn, ...(cat === c.id ? S.catActive : {}) }}><span style={{ display: "inline-flex", verticalAlign: "middle" }}>{I(c.icon, 14)}</span> {c.label}</button>
                ))}
              </div>
              <div style={S.grid}>
                {shown.map((t, i) => {
                  const done = profile.testsDone.has(t.id);
                  const locked = !unlockedIds.has(t.id);
                  const reqLevel = getUnlockLevel(t.id);
                  const dimmed = locked || limitReached;
                  return (
                    <div key={t.id} className={dimmed ? "" : "test-card"} style={{ ...S.card, animation: `fadeUp .4s ease ${i * .04}s both`, ...(dimmed ? { opacity: locked ? .5 : .55, filter: locked ? "grayscale(.4)" : "grayscale(.15)" } : {}) }} onMouseEnter={() => !dimmed && setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => locked ? null : startTest(t)}>
                      {done && <div style={S.doneBadge}>✓</div>}
                      {locked && <div style={{ ...S.doneBadge, background: "var(--text-dim)", fontSize: 10 }}>
                        {I("shield", 12, "#fff")}
                      </div>}
                      <div style={S.cardIcon}>{I(t.icon, 28)}</div>
                      <div style={S.cardCat}>{CATEGORIES.find(c => c.id === t.cat)?.label}</div>
                      <h3 style={S.cardTitle}>{t.title}</h3>
                      <p style={S.cardDesc}>{t.desc}</p>
                      <div style={S.cardMeta}><span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{I('⏱', 12)} {Math.ceil(t.dur / 60)}min</span><span>+{XP_PER_TEST}XP</span></div>
                      {locked
                        ? <div style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>Desbloquea en nivel {reqLevel}</div>
                        : limitReached
                          ? <div style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>Límite diario alcanzado</div>
                          : <button className="cta-btn" style={{ ...S.cardBtn, ...(hover === i ? { background: "var(--accent)", color: "#fff" } : {}) }}>Comenzar →</button>
                      }
                    </div>);
                })}
              </div>
              {shown.length < shuffledFiltered.length && <div style={{ textAlign: "center", marginTop: 24 }}>
                <button className="show-more-btn" style={S.showMore} onClick={() => setVis(v => v + 9)}>Ver más ({shuffledFiltered.length - shown.length})</button>
              </div>}
            </>}

            {/* PROGRESS TAB */}
            {tab === "progress" && <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <div style={S.lvCard}>
                <div style={{ color: "var(--accent)" }}>{I(lv.icon, 48)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>Nivel {lv.level} — {lv.title}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{profile.xp} XP</div>
                  {nlv && <><div style={S.xpBar}><div style={{ ...S.xpBarFill, width: `${((profile.xp - lv.xp) / (nlv.xp - lv.xp)) * 100}%` }} /></div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{nlv.xp - profile.xp} XP para nivel {nlv.level} ({nlv.title})</div></>}
                </div>
              </div>

              <div style={{ background: "var(--accent-light)", borderRadius: 12, padding: "14px 16px", margin: "16px 0", border: "1px solid var(--accent)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: "var(--accent-dark)" }}>Tests desbloqueados</span>
                  <span style={{ fontWeight: 700, color: "var(--accent-dark)" }}>{unlockedIds.size}/{TESTS.length}</span>
                </div>
                <div style={{ ...S.xpBar, marginTop: 8, background: "rgba(45,106,79,.15)" }}><div style={{ ...S.xpBarFill, width: `${(unlockedIds.size / TESTS.length) * 100}%` }} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, margin: "20px 0" }}>
                {[{ n: profile.testsCompleted, l: "Tests completados", i: "📝" }, { n: profile.testsDone.size + "/" + TESTS.length, l: "Tests únicos", i: "🎯" }, { n: profile.streak, l: "Días de racha", i: "🔥" }, { n: profile.perfectScores, l: "Puntuaciones perfectas", i: "💎" }].map((s, i) => (
                  <div key={i} style={S.statCard}><span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(s.i, 24)}</span><div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{s.n}</div><div style={{ fontSize: 12, color: "var(--text-dim)" }}>{s.l}</div></div>
                ))}
              </div>

              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 12 }}>Progreso por categoría</h4>
              {CATEGORIES.filter(c => c.id !== "todos").map(c => {
                const total = TESTS.filter(t => t.cat === c.id).length;
                const done = TESTS.filter(t => t.cat === c.id && profile.testsDone.has(t.id)).length;
                return (<div key={c.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{I(c.icon, 14)} {c.label}</span><span style={{ fontWeight: 700 }}>{done}/{total}</span></div>
                  <div style={S.xpBar}><div style={{ ...S.xpBarFill, width: `${(done / total) * 100}%`, background: done === total ? "var(--gold)" : "var(--accent)" }} /></div>
                </div>);
              })}

              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, margin: "20px 0 12px" }}>Evolución cognitiva</h4>
              <Suspense fallback={null}>
                <EvolutionChart history={evolutionData} isPro={isPro} onShowPricing={() => setShowPricing(true)} />
              </Suspense>

              {profile.history.length > 0 && <div style={{ margin: "20px 0" }}>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 12 }}>Perfil cognitivo</h4>
                <Suspense fallback={null}><RadarChart scores={radarScores} /></Suspense>
              </div>}

              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, margin: "20px 0 12px" }}>Historial</h4>
              {profile.history.length === 0 ? <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Sin actividad todavía.</p> :
                <div style={{ display: "grid", gap: 8 }}>
                  {profile.history.map((h, i) => (
                    <div key={i} style={S.histItem}>
                      <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(h.icon, 18)}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{h.testTitle}{h.isDaily ? <span style={{ marginLeft: 6, fontSize: 10, background: "var(--gold)", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>DIARIO</span> : null}</div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{h.result.label}</div>
                      </div>
                      <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, fontSize: 13, color: "var(--accent)" }}>{h.result.age}</div><div style={{ fontSize: 10, color: "var(--text-dim)" }}>{new Date(h.date).toLocaleDateString()}</div></div>
                    </div>
                  ))}
                </div>}
            </div>}

            {/* ACHIEVEMENTS TAB */}
            {tab === "achievements" && <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ color: "var(--gold)" }}>{I("🏆", 48)}</div>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{profile.unlockedAchievements.length}/{ACHIEVEMENTS.length}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)" }}>logros desbloqueados</div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {ACHIEVEMENTS.map(a => {
                  const u = unlockedSet.has(a.id);
                  return (<div key={a.id} style={{ ...S.achCard, ...(!u ? { opacity: .35, filter: "grayscale(1)" } : {}) }}>
                    <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(a.icon, 30)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{a.desc}</div>
                    </div>
                    {u && <span style={{ color: "var(--gold)", fontWeight: 700 }}>✓</span>}
                  </div>);
                })}
              </div>
            </div>}

            {/* TRAINING TAB */}
            {tab === "training" && <Suspense fallback={<div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>Cargando...</div>}>
              <TrainingProgram program={TRAINING_PROGRAM} profile={profile} isPro={isPro} onStartTest={startTest} allTests={TESTS} onShowPricing={() => setShowPricing(true)} />
            </Suspense>}

            {/* RANKING TAB */}
            {tab === "ranking" && <Suspense fallback={<div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>Cargando...</div>}>
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <Leaderboard profile={{ ...profile, level: lv.level }} />
              </div>
            </Suspense>}

            {/* SUPPLEMENTS TAB */}
            {tab === "supplements" && <Suspense fallback={<div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>Cargando...</div>}>
              <SupplementsTab />
            </Suspense>}
          </div>
        </section>
      </>}

      {/* TEST VIEW */}
      {view === "test" && activeTest && <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--text-dim)" }}>Cargando test...</div>}>
        <TestRunner test={activeTest} onFinish={activeTest._isDaily ? finishDaily : finishTest} onBack={goHome} speedMath={speedMath.current} />
      </Suspense>}

      {/* RESULT VIEW */}
      {view === "result" && result && activeTest && <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--text-dim)" }}>Cargando resultado...</div>}>
        <ResultScreen result={result} test={activeTest} onHome={goHome} onRetry={() => startTest(activeTest)} xpEarned={XP_PER_TEST + (result.correct === result.total ? XP_PER_PERFECT : 0)} allTests={TESTS} onStartTest={startTest} unlockedIds={unlockedIds} profile={profile} isPro={isPro} onShowPricing={() => setShowPricing(true)} onShare={() => setShowShare(true)} brainAge={brainAge} brainAgeText={brainAgeText} />
      </Suspense>}

      {/* CONFETTI */}
      <Suspense fallback={null}><Confetti active={showConfetti} /></Suspense>

      {/* SHARE CARD */}
      {showShare && <Suspense fallback={null}>
        <ShareCard test={activeTest} result={result} profile={{ ...profile, level: lv.level }} onClose={() => setShowShare(false)} />
      </Suspense>}

      {/* STREAK FREEZE MODAL */}
      {showFreezeModal && <div style={S.achPopup} onClick={() => {}} role="dialog" aria-label="Proteger racha">
        <div style={{ ...S.panel, maxWidth: 400, textAlign: "center", padding: "32px 28px" }} className="ach-pop" onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{I("🛡️", 48)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#3B82F6", marginTop: 4 }}>Racha en peligro</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, marginTop: 10, lineHeight: 1.3 }}>
            Tu racha de {pendingStreakUpdate?.streak || 0} dias se va a romper
          </div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8, lineHeight: 1.5 }}>
            {isPro
              ? "Como usuario Pro, tienes streak freeze ilimitado."
              : `Tienes ${pendingStreakUpdate?.streakFreezes || 0} streak freeze disponible. Usalo para proteger tu racha.`}
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            <button className="cta-btn" onClick={applyFreeze} style={{ background: "linear-gradient(135deg,#3B82F6,#60A5FA)", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {I("🛡️", 18)} Usar Streak Freeze
            </button>
            <button className="cta-btn" onClick={skipFreeze} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "var(--text-dim)", cursor: "pointer" }}>
              Dejar que se rompa
            </button>
            {!isPro && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
              <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600 }} onClick={() => { setShowFreezeModal(false); setPendingStreakUpdate(null); setShowPricing(true); }}>
                {I("👑", 12)} Upgrade a Pro — Freeze ilimitado
              </span>
            </div>}
          </div>
        </div>
      </div>}

      {/* NOTIFICATION PERMISSION BANNER */}
      {showNotifBanner && <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, maxWidth: 420, width: "calc(100% - 32px)" }} className="ach-pop">
        <div style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F)", borderRadius: 14, padding: "18px 20px", boxShadow: "0 12px 40px rgba(0,0,0,.25)", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{I("🔔", 28)}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Activa las notificaciones</div>
              <div style={{ fontSize: 12, opacity: .8, lineHeight: 1.4 }}>Te avisamos a las 20:00 si no has hecho tu test diario. Protege tu racha.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
            <button className="cta-btn" onClick={() => { markAsked(); setShowNotifBanner(false); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.3)", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,.7)", cursor: "pointer" }}>Ahora no</button>
            <button className="cta-btn" onClick={async () => { markAsked(); const ok = await requestPermission(); if (ok) scheduleStreakReminder(profile.streak, dailyDone); setShowNotifBanner(false); }} style={{ background: "#95D5B2", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", color: "#1B4332", cursor: "pointer" }}>Activar</button>
          </div>
        </div>
      </div>}

      {/* AGE ONBOARDING */}
      {showAge && !profile.age && <div style={S.overlay} role="dialog" aria-label="Seleccionar rango de edad">
        <div style={{ ...S.panel, maxWidth: 440, textAlign: "center", padding: "32px 28px" }} className="ach-pop" onClick={e => e.stopPropagation()}>
          <div style={{ color: "var(--accent)" }}>{I("🧠", 44)}</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, marginTop: 12 }}>¿Cuál es tu rango de edad?</h3>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6, lineHeight: 1.5 }}>Para personalizar percentiles y recomendaciones según tu grupo etario.</p>
          <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
            {[{ label: "18-29 años", val: "18-29" }, { label: "30-44 años", val: "30-44" }, { label: "45-59 años", val: "45-59" }, { label: "60+ años", val: "60+" }].map(o => (
              <button key={o.val} className="cta-btn" onClick={() => { setProfile(p => ({ ...p, age: o.val })); setShowAge(false); }} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "var(--text)", cursor: "pointer" }}>{o.label}</button>
            ))}
          </div>
          <button style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 12, marginTop: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} onClick={() => { setProfile(p => ({ ...p, age: "prefer-not" })); setShowAge(false); }}>Prefiero no decirlo</button>
        </div>
      </div>}

    </div>
  );
}
