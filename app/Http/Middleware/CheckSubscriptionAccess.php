<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->hasRole('admin')) {
            return $next($request);
        }

        // Check if user has an active subscription or is on grace period
        $hasActiveSubscription = $user->subscriptions()
            ->where(function ($query) {
                $query->where('stripe_status', 'active')
                    ->orWhere('stripe_status', 'trialing')
                    ->orWhere(function ($subQuery) {
                        // Grace period check: canceled but ends_at is in the future
                        $subQuery->where('stripe_status', 'canceled')
                            ->whereNotNull('ends_at')
                            ->where('ends_at', '>', now());
                    });
            })->exists();

        if (!$hasActiveSubscription) {
            // Get the feature name from the route for a more specific message
            $featureName = $this->getFeatureNameFromRoute($request->route()->getName());

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => "Access denied. Active subscription required to access {$featureName}.",
                    'redirect' => route('subscription.plans')
                ], 403);
            }

            return redirect()->route('subscription.plans')
                ->with('error', "You need an active subscription to access {$featureName}. Please choose a plan below to continue.")
                ->with('requested_feature', $featureName);
        }

        return $next($request);
    }

    /**
     * Get a user-friendly feature name from the route name
     */
    private function getFeatureNameFromRoute(?string $routeName): string
    {
        if (!$routeName) {
            return 'this feature';
        }

        if (str_contains($routeName, 'leads')) {
            return 'Lead Management';
        }

        if (str_contains($routeName, 'campaigns')) {
            return 'Campaign Management';
        }

        if (str_contains($routeName, 'users')) {
            return 'User Management';
        }

        if (str_contains($routeName, 'customers')) {
            return 'Customer Management';
        }

        return 'this feature';
    }
}
