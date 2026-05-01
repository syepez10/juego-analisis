import { TESTS } from '../data/tests';
import { CLINICAL_ANALYSIS } from '../data/clinical-analysis';

// --- Pure SVG radar chart generator (no React) ---
const AXES = [
  { key: 'cognicion',   label: 'Cognicion',   emoji: '\u{1F9E0}', angle: -Math.PI / 2 },
  { key: 'atencion',    label: 'Atencion',     emoji: '\u26A1',    angle: 0 },
  { key: 'bienestar',   label: 'Bienestar',    emoji: '\u{1F49A}', angle: Math.PI / 2 },
  { key: 'aprendizaje', label: 'Aprendizaje',  emoji: '\u{1F393}', angle: Math.PI },
];

function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function polyPoints(cx, cy, r, values) {
  return AXES.map(a => {
    const v = values ? Math.max(0, Math.min(1, values[a.key] || 0)) : 1;
    const p = polar(cx, cy, r * v, a.angle);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
}

function computeRadarScores(history) {
  const cats = { cognicion: [], atencion: [], bienestar: [], aprendizaje: [] };
  for (const h of (history || [])) {
    const test = TESTS.find(t => t.id === h.testId);
    if (!test || !h.result || h.result.correct == null || !h.result.total) continue;
    if (cats[test.cat] !== undefined) cats[test.cat].push(h.result.correct / h.result.total);
  }
  const avg = {};
  for (const [key, scores] of Object.entries(cats)) {
    avg[key] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }
  return avg;
}

function generateRadarSVG(scores) {
  const size = 240, cx = size / 2, cy = size / 2, maxR = size * 0.34;
  const labelR = size * 0.44;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const gridPolygons = gridLevels.map(l =>
    `<polygon points="${polyPoints(cx, cy, maxR * l, null)}" fill="none" stroke="#E5E2DA" stroke-width="${l === 1 ? 1.5 : 0.8}" stroke-dasharray="${l === 1 ? 'none' : '3,3'}" opacity="${l === 1 ? 0.7 : 0.45}"/>`
  ).join('');

  const axisLines = AXES.map(a => {
    const t = polar(cx, cy, maxR, a.angle);
    return `<line x1="${cx}" y1="${cy}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="#E5E2DA" stroke-width="0.8" opacity="0.5"/>`;
  }).join('');

  const scorePolygon = `<polygon points="${polyPoints(cx, cy, maxR, scores)}" fill="#2D6A4F" fill-opacity="0.2" stroke="#2D6A4F" stroke-width="2" stroke-linejoin="round"/>`;

  const dots = AXES.map(a => {
    const v = Math.max(0, Math.min(1, scores[a.key] || 0));
    const p = polar(cx, cy, maxR * v, a.angle);
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#fff" stroke="#2D6A4F" stroke-width="2"/>`;
  }).join('');

  const labels = AXES.map(a => {
    const p = polar(cx, cy, labelR, a.angle);
    const pct = Math.round((scores[a.key] || 0) * 100);
    let anchor = 'middle', dx = 0;
    if (a.angle === 0) { anchor = 'start'; dx = 4; }
    if (Math.abs(a.angle - Math.PI) < 0.01) { anchor = 'end'; dx = -4; }
    return `<text x="${(p.x + dx).toFixed(1)}" y="${(p.y - 7).toFixed(1)}" text-anchor="${anchor}" style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;fill:#1B1B2F">${a.emoji} ${a.label}</text>
    <text x="${(p.x + dx).toFixed(1)}" y="${(p.y + 8).toFixed(1)}" text-anchor="${anchor}" style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;fill:#2D6A4F">${pct}%</text>`;
  }).join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="#F5F3EE"/>
    ${gridPolygons}${axisLines}${scorePolygon}${dots}${labels}
    <circle cx="${cx}" cy="${cy}" r="2" fill="#E5E2DA" opacity="0.5"/>
  </svg>`;
}

// --- Certificate number generator ---
function certNumber(testId, date) {
  const d = date || new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const hash = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `NT${y}${m}-${hash}`;
}

// --- Main report generator ---
export function generateReportHTML(test, result, rec, profile) {
  const clinical = CLINICAL_ANALYSIS[test.id] || {};
  const pct = result.correct != null && result.total ? Math.round((result.correct / result.total) * 100) : null;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const certNum = certNumber(test.id, now);
  const scores = computeRadarScores(profile.history);
  const hasScores = Object.values(scores).some(v => v > 0);
  const radarSVG = hasScores ? generateRadarSVG(scores) : '';

  // Stats summary
  const totalTests = profile.testsCompleted || 0;
  const uniqueTests = profile.testsDone ? (profile.testsDone.size || 0) : 0;
  const streak = profile.streak || 0;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Certificado — ${test.title} — ${certNum}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'DM Sans',sans-serif;color:#1B1B2F;background:#fff;padding:0;font-size:13px;line-height:1.6}
  .page{max-width:780px;margin:0 auto;padding:0 40px 40px}

  /* Certificate header band */
  .cert-header{background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%);color:#fff;padding:28px 40px;margin:0 -40px 28px}
  .cert-header-inner{display:flex;justify-content:space-between;align-items:center}
  .cert-logo{font-family:'Playfair Display',serif;font-size:24px;font-weight:700}
  .cert-logo span{font-size:9px;background:#D4A853;color:#fff;padding:2px 7px;border-radius:3px;margin-left:6px;vertical-align:super;letter-spacing:.5px;font-family:'DM Sans',sans-serif;font-weight:800}
  .cert-subtitle{font-size:11px;opacity:.7;margin-top:3px;letter-spacing:.5px}
  .cert-meta{text-align:right;font-size:11px;opacity:.8;line-height:1.8}
  .cert-num{font-family:'DM Sans',sans-serif;font-size:10px;background:rgba(255,255,255,.15);padding:3px 10px;border-radius:4px;letter-spacing:1px;margin-top:6px;display:inline-block}

  /* Title area */
  .title-area{border-bottom:2px solid #E5E2DA;padding-bottom:20px;margin-bottom:22px}
  h1{font-family:'Playfair Display',serif;font-size:24px;font-weight:600;color:#1B4332;margin-bottom:4px}
  .domain-label{font-size:13px;color:#6B6B82}
  h2{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:#1B4332;margin:24px 0 10px;padding-bottom:6px;border-bottom:1px solid #E5E2DA}
  h3{font-size:13px;font-weight:700;color:#2D6A4F;margin:16px 0 6px}

  /* Result badge */
  .result-hero{display:flex;align-items:center;gap:20px;margin:16px 0 20px}
  .badge{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#D8F3DC,#B7E4C7);color:#1B4332;width:80px;height:80px;border-radius:50%;font-size:22px;font-weight:700;font-family:'Playfair Display',serif;border:3px solid #2D6A4F;flex-shrink:0}
  .result-detail{flex:1}
  .result-label{font-size:17px;font-weight:600;margin-bottom:4px}

  /* Results grid */
  .result-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin:16px 0}
  .result-item{background:#F5F3EE;border-radius:8px;padding:10px 12px;border:1px solid #E5E2DA;text-align:center}
  .result-item .label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6B6B82;margin-bottom:2px}
  .result-item .value{font-size:16px;font-weight:700;color:#1B4332;font-family:'Playfair Display',serif}

  /* Bar */
  .bar{height:20px;background:#E5E2DA;border-radius:10px;overflow:hidden;margin:8px 0}
  .bar-fill{height:100%;background:linear-gradient(90deg,#2D6A4F,#52B788);border-radius:10px}

  /* Radar section */
  .radar-section{display:flex;align-items:center;gap:24px;margin:16px 0;padding:18px 20px;background:#F5F3EE;border-radius:12px;border:1px solid #E5E2DA}
  .radar-chart{flex-shrink:0}
  .radar-legend{flex:1}
  .radar-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px}
  .radar-legend-bar{height:6px;border-radius:3px;flex:1;max-width:120px;background:#E5E2DA;overflow:hidden}
  .radar-legend-fill{height:100%;background:linear-gradient(90deg,#2D6A4F,#52B788);border-radius:3px}

  /* Stats row */
  .stats-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:12px 0}
  .stat-box{text-align:center;background:#F5F3EE;border-radius:8px;padding:10px;border:1px solid #E5E2DA}
  .stat-value{font-size:20px;font-weight:700;font-family:'Playfair Display',serif;color:#2D6A4F}
  .stat-label{font-size:10px;color:#6B6B82;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

  /* Clinical */
  .clinical-box{background:#F5F3EE;border:1px solid #E5E2DA;border-radius:10px;padding:16px 18px;margin:12px 0}

  /* Tips */
  .tip{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #E5E2DA}
  .tip:last-child{border-bottom:none}
  .tip-icon{width:32px;height:32px;border-radius:8px;background:#D8F3DC;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .tip-title{font-weight:700;font-size:12px;margin-bottom:1px}
  .tip-desc{font-size:11.5px;color:#6B6B82;line-height:1.5}

  /* Referral */
  .referral{background:#D8F3DC;border:1px solid #A7D7C5;border-radius:10px;padding:14px 16px;margin:14px 0}
  .referral-title{font-weight:700;font-size:12px;color:#1B4332;margin-bottom:4px}
  .referral-text{font-size:12px;color:#2D5A3F}

  /* Disclaimer */
  .disclaimer{background:#FFF5F0;border:1px solid #F4D2C5;border-radius:8px;padding:12px 14px;margin-top:24px;font-size:10.5px;color:#6B3A2A;line-height:1.5}

  /* Footer */
  .footer{margin-top:28px;padding-top:16px;border-top:3px solid #1B4332;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#6B6B82}
  .footer-cert{font-family:'DM Sans',sans-serif;font-size:9px;background:#F5F3EE;padding:3px 10px;border-radius:4px;border:1px solid #E5E2DA;letter-spacing:.8px;color:#6B6B82}

  /* Watermark */
  .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-family:'Playfair Display',serif;font-size:100px;color:rgba(45,106,79,.03);pointer-events:none;z-index:0;white-space:nowrap;letter-spacing:10px}

  @media print{
    body{padding:0}
    .page{padding:0 30px 30px}
    .cert-header{margin:0 -30px 24px;padding:24px 30px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .radar-section,.result-item,.stat-box,.clinical-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    h2{break-before:auto}
    .watermark{display:none}
    @page{margin:0.8cm}
  }
</style>
</head>
<body>
  <div class="watermark">NeuroTests</div>
  <div class="page">

  <!-- Certificate header -->
  <div class="cert-header">
    <div class="cert-header-inner">
      <div>
        <div class="cert-logo">NeuroTests<span>PRO</span></div>
        <div class="cert-subtitle">INFORME DE EVALUACION COGNITIVA</div>
      </div>
      <div class="cert-meta">
        <div>${dateStr}</div>
        <div>${timeStr}</div>
        ${profile.name ? `<div style="margin-top:2px"><strong>${profile.name}</strong></div>` : ''}
        <div class="cert-num">${certNum}</div>
      </div>
    </div>
  </div>

  <!-- Test title -->
  <div class="title-area">
    <h1>${test.title}</h1>
    <div class="domain-label">${clinical.domain || test.cat} — ${clinical.measure || test.desc}</div>
  </div>

  <!-- Result hero -->
  <div class="result-hero">
    <div class="badge">${result.age}</div>
    <div class="result-detail">
      <div class="result-label">${result.label}</div>
      ${pct !== null ? `<div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div style="font-size:11px;color:#6B6B82;margin-top:2px">${result.correct}/${result.total} aciertos (${pct}%)</div>` : ''}
    </div>
  </div>

  <!-- Results grid -->
  <div class="result-grid">
    <div class="result-item"><div class="label">Puntuacion</div><div class="value">${pct !== null ? pct + '%' : result.age}</div></div>
    <div class="result-item"><div class="label">Aciertos</div><div class="value">${result.correct != null ? result.correct + '/' + result.total : 'N/A'}</div></div>
    <div class="result-item"><div class="label">Categoria</div><div class="value" style="font-size:13px;text-transform:capitalize">${test.cat}</div></div>
    <div class="result-item"><div class="label">Percentil</div><div class="value">${result.percentile ? 'P' + result.percentile : 'N/A'}</div></div>
  </div>

  ${hasScores ? `
  <!-- Cognitive Radar Profile -->
  <h2>Perfil Cognitivo Global</h2>
  <div class="radar-section">
    <div class="radar-chart">${radarSVG}</div>
    <div class="radar-legend">
      ${AXES.map(a => {
        const v = Math.round((scores[a.key] || 0) * 100);
        const labelMap = { cognicion: 'Cognicion', atencion: 'Atencion', bienestar: 'Bienestar', aprendizaje: 'Aprendizaje' };
        return `<div class="radar-legend-item">
          <span style="font-size:14px">${a.emoji}</span>
          <span style="font-weight:600;width:80px">${labelMap[a.key]}</span>
          <div class="radar-legend-bar"><div class="radar-legend-fill" style="width:${v}%"></div></div>
          <span style="font-weight:700;color:#2D6A4F;width:32px;text-align:right">${v}%</span>
        </div>`;
      }).join('')}
      <div style="margin-top:10px;font-size:10px;color:#6B6B82;line-height:1.4">
        Basado en ${totalTests} evaluaciones realizadas.
        ${uniqueTests > 0 ? `${uniqueTests} tests unicos completados.` : ''}
      </div>
    </div>
  </div>
  ` : ''}

  <!-- User stats -->
  <div class="stats-row">
    <div class="stat-box"><div class="stat-value">${totalTests}</div><div class="stat-label">Tests realizados</div></div>
    <div class="stat-box"><div class="stat-value">${streak}</div><div class="stat-label">Dias de racha</div></div>
    <div class="stat-box"><div class="stat-value">${profile.perfectScores || 0}</div><div class="stat-label">Puntuaciones perfectas</div></div>
  </div>

  <!-- Clinical analysis -->
  <h2>Analisis Clinico</h2>
  <div class="clinical-box">
    <h3>Instrumento</h3>
    <p>${clinical.scale || test.desc}</p>
    <h3 style="margin-top:12px">Interpretacion</h3>
    <p>${clinical.interpretation || rec?.summary || ''}</p>
    <h3 style="margin-top:12px">Nota clinica</h3>
    <p>${clinical.clinicalNote || 'Resultado orientativo. Requiere confirmacion con instrumentos estandarizados en condiciones controladas.'}</p>
  </div>

  ${rec ? `
  <h2>Valoracion</h2>
  <p style="margin-bottom:8px"><strong>${rec.level === 'high' ? 'Resultado excelente' : rec.level === 'low' ? 'Areas de mejora detectadas' : 'Resultado dentro de parametros normales'}</strong> — ${rec.summary}</p>
  ` : ''}

  ${rec && rec.tips && rec.tips.length > 0 ? `
  <h2>Recomendaciones</h2>
  <div>
    ${rec.tips.map(tip => `
    <div class="tip">
      <div class="tip-icon">${tip.icon}</div>
      <div>
        <div class="tip-title">${tip.title}</div>
        <div class="tip-desc">${tip.desc}</div>
      </div>
    </div>`).join('')}
  </div>
  ` : ''}

  ${rec && rec.professional ? `
  <div class="referral">
    <div class="referral-title">Derivacion profesional sugerida</div>
    <div class="referral-text">${rec.professional}</div>
  </div>
  ` : ''}

  ${rec && rec.related && rec.related.length > 0 ? `
  <h2>Tests complementarios recomendados</h2>
  <p style="margin-bottom:8px;font-size:12px;color:#6B6B82">Para una evaluacion mas completa, se sugiere administrar:</p>
  <ul style="padding-left:18px;font-size:12px;color:#1B1B2F">
    ${rec.related.map(id => { const t = TESTS.find(x => x.id === id); return t ? `<li style="margin-bottom:4px"><strong>${t.title}</strong> — ${t.desc}</li>` : ''; }).join('')}
  </ul>
  ` : ''}

  <div class="disclaimer">
    <strong>Aviso legal:</strong> Este informe ha sido generado por NeuroTests PRO, una herramienta digital de cribado cognitivo. Los resultados son orientativos y no constituyen diagnostico clinico. No sustituyen la evaluacion presencial por un profesional sanitario cualificado (neuropsicologo, neurologo, logopeda, psicologo clinico). La interpretacion de resultados debe realizarse en el contexto de una evaluacion clinica integral. Los datos de percentiles son estimaciones basadas en distribuciones poblacionales normativas y pueden no reflejar las caracteristicas especificas de la poblacion de referencia del paciente.
  </div>

  <div class="footer">
    <div>NeuroTests PRO &middot; Evaluacion Cognitiva Digital</div>
    <div class="footer-cert">${certNum}</div>
    <div>Generado el ${dateStr} a las ${timeStr}</div>
  </div>

  </div>
</body>
</html>`;
}
