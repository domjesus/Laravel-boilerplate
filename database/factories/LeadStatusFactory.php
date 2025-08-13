<?php

namespace Database\Factories;

use App\Models\LeadStatus;

use Illuminate\Database\Eloquent\Factories\Factory;

class LeadStatusFactory extends Factory
{
    protected $model = LeadStatus::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
        ];
    }
}
