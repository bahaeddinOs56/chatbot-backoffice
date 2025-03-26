<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Company;
use Symfony\Component\HttpFoundation\Response;

class IdentifyCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Try to identify company by domain
        $host = $request->getHost();
        $company = Company::where('domain', $host)
            ->where('is_active', true)
            ->first();
            
        // If no company found by domain, check for company_id in request
        if (!$company && $request->has('company_id')) {
            $company = Company::where('id', $request->company_id)
                ->where('is_active', true)
                ->first();
        }
        
        // If still no company found, check for company_slug in request
        if (!$company && $request->has('company_slug')) {
            $company = Company::where('slug', $request->company_slug)
                ->where('is_active', true)
                ->first();
        }
        
        // If no company identified, return 404
        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }
        
        // Add company to request
        $request->attributes->add(['company_id' => $company->id]);
        
        return $next($request);
    }
}

