import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MeteorShower } from '../components/MeteorShower';
import { natureNotes, Project, BlogPost } from '../lib/data';

interface Props {
  projects: Project[];
  blogPosts: BlogPost[];
}

export default function Home({ projects = [], blogPosts = [] }: Props) {
  const currentYear = new Date().getFullYear();

  // State
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [activeBlogCategory, setActiveBlogCategory] = useState('All');
  const [blogSearch, setBlogSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtering
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeProjectCategory === 'All' || project.category === activeProjectCategory;
    const matchesSearch = [project.title, project.description, project.category, ...project.technologies]
      .join(' ')
      .toLowerCase()
      .includes(projectSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredPosts = blogPosts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((post) => {
      const matchesCategory = activeBlogCategory === 'All' || post.category === activeBlogCategory;
      const searchable = [
        post.title,
        post.category,
        ...post.content.map((block) => (block.type === 'list' ? block.items?.join(' ') : block.text)),
      ].join(' ').toLowerCase();
      const matchesSearch = searchable.includes(blogSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const recentPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featuredProject = projects.length > 0 ? projects[0] : null;
  const latestPost = recentPosts.length > 0 ? recentPosts[0] : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head title="Bagas Pardana Ilham — Personal Sanctuary" />
      <div className="min-h-screen bg-[#050505] font-body text-mist">
        <MeteorShower />
        <div className="relative z-10 overflow-clip">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-3xl"></div>
            <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-white/5 via-white/20 to-transparent blur-3xl"></div>
            <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-gradient-to-t from-white/5 to-transparent blur-[150px]"></div>
          </div>

          <header
            className={`sticky top-0 z-20 mx-auto flex max-w-6xl flex-col items-start gap-4 border-b border-white/5 px-6 pt-8 pb-6 transition-[background-color,backdrop-filter] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-10 sm:pt-12 sm:pb-10 lg:px-12 ${isScrolled ? 'bg-black/60 backdrop-blur-md' : 'bg-[#050505]/85 backdrop-blur-md'
              }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-pewter sm:text-xs">Bagas Pardana Ilham's</p>
              <h1 className="font-display text-2xl text-white sm:text-4xl">Personal Sanctuary</h1>
            </div>
            <nav className="flex w-full flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-pewter sm:w-auto sm:gap-6 sm:text-sm">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#projects" className="hover:text-white transition">Projects</a>
              <a href="#blog" className="hover:text-white transition">Blog</a>
            </nav>
          </header>

          <div id="page-top" className="anchor-target relative z-10 mx-auto max-w-6xl px-6 pb-20 sm:px-10 lg:px-12">
            <main className="mt-8 space-y-24 sm:mt-16 sm:space-y-32">
              <section id="home" className="anchor-target grid gap-12 lg:grid-cols-[1.2fr_0.8fr] sm:gap-16">
                <div className="space-y-8 sm:space-y-10">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-pewter sm:text-xs">Quiet technology, personal rituals</p>
                  <div>
                    <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
                      I craft contemplative digital spaces for curious people and kind clients.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-pewter sm:text-lg">
                      Every build starts with a dawn trail: mist drifting over pines, cadence syncing with piano arpeggios
                      recorded on return. I translate that hush into interfaces that feel like breathing with the forest.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                    <a href="#projects" className="w-full rounded-full border border-white px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black sm:w-auto sm:py-2 sm:text-sm">
                      Explore projects
                    </a>
                    <a href="#blog" className="w-full rounded-full border border-white/30 px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white hover:text-white sm:w-auto sm:py-2 sm:text-sm">
                      Open journal
                    </a>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <article className="rounded-[1.8rem] border border-white/10 bg-black/30 p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-pewter">Forest Runs</p>
                      <p className="mt-3 text-sm leading-relaxed text-pewter">
                        Long steady runs before sunrise let me design systems with a clear breath rhythm.
                      </p>
                    </article>
                    <article className="rounded-[1.8rem] border border-white/10 bg-black/30 p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-pewter">Piano Sketches</p>
                      <p className="mt-3 text-sm leading-relaxed text-pewter">
                        Improvised piano progressions become mood boards for interfaces and copy.
                      </p>
                    </article>
                  </div>
                  <div className="space-y-4 rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-emerald-900/50 via-black/40 to-black/60 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-pewter sm:text-xs">Nature cues live log</p>
                      <span className="nature-pill border-white/20 text-[10px] text-white/70 sm:text-xs">today's trail</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {natureNotes.map((note) => (
                        <article key={note.id} className="rounded-3xl border border-white/15 bg-black/40 p-4">
                          <p className="text-xs uppercase tracking-[0.35em] text-pewter">{note.label}</p>
                          <p className="mt-2 text-sm text-white">{note.mood}</p>
                          <p className="mt-2 text-sm leading-relaxed text-pewter">{note.description}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                  {featuredProject && (
                    <article className="rounded-[2rem] border border-white/10 bg-white/5/30 p-6 shadow-soft backdrop-blur-md transition hover:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.4em] text-pewter">Featured project</p>
                      <h3 className="mt-3 font-display text-3xl text-white">{featuredProject.title}</h3>
                      <p className="mt-3 text-base text-pewter">{featuredProject.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-pewter">
                        {featuredProject.technologies.map((tech) => (
                          <span key={tech} className="rounded-full border border-white/15 px-3 py-1">{tech}</span>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:gap-4">
                        <Link href={`/project/${featuredProject.id}`} className="flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-white transition hover:bg-white/10">
                          View project →
                        </Link>
                      </div>
                    </article>
                  )}
                  {latestPost && (
                    <article className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 shadow-inner transition hover:border-white/20">
                      <p className="text-xs uppercase tracking-[0.4em] text-pewter">Latest note</p>
                      <h3 className="mt-3 font-display text-2xl text-white">{latestPost.title}</h3>
                      <p className="mt-1 text-sm text-pewter">{formatDate(latestPost.date)} · {latestPost.readingTime || latestPost.reading_time}</p>
                      <div className="mt-4 space-y-2 text-sm leading-relaxed text-pewter">
                        <p>{latestPost.content[0]?.text || 'Fresh note from the journal.'}</p>
                      </div>
                      <Link href={`/blog/${latestPost.id}`} className="mt-4 inline-flex text-sm font-medium text-white transition hover:text-pewter">
                        Continue reading →
                      </Link>
                    </article>
                  )}
                </div>
              </section>

              <section id="projects" className="anchor-target space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-pewter sm:text-xs">IT Projects</p>
                  <h2 className="font-display text-3xl text-white sm:text-4xl">Interfaces with a pulse.</h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-pewter sm:text-base">
                    Screenshots and prototypes from the studio—each infused with recordings from rain-soaked trails...
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['All', 'Mobile App', 'Website', 'IOT', 'Automation', 'AI'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveProjectCategory(cat)}
                      className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.3em] transition ${activeProjectCategory === cat
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/20 text-pewter hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex min-w-[280px] flex-1 items-center rounded-full border border-white/15 px-5 py-3 text-sm text-pewter">
                    <span className="sr-only">Search projects</span>
                    <input
                      type="search"
                      placeholder="Search projects, tools, or moods..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full bg-transparent text-white placeholder:text-pewter/60 focus:outline-none"
                    />
                  </label>
                </div>
                <div className="grid gap-10 lg:grid-cols-2">
                  {filteredProjects.length === 0 && (
                    <p className="text-pewter">No builds match that filter yet. Try another word.</p>
                  )}
                  {filteredProjects.map((project) => (
                    <Link key={project.id} href={`/project/${project.id}`} className="block group">
                      <article className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 shadow-soft backdrop-blur-sm transition duration-300 hover:border-white/15 hover:bg-white/[0.07]">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                          <div className="absolute bottom-5 left-6 rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                            {project.technologies[0]}
                          </div>
                        </div>
                        <div className="space-y-5 px-8 pb-10 pt-8">
                          <div>
                            <h3 className="font-display text-2xl text-white">{project.title}</h3>
                            <p className="mt-3 text-base leading-relaxed text-pewter">{project.description}</p>
                          </div>
                          <ul className="flex flex-wrap gap-2 text-sm text-pewter">
                            {project.technologies.map((tech) => (
                              <li key={tech} className="rounded-full border border-white/10 px-3 py-1">{tech}</li>
                            ))}
                          </ul>
                          <div className="flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-5">
                            <span className="flex w-full items-center justify-center rounded-full border border-white/20 py-2 text-white transition group-hover:bg-white/10 sm:w-auto sm:border-transparent sm:py-0 sm:justify-start">
                              View project →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>

              <section id="blog" className="anchor-target warm-journal space-y-8 p-6 sm:space-y-10 sm:p-10">
                <div className="relative z-10 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#f9d8ba] sm:text-xs">Journal</p>
                  <h2 className="font-display text-3xl text-[#fff4e6] sm:text-4xl">Essays on IT, life, and travel.</h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-[#fbe3c8] sm:text-base">
                    These posts mix architecture notes, running reflections, travel sketches, and the kind of nature studies
                    you can only jot down when the forest finally goes quiet. No comments, only thoughtful reading.
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-4">
                  {['All', 'IT', 'Life', 'Travel'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveBlogCategory(cat)}
                      className={`filter-pill warm-pill rounded-full border px-5 py-2 text-xs uppercase tracking-[0.3em] transition hover:text-white ${activeBlogCategory === cat ? 'warm-pill-active' : ''
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative z-10 flex flex-wrap gap-4">
                  <label className="warm-input flex min-w-[280px] flex-1 items-center rounded-full border px-5 py-3 text-sm text-[#fff4e6]">
                    <span className="sr-only">Search posts</span>
                    <input
                      type="search"
                      placeholder="Search stories, keywords, or moods..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="w-full bg-transparent text-[#fff4e6] placeholder:text-[#f5d9c1]/60 focus:outline-none"
                    />
                  </label>
                </div>
                <div className="relative z-10 grid gap-8 md:grid-cols-2">
                  {filteredPosts.length === 0 && (
                    <p className="text-[#fbe3c8]">Nothing matches that search yet. Try another word.</p>
                  )}
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="warm-card flex h-full flex-col overflow-hidden rounded-[2.25rem] p-2 transition hover:scale-[1.02]">
                      <div className="group relative h-60 overflow-hidden rounded-[2rem]">
                        <img
                          src={post.coverImage || post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      </div>
                      <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#fbdcc0]">
                          <span className="rounded-full border border-white/10 px-3 py-1">{post.category}</span>
                          <span>{formatDate(post.date)}</span>
                          <span>·</span>
                          <span>{post.readingTime || post.reading_time}</span>
                        </div>
                        <h3 className="font-display text-2xl text-[#fff0dc]">{post.title}</h3>
                        <div className="space-y-3 text-sm leading-relaxed text-[#fbe3c8]">
                          {post.content.slice(0, 2).map((block, idx) => {
                            if (block.type === 'quote') {
                              return <p key={idx} className="italic text-white/70">"{block.text}"</p>;
                            } else if (block.type === 'list') {
                              return (
                                <ul key={idx} className="list-disc pl-5 text-pewter/90">
                                  {block.items?.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              );
                            }
                            return <p key={idx}>{block.text}</p>;
                          })}
                        </div>
                        <div className="mt-auto">
                          <Link href={`/blog/${post.id}`} className="text-sm font-medium text-white transition hover:text-[#fbdcc0]">
                            Read entry →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </main>

            <footer className="mt-16 border-t border-white/5 pt-8 text-[10px] text-pewter sm:mt-24 sm:text-sm">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                <p>© {currentYear} Built with ❤️ by Bagas Pardana Ilham.</p>
                <a href="mailto:hello@bagas.studio" className="text-white transition hover:text-pewter">ibagaspardana@gmail.com</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
