<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PublicController;
use App\Http\Controllers\AdminController;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/project/{id}', [PublicController::class, 'showProject'])->name('project.show');
Route::get('/blog/{id}', [PublicController::class, 'showBlog'])->name('blog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function() {
        // Blog CRUD
        Route::get('add-blog', [AdminController::class, 'createBlog'])->name('blog.create');
        Route::post('blog', [AdminController::class, 'storeBlog'])->name('blog.store');
        Route::get('edit-blog/{id}', [AdminController::class, 'editBlog'])->name('blog.edit');
        Route::put('blog/{id}', [AdminController::class, 'updateBlog'])->name('blog.update');
        Route::delete('blog/{id}', [AdminController::class, 'destroyBlog'])->name('blog.destroy');

        // Project CRUD
        Route::get('add-project', [AdminController::class, 'createProject'])->name('project.create');
        Route::post('project', [AdminController::class, 'storeProject'])->name('project.store');
        Route::get('edit-project/{id}', [AdminController::class, 'editProject'])->name('project.edit');
        Route::put('project/{id}', [AdminController::class, 'updateProject'])->name('project.update');
        Route::delete('project/{id}', [AdminController::class, 'destroyProject'])->name('project.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
