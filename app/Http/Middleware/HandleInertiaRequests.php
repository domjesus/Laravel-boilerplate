<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if ($user) {
            $user->load('roles');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->only(['id', 'name', 'email', 'company_id', 'created_at', 'updated_at', 'email_verified_at']), [
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'guard_name' => $role->guard_name,
                        ];
                    }),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'has_active_subscription' => $user->subscriptions()
                        ->where(function ($query) {
                            $query->where('stripe_status', 'active')
                                ->orWhere('stripe_status', 'trialing')
                                ->orWhere(function ($subQuery) {
                                    // Grace period check: canceled but ends_at is in the future
                                    $subQuery->where('stripe_status', 'canceled')
                                        ->whereNotNull('ends_at')
                                        ->where('ends_at', '>', now());
                                });
                        })->exists(),
                ]) : null,
            ],
        ];
    }
}
