'use client';

// Géneros de Fantasía y Ciencia Ficción compatibles con las categorías de Amazon
// Estos IDs corresponden a categorías reales de Amazon que pueden usarse con la API de afiliados
export const genres = [
  // Fantasía
  { 
    name: "Fantasía Épica", 
    description: "Mundos completos con su propia historia, geografía, lenguajes y mitología. Batallas legendarias y héroes destinados a cambiar el destino de su mundo.", 
    slug: "fantasia-epica",
    amazonBrowseNodeId: "14155949031", // ID real de Amazon para Épica
    coverImage: "/images/genres/epic-fantasy.jpg",
    featuredAuthors: ["Brandon Sanderson", "J.R.R. Tolkien", "George R.R. Martin"],
    color: "amber"
  },
  { 
    name: "Fantasía Urbana", 
    description: "La magia escondida en el mundo contemporáneo. Criaturas sobrenaturales, sociedades secretas y héroes ordinarios con poderes extraordinarios.", 
    slug: "fantasia-urbana",
    amazonBrowseNodeId: "14155951031", // ID real de Amazon para Urbana
    coverImage: "/images/genres/urban-fantasy.jpg",
    featuredAuthors: ["Neil Gaiman", "Jim Butcher", "Cassandra Clare"],
    color: "emerald"
  },
  { 
    name: "Fantasía Oscura", 
    description: "Donde la línea entre héroe y villano se desdibuja. Pactos con lo desconocido, decisiones moralmente ambiguas y consecuencias devastadoras.", 
    slug: "fantasia-oscura",
    amazonBrowseNodeId: "14156150031", // ID real de Amazon para Dark Fantasy
    coverImage: "/images/genres/dark-fantasy.jpg",
    featuredAuthors: ["H.P. Lovecraft", "Joe Abercrombie", "Mark Lawrence"],
    color: "violet"
  },
  { 
    name: "Fantasía Juvenil", 
    description: "Descubrimiento de poderes y destinos extraordinarios. Escuelas mágicas, amistades inquebrantables y el paso a la madurez en mundos fantásticos.", 
    slug: "fantasia-juvenil",
    amazonBrowseNodeId: "11065428031", // ID real de Amazon para YA Fantasy
    coverImage: "/images/genres/ya-fantasy.jpg",
    featuredAuthors: ["J.K. Rowling", "Rick Riordan", "Suzanne Collins"],
    color: "cyan"
  },
  
  // Ciencia Ficción
  { 
    name: "Space Opera", 
    description: "Aventuras en la vastedad del espacio. Imperios galácticos, guerras interestelares y tecnologías que desafían la imaginación.", 
    slug: "space-opera",
    amazonBrowseNodeId: "14156267031", // ID real de Amazon para Space Opera
    coverImage: "/images/genres/space-opera.jpg",
    featuredAuthors: ["Frank Herbert", "Lois McMaster Bujold", "James S.A. Corey"],
    color: "blue"
  },
  { 
    name: "Ciencia Ficción Hard", 
    description: "Exploración rigurosa de conceptos científicos reales. Física cuántica, exploración espacial y los límites de la humanidad frente a lo desconocido.", 
    slug: "ciencia-ficcion-hard",
    amazonBrowseNodeId: "14156266031", // ID real de Amazon para Hard Science Fiction
    coverImage: "/images/genres/hard-scifi.jpg",
    featuredAuthors: ["Arthur C. Clarke", "Isaac Asimov", "Andy Weir"],
    color: "gray"
  },
  { 
    name: "Cyberpunk", 
    description: "Futuros distópicos dominados por la tecnología y corporaciones. Hackers, realidad virtual y la fusión entre humano y máquina.", 
    slug: "cyberpunk",
    amazonBrowseNodeId: "14156270031", // ID real de Amazon para Cyberpunk
    coverImage: "/images/genres/cyberpunk.jpg",
    featuredAuthors: ["William Gibson", "Neal Stephenson", "Richard K. Morgan"],
    color: "fuchsia"
  },
  { 
    name: "Distopía y Post-Apocalipsis", 
    description: "Sociedades opresivas y mundos devastados. La resistencia contra sistemas autoritarios y la supervivencia tras el colapso de la civilización.", 
    slug: "distopia",
    amazonBrowseNodeId: "14156265031", // ID real de Amazon para Distopías
    coverImage: "/images/genres/dystopia.jpg",
    featuredAuthors: ["Margaret Atwood", "Cormac McCarthy", "Hugh Howey"],
    color: "red"
  }
];

// Elementos comunes por género
export const commonElements = {
  'fantasia-epica': [
    "Mundos secundarios completos con su propia geografía",
    "Conflictos a gran escala (guerras, invasiones)",
    "Sistemas de magia detallados",
    "Profecías y destinos heroicos",
    "Viajes y búsquedas épicas"
  ],
  'fantasia-urbana': [
    "Ambientación en ciudades contemporáneas",
    "Criaturas sobrenaturales ocultas",
    "Sociedades secretas y organizaciones",
    "Investigaciones y misterios",
    "Conflicto entre mundano y sobrenatural"
  ],
  'fantasia-oscura': [
    "Atmósfera sombría y amenazante",
    "Personajes moralmente ambiguos",
    "Horror y elementos sobrenaturales",
    "Consecuencias trágicas",
    "Exploración de temas tabú"
  ],
  'fantasia-juvenil': [
    "Protagonistas adolescentes",
    "Descubrimiento de habilidades o poderes",
    "Escuelas o academias especiales",
    "Temas de identidad y pertenencia",
    "Primera experiencia con lo sobrenatural"
  ],
  'space-opera': [
    "Viajes interestelares",
    "Imperios galácticos",
    "Batallas espaciales épicas",
    "Especies alienígenas",
    "Tecnología avanzada ficticia"
  ],
  'ciencia-ficcion-hard': [
    "Base en ciencia real o teórica",
    "Exploración espacial realista",
    "Desafíos tecnológicos plausibles",
    "Física, biología o química avanzadas",
    "Rigor científico en la trama"
  ],
  'cyberpunk': [
    "Futuro cercano distópico",
    "Megacorporaciones dominantes",
    "Realidad virtual y ciberespacio",
    "Implantes cibernéticos",
    "Hackers y rebeldes tecnológicos"
  ],
  'distopia': [
    "Sociedades opresivas",
    "Control gubernamental extremo",
    "Resistencia y rebelión",
    "Crítica social",
    "Supervivencia post-apocalíptica"
  ]
};

// Subgéneros por categoría
export const subgenres = {
  'fantasia-epica': [
    "Grimdark",
    "Heroica",
    "Mitológica",
    "Portal Fantasy",
    "Sword & Sorcery"
  ],
  'fantasia-urbana': [
    "Paranormal",
    "Contemporánea",
    "Romántica",
    "Detectivesca",
    "Mitología urbana"
  ],
  'fantasia-oscura': [
    "Horror gótico",
    "Weird Fiction",
    "Ocultismo",
    "Weird West",
    "Folk Horror"
  ],
  'fantasia-juvenil': [
    "Coming of Age",
    "Aventura mágica",
    "Portal Fantasy",
    "Academia de magia",
    "Reinterpretación de cuentos"
  ],
  'space-opera': [
    "Opera militar",
    "Exploración galáctica",
    "Política interestelar",
    "Space Western",
    "Civilizaciones antiguas"
  ],
  'ciencia-ficcion-hard': [
    "Mundos generación",
    "Primer contacto",
    "Exploración planetaria",
    "Ciencia alternativa",
    "Especulación tecnológica"
  ],
  'cyberpunk': [
    "Biopunk",
    "Post-cyberpunk",
    "Tech noir",
    "Inteligencia artificial",
    "Transhumanismo"
  ],
  'distopia': [
    "Post-apocalíptico",
    "Ficción climática",
    "Survivalismo",
    "Totalitarismo",
    "Colapso social"
  ]
};
