<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AppearanceSetting;
use Illuminate\Http\Request;

class AppearanceSettingController extends Controller
{
    /**
     * Get the appearance settings.
     */
    public function get()
    {
        // Get the first record or create a default one if none exists
        $settings = AppearanceSetting::first() ?? AppearanceSetting::create([
            'primary_color' => '#000000',
            'logo_url' => null,
            'dark_mode' => false,
            'position' => 'bottom-right',
        ]);

        return response()->json($settings);
    }

    /**
     * Update the appearance settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'primary_color' => 'string|max:255',
            'logo_url' => 'nullable|string|max:255',
            'dark_mode' => 'boolean',
            'position' => 'in:bottom-right,bottom-left,top-right,top-left',
        ]);

        $settings = AppearanceSetting::first() ?? new AppearanceSetting();
        $settings->fill($validated);
        $settings->save();

        return response()->json($settings);
    }
}

