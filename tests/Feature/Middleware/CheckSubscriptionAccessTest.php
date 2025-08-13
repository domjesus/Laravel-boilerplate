<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckSubscriptionAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_subscription_is_redirected_from_leads()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/leads');

        $response->assertRedirect(route('subscription.plans'));
        $response->assertSessionHas('error', 'You need an active subscription to access this feature. Please subscribe to continue.');
    }

    public function test_user_without_subscription_is_redirected_from_campaigns()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/campaigns');

        $response->assertRedirect(route('subscription.plans'));
        $response->assertSessionHas('error', 'You need an active subscription to access this feature. Please subscribe to continue.');
    }

    public function test_user_with_active_subscription_can_access_leads()
    {
        $user = User::factory()->create();

        // Create an active subscription
        $user->subscriptions()->create([
            'name' => 'default',
            'stripe_id' => 'sub_test_123',
            'stripe_status' => 'active',
            'stripe_price' => 'price_test_123',
            'quantity' => 1,
        ]);

        $response = $this->actingAs($user)->get('/leads');

        $response->assertStatus(200);
    }

    public function test_user_with_trialing_subscription_can_access_leads()
    {
        $user = User::factory()->create();

        // Create a trialing subscription
        $user->subscriptions()->create([
            'name' => 'default',
            'stripe_id' => 'sub_test_123',
            'stripe_status' => 'trialing',
            'stripe_price' => 'price_test_123',
            'quantity' => 1,
            'trial_ends_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($user)->get('/leads');

        $response->assertStatus(200);
    }

    public function test_user_with_canceled_subscription_in_grace_period_can_access_leads()
    {
        $user = User::factory()->create();

        // Create a canceled subscription that's still in grace period
        $user->subscriptions()->create([
            'name' => 'default',
            'stripe_id' => 'sub_test_123',
            'stripe_status' => 'canceled',
            'stripe_price' => 'price_test_123',
            'quantity' => 1,
            'ends_at' => now()->addDays(7), // Still in grace period
        ]);

        $response = $this->actingAs($user)->get('/leads');

        $response->assertStatus(200);
    }

    public function test_user_with_expired_subscription_is_redirected_from_leads()
    {
        $user = User::factory()->create();

        // Create an expired subscription
        $user->subscriptions()->create([
            'name' => 'default',
            'stripe_id' => 'sub_test_123',
            'stripe_status' => 'canceled',
            'stripe_price' => 'price_test_123',
            'quantity' => 1,
            'ends_at' => now()->subDays(1), // Already expired
        ]);

        $response = $this->actingAs($user)->get('/leads');

        $response->assertRedirect(route('subscription.plans'));
    }

    public function test_json_request_without_subscription_returns_403()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withHeaders(['Accept' => 'application/json'])
            ->get('/leads');

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Access denied. Active subscription required to access this feature.'
        ]);
    }
}
