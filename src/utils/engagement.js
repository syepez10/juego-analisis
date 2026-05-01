// Seeded random for daily consistency
export function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function todaySeed() {
  const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
}

// Shuffle array with optional seed
export function shuffle(arr, seed) {
  const a = [...arr];
  const rng = seed ? seededRandom(seed) : Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor((typeof rng === 'function' ? rng() : rng) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random items from array
export function pickN(arr, n, seed) {
  return shuffle(arr, seed).slice(0, n);
}

// Daily challenge: picks a test + 5 questions based on today's date
export function getDailyChallenge(tests, profile) {
  const seed = todaySeed();
  const rng = seededRandom(seed);
  // Prefer tests where user scored low, or hasn't done
  const candidates = tests.filter(t => t.type === "quiz" && t.qs && t.qs.length >= 5);
  const idx = Math.floor(rng() * candidates.length);
  const test = candidates[idx];
  const qs = pickN(test.qs, 5, seed + 1);
  return { test, qs, seed, date: new Date().toDateString() };
}
