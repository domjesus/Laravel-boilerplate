<?php

use App\Models\User;
use Laravel\Cashier\Subscription;

// Get a user to test with
$user = User::first();

if (!$user) {
    echo "No users found. Please create a user first.\n";
    return;
}

echo "Testing subscription creation for user: {$user->email}\n";
echo "User Stripe ID: {$user->stripe_id}\n";

// Test manual subscription creation (simulating what the webhook should do)
$testSubscription = [
    'id' => 'sub_test_' . time(),
    'customer' => $user->stripe_id,
    'status' => 'active',
    'items' => [
        'data' => [
            [
                'id' => 'si_test_' . time(),
                'price' => [
                    'id' => 'price_test_123',
                    'product' => 'prod_test_123'
                ],
                'quantity' => 1
            ]
        ]
    ],
    'trial_end' => null,
    'cancel_at_period_end' => false,
    'current_period_end' => time() + (30 * 24 * 60 * 60) // 30 days from now
];

try {
    // Create subscription directly
    $subscription = $user->subscriptions()->create([
        'name' => 'default',
        'type' => 'default',
        'stripe_id' => $testSubscription['id'],
        'stripe_status' => $testSubscription['status'],
        'stripe_price' => $testSubscription['items']['data'][0]['price']['id'],
        'quantity' => $testSubscription['items']['data'][0]['quantity'],
        'trial_ends_at' => null,
        'ends_at' => null,
    ]);

    echo "Subscription created successfully:\n";
    echo "ID: {$subscription->id}\n";
    echo "Stripe ID: {$subscription->stripe_id}\n";
    echo "Status: {$subscription->stripe_status}\n";

    // Create subscription item
    $subscriptionItem = $subscription->items()->create([
        'stripe_id' => $testSubscription['items']['data'][0]['id'],
        'stripe_product' => $testSubscription['items']['data'][0]['price']['product'],
        'stripe_price' => $testSubscription['items']['data'][0]['price']['id'],
        'quantity' => $testSubscription['items']['data'][0]['quantity'],
    ]);

    echo "Subscription item created successfully:\n";
    echo "ID: {$subscriptionItem->id}\n";
    echo "Stripe ID: {$subscriptionItem->stripe_id}\n";
    echo "Price: {$subscriptionItem->stripe_price}\n";
} catch (Exception $e) {
    echo "Error creating subscription: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
