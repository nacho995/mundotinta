import BookCoverImage from '@/components/BookCoverImage';

const novedadesEditoriales = [
  {
    id: 1,
    title: "Ecos de Neón y Acero",
    author: "Lyra Valerius",
    genre: "Cyberpunk",
    releaseDate: "2024-09-15",
    coverImage: "/images/placeholder/neon-steel-echoes.png", // Asegúrate de tener estas imágenes o usa placeholders
    description: "En una ciudad ahogada por la lluvia ácida y la luz de neón, una hacker descubre una conspiración que podría cambiar el destino de la humanidad."
  },
  {
    id: 2,
    title: "El Último Dragón de Aethelgard",
    author: "Roric Stonebeard",
    genre: "Alta Fantasía",
    releaseDate: "2024-10-01",
    coverImage: "/images/placeholder/last-dragon-aethelgard.png",
    description: "Cuando una antigua profecía resurge, un joven escudero debe embarcarse en una peligrosa misión para encontrar al último dragón y salvar su reino."
  },
  {
    id: 3,
    title: "Crónicas de la Flota Estelar Perdida",
    author: "Cmdr. Xenon Nova",
    genre: "Space Opera",
    releaseDate: "2024-11-20",
    coverImage: "/images/placeholder/starfleet-chronicles.png",
    description: "Tras un salto hiperespacial fallido, la flota estelar 'Odisea' se encuentra varada en una galaxia desconocida, enfrentándose a nuevos peligros y civilizaciones."
  },
  {
    id: 4,
    title: "La Sombra de la Ciudad Mecánica",
    author: "Ada Cogsworth",
    genre: "Steampunk",
    releaseDate: "2024-12-05",
    coverImage: "/images/placeholder/mechanical-city-shadow.png",
    description: "Una intrépida inventora y un detective con un pasado misterioso unen fuerzas para desvelar los secretos de una gigantesca ciudad impulsada por vapor y engranajes."
  }
];

export default function NovedadesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-stone-900 text-white">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
          Próximos Lanzamientos y Novedades
        </h1>
        <p className="text-center text-lg text-stone-300 mb-12 md:mb-16 max-w-3xl mx-auto font-serif tracking-wide">
          Descubre las historias que están a punto de llegar a nuestras estanterías virtuales. ¡Prepara tu lista de lectura y sé el primero en explorar estos nuevos universos!
        </p>

        <div className="space-y-10">
          {novedadesEditoriales.map((libro) => (
            <div 
              key={libro.id} 
              className="group bg-stone-800/70 p-6 md:p-8 rounded-xl shadow-2xl border border-red-700/20 hover:border-red-500/50 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-8"
            >
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                {/* Placeholder para la imagen de portada */}
                <div className="aspect-[2/3] bg-stone-700 rounded-md shadow-lg group-hover:shadow-red-500/30 transition-shadow duration-300 flex items-center justify-center">
                  <BookCoverImage 
                    src={libro.coverImage} 
                    alt={`Portada de ${libro.title}`} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl lg:text-3xl font-serif font-semibold mb-2 text-red-400 group-hover:text-red-300 transition-colors duration-300">
                  {libro.title}
                </h2>
                <p className="text-stone-400 mb-1 text-sm">
                  Por <span className="font-medium text-orange-400">{libro.author}</span> | Género: <span className="font-medium text-orange-400">{libro.genre}</span>
                </p>
                <p className="text-stone-500 mb-3 text-xs">
                  Lanzamiento: {new Date(libro.releaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300 leading-relaxed">
                  {libro.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 