// ═══════════════════════════════════════════════════
// Supplements Catalog — Affiliate Recommendations
// ═══════════════════════════════════════════════════

// ─── CONFIGURA TUS LINKS DE AFILIADO AQUI ─────────
export const AFFILIATE_CONFIG = {
  // Amazon Associates — cambia 'TU-TAG-21' por tu tag real
  amazon: {
    tag: 'TU-TAG-21',
    baseUrl: 'https://www.amazon.es/dp/',
  },
  // iHerb — cambia 'TU-CODIGO' por tu codigo de referido
  iherb: {
    code: 'TU-CODIGO',
    baseUrl: 'https://es.iherb.com/',
  },
};

// ─── Helper para construir URL con tag de afiliado ─
export function getAffiliateUrl(supplement) {
  if (supplement.urls.amazon) {
    const { tag, baseUrl } = AFFILIATE_CONFIG.amazon;
    return `${baseUrl}${supplement.urls.amazon}?tag=${tag}`;
  }
  if (supplement.urls.iherb) {
    const { code, baseUrl } = AFFILIATE_CONFIG.iherb;
    return `${baseUrl}${supplement.urls.iherb}?rcode=${code}`;
  }
  if (supplement.urls.custom) {
    return supplement.urls.custom;
  }
  return null;
}

export function getAffiliatePlatform(supplement) {
  if (supplement.urls.amazon) return 'Amazon';
  if (supplement.urls.iherb) return 'iHerb';
  return 'Tienda';
}

// ─── CATALOGO DE SUPLEMENTOS ──────────────────────

export const SUPPLEMENTS = [
  // === OMEGA-3 ===
  {
    id: 'omega-3',
    name: 'Omega-3 (EPA/DHA)',
    brand: 'Nordic Naturals Ultimate Omega',
    emoji: '🐟',
    categories: ['cognicion', 'bienestar', 'aprendizaje'],
    benefits: ['Memoria', 'Neuroproteccion', 'Estado de animo'],
    dose: '1000-2000mg EPA+DHA/dia',
    evidence: 'alta',
    description: 'Los acidos grasos omega-3 son componentes estructurales del cerebro. EPA y DHA mejoran la comunicacion neuronal, reducen la inflamacion cerebral y apoyan la plasticidad sinaptica.',
    urls: { amazon: 'B01GV4O37E' },
    price: '20-30€',
  },

  // === LION'S MANE ===
  {
    id: 'lions-mane',
    name: 'Melena de Leon (Lion\'s Mane)',
    brand: 'Real Mushrooms',
    emoji: '🍄',
    categories: ['cognicion', 'aprendizaje'],
    benefits: ['Neurogenesis', 'Memoria', 'Concentracion'],
    dose: '500-1000mg/dia (extracto)',
    evidence: 'media',
    description: 'Hongo medicinal que estimula la produccion del factor de crecimiento nervioso (NGF), promoviendo la regeneracion neuronal y la mejora de la memoria.',
    urls: { amazon: 'B078SZX3ML' },
    price: '25-35€',
  },

  // === BACOPA MONNIERI ===
  {
    id: 'bacopa',
    name: 'Bacopa Monnieri',
    brand: 'Himalaya Organic',
    emoji: '🌿',
    categories: ['cognicion', 'aprendizaje'],
    benefits: ['Memoria', 'Aprendizaje', 'Ansiedad'],
    dose: '300-600mg/dia (extracto 50% bacosidos)',
    evidence: 'alta',
    description: 'Planta ayurvedica con fuerte evidencia en mejora de la memoria y velocidad de procesamiento. Los efectos se notan a partir de 8-12 semanas de uso continuado.',
    urls: { amazon: 'B0006NZPGA' },
    price: '15-22€',
  },

  // === VITAMINA B12 ===
  {
    id: 'b12',
    name: 'Vitamina B12 (Metilcobalamina)',
    brand: 'Solgar',
    emoji: '💊',
    categories: ['cognicion', 'bienestar'],
    benefits: ['Energia mental', 'Funcion nerviosa', 'Estado de animo'],
    dose: '1000-2000mcg/dia',
    evidence: 'alta',
    description: 'Esencial para la formacion de mielina y la sintesis de neurotransmisores. El deficit de B12 causa deterioro cognitivo reversible. La metilcobalamina es la forma mas biodisponible.',
    urls: { amazon: 'B00020IEMQ' },
    price: '10-18€',
  },

  // === ALPHA-GPC ===
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    brand: 'NOW Foods',
    emoji: '🧪',
    categories: ['cognicion', 'aprendizaje'],
    benefits: ['Acetilcolina', 'Memoria', 'Concentracion'],
    dose: '300-600mg/dia',
    evidence: 'media',
    description: 'Precursor de acetilcolina, el neurotransmisor clave para la memoria y el aprendizaje. Atraviesa la barrera hematoencefalica eficientemente.',
    urls: { amazon: 'B001RVIFL0' },
    price: '18-28€',
  },

  // === CREATINA ===
  {
    id: 'creatina',
    name: 'Creatina Monohidrato',
    brand: 'Optimum Nutrition',
    emoji: '⚡',
    categories: ['cognicion', 'atencion'],
    benefits: ['Energia cerebral', 'Razonamiento', 'Fatiga mental'],
    dose: '3-5g/dia',
    evidence: 'alta',
    description: 'No solo para deportistas: la creatina proporciona ATP al cerebro, mejorando el razonamiento bajo fatiga y la memoria de trabajo. Especialmente util en vegetarianos.',
    urls: { amazon: 'B002DYIZEO' },
    price: '15-25€',
  },

  // === L-TEANINA ===
  {
    id: 'l-teanina',
    name: 'L-Teanina',
    brand: 'NOW Foods',
    emoji: '🍵',
    categories: ['atencion', 'bienestar'],
    benefits: ['Calma alerta', 'Concentracion', 'Ondas alfa'],
    dose: '100-200mg/dia',
    evidence: 'alta',
    description: 'Aminoacido del te verde que promueve ondas alfa cerebrales: estado de calma sin somnolencia. Sinergia demostrada con cafeina para atencion sostenida.',
    urls: { amazon: 'B0013OQGO6' },
    price: '12-18€',
  },

  // === RHODIOLA ROSEA ===
  {
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    brand: 'Solaray',
    emoji: '🌸',
    categories: ['atencion', 'bienestar'],
    benefits: ['Anti-fatiga', 'Rendimiento mental', 'Estres'],
    dose: '200-400mg/dia (3% rosavinas)',
    evidence: 'media',
    description: 'Adaptogeno que reduce la fatiga mental y mejora el rendimiento cognitivo bajo estres. Actua sobre serotonina y dopamina.',
    urls: { amazon: 'B0019GW3G8' },
    price: '15-22€',
  },

  // === CAFEINA + L-TEANINA ===
  {
    id: 'cafeina-teanina',
    name: 'Cafeina + L-Teanina',
    brand: 'Natural Stacks',
    emoji: '☕',
    categories: ['atencion'],
    benefits: ['Focus', 'Alerta', 'Sin nerviosismo'],
    dose: '100mg cafeina + 200mg L-teanina',
    evidence: 'alta',
    description: 'El stack nootropical mas estudiado. La L-teanina suaviza los picos de ansiedad de la cafeina manteniendo sus beneficios en alerta y concentracion.',
    urls: { amazon: 'B01921TUGC' },
    price: '18-25€',
  },

  // === GINKGO BILOBA ===
  {
    id: 'ginkgo',
    name: 'Ginkgo Biloba',
    brand: 'Nature\'s Bounty',
    emoji: '🌳',
    categories: ['atencion', 'aprendizaje'],
    benefits: ['Circulacion cerebral', 'Memoria', 'Concentracion'],
    dose: '120-240mg/dia (extracto estandarizado)',
    evidence: 'media',
    description: 'Mejora el flujo sanguineo cerebral y la oxigenacion neuronal. Evidencia moderada en memoria y velocidad de procesamiento, especialmente en adultos mayores.',
    urls: { amazon: 'B000GG5GYC' },
    price: '12-20€',
  },

  // === ASHWAGANDHA ===
  {
    id: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    brand: 'Natrol',
    emoji: '🧘',
    categories: ['bienestar', 'cognicion'],
    benefits: ['Estres', 'Sueno', 'Cortisol'],
    dose: '300-600mg/dia (extracto raiz)',
    evidence: 'alta',
    description: 'Adaptogeno con fuerte evidencia en reduccion de cortisol (-30%), mejora del sueno y reduccion de ansiedad. El extracto KSM-66 es el mas estudiado.',
    urls: { amazon: 'B07BGJSXFN' },
    price: '15-25€',
  },

  // === MAGNESIO ===
  {
    id: 'magnesio',
    name: 'Magnesio (Bisglicinato)',
    brand: 'Doctor\'s Best',
    emoji: '🪨',
    categories: ['bienestar', 'cognicion'],
    benefits: ['Relajacion', 'Sueno', 'Funcion nerviosa'],
    dose: '200-400mg/dia',
    evidence: 'alta',
    description: 'El 75% de la poblacion tiene deficit de magnesio. Esencial para >300 reacciones enzimaticas, incluyendo la transmision nerviosa. El bisglicinato tiene mejor absorcion y no causa molestias digestivas.',
    urls: { amazon: 'B000BD0RT0' },
    price: '12-20€',
  },

  // === VITAMINA D3 ===
  {
    id: 'vitamina-d',
    name: 'Vitamina D3 + K2',
    brand: 'Solgar',
    emoji: '☀️',
    categories: ['bienestar'],
    benefits: ['Estado de animo', 'Inmunidad', 'Funcion cerebral'],
    dose: '2000-4000 UI/dia',
    evidence: 'alta',
    description: 'La "vitamina del sol" regula la serotonina y protege las neuronas. Deficit asociado a depresion, deterioro cognitivo y fatiga. La K2 optimiza su absorcion.',
    urls: { amazon: 'B007IP4TI4' },
    price: '10-16€',
  },

  // === MELATONINA ===
  {
    id: 'melatonina',
    name: 'Melatonina',
    brand: 'Solgar',
    emoji: '🌙',
    categories: ['bienestar'],
    benefits: ['Sueno', 'Ritmo circadiano', 'Recuperacion'],
    dose: '0.5-3mg 30min antes de dormir',
    evidence: 'alta',
    description: 'Hormona natural del sueno. Dosis bajas (0.5-1mg) son igual de efectivas que dosis altas con menos efectos secundarios. Ideal para jet lag o turnos rotatorios.',
    urls: { amazon: 'B00016R3CE' },
    price: '8-14€',
  },

  // === 5-HTP ===
  {
    id: '5-htp',
    name: '5-HTP (Griffonia)',
    brand: 'NOW Foods',
    emoji: '🧬',
    categories: ['bienestar'],
    benefits: ['Serotonina', 'Estado de animo', 'Sueno'],
    dose: '100-200mg/dia',
    evidence: 'media',
    description: 'Precursor directo de serotonina. Puede mejorar el estado de animo, reducir la ansiedad y promover un sueno reparador. No combinar con antidepresivos ISRS.',
    urls: { amazon: 'B0013OQI1W' },
    price: '12-18€',
  },

  // === FOSFATIDILSERINA ===
  {
    id: 'fosfatidilserina',
    name: 'Fosfatidilserina',
    brand: 'Jarrow Formulas',
    emoji: '🔬',
    categories: ['aprendizaje', 'cognicion'],
    benefits: ['Memoria', 'Cortisol', 'Aprendizaje'],
    dose: '100-300mg/dia',
    evidence: 'media',
    description: 'Fosfolipido esencial de las membranas neuronales. Mejora la memoria, reduce el cortisol post-ejercicio y apoya la comunicacion entre neuronas.',
    urls: { amazon: 'B0013OQUNQ' },
    price: '20-30€',
  },

  // === CURCUMINA ===
  {
    id: 'curcumina',
    name: 'Curcumina (Longvida)',
    brand: 'NOW Foods',
    emoji: '🌾',
    categories: ['cognicion', 'bienestar'],
    benefits: ['Antiinflamatorio', 'Neuroproteccion', 'Memoria'],
    dose: '500-1000mg/dia (con piperina o liposomal)',
    evidence: 'media',
    description: 'Potente antiinflamatorio natural que cruza la barrera hematoencefalica. Reduce la neuroinflamacion asociada al deterioro cognitivo. La forma Longvida tiene 65x mas biodisponibilidad.',
    urls: { amazon: 'B003VWXZPC' },
    price: '18-28€',
  },

  // === COENZIMA Q10 ===
  {
    id: 'coq10',
    name: 'Coenzima Q10 (Ubiquinol)',
    brand: 'Kaneka',
    emoji: '🔋',
    categories: ['cognicion', 'bienestar'],
    benefits: ['Energia celular', 'Antioxidante', 'Neuroproteccion'],
    dose: '100-200mg/dia',
    evidence: 'media',
    description: 'Antioxidante mitocondrial que potencia la produccion de energia celular. Los niveles disminuyen con la edad. El ubiquinol es la forma activa y mejor absorbida.',
    urls: { amazon: 'B003DSLKRW' },
    price: '20-35€',
  },

  // === ZINC ===
  {
    id: 'zinc',
    name: 'Zinc (Picolinato)',
    brand: 'Solgar',
    emoji: '🛡️',
    categories: ['cognicion', 'atencion'],
    benefits: ['Neurotransmisores', 'Atencion', 'Inmunidad'],
    dose: '15-30mg/dia',
    evidence: 'media',
    description: 'Mineral esencial para la sinapsis y la modulacion de neurotransmisores. El deficit de zinc afecta la atencion, la memoria y el aprendizaje. El picolinato tiene la mejor absorcion.',
    urls: { amazon: 'B00020IBAG' },
    price: '8-14€',
  },

  // === COMPLEJO B ===
  {
    id: 'complejo-b',
    name: 'Complejo Vitamina B',
    brand: 'Solgar B-Complex',
    emoji: '💛',
    categories: ['bienestar', 'cognicion', 'atencion'],
    benefits: ['Energia', 'Sistema nervioso', 'Metabolismo'],
    dose: '1 capsula/dia',
    evidence: 'alta',
    description: 'Las vitaminas del grupo B (B1, B6, B9, B12) son cofactores esenciales en la produccion de energia cerebral y la sintesis de neurotransmisores como serotonina y dopamina.',
    urls: { amazon: 'B00020ICKE' },
    price: '12-20€',
  },
];

// ─── MAPPING: Categoria + nivel → suplementos ─────

export const SUPPLEMENT_MAP = {
  cognicion: {
    low:  ['omega-3', 'lions-mane', 'bacopa', 'b12', 'alpha-gpc', 'magnesio'],
    mid:  ['omega-3', 'bacopa', 'lions-mane', 'curcumina', 'creatina'],
    high: ['omega-3', 'creatina', 'curcumina'],
  },
  atencion: {
    low:  ['l-teanina', 'cafeina-teanina', 'rhodiola', 'ginkgo', 'zinc'],
    mid:  ['l-teanina', 'rhodiola', 'cafeina-teanina', 'creatina'],
    high: ['l-teanina', 'omega-3'],
  },
  bienestar: {
    low:  ['ashwagandha', 'magnesio', 'vitamina-d', 'melatonina', '5-htp'],
    mid:  ['ashwagandha', 'magnesio', 'vitamina-d', 'complejo-b'],
    high: ['ashwagandha', 'magnesio', 'omega-3'],
  },
  aprendizaje: {
    low:  ['bacopa', 'ginkgo', 'alpha-gpc', 'fosfatidilserina', 'omega-3'],
    mid:  ['bacopa', 'alpha-gpc', 'omega-3', 'lions-mane'],
    high: ['omega-3', 'creatina', 'bacopa'],
  },
};

// ─── Helper: obtener suplementos recomendados ──────

export function getRecommendedSupplements(category, level, max = 3) {
  const ids = SUPPLEMENT_MAP[category]?.[level] || SUPPLEMENT_MAP[category]?.mid || [];
  return ids
    .slice(0, max)
    .map(id => SUPPLEMENTS.find(s => s.id === id))
    .filter(Boolean);
}

// ─── Colores por nivel de evidencia ────────────────

export const EVIDENCE_COLORS = {
  alta:  { bg: '#D8F3DC', text: '#1B4332', border: '#95D5B2', label: 'Evidencia alta' },
  media: { bg: '#FFF8E1', text: '#7C5C00', border: '#E8C97A', label: 'Evidencia media' },
  baja:  { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', label: 'Evidencia limitada' },
};
