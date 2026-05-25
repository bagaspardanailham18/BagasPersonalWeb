import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEvent } from 'react';

interface Props {
  blog?: any;
}

export default function AddBlog({ blog }: Props) {
  const { data, setData, post, put, processing, errors } = useForm<{
    title: string; category: string; reading_time: string;
    cover_image: string; status: string; content: string;
  }>({
    title: blog?.title || '',
    category: blog?.category || '',
    reading_time: blog?.reading_time || '',
    cover_image: blog?.cover_image || '',
    status: blog?.status || 'Published',
    content: blog?.content?.[0]?.text || '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (blog) {
      put(`/admin/blog/${blog.id}`);
    } else {
      post('/admin/blog');
    }
  };

  return (
    <>
      <Head title={`${blog ? 'Edit' : 'Add'} Blog Post - Admin Sanctuary`} />
      <div className="bg-[#0a0a0b] text-mist font-body min-h-screen">
        
        <div className="flex min-h-screen">
          
           {/* Sidebar (Static for inner page) */}
           <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-white/5 bg-[#0c0c0e] p-5">
            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-pewter">Admin Panel</p>
              <h1 className="font-display text-xl text-white mt-1">Sanctuary</h1>
            </div>

            <nav className="flex-1 space-y-1">
              <Link href="/dashboard" className="w-full sidebar-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
                Dashboard
              </Link>
              <Link href="/dashboard" className="w-full sidebar-link active">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
                Blog Posts
              </Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-white/5">
              <Link href="/" className="w-full sidebar-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                Back to site
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col min-w-0 lg:ml-64">
            <header className="flex items-center justify-between border-b border-white/5 bg-[#0a0a0b]/80 px-6 py-4 backdrop-blur-md sticky top-0 z-30 lg:px-8">
              <div className="flex items-center gap-4">
                 <Link href="/dashboard" className="p-2 -ml-2 rounded-lg text-pewter hover:text-white hover:bg-white/5 transition inline-flex items-center gap-2 text-sm">
                   ← Back to Admin
                 </Link>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
               <section className="animate-in max-w-4xl mx-auto space-y-6">
                 <div>
                    <h3 className="font-display text-2xl text-white">{blog ? 'Edit' : 'Add New'} Post</h3>
                    <p className="text-sm text-pewter mt-1">Draft a new story, note, or essay.</p>
                 </div>

                 <form onSubmit={submit} className="chart-card p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                       <label className="block text-xs uppercase tracking-widest text-pewter">Title</label>
                       <input 
                          type="text" 
                          value={data.title}
                          onChange={e => setData('title', e.target.value)}
                          placeholder="Evening Runs in Kyoto" 
                          className="search-input w-full !pl-4 !rounded-xl" 
                          required 
                        />
                       {errors.title && <div className="text-red-400 text-xs mt-1">{errors.title}</div>}
                    </div>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                       <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-widest text-pewter">Category</label>
                          <select 
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className="search-input w-full !pl-4 !rounded-xl appearance-none cursor-pointer"
                            required
                          >
                             <option value="" disabled>Select a category</option>
                             <option value="IT">IT</option>
                             <option value="Life">Life</option>
                             <option value="Travel">Travel</option>
                          </select>
                          {errors.category && <div className="text-red-400 text-xs mt-1">{errors.category}</div>}
                       </div>
                       <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-widest text-pewter">Reading Time</label>
                          <input 
                            type="text" 
                            value={data.reading_time}
                            onChange={e => setData('reading_time', e.target.value)}
                            placeholder="e.g. 5 min" 
                            className="search-input w-full !pl-4 !rounded-xl" 
                            required 
                          />
                          {errors.reading_time && <div className="text-red-400 text-xs mt-1">{errors.reading_time}</div>}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="block text-xs uppercase tracking-widest text-pewter">Cover Image URL</label>
                       <input 
                         type="url" 
                         value={data.cover_image}
                         onChange={e => setData('cover_image', e.target.value)}
                         placeholder="https://images.unsplash.com/..." 
                         className="search-input w-full !pl-4 !rounded-xl" 
                       />
                       {errors.cover_image && <div className="text-red-400 text-xs mt-1">{errors.cover_image}</div>}
                    </div>

                    <div className="space-y-2">
                       <label className="block text-xs uppercase tracking-widest text-pewter">Content (Markdown supported)</label>
                       <textarea 
                         rows={12} 
                         value={data.content}
                         onChange={e => setData('content', e.target.value)}
                         placeholder="Write your thoughts here..." 
                         className="search-input w-full !pl-4 !rounded-xl resize-none font-serif text-base leading-relaxed"
                         required
                       ></textarea>
                       {errors.content && <div className="text-red-400 text-xs mt-1">{errors.content}</div>}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                       <button 
                         type="submit" 
                         className="add-btn disabled:opacity-50" 
                         disabled={processing}
                         onClick={() => setData('status', 'Published')}
                       >
                         {blog ? 'Update Post' : 'Publish Post'}
                       </button>
                       <button 
                         type="submit" 
                         className="action-btn !px-6 disabled:opacity-50" 
                         disabled={processing}
                         onClick={() => setData('status', 'Draft')}
                       >
                         Save Draft
                       </button>
                    </div>
                 </form>
               </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
