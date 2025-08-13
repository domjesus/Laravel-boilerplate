
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WhatsappApiSettingController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WhatsappApiWebhookController;
use Inertia\Inertia;
use Laravel\Cashier\Subscription;


// Cashier webhook routes
Route::post('/stripe/webhook', '\Laravel\Cashier\Http\Controllers\WebhookController@handleWebhook');

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/dashboard', function () {
    // $subs = Subscription::all();
    // // $subs->first()->update(['ends_at' => now()->endOfDay(), 'stripe_status' => 'active']);
    // foreach ($subs as $sub) {
    //     $sub->delete();
    // }
    // $items = \DB::table('subscription_items')->get();
    // foreach ($items as $item) {
    //     \DB::table('subscription_items')->where('id', $item->id)->delete();
    // }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Subscription routes
    Route::prefix('subscription')->name('subscription.')->group(function () {
        Route::get('/plans', [SubscriptionController::class, 'index'])->name('plans');
        Route::post('/checkout/{priceId}', [SubscriptionController::class, 'checkout'])->name('checkout');
        Route::get('/success', [SubscriptionController::class, 'success'])->name('success');
        Route::get('/', [SubscriptionController::class, 'show'])->name('show');
        Route::get('/subscriptions', [SubscriptionController::class, 'subscriptions'])->name('subscriptions');
        Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
        Route::post('/resume', [SubscriptionController::class, 'resume'])->name('resume');
        Route::get('/receipts', [SubscriptionController::class, 'receipts'])->name('receipts');
        Route::post('/customer-portal', [SubscriptionController::class, 'customerPortal'])->name('customer-portal');
    });

    // Routes requiring active subscription

});

// Routes restricted to admin and manager roles with active subscription
Route::middleware(['auth', App\Http\Middleware\CheckManagerOrAdmin::class, 'subscription_access'])->group(function () {

    Route::resource('users', UserController::class);
});

require __DIR__ . '/auth.php';

// Admin routes for managing roles and permissions
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('roles-permissions', [\App\Http\Controllers\Admin\RolePermissionController::class, 'index'])->name('admin.roles_permissions.index');
    Route::post('roles', [\App\Http\Controllers\Admin\RolePermissionController::class, 'storeRole'])->name('admin.roles.store');
    Route::put('roles/{role}', [\App\Http\Controllers\Admin\RolePermissionController::class, 'updateRole'])->name('admin.roles.update');
    Route::delete('roles/{role}', [\App\Http\Controllers\Admin\RolePermissionController::class, 'destroyRole'])->name('admin.roles.destroy');
    Route::post('permissions', [\App\Http\Controllers\Admin\RolePermissionController::class, 'storePermission'])->name('admin.permissions.store');
    Route::delete('permissions/{permission}', [\App\Http\Controllers\Admin\RolePermissionController::class, 'destroyPermission'])->name('admin.permissions.destroy');

    // User role management
    Route::post('users/{user}/roles', [\App\Http\Controllers\Admin\RolePermissionController::class, 'assignUserRole'])->name('admin.users.assign_role');
    Route::delete('users/{user}/roles/{role}', [\App\Http\Controllers\Admin\RolePermissionController::class, 'removeUserRole'])->name('admin.users.remove_role');
});
