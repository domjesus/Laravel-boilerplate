<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use Carbon\Carbon;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = User::find(1);
$customer = $user->createOrGetStripeCustomer();
$subscriptions = $user->stripe()->subscriptions->all(['customer' => $customer->id]);

foreach ($subscriptions->data as $stripeSubscription) {
    // Check if subscription already exists
    $existingSubscription = $user->subscriptions()->where('stripe_id', $stripeSubscription->id)->first();

    if (!$existingSubscription) {
        $subscription = $user->subscriptions()->create([
            'type' => 'default',
            'stripe_id' => $stripeSubscription->id,
            'stripe_status' => $stripeSubscription->status,
            'stripe_price' => $stripeSubscription->items->data[0]->price->id,
            'quantity' => $stripeSubscription->items->data[0]->quantity,
            'trial_ends_at' => $stripeSubscription->trial_end ? Carbon::createFromTimestamp($stripeSubscription->trial_end) : null,
            'ends_at' => $stripeSubscription->ended_at ? Carbon::createFromTimestamp($stripeSubscription->ended_at) : null,
        ]);

        // Create subscription items
        foreach ($stripeSubscription->items->data as $item) {
            $subscription->items()->create([
                'stripe_id' => $item->id,
                'stripe_product' => $item->price->product,
                'stripe_price' => $item->price->id,
                'quantity' => $item->quantity,
            ]);
        }

        echo "Synced subscription: {$stripeSubscription->id}\n";
    } else {
        echo "Subscription already exists: {$stripeSubscription->id}\n";
    }
}

echo "Total subscriptions in database: " . $user->subscriptions()->count() . "\n";
