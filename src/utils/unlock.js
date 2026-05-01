// Progressive unlock system
export const UNLOCK_SCHEDULE = [
  { level: 0, ids: ["edad-mental", "reaccion", "estres", "concentracion", "aprendizaje"] }, // Free tier
  { level: 2, ids: ["memoria", "logica", "dislexia"] },
  { level: 3, ids: ["ci", "mem-trabajo", "sesgos", "conduccion"] },
  { level: 4, ids: ["atencion-sel", "resiliencia", "emociones", "comunicacion"] },
  { level: 5, ids: ["ejecutivas", "sueno", "velocidad", "sensorial"] },
  { level: 6, ids: ["mem-futura", "flexibilidad", "creatividad", "visuoespacial"] },
  { level: 7, ids: ["gestion-tiempo", "personalidad", "lectura"] },
];

export function getUnlockedTestIds(level) {
  const ids = new Set();
  for (const tier of UNLOCK_SCHEDULE) {
    if (level >= tier.level) tier.ids.forEach(id => ids.add(id));
  }
  return ids;
}

export function getUnlockLevel(testId) {
  for (const tier of UNLOCK_SCHEDULE) {
    if (tier.ids.includes(testId)) return tier.level;
  }
  return 0;
}
