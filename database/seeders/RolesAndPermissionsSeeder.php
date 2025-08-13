<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            'manage users',
            'manage companies',
            'manage customers',
            'edit campaigns',
            'view reports',
        ];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Admin has all permissions
        $adminRole->givePermissionTo($permissions);

        // Manager has user, company, and customer management permissions
        $managerRole->givePermissionTo(['manage users', 'manage companies', 'manage customers', 'edit campaigns', 'view reports']);

        // User has limited permissions
        $userRole->givePermissionTo(['edit campaigns', 'view reports']);

        // Assign role to first user (example)
        $user = User::first();
        if ($user) {
            $user->assignRole('admin');
        }
    }
}
