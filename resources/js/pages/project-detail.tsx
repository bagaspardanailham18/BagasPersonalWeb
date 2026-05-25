import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Project } from '../lib/data';

interface Props {
  project: Project;
}

export default function ProjectDetail({ project }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-mist font-body">
        <div className="text-center">
          <h1 className="font-display text-2xl text-white mb-4">Project not found</h1>
          <Link href="/#projects" className="text-sm uppercase tracking-[0.3em] text-pewter hover:text-white transition">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title={`${project.title} — Personal Sanctuary`} />
      <div className="min-h-screen bg-[#050505] font-body text-mist">
        
        <header
          className={`sticky top-0 z-20 mx-auto flex max-w-4xl items-center justify-between border-b border-white/5 px-6 pt-8 pb-6 transition-[background-color,backdrop-filter] sm:px-10 sm:pt-12 sm:pb-10 ${
            isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-[#050505]/95'
          }`}
        >
          <Link href="/#projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-pewter transition hover:text-white group">
             <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> Back
          </Link>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-20 animate-fade-in-up">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-pewter">
                  {project.category}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-pewter">
                  {project.status}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-white">{project.title}</h1>
              <p className="max-w-2xl text-lg sm:text-xl text-pewter leading-relaxed">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                {project.liveUrl && (
                   <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90">
                     Live space ↗
                   </a>
                )}
                {project.repoUrl && (
                   <a href={project.repoUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
                     Source code ↗
                   </a>
                )}
            </div>

            <div className="relative mt-12 aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 shadow-soft">
              <img
                src={project.image}
                alt={`${project.title} overview`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-16 sm:mt-24">
              <h2 className="font-display text-2xl text-white mb-6">Technologies</h2>
              <ul className="flex flex-wrap gap-3">
                {project.technologies.map(tech => (
                  <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-pewter">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-16 sm:mt-24 space-y-8 text-pewter leading-relaxed">
              <h2 className="font-display text-2xl text-white">Project Notes</h2>
              <p>
                Every project begins as a rough sketch during a morning run or late-night piano session. 
                For <strong>{project.title}</strong>, the goal was to distill the complexity of its underlying 
                systems ({project.technologies.join(', ')}) into an interface that feels calm, responsive, and natural.
              </p>
              <p>
                The architecture prioritized latency and immediate visual feedback. 
                By relying on minimalist design cues and robust backend performance, 
                we've created a digital space that respects the user's attention.
              </p>
            </div>
          </div>
        </main>
        
        <footer className="mx-auto max-w-4xl border-t border-white/5 py-8 text-center text-xs text-pewter mt-12">
           <p>© {new Date().getFullYear()} Bagas Pardana Ilham. Contemplative Digital Spaces.</p>
        </footer>
      </div>
    </>
  );
}
