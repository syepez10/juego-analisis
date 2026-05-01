export function erf(x) {
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign * y;
}

// Simulated percentile system (based on normal distribution of scores)
export function getPercentile(testId, score, total) {
  if (!total) return null;
  const pct = (score / total) * 100;
  // Simulated population curves per difficulty
  const mean = 62, std = 18;
  const z = (pct - mean) / std;
  const percentile = Math.round(Math.min(99, Math.max(1, 50 * (1 + erf(z / Math.SQRT2)))));
  return percentile;
}
