import HeroSection from '@/components/HeroSection';
import FeaturedBooksSection from '@/components/FeaturedBooksSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import IntroVideoWrapper from '@/components/IntroVideoWrapper';

// No Header/Footer here, they are in layout.jsx

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <IntroVideoWrapper /> {/* Este componente se encargará del video y la lógica del lado cliente */}
      <HeroSection />
      <FeaturedBooksSection /> 
      <AboutSection />
      <ContactSection />
    </main>
  );
}