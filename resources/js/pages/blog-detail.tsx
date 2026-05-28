import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../lib/data';

interface Props {
  post: BlogPost;
}

export default function BlogDetail({ post }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-mist font-body">
        <div className="text-center">
          <h1 className="font-display text-2xl text-white mb-4">Journal Entry not found</h1>
          <Link href="/#blog" className="text-sm uppercase tracking-[0.3em] text-pewter hover:text-white transition">← Back to Journal</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head title={`${post.title} — Journal Entry`} />
      <div className="min-h-screen font-body text-[#fbe3c8] relative">
        
        {/* Warm Background layer to cover global green gradient */}
        <div className="fixed inset-0 z-0 bg-[#0c0805] pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(49,31,19,0.95),rgba(89,52,34,0.85),rgba(15,10,5,0.95))] opacity-80"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,191,132,0.25),transparent_55%),radial-gradient(circle_at_70%_0%,rgba(255,234,214,0.1),transparent_40%)]"></div>
           <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_1px,transparent_1px,transparent_2px),radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-30"></div>
        </div>

        <div className="relative z-10">
          <header
            className={`sticky top-0 z-20 mx-auto flex max-w-3xl items-center justify-between border-b border-[#fbdcc0]/10 px-6 pt-8 pb-6 transition-[background-color,backdrop-filter] sm:px-10 sm:pt-12 sm:pb-10 ${
              isScrolled ? 'bg-[#0f0a07]/80 backdrop-blur-md' : 'bg-transparent'
            }`}
          >
            <Link href="/#blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#fbdcc0]/60 transition hover:text-[#fbdcc0] group">
               <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> Journal
            </Link>
          </header>

          <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-20 animate-fade-in-up">
          <article className="space-y-10 sm:space-y-16">
            
            <div className="space-y-6 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.25em] text-[#fbdcc0]/80">
                <span className="rounded-full border border-[#fbdcc0]/20 px-3 py-1">{post.category}</span>
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime || post.reading_time}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl text-[#fff4e6] leading-tight">{post.title}</h1>
            </div>

            <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem] border border-[#fbdcc0]/10 shadow-soft">
              <img
                src={post.coverImage || post.cover_image}
                alt={`${post.title} cover`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="prose prose-invert prose-lg mx-auto w-full max-w-none space-y-8 font-serif text-xl leading-relaxed text-[#fbe3c8]/90 prose-headings:font-display prose-headings:text-[#fff4e6] prose-a:text-[#fbdcc0] prose-a:underline-offset-4 hover:prose-a:text-white prose-blockquote:border-[#fbdcc0]/30 prose-blockquote:text-[#fff4e6] prose-blockquote:not-italic prose-li:marker:text-[#fbdcc0]/50">
              {post.content.map((block, idx) => {
                 if (block.type === 'quote') {
                   return <blockquote key={idx}>{block.text}</blockquote>;
                 } else if (block.type === 'list') {
                   return (
                     <ul key={idx}>
                       {block.items?.map(item => <li key={item}>{item}</li>)}
                     </ul>
                   );
                 } else if (block.type === 'heading') {
                   return <h2 key={idx}>{block.text}</h2>;
                 }
                 return <p key={idx}>{block.text}</p>;
              })}
            </div>

            <div className="mt-16 flex justify-center pt-10 border-t border-[#fbdcc0]/10">
               <div className="text-center">
                 <p className="text-[10px] uppercase tracking-[0.3em] text-[#fbdcc0]/50 mb-4">Share this thought</p>
                 <div className="flex gap-4 justify-center">
                   <button className="rounded-full border border-[#fbdcc0]/20 px-6 py-2 text-xs uppercase tracking-widest text-[#fbdcc0] transition hover:bg-[#fbdcc0]/10">Copy Link</button>
                 </div>
               </div>
            </div>

          </article>
        </main>
        
          <footer className="mx-auto max-w-3xl pb-16 pt-8 text-center text-xs text-[#fbdcc0]/40 mt-12">
             <p>End of Entry</p>
          </footer>
        </div>
      </div>
    </>
  );
}
