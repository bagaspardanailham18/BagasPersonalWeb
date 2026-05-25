<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function welcome()
    {
        return Inertia::render('welcome', [
            'projects' => Project::orderBy('created_at', 'desc')->get(),
            'blogPosts' => Blog::where('status', 'Published')->orderBy('date', 'desc')->get()
        ]);
    }

    public function showProject($id)
    {
        $project = Project::findOrFail($id);
        
        return Inertia::render('project-detail', [
            'project' => $project
        ]);
    }

    public function showBlog($id)
    {
        $blog = Blog::findOrFail($id);
        
        return Inertia::render('blog-detail', [
            'post' => $blog
        ]);
    }
}
