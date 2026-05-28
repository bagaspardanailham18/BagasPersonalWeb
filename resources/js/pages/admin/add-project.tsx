import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { FormEvent, useState } from 'react';

interface Props {
  project?: any;
}

export default function AddProject({ project }: Props) {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');

  const { data, setData, post, put, processing, errors } = useForm<{
    title: string; category: string; technologies: string; status: string;
    image: string | File | null; live_url: string; repo_url: string; description: string;
  }>({
    title: project?.title || '',
    category: project?.category || '',
    technologies: project?.technologies?.join(', ') || '',
    status: project?.status || 'Live',
    image: project?.image || '',
    live_url: project?.live_url || '',
    repo_url: project?.repo_url || '',
    description: project?.description || '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (project) {
      router.post(`/admin/project/${project.id}`, {
        ...data,
        _method: 'PUT',
      } as any);
    } else {
      post('/admin/project');
    }
  };

  return (
    <>
      <Head title={`${project ? 'Edit' : 'Add'} Project - Admin Sanctuary`} />
      <div className="bg-[#0a0a0b] text-mist font-body min-h-screen">
        
        <div className="flex min-h-screen">
           {/* Sidebar */}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /></svg>
                Projects
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
                    <h3 className="font-display text-2xl text-white">{project ? 'Edit' : 'Add New'} Project</h3>
                    <p className="text-sm text-pewter mt-1">Add a new IT project to your portfolio.</p>
                 </div>

                 <form onSubmit={submit} className="chart-card p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                       <label className="block text-xs uppercase tracking-widest text-pewter">Title</label>
                       <input 
                          type="text" 
                          value={data.title}
                          onChange={e => setData('title', e.target.value)}
                          placeholder="Project Name" 
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
                             <option value="Website">Website</option>
                             <option value="Mobile App">Mobile App</option>
                             <option value="IOT">IOT</option>
                             <option value="Automation">Automation</option>
                             <option value="AI">AI</option>
                          </select>
                          {errors.category && <div className="text-red-400 text-xs mt-1">{errors.category}</div>}
                       </div>
                       <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-widest text-pewter">Technologies</label>
                          <input 
                            type="text" 
                            value={data.technologies}
                            onChange={e => setData('technologies', e.target.value)}
                            placeholder="React, Next.js, (Comma sep)" 
                            className="search-input w-full !pl-4 !rounded-xl" 
                            required 
                          />
                          {errors.technologies && <div className="text-red-400 text-xs mt-1">{errors.technologies}</div>}
                       </div>
                    </div>

                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <label className="block text-xs uppercase tracking-widest text-pewter">Cover Image</label>
                           <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/5">
                              <button
                                 type="button"
                                 onClick={() => {
                                    setImageSource('url');
                                    if (typeof data.image !== 'string') {
                                       setData('image', '');
                                    }
                                 }}
                                 className={`rounded-md px-3 py-1 text-[10px] uppercase tracking-wider transition ${
                                    imageSource === 'url' ? 'bg-white/10 text-white font-medium' : 'text-pewter hover:text-white'
                                 }`}
                              >
                                 URL
                              </button>
                              <button
                                 type="button"
                                 onClick={() => {
                                    setImageSource('upload');
                                    setData('image', null);
                                 }}
                                 className={`rounded-md px-3 py-1 text-[10px] uppercase tracking-wider transition ${
                                    imageSource === 'upload' ? 'bg-white/10 text-white font-medium' : 'text-pewter hover:text-white'
                                 }`}
                              >
                                 Upload
                              </button>
                           </div>
                        </div>

                        {imageSource === 'url' ? (
                           <input 
                             type="url" 
                             value={typeof data.image === 'string' ? data.image : ''}
                             onChange={e => setData('image', e.target.value)}
                             placeholder="https://images.unsplash.com/..." 
                             className="search-input w-full !pl-4 !rounded-xl" 
                           />
                        ) : (
                           <div className="flex flex-col gap-2">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => {
                                   const file = e.target.files?.[0] || null;
                                   setData('image', file);
                                }}
                                className="search-input w-full !pl-4 !rounded-xl file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer pt-2 pb-2" 
                              />
                              {data.image && typeof data.image !== 'string' && (
                                 <p className="text-xs text-emerald-400">Selected: {data.image.name}</p>
                              )}
                           </div>
                        )}

                        {project?.image && typeof data.image === 'string' && data.image !== '' && (
                           <div className="mt-2 text-xs text-pewter flex items-center gap-3">
                              <span>Current Image:</span>
                              <img src={project.image} alt="Preview" className="h-10 w-24 object-cover rounded-[0.5rem] border border-white/10" />
                           </div>
                        )}

                        {errors.image && <div className="text-red-400 text-xs mt-1">{errors.image}</div>}
                     </div>

                     <div className="grid gap-6 sm:grid-cols-2">
                         <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-widest text-pewter">Live URL</label>
                            <input 
                              type="url" 
                              value={data.live_url}
                              onChange={e => setData('live_url', e.target.value)}
                              placeholder="https://..." 
                              className="search-input w-full !pl-4 !rounded-xl" 
                            />
                            {errors.live_url && <div className="text-red-400 text-xs mt-1">{errors.live_url}</div>}
                         </div>
                         <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-widest text-pewter">Repo URL</label>
                            <input 
                              type="url" 
                              value={data.repo_url}
                              onChange={e => setData('repo_url', e.target.value)}
                              placeholder="https://..." 
                              className="search-input w-full !pl-4 !rounded-xl" 
                            />
                            {errors.repo_url && <div className="text-red-400 text-xs mt-1">{errors.repo_url}</div>}
                         </div>
                     </div>

                    <div className="space-y-2">
                       <label className="block text-xs uppercase tracking-widest text-pewter">Description</label>
                       <textarea 
                         rows={4} 
                         value={data.description}
                         onChange={e => setData('description', e.target.value)}
                         placeholder="Project description..." 
                         className="search-input w-full !pl-4 !rounded-xl resize-none font-serif text-base leading-relaxed"
                         required
                       ></textarea>
                       {errors.description && <div className="text-red-400 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                       <button 
                         type="submit" 
                         className="add-btn disabled:opacity-50" 
                         disabled={processing}
                         onClick={() => setData('status', 'Live')}
                       >
                         {project ? 'Update Project' : 'Publish Project'}
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
