<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for super admins (users with is_admin=true and no company_id)
        if (Auth::user() && Auth::user()->is_admin && Auth::user()->company_id === null) {
            return $next($request);
        }

        // Ensure user has a company
        if (!Auth::user() || !Auth::user()->company_id) {
            return response()->json(['message' => 'Company not assigned to user'], 403);
        }

        // Set company ID in request for controllers to use
        $request->attributes->add(['company_id' => Auth::user()->company_id]);

        return $next($request);
    }
}

