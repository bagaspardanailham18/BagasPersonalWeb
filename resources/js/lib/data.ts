export interface Project {
  id: string;
  title: string;
  description?: string;
  category: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  status: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  coverImage?: string;
  status: string;
  content: Array<{ type: string; text?: string; items?: string[] }>;
}

export interface Message {
  from: string;
  email: string;
  subject: string;
  time: string;
  read: boolean;
}

export interface NatureNote {
  id: string;
  label: string;
  mood: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: 'sonic-trails',
    title: 'Sonic Trails Atlas',
    description: 'Mapping my favorite forest runs while syncing their ambience, elevation, and BPM-controlled playlists.',
    category: 'Website',
    technologies: ['React', 'Three.js', 'Mapbox', 'Tone.js'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://atlas.bagas.studio',
    repoUrl: 'https://github.com/bagas/sonic-trails',
    status: 'Live'
  },
  {
    id: 'quiet-interfaces',
    title: 'Quiet Interfaces Lab',
    description: 'A study of minimal client dashboards with piano-like transitions and a focus on contemplative copy.',
    category: 'Website',
    technologies: ['Next.js', 'Tailwind', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1470104240373-bc1812eddc9f?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://quietlab.bagas.studio',
    repoUrl: 'https://github.com/bagas/quiet-interfaces',
    status: 'Live'
  },
  {
    id: 'field-notes',
    title: 'Field Notes Recorder',
    description: 'A journaling tool for capturing code experiments, travel sketches, and running stats on a single canvas.',
    category: 'Mobile App',
    technologies: ['Remix', 'D3.js', 'Supabase', 'p5.js'],
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://notes.bagas.studio',
    repoUrl: 'https://github.com/bagas/field-notes',
    status: 'Live'
  },
  {
    id: 'canopy-sensors',
    title: 'Canopy Sensors Mesh',
    description: 'An IoT dashboard that listens to humidity, soil, and wind sensors hidden along my favorite forest ridge.',
    category: 'IOT',
    technologies: ['Svelte', 'MQTT', 'Grafana'],
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://canopy.bagas.studio',
    repoUrl: 'https://github.com/bagas/canopy-sensors',
    status: 'Draft'
  },
  {
    id: 'studio-automation',
    title: 'Studio Automation Loom',
    description: 'Workflow automations that cue piano samples, dim studio lighting, and trigger design system snapshots automatically.',
    category: 'Automation',
    technologies: ['Node-RED', 'Notion API', 'Zapier'],
    image: 'https://images.unsplash.com/photo-1500534310937-5c46b1c16d84?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://loom.bagas.studio',
    repoUrl: 'https://github.com/bagas/studio-automation',
    status: 'Live'
  },
  {
    id: 'horizon-ai',
    title: 'Horizon Pulse AI',
    description: 'An AI soundscape companion that remixes piano sketches with biometrics captured during endurance runs.',
    category: 'AI',
    technologies: ['Next.js', 'OpenAI', 'Ableton API'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://horizon.bagas.studio',
    repoUrl: 'https://github.com/bagas/horizon-ai',
    status: 'Beta'
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'latency-etudes',
    title: 'Latency Études',
    category: 'IT',
    date: '2025-01-14',
    readingTime: '8 min',
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1454922915609-78549ad709bb?auto=format&fit=crop&w=1600&q=80',
    content: [
      { type: 'paragraph', text: 'Optimizing edge functions lately has felt like practicing piano etudes—slow, repeatable, attentive to the tiniest resonance.' },
      { type: 'quote', text: 'Every millisecond carries a mood.' },
      { type: 'paragraph', text: 'I layered observability tracks with OpenTelemetry and could finally hear where requests were losing their pulse.' },
    ],
  },
  {
    id: 'running-in-silence',
    title: 'Running in Silence',
    category: 'Life',
    date: '2024-11-02',
    readingTime: '5 min',
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    content: [
      { type: 'paragraph', text: 'Jakarta at dawn is never fully quiet, yet the rhythm of shoes on asphalt becomes a metronome I can trust.' },
      { type: 'list', items: ['breath in 4 beats', 'hold in 2', 'release in 6'] },
      { type: 'paragraph', text: 'Those breath equations spill into how I scope projects and negotiate consulting timelines.' },
    ],
  },
  {
    id: 'graph-trails',
    title: 'Graph Trails for Creative Briefs',
    category: 'IT',
    date: '2024-09-19',
    readingTime: '7 min',
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1451188502541-13943edb6acb?auto=format&fit=crop&w=1600&q=80',
    content: [
      { type: 'paragraph', text: 'I prototyped a graph database to help clients understand creative dependencies with the clarity of a hiking map.' },
      { type: 'paragraph', text: 'The biggest win was reducing kickoff meetings from 5 calls to 2, simply by letting the map explain the effort.' },
    ],
  },
  {
    id: 'kyoto-twilight',
    title: 'Kyoto Twilight Jog',
    category: 'Travel',
    date: '2024-08-04',
    readingTime: '6 min',
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
    content: [
      { type: 'paragraph', text: 'I ran along the Kamo River with temple bells marking kilometers—a different kind of pace chart.' },
      { type: 'quote', text: 'Every bridge felt like a commit checkpoint.' },
    ],
  },
];

export const messages: Message[] = [
  { from: 'Aki Tanaka', email: 'aki@studio.jp', subject: 'Collaboration on forest soundscape project', time: '2 hours ago', read: false },
  { from: 'Sarah Chen', email: 'sarah@design.co', subject: 'Love the Quiet Interfaces Lab – can we chat?', time: '5 hours ago', read: false },
  { from: 'Marcus Rivera', email: 'marcus@dev.io', subject: 'IOT sensor mesh question', time: 'Yesterday', read: false },
  { from: 'Lena Nguyen', email: 'lena@travel.com', subject: 'Kyoto running route recommendation', time: '2 days ago', read: true },
  { from: 'Tomás Müller', email: 'tomas@ai.lab', subject: 'Horizon Pulse AI feedback', time: '3 days ago', read: true },
  { from: 'Yuki Sato', email: 'yuki@music.io', subject: 'Piano sketches collaboration idea', time: '4 days ago', read: true },
  { from: 'Rina Patel', email: 'rina@consulting.co', subject: 'Consulting engagement inquiry', time: '5 days ago', read: true },
  { from: 'Leo Kim', email: 'leo@open.dev', subject: 'Open source contribution to Field Notes', time: '1 week ago', read: true },
];

export const natureNotes: NatureNote[] = [
  {
    id: 'fog-tempo',
    label: 'Fog tempo',
    mood: 'Forest Dawn',
    description: 'Low clouds over Bogor, 120 bpm cadence, UI pacing slowed to soft fade-ins.',
  },
  {
    id: 'river-chords',
    label: 'River chords',
    mood: 'Citarum Bend',
    description: 'Muted green-blue palette sampled from river stones, paired with piano sixths.',
  },
  {
    id: 'cedar-air',
    label: 'Cedar air',
    mood: 'Highland Ridge',
    description: 'Micro-interactions breathe in-out, mirroring cedar scents carried by sidewinds.',
  },
];
