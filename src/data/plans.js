export const DAILY_TEST_LIMIT = 3;
export const XP_PER_TEST = 50;
export const XP_PER_PERFECT = 30;
export const XP_PER_STREAK_DAY = 20;

export const PLANS = [
  {
    id: "free", name: "Gratuito", price: "0\u20ac", period: "",
    badge: null, highlight: false,
    features: [
      { text: "5 tests desbloqueados", included: true },
      { text: `${DAILY_TEST_LIMIT} tests al d\u00eda`, included: true },
      { text: "Chequeo diario", included: true },
      { text: "Sistema de logros", included: true },
      { text: "Tests ilimitados", included: false },
      { text: "27 tests completos", included: false },
      { text: "Informes PDF", included: false },
      { text: "Percentiles por edad", included: false },
      { text: "Panel multi-paciente", included: false },
    ]
  },
  {
    id: "pro", name: "Pro", price: "4,99\u20ac", period: "/mes",
    badge: "Popular", highlight: true,
    features: [
      { text: "27 tests completos", included: true },
      { text: "Tests ilimitados al d\u00eda", included: true },
      { text: "Chequeo diario", included: true },
      { text: "Sistema de logros", included: true },
      { text: "Percentiles por edad", included: true },
      { text: "Informes PDF descargables", included: true },
      { text: "Historial completo", included: true },
      { text: "Plan semanal personalizado", included: true },
      { text: "Panel multi-paciente", included: false },
    ]
  },
  {
    id: "clinic", name: "Cl\u00ednica", price: "29,99\u20ac", period: "/mes",
    badge: "Profesional", highlight: false,
    features: [
      { text: "Todo lo de Pro", included: true },
      { text: "Panel multi-paciente", included: true },
      { text: "Hasta 50 pacientes", included: true },
      { text: "Informes cl\u00ednicos con logo", included: true },
      { text: "Exportaci\u00f3n de datos", included: true },
      { text: "Comparativa longitudinal", included: true },
      { text: "Soporte prioritario", included: true },
      { text: "Facturaci\u00f3n para empresa", included: true },
      { text: "API de integraci\u00f3n", included: true },
    ]
  },
];
