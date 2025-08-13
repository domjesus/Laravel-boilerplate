<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    protected StripeService $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Show subscription plans
     */
    public function index(Request $request)
    {
        $pricingPlans = $this->stripeService->getProductsWithPrices();
        $user = $request->user();

        // Get all user subscriptions
        $subscriptions = $user->subscriptions()->get();
        $userSubscriptions = $subscriptions->map(function ($subscription) {
            return [
                'id' => $subscription->id,
                'stripe_id' => $subscription->stripe_id,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'created_at' => $subscription->created_at,
                'ends_at' => $subscription->ends_at,
                'trial_ends_at' => $subscription->trial_ends_at,
                'canceled' => $subscription->canceled(),
                'active' => $subscription->active(),
                'on_grace_period' => $subscription->onGracePeriod(),
            ];
        });

        return Inertia::render('Subscription/Plans', [
            'pricingPlans' => $pricingPlans,
            'userSubscriptions' => $userSubscriptions,
        ]);
    }

    /**
     * Create a checkout session for a specific price
     */
    public function checkout(Request $request, string $priceId)
    {
        $request->validate([
            'price_id' => 'sometimes|string',
        ]);

        $user = $request->user();

        try {
            // Use the price_id from the route parameter or request
            $finalPriceId = $request->input('price_id', $priceId);

            Log::info('Creating checkout session', [
                'user_id' => $user->id,
                'price_id' => $finalPriceId,
            ]);

            // Ensure user has a Stripe customer ID
            if (!$user->hasStripeId()) {
                $user->createAsStripeCustomer([
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
                Log::info('Created Stripe customer for user: ' . $user->id);
            }

            // Create checkout session
            $checkoutSession = $user->newSubscription('default', $finalPriceId)
                ->checkout([
                    'success_url' => route('subscription.success'),
                    'cancel_url' => route('subscription.plans'),
                    'customer_update' => [
                        'address' => 'auto',
                        'name' => 'auto',
                    ],
                    'metadata' => [
                        'user_id' => $user->id,
                    ],
                ]);

            Log::info('Checkout session created successfully', [
                'session_url' => $checkoutSession->url,
            ]);

            return redirect($checkoutSession->url);
        } catch (\Exception $e) {
            Log::error('Checkout session creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Check if it's a Stripe recurring price error
            if (str_contains($e->getMessage(), 'recurring price')) {
                return back()->withErrors(['error' => 'This pricing plan is not set up for recurring subscriptions. Please contact support or try again later.']);
            }

            return back()->withErrors(['error' => 'Unable to create checkout session. Please try again or contact support.']);
        }
    }

    /**
     * Handle successful subscription
     */
    public function success(Request $request): Response
    {
        return Inertia::render('Subscription/Success', [
            'message' => 'Thank you for your subscription! You can now access all premium features.',
        ]);
    }

    /**
     * Show user's current subscription
     */
    public function show(Request $request)
    {
        // Redirect to the subscriptions list page
        return redirect()->route('subscription.subscriptions');
    }

    public function subscriptions(Request $request): Response
    {
        $user = $request->user();
        $subscriptions = $user->subscriptions()->with('items')->get();

        $subscriptionData = $subscriptions->map(function ($subscription) {
            return [
                'id' => $subscription->id,
                'name' => $subscription->name ?? 'Subscription',
                'stripe_id' => $subscription->stripe_id,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'quantity' => $subscription->quantity,
                'trial_ends_at' => $subscription->trial_ends_at,
                'ends_at' => $subscription->ends_at,
                'created_at' => $subscription->created_at,
                'updated_at' => $subscription->updated_at,
                'canceled' => $subscription->canceled(),
                'active' => $subscription->active(),
                'on_grace_period' => $subscription->onGracePeriod(),
                'recurring' => $subscription->recurring(),
                'ended' => $subscription->ended(),
                'on_trial' => $subscription->onTrial(),
                'items' => $subscription->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'stripe_id' => $item->stripe_id,
                        'stripe_product' => $item->stripe_product,
                        'stripe_price' => $item->stripe_price,
                        'quantity' => $item->quantity,
                    ];
                }),
            ];
        });


        return Inertia::render('Subscription/Subscriptions', [
            'subscriptions' => $subscriptionData,
        ]);
    }

    /**
     * Cancel a subscription
     */

    /**
     * Cancel user's subscription
     */
    public function cancel(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|integer|exists:subscriptions,id',
        ]);

        $user = $request->user();
        $subscription = $user->subscriptions()->find($request->subscription_id);

        if ($subscription && $subscription->active()) {
            $subscription->cancel();
            return back()->with('success', 'Your subscription has been cancelled.');
        }

        return back()->withErrors(['error' => 'No active subscription found or subscription cannot be cancelled.']);
    }

    /**
     * Resume/uncancel user's subscription
     */
    public function resume(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|integer|exists:subscriptions,id',
        ]);

        $user = $request->user();
        $subscription = $user->subscriptions()->find($request->subscription_id);

        if ($subscription && $subscription->canceled() && $subscription->onGracePeriod()) {
            $subscription->resume();
            return back()->with('success', 'Your subscription has been resumed.');
        }

        return back()->withErrors(['error' => 'No cancelled subscription found to resume or subscription has already ended.']);
    }

    /**
     * Show billing history and receipts
     */
    public function receipts(Request $request): Response
    {
        $user = $request->user();

        try {
            // Get invoices from Stripe
            $invoices = [];
            if ($user->hasStripeId()) {
                $stripeInvoices = $user->invoices();
                foreach ($stripeInvoices as $invoice) {
                    $invoices[] = [
                        'id' => $invoice->id,
                        'date' => $invoice->date(),
                        'total' => $invoice->total(),
                        'currency' => strtoupper($invoice->currency),
                        'status' => $invoice->status,
                        'hosted_invoice_url' => $invoice->hosted_invoice_url,
                        'invoice_pdf' => $invoice->invoice_pdf,
                        'number' => $invoice->number,
                    ];
                }
            }

            return Inertia::render('Subscription/Receipts', [
                'invoices' => $invoices,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch receipts', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return Inertia::render('Subscription/Receipts', [
                'invoices' => [],
                'error' => 'Unable to load billing history. Please try again later.',
            ]);
        }
    }

    /**
     * Redirect to Stripe Customer Portal
     */
    public function customerPortal(Request $request)
    {
        $user = $request->user();

        try {
            // Check if user has a Stripe customer ID
            if (!$user->hasStripeId()) {
                return back()->withErrors(['error' => 'You must have an active subscription to access the billing portal.']);
            }

            // Create customer portal session
            $portalSession = $user->redirectToBillingPortal(route('subscription.plans'));

            return $portalSession;
        } catch (\Exception $e) {
            Log::error('Failed to create customer portal session', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->withErrors(['error' => 'Unable to access billing portal. Please try again later.']);
        }
    }
}
