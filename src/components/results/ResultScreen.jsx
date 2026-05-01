import { useState } from 'react';
import { getRecommendation } from '../../data/recommendations';
import { CLINICAL_ANALYSIS } from '../../data/clinical-analysis';
import { generateReportHTML } from '../../utils/report-generator';
import { I } from '../icons/Icon';
import { S } from '../../styles';
import SupplementRecs from '../supplements/SupplementRecs';

export default function ResultScreen({ result, test, onHome, onRetry, xpEarned, onStartTest, allTests, unlockedIds, profile, isPro, onShowPricing, onShare, brainAge, brainAgeText }) {
  const pct = result.correct != null && result.total ? Math.round((result.correct / result.total) * 100) : null;
  const rec = getRecommendation(test.id, result);
  const clinical = CLINICAL_ANALYSIS[test.id] || {};
  const [showAllTips, setShowAllTips] = useState(false);
  const [showClinical, setShowClinical] = useState(false);
  const tipsToShow = rec && rec.tips ? (showAllTips ? rec.tips : rec.tips.slice(0, 3)) : [];
  const relatedTests = rec && rec.related ? rec.related.map(id => allTests.find(t => t.id === id)).filter(Boolean).filter(t => unlockedIds?.has(t.id)).slice(0, 3) : [];

  const downloadReport = () => {
    if (!isPro) { onShowPricing && onShowPricing(); return; }
    const html = generateReportHTML(test, result, rec, profile);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) w.onload = () => { setTimeout(() => w.print(), 500); };
  };

  return (
    <section style={S.testSec}>
      <div style={{ ...S.testInner, maxWidth: 620 }}>
        <div style={S.resCard} className="ach-pop">
          <div style={{ marginBottom: 8, color: "var(--accent)" }}>{I(test.icon, 52)}</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 2 }}>{test.title}</h2>
          <p style={{ color: "var(--text-dim)", marginBottom: 24, fontSize: 13 }}>Resultado</p>
          <div style={S.resBadge}><div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "var(--accent-dark)" }}>{result.age}</div></div>
          <p style={{ fontSize: 17, fontWeight: 600, marginTop: 14, marginBottom: 6 }}>{result.label}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <div style={{ ...S.xpEarned, display: 'flex', alignItems: 'center', gap: 4 }}>+{xpEarned} XP</div>
            {brainAge != null && <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--accent-light)", border: "1px solid var(--accent)", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "var(--accent-dark)" }}>
              {I("🧠", 14)} Edad cerebral: {brainAge} anos
            </div>}
          </div>

          {/* Percentile bar */}
          {result.percentile && <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)" }}>Tu posición</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>Top {100 - result.percentile}%</span>
            </div>
            <div style={{ position: "relative", height: 24, background: "var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.percentile}%`, background: "linear-gradient(90deg,var(--accent),#52B788)", borderRadius: 12, transition: "width 1.5s ease" }} />
              <div style={{ position: "absolute", top: "50%", left: `${Math.min(90, Math.max(10, result.percentile))}%`, transform: "translate(-50%,-50%)", fontSize: 11, fontWeight: 700, color: result.percentile > 50 ? "#fff" : "var(--text)" }}>P{result.percentile}</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4, textAlign: "center" }}>Mejor que el {result.percentile}% de usuarios</div>
          </div>}

          {pct !== null && <div style={S.resBar}><div style={{ ...S.resFill, width: `${pct}%` }} /><span style={S.resBarTxt}>{result.correct}/{result.total} ({pct}%)</span></div>}
          {result.times && <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)" }}>Tiempos: {result.times.map(t => `${t}ms`).join(", ")}</div>}
        </div>

        {/* RECOMMENDATIONS */}
        {rec && <div style={S.recSection}>
          <div style={S.recSummary}>
            <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(rec.emoji, 36)}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: rec.level === "high" ? "var(--accent)" : rec.level === "low" ? "#C53030" : "var(--gold)", marginBottom: 3 }}>
                {rec.level === "high" ? "Resultado excelente" : rec.level === "low" ? "Áreas de mejora detectadas" : "Buen resultado"}
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{rec.summary}</p>
            </div>
          </div>

          {tipsToShow.length > 0 && <>
            <h3 style={{ ...S.recTitle, display: "flex", alignItems: "center", gap: 8 }}>{I("💡", 18)} Recomendaciones personalizadas</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {tipsToShow.map((tip, i) => (
                <div key={i} style={S.tipCard} className="ach-pop">
                  <div style={S.tipIcon}>{I(tip.icon, 20)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{tip.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {rec.tips.length > 3 && !showAllTips && <button onClick={() => setShowAllTips(true)} className="cta-btn" style={{ ...S.secBtn, width: "100%", marginTop: 10, fontSize: 13 }}>Ver todas las recomendaciones ({rec.tips.length - 3} más)</button>}
          </>}

          {rec.professional && <div style={S.proRef}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ display: "inline-flex", color: "#1B4332" }}>{I("🏥", 20)}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1B4332" }}>Derivación profesional sugerida</span>
            </div>
            <p style={{ fontSize: 13, color: "#2D5A3F", lineHeight: 1.55, margin: 0 }}>{rec.professional}</p>
          </div>}

          {relatedTests.length > 0 && <>
            <h3 style={{ ...S.recTitle, display: "flex", alignItems: "center", gap: 8 }}>{I("🔗", 18)} Tests relacionados recomendados</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {relatedTests.map(rt => (
                <div key={rt.id} style={S.relCard} className="opt-btn" onClick={() => onStartTest && onStartTest(rt)}>
                  <span style={{ display: "inline-flex", color: "var(--accent)" }}>{I(rt.icon, 24)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{rt.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{rt.desc.slice(0, 60)}…</div>
                  </div>
                  <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13 }}>→</span>
                </div>
              ))}
            </div>
          </>}
        </div>}

        {/* SUPPLEMENT RECOMMENDATIONS */}
        <SupplementRecs testCategory={test.cat} resultLevel={rec ? (rec.level || 'mid') : 'mid'} />

        {/* CLINICAL ANALYSIS */}
        {clinical.domain && <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "22px 22px", border: "1px solid var(--border)", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>{I("🏥", 18)} Análisis Clínico</h3>
            <button className="cta-btn" onClick={() => setShowClinical(!showClinical)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "var(--text-dim)", cursor: "pointer" }}>{showClinical ? "Contraer" : "Expandir"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: showClinical ? 16 : 0 }}>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, color: "var(--text-dim)", marginBottom: 2 }}>Dominio</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{clinical.domain}</div>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, color: "var(--text-dim)", marginBottom: 2 }}>Medida</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{clinical.measure}</div>
            </div>
          </div>
          {showClinical && <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Instrumento</div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>{clinical.scale}</p>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Interpretación</div>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{clinical.interpretation}</p>
            </div>
            <div style={{ background: "var(--warm-bg)", border: "1px solid var(--warm-border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B3A2A", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Nota clínica</div>
              <p style={{ fontSize: 12, color: "#6B3A2A", lineHeight: 1.55 }}>{clinical.clinicalNote}</p>
            </div>
          </div>}
        </div>}

        {/* DOWNLOAD REPORT */}
        <div style={{ background: isPro ? "linear-gradient(135deg,#1B4332,#2D6A4F)" : "var(--surface)", borderRadius: "var(--radius)", padding: "20px 22px", border: isPro ? "none" : "1px solid var(--border)", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: isPro ? "#fff" : "var(--text)", marginBottom: 4 }}>Informe profesional</div>
              <p style={{ fontSize: 12, color: isPro ? "rgba(255,255,255,.65)" : "var(--text-dim)", lineHeight: 1.4 }}>
                {isPro ? "Descarga el informe clínico completo con análisis, recomendaciones y derivación profesional." : "Disponible con el plan Pro. Incluye análisis clínico, instrumentos de referencia y recomendaciones."}
              </p>
            </div>
            <button className="cta-btn" onClick={downloadReport} style={{
              background: isPro ? "#95D5B2" : "var(--gold)", color: isPro ? "#1B4332" : "#fff",
              border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6
            }}>
              {isPro ? <>{I("📋", 16)} Descargar informe</> : <>{I("👑", 16)} Upgrade para informes</>}
            </button>
          </div>
        </div>

        <div style={{ ...S.resCard, marginTop: 16, padding: "20px 24px" }}>
          <div style={S.warnSmall}><span style={{ color: "#6B3A2A", display: "inline-flex" }}>{I("🏥", 16)}</span><p style={{ fontSize: 12, color: "#6B3A2A", lineHeight: 1.4, margin: 0 }}>Resultado orientativo. Para evaluación clínica, consulte a un profesional sanitario cualificado.</p></div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-btn" style={{ ...S.primBtn, display: "flex", alignItems: "center", gap: 4 }} onClick={onRetry}>{I("🔄", 14)} Repetir</button>
            {onShare && <button className="cta-btn" style={{ ...S.secBtn, display: "flex", alignItems: "center", gap: 4 }} onClick={onShare}>{I("share-2", 14)} Compartir</button>}
            <button className="cta-btn" style={{ ...S.secBtn, display: "flex", alignItems: "center", gap: 4 }} onClick={onHome}>{I("arrow-left", 14)} Todos los tests</button>
          </div>
        </div>
      </div>
    </section>
  );
}
