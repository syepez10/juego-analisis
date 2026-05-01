import { useMemo } from 'react';
import { shuffle } from '../utils/engagement';
import { getUnlockedTestIds } from '../utils/unlock';
import { getLevel } from '../utils/scoring';

function getWeeklyPlan(tests, profile) {
  const level = getLevel(profile.xp).level;
  const unlockedIds = getUnlockedTestIds(level);
  const unlocked = tests.filter(t => unlockedIds.has(t.id));

  const weakTests = [];
  const testMap = {};
  tests.forEach(t => testMap[t.id] = t);

  for (const h of profile.history) {
    if (h.result && h.result.correct != null && h.result.total) {
      const pct = (h.result.correct / h.result.total) * 100;
      if (pct < 70) {
        const t = testMap[h.testId];
        if (t && unlockedIds.has(t.id) && !weakTests.find(w => w.id === t.id)) {
          weakTests.push({ ...t, lastScore: pct });
        }
      }
    }
  }

  if (weakTests.length === 0) {
    const doneCats = new Set(profile.history.map(h => testMap[h.testId]?.cat).filter(Boolean));
    const allCats = ["cognicion", "atencion", "bienestar", "aprendizaje"];
    const missing = allCats.filter(c => !doneCats.has(c));
    if (missing.length > 0) {
      const cat = missing[0];
      return { type: "explore", category: cat, tests: unlocked.filter(t => t.cat === cat).slice(0, 3), message: `Esta semana: explora ${cat}` };
    }
    return { type: "maintain", tests: shuffle(unlocked).slice(0, 3), message: "Buen nivel general. Mantén la práctica." };
  }

  weakTests.sort((a, b) => a.lastScore - b.lastScore);
  return { type: "improve", tests: weakTests.slice(0, 3), message: `Enfócate en mejorar estas áreas débiles` };
}

export function useWeeklyPlan(tests, profile) {
  return useMemo(() => getWeeklyPlan(tests, profile), [profile.history.length, profile.xp]);
}
