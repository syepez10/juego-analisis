import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { shuffle } from '../../utils/engagement';
import { STROOP_DATA } from '../../data/stroop';
import { I } from '../icons/Icon';
import { S } from '../../styles';
import { getPercentile } from '../../utils/percentile';

export default function TestRunner({ test, onFinish, onBack, speedMath }) {
  const shuffledQs = useMemo(() => {
    if (!test.qs) return null;
    if (test.type === "likert" || test.type === "style") return test.qs;
    return shuffle(test.qs);
  }, [test.id]);

  const qs = shuffledQs || test.qs;

  const [step, setStep] = useState(0);
  const [ans, setAns] = useState([]);
  const [timeLeft, setTimeLeft] = useState(test.dur);
  const [stepStart, setStepStart] = useState(Date.now());
  const [times, setTimes] = useState([]);
  const [rPhase, setRPhase] = useState("wait");
  const [rStart, setRStart] = useState(0);
  const [rTimes, setRTimes] = useState([]);
  const rTO = useRef(null);
  const [sRound, setSRound] = useState(0);
  const [sOk, setSOk] = useState(0);
  const [sTimes, setSTimes] = useState([]);
  const [sStart, setSStart] = useState(Date.now());
  const [spRound, setSpRound] = useState(0);
  const [spOk, setSpOk] = useState(0);
  const [spTimes, setSpTimes] = useState([]);
  const [spStart, setSpStart] = useState(Date.now());
  const [rp, setRp] = useState("read");
  const [rdStart] = useState(Date.now());
  const [rdTime, setRdTime] = useState(0);

  // Use ref for handleTO to avoid stale closure in timer
  const handleTORef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(iv); handleTORef.current(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleTO = () => {
    if (test.type === "reaction") { const a = rTimes.length ? Math.round(rTimes.reduce((a, b) => a + b, 0) / rTimes.length) : 999; onFinish(test.sc(a)); }
    else if (test.type === "stroop") { const at = sTimes.length ? sTimes.reduce((a, b) => a + b, 0) / sTimes.length : 5000; onFinish({ ...test.sc(sOk, Math.max(sRound, 1), at), correct: sOk, total: Math.max(sRound, 1) }); }
    else if (test.type === "speed") { const at = spTimes.length ? spTimes.reduce((a, b) => a + b, 0) / spTimes.length : 5000; onFinish({ ...test.sc(spOk, Math.max(spRound, 1), at), correct: spOk, total: Math.max(spRound, 1) }); }
    else finishWith(ans, times);
  };
  handleTORef.current = handleTO;

  const answer = (idx) => {
    const now = Date.now(), el = now - stepStart;
    const na = [...ans, idx], nt = [...times, el];
    setAns(na); setTimes(nt); setStepStart(now);
    if (step + 1 >= (qs?.length || 0)) finishWith(na, nt); else setStep(step + 1);
  };

  const finishWith = (a, t) => {
    if (test.type === "quiz" || test.type === "mixed") {
      const c = a.filter((v, i) => v === qs[i].c).length;
      const at = t.length ? t.reduce((x, y) => x + y, 0) / t.length / 1000 : 10;
      const res = { ...test.sc(c, qs.length, at), correct: c, total: qs.length };
      res.percentile = getPercentile(test.id, c, qs.length);
      onFinish(res);
    } else if (test.type === "likert") {
      onFinish({ ...test.sc(a), answers: a });
    } else if (test.type === "style") {
      onFinish({ ...test.sc(a), answers: a });
    }
  };

  const startR = () => { setRPhase("ready"); rTO.current = setTimeout(() => { setRPhase("green"); setRStart(Date.now()); }, 1500 + Math.random() * 3000); };
  const clickR = () => {
    if (rPhase === "ready") { clearTimeout(rTO.current); setRPhase("wait"); }
    else if (rPhase === "green") {
      const rt = Date.now() - rStart, nt = [...rTimes, rt]; setRTimes(nt);
      if (nt.length >= (test.rounds || 8)) { const a = Math.round(nt.reduce((a, b) => a + b, 0) / nt.length); onFinish({ ...test.sc(a), times: nt }); }
      else setRPhase("wait");
    }
  };

  const ansS = (c) => {
    const it = STROOP_DATA[sRound % STROOP_DATA.length], ok = c === it.ans;
    if (ok) setSOk(v => v + 1);
    setSTimes(v => [...v, Date.now() - sStart]); setSStart(Date.now());
    if (sRound + 1 >= (test.rounds || 12)) {
      const fc = sOk + (ok ? 1 : 0), ft = [...sTimes, Date.now() - sStart], at = ft.reduce((a, b) => a + b, 0) / ft.length;
      onFinish({ ...test.sc(fc, test.rounds || 12, at), correct: fc, total: test.rounds || 12 });
    } else setSRound(v => v + 1);
  };

  const ansSp = (idx) => {
    const prob = speedMath[spRound % speedMath.length], ok = idx === prob.c;
    if (ok) setSpOk(v => v + 1);
    setSpTimes(v => [...v, Date.now() - spStart]); setSpStart(Date.now());
    if (spRound + 1 >= (test.rounds || 15)) {
      const fc = spOk + (ok ? 1 : 0), ft = [...spTimes, Date.now() - spStart], at = ft.reduce((a, b) => a + b, 0) / ft.length;
      onFinish({ ...test.sc(fc, test.rounds || 15, at), correct: fc, total: test.rounds || 15 });
    } else setSpRound(v => v + 1);
  };

  const finishRead = () => { setRdTime(Date.now() - rdStart); setRp("qs"); setStep(0); setStepStart(Date.now()); };
  const ansRead = (idx) => {
    const na = [...ans, idx]; setAns(na);
    if (step + 1 >= test.comp.length) { const c = na.filter((v, i) => v === test.comp[i].c).length; onFinish({ ...test.sc(rdTime || Date.now() - rdStart, c, test.comp.length), correct: c, total: test.comp.length }); }
    else { setStep(step + 1); setStepStart(Date.now()); }
  };

  const prog = (() => {
    if (test.type === "reaction") return (rTimes.length / (test.rounds || 8)) * 100;
    if (test.type === "stroop") return (sRound / (test.rounds || 12)) * 100;
    if (test.type === "speed") return (spRound / (test.rounds || 15)) * 100;
    if (test.type === "reading") return rp === "read" ? 0 : ((step + 1) / test.comp.length) * 100;
    return ((step + 1) / (qs?.length || 1)) * 100;
  })();

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section style={S.testSec}>
      <div style={S.testInner}>
        <div style={S.testHead}>
          <button onClick={onBack} style={S.backBtn}>← Volver</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ display: "flex", alignItems: "center" }}>{I(test.icon, 26)}</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600 }}>{test.title}</h2>
            {test._isDaily && <span style={{ fontSize: 10, background: "var(--gold)", color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>DIARIO</span>}
          </div>
          <div style={S.timerBar}><div style={{ ...S.timerFill, width: `${(timeLeft / test.dur) * 100}%`, background: timeLeft < 30 ? "#E53E3E" : "var(--accent)" }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)", margin: "4px 0 8px" }}>
            <span>{fmt(timeLeft)}</span>
            <span>{Math.round(prog)}% completado</span>
          </div>
          <div style={S.progBar}><div style={{ ...S.progFill, width: `${prog}%` }} /></div>
        </div>

        {/* Quiz */}
        {(test.type === "quiz" || test.type === "mixed") && qs[step] && <div style={S.qCard} key={step}>
          <div style={S.qNum}>Pregunta {step + 1}/{qs.length}</div>
          <h3 style={S.qText}>{qs[step].q}</h3>
          <div style={{ display: "grid", gap: 8 }}>{qs[step].o.map((o, i) => (
            <button key={i} className="opt-btn" style={S.optBtn} onClick={() => answer(i)}><span style={S.optL}>{String.fromCharCode(65 + i)}</span>{o}</button>
          ))}</div>
        </div>}

        {/* Likert */}
        {test.type === "likert" && qs[step] && <div style={S.qCard} key={step}>
          <div style={S.qNum}>Pregunta {step + 1}/{qs.length}</div>
          <h3 style={S.qText}>{qs[step].q}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 8 }}>
            {qs[step].s.map((l, i) => (
              <button key={i} className="opt-btn" style={S.likBtn} onClick={() => answer(i)}>
                <div style={{ width: 10 + i * 6, height: 10 + i * 6, borderRadius: "50%", background: `hsl(${120 - i * 40},55%,50%)`, flexShrink: 0 }} />
                {l}
              </button>
            ))}
          </div>
        </div>}

        {/* Style */}
        {test.type === "style" && qs[step] && <div style={S.qCard} key={step}>
          <div style={S.qNum}>Pregunta {step + 1}/{qs.length}</div>
          <h3 style={S.qText}>{qs[step].q}</h3>
          <div style={{ display: "grid", gap: 8 }}>{qs[step].o.map((o, i) => (
            <button key={i} className="opt-btn" style={S.optBtn} onClick={() => answer(i)}><span style={S.optL}>{String.fromCharCode(65 + i)}</span>{o}</button>
          ))}</div>
        </div>}

        {/* Reaction */}
        {test.type === "reaction" && <div style={S.qCard}>
          <div style={S.qNum}>Ronda {rTimes.length + 1}/{test.rounds || 8}</div>
          <h3 style={S.qText}>Pulsa cuando cambie a VERDE</h3>
          {rPhase === "wait" && <button className="opt-btn" style={{ ...S.rBox, background: "#3182CE", color: "#fff" }} onClick={startR}>Pulsa para empezar</button>}
          {rPhase === "ready" && <button className="opt-btn" style={{ ...S.rBox, background: "#E53E3E", color: "#fff" }} onClick={clickR}>Espera el verde...</button>}
          {rPhase === "green" && <button className="opt-btn" style={{ ...S.rBox, background: "#38A169", color: "#fff" }} onClick={clickR}>¡¡AHORA!!</button>}
          {rTimes.length > 0 && <div style={{ marginTop: 14, textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>Último: {rTimes[rTimes.length - 1]}ms · Media: {Math.round(rTimes.reduce((a, b) => a + b, 0) / rTimes.length)}ms</div>}
        </div>}

        {/* Stroop */}
        {test.type === "stroop" && <div style={S.qCard}>
          <div style={S.qNum}>Ronda {sRound + 1}/{test.rounds || 12}</div>
          <h3 style={S.qText}>¿De qué COLOR está pintada la palabra?</h3>
          <div style={{ textAlign: "center", fontSize: 56, fontWeight: 900, color: STROOP_DATA[sRound % STROOP_DATA.length].color, margin: "20px 0", fontFamily: "'Playfair Display',serif" }}>{STROOP_DATA[sRound % STROOP_DATA.length].word}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ l: "Rojo", v: "rojo", c: "#E53E3E" }, { l: "Azul", v: "azul", c: "#3182CE" }, { l: "Verde", v: "verde", c: "#38A169" }, { l: "Amarillo", v: "amarillo", c: "#D69E2E" }].map(c => (
              <button key={c.v} className="opt-btn" onClick={() => ansS(c.v)} style={{ ...S.stroopBtn, background: c.c }}>{c.l}</button>
            ))}
          </div>
        </div>}

        {/* Speed */}
        {test.type === "speed" && <div style={S.qCard}>
          <div style={S.qNum}>Ronda {spRound + 1}/{test.rounds || 15}</div>
          <h3 style={S.qText}>¡Resuelve rápido!</h3>
          <div style={{ textAlign: "center", fontSize: 44, fontWeight: 700, margin: "16px 0", fontFamily: "'Playfair Display',serif", color: "var(--accent-dark)" }}>{speedMath[spRound % speedMath.length].q}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>{speedMath[spRound % speedMath.length].o.map((o, i) => (
            <button key={i} className="opt-btn" style={{ ...S.optBtn, justifyContent: "center", fontWeight: 700, fontSize: 18 }} onClick={() => ansSp(i)}>{o}</button>
          ))}</div>
        </div>}

        {/* Reading */}
        {test.type === "reading" && <div style={S.qCard}>
          {rp === "read" ? <>
            <div style={S.qNum}>Lee lo más rápido posible</div>
            <div style={{ background: "var(--bg)", borderRadius: 12, padding: 20, fontSize: 15, lineHeight: 1.8, marginBottom: 16, border: "1px solid var(--border)" }}>{test.passage}</div>
            <button className="cta-btn" style={S.primBtn} onClick={finishRead}>He terminado ✓</button>
          </> : <>
            <div style={S.qNum}>Comprensión {step + 1}/{test.comp.length}</div>
            <h3 style={S.qText}>{test.comp[step].q}</h3>
            <div style={{ display: "grid", gap: 8 }}>{test.comp[step].o.map((o, i) => (
              <button key={i} className="opt-btn" style={S.optBtn} onClick={() => ansRead(i)}><span style={S.optL}>{String.fromCharCode(65 + i)}</span>{o}</button>
            ))}</div>
          </>}
        </div>}
      </div>
    </section>
  );
}
