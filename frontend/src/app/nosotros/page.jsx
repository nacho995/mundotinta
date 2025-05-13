import { BookOpenText, Rocket, Sparkles } from 'lucide-react'; // Iconos para dar un toque visual

export const metadata = {
  title: 'Sobre Nosotros - Mundo Tinta | Tu Portal a la Fantasía y Ciencia Ficción',
  description: 'Conoce la historia y misión de Mundo Tinta, tu librería online especializada en libros de ciencia ficción y fantasía. Descubre nuestra pasión por las grandes historias.',
  keywords: ['Mundo Tinta', 'sobre nosotros', 'librería online', 'libros ciencia ficción', 'libros fantasía', 'comprar libros', 'literatura fantástica'],
};

export default function NosotrosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-stone-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-stone-200 to-amber-300">
          Sobre Mundo Tinta
        </h1>

        <div className="bg-stone-800/50 p-8 md:p-10 rounded-xl shadow-2xl border border-amber-700/30 space-y-8 font-serif text-lg leading-relaxed text-stone-300">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <BookOpenText size={80} className="text-amber-400 flex-shrink-0 mb-4 md:mb-0" />
            <p>
              En <span className="text-amber-300 font-semibold">Mundo Tinta</span>, somos más que una simple librería online; somos un portal a universos ilimitados, forjados en las llamas de la imaginación de autores de <strong className="font-semibold text-amber-200">libros de ciencia ficción</strong> y <strong className="font-semibold text-amber-200">libros de fantasía</strong>. 
              Nacimos de una pasión compartida por las historias que desafían la realidad, exploran lo desconocido y nos transportan a épicas aventuras más allá de las estrellas o en reinos olvidados.
            </p>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <Rocket size={80} className="text-sky-400 flex-shrink-0 mb-4 md:mb-0" />
            <p>
              Nuestra misión es cultivar una comunidad de lectores voraces y soñadores audaces. Creemos que cada libro de ciencia ficción es una ventana a futuros posibles, y cada tomo de fantasía, una llave a mundos donde la magia es tan real como el aire que respiramos. 
              Seleccionamos cuidadosamente cada título, buscando tanto clásicos atemporales como las voces más innovadoras y prometedoras del género para que puedas <strong className="font-semibold text-amber-200">comprar libros</strong> únicos.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Sparkles size={80} className="text-red-400 flex-shrink-0 mb-4 md:mb-0" />
            <p>
              Queremos que <span className="text-amber-300 font-semibold">Mundo Tinta</span> sea tu compañero de viaje en cada nueva lectura. Un lugar donde puedas descubrir tu próxima obsesión literaria, conectar con otros aficionados y celebrar el poder sin límites de la <strong className="font-semibold text-amber-200">literatura fantástica</strong>. 
              ¡Gracias por unirte a nuestra aventura intergaláctica y mágica!
            </p>
          </div>
        </div>

        <div className="text-center mt-16 space-y-4">
          <p className="text-xl text-amber-200 font-serif">
            Explora. Sueña. Descubre.
          </p>
          <p className="text-lg text-stone-400 hover:text-amber-300 transition-colors duration-300">
            ¿Listo para tu próxima aventura? <a href="/biblioteca" className="underline font-semibold">Explora nuestra colección de libros</a>.
          </p>
        </div>

      </div>
    </main>
  );
} 