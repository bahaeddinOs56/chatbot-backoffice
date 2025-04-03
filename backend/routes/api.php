<?php

use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\QAPairController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TagController;
use App\Http\Controllers\API\UserActivityController;
use App\Http\Controllers\API\QAImportController;
use App\Http\Controllers\API\AppearanceSettingController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\CompanyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware([Cors::class])->group(function () {
Route::get('/test', function (Request $request) {
    Log::info('API test route accessed');
    return response()->json([
        'message' => 'API routes are working',
        'method' => $request->method(),
        'timestamp' => now()->toIso8601String(),
        'data'=>'test'
    ], 200, [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, OPTIONS'
    ]);
});
});

Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');


Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS test successful']);
});
// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Change this line to use AdminController instead of AuthController
Route::post('/admin/login', [AdminController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-auth', [AuthController::class, 'checkAuth']);
    
    // Profile routes
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    
    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Admin auth check
        Route::get('/admin/check-auth', [AuthController::class, 'checkAdminAuth']);
        
        // User management
        Route::apiResource('/admin/users', UserController::class);
        
        // Apply tenant middleware to ensure data isolation
        Route::middleware('tenant')->group(function () {
            // QA Pair management
            Route::apiResource('/admin/qa-pairs', QAPairController::class);
            Route::post('/admin/qa-pairs/bulk-import', [QAPairController::class, 'bulkImport']);
            Route::post('/admin/qa-pairs/bulk-delete', [QAPairController::class, 'bulkDelete']);
            Route::post('/admin/qa-pairs/bulk-toggle', [QAPairController::class, 'bulkToggle']);
            Route::get('/admin/qa-pairs/export', [QAPairController::class, 'export']);
            Route::post('/admin/qa-pairs/search', [QAPairController::class, 'search']);
            Route::put('/admin/qa-pairs/{qaPair}/toggle', [QAPairController::class, 'toggle']);
            Route::get('/admin/qa-pairs/{qaPair}/history', [QAPairController::class, 'history']);
            Route::post('/admin/qa-pairs/{qaPair}/restore', [QAPairController::class, 'restore']);
            
            // Category management
            Route::apiResource('/admin/categories', CategoryController::class);
            Route::get('/admin/categories/tree', [CategoryController::class, 'tree']);
            Route::put('/admin/categories/{category}/move', [CategoryController::class, 'move']);
            
            // Tag management
            Route::apiResource('/admin/tags', TagController::class);
            Route::get('/admin/tags/{tag}/qa-pairs', [TagController::class, 'qaPairs']);
            
            // User activity
            Route::get('/admin/activities', [UserActivityController::class, 'index']);
            Route::get('/admin/activities/{activity}', [UserActivityController::class, 'show']);
            Route::get('/admin/activities/statistics', [UserActivityController::class, 'statistics']);
            
            // Import management
            Route::get('/admin/imports', [QAImportController::class, 'index']);
            Route::get('/admin/imports/{import}', [QAImportController::class, 'show']);
            
            // Appearance settings
            Route::get('/admin/appearance', [AppearanceSettingController::class, 'index']);
            Route::put('/admin/appearance', [AppearanceSettingController::class, 'update']);
        });
        
        // Company management (super admin only)
        Route::middleware('super.admin')->group(function () {
            Route::apiResource('/admin/companies', CompanyController::class);
            Route::put('/admin/companies/{company}/toggle', [CompanyController::class, 'toggle']);
        });
    });
});

// Public API for the chatbot - add company identification middleware
Route::middleware('identify.company')->group(function () {
    Route::get('/chatbot/qa-pairs', [QAPairController::class, 'publicIndex']);
    Route::post('/chatbot/search', [QAPairController::class, 'publicSearch']);
});

