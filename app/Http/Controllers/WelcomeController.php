<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    protected StripeService $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Display the welcome page with pricing data
     */
    public function index(): Response
    {
        $products = $this->stripeService->getProductsWithPrices();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'pricingPlans' => $products->toArray(),
        ]);
    }
}
