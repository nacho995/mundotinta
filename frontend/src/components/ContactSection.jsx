'use client';

import Link from 'next/link';
import ClientContactParticles from '@/components/ClientContactParticles';

export default function ContactSection() {
  return (
    <section id="contacto" className="w-full py-24 md:py-32 relative overflow-hidden">
      {/* Fondo con gradiente burdeos/vino que evoca libros clásicos */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-red-950/70 to-stone-950 z-0"></div>
      
      {/* Textura sutil como papel antiguo */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/paper-texture.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      </div>
      
      {/* Líneas decorativas doradas como detalles de encuadernación */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"></div>
      
      {/* Elementos decorativos sutiles inspirados en manuscritos iluminados */}
      <div className="absolute right-1/4 top-1/4 w-64 h-64 rounded-full bg-amber-500/5 filter blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 w-64 h-64 rounded-full bg-red-800/5 filter blur-3xl"></div>
      
      {/* Contenido */}
      <div className="container relative mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 relative">
            {/* Título con estilo de letras doradas en libro */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
                Comunícate con Nosotros
              </span>
            </h2>
            
            {/* Línea decorativa dorada */}
            <div className="w-32 h-0.5 bg-gradient-to-r from-amber-600/50 to-amber-700/50 mx-auto"></div>
            
            {/* Subtítulo */}
            <p className="text-lg text-amber-100/80 max-w-2xl mx-auto mb-12">
              Estamos aquí para ayudarte a encontrar tu próxima gran aventura literaria.
              Nuestro equipo de expertos responderá a todas tus consultas.
            </p>
            
            {/* Tarjeta de contacto con estilo de libro encuadernado */}
            <div className="relative">
              {/* Brillo como el dorado en los bordes de los libros */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 rounded-xl blur opacity-75"></div>
              <div className="relative px-8 py-10 rounded-xl bg-gradient-to-b from-red-900/80 to-stone-900/80 backdrop-blur-sm border border-amber-700/30 shadow-xl">
                {/* Botón de contacto con estilo de cuero */}
                <Link 
                  href="/contacto"
                  className="relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#e6c9ab] bg-gradient-to-r from-[#8B4513] to-[#5e4534] hover:from-[#A0522D] hover:to-[#8B4513] rounded-lg transition-all duration-300 shadow-lg border border-[#d3a87d]/30 group/btn transform hover:scale-105"
                >
                  {/* Partículas brillantes */}
                  <ClientContactParticles />
                  
                  {/* Resplandor de borde */}
                  <div className="absolute -inset-1 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-[#b87333] via-[#d3a87d] to-[#b87333] rounded-lg blur-md transition-all duration-500 group-hover/btn:duration-200"></div>
                  
                  <span className="relative flex items-center z-10">
                    <span className="group-hover/btn:text-[#f0e6d2] transition-colors duration-300">Contacta con nosotros</span>
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1 text-[#e6c9ab] group-hover/btn:text-[#f0e6d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
                
                {/* Información de contacto con estilo de tinta sobre papel */}
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {[
                    { 
                      icon: 'mail', 
                      title: 'Correo', 
                      info: 'info@mundotinta.com'
                    },
                    { 
                      icon: 'phone', 
                      title: 'Teléfono', 
                      info: '+34 91 123 45 67' 
                    },
                    { 
                      icon: 'location', 
                      title: 'Ubicación', 
                      info: 'Madrid, España' 
                    }
                  ].map((item, i) => (
                    <div key={i} className="text-center transform transition-transform duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-red-900 to-stone-900 border border-amber-700/30 shadow-md">
                        <div className="text-amber-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {item.icon === 'mail' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>}
                            {item.icon === 'phone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>}
                            {item.icon === 'location' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>}
                          </svg>
                        </div>
                      </div>
                      <div className="text-amber-300 font-medium mb-1">{item.title}</div>
                      <div className="text-amber-100/80 text-sm">{item.info}</div>
                    </div>
                  ))}
                </div>
                
                {/* Redes sociales con estilo dorado antiguo */}
                <div className="mt-12 pt-8 border-t border-amber-800/30">
                  <p className="text-amber-300/80 mb-4 text-sm">Síguenos en redes sociales</p>
                  <div className="flex justify-center space-x-6">
                    {['facebook', 'twitter', 'instagram'].map((social, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        className="text-amber-600 hover:text-amber-400 transition-colors duration-300 transform hover:scale-110"
                        aria-label={social}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>}
                          {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                          {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 