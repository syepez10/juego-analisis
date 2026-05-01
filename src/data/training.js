// 30-Day Cognitive Training Program — PRO Feature
// Progressive difficulty inspired by Duolingo's daily progression

export const TRAINING_PROGRAM = [
  // ═══════════════════════════════════════════════════
  // SEMANA 1: "Evaluación Base" (2 tests/día)
  // Cubrir las 4 categorías, establecer línea base
  // ═══════════════════════════════════════════════════
  {
    day: 1,
    title: "Conoce tu cerebro",
    desc: "Evaluación inicial de memoria y edad mental",
    tests: ["edad-mental", "memoria"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 2,
    title: "Reflejos al límite",
    desc: "Velocidad de procesamiento y reacción",
    tests: ["reaccion", "velocidad"],
    focus: "atencion",
    xpBonus: 20,
  },
  {
    day: 3,
    title: "Equilibrio interior",
    desc: "Evalúa tu estrés y calidad de sueño",
    tests: ["estres", "sueno"],
    focus: "bienestar",
    xpBonus: 15,
  },
  {
    day: 4,
    title: "Mente lógica",
    desc: "Razonamiento lógico y cociente intelectual",
    tests: ["logica", "ci"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 5,
    title: "Cómo aprendes",
    desc: "Descubre tu estilo de aprendizaje y lectura",
    tests: ["aprendizaje", "lectura"],
    focus: "aprendizaje",
    xpBonus: 15,
  },
  {
    day: 6,
    title: "Foco y precisión",
    desc: "Concentración y atención selectiva",
    tests: ["concentracion", "atencion-sel"],
    focus: "atencion",
    xpBonus: 20,
  },
  {
    day: 7,
    title: "Perfil completo",
    desc: "Personalidad cognitiva y comunicación",
    tests: ["personalidad", "comunicacion"],
    focus: "aprendizaje",
    xpBonus: 25,
  },

  // ═══════════════════════════════════════════════════
  // SEMANA 2: "Entrenamiento Dirigido" (2-3 tests/día)
  // Focalizarse en debilidades y áreas clave
  // ═══════════════════════════════════════════════════
  {
    day: 8,
    title: "Memoria activa",
    desc: "Entrena la memoria de trabajo y prospectiva",
    tests: ["mem-trabajo", "mem-futura"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 9,
    title: "Piloto automático",
    desc: "Conducción segura y gestión del tiempo",
    tests: ["conduccion", "gestion-tiempo"],
    focus: "atencion",
    xpBonus: 15,
  },
  {
    day: 10,
    title: "Resiliencia mental",
    desc: "Fortaleza interior y sensibilidad sensorial",
    tests: ["resiliencia", "sensorial", "emociones"],
    focus: "bienestar",
    xpBonus: 25,
  },
  {
    day: 11,
    title: "Pensamiento crítico",
    desc: "Detecta sesgos y activa funciones ejecutivas",
    tests: ["sesgos", "ejecutivas"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 12,
    title: "Creatividad sin límites",
    desc: "Pensamiento divergente y detección de dislexia",
    tests: ["creatividad", "dislexia"],
    focus: "aprendizaje",
    xpBonus: 20,
  },
  {
    day: 13,
    title: "Orientación espacial",
    desc: "Percepción visuoespacial y flexibilidad mental",
    tests: ["visuoespacial", "flexibilidad"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 14,
    title: "Sprint cognitivo",
    desc: "Velocidad, reacción y concentración bajo presión",
    tests: ["velocidad", "reaccion", "concentracion"],
    focus: "atencion",
    xpBonus: 30,
  },

  // ═══════════════════════════════════════════════════
  // SEMANA 3: "Desafío Avanzado" (2-3 tests/día)
  // Tests más difíciles, categorías mezcladas
  // ═══════════════════════════════════════════════════
  {
    day: 15,
    title: "Memoria total",
    desc: "Memoria visual, de trabajo y prospectiva",
    tests: ["memoria", "mem-trabajo", "mem-futura"],
    focus: "cognicion",
    xpBonus: 25,
  },
  {
    day: 16,
    title: "Atención dividida",
    desc: "Stroop, concentración y velocidad combinados",
    tests: ["atencion-sel", "concentracion"],
    focus: "atencion",
    xpBonus: 25,
  },
  {
    day: 17,
    title: "Inteligencia emocional",
    desc: "Emociones, comunicación y resiliencia",
    tests: ["emociones", "comunicacion", "resiliencia"],
    focus: "bienestar",
    xpBonus: 25,
  },
  {
    day: 18,
    title: "Razonamiento puro",
    desc: "Lógica, CI y sesgos cognitivos",
    tests: ["logica", "ci", "sesgos"],
    focus: "cognicion",
    xpBonus: 30,
  },
  {
    day: 19,
    title: "Velocidad mental",
    desc: "Reacción rápida y procesamiento ágil",
    tests: ["reaccion", "velocidad"],
    focus: "atencion",
    xpBonus: 20,
  },
  {
    day: 20,
    title: "Aprende mejor",
    desc: "Lectura rápida, creatividad y estilo de aprendizaje",
    tests: ["lectura", "creatividad", "aprendizaje"],
    focus: "aprendizaje",
    xpBonus: 25,
  },
  {
    day: 21,
    title: "Desafío mixto",
    desc: "Ejecutivas, flexibilidad y gestión del tiempo",
    tests: ["ejecutivas", "flexibilidad", "gestion-tiempo"],
    focus: "cognicion",
    xpBonus: 30,
  },

  // ═══════════════════════════════════════════════════
  // SEMANA 4: "Especialización" (2 tests/día)
  // Profundización en habilidades clave
  // ═══════════════════════════════════════════════════
  {
    day: 22,
    title: "Memoria maestra",
    desc: "Domina todos los tipos de memoria",
    tests: ["memoria", "mem-trabajo"],
    focus: "cognicion",
    xpBonus: 20,
  },
  {
    day: 23,
    title: "Atención de élite",
    desc: "Concentración y atención selectiva al máximo",
    tests: ["concentracion", "atencion-sel"],
    focus: "atencion",
    xpBonus: 20,
  },
  {
    day: 24,
    title: "Bienestar integral",
    desc: "Sueño y sensibilidad sensorial",
    tests: ["sueno", "sensorial"],
    focus: "bienestar",
    xpBonus: 15,
  },
  {
    day: 25,
    title: "Lógica avanzada",
    desc: "Lógica y percepción visuoespacial",
    tests: ["logica", "visuoespacial"],
    focus: "cognicion",
    xpBonus: 25,
  },
  {
    day: 26,
    title: "Velocidad extrema",
    desc: "Procesamiento y reacción a máxima velocidad",
    tests: ["velocidad", "reaccion"],
    focus: "atencion",
    xpBonus: 25,
  },
  {
    day: 27,
    title: "Mente creativa",
    desc: "Creatividad y flexibilidad cognitiva",
    tests: ["creatividad", "flexibilidad"],
    focus: "aprendizaje",
    xpBonus: 20,
  },
  {
    day: 28,
    title: "Estratega mental",
    desc: "Funciones ejecutivas y sesgos cognitivos",
    tests: ["ejecutivas", "sesgos"],
    focus: "cognicion",
    xpBonus: 25,
  },

  // ═══════════════════════════════════════════════════
  // DÍAS 29-30: "Evaluación Final"
  // Repetir tests iniciales para medir mejora
  // ═══════════════════════════════════════════════════
  {
    day: 29,
    title: "Evaluación final I",
    desc: "Repite los tests iniciales y mide tu progreso",
    tests: ["edad-mental", "memoria", "reaccion"],
    focus: "cognicion",
    xpBonus: 30,
  },
  {
    day: 30,
    title: "Graduación cognitiva",
    desc: "Última evaluación — compara tu evolución total",
    tests: ["logica", "ci", "velocidad"],
    focus: "cognicion",
    xpBonus: 30,
  },
];

// Week metadata for section headers
export const TRAINING_WEEKS = [
  { week: 1, title: "Evaluación Base",        days: [1, 7],   desc: "Establece tu línea base cognitiva",          icon: "clipboard" },
  { week: 2, title: "Entrenamiento Dirigido",  days: [8, 14],  desc: "Refuerza tus áreas más débiles",             icon: "target" },
  { week: 3, title: "Desafío Avanzado",        days: [15, 21], desc: "Pruebas más difíciles, categorías mezcladas", icon: "flame" },
  { week: 4, title: "Especialización",         days: [22, 28], desc: "Profundiza en habilidades clave",            icon: "star" },
  { week: 5, title: "Evaluación Final",        days: [29, 30], desc: "Mide tu mejora total",                       icon: "trophy" },
];

// Category icons for focus display
export const FOCUS_ICONS = {
  cognicion: "brain",
  atencion: "zap",
  bienestar: "heart",
  aprendizaje: "graduation-cap",
};

// Category labels
export const FOCUS_LABELS = {
  cognicion: "Cognición",
  atencion: "Atención",
  bienestar: "Bienestar",
  aprendizaje: "Aprendizaje",
};
