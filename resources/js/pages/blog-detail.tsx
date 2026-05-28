import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../lib/data';
import { sanitizeHtml } from '../lib/sanitize';

interface Props {
  post: BlogPost;
}

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export default function BlogDetail({ post }: Props) {
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

  const getSummary = () => {
    if (!post.content || !Array.isArray(post.content)) return '';
    const text = post.content
      .map(block => {
        if (block.type === 'list') {
          return block.items?.join(', ') || '';
        }
        return block.text || '';
      })
      .join(' ');
    return stripHtml(text).substring(0, 160);
  };

  return (
    <>
      <Head title={`${post.title} — Journal Entry`}>
        <meta name="description" content={getSummary()} />
      </Head>
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
              </div>
              <h1 className="font-display text-4xl sm:text-6xl text-[#fff4e6] leading-tight">{post.title}</h1>
            </div>

            <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem] border border-[#fbdcc0]/10 shadow-soft">
              <img
                src={post.coverImage || post.cover_image}
                alt={`${post.title} cover`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="prose prose-invert prose-lg mx-auto w-full max-w-none space-y-8 font-serif text-xl leading-relaxed text-[#fbe3c8]/90 prose-headings:font-display prose-headings:text-[#fff4e6] prose-a:text-[#fbdcc0] prose-a:underline-offset-4 hover:prose-a:text-white prose-blockquote:border-[#fbdcc0]/30 prose-blockquote:text-[#fff4e6] prose-blockquote:not-italic prose-li:marker:text-[#fbdcc0]/50 tiptap">
              {post.content.map((block, idx) => {
                 if (block.type === 'quote') {
                   return <blockquote key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.text || '') }} />;
                 } else if (block.type === 'list') {
                   return (
                     <ul key={idx} className="list-disc pl-5 text-pewter/90 my-4 space-y-2">
                       {block.items?.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item || '') }} />)}
                     </ul>
                   );
                 } else if (block.type === 'heading') {
                   return <h2 key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.text || '') }} />;
                 }
                 return <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.text || '') }} />;
               })}
            </div>

            <div className="mt-16 flex justify-center pt-10 border-t border-[#fbdcc0]/10">
               <div className="text-center">
                 <p className="text-[10px] uppercase tracking-[0.3em] text-[#fbdcc0]/50 mb-6">Share this thought</p>
                 <div className="flex flex-wrap gap-3 justify-center">
                   <a
                     href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 rounded-full border border-[#fbdcc0]/20 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-[#fbe3c8]/80 transition hover:border-[#fbdcc0]/50 hover:text-[#fff4e6] hover:bg-[#fbdcc0]/5"
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
                     className="flex items-center gap-2 rounded-full border border-[#fbdcc0]/20 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-[#fbe3c8]/80 transition hover:border-[#fbdcc0]/50 hover:text-[#fff4e6] hover:bg-[#fbdcc0]/5"
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
                     className="flex items-center gap-2 rounded-full border border-[#fbdcc0]/20 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-[#fbe3c8]/80 transition hover:border-[#fbdcc0]/50 hover:text-[#fff4e6] hover:bg-[#fbdcc0]/5"
                   >
                     <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                     </svg>
                     <span>Facebook</span>
                   </a>
                   <a
                     href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + shareUrl)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 rounded-full border border-[#fbdcc0]/20 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-[#fbe3c8]/80 transition hover:border-[#fbdcc0]/50 hover:text-[#fff4e6] hover:bg-[#fbdcc0]/5"
                   >
                     <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                       <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.448 4.795 1.449 5.541 0 10.054-4.515 10.057-10.057.002-2.685-1.041-5.21-2.935-7.105-1.895-1.895-4.422-2.938-7.11-2.94h-.015c-5.542 0-10.059 4.515-10.062 10.059-.001 1.704.453 3.371 1.314 4.869l-.993 3.63 3.73-.979zm11.173-7.585c-.3-.15-1.77-.875-2.045-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.77-1.665-2.07-.175-.3-.02-.46.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.075-.525c-.125-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.01-.37-.01-.567-.01-.197 0-.518.074-.788.374-.27.3-1.03 1.01-1.03 2.46s1.055 2.85 1.2 3.05c.145.2 2.08 3.175 5.04 4.455.703.305 1.252.487 1.68.625.709.225 1.353.193 1.862.117.568-.085 1.77-.725 2.02-1.39.25-.665.25-1.235.175-1.39-.075-.15-.275-.25-.575-.4z" />
                     </svg>
                     <span>WhatsApp</span>
                   </a>
                   <button
                     onClick={copyToClipboard}
                     className="flex items-center gap-2 rounded-full border border-[#fbdcc0]/20 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-[#fbe3c8]/80 transition hover:border-[#fbdcc0]/50 hover:text-[#fff4e6] hover:bg-[#fbdcc0]/5 active:scale-95 cursor-pointer"
                   >
                     {copied ? (
                       <>
                         <svg className="h-3.5 w-3.5 text-amber-300 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                           <polyline points="20 6 9 17 4 12" />
                         </svg>
                         <span className="text-amber-300">Copied</span>
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
