import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-white selection:text-black">
      {/* Top Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/#works"
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 transition-colors font-mono"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
            </svg>
            Selected Works
          </Link>

          <Link href="/" className="font-serif text-lg tracking-wide hover:opacity-80 transition-opacity">
            Nidhivan <span className="text-xs tracking-widest uppercase opacity-60 ml-1">Studio</span>
          </Link>

          <Link
            href="/#contact"
            className="text-xs uppercase tracking-widest px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors"
          >
            Inquire
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] w-full flex items-end pb-16 md:pb-24 pt-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-black/60" />
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-xs uppercase tracking-widest font-mono text-white/90">
                {project.category}
              </span>
              <span className="text-xs text-white/60 font-mono">
                {project.location} · {project.year}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light tracking-tight text-white mb-4 leading-[1.05]">
              {project.title}
            </h1>

            <p className="text-lg md:text-2xl text-white/70 font-light italic max-w-2xl font-serif leading-relaxed">
              "{project.subtitle}"
            </p>
          </div>
        </div>
      </section>

      {/* Project Quick Fact Matrix Bar */}
      <section className="border-y border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-left">
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Typology</span>
              <span className="text-sm font-medium text-white">{project.category}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Location</span>
              <span className="text-sm font-medium text-white">{project.location}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Built-up Area</span>
              <span className="text-sm font-medium text-white">{project.area}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Timeline</span>
              <span className="text-sm font-medium text-white">{project.year}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Status</span>
              <span className="text-sm font-medium text-emerald-400">{project.status}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">Principal Architect</span>
              <span className="text-sm font-medium text-white">Ar. Lovesh Garg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Narrative & Concept */}
      <section className="py-20 md:py-28 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.25em] font-mono text-white/40 block mb-3">
              Architectural Concept
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight mb-6">
              Sculpting daylight, proportion, and physical serenity.
            </h2>
            <div className="h-[1px] w-20 bg-white/30 mb-8" />
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed mb-6">
              {project.description}
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm backdrop-blur-sm">
              <span className="text-xs uppercase tracking-widest font-mono text-white/50 block mb-3">
                Design Philosophy
              </span>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed mb-6">
                {project.concept}
              </p>

              <span className="text-xs uppercase tracking-widest font-mono text-white/50 block mb-3">
                Key Architectural Highlights
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-white/80 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materiality Palette */}
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-white/50 block mb-3">
                Material Language & Specification
              </span>
              <div className="flex flex-wrap gap-2.5">
                {project.materials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-sm bg-white/5 border border-white/10 text-xs text-white/90 font-mono tracking-wide"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Showcase */}
      <section className="pb-20 md:pb-28 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-mono text-white/40 block mb-1">
              Visual Documentation
            </span>
            <h3 className="text-2xl md:text-4xl font-serif font-light">Spatial Perspectives</h3>
          </div>
          <span className="text-xs font-mono text-white/40">04 Curated Views</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {project.gallery.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-sm border border-white/10 group ${
                idx === 0 || idx === 3 ? 'aspect-[16/10] md:col-span-2' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={imgSrc}
                alt={`${project.title} view ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 border border-white/15 text-[10px] font-mono tracking-wider text-white/80">
                View 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Project & Inquiry Footer CTA */}
      <section className="border-t border-white/10 bg-black py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-between mb-16">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-white/40 block mb-3">
                Begin Your Commission
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-light mb-4">
                Bring Visionary Architecture to Your Land.
              </h2>
              <p className="text-sm md:text-base text-white/70 font-light max-w-xl">
                Collaborate with Ar. Lovesh Garg to sculpt a home tailored to your lifestyle, climate, and personal story.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 lg:justify-end">
              <a href="https://cal.id/nidhivandesignstudio-gmail" target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10">
                  Book Consultation Call
                </button>
              </a>
              <Link href="/estimate">
                <button className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white/10 transition-colors">
                  Estimate Project Budget
                </button>
              </Link>
            </div>
          </div>

          {/* Next Project Bar */}
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group block border border-white/10 rounded-sm p-6 md:p-8 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block mb-1">
                  Next Project Preview →
                </span>
                <h4 className="text-2xl md:text-3xl font-serif font-light text-white group-hover:text-neutral-300 transition-colors">
                  {nextProject.title}
                </h4>
                <span className="text-xs text-white/60 font-mono">
                  {nextProject.location} · {nextProject.area}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all self-start sm:self-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
