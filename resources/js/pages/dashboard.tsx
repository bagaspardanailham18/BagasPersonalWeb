import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { Project, BlogPost, messages } from '../lib/data';

interface Props {
  projects: Project[];
  blogPosts: BlogPost[];
}

export default function Dashboard({ projects = [], blogPosts = [] }: Props) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Projects filtering
  const [projectSearch, setProjectSearch] = useState('');
  // Blog filtering
  const [blogSearch, setBlogSearch] = useState('');

  // Chart state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');

  // Chart drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeSection !== 'dashboard') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chartData7d = [820, 1240, 980, 1560, 2100, 1890, 2340];
    const chartLabels7d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chartData30d = [620, 780, 920, 1100, 980, 1340, 1200, 1450, 1380, 1600, 1520, 1780, 1900, 2100, 1950, 2200, 2080, 2350, 2100, 1980, 2400, 2500, 2300, 2650, 2800, 2700, 2900, 3100, 2950, 3200];
    const chartLabels30d = Array.from({ length: 30 }, (_, i) => (i + 1) % 5 === 0 || i === 0 ? `D${i + 1}` : '');

    const data = chartRange === '30d' ? chartData30d : chartData7d;
    const labels = chartRange === '30d' ? chartLabels30d : chartLabels7d;

    const drawChart = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);

      const w = rect.width, h = rect.height;
      const pad = { top: 10, right: 10, bottom: 30, left: 45 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const max = Math.max(...data) * 1.15;
      const xStep = chartW / (data.length - 1);

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        // Label
        ctx.fillStyle = 'rgba(155,161,166,0.5)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(max - (max / 4) * i).toString(), pad.left - 8, y + 3);
      }

      // X labels
      ctx.fillStyle = 'rgba(155,161,166,0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      labels.forEach((l, i) => {
        ctx.fillText(l, pad.left + xStep * i, h - 8);
      });

      // Points
      const points = data.map((val, i) => ({
        x: pad.left + xStep * i,
        y: pad.top + chartH - (val / max) * chartH,
      }));

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0.15)');
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
      ctx.beginPath();
      ctx.moveTo(points[0].x, pad.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      points.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0b';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#4ade80';
        ctx.fill();
      });
    };

    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [activeSection, chartRange]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const statusBadge = (s: string) => {
    const map: Record<string, string> = { Live: 'badge-green', Published: 'badge-green', Draft: 'badge-amber', Beta: 'badge-blue' };
    return `<span class="badge ${map[s] || 'badge-blue'}">${s}</span>`;
  };

  const filteredProjects = projects.filter(p => !projectSearch || [p.title, p.category, ...p.technologies].join(' ').toLowerCase().includes(projectSearch.toLowerCase()));
  const filteredBlogPosts = blogPosts.filter(p => !blogSearch || [p.title, p.category].join(' ').toLowerCase().includes(blogSearch.toLowerCase()));

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    blog: 'Blog Posts',
    messages: 'Messages',
    settings: 'Settings'
  };

  return (
    <>
      <Head title={`${pageTitles[activeSection]} - Admin Sanctuary`} />
      <div className="bg-[#0a0a0b] text-mist font-body min-h-screen">

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:hidden'}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0c0c0e] p-5 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:relative'}`}>
            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-pewter">Admin Panel</p>
              <h1 className="font-display text-xl text-white mt-1">Sanctuary</h1>
            </div>

            <nav className="flex-1 space-y-1">
              {[
                {
                  id: 'dashboard', label: 'Dashboard', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
                  )
                },
                {
                  id: 'projects', label: 'Projects', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /></svg>
                  )
                },
                {
                  id: 'blog', label: 'Blog Posts', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
                  )
                },
                {
                  id: 'messages', label: 'Messages', badge: 3, icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  )
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                  className={`w-full sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white">{item.badge}</span>}
                </button>
              ))}

              <div className="my-4 h-px bg-white/5"></div>

              <button
                onClick={() => { setActiveSection('settings'); setIsSidebarOpen(false); }}
                className={`w-full sidebar-link ${activeSection === 'settings' ? 'active' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                Settings
              </button>
            </nav>

            <div className="mt-auto pt-4 border-t border-white/5">
              <Link href="/" className="w-full sidebar-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                Back to site
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col min-w-0">
            <header className="flex items-center justify-between border-b border-white/5 bg-[#0a0a0b]/80 px-6 py-4 backdrop-blur-md sticky top-0 z-30 lg:px-8">
              <button
                className="lg:hidden p-2 -ml-2 rounded-lg text-pewter hover:text-white hover:bg-white/5 transition"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>

              <h2 className="font-display text-lg text-white hidden lg:block">{pageTitles[activeSection]}</h2>

              <div className="flex items-center gap-4 ml-auto">
                <button className="relative p-2 rounded-lg text-pewter hover:text-white hover:bg-white/5 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-xs font-medium text-white">BP</div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-white font-medium leading-none">Bagas P.</p>
                    <p className="text-[11px] text-pewter mt-0.5">Admin</p>
                  </div>
                </div>
                <Link href="/logout" method="post" as="button" className="action-btn text-[11px] hidden sm:inline-flex">Logout</Link>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">

              {/* Dashboard Section */}
              {activeSection === 'dashboard' && (
                <section className="space-y-8 animate-in text-left">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="stat-card opacity-0 animate-in d1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /></svg>
                        </div>
                        <span className="badge badge-green">+2 this month</span>
                      </div>
                      <p className="text-3xl font-display font-semibold text-white">6</p>
                      <p className="text-xs text-pewter mt-1 uppercase tracking-wider">Total Projects</p>
                    </div>

                    <div className="stat-card opacity-0 animate-in d2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
                        </div>
                        <span className="badge badge-blue">+1 this week</span>
                      </div>
                      <p className="text-3xl font-display font-semibold text-white">4</p>
                      <p className="text-xs text-pewter mt-1 uppercase tracking-wider">Blog Posts</p>
                    </div>

                    <div className="stat-card opacity-0 animate-in d3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <span className="badge badge-green">↑ 12%</span>
                      </div>
                      <p className="text-3xl font-display font-semibold text-white">12.4k</p>
                      <p className="text-xs text-pewter mt-1 uppercase tracking-wider">Total Views</p>
                    </div>

                    <div className="stat-card opacity-0 animate-in d4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                        <span className="badge badge-amber">3 unread</span>
                      </div>
                      <p className="text-3xl font-display font-semibold text-white">8</p>
                      <p className="text-xs text-pewter mt-1 uppercase tracking-wider">Messages</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                    <div className="chart-card p-6 opacity-0 animate-in d5">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-pewter">Page Views</p>
                          <p className="text-sm text-white/60 mt-0.5">Last {chartRange === '7d' ? '7 days' : '30 days'}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className={`action-btn text-[11px] ${chartRange === '7d' ? 'text-white border-white/20' : ''}`} onClick={() => setChartRange('7d')}>7D</button>
                          <button className={`action-btn text-[11px] ${chartRange === '30d' ? 'text-white border-white/20' : ''}`} onClick={() => setChartRange('30d')}>30D</button>
                        </div>
                      </div>
                      <canvas ref={canvasRef} height="180" className="w-full"></canvas>
                    </div>

                    <div className="chart-card p-6 opacity-0 animate-in d6">
                      <p className="text-xs uppercase tracking-widest text-pewter mb-5">Recent Activity</p>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shrink-0"></div>
                          <div>
                            <p className="text-sm text-white/90">Published "Latency Études"</p>
                            <p className="text-[11px] text-pewter mt-0.5">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 shrink-0"></div>
                          <div>
                            <p className="text-sm text-white/90">Updated Sonic Trails Atlas project</p>
                            <p className="text-[11px] text-pewter mt-0.5">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-amber-400 shrink-0"></div>
                          <div>
                            <p className="text-sm text-white/90">New message from Aki Tanaka</p>
                            <p className="text-[11px] text-pewter mt-0.5">Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="chart-card overflow-hidden opacity-0 animate-in d5">
                      <div className="flex items-center justify-between p-5 pb-0">
                        <p className="text-xs uppercase tracking-widest text-pewter">Latest Projects</p>
                        <button onClick={() => setActiveSection('projects')} className="text-xs text-pewter hover:text-white transition">View all →</button>
                      </div>
                      <div className="overflow-x-auto mt-4">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.slice(0, 4).map(p => (
                              <tr key={p.id}>
                                <td className="font-medium text-white">{p.title}</td>
                                <td>{p.category}</td>
                                <td dangerouslySetInnerHTML={{ __html: statusBadge(p.status) }} />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="chart-card overflow-hidden opacity-0 animate-in d6">
                      <div className="flex items-center justify-between p-5 pb-0">
                        <p className="text-xs uppercase tracking-widest text-pewter">Latest Blog Posts</p>
                        <button onClick={() => setActiveSection('blog')} className="text-xs text-pewter hover:text-white transition">View all →</button>
                      </div>
                      <div className="overflow-x-auto mt-4">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogPosts.slice(0, 4).map(p => (
                              <tr key={p.id}>
                                <td className="font-medium text-white">{p.title}</td>
                                <td>{p.category}</td>
                                <td>{formatDate(p.date)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <section className="space-y-6 animate-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-white">Projects</h3>
                      <p className="text-sm text-pewter mt-1">Manage your portfolio projects</p>
                    </div>
                    <Link href="/admin/add-project" className="add-btn"><span className="text-lg leading-none">+</span> Add Project</Link>
                  </div>
                  <div className="relative max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-pewter/60"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="search" placeholder="Search projects..." value={projectSearch} onChange={e => setProjectSearch(e.target.value)} className="search-input w-full" />
                  </div>
                  <div className="chart-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Technologies</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProjects.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-pewter py-8">No projects match your search.</td></tr>
                          ) : (
                            filteredProjects.map(p => (
                              <tr key={p.id}>
                                <td className="font-medium text-white">{p.title}</td>
                                <td>{p.category}</td>
                                <td><div className="flex flex-wrap gap-1">{p.technologies.map(t => <span key={t} className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-pewter">{t}</span>)}</div></td>
                                <td dangerouslySetInnerHTML={{ __html: statusBadge(p.status) }} />
                                <td className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Link href={`/admin/edit-project/${p.id}`} className="action-btn">Edit</Link>
                                    <button onClick={() => confirm('Are you sure you want to delete this project?') && router.delete(`/admin/project/${p.id}`)} className="action-btn action-btn-danger">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Blog Section */}
              {activeSection === 'blog' && (
                <section className="space-y-6 animate-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-white">Blog Posts</h3>
                      <p className="text-sm text-pewter mt-1">Manage your journal entries</p>
                    </div>
                    <Link href="/admin/add-blog" className="add-btn"><span className="text-lg leading-none">+</span> Add Post</Link>
                  </div>
                  <div className="relative max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-pewter/60"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="search" placeholder="Search posts..." value={blogSearch} onChange={e => setBlogSearch(e.target.value)} className="search-input w-full" />
                  </div>
                  <div className="chart-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Reading Time</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBlogPosts.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-pewter py-8">No posts match your search.</td></tr>
                          ) : (
                            filteredBlogPosts.map(p => (
                              <tr key={p.id}>
                                <td className="font-medium text-white">{p.title}</td>
                                <td>{p.category}</td>
                                <td>{formatDate(p.date)}</td>
                                <td>{p.readingTime || p.reading_time}</td>
                                <td className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Link href={`/admin/edit-blog/${p.id}`} className="action-btn">Edit</Link>
                                    <button onClick={() => confirm('Are you sure you want to delete this post?') && router.delete(`/admin/blog/${p.id}`)} className="action-btn action-btn-danger">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Messages Section */}
              {activeSection === 'messages' && (
                <section className="space-y-6 animate-in">
                  <div>
                    <h3 className="font-display text-2xl text-white">Messages</h3>
                    <p className="text-sm text-pewter mt-1">Inbox from visitors and collaborators</p>
                  </div>
                  <div className="space-y-3">
                    {messages.map((m, i) => (
                      <div key={i} className={`chart-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${!m.read ? 'border-l-2 !border-l-emerald-400/60' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white truncate">{m.from}</p>
                            {!m.read && <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>}
                          </div>
                          <p className="text-sm text-white/70 truncate">{m.subject}</p>
                          <p className="text-[11px] text-pewter mt-1">{m.email} · {m.time}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="action-btn">Reply</button>
                          <button className="action-btn action-btn-danger">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Settings Section */}
              {activeSection === 'settings' && (
                <section className="space-y-6 animate-in">
                  <div>
                    <h3 className="font-display text-2xl text-white">Settings</h3>
                    <p className="text-sm text-pewter mt-1">Configure your admin preferences</p>
                  </div>
                  <div className="chart-card p-6 max-w-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-widest text-pewter">Display Name</label>
                      <input type="text" defaultValue="Bagas Pardana Ilham" className="search-input w-full !pl-4 !rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-widest text-pewter">Email</label>
                      <input type="email" defaultValue="hello@bagas.studio" className="search-input w-full !pl-4 !rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-widest text-pewter">Bio</label>
                      <textarea rows={3} defaultValue="Quiet technology, personal rituals. I craft contemplative digital spaces." className="search-input w-full !pl-4 !rounded-xl resize-none"></textarea>
                    </div>
                    <button className="add-btn">Save Changes</button>
                  </div>
                </section>
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}
