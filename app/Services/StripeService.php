<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Product;
use Stripe\Price;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Get all active products with their prices
     */
    public function getProductsWithPrices(): Collection
    {
        try {
            // Fetch all active products
            $products = Product::all([
                'active' => true,
                'limit' => 10
            ]);

            $productsWithPrices = collect();

            foreach ($products->data as $product) {
                // Get prices for this product
                $prices = Price::all([
                    'product' => $product->id,
                    'active' => true
                ]);

                // Process prices and find the best ones to display
                $processedPrices = collect($prices->data)->map(function ($price) {
                    return [
                        'id' => $price->id,
                        'amount' => $price->unit_amount,
                        'currency' => $price->currency,
                        'interval' => $price->recurring ? $price->recurring->interval : null,
                        'interval_count' => $price->recurring ? $price->recurring->interval_count : null,
                        'type' => $price->type,
                        'formatted_amount' => $this->formatPrice($price->unit_amount, $price->currency),
                    ];
                });

                $productsWithPrices->push([
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'images' => $product->images ?? [],
                    'metadata' => $product->metadata->toArray(),
                    'prices' => $processedPrices->toArray(),
                    'default_price' => $processedPrices->first(),
                ]);
            }

            return $productsWithPrices;
        } catch (\Exception $e) {
            Log::error('Error fetching Stripe products: ' . $e->getMessage());
            return collect();
        }
    }

    /**
     * Format price for display
     */
    private function formatPrice(int $amount, string $currency): string
    {
        $formatted = number_format($amount / 100, 2);

        switch (strtoupper($currency)) {
            case 'USD':
                return '$' . $formatted;
            case 'EUR':
                return '€' . $formatted;
            case 'GBP':
                return '£' . $formatted;
            case 'BRL':
                return 'R$ ' . $formatted;
            default:
                return strtoupper($currency) . ' ' . $formatted;
        }
    }

    /**
     * Get a specific product with its prices
     */
    public function getProduct(string $productId): ?array
    {
        try {
            $product = Product::retrieve($productId);

            $prices = Price::all([
                'product' => $product->id,
                'active' => true
            ]);

            $processedPrices = collect($prices->data)->map(function ($price) {
                return [
                    'id' => $price->id,
                    'amount' => $price->unit_amount,
                    'currency' => $price->currency,
                    'interval' => $price->recurring ? $price->recurring->interval : null,
                    'interval_count' => $price->recurring ? $price->recurring->interval_count : null,
                    'type' => $price->type,
                    'formatted_amount' => $this->formatPrice($price->unit_amount, $price->currency),
                ];
            });

            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'images' => $product->images ?? [],
                'metadata' => $product->metadata->toArray(),
                'prices' => $processedPrices->toArray(),
                'default_price' => $processedPrices->first(),
            ];
        } catch (\Exception $e) {
            Log::error('Error fetching Stripe product: ' . $e->getMessage());
            return null;
        }
    }
}
