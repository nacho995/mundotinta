import { Mail, Send, MapPin, Users } from 'lucide-react'; // Iconos

export default function ContactoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-stone-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
          Ponte en Contacto
        </h1>
        <p className="text-center text-lg text-stone-300 mb-12 md:mb-16 max-w-3xl mx-auto font-serif tracking-wide">
          ¿Tienes preguntas, sugerencias o simplemente quieres hablar sobre tu último libro favorito? ¡Nos encantaría escucharte! Utiliza el formulario o nuestros datos de contacto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Formulario de Contacto */}
          <form className="bg-stone-800/60 p-8 rounded-xl shadow-2xl border border-emerald-700/30 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-emerald-400 mb-4 flex items-center">
              <Send size={24} className="mr-3" /> Envíanos un Mensaje
            </h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1">Nombre Completo</label>
              <input type="text" name="name" id="name" className="w-full p-3 bg-stone-700/50 border border-stone-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder="Tu nombre" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1">Correo Electrónico</label>
              <input type="email" name="email" id="email" className="w-full p-3 bg-stone-700/50 border border-stone-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder="tu@email.com" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-stone-300 mb-1">Asunto</label>
              <input type="text" name="subject" id="subject" className="w-full p-3 bg-stone-700/50 border border-stone-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder="Motivo de tu consulta" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-300 mb-1">Mensaje</label>
              <textarea name="message" id="message" rows={4} className="w-full p-3 bg-stone-700/50 border border-stone-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder="Escribe tu mensaje aquí..."></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Send size={18} className="mr-2" /> Enviar Mensaje
            </button>
          </form>

          {/* Información de Contacto Adicional */}
          <div className="space-y-8 mt-8 md:mt-0">
            <div className="bg-stone-800/60 p-6 rounded-xl shadow-xl border border-emerald-700/20">
              <h3 className="text-xl font-serif font-semibold text-emerald-400 mb-3 flex items-center">
                <Mail size={22} className="mr-3" /> Correo Electrónico
              </h3>
              <p className="text-stone-300 hover:text-emerald-300 transition-colors">
                <a href="mailto:contacto@mundotinta.com">contacto@mundotinta.com</a>
              </p>
              <p className="text-sm text-stone-400 mt-1">Para consultas generales, soporte y sugerencias.</p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-xl shadow-xl border border-emerald-700/20">
              <h3 className="text-xl font-serif font-semibold text-emerald-400 mb-3 flex items-center">
                <Users size={22} className="mr-3" /> Redes Sociales
              </h3>
              <p className="text-stone-300">Síguenos para estar al día con novedades y eventos:</p>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-stone-400 hover:text-emerald-400 transition-colors">Twitter/X</a>
                <a href="#" className="text-stone-400 hover:text-emerald-400 transition-colors">Instagram</a>
                <a href="#" className="text-stone-400 hover:text-emerald-400 transition-colors">Facebook</a>
              </div>
            </div>
            
            <div className="bg-stone-800/60 p-6 rounded-xl shadow-xl border border-emerald-700/20">
              <h3 className="text-xl font-serif font-semibold text-emerald-400 mb-3 flex items-center">
                <MapPin size={22} className="mr-3" /> Nuestra Sede (Virtual)
              </h3>
              <p className="text-stone-300">Operamos desde el corazón de la nebulosa literaria, accesibles desde cualquier rincón del universo conectado a la red.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 