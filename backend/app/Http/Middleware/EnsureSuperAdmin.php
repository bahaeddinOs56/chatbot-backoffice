<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only allow super admins (is_admin=true and no company_id)
        if (!Auth::user() || !Auth::user()->is_admin || Auth::user()->company_id !== null) {
            return response()->json(['message' => 'Unauthorized. Super admin access required.'], 403);
        }

        return $next($request);
    }
}

