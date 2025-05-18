import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import FloatingIcons from '@/components/FloatingIcons';
import { CartProvider } from '@/context/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mundo-tinta.com',
  // Eliminando configuración de icons que podría estar causando conflictos

  title: {
    template: '%s | Mundo Tinta - Fantasía y Ciencia Ficción',
    default: 'Mundo Tinta - Librería Online Especializada en Fantasía y Ciencia Ficción'
  },
  description: "Descubre y compra los mejores libros de Fantasía y Ciencia Ficción. Explora mundos fantásticos, aventuras épicas y futuros distópicos con las mejores ofertas. Envío rápido a toda España.",
  keywords: ["libros fantasía", "ciencia ficción", "literatura fantástica", "novelas", "libros recomendados", "comprar libros online", "mejores precios", "librería fantástica", "ofertas libros", "mundo tinta"],
  authors: [{ name: 'Mundo Tinta', url: 'https://www.mundo-tinta.com' }],
  creator: 'Mundo Tinta',
  publisher: 'Mundo Tinta',
  category: 'Libros, Fantasía, Ciencia Ficción',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      'notranslate': false,
    },
  },
  other: {
    'revisit-after': '7 days',
    'rating': 'general',
    'referrer': 'origin-when-cross-origin',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.mundo-tinta.com/',
    siteName: 'Mundo Tinta',
    title: 'Mundo Tinta - Librería Online Especializada en Fantasía y Ciencia Ficción',
    description: 'Explora y compra los mejores libros de fantasía y ciencia ficción con grandes descuentos. Viaja a mundos desconocidos a través de las páginas.',
    images: [
      {
        url: '/images/mundo-tinta-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mundo Tinta - Librería especializada en Fantasía y Ciencia Ficción',
        secureUrl: 'https://www.mundo-tinta.com/images/mundo-tinta-og.jpg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundo Tinta - Fantasía y Ciencia Ficción | Mejores Precios Online',
    description: 'Explora nuestra cuidada selección de libros de fantasía y ciencia ficción. Viaja a mundos desconocidos a través de las páginas. Envío gratis en pedidos +30€',
    images: [
      {
        url: '/images/mundo-tinta-og.jpg',
        alt: 'Mundo Tinta - Librería especializada en Fantasía y Ciencia Ficción',
      }
    ],
    site: '@mundotinta',
    creator: '@mundotinta',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'facebook-domain-verification': 'facebook-domain-verification-code',
    },
  },
  alternates: {
    canonical: 'https://www.mundo-tinta.com',
    languages: {
      'es-ES': 'https://www.mundo-tinta.com',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon directo con link rel */}
        <link rel="icon" href="/images/mundo-tinta-og.jpg" />
        <link rel="shortcut icon" href="/images/mundo-tinta-og.jpg" />
        <link rel="apple-touch-icon" href="/images/mundo-tinta-og.jpg" />
        {/* Script de Schema.org para Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Mundo Tinta",
            "url": "https://www.mundo-tinta.com",
            "description": "Librería online especializada en fantasía y ciencia ficción",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.mundo-tinta.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        {/* Script de Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Mundo Tinta",
            "url": "https://www.mundo-tinta.com",
            "logo": "https://www.mundo-tinta.com/images/logo.png",
            "sameAs": [
              "https://facebook.com/mundotinta",
              "https://twitter.com/mundotinta",
              "https://instagram.com/mundotinta"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+34-000-000-000",
              "contactType": "customer service",
              "email": "contacto@mundotinta.com",
              "availableLanguage": ["Spanish"]
            }
          })}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative bg-background text-foreground dark:bg-dark_background dark:text-dark_foreground`}
      >
        <CartProvider>
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:z-50">
            Saltar al contenido principal
          </a>
          
          {/* Iconos decorativos flotantes visibles en toda la aplicación */}
          <FloatingIcons />
          
          <Header />
          <main id="main-content" className="flex-grow z-10" tabIndex="-1" aria-label="Contenido principal">{/* Asegurar que el main tenga z-index mayor */}
            {children}
          </main>
          <Footer />
          <ChatBot />
          
          {/* Amazon Afiliados disclaimer - Requerido por Amazon */}
          <div className="text-xs text-center py-2 bg-gray-100 dark:bg-gray-800 w-full">
            <p>Mundo Tinta participa en el Programa de Afiliados de Amazon EU, un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es</p>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
