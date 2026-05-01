import { LEVELS } from '../data/achievements';

export function getLevel(xp) {
  let lv = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xp) lv = l; else break; }
  return lv;
}

export function getNextLevel(xp) {
  for (const l of LEVELS) { if (xp < l.xp) return l; }
  return null;
}

export function initProfile() {
  return {
    name: "", role: "", clinic: "",
    xp: 0, streak: 0, lastPlayDate: null,
    testsCompleted: 0, uniqueTests: 0, perfectScores: 0,
    bestReaction: 9999, categoriesCompleted: 0,
    nightTest: false, earlyTest: false,
    unlockedAchievements: [],
    history: [],
    testsDone: new Set(),
    categoriesDone: new Set(),
    streakFreezes: 1,
    lastFreezeRefill: null,
  };
}
