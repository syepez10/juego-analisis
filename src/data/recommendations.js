export const RECS = {
  "edad-mental": {
    low: {
      emoji: "🧓", summary: "Tu cerebro necesita más estimulación diaria",
      tips: [
        { icon: "🧩", title: "Puzzles diarios", desc: "Dedica 15 min al día a sudokus, crucigramas o rompecabezas. Activan memoria y razonamiento." },
        { icon: "📖", title: "Lectura activa", desc: "Lee 20 páginas al día e intenta resumir lo leído de memoria. Fortalece conexiones neuronales." },
        { icon: "🏃", title: "Ejercicio aeróbico", desc: "30 min de caminata rápida aumentan el flujo sanguíneo cerebral y generan nuevas neuronas." },
        { icon: "😴", title: "Sueño reparador", desc: "Duerme 7-8h. Durante el sueño el cerebro consolida memorias y elimina toxinas." },
      ],
      related: ["memoria", "concentracion", "flexibilidad"],
      professional: "Neuropsicólogo o geriatra para evaluación cognitiva completa."
    },
    mid: {
      emoji: "🧠", summary: "Tu cerebro está en buen estado — puedes potenciarlo aún más",
      tips: [
        { icon: "🎵", title: "Aprende música", desc: "Tocar un instrumento activa múltiples áreas cerebrales simultáneamente." },
        { icon: "🌍", title: "Nuevo idioma", desc: "Aprender idiomas retrasa el deterioro cognitivo hasta 5 años." },
        { icon: "🧘", title: "Meditación", desc: "10 min diarios de mindfulness mejoran atención y reducen estrés oxidativo cerebral." },
        { icon: "🥗", title: "Dieta mediterránea", desc: "Omega-3, frutas y verduras protegen las neuronas. Evita ultraprocesados." },
      ],
      related: ["logica", "mem-trabajo", "creatividad"],
      professional: null
    },
    high: {
      emoji: "⚡", summary: "¡Tu cerebro es joven y ágil! Mantén estos hábitos",
      tips: [
        { icon: "🏆", title: "Retos avanzados", desc: "Prueba ajedrez competitivo, programación o aprendizaje de habilidades complejas." },
        { icon: "🤝", title: "Enseña a otros", desc: "Enseñar consolida el conocimiento y crea nuevas rutas neuronales." },
        { icon: "💤", title: "No descuides el descanso", desc: "Incluso cerebros jóvenes necesitan recuperación. Mantén tu rutina de sueño." },
      ],
      related: ["ci", "sesgos", "visuoespacial"],
      professional: null
    }
  },
  "logica": {
    low: {
      emoji: "📐", summary: "Tu razonamiento lógico tiene margen de mejora",
      tips: [
        { icon: "🔢", title: "Series numéricas", desc: "Practica 10 min diarios con secuencias numéricas. Empieza fácil y sube dificultad." },
        { icon: "♟️", title: "Juegos de estrategia", desc: "Ajedrez, damas o juegos de mesa de estrategia entrenan el pensamiento lógico." },
        { icon: "🧮", title: "Cálculo mental", desc: "Haz operaciones mentales al comprar o cocinar. Fortalece razonamiento numérico." },
        { icon: "📊", title: "Acertijos lógicos", desc: "Resuelve un acertijo al día. Hay apps gratuitas con miles de problemas." },
      ],
      related: ["ci", "sesgos", "ejecutivas"],
      professional: "Psicopedagogo para técnicas de razonamiento."
    },
    mid: { emoji: "🧩", summary: "Buen nivel lógico — sigue afinando",
      tips: [
        { icon: "💻", title: "Pensamiento computacional", desc: "Aprende programación básica: entrena la lógica de forma aplicada." },
        { icon: "📚", title: "Lógica formal", desc: "Lee sobre falacias lógicas y argumentación. Mejora tu pensamiento crítico." },
        { icon: "🎯", title: "Problemas GMAT/GRE", desc: "Estos tests estandarizados tienen excelentes ejercicios de lógica avanzada." },
      ],
      related: ["sesgos", "ejecutivas", "creatividad"], professional: null },
    high: { emoji: "🌟", summary: "¡Excelente lógica! Desafía tus límites",
      tips: [
        { icon: "🧬", title: "Problemas abiertos", desc: "Afronta problemas sin solución única para entrenar pensamiento divergente." },
        { icon: "🤖", title: "Inteligencia artificial", desc: "Estudia IA y machine learning — la frontera del razonamiento lógico." },
      ],
      related: ["creatividad", "visuoespacial", "ci"], professional: null }
  },
  "ci": {
    low: { emoji: "📘", summary: "Hay áreas de tu inteligencia que puedes estimular",
      tips: [
        { icon: "📖", title: "Vocabulario activo", desc: "Aprende una palabra nueva cada día y úsala en contexto. Mejora el CI verbal." },
        { icon: "🔢", title: "Matemáticas prácticas", desc: "Practica cálculo mental con apps como Brilliant o Khan Academy." },
        { icon: "🧩", title: "Puzzles espaciales", desc: "Tangram, Rubik o puzzles 3D mejoran el razonamiento espacial." },
        { icon: "📝", title: "Escritura reflexiva", desc: "Escribir un diario mejora la articulación verbal y el pensamiento analítico." },
      ],
      related: ["logica", "mem-trabajo", "visuoespacial"],
      professional: "Neuropsicólogo para evaluación estandarizada (WAIS-IV)."
    },
    mid: { emoji: "🎓", summary: "CI en buen rango — potencia tus puntos fuertes",
      tips: [
        { icon: "🌍", title: "Cultura general", desc: "Lee sobre historia, ciencia y arte. La inteligencia cristalizada crece con la edad." },
        { icon: "🧠", title: "Entrenamiento dual-n-back", desc: "Esta técnica mejora la memoria de trabajo y la inteligencia fluida." },
      ],
      related: ["sesgos", "creatividad", "logica"], professional: null },
    high: { emoji: "💡", summary: "¡CI superior! Aprovecha tu potencial",
      tips: [
        { icon: "🎯", title: "Metas desafiantes", desc: "Busca retos intelectuales que te lleven al límite de tu zona de confort." },
        { icon: "🤝", title: "Inteligencia emocional", desc: "Complementa tu CI alto con habilidades sociales y empatía." },
      ],
      related: ["emociones", "comunicacion", "creatividad"], professional: null }
  },
  "memoria": {
    low: { emoji: "💭", summary: "Tu memoria necesita entrenamiento regular",
      tips: [
        { icon: "🏠", title: "Palacio de memoria", desc: "Asocia información a lugares familiares. Técnica milenaria muy efectiva." },
        { icon: "🔁", title: "Repetición espaciada", desc: "Usa apps como Anki: repite información en intervalos crecientes." },
        { icon: "📝", title: "Escribe a mano", desc: "Escribir activa más áreas cerebrales que teclear. Toma notas a mano." },
        { icon: "🐟", title: "Omega-3", desc: "Pescado azul, nueces y semillas de lino nutren las membranas neuronales." },
        { icon: "🏃", title: "Ejercicio regular", desc: "El ejercicio aeróbico aumenta el hipocampo, centro de la memoria." },
      ],
      related: ["mem-trabajo", "mem-futura", "concentracion"],
      professional: "Neurólogo si la pérdida de memoria afecta la vida diaria. Logopeda para rehabilitación."
    },
    mid: { emoji: "📋", summary: "Memoria normal — estas técnicas la potenciarán",
      tips: [
        { icon: "🎨", title: "Visualización", desc: "Crea imágenes mentales vívidas de lo que quieres recordar." },
        { icon: "🔗", title: "Asociaciones", desc: "Conecta información nueva con algo que ya conoces." },
        { icon: "😴", title: "Sueño de calidad", desc: "El sueño profundo es esencial para consolidar memorias." },
      ],
      related: ["mem-trabajo", "concentracion", "sueno"], professional: null },
    high: { emoji: "🌟", summary: "¡Memoria excepcional! Mantén el nivel",
      tips: [
        { icon: "🎭", title: "Memoriza discursos", desc: "Aprende poemas o monólogos de memoria para mantener el nivel." },
        { icon: "🗺️", title: "Navega sin GPS", desc: "Orientarte sin tecnología ejercita la memoria espacial." },
      ],
      related: ["mem-trabajo", "visuoespacial", "lectura"], professional: null }
  },
  "reaccion": {
    low: { emoji: "🐢", summary: "Tus reflejos pueden mejorar con práctica",
      tips: [
        { icon: "🏓", title: "Deportes de raqueta", desc: "Ping-pong, bádminton y tenis mejoran drásticamente los reflejos." },
        { icon: "🎮", title: "Videojuegos de acción", desc: "Estudios demuestran que mejoran el tiempo de reacción y la atención visual." },
        { icon: "☕", title: "Cafeína moderada", desc: "Una dosis moderada de cafeína mejora temporalmente la velocidad de reacción." },
        { icon: "💤", title: "Descansa bien", desc: "La falta de sueño ralentiza los reflejos hasta un 300%." },
      ],
      related: ["velocidad", "concentracion", "atencion-sel"],
      professional: "Oftalmólogo y neurólogo si los reflejos son muy lentos."
    },
    mid: { emoji: "⚡", summary: "Reflejos normales — afínalos aún más",
      tips: [
        { icon: "🏃", title: "Ejercicio HIIT", desc: "El entrenamiento por intervalos mejora la velocidad neuronal." },
        { icon: "🧘", title: "Mindfulness", desc: "La meditación mejora la atención y por tanto los tiempos de reacción." },
      ],
      related: ["velocidad", "atencion-sel", "concentracion"], professional: null },
    high: { emoji: "🏎️", summary: "¡Reflejos de élite! Mantén tu agilidad",
      tips: [
        { icon: "🥊", title: "Artes marciales", desc: "Mantén tus reflejos con deportes que requieren reacción rápida." },
        { icon: "🧠", title: "Sigue practicando", desc: "Los reflejos se pierden sin uso. Practica regularmente." },
      ],
      related: ["velocidad", "atencion-sel"], professional: null }
  },
  "dislexia": {
    low: { emoji: "📖", summary: "Se detectan dificultades de lectura — busca apoyo",
      tips: [
        { icon: "🔤", title: "Fuentes especiales", desc: "Usa OpenDyslexic o Lexie Readable, diseñadas para facilitar la lectura." },
        { icon: "🎧", title: "Audiolibros", desc: "Complementa la lectura visual con audio. Refuerza comprensión." },
        { icon: "✍️", title: "Escritura multisensorial", desc: "Traza letras en arena o plastilina. Activa más vías cerebrales." },
        { icon: "📱", title: "Apps de fonética", desc: "GraphoGame y Piruletras están diseñadas para dislexia." },
      ],
      related: ["lectura", "mem-trabajo", "concentracion"],
      professional: "Logopeda especializado en dislexia. Psicopedagogo para adaptaciones escolares."
    },
    mid: { emoji: "📝", summary: "Indicios leves — con práctica mejorarás",
      tips: [
        { icon: "📚", title: "Lectura diaria", desc: "20 min al día de lectura en voz alta mejoran la fluidez." },
        { icon: "🎵", title: "Ritmo y fonética", desc: "Canciones y rimas refuerzan la conciencia fonológica." },
      ],
      related: ["lectura", "concentracion"], professional: "Logopeda para evaluación preventiva." },
    high: { emoji: "✅", summary: "Sin indicios de dislexia — sigue leyendo",
      tips: [
        { icon: "📖", title: "Lectura variada", desc: "Lee géneros distintos para mantener la flexibilidad lectora." },
      ],
      related: ["lectura", "creatividad"], professional: null }
  },
  "estres": {
    low: { emoji: "🌿", summary: "Bajo estrés — ¡sigue cuidándote!",
      tips: [
        { icon: "🧘", title: "Mantén tu rutina", desc: "Sigue con las prácticas que te funcionan: ejercicio, relaciones, descanso." },
        { icon: "📋", title: "Prevención", desc: "Identifica tus señales tempranas de estrés para actuar antes." },
      ],
      related: ["resiliencia", "sueno"], professional: null },
    mid: { emoji: "⚠️", summary: "Estrés moderado — momento de actuar",
      tips: [
        { icon: "🫁", title: "Respiración 4-7-8", desc: "Inhala 4s, retén 7s, exhala 8s. 3 veces al día reduce cortisol." },
        { icon: "🏃", title: "Ejercicio diario", desc: "30 min de actividad física liberan endorfinas y reducen estrés." },
        { icon: "📵", title: "Desconexión digital", desc: "1h sin pantallas antes de dormir. Las noticias amplifican la ansiedad." },
        { icon: "📓", title: "Diario de gratitud", desc: "Escribe 3 cosas positivas al día. Cambia el enfoque mental." },
      ],
      related: ["sueno", "resiliencia", "gestion-tiempo"],
      professional: "Psicólogo para técnicas de gestión del estrés." },
    high: { emoji: "🚨", summary: "Nivel de estrés alto — busca apoyo profesional",
      tips: [
        { icon: "🆘", title: "Pide ayuda", desc: "No tienes que manejarlo solo/a. Habla con alguien de confianza." },
        { icon: "🧘", title: "Relajación progresiva", desc: "Tensa y relaja cada grupo muscular. 15 min diarios." },
        { icon: "📋", title: "Reduce compromisos", desc: "Aprende a decir no. Prioriza tu salud mental." },
        { icon: "🌳", title: "Naturaleza", desc: "20 min en un espacio verde reduce cortisol significativamente." },
      ],
      related: ["sueno", "resiliencia", "sensorial"],
      professional: "Psicólogo clínico o psiquiatra. Línea de atención al ciudadano: 024." }
  },
  "conduccion": {
    low: { emoji: "🚗", summary: "Algunas funciones para conducir necesitan atención",
      tips: [
        { icon: "👁️", title: "Revisión visual", desc: "Asegúrate de que tu visión está actualizada. Revisa cada año." },
        { icon: "🔄", title: "Práctica guiada", desc: "Conduce con alguien de confianza para recuperar confianza." },
        { icon: "⏰", title: "Evita horas pico", desc: "Conduce en horarios de menos tráfico mientras mejoras." },
      ],
      related: ["reaccion", "concentracion", "atencion-sel"],
      professional: "Centro de reconocimiento médico. Neurólogo si hay deterioro cognitivo."
    },
    mid: { emoji: "✅", summary: "Aptitud adecuada — mantén la práctica",
      tips: [
        { icon: "🏫", title: "Curso de reciclaje", desc: "Un curso de conducción actualiza conocimientos y reflejos." },
        { icon: "😴", title: "Nunca conduzcas cansado", desc: "La somnolencia es tan peligrosa como el alcohol." },
      ],
      related: ["reaccion", "concentracion"], professional: null },
    high: { emoji: "🏆", summary: "¡Excelente aptitud! Sigue siendo prudente",
      tips: [
        { icon: "📋", title: "Revisiones periódicas", desc: "Mantén al día las revisiones médicas y del vehículo." },
      ],
      related: ["reaccion", "velocidad"], professional: null }
  },
  "concentracion": {
    low: { emoji: "🎯", summary: "Tu atención necesita entrenamiento",
      tips: [
        { icon: "⏱️", title: "Técnica Pomodoro", desc: "25 min de foco + 5 de descanso. Aumenta gradualmente." },
        { icon: "📵", title: "Elimina distracciones", desc: "Silencia notificaciones. Un entorno limpio mejora la concentración." },
        { icon: "🧘", title: "Mindfulness", desc: "Meditar 10 min al día mejora la atención sostenida en semanas." },
        { icon: "🎵", title: "Sonidos binaurales", desc: "Música de frecuencias específicas mejora la concentración." },
      ],
      related: ["atencion-sel", "ejecutivas", "gestion-tiempo"],
      professional: "Psicólogo o neuropsicólogo si afecta tu vida diaria. Valorar TDAH."
    },
    mid: { emoji: "🔍", summary: "Buena atención — afínala más",
      tips: [
        { icon: "📖", title: "Lectura profunda", desc: "Lee 30 min sin interrupciones. Entrena la atención sostenida." },
        { icon: "🎯", title: "Una tarea a la vez", desc: "El multitasking reduce la eficiencia un 40%. Enfócate." },
      ],
      related: ["atencion-sel", "ejecutivas"], professional: null },
    high: { emoji: "🏅", summary: "¡Concentración excepcional!",
      tips: [
        { icon: "🧠", title: "Flow state", desc: "Busca actividades que te lleven al estado de flujo total." },
      ],
      related: ["velocidad", "ejecutivas"], professional: null }
  },
  "atencion-sel": {
    low: { emoji: "🔍", summary: "Te cuesta filtrar distracciones",
      tips: [
        { icon: "🧩", title: "Juegos de buscar", desc: "Donde está Wally, diferencias, sopas de letras entrenan atención selectiva." },
        { icon: "🎨", title: "Colorear mandalas", desc: "Requiere enfoque sostenido y filtrar distracciones visuales." },
        { icon: "🏃", title: "Deportes de equipo", desc: "Seguir la pelota entre muchos jugadores entrena la atención selectiva." },
      ],
      related: ["concentracion", "velocidad", "ejecutivas"],
      professional: "Neuropsicólogo para evaluar déficit atencional."
    },
    mid: { emoji: "👁️", summary: "Buena filtración — sigue practicando",
      tips: [{ icon: "🎮", title: "Juegos de reacción", desc: "Videojuegos que requieren foco rápido mejoran esta habilidad." }],
      related: ["concentracion", "reaccion"], professional: null },
    high: { emoji: "🦅", summary: "¡Atención selectiva superior!",
      tips: [{ icon: "✨", title: "Mantén el nivel", desc: "Sigue con actividades que demanden foco entre distracciones." }],
      related: ["reaccion", "velocidad"], professional: null }
  },
  "resiliencia": {
    low: { emoji: "💪", summary: "Puedes fortalecer tu capacidad de recuperación",
      tips: [
        { icon: "🤝", title: "Red de apoyo", desc: "Cultiva relaciones de confianza. El apoyo social es el mejor predictor de resiliencia." },
        { icon: "📓", title: "Reencuadre positivo", desc: "Ante un problema, pregunta: ¿qué puedo aprender de esto?" },
        { icon: "🎯", title: "Metas pequeñas", desc: "Lograr metas pequeñas construye confianza para las grandes." },
        { icon: "🧘", title: "Autocompasión", desc: "Trátate como tratarías a un amigo. Reduce la autocrítica destructiva." },
      ],
      related: ["estres", "comunicacion", "emociones"],
      professional: "Psicólogo para terapia cognitivo-conductual."
    },
    mid: { emoji: "🌱", summary: "Buena resiliencia — sigue creciendo",
      tips: [
        { icon: "📖", title: "Lecturas sobre resiliencia", desc: "Viktor Frankl, Brené Brown — aprende de expertos en adversidad." },
        { icon: "💪", title: "Sal de tu zona de confort", desc: "Pequeños retos diarios construyen resistencia mental." },
      ],
      related: ["estres", "emociones"], professional: null },
    high: { emoji: "🏔️", summary: "¡Resiliencia excepcional!",
      tips: [{ icon: "🤝", title: "Ayuda a otros", desc: "Tu experiencia puede inspirar y guiar a quienes lo necesitan." }],
      related: ["comunicacion", "personalidad"], professional: null }
  },
  "emociones": {
    low: { emoji: "😊", summary: "Puedes mejorar tu lectura emocional",
      tips: [
        { icon: "👀", title: "Observa rostros", desc: "En el transporte público o películas, intenta identificar emociones." },
        { icon: "📺", title: "Series sin sonido", desc: "Ve escenas de películas sin audio e intenta leer las emociones." },
        { icon: "🪞", title: "Espejo emocional", desc: "Practica expresar emociones frente al espejo para reconocerlas mejor." },
      ],
      related: ["comunicacion", "resiliencia"],
      professional: "Psicólogo especializado en habilidades sociales."
    },
    mid: { emoji: "🤗", summary: "Buena empatía — sigue desarrollándola",
      tips: [{ icon: "📖", title: "Lee ficción", desc: "Las novelas mejoran la empatía al ponerte en la piel de otros." }],
      related: ["comunicacion", "resiliencia"], professional: null },
    high: { emoji: "💫", summary: "¡Inteligencia emocional excepcional!",
      tips: [{ icon: "🧑‍🏫", title: "Mentoriza", desc: "Ayuda a otros a desarrollar sus habilidades emocionales." }],
      related: ["comunicacion", "resiliencia"], professional: null }
  },
  "aprendizaje": {
    low: { emoji: "🎓", summary: "Identifica y potencia tu canal preferido", tips: [], related: ["lectura", "creatividad", "concentracion"], professional: null },
    mid: { emoji: "📚", summary: "Buen estilo identificado — úsalo a tu favor",
      tips: [{ icon: "🔄", title: "Multicanal", desc: "Complementa tu canal principal con otros. Visual+auditivo es muy potente." }],
      related: ["lectura", "mem-trabajo"], professional: null },
    high: { emoji: "🌟", summary: "¡Estilo de aprendizaje claro!", tips: [], related: ["lectura", "creatividad"], professional: null }
  },
  "mem-trabajo": {
    low: { emoji: "🗂", summary: "Tu memoria de trabajo puede mejorar mucho",
      tips: [
        { icon: "🔢", title: "Cálculo mental diario", desc: "Suma precios en el supermercado. Empieza con 2 cifras y sube." },
        { icon: "🧠", title: "Dual N-Back", desc: "App de entrenamiento específica para memoria de trabajo. 15 min/día." },
        { icon: "📝", title: "Chunking", desc: "Agrupa información en bloques (ej: teléfono 612-345-678 en vez de 612345678)." },
      ],
      related: ["memoria", "concentracion", "ejecutivas"],
      professional: "Neuropsicólogo para evaluación de memoria de trabajo."
    },
    mid: { emoji: "📋", summary: "Buen nivel — sigue entrenando",
      tips: [{ icon: "♟️", title: "Ajedrez mental", desc: "Intenta visualizar jugadas sin mover las piezas. Gran ejercicio." }],
      related: ["memoria", "logica"], professional: null },
    high: { emoji: "🏆", summary: "¡Memoria de trabajo superior!",
      tips: [{ icon: "🧮", title: "Cálculo avanzado", desc: "Intenta multiplicaciones de 3 cifras mentalmente." }],
      related: ["logica", "velocidad"], professional: null }
  },
  "sesgos": {
    low: { emoji: "🤔", summary: "Eres vulnerable a sesgos cognitivos — ¡pero es normal!",
      tips: [
        { icon: "📖", title: "Lee 'Pensar rápido, pensar despacio'", desc: "Daniel Kahneman explica magistralmente cómo funcionan los sesgos." },
        { icon: "🔍", title: "Busca la evidencia contraria", desc: "Ante una opinión, busca argumentos en contra. Reduce el sesgo de confirmación." },
        { icon: "⏸️", title: "Pausa antes de decidir", desc: "Decisiones importantes: espera 24h. Reduce anclaje e impulsividad." },
      ],
      related: ["logica", "ejecutivas", "creatividad"],
      professional: null
    },
    mid: { emoji: "🧐", summary: "Buen nivel de pensamiento crítico",
      tips: [{ icon: "🗣️", title: "Debate constructivo", desc: "Argumenta posiciones contrarias a las tuyas. Fortalece el pensamiento." }],
      related: ["logica", "creatividad"], professional: null },
    high: { emoji: "🎯", summary: "¡Excelente detección de sesgos!",
      tips: [{ icon: "📊", title: "Estadística básica", desc: "Comprender probabilidad ayuda a evitar sesgos numéricos." }],
      related: ["logica", "ci"], professional: null }
  },
  "comunicacion": {
    low: { emoji: "💬", summary: "Tu estilo de comunicación tiene áreas de mejora", tips: [
        { icon: "🗣️", title: "Comunicación asertiva", desc: "Expresa necesidades con 'Yo siento... cuando... necesito...'" },
        { icon: "👂", title: "Escucha activa", desc: "Parafrasea lo que dice el otro antes de responder." },
      ], related: ["emociones", "resiliencia"], professional: "Psicólogo para habilidades sociales." },
    mid: { emoji: "🤝", summary: "Buen comunicador — sigue mejorando", tips: [
        { icon: "📖", title: "Comunicación no violenta", desc: "Lee a Marshall Rosenberg para comunicarte con más empatía." },
      ], related: ["emociones"], professional: null },
    high: { emoji: "⭐", summary: "¡Comunicación asertiva excelente!", tips: [], related: ["emociones", "personalidad"], professional: null }
  },
  "ejecutivas": {
    low: { emoji: "⚙️", summary: "Tus funciones ejecutivas necesitan refuerzo", tips: [
        { icon: "📋", title: "Lista + prioridades", desc: "Cada mañana escribe 3 tareas clave. Márcalas al completar." },
        { icon: "⏱️", title: "Time-boxing", desc: "Asigna tiempo fijo a cada tarea. Estructura reduce la parálisis." },
        { icon: "🧹", title: "Organiza tu espacio", desc: "Un entorno ordenado libera recursos cognitivos para pensar mejor." },
      ], related: ["gestion-tiempo", "concentracion", "mem-trabajo"],
      professional: "Neuropsicólogo para evaluación de funciones ejecutivas. Valorar TDAH." },
    mid: { emoji: "📊", summary: "Buena gestión — optimiza más", tips: [
        { icon: "📈", title: "Revisa y ajusta", desc: "Al final de cada semana, evalúa qué funcionó y qué no." },
      ], related: ["gestion-tiempo", "concentracion"], professional: null },
    high: { emoji: "🏅", summary: "¡Funciones ejecutivas excelentes!", tips: [], related: ["creatividad", "logica"], professional: null }
  },
  "sueno": {
    low: { emoji: "🌙", summary: "Tu calidad de sueño es buena", tips: [
        { icon: "😴", title: "Mantén la rutina", desc: "Mismo horario incluso fines de semana." },
      ], related: ["estres"], professional: null },
    mid: { emoji: "⚠️", summary: "Tu sueño tiene margen de mejora", tips: [
        { icon: "📵", title: "Sin pantallas 1h antes", desc: "La luz azul suprime la melatonina." },
        { icon: "🌡️", title: "Habitación fresca", desc: "18-20°C es ideal para dormir." },
        { icon: "☕", title: "Sin cafeína después de las 14h", desc: "La cafeína tiene vida media de 6 horas." },
      ], related: ["estres", "concentracion"], professional: "Médico de atención primaria para valorar higiene del sueño." },
    high: { emoji: "🚨", summary: "Tu sueño está afectando tu rendimiento", tips: [
        { icon: "📓", title: "Diario de sueño", desc: "Registra horas, calidad y factores. Llévalo al médico." },
        { icon: "🧘", title: "Relajación nocturna", desc: "Body scan o yoga nidra antes de dormir." },
        { icon: "🏥", title: "Busca ayuda", desc: "Trastornos del sueño tienen tratamiento eficaz." },
      ], related: ["estres", "concentracion", "memoria"],
      professional: "Unidad del sueño o neumólogo. Psicólogo para insomnio cognitivo-conductual." }
  },
  "velocidad": {
    low: { emoji: "🏃", summary: "Puedes mejorar tu velocidad de procesamiento", tips: [
        { icon: "🎮", title: "Juegos de velocidad", desc: "Juegos de reacción rápida y cálculo contra reloj." },
        { icon: "🏃", title: "Ejercicio cardiovascular", desc: "Mejora el riego sanguíneo cerebral y la velocidad neural." },
      ], related: ["reaccion", "concentracion"], professional: "Neuropsicólogo si hay enlentecimiento significativo." },
    mid: { emoji: "⚡", summary: "Buena velocidad", tips: [
        { icon: "🔢", title: "Cálculo cronometrado", desc: "Resuelve operaciones cada vez más rápido." },
      ], related: ["reaccion", "mem-trabajo"], professional: null },
    high: { emoji: "🚀", summary: "¡Velocidad excepcional!", tips: [], related: ["reaccion"], professional: null }
  },
  "sensorial": {
    low: { emoji: "👁", summary: "Sensibilidad normal", tips: [
        { icon: "🧘", title: "Presta atención", desc: "Practica mindfulness sensorial para estar más presente." },
      ], related: ["estres"], professional: null },
    mid: { emoji: "🔔", summary: "Sensibilidad moderada — gestiona tu entorno", tips: [
        { icon: "🎧", title: "Auriculares con cancelación", desc: "Reducen la sobrecarga auditiva en espacios ruidosos." },
        { icon: "🌿", title: "Espacios de calma", desc: "Busca momentos y lugares de baja estimulación para recuperarte." },
      ], related: ["estres", "sueno"], professional: null },
    high: { emoji: "🌟", summary: "Alta sensibilidad (PAS) — conócete y adáptate", tips: [
        { icon: "📖", title: "Lee sobre PAS", desc: "Elaine Aron: 'El don de la sensibilidad'. Comprende tu perfil." },
        { icon: "⏸️", title: "Tiempo de recuperación", desc: "Planifica descansos sensoriales entre actividades intensas." },
        { icon: "🗣️", title: "Comunica tus necesidades", desc: "Explica a tu entorno qué te ayuda y qué te satura." },
      ], related: ["estres", "resiliencia", "sueno"],
      professional: "Psicólogo especializado en alta sensibilidad." }
  },
  "mem-futura": {
    low: { emoji: "📅", summary: "Tu memoria prospectiva necesita apoyos externos", tips: [
        { icon: "📱", title: "Alarmas y recordatorios", desc: "Configura alarmas para citas, medicación y tareas importantes." },
        { icon: "📋", title: "Listas visibles", desc: "Pega notas en la puerta o nevera. Lo visual funciona." },
        { icon: "🔑", title: "Rutinas fijas", desc: "Llaves, cartera, móvil: siempre en el mismo sitio." },
      ], related: ["ejecutivas", "gestion-tiempo", "memoria"],
      professional: "Terapeuta ocupacional para estrategias compensatorias." },
    mid: { emoji: "📝", summary: "Buena planificación futura", tips: [
        { icon: "📓", title: "Agenda física", desc: "Complementa el digital con una agenda de papel. Doble refuerzo." },
      ], related: ["ejecutivas", "gestion-tiempo"], professional: null },
    high: { emoji: "🌟", summary: "¡Excelente memoria prospectiva!", tips: [], related: ["ejecutivas"], professional: null }
  },
  "flexibilidad": {
    low: { emoji: "🔄", summary: "Tu mente tiende a la rigidez — puedes cambiar eso", tips: [
        { icon: "🛤️", title: "Cambia rutinas", desc: "Ve al trabajo por otro camino, prueba comida nueva." },
        { icon: "🎭", title: "Juego de roles", desc: "Defiende una posición contraria a la tuya. Amplía perspectiva." },
        { icon: "🎨", title: "Improvisación", desc: "Teatro impro o cocinar sin receta. Practica la adaptación." },
      ], related: ["creatividad", "resiliencia", "ejecutivas"],
      professional: "Psicólogo para flexibilidad cognitiva y tolerancia a la incertidumbre." },
    mid: { emoji: "🌊", summary: "Buena adaptabilidad", tips: [
        { icon: "🌍", title: "Viaja y explora", desc: "Nuevos entornos fuerzan la adaptación y amplían la mente." },
      ], related: ["creatividad", "resiliencia"], professional: null },
    high: { emoji: "🦎", summary: "¡Muy flexible mentalmente!", tips: [], related: ["creatividad"], professional: null }
  },
  "creatividad": {
    low: { emoji: "🎨", summary: "Tu creatividad puede despertar", tips: [
        { icon: "✍️", title: "Escritura libre", desc: "10 min al día: escribe sin parar sobre cualquier cosa. Sin filtros." },
        { icon: "🎨", title: "Dibuja sin objetivo", desc: "Garabatear activa redes creativas. No importa el resultado." },
        { icon: "🌍", title: "Exposición a ideas", desc: "Lee sobre temas fuera de tu zona. La creatividad nace de conexiones nuevas." },
      ], related: ["flexibilidad", "aprendizaje"],
      professional: null },
    mid: { emoji: "💡", summary: "Buena creatividad — aliméntala", tips: [
        { icon: "🧩", title: "Combina ideas", desc: "Mezcla conceptos de campos distintos. La innovación está en las intersecciones." },
      ], related: ["flexibilidad", "logica"], professional: null },
    high: { emoji: "🌟", summary: "¡Creatividad excepcional!", tips: [
        { icon: "🎯", title: "Crea proyectos", desc: "Canaliza tu creatividad en proyectos concretos. La ejecución importa." },
      ], related: ["ejecutivas", "personalidad"], professional: null }
  },
  "visuoespacial": {
    low: { emoji: "🗺", summary: "Puedes mejorar tu percepción espacial", tips: [
        { icon: "🧩", title: "Puzzles y Tangram", desc: "Entrena la rotación mental y reconocimiento de patrones." },
        { icon: "🗺️", title: "Orientación sin GPS", desc: "Usa mapas de papel o intenta recordar rutas de memoria." },
        { icon: "🎨", title: "Dibujo técnico", desc: "Dibujar objetos desde diferentes ángulos mejora la visión espacial." },
      ], related: ["logica", "mem-trabajo"], professional: "Terapeuta ocupacional para rehabilitación visuoespacial." },
    mid: { emoji: "📐", summary: "Buena percepción espacial", tips: [
        { icon: "🎮", title: "Juegos 3D", desc: "Videojuegos con navegación 3D mejoran la orientación espacial." },
      ], related: ["logica"], professional: null },
    high: { emoji: "🏅", summary: "¡Percepción visuoespacial superior!", tips: [], related: ["logica", "creatividad"], professional: null }
  },
  "gestion-tiempo": {
    low: { emoji: "⏱", summary: "Tu gestión del tiempo tiene mucho margen", tips: [
        { icon: "📋", title: "Matriz Eisenhower", desc: "Clasifica tareas: urgente/importante. Enfócate en lo importante no urgente." },
        { icon: "📅", title: "Planifica la noche anterior", desc: "5 min antes de dormir: planifica el día siguiente." },
        { icon: "⏰", title: "Regla de 2 minutos", desc: "Si tarda menos de 2 min, hazlo ahora. Reduce acumulación." },
      ], related: ["ejecutivas", "concentracion"], professional: "Coach o psicólogo para productividad personal." },
    mid: { emoji: "📊", summary: "Gestión adecuada — optimiza", tips: [
        { icon: "📈", title: "Revisa semanalmente", desc: "Cada domingo revisa qué funcionó y ajusta tu sistema." },
      ], related: ["ejecutivas"], professional: null },
    high: { emoji: "🏆", summary: "¡Gestión del tiempo excelente!", tips: [], related: ["ejecutivas"], professional: null }
  },
  "personalidad": {
    low: { emoji: "🧬", summary: "Tu perfil cognitivo es único — explóralo", tips: [], related: ["aprendizaje", "comunicacion"], professional: null },
    mid: { emoji: "🧬", summary: "Perfil identificado — úsalo a tu favor", tips: [
        { icon: "🔄", title: "Desarrolla tu opuesto", desc: "Si eres analítico, practica creatividad. Si social, practica análisis." },
      ], related: ["aprendizaje", "creatividad"], professional: null },
    high: { emoji: "🌟", summary: "¡Perfil cognitivo claro!", tips: [
        { icon: "🎯", title: "Especialízate", desc: "Elige actividades y profesiones alineadas con tu perfil." },
      ], related: ["aprendizaje"], professional: null }
  },
  "lectura": {
    low: { emoji: "📚", summary: "Puedes mejorar tu velocidad y comprensión lectora", tips: [
        { icon: "👆", title: "Usa un puntero", desc: "Señala con el dedo al leer. Aumenta la velocidad un 20-30%." },
        { icon: "📖", title: "Lee todos los días", desc: "20 min diarios de lectura variada. La práctica hace al maestro." },
        { icon: "🔇", title: "Evita subvocalizar", desc: "Intenta no pronunciar las palabras mentalmente. Lee en bloques." },
      ], related: ["concentracion", "memoria", "dislexia"],
      professional: "Logopeda para técnicas de lectura rápida." },
    mid: { emoji: "📖", summary: "Buen equilibrio lectura-comprensión", tips: [
        { icon: "📊", title: "Práctica con Spritz", desc: "Apps de lectura rápida que presentan una palabra a la vez." },
      ], related: ["concentracion", "memoria"], professional: null },
    high: { emoji: "⚡", summary: "¡Lectura rápida con gran comprensión!", tips: [
        { icon: "📚", title: "Lee más complejo", desc: "Textos académicos y técnicos mantienen el nivel alto." },
      ], related: ["memoria", "ci"], professional: null }
  },
};

export function getRecommendation(testId, result) {
  const rec = RECS[testId];
  if (!rec) return null;
  // Determine level from result
  const age = (result.age || "").toLowerCase();
  const label = (result.label || "").toLowerCase();
  const pct = result.correct != null && result.total ? (result.correct / result.total) * 100 : null;

  // Heuristic to determine low/mid/high
  const lowKeywords = ["mejorable", "baja", "bajo", "mala", "vulnerable", "lento", "lentos", "rígida", "significativo", "moderado", "precaución", "revisión", "en desarrollo", "convencional"];
  const highKeywords = ["excelente", "excepcional", "superior", "muy", "alta", "alto", "rápido", "flexible", "pensador", "sin indicios", "apto", "creativo"];

  let level = "mid";
  if (pct !== null) {
    if (pct >= 80) level = "high";
    else if (pct < 50) level = "low";
  }
  // Override with keyword matching
  for (const kw of lowKeywords) { if (age.includes(kw) || label.includes(kw)) { level = "low"; break; } }
  for (const kw of highKeywords) { if (age.includes(kw) || label.includes(kw)) { level = "high"; break; } }
  // Special cases for likert tests where low score = good result (sleep, stress)
  if (testId === "estres" && (age.includes("bajo"))) level = "low";
  if (testId === "estres" && (age.includes("muy alto") || age.includes("alto"))) level = "high";
  if (testId === "sueno" && (age.includes("excelente") || age.includes("buena"))) level = "low";
  if (testId === "sueno" && (age.includes("mala") || age.includes("regular"))) level = "high";
  if (testId === "sensorial" && age.includes("normal")) level = "low";
  if (testId === "sensorial" && age.includes("alta")) level = "high";

  return { ...rec[level], level };
}
