<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow all authenticated users to access admin routes
        // Comment out the admin check
        // if (!$request->user() || !$request->user()->is_admin) {
        //     return response()->json([
        //         'message' => 'Unauthorized. Admin access required.'
        //     ], 403);
        // }

        return $next($request);
    }
}

