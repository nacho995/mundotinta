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
  title: "Mundo Tinta",
  description: "Tu portal a la Fantasía y Ciencia Ficción",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative bg-background text-foreground dark:bg-dark_background dark:text-dark_foreground`}
      >
        <CartProvider>
          {/* Iconos decorativos flotantes visibles en toda la aplicación */}
          <FloatingIcons />
          
          <Header />
          <main className="flex-grow z-10">{/* Asegurar que el main tenga z-index mayor */}
            {children}
          </main>
          <Footer />
          <ChatBot />
        </CartProvider>
      </body>
    </html>
  );
}
