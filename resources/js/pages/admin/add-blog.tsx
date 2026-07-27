import { Head, Link, useForm, router } from '@inertiajs/react';
import { RequestPayload } from '@inertiajs/core';
import React, { FormEvent, useState } from 'react';
import TiptapEditor from '../../components/TiptapEditor';
import { BlogPost } from '../../lib/data';

interface BlogContentBlock {
  type: string;
  text?: string;
  items?: string[];
}

interface Props {
  blog?: (Omit<BlogPost, 'content'> & { id?: number | string; content?: BlogContentBlock[] | string }) | null;
}

const convertBlocksToHtml = (blocks?: BlogContentBlock[] | string | null) => {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks.map((block) => {
    if (block.type === 'quote') {
      return `<blockquote>${block.text}</blockquote>`;
    } else if (block.type === 'heading') {
      return `<h2>${block.text}</h2>`;
    } else if (block.type === 'list') {
      const items = block.items?.map((item: string) => `<li>${item}</li>`).join('') || '';
      return `<ul>${items}</ul>`;
    } else {
      return `<p>${block.text || ''}</p>`;
    }
  }).join('');
};

const parseHtmlToBlocks = (html: string) => {
  if (typeof window === 'undefined') {
    return [{ type: 'paragraph', text: '' }];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: Array<{ type: string; text?: string; items?: string[] }> = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    if (tagName === 'blockquote') {
      blocks.push({ type: 'quote', text: el.textContent || '' });
    } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
      blocks.push({ type: 'heading', text: el.textContent || '' });
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items: string[] = [];
      el.querySelectorAll('li').forEach((li) => {
        items.push(li.textContent || '');
      });
      blocks.push({ type: 'list', items });
    } else {
      blocks.push({ type: 'paragraph', text: el.textContent || '' });
    }
  });

  if (blocks.length === 0) {
    blocks.push({ type: 'paragraph', text: '' });
  }

  return blocks;
};

export default function AddBlog({ blog }: Props) {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');

  const { data, setData, processing, errors } = useForm<{
    title: string; category: string; reading_time: string;
    cover_image: string | File | null; status: string; content: string;
    date: string;
  }>({
    title: blog?.title || '',
    category: blog?.category || '',
    reading_time: blog?.reading_time || '',
    cover_image: blog?.cover_image || '',
    status: blog?.status || 'Published',
    content: convertBlocksToHtml(blog?.content) || '',
    date: blog?.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const blocksContent = JSON.stringify(parseHtmlToBlocks(data.content));
    if (blog) {
      router.post(`/admin/blog/${blog.id}`, {
        ...data,
        content: blocksContent,
        _method: 'PUT',
      } as unknown as RequestPayload);
    } else {
      router.post('/admin/blog', {
        ...data,
        content: blocksContent,
      } as unknown as RequestPayload);
    }
  };

  return (
    <>
      <Head title={`${blog ? 'Edit' : 'Add'} Blog Post - Admin Manifesto`} />
      <div className="min-h-screen font-body text-[#fbe3c8] relative">

        {/* Warm Background layer to cover global green gradient */}
        <div className="fixed inset-0 z-0 bg-[#0c0805] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(49,31,19,0.95),rgba(89,52,34,0.85),rgba(15,10,5,0.95))] opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,191,132,0.25),transparent_55%),radial-gradient(circle_at_70%_0%,rgba(255,234,214,0.1),transparent_40%)]"></div>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_1px,transparent_1px,transparent_2px),radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-30"></div>
        </div>

        <div className="relative z-10 flex min-h-screen">

          {/* Sidebar (Static for inner page) */}
          <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-white/5 bg-[#0c0c0e] p-5">
            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-pewter">Admin Panel</p>
              <h1 className="font-display text-xl text-white mt-1">Manifesto</h1>
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
            <header className="flex items-center justify-between border-b border-white/5 bg-[#0f0a07]/85 px-6 py-4 backdrop-blur-md sticky top-0 z-30 lg:px-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 -ml-2 rounded-lg text-[#fbdcc0]/60 hover:text-white hover:bg-white/5 transition inline-flex items-center gap-2 text-sm">
                  ← Back to Admin
                </Link>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <section className="animate-in max-w-4xl mx-auto space-y-6">
                <div>
                  <h3 className="font-display text-2xl text-[#fff4e6]">{blog ? 'Edit' : 'Add New'} Post</h3>
                  <p className="text-sm text-[#fbe3c8]/70 mt-1">Draft a new story, note, or essay.</p>
                </div>

                <form onSubmit={submit} className="warm-card p-6 sm:p-8 space-y-6 rounded-[2.25rem]">
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
                      <label className="block text-xs uppercase tracking-widest text-pewter">Publish Date</label>
                      <input
                        type="date"
                        value={data.date}
                        onChange={e => setData('date', e.target.value)}
                        className="search-input w-full !pl-4 !rounded-xl appearance-none cursor-pointer"
                        required
                      />
                      {errors.date && <div className="text-red-400 text-xs mt-1">{errors.date}</div>}
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
                            if (typeof data.cover_image !== 'string') {
                              setData('cover_image', '');
                            }
                          }}
                          className={`rounded-md px-3 py-1 text-[10px] uppercase tracking-wider transition ${imageSource === 'url' ? 'bg-white/10 text-white font-medium' : 'text-pewter hover:text-white'
                            }`}
                        >
                          URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageSource('upload');
                            setData('cover_image', null);
                          }}
                          className={`rounded-md px-3 py-1 text-[10px] uppercase tracking-wider transition ${imageSource === 'upload' ? 'bg-white/10 text-white font-medium' : 'text-pewter hover:text-white'
                            }`}
                        >
                          Upload
                        </button>
                      </div>
                    </div>

                    {imageSource === 'url' ? (
                      <input
                        type="url"
                        value={typeof data.cover_image === 'string' ? data.cover_image : ''}
                        onChange={e => setData('cover_image', e.target.value)}
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
                            setData('cover_image', file);
                          }}
                          className="search-input w-full !pl-4 !rounded-xl file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer pt-2 pb-2"
                        />
                        {data.cover_image && typeof data.cover_image !== 'string' && (
                          <p className="text-xs text-emerald-400">Selected: {data.cover_image.name}</p>
                        )}
                      </div>
                    )}

                    {blog?.cover_image && typeof data.cover_image === 'string' && data.cover_image !== '' && (
                      <div className="mt-2 text-xs text-pewter flex items-center gap-3">
                        <span>Current Cover:</span>
                        <img src={blog.cover_image} alt="Preview" className="h-10 w-24 object-cover rounded-[0.5rem] border border-white/10" />
                      </div>
                    )}

                    {errors.cover_image && <div className="text-red-400 text-xs mt-1">{errors.cover_image}</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-pewter">Content (Markdown supported)</label>
                    <TiptapEditor
                      content={data.content}
                      onChange={html => setData('content', html)}
                      placeholder="Write your thoughts here..."
                    />
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
