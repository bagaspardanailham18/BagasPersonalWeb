<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('home', [
            'projects' => Project::orderBy('created_at', 'desc')->get(),
            'blogPosts' => Blog::where('status', 'Published')->orderBy('date', 'desc')->get()
        ])->withViewData([
            'metaTitle' => 'Bagas Pardana Ilham — Personal Sanctuary',
            'metaDescription' => 'The personal sanctuary of Bagas Pardana Ilham—quiet IT projects, blog essays, and contemplative notes inspired by running in nature and piano sketches.',
            'metaImage' => asset('favicon.svg'),
            'metaUrl' => url('/'),
            'metaJsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                'name' => 'Bagas Pardana Ilham — Personal Sanctuary',
                'url' => url('/'),
                'description' => 'The personal sanctuary of Bagas Pardana Ilham—quiet IT projects, blog essays, and contemplative notes inspired by running in nature and piano sketches.'
            ]
        ]);
    }

    public function showProject($id)
    {
        $project = Project::findOrFail($id);
        
        $description = strip_tags($project->description ?? '');
        $description = mb_substr($description, 0, 150) . (mb_strlen($description) > 150 ? '...' : '');

        $imageUrl = null;
        if ($project->image) {
            $imageUrl = str_starts_with($project->image, 'http') ? $project->image : asset($project->image);
        }

        return Inertia::render('project-detail', [
            'project' => $project
        ])->withViewData([
            'metaTitle' => $project->title . ' — Personal Sanctuary',
            'metaDescription' => $description ?: 'A quiet project and contemplative space built by Bagas Pardana Ilham.',
            'metaImage' => $imageUrl,
            'metaUrl' => route('project.show', $project->id),
            'metaJsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'CreativeWork',
                'name' => $project->title,
                'description' => $description ?: 'A quiet project and contemplative space built by Bagas Pardana Ilham.',
                'image' => $imageUrl,
                'url' => route('project.show', $project->id),
                'author' => [
                    '@type' => 'Person',
                    'name' => 'Bagas Pardana Ilham'
                ],
                'datePublished' => $project->created_at->toIso8601String(),
                'dateModified' => $project->updated_at->toIso8601String()
            ]
        ]);
    }

    public function showBlog($id)
    {
        $blog = Blog::findOrFail($id);
        
        $description = '';
        if (is_array($blog->content)) {
            foreach ($blog->content as $block) {
                if (isset($block['type']) && $block['type'] === 'list' && isset($block['items'])) {
                    $description .= implode(', ', $block['items']) . ' ';
                } elseif (isset($block['text'])) {
                    $description .= $block['text'] . ' ';
                }
            }
        }
        $description = strip_tags($description);
        $description = trim(preg_replace('/\s+/', ' ', $description));
        $description = mb_substr($description, 0, 150) . (mb_strlen($description) > 150 ? '...' : '');

        $coverUrl = null;
        if ($blog->cover_image) {
            $coverUrl = str_starts_with($blog->cover_image, 'http') ? $blog->cover_image : asset($blog->cover_image);
        }

        return Inertia::render('blog-detail', [
            'post' => $blog
        ])->withViewData([
            'metaTitle' => $blog->title . ' — Journal Entry',
            'metaDescription' => $description ?: 'A thoughtful essay and contemplative note by Bagas Pardana Ilham.',
            'metaImage' => $coverUrl,
            'metaUrl' => route('blog.show', $blog->id),
            'metaJsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $blog->title,
                'description' => $description ?: 'A thoughtful essay and contemplative note by Bagas Pardana Ilham.',
                'image' => $coverUrl,
                'url' => route('blog.show', $blog->id),
                'author' => [
                    '@type' => 'Person',
                    'name' => 'Bagas Pardana Ilham'
                ],
                'datePublished' => $blog->date,
                'dateModified' => $blog->updated_at->toIso8601String()
            ]
        ]);
    }
}

