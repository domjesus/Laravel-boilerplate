<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Share auth data with roles and permissions globally
        \Inertia\Inertia::share('auth', function () {
            $user = auth()->user();
            return [
                'user' => $user ? array_merge($user->only(['id', 'name', 'email', 'company_id', 'created_at', 'updated_at', 'email_verified_at']), [
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]) : null,
            ];
        });
    }
}
