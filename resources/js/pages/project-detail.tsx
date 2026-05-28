import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Project } from '../lib/data';
import { sanitizeHtml } from '../lib/sanitize';

interface Props {
  project: Project;
}

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export default function ProjectDetail({ project }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
      <Head title={`${project.title} — Personal Sanctuary`}>
        <meta name="description" content={stripHtml(project.description || '').substring(0, 160)} />
      </Head>
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
              <div 
                className="max-w-2xl text-lg sm:text-xl text-pewter leading-relaxed tiptap" 
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description || '') }}
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                {(project.liveUrl || project.live_url) && (
                   <a href={project.liveUrl || project.live_url} target="_blank" rel="noreferrer" className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90">
                     Live space ↗
                   </a>
                )}
                {(project.repoUrl || project.repo_url) && (
                   <a href={project.repoUrl || project.repo_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
                     Source code ↗
                   </a>
                )}
            </div>

            <div className="relative mt-12 aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 shadow-soft">
              <img
                src={project.image}
                alt={`${project.title} overview`}
                className="h-full w-full object-cover"
                loading="lazy"
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

            <div className="mt-16 sm:mt-24 pt-10 border-t border-white/5 space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xs uppercase tracking-[0.25em] text-pewter mb-4 font-display">Share this project</h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-pewter transition hover:border-white/30 hover:text-white hover:bg-white/5"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-pewter transition hover:border-white/30 hover:text-white hover:bg-white/5"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-pewter transition hover:border-white/30 hover:text-white hover:bg-white/5"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(project.title + ' - ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-pewter transition hover:border-white/30 hover:text-white hover:bg-white/5"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.448 4.795 1.449 5.541 0 10.054-4.515 10.057-10.057.002-2.685-1.041-5.21-2.935-7.105-1.895-1.895-4.422-2.938-7.11-2.94h-.015c-5.542 0-10.059 4.515-10.062 10.059-.001 1.704.453 3.371 1.314 4.869l-.993 3.63 3.73-.979zm11.173-7.585c-.3-.15-1.77-.875-2.045-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.77-1.665-2.07-.175-.3-.02-.46.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.075-.525c-.125-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.01-.37-.01-.567-.01-.197 0-.518.074-.788.374-.27.3-1.03 1.01-1.03 2.46s1.055 2.85 1.2 3.05c.145.2 2.08 3.175 5.04 4.455.703.305 1.252.487 1.68.625.709.225 1.353.193 1.862.117.568-.085 1.77-.725 2.02-1.39.25-.665.25-1.235.175-1.39-.075-.15-.275-.25-.575-.4z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-pewter transition hover:border-white/30 hover:text-white hover:bg-white/5 active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-emerald-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
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
