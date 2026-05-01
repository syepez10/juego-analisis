const AGE_MIDPOINTS = {
  '18-29': 24,
  '30-44': 37,
  '45-59': 52,
  '60+': 65,
  'prefer-not': 35,
};

/**
 * Calculate brain age from radar scores and user age range.
 * score 1.0 → brain age = real - 15
 * score 0.5 → brain age = real
 * score 0.0 → brain age = real + 10
 */
export function calcBrainAge(radarScores, ageRange) {
  const baseAge = AGE_MIDPOINTS[ageRange] || 35;
  const values = Object.values(radarScores);
  const activeValues = values.filter(v => v > 0);

  if (activeValues.length === 0) return null; // not enough data

  const avg = activeValues.reduce((a, b) => a + b, 0) / activeValues.length;
  // Range: -15 (best) to +10 (worst) from base age
  const adjustment = (avg - 0.5) * 30;
  const brainAge = Math.round(baseAge - adjustment);

  return Math.max(15, Math.min(85, brainAge));
}

/**
 * Get brain age per category (Pro feature)
 */
export function calcCategoryBrainAges(radarScores, ageRange) {
  const baseAge = AGE_MIDPOINTS[ageRange] || 35;
  const result = {};

  for (const [key, val] of Object.entries(radarScores)) {
    if (val > 0) {
      const adj = (val - 0.5) * 30;
      result[key] = Math.max(15, Math.min(85, Math.round(baseAge - adj)));
    }
  }

  return result;
}

/**
 * Get a label for brain age comparison
 */
export function brainAgeLabel(brainAge, ageRange) {
  if (brainAge == null) return '';
  const real = AGE_MIDPOINTS[ageRange] || 35;
  const diff = real - brainAge;
  if (diff >= 8) return 'Excepcional';
  if (diff >= 4) return 'Por encima de la media';
  if (diff >= 0) return 'En la media';
  if (diff >= -5) return 'Ligeramente por debajo';
  return 'Mejorable';
}
