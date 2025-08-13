<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckManagerOrAdmin
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

        if (!$user->hasAnyRole(['admin', 'manager'])) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Admin or Manager role required.'
                ], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Access denied. You need admin or manager privileges to access this page.');
        }

        return $next($request);
    }
}
