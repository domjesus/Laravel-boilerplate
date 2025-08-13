<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\RoleRequest;
use App\Http\Requests\PermissionRequest;
use Illuminate\Validation\Rule;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->orderBy('name')->get();
        $permissions = Permission::orderBy('name')->get();
        $users = \App\Models\User::with('roles')->orderBy('name')->get();

        return inertia('Admin/RolePermission/Index', compact('roles', 'permissions', 'users'));
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id'
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (!empty($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id'
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroyRole(Role $role)
    {
        // Prevent deletion of admin role
        if ($role->name === 'admin') {
            return redirect()->back()->with('error', 'The admin role cannot be deleted');
        }

        // Check if role is assigned to any users
        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete role that is assigned to users');
        }

        $role->delete();
        return redirect()->back()->with('success', 'Role deleted successfully');
    }

    public function storePermission(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name'
        ]);

        Permission::create(['name' => $validated['name']]);
        return redirect()->back()->with('success', 'Permission created successfully');
    }

    public function destroyPermission(Permission $permission)
    {
        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete permission that is assigned to roles');
        }

        $permission->delete();
        return redirect()->back()->with('success', 'Permission deleted successfully');
    }

    public function assignUserRole(Request $request, \App\Models\User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|integer|exists:roles,id'
        ]);

        $role = Role::findById($validated['role_id']);

        if ($user->hasRole($role->name)) {
            return redirect()->back()->with('error', 'User already has this role');
        }

        $user->assignRole($role);
        return redirect()->back()->with('success', "Role '{$role->name}' assigned to {$user->name}");
    }

    public function removeUserRole(\App\Models\User $user, Role $role)
    {
        if (!$user->hasRole($role->name)) {
            return redirect()->back()->with('error', 'User does not have this role');
        }

        // Prevent removing admin role from the last admin
        if ($role->name === 'admin') {
            $adminCount = \App\Models\User::role('admin')->count();
            if ($adminCount <= 1) {
                return redirect()->back()->with('error', 'Cannot remove admin role from the last admin user');
            }
        }

        $user->removeRole($role);
        return redirect()->back()->with('success', "Role '{$role->name}' removed from {$user->name}");
    }
}
