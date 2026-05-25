<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('dashboard', [
            'projects' => Project::orderBy('created_at', 'desc')->get(),
            'blogPosts' => Blog::orderBy('date', 'desc')->get()
        ]);
    }

    public function createBlog()
    {
        return Inertia::render('admin/add-blog');
    }

    public function storeBlog(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'reading_time' => 'required|string|max:255',
            'cover_image' => 'nullable|url',
            'content' => 'required|string', 
            'status' => 'required|string|in:Published,Draft'
        ]);

        $id = Str::slug($validated['title']);

        // Since the ui uses structured json blocks, we'll convert markdown/string content to a single paragraph block for now, 
        // to conform to the existing frontend renderer.
        $structuredContent = [
            [
                'type' => 'paragraph',
                'text' => $validated['content']
            ]
        ];

        Blog::create([
            'id' => $id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'reading_time' => $validated['reading_time'],
            'cover_image' => $validated['cover_image'],
            'content' => $structuredContent,
            'status' => $validated['status'],
            'date' => now()->toDateString(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Blog post created successfully');
    }

    public function editBlog($id)
    {
        $blog = Blog::findOrFail($id);
        return Inertia::render('admin/add-blog', [
            'blog' => $blog
        ]);
    }

    public function updateBlog(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'reading_time' => 'required|string|max:255',
            'cover_image' => 'nullable|url',
            'content' => 'required|string',
            'status' => 'required|string|in:Published,Draft'
        ]);

        $structuredContent = [
            [
                'type' => 'paragraph',
                'text' => $validated['content']
            ]
        ];

        $blog->update([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'reading_time' => $validated['reading_time'],
            'cover_image' => $validated['cover_image'],
            'content' => $structuredContent,
            'status' => $validated['status'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Blog post updated successfully');
    }

    public function destroyBlog($id)
    {
        Blog::findOrFail($id)->delete();
        return redirect()->route('dashboard')->with('success', 'Blog post deleted');
    }

    // PROJECT CRUD

    public function createProject()
    {
        return Inertia::render('admin/add-project');
    }

    public function storeProject(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'technologies' => 'required|string', // comma separated string from frontend
            'image' => 'nullable|url',
            'live_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
            'status' => 'required|string'
        ]);

        $id = Str::slug($validated['title']);
        $techArray = array_map('trim', explode(',', $validated['technologies']));

        Project::create(array_merge($validated, [
            'id' => $id,
            'technologies' => $techArray
        ]));

        return redirect()->route('dashboard')->with('success', 'Project created');
    }

    public function editProject($id)
    {
        $project = Project::findOrFail($id);
        return Inertia::render('admin/add-project', [
            'project' => $project
        ]);
    }

    public function updateProject(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'technologies' => 'required|string',
            'image' => 'nullable|url',
            'live_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
            'status' => 'required|string'
        ]);

        $techArray = array_map('trim', explode(',', $validated['technologies']));

        $project->update(array_merge($validated, [
            'technologies' => $techArray
        ]));

        return redirect()->route('dashboard')->with('success', 'Project updated');
    }

    public function destroyProject($id)
    {
        Project::findOrFail($id)->delete();
        return redirect()->route('dashboard')->with('success', 'Project deleted');
    }
}
