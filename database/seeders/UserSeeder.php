<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create 5 users
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@email.com',
                'password' => Hash::make('superadmin'),
            ],
            [
                'name' => 'User 2',
                'email' => 'user2@example.com',
                'password' => Hash::make('password2'),
            ],
            [
                'name' => 'User 3',
                'email' => 'user3@example.com',
                'password' => Hash::make('password3'),

            ],
            [
                'name' => 'User 4',
                'email' => 'user4@example.com',
                'password' => Hash::make('password4'),

            ],
            [
                'name' => 'User 5',
                'email' => 'user5@example.com',
                'password' => Hash::make('password5'),

            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
