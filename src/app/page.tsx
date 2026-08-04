import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import FeaturedProjects from '@/components/FeaturedProjects';
import DesignProcess from '@/components/DesignProcess';
import Expertise from '@/components/Expertise';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen text-white relative">
      <Hero />
      <Philosophy />
      <FeaturedProjects />
      <DesignProcess />
      <Expertise />
      <About />
      <Experience />
      <Testimonials />
      <Contact />
    </main>
  );
}
