import { useState, useEffect } from 'react';
import { initProfile } from '../utils/scoring';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('neurotests-profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.testsDone = new Set(parsed.testsDone || []);
        parsed.categoriesDone = new Set(parsed.categoriesDone || []);
        // Default new fields for older profiles
        if (parsed.streakFreezes == null) parsed.streakFreezes = 1;
        if (!parsed.lastFreezeRefill) parsed.lastFreezeRefill = null;
        // Monthly freeze refill (1 free freeze per month)
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
        if (parsed.lastFreezeRefill !== monthKey) {
          parsed.streakFreezes = Math.max(parsed.streakFreezes, 1);
          parsed.lastFreezeRefill = monthKey;
        }
        return parsed;
      }
    } catch (e) {}
    return initProfile();
  });

  useEffect(() => {
    const toSave = {
      ...profile,
      testsDone: [...profile.testsDone],
      categoriesDone: [...profile.categoriesDone],
    };
    localStorage.setItem('neurotests-profile', JSON.stringify(toSave));
  }, [profile]);

  return [profile, setProfile];
}
