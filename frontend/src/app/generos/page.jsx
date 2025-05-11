const generosSciFiFantasia = [
  { name: "Alta Fantasía", description: "Mundos épicos, magia ancestral y grandes batallas entre el bien y el mal.", slug: "alta-fantasia" },
  { name: "Fantasía Urbana", description: "La magia se esconde a plena vista en nuestras ciudades modernas.", slug: "fantasia-urbana" },
  { name: "Space Opera", description: "Aventuras interestelares, imperios galácticos y tecnología futurista.", slug: "space-opera" },
  { name: "Cyberpunk", description: "Futuros distópicos dominados por la tecnología y corporaciones.", slug: "cyberpunk" },
  { name: "Distopía", description: "Sociedades opresivas y la lucha por la libertad individual.", slug: "distopia" },
  { name: "Steampunk", description: "Tecnología a vapor, inventos victorianos y aventuras retrofuturistas.", slug: "steampunk" },
  { name: "Fantasía Oscura", description: "Relatos sombríos donde la línea entre héroe y villano es difusa.", slug: "fantasia-oscura" },
  { name: "Realismo Mágico", description: "Elementos fantásticos entretejidos sutilmente en la realidad cotidiana.", slug: "realismo-magico" },
  { name: "Ciencia Ficción Hard", description: "Exploración rigurosa de conceptos científicos y sus consecuencias.", slug: "ciencia-ficcion-hard" },
];

export default function GenerosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-stone-900 text-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">
          Explora los Géneros
        </h1>
        <p className="text-center text-lg text-stone-300 mb-12 md:mb-16 max-w-3xl mx-auto font-serif tracking-wide">
          Desde los confines de la galaxia hasta los reinos olvidados por el tiempo, cada género te ofrece una puerta a lo inimaginable. ¿Cuál será tu próxima aventura?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {generosSciFiFantasia.map((genero) => (
            <div 
              key={genero.slug} 
              className="group bg-stone-800 p-6 rounded-lg shadow-xl border border-sky-700/20 hover:border-sky-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <h2 className="text-2xl font-serif font-semibold mb-3 text-sky-300 group-hover:text-sky-200 transition-colors duration-300">
                {genero.name}
              </h2>
              <p className="text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                {genero.description}
              </p>
              {/* En el futuro, esto podría ser un Link: <Link href={`/biblioteca?genero=${genero.slug}`}>Ver libros</Link> */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 