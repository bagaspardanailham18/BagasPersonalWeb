<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Project;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $projects = [
            [
                'id' => 'sonic-trails',
                'title' => 'Sonic Trails Atlas',
                'description' => 'Mapping my favorite forest runs while syncing their ambience, elevation, and BPM-controlled playlists.',
                'category' => 'Website',
                'technologies' => ['React', 'Three.js', 'Mapbox', 'Tone.js'],
                'image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://atlas.bagas.studio',
                'repo_url' => 'https://github.com/bagas/sonic-trails',
                'status' => 'Live'
            ],
            [
                'id' => 'quiet-interfaces',
                'title' => 'Quiet Interfaces Lab',
                'description' => 'A study of minimal client dashboards with piano-like transitions and a focus on contemplative copy.',
                'category' => 'Website',
                'technologies' => ['Next.js', 'Tailwind', 'Framer Motion'],
                'image' => 'https://images.unsplash.com/photo-1470104240373-bc1812eddc9f?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://quietlab.bagas.studio',
                'repo_url' => 'https://github.com/bagas/quiet-interfaces',
                'status' => 'Live'
            ],
            [
                'id' => 'field-notes',
                'title' => 'Field Notes Recorder',
                'description' => 'A journaling tool for capturing code experiments, travel sketches, and running stats on a single canvas.',
                'category' => 'Mobile App',
                'technologies' => ['Remix', 'D3.js', 'Supabase', 'p5.js'],
                'image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://notes.bagas.studio',
                'repo_url' => 'https://github.com/bagas/field-notes',
                'status' => 'Live'
            ],
            [
                'id' => 'canopy-sensors',
                'title' => 'Canopy Sensors Mesh',
                'description' => 'An IoT dashboard that listens to humidity, soil, and wind sensors hidden along my favorite forest ridge.',
                'category' => 'IOT',
                'technologies' => ['Svelte', 'MQTT', 'Grafana'],
                'image' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://canopy.bagas.studio',
                'repo_url' => 'https://github.com/bagas/canopy-sensors',
                'status' => 'Draft'
            ],
            [
                'id' => 'studio-automation',
                'title' => 'Studio Automation Loom',
                'description' => 'Workflow automations that cue piano samples, dim studio lighting, and trigger design system snapshots automatically.',
                'category' => 'Automation',
                'technologies' => ['Node-RED', 'Notion API', 'Zapier'],
                'image' => 'https://images.unsplash.com/photo-1500534310937-5c46b1c16d84?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://loom.bagas.studio',
                'repo_url' => 'https://github.com/bagas/studio-automation',
                'status' => 'Live'
            ],
            [
                'id' => 'horizon-ai',
                'title' => 'Horizon Pulse AI',
                'description' => 'An AI soundscape companion that remixes piano sketches with biometrics captured during endurance runs.',
                'category' => 'AI',
                'technologies' => ['Next.js', 'OpenAI', 'Ableton API'],
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
                'live_url' => 'https://horizon.bagas.studio',
                'repo_url' => 'https://github.com/bagas/horizon-ai',
                'status' => 'Beta'
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        $blogs = [
            [
                'id' => 'latency-etudes',
                'title' => 'Latency Études',
                'category' => 'IT',
                'date' => '2025-01-14',
                'reading_time' => '8 min',
                'status' => 'Published',
                'cover_image' => 'https://images.unsplash.com/photo-1454922915609-78549ad709bb?auto=format&fit=crop&w=1600&q=80',
                'content' => [
                    ['type' => 'paragraph', 'text' => 'Optimizing edge functions lately has felt like practicing piano etudes—slow, repeatable, attentive to the tiniest resonance.'],
                    ['type' => 'quote', 'text' => 'Every millisecond carries a mood.'],
                    ['type' => 'paragraph', 'text' => 'I layered observability tracks with OpenTelemetry and could finally hear where requests were losing their pulse.'],
                ],
            ],
            [
                'id' => 'running-in-silence',
                'title' => 'Running in Silence',
                'category' => 'Life',
                'date' => '2024-11-02',
                'reading_time' => '5 min',
                'status' => 'Published',
                'cover_image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
                'content' => [
                    ['type' => 'paragraph', 'text' => 'Jakarta at dawn is never fully quiet, yet the rhythm of shoes on asphalt becomes a metronome I can trust.'],
                    ['type' => 'list', 'items' => ['breath in 4 beats', 'hold in 2', 'release in 6']],
                    ['type' => 'paragraph', 'text' => 'Those breath equations spill into how I scope projects and negotiate consulting timelines.'],
                ],
            ],
            [
                'id' => 'graph-trails',
                'title' => 'Graph Trails for Creative Briefs',
                'category' => 'IT',
                'date' => '2024-09-19',
                'reading_time' => '7 min',
                'status' => 'Published',
                'cover_image' => 'https://images.unsplash.com/photo-1451188502541-13943edb6acb?auto=format&fit=crop&w=1600&q=80',
                'content' => [
                    ['type' => 'paragraph', 'text' => 'I prototyped a graph database to help clients understand creative dependencies with the clarity of a hiking map.'],
                    ['type' => 'paragraph', 'text' => 'The biggest win was reducing kickoff meetings from 5 calls to 2, simply by letting the map explain the effort.'],
                ],
            ],
            [
                'id' => 'kyoto-twilight',
                'title' => 'Kyoto Twilight Jog',
                'category' => 'Travel',
                'date' => '2024-08-04',
                'reading_time' => '6 min',
                'status' => 'Published',
                'cover_image' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
                'content' => [
                    ['type' => 'paragraph', 'text' => 'I ran along the Kamo River with temple bells marking kilometers—a different kind of pace chart.'],
                    ['type' => 'quote', 'text' => 'Every bridge felt like a commit checkpoint.'],
                ],
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
