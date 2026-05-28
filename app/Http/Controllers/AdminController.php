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
            'cover_image' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile($attribute)) {
                        $file = $request->file($attribute);
                        if (!$file->isValid() || !str_starts_with($file->getMimeType(), 'image/')) {
                            $fail('The ' . $attribute . ' must be a valid image file.');
                        }
                    } elseif (is_string($value) && $value !== '' && !filter_var($value, FILTER_VALIDATE_URL)) {
                        $fail('The ' . $attribute . ' must be a valid URL.');
                    }
                }
            ],
            'content' => 'required|string', 
            'status' => 'required|string|in:Published,Draft',
            'date' => 'required|date'
        ]);

        $id = Str::slug($validated['title']) . '-' . rand(1, 9999);

        $structuredContent = [
            [
                'type' => 'paragraph',
                'text' => $validated['content']
            ]
        ];

        $coverImageUrl = null;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $coverImageUrl = asset('storage/' . $path);
        } else {
            $coverImageUrl = $validated['cover_image'] ?? null;
        }

        Blog::create([
            'id' => $id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'reading_time' => $validated['reading_time'],
            'cover_image' => $coverImageUrl,
            'content' => $structuredContent,
            'status' => $validated['status'],
            'date' => $validated['date'],
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
            'cover_image' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile($attribute)) {
                        $file = $request->file($attribute);
                        if (!$file->isValid() || !str_starts_with($file->getMimeType(), 'image/')) {
                            $fail('The ' . $attribute . ' must be a valid image file.');
                        }
                    } elseif (is_string($value) && $value !== '' && !filter_var($value, FILTER_VALIDATE_URL)) {
                        $fail('The ' . $attribute . ' must be a valid URL.');
                    }
                }
            ],
            'content' => 'required|string',
            'status' => 'required|string|in:Published,Draft',
            'date' => 'required|date'
        ]);

        $structuredContent = [
            [
                'type' => 'paragraph',
                'text' => $validated['content']
            ]
        ];

        $coverImageUrl = $blog->cover_image;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $coverImageUrl = asset('storage/' . $path);
        } elseif (array_key_exists('cover_image', $validated)) {
            $coverImageUrl = $validated['cover_image'];
        }

        $blog->update([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'reading_time' => $validated['reading_time'],
            'cover_image' => $coverImageUrl,
            'content' => $structuredContent,
            'status' => $validated['status'],
            'date' => $validated['date'],
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
            'technologies' => 'required|string',
            'image' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile($attribute)) {
                        $file = $request->file($attribute);
                        if (!$file->isValid() || !str_starts_with($file->getMimeType(), 'image/')) {
                            $fail('The ' . $attribute . ' must be a valid image file.');
                        }
                    } elseif (is_string($value) && $value !== '' && !filter_var($value, FILTER_VALIDATE_URL)) {
                        $fail('The ' . $attribute . ' must be a valid URL.');
                    }
                }
            ],
            'live_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
            'status' => 'required|string'
        ]);

        $id = Str::slug($validated['title']) . '-' . rand(1, 9999);
        $techArray = array_map('trim', explode(',', $validated['technologies']));

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $imageUrl = asset('storage/' . $path);
        } else {
            $imageUrl = $validated['image'] ?? null;
        }

        Project::create([
            'id' => $id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'technologies' => $techArray,
            'image' => $imageUrl,
            'live_url' => $validated['live_url'],
            'repo_url' => $validated['repo_url'],
            'status' => $validated['status'],
        ]);

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
            'image' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile($attribute)) {
                        $file = $request->file($attribute);
                        if (!$file->isValid() || !str_starts_with($file->getMimeType(), 'image/')) {
                            $fail('The ' . $attribute . ' must be a valid image file.');
                        }
                    } elseif (is_string($value) && $value !== '' && !filter_var($value, FILTER_VALIDATE_URL)) {
                        $fail('The ' . $attribute . ' must be a valid URL.');
                    }
                }
            ],
            'live_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
            'status' => 'required|string'
        ]);

        $techArray = array_map('trim', explode(',', $validated['technologies']));

        $imageUrl = $project->image;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $imageUrl = asset('storage/' . $path);
        } elseif (array_key_exists('image', $validated)) {
            $imageUrl = $validated['image'];
        }

        $project->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'technologies' => $techArray,
            'image' => $imageUrl,
            'live_url' => $validated['live_url'],
            'repo_url' => $validated['repo_url'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Project updated');
    }

    public function destroyProject($id)
    {
        Project::findOrFail($id)->delete();
        return redirect()->route('dashboard')->with('success', 'Project deleted');
    }
}
