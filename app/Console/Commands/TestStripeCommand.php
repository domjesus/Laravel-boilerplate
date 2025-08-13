<?php

namespace App\Console\Commands;

use App\Services\StripeService;
use Illuminate\Console\Command;

class TestStripeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stripe:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Stripe API connection and fetch products';

    /**
     * Execute the console command.
     */
    public function handle(StripeService $stripeService)
    {
        $this->info('Testing Stripe API connection...');

        try {
            $products = $stripeService->getProductsWithPrices();

            if ($products->isEmpty()) {
                $this->warn('No products found in Stripe. You may need to create some products in your Stripe dashboard.');
            } else {
                $this->info('Found ' . $products->count() . ' products:');

                foreach ($products as $product) {
                    $this->line('- ' . $product['name'] . ' (ID: ' . $product['id'] . ')');
                    if (isset($product['default_price'])) {
                        $this->line('  Price: ' . $product['default_price']['formatted_amount']);
                    }
                }
            }

            $this->info('Stripe API connection successful!');
        } catch (\Exception $e) {
            $this->error('Error connecting to Stripe: ' . $e->getMessage());
        }
    }
}
