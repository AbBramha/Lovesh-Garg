import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import FeaturedProjects from '@/components/FeaturedProjects';
import DesignMatrix from '@/components/DesignMatrix';
import ProjectEstimator from '@/components/ProjectEstimator';
import Expertise from '@/components/Expertise';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';

import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen text-white relative">
      <Header />
      <Hero />
      <Philosophy />
      <FeaturedProjects />
      <DesignMatrix />
      <ProjectEstimator />
      <Expertise />
      <About />
      <Testimonials />
      <Contact />
    </main>
  );
}
